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
const LP_PASS = 2;                       // out of two: both, to clear a section

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

// A section is cleared when its quick check has been passed. Marking it read
// is gated on that, so the two are read from one place.
function _lpCleared(p, id) {
  const q = LEARN_QUIZ[id];
  if (!q) return true;                       // a section with no check is not gated
  return ((p.quiz[id] || {}).best || 0) >= Math.min(LP_PASS, q.length);
}

function _lpStats() {
  const p = _lpLoad(), secs = _lpSections();
  const done = secs.filter(s => p.done[s.id]).length;
  const cleared = secs.filter(x => _lpCleared(p, x.id)).length;
  return { p, secs, done, total: secs.length, cleared,
           pct: secs.length ? Math.round(done / secs.length * 100) : 0,
           complete: secs.length > 0 && done === secs.length };
}

// ── quick checks ──────────────────────────────────────────────────────────
// One quick check per section, two questions each, answerable from that
// section alone. Passing is what unlocks Mark as read, so a question the
// section does not answer would lock a reader out of their own progress:
// every answer below is stated in the text above it.
const LEARN_QUIZ = {
  "ln-1-1-why-prices-move-at-all": [
    { q: "What actually sets a share price?",
      a: ["A valuation published by the exchange", "The price at which the last buyer and seller agreed to trade", "The company's book value", "An average of broker targets"], c: 1,
      why: "It is simply where the last trade happened. Everything else, news and rates included, works only by changing how eager the two sides are." },
    { q: "A stock jumps four percent on very thin volume. What does that suggest?",
      a: ["A crowd has decided something", "Very few people were behind the move, perhaps one impatient order", "Institutions are accumulating", "The company has released results"], c: 1,
      why: "Price tells you what happened; volume tells you how much conviction was behind it. The same move on heavy volume would mean something quite different." },
  ],
  "ln-1-2-the-macro-environment-the-tide-under-every-boat": [
    { q: "The RBI raises the repo rate. Which business is usually helped rather than hurt?",
      a: ["A real estate developer", "A company carrying heavy debt", "A bank or lender", "A car manufacturer"], c: 2,
      why: "Lenders often earn a wider gap between what they pay depositors and what they charge borrowers. Indebted companies and anything bought on loans feel the opposite." },
    { q: "Crude oil rises sharply. What does the guide say follows for India?",
      a: ["The rupee strengthens and inflation falls", "The rupee weakens, imports get dearer and inflation rises", "Nothing, India produces most of its own oil", "Share prices rise across the board"], c: 1,
      why: "India imports most of what it burns and pays in dollars, so a higher crude price means more rupees sold to buy dollars, a weaker rupee, and pressure on the RBI to raise rates." },
  ],
  "ln-2-1-the-core-idea-the-shop-not-the-price-tag": [
    { q: "When you buy a share, what are you buying?",
      a: ["A bet on tomorrow's price", "A small ownership slice of a real business", "A loan to the company", "A right to a fixed dividend"], c: 1,
      why: "Not a lottery ticket and not a number on a screen. That is why the questions you would ask before buying a kirana shop are the right questions here too." },
    { q: "How often must a listed Indian company publish its results?",
      a: ["Once a year", "Every six months", "Every three months", "Only when it chooses to"], c: 2,
      why: "Quarterly results are the raw material of fundamental analysis. The ratios are just convenient ways of comparing those numbers." },
  ],
  "ln-2-2-the-key-ratios-in-plain-language": [
    { q: "Shopkeeper B put in 2 lakh, borrowed 8 lakh, and earns 2 lakh a year. His ROE is 100 percent and his ROCE is 20 percent. What explains the gap?",
      a: ["He runs the shop far better", "He used the bank's money, not better shopkeeping", "His shop is worth more", "He pays less tax"], c: 1,
      why: "Shopkeeper A earns the same 20 percent on all capital with no debt. If sales fall for a season, A survives comfortably and B still owes the bank every month." },
    { q: "What level of ROCE, held for several years, is one of the strongest signs of a genuinely good business?",
      a: ["Above five percent", "Comfortably above fifteen percent", "Above fifty percent", "Any positive number"], c: 1,
      why: "Read ROE and ROCE together. When ROE sits far above ROCE, borrowing is doing the work rather than the business." },
  ],
  "ln-2-3-what-multibaggers-tend-to-have-in-common": [
    { q: "Sales grow twenty percent and profits grow thirty five percent. What does that widening gap suggest?",
      a: ["An accounting change", "Each new rupee of sales is more profitable, so efficiency or pricing power is improving", "The company is simply getting bigger", "Costs are being deferred"], c: 1,
      why: "When sales and profits grow at the same rate the company is only getting bigger. The gap, sustained for years, is what quietly turns a good company into a very large one." },
    { q: "What does the guide say about spotting multibaggers in advance?",
      a: ["A high ROCE identifies them reliably", "Nobody can do it reliably, and anyone claiming otherwise is selling something", "The four features together guarantee it", "Only institutions can spot them"], c: 1,
      why: "Every one of the shared features is visible only in the past. Companies with all four have still failed, which is why position sizing protects you." },
  ],
  "ln-3-1-what-technical-analysis-actually-measures": [
    { q: "What does technical analysis study?",
      a: ["The company's accounts", "The price and volume history, as a record of crowd behaviour", "Management quality", "The sector's growth rate"], c: 1,
      why: "It does not study the business at all. It measures fear, greed, patience and panic, recorded as a chart." },
    { q: "How does the guide suggest combining the two disciplines?",
      a: ["Use technicals to choose what to own and fundamentals for timing", "Use fundamentals to decide what you are willing to own, and technicals to help with when you act", "Use whichever agrees with your view", "Use only one, never both"], c: 1,
      why: "Never let a chart pattern talk you into owning a business you would not otherwise want." },
  ],
  "ln-3-2-how-to-read-a-candlestick": [
    { q: "What does the body of a candle show?",
      a: ["The full high to low range", "The block between the open and the close, the day's actual outcome", "The average price of the day", "The volume traded"], c: 1,
      why: "The wicks reach the high and the low: ground that was taken and then lost. The body is where the rope ended up." },
    { q: "A candle has a tiny body and long wicks on both sides. What does that say?",
      a: ["One side was in control all day", "A violent argument that settled nowhere, so indecision", "Selling into strength", "Buying into weakness"], c: 1,
      why: "A long body with tiny wicks is conviction. Long wicks on both sides with almost no body is the opposite." },
  ],
  "ln-3-3-classic-patterns-with-entry-stop-loss-and-target": [
    { q: "Where does the stop loss go on a symmetrical triangle breakout?",
      a: ["At a round number below entry", "Just back inside the triangle", "Two percent below entry", "At the previous day's low"], c: 1,
      why: "If price returns inside the triangle the breakout has failed and the reason for the trade has gone." },
    { q: "How is the target measured on a triangle breakout?",
      a: ["A fixed ten percent", "The height of the triangle at its widest, projected from the breakout level", "The previous high", "Twice the stop distance"], c: 1,
      why: "Every rule in this section waits for a closing price rather than an intraday poke, and the target comes from the pattern's own dimensions." },
  ],
  "ln-4-1-rsi-the-relative-strength-index": [
    { q: "RSI is reading 50. What does that tell you?",
      a: ["A buy signal", "A sell signal", "Nobody is in control, so the reading carries little information", "The trend is about to reverse"], c: 2,
      why: "The 45 to 55 band is neutral. RSI earns its keep at the extremes, not in the middle." },
    { q: "RSI has sat above 70 for three weeks while price keeps climbing. What does that mean?",
      a: ["A crash is due", "The trend is strong; overbought means stretched, not finished", "The reading is faulty", "Volume must be falling"], c: 1,
      why: "Selling simply because RSI crossed 70 is one of the most reliable ways to exit a good position far too early." },
  ],
  "ln-4-2-macd-moving-average-convergence-divergence": [
    { q: "What is the MACD signal itself?",
      a: ["The level of the fast average", "The crossover, up for bullish and down for bearish", "The distance between the two lines", "The slope of the slow average"], c: 1,
      why: "A sprinter overtaking a marathon runner: the near term pace has picked up. When the sprinter falls behind, the effort is fading." },
    { q: "Where does MACD misfire most?",
      a: ["In strong uptrends", "In sideways markets, where the two averages keep tangling", "Only on small companies", "When volume is heavy"], c: 1,
      why: "It is an early signal, so it misfires often on its own. Read it alongside the wider trend." },
  ],
  "ln-4-3-adx-the-average-directional-index-the-most-important-one": [
    { q: "ADX is reading 14. What does this guide advise?",
      a: ["Buy, the trend is starting", "Sell, the trend is ending", "Hold and do nothing", "Ignore ADX and follow MACD"], c: 2,
      why: "Below 20 the market is choppy. Breakouts fail and crossovers whipsaw, so doing nothing is usually the winning position." },
    { q: "What does ADX measure?",
      a: ["Which direction the trend is heading", "How strong a trend is, saying nothing about direction", "How overbought a stock is", "How much volume is behind a move"], c: 1,
      why: "It is not the compass. It is the answer to whether there is a road here at all." },
  ],
  "ln-4-4-stochastic-oscillator-k-and-d": [
    { q: "What is the trigger on a Stochastic reading?",
      a: ["The level alone crossing 80 or 20", "%K crossing %D", "%D turning flat", "Price closing above the previous high"], c: 1,
      why: "%K is the fast line and %D is a smoothed version of it. The crossing is the signal, not merely the level." },
    { q: "Where does Stochastic work best?",
      a: ["In a strong trend", "In sideways, range bound markets", "On the weekly chart only", "When volume is unavailable"], c: 1,
      why: "In a strong trend it stays pinned at an extreme and becomes useless. In a range it is often better than RSI." },
  ],
  "ln-4-5-moving-averages-sma-20-50-and-200": [
    { q: "What is a golden cross?",
      a: ["Price crossing above the 50 day average", "The 50 day average crossing above the 200 day", "The 20 day crossing above the 50 day", "Three averages meeting at once"], c: 1,
      why: "The death cross is the mirror image: the 50 day crossing below the 200 day, read as a shift into a longer term downtrend." },
    { q: "What do these crossovers actually do?",
      a: ["Predict a change before it happens", "Confirm a change that has already begun", "Mark the exact top or bottom", "Work best in sideways markets"], c: 1,
      why: "Both are slow by nature. That is a feature, not a fault." },
  ],
  "ln-4-6-supertrend-and-parabolic-sar-the-automatic-traffic-light": [
    { q: "In an uptrend, how does the Supertrend line behave?",
      a: ["It sits above price and falls with it", "It sits below price and only ever ratchets upward", "It crosses price daily", "It stays at a fixed level"], c: 1,
      why: "A guard rail that only ever moves in your favour. It locks in ground already gained and refuses to give it back." },
    { q: "When should you ignore both Supertrend and Parabolic SAR?",
      a: ["When RSI is above 70", "When ADX is below 20", "On the first day of a month", "When volume is heavy"], c: 1,
      why: "They are excellent in strong trends and genuinely poor in sideways markets, where they flip repeatedly and generate loss after small loss." },
  ],
  "ln-4-7-mfi-the-money-flow-index": [
    { q: "How does MFI differ from RSI?",
      a: ["It uses a longer period", "It weighs each price move by how many shares actually traded", "It runs from 0 to 200", "It ignores falling days"], c: 1,
      why: "RSI counts how loudly the crowd is cheering. MFI counts how many people are actually in the stadium." },
    { q: "Price makes a new high but MFI does not follow. What does that suggest?",
      a: ["The rally is running on fewer and fewer participants", "A new uptrend is confirmed", "Volume data is missing", "The stock is oversold"], c: 0,
      why: "Disagreement between price and money flow is the most useful signal this indicator gives." },
  ],
  "ln-4-8-cci-and-williams-r-spotting-the-extremes": [
    { q: "What is the relationship between Williams %R and the Stochastic %K?",
      a: ["They measure opposite things", "They are mathematically the same measurement shifted by a constant", "One uses volume, the other does not", "%R is simply slower"], c: 1,
      why: "If you already read one, the other adds no new information. Treating them as two independent confirmations is a genuine and common error." },
    { q: "What does a CCI reading above +100 mean?",
      a: ["Unusually strong", "Unusually weak", "A guaranteed reversal", "Nothing without volume"], c: 0,
      why: "Below -100 means unusually weak. These are the gauges of how far price has strayed from what is normal for it." },
  ],
  "ln-4-9-atr-the-average-true-range-your-volatility-yardstick": [
    { q: "You buy at 1,000 rupees and ATR is 25 rupees. Where does a 2x ATR stop sit?",
      a: ["990", "950", "900", "750"], c: 1,
      why: "Roughly 1.5 to 3 times ATR from entry. A stop at 990 is inside one ordinary day of movement and would be hit by noise, not by your idea being wrong." },
    { q: "Your stop is 50 rupees away and you have decided to risk 5,000 rupees. How many shares do you buy?",
      a: ["50", "100", "250", "500"], c: 1,
      why: "The maths does the deciding, not your enthusiasm. ATR sizes the position as well as placing the stop." },
  ],
  "ln-4-10-support-resistance-and-the-20-day-high-and-low": [
    { q: "A resistance level finally breaks. What tends to happen to it?",
      a: ["It disappears", "It tends to act as new support", "It becomes stronger resistance", "It moves up by the same distance"], c: 1,
      why: "Roles reverse once a level breaks. Old support likewise tends to act as new resistance." },
    { q: "What does a close above the 20 day high represent?",
      a: ["A long term buy signal", "A simple, honest definition of short term strength", "An overbought warning", "The end of a trend"], c: 1,
      why: "The 20 day high and low mark the recent battleground, roughly the last month of trading." },
  ],
  "ln-4-11-fibonacci-retracement-levels": [
    { q: "Which Fibonacci levels are where healthy pullbacks usually end?",
      a: ["23.6 and 38.2 percent", "50 and 61.8 percent", "61.8 and 78.6 percent", "78.6 percent alone"], c: 1,
      why: "61.8 percent is the last level at which the original trend can still be said to be intact." },
    { q: "A retracement slices straight through 78.6 percent. What is that telling you?",
      a: ["It is a bargain", "The trend has probably finished", "A bounce is guaranteed", "The pattern has reset"], c: 1,
      why: "Treat a bounce from that depth with suspicion. Fibonacci levels are zones rather than exact prices, so confirm with a candle or a volume signal." },
  ],
  "ln-4-12-the-base-breakout-screener-minervini-and-o-neil-metrics": [
    { q: "What should volume do while the base is forming?",
      a: ["Rise steadily", "Fall away", "Stay exactly flat", "Spike every few days"], c: 1,
      why: "Drying up is the most under appreciated of the four measures. It means almost nobody left wants to sell at these prices." },
    { q: "What is the pivot?",
      a: ["The lowest point of the base", "The price at the top of the base, the level that must be cleared", "The midpoint of the range", "The day of heaviest volume"], c: 1,
      why: "A pivot break on ordinary volume fails regularly. On volume several times the average it suggests institutions are buying, which is what gives the move follow through." },
  ],
  "ln-5-1-futures-and-options-derivatives-without-the-jargon": [
    { q: "You hold a futures contract to buy at 50 lakh and the asset is worth 40 lakh at expiry. What happens?",
      a: ["You walk away and lose only the margin", "You must still complete the purchase at 50 lakh", "The contract is cancelled", "You pay the difference in shares"], c: 1,
      why: "The obligation runs in both directions, which is what separates a future from an option." },
    { q: "What does the buyer of an option risk?",
      a: ["Unlimited loss", "Only the premium paid", "The full contract value", "The margin plus the premium"], c: 1,
      why: "The buyer is taking out insurance: a known, limited cost for a large possible gain. The seller is the insurance company and carries the large risk." },
  ],
  "ln-5-2-commodities-and-currency": [
    { q: "A weaker rupee helps which kind of company?",
      a: ["Importers", "Exporters such as software services and pharmaceuticals", "Companies with foreign currency debt", "Airlines"], c: 1,
      why: "It hurts importers and anyone carrying foreign currency debt for the same reason it helps exporters." },
    { q: "Why does the guide suggest holding a little gold?",
      a: ["For reliable daily returns", "As insurance for the day the weather turns", "Because it always beats shares", "Because it is tax free"], c: 1,
      why: "The umbrella in the cupboard does nothing on most days. You hold it for the day it earns its place, and that is precisely when shares are falling." },
  ],
  "ln-5-3-cryptocurrency": [
    { q: "How are crypto gains taxed in India, as things stand?",
      a: ["Like capital gains on shares", "A flat 30 percent with 1 percent TDS, and losses cannot be set off", "Tax free below 1 lakh", "At your income slab rate"], c: 1,
      why: "An active trader can end up paying tax on winning trades while receiving no relief for losing ones. Confirm the current rules before you act, as they change." },
    { q: "Where does a cryptocurrency's value come from?",
      a: ["Profits and dividends", "Only what the next buyer will pay", "Its underlying assets", "A government guarantee"], c: 1,
      why: "There is no earnings based method to value it. A share, by contrast, is a legal slice of a business with profits behind it." },
  ],
  "ln-5-4-global-indices-and-why-your-morning-starts-in-new-york": [
    { q: "What is the GIFT Nifty?",
      a: ["A US index of Indian companies", "An Indian index traded across extended hours, the clearest early hint of our opening", "A mutual fund", "A commodity contract"], c: 1,
      why: "US markets close around 2am India time. By the time you wake, GIFT Nifty has usually already reacted." },
    { q: "A strong Indian company opens three percent lower and nothing has happened to that company. What is the likely reason?",
      a: ["An accounting problem", "An overnight move in global markets", "A dividend adjustment", "A stock split"], c: 1,
      why: "Global markets are one pond with connected channels. Understanding this stops you selling a good holding because of somebody else's news." },
  ],
  "ln-6-1-risk-a-fixed-small-amount": [
    { q: "You risk 2 percent per idea and are wrong ten times in a row. Roughly what is left?",
      a: ["About 80 percent", "About 50 percent", "About 20 percent", "Nothing"], c: 0,
      why: "Easily recoverable. Nobody is right ten times out of ten, so the plan has to survive being wrong." },
    { q: "You risk 25 percent per idea instead. How many mistakes end you?",
      a: ["Two", "Four", "Ten", "Twenty"], c: 1,
      why: "That is the whole argument for a small, fixed risk: it keeps you in the game long enough to be right." },
  ],
  "ln-6-2-write-the-stop-loss-before-you-enter": [
    { q: "Where should a stop loss be placed?",
      a: ["At an amount of money that feels tolerable", "Where the setup is proved wrong", "At a round number", "Two percent below entry, always"], c: 1,
      why: "Below the base, below the engulfing candle, below the trendline. Then give it room using ATR." },
    { q: "Price approaches your stop and you move the stop further away. What have you done?",
      a: ["Given the trade room to work", "Managed the position actively", "Abandoned your stop loss", "Reduced your risk"], c: 2,
      why: "A stop you move away as price approaches is not a stop loss, it is a wish." },
  ],
  "ln-6-3-judge-risk-against-reward-not-against-hope": [
    { q: "Below which ratio is a trade usually not worth taking?",
      a: ["1 to 1", "1 to 1.5", "1 to 3", "1 to 5"], c: 1,
      why: "Below that the odds do not pay for being wrong, however good the story sounds." },
    { q: "At a ratio of 1 to 3, what becomes possible?",
      a: ["You must still win most of the time", "You can be right less than half the time and still make money", "Losses become impossible", "The stop can be ignored"], c: 1,
      why: "It is tempting to chase a high strike rate. Professionals chase a favourable ratio instead, and accept being wrong often." },
  ],
  "ln-6-4-a-short-checklist-before-any-trade": [
    { q: "The checklist asks whether ADX is above 20. If it is not, what does the checklist say?",
      a: ["Reduce the position size", "Stand aside, the signals are unreliable", "Wait one day", "Use a wider stop"], c: 1,
      why: "Below 20 the market is choppy and trend signals misfire, so the honest answer is to do nothing." },
    { q: "You have not written down your stop loss price. What does the checklist say?",
      a: ["Enter with a smaller size", "Do not enter until you have", "Use a mental stop", "Enter and decide later"], c: 1,
      why: "Decide it before you buy, when you are calm and have no money at stake." },
  ],
  "ln-6-5-the-honest-summary": [
    { q: "Which part of investing does the guide say is fully within your control?",
      a: ["Picking the right stock", "Timing the market", "Risk management", "Predicting rate changes"], c: 2,
      why: "It is also the part that determines whether you are still investing in ten years." },
    { q: "Which indicator does the guide say to start with, and why?",
      a: ["RSI, because it is the most popular", "MACD, because it is early", "ADX, because knowing when to do nothing is worth more than any signal telling you to act", "Bollinger Bands, because they show volatility"], c: 2,
      why: "Learn one indicator properly rather than twelve superficially." },
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
      + '<span><b>' + st.cleared + '</b> of ' + st.total + ' quick checks cleared</span>'
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
    + '<div class="lp-cert-b">All ' + st.total + ' sections read, each after clearing its quick check, on '
    + _lpEsc(nice) + '.</div>'
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
    if (LEARN_QUIZ[sec.id] && !g.querySelector('.lp-quiz')) {
      const d = document.createElement('div');
      d.className = 'lp-quiz';
      d.dataset.sec = sec.id;
      g.appendChild(d);
      _lpRenderQuiz(sec.id);
    }
    const f = document.createElement('div');
    f.className = 'lp-foot';
    f.innerHTML = '<button type="button" class="lp-mark" data-gid="' + _lpEsc(sec.id) + '"'
      + ' onclick="learnToggleDone(this.dataset.gid)"></button>'
      + '<span class="lp-lock" data-gid="' + _lpEsc(sec.id) + '"></span>';
    g.appendChild(f);
  });

  // Restore the last attempt, so returning to a section shows what was answered
  // rather than a blank quiz beside a score.
  Object.keys(LEARN_QUIZ).forEach(id => {
    const rec = p.quiz[id];
    if (!rec || !rec.sel) return;
    _LP_ANSWERS[id] = Object.assign({}, rec.sel);
    const host = document.querySelector('#learn-body .lp-quiz[data-sec="' + id + '"]');
    if (host) { host.dataset.state = 'marked'; _lpRenderQuiz(id); }
  });

  body.dataset.lp = '1';
  _lpSyncMarks();
  renderLearnPanel();
  _lpWatchScroll();
}

function _lpSyncMarks() {
  const p = _lpLoad();
  document.querySelectorAll('#learn-body .lp-mark').forEach(b => {
    const id = b.dataset.gid;
    const on = !!p.done[id];
    const open = _lpCleared(p, id);
    b.classList.toggle('on', on);
    b.disabled = !open;
    b.textContent = on ? '✓  Read' : 'Mark as read';
    b.setAttribute('aria-pressed', on ? 'true' : 'false');
    b.setAttribute('aria-disabled', open ? 'false' : 'true');
    // The control says what it wants rather than only refusing to be pressed.
    const note = b.parentElement && b.parentElement.querySelector('.lp-lock');
    if (note) note.textContent = open ? '' : 'Clear the quick check above to unlock this';
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
  // Guarded here as well as on the button: a disabled control is a hint, not a
  // rule, and this is the only place the record is written.
  if (!p.done[gid] && !_lpCleared(p, gid)) return;
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
    _LP_ANSWERS[d.dataset.sec] = {};
    _lpRenderQuiz(d.dataset.sec);
  });
  _lpSyncMarks();
  renderLearnPanel();
}

// ── quick check rendering ──────────────────────────────────────────────────
const _LP_ANSWERS = {};          // in-flight selections, not persisted

function _lpRenderQuiz(partId) {
  const host = document.querySelector('#learn-body .lp-quiz[data-sec="' + partId + '"]');
  if (!host) return;
  const qs = LEARN_QUIZ[partId] || [];
  const p = _lpLoad();
  const best = (p.quiz[partId] || {}).best;
  const sel = _LP_ANSWERS[partId] || {};
  const marked = host.dataset.state === 'marked';
  const passed = marked && qs.reduce((n, q, i) => n + (sel[i] === q.c ? 1 : 0), 0) >= LP_PASS;

  const cleared = _lpCleared(p, partId);
  let h = '<div class="lp-quiz-h"><span>Quick check</span>'
    + (best != null ? '<span class="lp-quiz-best">Best ' + best + ' of ' + qs.length + '</span>' : '')
    + '</div>'
    + '<p class="lp-quiz-i">' + (cleared
        ? 'Cleared. Retake it whenever you like; the best result is the one kept.'
        : 'Getting both right unlocks Mark as read for this section. You will be told which answers '
          + 'were wrong, and the reasoning for the ones you got right; there is no limit on retries.') + '</p>';

  qs.forEach((q, i) => {
    h += '<div class="lp-q"><div class="lp-q-t">' + (i + 1) + '. ' + _lpEsc(q.q) + '</div>';
    q.a.forEach((opt, j) => {
      const chosen = sel[i] === j;
      let cls = 'lp-opt';
      // On a cleared check everything is shown, including the correct answer.
      // On a failed one only the reader's own wrong picks are marked: revealing
      // the right answer turned the gate into four clicks (submit anything,
      // read the answers, retake) and taught nothing in the process.
      if (marked) {
        if (passed && j === q.c) cls += ' right';
        else if (chosen && j !== q.c) cls += ' wrong';
        else if (chosen) cls += ' right';
      } else if (chosen) cls += ' sel';
      h += '<button type="button" class="' + cls + '" ' + (marked ? 'disabled' : '')
        + ' onclick="learnQuizPick(\'' + partId + '\',' + i + ',' + j + ')">'
        + '<span class="lp-opt-b">' + String.fromCharCode(65 + j) + '</span>' + _lpEsc(opt)
        + (marked && j === q.c && (passed || chosen) ? '<span class="lp-opt-tag">Correct</span>' : '')
        + (marked && chosen && j !== q.c ? '<span class="lp-opt-tag">Not this one</span>' : '')
        + '</button>';
    });
    // The explanation is the payoff for getting it right, or for a question you
    // already had right in a failed attempt. Withholding it elsewhere is what
    // sends the reader back to the section instead of back to the buttons.
    if (marked && (passed || sel[i] === q.c)) h += '<div class="lp-why">' + _lpEsc(q.why) + '</div>';
    else if (marked) h += '<div class="lp-why lp-why-no">Not right. The answer is in this section, above.</div>';
    h += '</div>';
  });

  if (marked) {
    const score = qs.reduce((n, q, i) => n + (sel[i] === q.c ? 1 : 0), 0);
    h += '<div class="lp-result ' + (score >= LP_PASS ? 'ok' : 'no') + '">'
      + '<b>' + score + ' of ' + qs.length + '</b> '
      + (score >= LP_PASS ? 'cleared. This section can now be marked as read. '
                          : 'Not cleared yet, both are needed. Re-read the section above, then try again. ')
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
  // The attempt itself is kept, not only the score: a reader coming back to a
  // section could otherwise see "Best 2 of 2" with no record of which answers
  // earned it.
  p.quiz[partId] = { best: Math.max(prev == null ? -1 : prev, score), of: qs.length,
                     at: Date.now(), sel: Object.assign({}, sel) };
  _lpTouchDay(p);
  _lpSave(p);
  const host = document.querySelector('#learn-body .lp-quiz[data-sec="' + partId + '"]');
  if (host) host.dataset.state = 'marked';
  _lpRenderQuiz(partId);
  // Clearing the check is what unlocks Mark as read, so the buttons have to be
  // resynced here. Without this the section stayed locked until a reload.
  _lpSyncMarks();
  renderLearnPanel();
}

function learnQuizRetake(partId) {
  _LP_ANSWERS[partId] = {};
  const host = document.querySelector('#learn-body .lp-quiz[data-sec="' + partId + '"]');
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
