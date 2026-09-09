#!/usr/bin/env node
/**
 * Assembles index.html from src/.
 *
 * index.html stays the single deployable artifact - that portability is the
 * point of this app. What it no longer has to be is the only place the source
 * lives. Blocks that are cleanly separable move to src/js/ and are stitched
 * back in here.
 *
 *   node build.js          rebuild index.html from src/
 *   node build.js --check   verify index.html matches src/ (used by tests/CI)
 *
 * The build is byte-exact: rebuilding an unmodified tree must reproduce
 * index.html with no diff at all. That is what makes the extraction provably
 * safe rather than a hopeful refactor.
 */
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const TEMPLATE = path.join(ROOT, 'src', 'index.template.html');
const OUT = path.join(ROOT, 'index.html');
const INCLUDE = /^([ \t]*)\/\/ @include ([\w./-]+)[ \t]*$/gm;
// Python sources are embedded as JSON string literals rather than pasted in.
// JSON.stringify escapes anything the file might contain, so a quote or a
// backslash in the Python cannot break out into the surrounding script.
const INCLUDE_PY = /^([ \t]*)\/\/ @include-py (\w+) ([\w./-]+)[ \t]*$/gm;

function build() {
  const tpl = fs.readFileSync(TEMPLATE, 'utf8');
  let missing = [];
  const withPy = tpl.replace(INCLUDE_PY, (_m, indent, name, rel) => {
    const p = path.join(ROOT, 'src', rel);
    if (!fs.existsSync(p)) { missing.push(rel); return _m; }
    // Normalise to \n so the embedded source is identical whatever the
    // checkout's line endings, which keeps the build byte-exact.
    const src = fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n');
    return `${indent}const ${name} = ${JSON.stringify(src)};`;
  });
  const out = withPy.replace(INCLUDE, (_m, indent, rel) => {
    const p = path.join(ROOT, 'src', rel);
    if (!fs.existsSync(p)) { missing.push(rel); return _m; }
    // Files are stored verbatim, including their own indentation, so the
    // rebuild is byte-exact rather than reformatted.
    return fs.readFileSync(p, 'utf8').replace(/\n$/, '');
  });
  if (missing.length) { console.error('Missing include(s):\n  ' + missing.join('\n  ')); process.exit(1); }
  return out;
}

// Data files are copied beside index.html rather than inlined: the company list
// is fetched at runtime, so it has to be a real file the browser can request.
// Both must ship together, which is why --check verifies the copy too.
const DATA = [['src/data/india-stocks.json', 'india-stocks.json']];
function dataPairs() {
  return DATA.map(([from, to]) => ({
    from: path.join(ROOT, from), to: path.join(ROOT, to), rel: to,
    src: fs.existsSync(path.join(ROOT, from)) ? fs.readFileSync(path.join(ROOT, from), 'utf8') : null,
    cur: fs.existsSync(path.join(ROOT, to)) ? fs.readFileSync(path.join(ROOT, to), 'utf8') : null,
  }));
}

const built = build();
const check = process.argv.includes('--check');
const current = fs.existsSync(OUT) ? fs.readFileSync(OUT, 'utf8') : null;
const pairs = dataPairs();
const missingData = pairs.filter(p => p.src === null);
if (missingData.length) {
  console.error('Missing data file(s):\n  ' + missingData.map(p => p.rel).join('\n  '));
  process.exit(1);
}
const staleData = pairs.filter(p => p.cur !== p.src);

if (check) {
  if (staleData.length) {
    console.error('build: data file(s) out of sync with src/. Run `node build.js`.\n  '
      + staleData.map(p => p.rel).join('\n  '));
    process.exit(1);
  }
  if (current === built) { console.log('build: index.html is in sync with src/'); process.exit(0); }
  console.error('build: index.html does NOT match src/. Run `node build.js`.');
  if (current) {
    // Point at the first divergence so the mismatch is actionable.
    const a = current.split('\n'), b = built.split('\n');
    for (let i = 0; i < Math.max(a.length, b.length); i++) {
      if (a[i] !== b[i]) { console.error(`  first difference at line ${i + 1}`);
        console.error(`    index.html: ${JSON.stringify((a[i] || '').slice(0, 90))}`);
        console.error(`    from src/ : ${JSON.stringify((b[i] || '').slice(0, 90))}`); break; }
    }
  }
  process.exit(1);
}

fs.writeFileSync(OUT, built);
staleData.forEach(p => fs.writeFileSync(p.to, p.src));
console.log(current === built ? 'build: index.html unchanged (byte-identical)' : 'build: index.html written');
if (staleData.length) console.log('build: data written -> ' + staleData.map(p => p.rel).join(', '));
