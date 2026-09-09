// ══════════ LEARN ACADEMY: PROGRESS TRACKING ══════════
// Carries over what MiyeeLearn does for its courses (mark a lesson viewed, a
// quiz per unit, a certificate at the end) into an app that has no accounts
// here: the Learn tab is open to anyone, so there is nobody to key progress to.
// It therefore lives in localStorage, which means it belongs to the browser
// rather than to the person. Two consequences the UI states rather than hides:
// it does not follow the reader to another device, and clearing site data ends
// it. Everything reads through _lpLoad(), which returns a valid shape whatever
// it finds, so a corrupted or absent record costs a reset and never a crash.

const LP_KEY = 'miyeeLearnProgress_v1';
const LP_PASS = 2;                       // out of three, to clear a quick check

function _lpBlank() { return { v: 1, done: {}, quiz: {}, last: null, days: [] }; }

function _lpLoad() {
  let raw = null;
  try { raw = localStorage.getItem(LP_KEY); } catch (e) { return _lpBlank(); }
  if (!raw) return _lpBlank();
  let p;
  try { p = JSON.parse(raw); } catch (e) { return _lpBlank(); }
  if (!p || typeof p !== 'object') return _lpBlank();
  const b = _lpBlank();
  return {
    v: 1,
    done: (p.done && typeof p.done === 'object') ? p.done : b.done,
    quiz: (p.quiz && typeof p.quiz === 'object') ? p.quiz : b.quiz,
    last: typeof p.last === 'string' ? p.last : null,
    days: Array.isArray(p.days) ? p.days.filter(d => typeof d === 'string') : [],
  };
}

function _lpSave(p) {
  // A quota error or a browser with site data blocked must not break reading
  // the guide, so a failed write is swallowed and the session simply keeps
  // whatever is in memory.
  try { localStorage.setItem(LP_KEY, JSON.stringify(p)); return true; }
  catch (e) { return false; }
}

const _lpToday = () => new Date().toISOString().slice(0, 10);

function _lpTouchDay(p) {
  const d = _lpToday();
  if (p.days.indexOf(d) < 0) p.days.push(d);
  if (p.days.length > 400) p.days = p.days.slice(-400);
}

// Consecutive days ending today or yesterday. A streak that ended earlier is
// reported as zero rather than as a stale number.
function _lpStreak(days) {
  if (!days || !days.length) return 0;
  const set = new Set(days);
  const day = new Date();
  const key = d => d.toISOString().slice(0, 10);
  if (!set.has(key(day))) {
    day.setDate(day.getDate() - 1);
    if (!set.has(key(day))) return 0;
  }
  let n = 0;
  while (set.has(key(day))) { n++; day.setDate(day.getDate() - 1); }
  return n;
}

// ── the sections progress is measured against ──────────────────────────────
// Derived from the rendered page rather than from LEARN_BLOCKS, so a section
// that is added, renamed or removed is counted correctly with no second list
// to keep in step.
function _lpSections() {
  return [...document.querySelectorAll('#learn-body .ln-grp[data-gid]')]
    .map(g => ({ id: g.dataset.gid, part: _lpPartNum(g.closest('.ln-part')),
                 title: (g.querySelector('.ln-h2') || {}).textContent || '' }))
    .filter(s => s.part);
}
// A part is identified by the number in its own heading, never by its position
// in the DOM. Contents also renders as a top-level section, so counting by
// index made it Part 1 and hung Part 1's quiz on the table of contents.
function _lpPartNum(sec) {
  if (!sec) return null;
  const h = sec.querySelector('.ln-h1');
  const m = h && /^Part\s+(\d+)\./.exec(h.textContent || '');
  return m ? m[1] : null;
}
function _lpParts() {
  return [...document.querySelectorAll('#learn-body .ln-part')]
    .map(p => ({ id: _lpPartNum(p), el: p, title: (p.querySelector('.ln-h1') || {}).textContent || '' }))
    .filter(p => p.id);
}

function _lpStats() {
  const p = _lpLoad(), secs = _lpSections();
  const done = secs.filter(s => p.done[s.id]).length;
  // Only parts that actually carry a quick check are counted, so the total can
  // never claim more quizzes than exist.
  const parts = _lpParts().filter(pt => LEARN_QUIZ[pt.id]);
  const quizzes = parts.length;
  const passed = parts.filter(pt => (p.quiz[pt.id] || {}).best >= LP_PASS).length;
  return { p, secs, done, total: secs.length, parts, quizzes, passed,
           pct: secs.length ? Math.round(done / secs.length * 100) : 0,
           complete: secs.length > 0 && done === secs.length && passed === quizzes };
}

// ── quick checks ───────────────────────────────────────────────────────────
// Three questions per part, answerable from that part alone. The thresholds
// are the app's own, so a reader who passes these has learned the numbers the
// reports actually use.
const LEARN_QUIZ = {
  '1': [
    { q: 'A share price rises. What has to be true?',
      a: ['The company announced higher profits', 'Buyers were more eager than sellers', 'The RBI cut rates', 'The company issued more shares'], c: 1,
      why: 'The price is simply where the last buyer and seller agreed. News and rates matter only because they change how eager the two sides are.' },
    { q: 'The RBI raises the repo rate. What usually happens to share prices, all else equal?',
      a: ['They rise', 'They fall', 'Nothing changes', 'Only bank shares move'], c: 1,
      why: 'Borrowing costs more, so companies expand less and future profits are expected to be smaller. Fixed deposits also start paying more, which pulls some money out of shares.' },
    { q: 'Crude oil spikes. Which business feels it most directly?',
      a: ['An airline', 'A software exporter', 'A private bank', 'A cement retailer'], c: 0,
      why: 'Jet fuel is an airline’s single largest cost. Paints and tyres are hit through raw materials for the same reason.' },
  ],
  '2': [
    { q: 'A company reports ROE of 100 percent and ROCE of 20 percent. What does the gap say?',
      a: ['Exceptional management', 'Borrowed money is doing the work', 'The share is cheap', 'The company holds a lot of cash'], c: 1,
      why: 'ROE counts profit on the owners’ money only. A large gap over ROCE means the returns are being magnified by debt, which cuts both ways.' },
    { q: 'Profits rise every year, but operating cash flow does not follow. Which do you believe?',
      a: ['The profit, it is audited', 'The cash', 'Neither, wait for the next quarter', 'Whichever the management explains'], c: 1,
      why: 'Profit is an opinion formed under accounting rules; cash is a fact. Many well known failures showed this gap years before the price collapsed.' },
    { q: 'A share trades at a P/E of 8. What does that tell you?',
      a: ['It is cheap', 'It is expensive', 'Nothing on its own', 'Profits are growing'], c: 2,
      why: 'A low P/E is a question, not an answer. Ask why the market will not pay more, and compare only against the same sector and the company’s own history.' },
  ],
  '3': [
    { q: 'A candle closes with a long lower wick. What happened during the day?',
      a: ['Sellers pushed price down and buyers hauled it back', 'Buyers pushed up and were beaten back', 'Nothing traded for most of the day', 'The stock gapped down at the open'], c: 0,
      why: 'The wick marks ground taken and then lost. A long lower wick says somebody with money was willing to defend that level.' },
    { q: 'A symmetrical triangle has formed. Which way will price break?',
      a: ['Up, it is a bullish pattern', 'Down, it is a bearish pattern', 'The pattern does not tell you', 'Whichever way the last candle points'], c: 2,
      why: 'A symmetrical triangle measures compression, not direction. Anyone calling it bullish in advance is guessing.' },
    { q: 'When is a breakout worth acting on?',
      a: ['The moment price touches the level intraday', 'On a daily close above it, on volume above the recent average', 'After three closes above it', 'Whenever RSI is above 70'], c: 1,
      why: 'Waiting for the close filters out intraday pokes, and the volume is what separates a real breakout from a trap.' },
  ],
  '4': [
    { q: 'ADX is reading 14. What does this guide advise?',
      a: ['Buy, the trend is starting', 'Sell, the trend is ending', 'Hold and do nothing', 'Ignore ADX and follow MACD'], c: 2,
      why: 'Below 20 the market is choppy. Breakouts fail and crossovers whipsaw, so doing nothing is usually the winning position.' },
    { q: 'RSI has sat above 70 for three weeks while price keeps climbing. What does that mean?',
      a: ['A crash is due', 'The trend is strong; overbought means stretched, not finished', 'The reading is broken', 'Volume must be falling'], c: 1,
      why: 'In a genuinely strong trend RSI can stay above 70 for weeks. Selling on the 70 cross alone is a reliable way to exit a good position far too early.' },
    { q: 'You buy at 1,000 rupees and ATR is 25 rupees. Where does a sensible stop sit?',
      a: ['990', '950', '900', '700'], c: 1,
      why: 'Roughly 1.5 to 3 times ATR from entry, so 2x ATR puts the stop at 950. A stop at 990 is inside one ordinary day of movement.' },
  ],
  '5': [
    { q: 'What does the buyer of an option risk?',
      a: ['Unlimited loss', 'Only the premium paid', 'The full contract value', 'The margin plus the premium'], c: 1,
      why: 'The buyer is the one taking out insurance: a known, limited cost for a large possible gain. The seller carries the large risk.' },
    { q: 'You hold a position with five times leverage and the price moves 20 percent against you. What happens?',
      a: ['You lose 20 percent of your capital', 'You lose 4 percent', 'Your capital is wiped out', 'Nothing until expiry'], c: 2,
      why: 'Leverage multiplies the move against your own money. Losses are settled continuously, so a margin call forces you out at the worst moment.' },
    { q: 'In India, as things stand, losses on cryptocurrency can be set off against other gains.',
      a: ['True', 'False'], c: 1,
      why: 'Gains are taxed at a flat 30 percent with 1 percent TDS, and losses cannot be set off. An active trader can pay tax on winners with no relief for losers.' },
  ],
  '6': [
    { q: 'You risk 2 percent of your capital per idea and are wrong ten times in a row. Roughly what is left?',
      a: ['About 80 percent', 'About 50 percent', 'About 20 percent', 'Nothing'], c: 0,
      why: 'Small, fixed risk is what lets you survive a bad run. At 25 percent per idea, four mistakes would end you.' },
    { q: 'Price approaches your stop and you move the stop further away. What have you done?',
      a: ['Given the trade room to work', 'Managed the position actively', 'Abandoned your stop loss', 'Reduced your risk'], c: 2,
      why: 'A stop you move away as price approaches is not a stop loss, it is a wish. Place it where the setup is proved wrong and then honour it.' },
    { q: 'Below which risk to reward ratio does this guide say a trade is usually not worth taking?',
      a: ['1 to 1', '1 to 1.5', '1 to 3', '1 to 5'], c: 1,
      why: 'Below 1 to 1.5 the odds do not pay for being wrong. At 1 to 3 you can be right less than half the time and still make money.' },
  ],
};

// ── rendering ──────────────────────────────────────────────────────────────
function _lpEsc(s) { return (typeof _lnEsc === 'function') ? _lnEsc(s) : String(s); }

function renderLearnPanel() {
  const el = document.getElementById('learn-progress');
  if (!el) return;
  const st = _lpStats();
  const streak = _lpStreak(st.p.days);
  const resume = st.p.last && document.getElementById(st.p.last);
  el.innerHTML =
    '<div class="lp-top">'
      + '<div class="lp-h">Your progress</div>'
      + '<div class="lp-acts">'
        + (resume ? '<button type="button" class="lp-btn lp-btn-go" onclick="learnResume()">Resume reading</button>' : '')
        + '<button type="button" class="lp-btn" onclick="learnResetProgress()">Reset</button>'
      + '</div>'
    + '</div>'
    + '<div class="lp-bar"><span style="width:' + st.pct + '%"></span></div>'
    + '<div class="lp-stats">'
      + '<span><b>' + st.done + '</b> of ' + st.total + ' sections read</span>'
      + '<span><b>' + st.passed + '</b> of ' + st.quizzes + ' quick checks cleared</span>'
      + (streak ? '<span><b>' + streak + '</b> day' + (streak === 1 ? '' : 's') + ' in a row</span>' : '')
    + '</div>'
    + (st.complete ? _lpCertificate(st) : '')
    + '<div class="lp-note">Saved in this browser only. It will not follow you to another device, and clearing site data clears it.</div>';
}

function _lpCertificate(st) {
  const p = st.p;
  const when = p.days.length ? p.days[p.days.length - 1] : _lpToday();
  const d = new Date(when + 'T00:00:00');
  const nice = isNaN(d) ? when : d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  return '<div class="lp-cert" id="learn-certificate">'
    + '<div class="lp-cert-k">Course complete</div>'
    + '<div class="lp-cert-t">The Learn Academy</div>'
    + '<div class="lp-cert-b">All ' + st.total + ' sections read and all ' + st.quizzes
    + ' quick checks cleared on ' + _lpEsc(nice) + '.</div>'
    + '<div class="lp-cert-s">This records your own reading in this browser. It is not a qualification, '
    + 'and it is not a licence to trade with money you cannot afford to lose.</div>'
    + '<button type="button" class="lp-btn lp-btn-go" onclick="window.print()">Print this</button>'
    + '</div>';
}

// The per-section control and the per-part quick check are injected after the
// guide renders, so learn.js stays a renderer of content and knows nothing
// about progress.
function learnProgressInit() {
  const body = document.getElementById('learn-body');
  if (!body || body.dataset.lp === '1') return;
  const p = _lpLoad();

  _lpSections().forEach(sec => {
    const g = body.querySelector('.ln-grp[data-gid="' + sec.id + '"]');
    if (!g || g.querySelector('.lp-mark')) return;
    const f = document.createElement('div');
    f.className = 'lp-foot';
    f.innerHTML = '<button type="button" class="lp-mark" data-gid="' + _lpEsc(sec.id) + '"'
      + ' onclick="learnToggleDone(this.dataset.gid)"></button>';
    g.appendChild(f);
  });

  _lpParts().forEach(part => {
    const qs = LEARN_QUIZ[part.id];
    if (!qs) return;
    const sec = part.el;
    if (!sec || sec.querySelector('.lp-quiz')) return;
    const d = document.createElement('div');
    d.className = 'lp-quiz';
    d.dataset.part = part.id;
    sec.appendChild(d);
    _lpRenderQuiz(part.id);
  });

  body.dataset.lp = '1';
  _lpSyncMarks();
  renderLearnPanel();
  _lpWatchScroll();
}

function _lpSyncMarks() {
  const p = _lpLoad();
  document.querySelectorAll('#learn-body .lp-mark').forEach(b => {
    const on = !!p.done[b.dataset.gid];
    b.classList.toggle('on', on);
    b.textContent = on ? '✓  Read' : 'Mark as read';
    b.setAttribute('aria-pressed', on ? 'true' : 'false');
    const g = b.closest('.ln-grp');
    if (g) g.classList.toggle('lp-done', on);
  });
  // The contents rail shows the same state, so a reader can see at a glance
  // what is left without scrolling the guide.
  const all = _lpSections();
  _lpParts().forEach(pt => {
    const secs = all.filter(s => s.part === pt.id);
    if (!secs.length) return;
    const done = secs.filter(s => p.done[s.id]).length;
    const h1 = pt.el.querySelector('.ln-h1');
    const link = h1 && document.querySelector('#learn-toc a[href="#' + h1.id + '"]');
    if (link) {
      let tag = link.querySelector('.lp-cnt');
      if (!tag) { tag = document.createElement('span'); tag.className = 'lp-cnt'; link.appendChild(tag); }
      tag.textContent = done + '/' + secs.length;
      tag.classList.toggle('all', secs.length > 0 && done === secs.length);
    }
  });
  document.querySelectorAll('#learn-toc a.ln-toc-b').forEach(a => {
    const id = a.getAttribute('href').slice(1);
    a.classList.toggle('lp-read', !!p.done[id]);
  });
}
function learnToggleDone(gid) {
  const p = _lpLoad();
  if (p.done[gid]) delete p.done[gid];
  else { p.done[gid] = Date.now(); _lpTouchDay(p); }
  _lpSave(p);
  _lpSyncMarks();
  renderLearnPanel();
}

function learnResume() {
  const p = _lpLoad();
  if (p.last && typeof learnGoto === 'function') learnGoto(p.last);
}

function learnResetProgress() {
  if (!window.confirm('Clear your reading progress and quick check scores in this browser? This cannot be undone.')) return;
  try { localStorage.removeItem(LP_KEY); } catch (e) {}
  document.querySelectorAll('#learn-body .lp-quiz').forEach(d => {
    delete d.dataset.state;
    _lpRenderQuiz(d.dataset.part);
  });
  _lpSyncMarks();
  renderLearnPanel();
}

// ── quick check rendering ──────────────────────────────────────────────────
const _LP_ANSWERS = {};          // in-flight selections, not persisted

function _lpRenderQuiz(partId) {
  const host = document.querySelector('#learn-body .lp-quiz[data-part="' + partId + '"]');
  if (!host) return;
  const qs = LEARN_QUIZ[partId] || [];
  const p = _lpLoad();
  const best = (p.quiz[partId] || {}).best;
  const sel = _LP_ANSWERS[partId] || {};
  const marked = host.dataset.state === 'marked';

  let h = '<div class="lp-quiz-h"><span>Quick check</span>'
    + (best != null ? '<span class="lp-quiz-best">Best ' + best + ' of ' + qs.length + '</span>' : '')
    + '</div>'
    + '<p class="lp-quiz-i">Three questions on this part. Answer them to find out what stuck, not to be graded: '
    + 'the explanation is shown either way, and you can retake it as often as you like.</p>';

  qs.forEach((q, i) => {
    h += '<div class="lp-q"><div class="lp-q-t">' + (i + 1) + '. ' + _lpEsc(q.q) + '</div>';
    q.a.forEach((opt, j) => {
      const chosen = sel[i] === j;
      let cls = 'lp-opt';
      if (marked) {
        if (j === q.c) cls += ' right';
        else if (chosen) cls += ' wrong';
      } else if (chosen) cls += ' sel';
      h += '<button type="button" class="' + cls + '" ' + (marked ? 'disabled' : '')
        + ' onclick="learnQuizPick(\'' + partId + '\',' + i + ',' + j + ')">'
        + '<span class="lp-opt-b">' + String.fromCharCode(65 + j) + '</span>' + _lpEsc(opt)
        + (marked && j === q.c ? '<span class="lp-opt-tag">Correct</span>' : '')
        + (marked && chosen && j !== q.c ? '<span class="lp-opt-tag">Your answer</span>' : '')
        + '</button>';
    });
    if (marked) h += '<div class="lp-why">' + _lpEsc(q.why) + '</div>';
    h += '</div>';
  });

  if (marked) {
    const score = qs.reduce((n, q, i) => n + (sel[i] === q.c ? 1 : 0), 0);
    h += '<div class="lp-result ' + (score >= LP_PASS ? 'ok' : 'no') + '">'
      + '<b>' + score + ' of ' + qs.length + '</b> '
      + (score >= LP_PASS ? 'cleared. ' : 'Not cleared yet, ' + LP_PASS + ' of ' + qs.length + ' clears it. ')
      + '<button type="button" class="lp-btn" onclick="learnQuizRetake(\'' + partId + '\')">Try again</button></div>';
  } else {
    const answered = Object.keys(sel).length;
    h += '<div class="lp-result"><button type="button" class="lp-btn lp-btn-go"'
      + (answered < qs.length ? ' disabled' : '')
      + ' onclick="learnQuizSubmit(\'' + partId + '\')">Check answers</button>'
      + '<span class="lp-quiz-n">' + answered + ' of ' + qs.length + ' answered</span></div>';
  }
  host.innerHTML = h;
}

function learnQuizPick(partId, qi, choice) {
  _LP_ANSWERS[partId] = _LP_ANSWERS[partId] || {};
  _LP_ANSWERS[partId][qi] = choice;
  _lpRenderQuiz(partId);
}

function learnQuizSubmit(partId) {
  const qs = LEARN_QUIZ[partId] || [];
  const sel = _LP_ANSWERS[partId] || {};
  if (Object.keys(sel).length < qs.length) return;
  const score = qs.reduce((n, q, i) => n + (sel[i] === q.c ? 1 : 0), 0);
  const p = _lpLoad();
  const prev = (p.quiz[partId] || {}).best;
  // Only the best attempt is kept, so retaking to learn can never cost a pass
  // already earned.
  p.quiz[partId] = { best: Math.max(prev == null ? -1 : prev, score), of: qs.length, at: Date.now() };
  _lpTouchDay(p);
  _lpSave(p);
  const host = document.querySelector('#learn-body .lp-quiz[data-part="' + partId + '"]');
  if (host) host.dataset.state = 'marked';
  _lpRenderQuiz(partId);
  renderLearnPanel();
}

function learnQuizRetake(partId) {
  _LP_ANSWERS[partId] = {};
  const host = document.querySelector('#learn-body .lp-quiz[data-part="' + partId + '"]');
  if (host) delete host.dataset.state;
  _lpRenderQuiz(partId);
}

// ── resume point ───────────────────────────────────────────────────────────
// The heading nearest the top of the view is remembered as the place to come
// back to. It is written at most once every few seconds: a scroll handler that
// wrote on every frame would hammer localStorage for no benefit.
let _lpLastWrite = 0;
function _lpWatchScroll() {
  const scroller = document.getElementById('section-learn');
  if (!scroller) return;
  const onScroll = () => {
    const now = Date.now();
    if (now - _lpLastWrite < 4000) return;
    const heads = document.querySelectorAll('#learn-body .ln-h1, #learn-body .ln-h2');
    let cur = null;
    for (const h of heads) { if (h.getBoundingClientRect().top < 140) cur = h.id; else break; }
    if (!cur) return;
    _lpLastWrite = now;
    const p = _lpLoad();
    if (p.last === cur) return;
    p.last = cur;
    _lpSave(p);
  };
  scroller.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('scroll', onScroll, { passive: true });
}
