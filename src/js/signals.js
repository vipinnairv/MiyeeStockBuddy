// ══════════ SIGNAL SCANNER + BACKTEST ══════════
// A moving-average crossover scanner over the holdings you actually own,
// with the backtest attached to every signal.
//
// The scanner half is the familiar idea: compute a short and a long SMA, find
// the bars where they cross, rank by recency. The backtest half is the part
// that is usually missing, and it is the more important one - a crossover on
// its own is a chart annotation, not evidence. Showing "this rule has fired 14
// times on this stock and won 6 of them, returning less than simply holding"
// is the difference between a signal you can judge and one you can only
// believe.
//
// Price history comes through _bmFetchIndex (benchmark.js), which already
// speaks to the owner Worker and drops holiday nulls, and the holdings list
// through _rkHoldings (risk.js). This module adds no new data plumbing.

const SG_SHORT_DEFAULT = 6;    // the pair from the Varsity walkthrough, and a
const SG_LONG_DEFAULT  = 30;   // reasonable swing-trading default either way
const SG_YEARS         = 5;    // enough history for the backtest to mean something

// Bars where the short SMA crosses the long one. The crossover bar is the bar
// where the sign of (short - long) flips, so it needs both SMAs to exist and a
// previous sign to flip from - which is why the first comparable bar never
// counts as a crossover, however far apart the averages already are.
// An exact tie is not a cross: it is skipped, and the sign carries over, so a
// flat touch that resolves back the way it came does not fire a signal.
function _sgCrossovers(closes, shortP, longP) {
  if (!Array.isArray(closes) || closes.length < longP + 1) return [];
  const s = calcSMA(closes, shortP), l = calcSMA(closes, longP);
  const out = [];
  let prev = null;
  for (let i = 0; i < closes.length; i++) {
    if (s[i] == null || l[i] == null) continue;
    const diff = s[i] - l[i];
    if (diff === 0) continue;
    const sign = diff > 0 ? 1 : -1;
    if (prev !== null && sign !== prev) out.push({ i, type: sign > 0 ? 'bullish' : 'bearish' });
    prev = sign;
  }
  return out;
}

// The most recent crossover in a [{d,c}] series, with its age. Age is measured
// from the series' own last bar rather than from today, so a stale feed reads
// as "3 days after the last close I have" instead of silently ageing.
function _sgLatestCrossover(series, shortP, longP) {
  if (!Array.isArray(series) || !series.length) return null;
  const closes = series.map(p => +p.c);
  const xs = _sgCrossovers(closes, shortP, longP);
  if (!xs.length) return null;
  const last = xs[xs.length - 1];
  const bar = series[last.i];
  const s = calcSMA(closes, shortP), l = calcSMA(closes, longP);
  const ms = new Date(series[series.length - 1].d) - new Date(bar.d);
  return {
    type: last.type,
    date: bar.d,
    close: +bar.c,
    short: s[last.i],
    long: l[last.i],
    barsAgo: series.length - 1 - last.i,
    ageDays: isFinite(ms) ? Math.max(0, Math.round(ms / 86400000)) : null,
  };
}

// Long-only replay of the same rule over the same series.
//
// A crossover is only actionable on the NEXT bar: the crossover is confirmed by
// a close, and you cannot trade at a close you have not seen yet. Entering on
// the crossover bar itself is lookahead bias, and it is what makes most
// home-made backtests look better than the rule really is.
//
// Bearish crossovers close the position rather than opening a short one -
// that is how this rule actually gets used on a long-only equity book.
function _sgBacktest(series, shortP, longP) {
  if (!Array.isArray(series) || series.length < longP + 2) return null;
  const closes = series.map(p => +p.c);
  const xs = _sgCrossovers(closes, shortP, longP);
  const trades = [];
  let entry = null;

  xs.forEach(x => {
    const t = x.i + 1;                       // act on the bar after confirmation
    if (t >= series.length) return;          // crossed on the last bar: nothing to act on yet
    if (x.type === 'bullish' && !entry) {
      entry = { i: t, d: series[t].d, p: closes[t] };
    } else if (x.type === 'bearish' && entry) {
      trades.push({
        entryIdx: entry.i, entryDate: entry.d, entryPrice: entry.p,
        exitIdx: t, exitDate: series[t].d, exitPrice: closes[t],
        ret: (closes[t] - entry.p) / entry.p * 100,
      });
      entry = null;
    }
  });

  // A position still open at the end of the data is reported separately and
  // kept out of the win rate: it has not resolved, and counting an unrealised
  // gain as a win is how a losing rule flatters itself.
  let open = null;
  if (entry) {
    const li = series.length - 1;
    open = {
      entryIdx: entry.i, entryDate: entry.d, entryPrice: entry.p,
      exitIdx: li, exitDate: series[li].d, exitPrice: closes[li],
      ret: (closes[li] - entry.p) / entry.p * 100,
    };
  }

  const n = trades.length;
  const wins = trades.filter(t => t.ret > 0).length;
  let eq = 1;
  trades.forEach(t => { eq *= (1 + t.ret / 100); });

  // Buy-and-hold is measured from the first bar the rule could have traded on,
  // not from the start of the data - comparing a strategy that sat out the
  // warm-up period against a hold that did not would flatter the hold.
  const startIdx = Math.min(longP, series.length - 1);
  const endIdx = series.length - 1;
  const buyHold = closes[startIdx] > 0
    ? (closes[endIdx] - closes[startIdx]) / closes[startIdx] * 100 : null;

  // Equity curve: compounds the daily move while a position is open, flat while
  // out. Drawdown measured on that curve is the loss the rule actually put you
  // through, not the stock's own drawdown.
  const inPos = new Array(series.length).fill(false);
  trades.concat(open ? [open] : []).forEach(t => {
    for (let i = t.entryIdx; i <= t.exitIdx && i < series.length; i++) inPos[i] = true;
  });
  let e = 1, peak = 1, maxDD = 0;
  for (let i = 1; i < series.length; i++) {
    if (inPos[i] && closes[i - 1] > 0) e *= closes[i] / closes[i - 1];
    if (e > peak) peak = e;
    const dd = peak > 0 ? (peak - e) / peak * 100 : 0;
    if (dd > maxDD) maxDD = dd;
  }

  return {
    trades, open,
    nTrades: n,
    wins,
    winRate: n ? wins / n * 100 : null,
    avgRet: n ? trades.reduce((s, t) => s + t.ret, 0) / n : null,
    stratRet: n ? (eq - 1) * 100 : null,
    buyHold,
    maxDD,
    from: series[startIdx].d,
    to: series[endIdx].d,
    bars: series.length,
  };
}

// Most recent signal first; holdings the rule has never fired on sink to the
// bottom rather than being dropped, so "no signal" stays visible as an answer.
function _sgRankByRecency(rows) {
  return (Array.isArray(rows) ? rows.slice() : []).sort((a, b) => {
    const as = a && a.signal, bs = b && b.signal;
    if (!as && !bs) return 0;
    if (!as) return 1;
    if (!bs) return -1;
    return as.barsAgo - bs.barsAgo;
  });
}

// ── Plain English ───────────────────────────────────────────────────────────
// "Bullish crossover, 14 trades, 43% win, -12% vs hold" is a sentence only a
// chartist can read. Everyone else needs to be told what happened, when, and
// whether this pattern has ever been worth acting on for this particular
// stock - in words, with the uncertainty attached rather than filed off.

// Below this many past occurrences the track record is noise, not evidence,
// and saying "won 2 of 2, 100%" would be actively misleading.
const SG_MIN_SAMPLE = 3;

function _sgPlainWhen(barsAgo) {
  if (barsAgo === 0) return 'today';
  if (barsAgo === 1) return 'yesterday';
  if (barsAgo <= 5) return barsAgo + ' trading days ago';
  if (barsAgo <= 25) return 'about ' + Math.round(barsAgo / 5) + ' weeks ago';
  return 'about ' + Math.round(barsAgo / 21) + ' months ago';
}

// Two separate facts, deliberately not blended into a single verdict: what the
// price just did, and how much that has been worth knowing on this stock. A
// combined "BUY / AVOID" badge would hide which half the confidence came from.
function _sgPlainVerdict(signal, bt) {
  if (!signal) {
    return {
      word: 'QUIET', col: 'var(--T3)',
      headline: 'No turn either way in this window.',
      record: '', trust: null, trustWord: '', trustCol: 'var(--T3)',
    };
  }
  const up = signal.type === 'bullish';
  const when = _sgPlainWhen(signal.barsAgo);
  const out = {
    word: up ? 'PICKING UP' : 'FADING',
    col: up ? 'var(--G)' : 'var(--R)',
    headline: up
      ? `Its recent average price rose above its longer-term average ${when} - the price has been picking up.`
      : `Its recent average price fell below its longer-term average ${when} - the price has been fading.`,
  };

  const n = bt ? bt.nTrades : 0;
  if (!bt || n < SG_MIN_SAMPLE) {
    out.trust = 'unknown';
    out.trustWord = 'TOO FEW EXAMPLES';
    out.trustCol = 'var(--T3)';
    out.record = `This pattern has only happened ${n === 0 ? 'no' : n} time${n === 1 ? '' : 's'} on this holding in ${SG_YEARS} years, too few to judge whether it means anything here.`;
    return out;
  }
  const diff = (bt.stratRet != null && bt.buyHold != null) ? bt.stratRet - bt.buyHold : null;
  const good = diff != null && diff > 0;
  out.trust = diff == null ? 'unknown' : (good ? 'ok' : 'poor');
  out.trustWord = diff == null ? 'TOO FEW EXAMPLES' : (good ? 'DECENT RECORD HERE' : 'POOR RECORD HERE');
  out.trustCol = diff == null ? 'var(--T3)' : (good ? 'var(--G)' : '#F59E0B');
  const base = `Over ${SG_YEARS} years this pattern happened ${n} times on this holding, and ended in profit ${bt.wins} of those times.`;
  out.record = diff == null ? base
    : good
      ? `${base} Acting on every one of them would have done <b>${Math.abs(diff).toFixed(0)}% better</b> than simply holding the stock and ignoring the signals.`
      : `${base} Acting on every one of them would have done <b>${Math.abs(diff).toFixed(0)}% worse</b> than simply holding the stock and ignoring the signals.`;
  return out;
}

// ── Rendering ───────────────────────────────────────────────────────────────

let _sgCache = null;      // { years, seriesMap } - refetching on every scan would
                          // burn the proxy for no reason; periods change locally
let _sgLast = null;       // last scan's rows, so the view switch repaints without refetching

function _sgPeriods() {
  const gi = id => {
    const el = document.getElementById(id);
    const v = el ? parseInt(el.value, 10) : NaN;
    return isFinite(v) ? v : null;
  };
  let short = gi('sg-short') || SG_SHORT_DEFAULT;
  let long = gi('sg-long') || SG_LONG_DEFAULT;
  if (short < 2) short = 2;
  if (long <= short) long = short + 1;    // a long average must be the longer one
  return { short, long };
}

function _sgFmtPct(v, dp) {
  if (v == null || !isFinite(v)) return '-';
  return (v >= 0 ? '+' : '') + v.toFixed(dp == null ? 1 : dp) + '%';
}

async function scanSignals() {
  const el = document.getElementById('sg-results');
  if (!el) return;
  const sp = (typeof _selfProxyUrl === 'function') ? _selfProxyUrl() : '';
  if (!sp) {
    el.innerHTML = `<div style="font-size:12.5px;color:var(--T3);padding:10px 0">The scanner needs price history, which comes through the data proxy. Deploy the Worker in <code>proxy/README.md</code> and this fills in automatically.</div>`;
    return;
  }
  const hold = (typeof _rkHoldings === 'function') ? _rkHoldings() : [];
  if (!hold.length) {
    el.innerHTML = `<div style="font-size:12.5px;color:var(--T3);padding:10px 0">No priced equity or crypto holdings to scan. Add holdings and set their prices first.</div>`;
    return;
  }

  const { short, long } = _sgPeriods();
  if (!_sgCache) {
    el.innerHTML = `<div style="font-size:12.5px;color:var(--T3);padding:10px 0">Fetching ${SG_YEARS} years of history for ${hold.length} holdings… (first scan only)</div>`;
    const seriesMap = {};
    for (let i = 0; i < hold.length; i += 6) {        // small batches, same as the risk card
      const batch = hold.slice(i, i + 6);
      const got = await Promise.all(batch.map(h => _bmFetchIndex(h.sym, SG_YEARS).catch(() => null)));
      got.forEach((s, j) => { if (Array.isArray(s) && s.length > long + 2) seriesMap[batch[j].key] = s; });
    }
    _sgCache = { seriesMap };
  }
  const seriesMap = _sgCache.seriesMap;

  const rows = hold.map(h => {
    const series = seriesMap[h.key];
    if (!series) return { key: h.key, missing: true };
    return {
      key: h.key,
      signal: _sgLatestCrossover(series, short, long),
      bt: _sgBacktest(series, short, long),
      last: series[series.length - 1],
    };
  });
  renderSignalRows(rows, short, long);
}

function renderSignalRows(rows, short, long) {
  _sgLast = { rows, short, long };
  _sgPaint();
}

// Which of the two views is showing. Plain is the default: the numbers view is
// unreadable to anyone who does not already know what a crossover is, and this
// tab is on the Portfolio Manager side, where most users are investors rather
// than chartists.
function _sgMode() {
  try { return localStorage.getItem('signalsMode') === 'detail' ? 'detail' : 'plain'; }
  catch (e) { return 'plain'; }
}
function setSignalsMode(mode) {
  try { localStorage.setItem('signalsMode', mode === 'detail' ? 'detail' : 'plain'); } catch (e) {}
  const b1 = document.getElementById('sgBtnPlain'), b2 = document.getElementById('sgBtnDetail');
  const plain = mode !== 'detail';
  if (b1) b1.classList.toggle('on', plain);
  if (b2) b2.classList.toggle('on', !plain);
  _sgPaint();
}

function _sgPaint() {
  const el = document.getElementById('sg-results');
  if (!el || !_sgLast) return;
  const { rows, short, long } = _sgLast;
  const ranked = _sgRankByRecency(rows.filter(r => !r.missing));
  const missing = rows.filter(r => r.missing);
  if (!ranked.length) {
    el.innerHTML = `<div style="font-size:12.5px;color:var(--T3);padding:10px 0">Couldn't fetch usable history for any holding just now. Try Scan again.</div>`;
    return;
  }
  el.innerHTML = _sgMode() === 'detail'
    ? _sgDetailHtml(ranked, missing, short, long)
    : _sgPlainHtml(ranked, missing, short, long);
  // Wrap any jargon that survived (Moving Average, Drawdown, ...) in the
  // app's own tap-to-explain popovers.
  try { if (typeof glossaryScan === 'function') glossaryScan(el); } catch (e) {}
}

// One card per holding, in sentences. The two chips say different things on
// purpose: what the price did, and whether that has been worth knowing here.
function _sgPlainHtml(ranked, missing, short, long) {
  const recent = ranked.filter(r => r.signal && r.signal.barsAgo <= 5).length;
  const cards = ranked.map(r => {
    const v = _sgPlainVerdict(r.signal, r.bt);
    const fresh = r.signal && r.signal.barsAgo <= 5;
    return `<div style="border:1px solid var(--bd);border-radius:var(--r3);padding:13px 15px;margin-bottom:9px;${fresh ? 'background:var(--BL)' : ''}">
      <div style="display:flex;align-items:center;gap:9px;flex-wrap:wrap;margin-bottom:6px">
        <span style="font-weight:800;font-size:13.5px;color:var(--T1)">${r.key}</span>
        <span style="font-size:10px;font-weight:800;letter-spacing:.5px;padding:2px 8px;border-radius:20px;color:#fff;background:${v.col}">${v.word}</span>
        ${v.trustWord ? `<span style="font-size:10px;font-weight:800;letter-spacing:.5px;padding:2px 8px;border-radius:20px;border:1px solid ${v.trustCol};color:${v.trustCol}">${v.trustWord}</span>` : ''}
      </div>
      <div style="font-size:12.5px;color:var(--T2);line-height:1.6">${v.headline}</div>
      ${v.record ? `<div style="font-size:12px;color:var(--T3);line-height:1.6;margin-top:5px">${v.record}</div>` : ''}
    </div>`;
  }).join('');

  return `
    <div style="font-size:12.5px;color:var(--T2);line-height:1.65;margin-bottom:12px">
      This checks whether each holding's <b>average price over the last ${short} days</b> has crossed
      its <b>average over the last ${long} days</b>. Crossing upward is the classic hint that a price is
      turning up; crossing down, that it is turning down. It is an old and very simple idea, and on
      plenty of stocks it works no better than doing nothing - so each holding below also shows what
      this pattern has actually been worth on <i>that</i> stock.
    </div>
    <div style="font-size:12.5px;color:var(--T2);margin-bottom:12px">
      Checked <b>${ranked.length}</b> holdings. ${recent
        ? `<b style="color:var(--P)">${recent}</b> turned in the last week or so.`
        : 'None turned in the last week or so.'}
      ${missing.length ? `<span style="color:var(--T3)"> (${missing.length} had no usable price history)</span>` : ''}
    </div>
    ${cards}
    <div style="font-size:11.5px;color:var(--T3);line-height:1.6;margin-top:12px;padding:9px 13px;background:var(--BL);border-radius:var(--r3)">
      <b>How to read this.</b> A signal is not a recommendation, and this app is not investment advice.
      The most useful line on each card is the second one: if acting on this pattern would have done
      <i>worse</i> than simply holding the stock, then the signal is not telling you anything you can
      profit from, however confident the label above it looks. Past behaviour is not a forecast, and the
      comparison ignores brokerage, taxes and slippage, so real trading would come out somewhat worse.
    </div>`;
}

function _sgDetailHtml(ranked, missing, short, long) {
  const recent = ranked.filter(r => r.signal && r.signal.barsAgo <= 5).length;
  const body = ranked.map(r => {
    const s = r.signal, bt = r.bt;
    if (!s) {
      return `<tr><td class="tn">${r.key}</td><td colspan="6" style="color:var(--T3);font-size:11.5px">no crossover in this window</td></tr>`;
    }
    const bull = s.type === 'bullish';
    const col = bull ? 'var(--G)' : 'var(--R)';
    const fresh = s.barsAgo <= 5;
    // The comparison that matters is the rule against doing nothing, so it is
    // coloured on the difference, not on whether the rule made money.
    const beat = (bt && bt.stratRet != null && bt.buyHold != null) ? bt.stratRet - bt.buyHold : null;
    return `<tr${fresh ? ' style="background:var(--BL)"' : ''}>
      <td class="tn">${r.key}</td>
      <td style="color:${col};font-weight:700">${bull ? '▲ Bullish' : '▼ Bearish'}</td>
      <td class="tm">${s.date}</td>
      <td class="r tm">${s.barsAgo === 0 ? 'today' : s.barsAgo + ' bar' + (s.barsAgo === 1 ? '' : 's')}</td>
      <td class="r tm">${s.close.toFixed(2)}</td>
      <td class="r tm">${bt && bt.nTrades ? bt.nTrades + ' · ' + bt.winRate.toFixed(0) + '%' : '-'}</td>
      <td class="r tm" style="color:${beat == null ? 'var(--T3)' : beat >= 0 ? 'var(--G)' : 'var(--R)'};font-weight:600">${
        bt && bt.stratRet != null ? _sgFmtPct(bt.stratRet, 0) + ' vs ' + _sgFmtPct(bt.buyHold, 0) : '-'}</td>
    </tr>`;
  }).join('');

  return `
    <div style="font-size:12.5px;color:var(--T2);margin-bottom:10px">
      Scanned <b>${ranked.length}</b> holdings on the <b>${short}/${long}</b> SMA crossover.
      ${recent ? `<b style="color:var(--P)">${recent}</b> crossed in the last 5 bars.` : 'None crossed in the last 5 bars.'}
      ${missing.length ? ` <span style="color:var(--T3)">(${missing.length} had no usable history)</span>` : ''}
    </div>
    <div class="ts"><table style="min-width:680px">
      <thead><tr>
        <th>Holding</th><th>Signal</th><th>Crossed</th><th class="r">Age</th>
        <th class="r">Close</th><th class="r" title="How many times this rule fired on this stock, and how many of those trades closed in profit">Trades · Win</th>
        <th class="r" title="What following every signal returned, against simply holding the stock over the same period">Rule vs Hold</th>
      </tr></thead>
      <tbody>${body}</tbody>
    </table></div>
    <div style="font-size:11px;color:var(--T3);margin-top:10px;padding:8px 12px;background:var(--BL);border-radius:var(--r3)">
      The backtest replays this rule over ${SG_YEARS} years, buying on the bar <i>after</i> a bullish
      crossover confirms and selling on the bar after a bearish one - never at the crossing close
      itself, which you could not have traded at. It ignores brokerage, STT and slippage, so a real
      account would do somewhat worse than shown. <b>"Rule vs Hold" is the number to read</b>: a rule
      that trades a lot and still trails buy-and-hold is costing you money and attention, however
      good its individual signals look. Past behaviour is not a forecast.
    </div>`;
}

function renderSignals() {
  const el = document.getElementById('sg-results');
  if (!el) return;
  // Reflect the remembered view on the buttons before anything is painted, so
  // the highlighted button and the content below it never disagree.
  const plain = _sgMode() !== 'detail';
  const b1 = document.getElementById('sgBtnPlain'), b2 = document.getElementById('sgBtnDetail');
  if (b1) b1.classList.toggle('on', plain);
  if (b2) b2.classList.toggle('on', !plain);

  const sp = (typeof _selfProxyUrl === 'function') ? _selfProxyUrl() : '';
  if (!sp) {
    el.innerHTML = `<div style="font-size:12.5px;color:var(--T3);padding:10px 0">The scanner needs price history, which comes through the data proxy. Deploy the Worker in <code>proxy/README.md</code> and this fills in automatically.</div>`;
    return;
  }
  if (_sgLast) { _sgPaint(); return; }        // came back to the tab: keep the last scan
  el.innerHTML = `<div style="font-size:12.5px;color:var(--T3);padding:10px 0">Press <b>Scan Holdings</b> above to check your holdings for a change of direction.</div>`;
}

// Periods changed: the cached history is still good, only the maths is stale.
function sgRescan() {
  if (_sgCache) scanSignals();
}
