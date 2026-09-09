#!/usr/bin/env node
/**
 * Refreshes src/data/india-stocks.json from the exchanges' own listing files.
 *
 *   npm run stocks:refresh                        download both lists
 *   npm run stocks:refresh -- --nse ./EQUITY_L.csv --bse ./bse.csv
 *                                                 use files already downloaded
 *   npm run stocks:refresh -- --sme ./SME_EQUITY_L.csv
 *                                                 also take the NSE Emerge board
 *   npm run stocks:refresh -- --dry-run           report the changes, write nothing
 *
 * Why a merge rather than a replace. NSE's EQUITY_L.csv carries the symbol, the
 * company name and the ISIN, but no BSE scrip code. BSE's list carries the scrip
 * code but not the NSE symbol. Neither file alone can produce a row, and blindly
 * overwriting with one of them would throw away the other exchange's identifier
 * for 1,978 companies. So rows are matched on ISIN, which both sources publish
 * and which does not change when a company renames itself or switches ticker.
 *
 * A company that appears in neither downloaded file is kept, not deleted: a
 * fetch that half-failed must not silently empty the list. Removals are
 * reported so they can be eyeballed.
 */
const fs = require('fs');
const path = require('path');
const https = require('https');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'src', 'data', 'india-stocks.json');

const NSE_URL = 'https://nsearchives.nseindia.com/content/equities/EQUITY_L.csv';
const BSE_URL = 'https://api.bseindia.com/BseIndiaAPI/api/ListofScripData/w?Group=&Scripcode=&industry=&segment=Equity&status=Active';
const SME_URL = 'https://nsearchives.nseindia.com/emerge/corporates/content/SME_EQUITY_L.csv';

// ── argument parsing ───────────────────────────────────────────────────────
const argv = process.argv.slice(2);
const arg = name => { const i = argv.indexOf('--' + name); return i >= 0 ? argv[i + 1] : null; };
const has = name => argv.includes('--' + name);

// ── a CSV parser that survives quoted commas in company names ──────────────
// "Reliance Industries Ltd, formerly ..." is common enough that splitting on
// commas silently shifts every later column by one.
function parseCSV(text) {
  const rows = [];
  let row = [], field = '', quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"') { if (text[i + 1] === '"') { field += '"'; i++; } else quoted = false; }
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
    else if (c !== '\r') field += c;
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  return rows.filter(r => r.some(f => f.trim() !== ''));
}

function get(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      // NSE refuses requests without a browser-shaped User-Agent.
      headers: { 'User-Agent': 'Mozilla/5.0', 'Accept': '*/*', 'Accept-Language': 'en-US,en;q=0.9' },
      timeout: 45000,
    }, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        res.resume(); return resolve(get(new URL(res.headers.location, url).href));
      }
      if (res.statusCode !== 200) { res.resume(); return reject(new Error('HTTP ' + res.statusCode + ' from ' + url)); }
      let body = '';
      res.setEncoding('utf8');
      res.on('data', d => body += d);
      res.on('end', () => resolve(body));
    });
    req.on('timeout', () => req.destroy(new Error('timed out after 45s: ' + url)));
    req.on('error', reject);
  });
}

const readLocal = p => fs.readFileSync(path.resolve(p), 'utf8');

// ── source readers ─────────────────────────────────────────────────────────
// [{ name, nse, isin, sme }] from an NSE listing file. Handles both the main
// board (EQUITY_L.csv) and the SME board (SME_EQUITY_L.csv), which publish the
// same columns under different header spellings.
function readNSE(text, sme) {
  const rows = parseCSV(text);
  if (!rows.length) throw new Error('NSE file is empty');
  // NSE publishes the main board with spaced headers ("NAME OF COMPANY") and
  // the SME board with underscored ones ("NAME_OF_COMPANY").
  const head = rows[0].map(h => h.trim().toUpperCase().replace(/_/g, ' '));
  const iSym = head.indexOf('SYMBOL');
  const iName = head.findIndex(h => h.startsWith('NAME OF COMPANY'));
  const iSeries = head.indexOf('SERIES');
  const iIsin = head.findIndex(h => h.startsWith('ISIN'));
  if (iSym < 0 || iName < 0 || iIsin < 0) {
    throw new Error('NSE file is missing expected columns; got: ' + head.join(', '));
  }
  const out = [];
  for (const r of rows.slice(1)) {
    const nse = (r[iSym] || '').trim().toUpperCase();
    const name = (r[iName] || '').trim();
    const isin = (r[iIsin] || '').trim().toUpperCase();
    if (!nse || !name) continue;
    // Rights entitlements ride in the same file with a -RE suffix. They are a
    // temporary instrument, not a company, and expire within weeks.
    if (/-RE$/.test(nse)) continue;
    // EQ, BE and BZ are settlement series, not listing status: all three are
    // listed companies a user may search for. Filtering to EQ alone would have
    // hidden 273 of them.
    out.push({ name, nse, isin, sme: !!sme });
  }
  return out;
}

// [{ name, bseCode, isin }] from BSE. Accepts the API's JSON or a CSV export,
// since the endpoint changes shape more often than the file does.
function readBSE(text) {
  const t = text.trim();
  if (t.startsWith('[') || t.startsWith('{')) {
    let j = JSON.parse(t);
    if (!Array.isArray(j)) j = j.Table || j.data || [];
    return j.map(r => ({
      name: String(r.Scrip_Name || r.SCRIP_NAME || r.Issuer_Name || r.FullN || '').trim(),
      bseCode: parseInt(String(r.SCRIP_CD || r.Scrip_Code || r.scrip_cd || ''), 10) || null,
      isin: String(r.ISIN_NUMBER || r.ISIN || r.Isin_No || '').trim().toUpperCase(),
    })).filter(r => r.bseCode && r.isin);
  }
  const rows = parseCSV(t);
  const head = rows[0].map(h => h.trim().toUpperCase());
  const iCode = head.findIndex(h => /SECURITY\s*CODE|SCRIP\s*CODE/.test(h));
  const iName = head.findIndex(h => /ISSUER\s*NAME|SECURITY\s*NAME|SCRIP\s*NAME/.test(h));
  const iIsin = head.findIndex(h => h.includes('ISIN'));
  if (iCode < 0 || iIsin < 0) throw new Error('BSE file is missing expected columns; got: ' + head.join(', '));
  return rows.slice(1).map(r => ({
    name: (r[iName] || '').trim(),
    bseCode: parseInt((r[iCode] || '').trim(), 10) || null,
    isin: (r[iIsin] || '').trim().toUpperCase(),
  })).filter(r => r.bseCode && r.isin);
}

// ── merge ──────────────────────────────────────────────────────────────────
// Row shape: [name, nseSymbol, bseSymbol, bseCode, isin] with an optional
// sixth element 'SME' for NSE Emerge listings. The sixth is additive, so
// everything that reads indexes 0 to 4 is unaffected.
function merge(existing, nse, bse) {
  const byIsin = new Map();
  const bySym = new Map();
  for (const r of existing) {
    if (r[4]) byIsin.set(r[4], r);
    bySym.set(r[1], r);
  }
  const bseByIsin = new Map(bse.map(b => [b.isin, b]));

  let added = 0, updated = 0;
  const seen = new Set();

  for (const s of nse) {
    const prior = (s.isin && byIsin.get(s.isin)) || bySym.get(s.nse) || null;
    const b = s.isin ? bseByIsin.get(s.isin) : null;
    const row = prior
      ? [s.name || prior[0], s.nse, prior[2] === prior[1] ? s.nse : prior[2],
         b ? b.bseCode : prior[3], s.isin || prior[4]]
      : [s.name, s.nse, s.nse, b ? b.bseCode : null, s.isin];
    if (s.sme) row[5] = 'SME'; else if (row.length > 5) row.length = 5;
    if (prior) {
      if (JSON.stringify(prior) !== JSON.stringify(row)) updated++;
      const i = existing.indexOf(prior);
      existing[i] = row;
    } else { existing.push(row); added++; }
    seen.add(row[1]);
  }

  // A company that changed ticker and has no ISIN on file matches on neither
  // key, so it survives the merge under its old symbol beside its new one:
  // BRAINBEES sat next to FIRSTCRY, both Brainbees Solutions, and the stale
  // one resolves to a Yahoo symbol that no longer exists. Where an orphan's
  // company name is the same as a row that did match, it is the old identity
  // of that row and is dropped.
  const norm = n => String(n).toLowerCase()
    .replace(/\([^)]*\)/g, ' ')                 // "(FirstCry)"
    .replace(/\b(ltd|limited|the|inc|corp)\b/g, ' ')
    .replace(/[^a-z0-9]+/g, ' ').trim();
  const keptNames = new Map();
  existing.forEach(r => { if (seen.has(r[1])) keptNames.set(norm(r[0]), r[1]); });

  const superseded = [];
  const orphans = [];
  for (const r of existing) {
    if (seen.has(r[1])) continue;
    const now = keptNames.get(norm(r[0]));
    if (now && now !== r[1]) superseded.push({ old: r[1], now, name: r[0] });
    else orphans.push(r);
  }
  const supersededSyms = new Set(superseded.map(s2 => s2.old));
  const rows = existing.filter(r => !supersededSyms.has(r[1]));

  // Everything else the NSE file no longer lists is reported, never deleted
  // here: a truncated download would otherwise wipe companies out with no way
  // back, and a name may still be listed on BSE.
  return { rows, added, updated, gone: orphans, superseded };
}

(async () => {
  try {
    const existing = JSON.parse(fs.readFileSync(OUT, 'utf8'));
    console.log(`current list: ${existing.length} companies`);

    const nseSrc = arg('nse');
    const bseSrc = arg('bse');

    console.log(nseSrc ? `reading NSE from ${nseSrc}` : `downloading NSE list…`);
    const nse = readNSE(nseSrc ? readLocal(nseSrc) : await get(NSE_URL), false);
    console.log(`  NSE main board: ${nse.length} listings`);

    // NSE Emerge, the SME board. Optional: these are real listed companies but
    // they trade in large lots on thin volume, so they are marked as SME rather
    // than mixed in indistinguishably.
    const smeSrc = arg('sme');
    if (smeSrc || has('sme-download')) {
      const smeRows = readNSE(smeSrc ? readLocal(smeSrc) : await get(SME_URL), true);
      console.log(`  NSE Emerge (SME): ${smeRows.length} listings`);
      nse.push(...smeRows);
    }

    let bse = [];
    try {
      console.log(bseSrc ? `reading BSE from ${bseSrc}` : `downloading BSE list…`);
      bse = readBSE(bseSrc ? readLocal(bseSrc) : await get(BSE_URL));
      console.log(`  BSE: ${bse.length} scrips`);
    } catch (e) {
      // BSE only supplies the scrip code. Without it the existing codes are
      // kept, so the refresh is still worth doing.
      console.log(`  BSE: skipped (${e.message}). Existing BSE codes are kept.`);
    }

    const { rows, added, updated, gone, superseded } = merge(existing, nse, bse);
    rows.sort((a, b) => a[0].toLowerCase().localeCompare(b[0].toLowerCase()));

    console.log(`\n${added} added, ${updated} updated, ${rows.length} total`);
    if (superseded.length) {
      console.log(`\n${superseded.length} renamed, old symbol dropped:`);
      superseded.forEach(s2 => console.log(`   ${s2.old} -> ${s2.now}   ${s2.name}`));
    }
    if (gone.length) {
      console.log(`\n${gone.length} in the file but not in today's NSE list (kept, check them):`);
      gone.slice(0, 40).forEach(r => console.log(`   ${r[1]}  ${r[0]}`));
      if (gone.length > 40) console.log(`   … and ${gone.length - 40} more`);
    }

    if (has('dry-run')) { console.log('\n--dry-run: nothing written'); return; }
    const body = rows.map(r => JSON.stringify(r)).join(',\n');
    fs.writeFileSync(OUT, '[\n' + body + '\n]\n');
    console.log(`\nwrote ${path.relative(ROOT, OUT)}`);
    console.log('now run:  node build.js');
  } catch (e) {
    console.error('\nrefresh failed: ' + e.message);
    console.error('\nIf the download was blocked, fetch the files in a browser and pass them in:');
    console.error('  ' + NSE_URL);
    console.error('  npm run stocks:refresh -- --nse ./EQUITY_L.csv');
    process.exit(1);
  }
})();
