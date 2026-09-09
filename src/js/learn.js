// ══════════ THE LEARN ACADEMY ══════════
// The complete beginner's guide to trading and investing, rendered inside the
// app. The block list below is generated from the same content that produces
// the Word edition of the guide, so the two cannot drift apart: one source,
// two renderers.
//
// Blocks are data, never markup. Each is one of:
//   {k:'h1'|'h2'|'h3', t}                 headings
//   {k:'p',   r:[{t,b?,i?}]}              a paragraph of runs
//   {k:'ul',  items:[[run,...]]}          a bullet list
//   {k:'box', kind, label, lines:[[run]]} an analogy / rule / caution callout
//   {k:'table', head:[[run]], rows:[[[run]]]}
// Everything is escaped at render time, so no string here can inject markup.

const LEARN_BLOCKS = [
  {"k": "box", "kind": "note", "label": "Read this first", "lines": [[{"t": "No prior knowledge is needed. Every technical term is explained the moment it appears, with an everyday comparison to make it stick."}], [{"t": "Nothing here is investment advice. It is education. No indicator, pattern or ratio in this guide predicts the future. They describe what has already happened, and they help you ask better questions before you risk your own money."}]]},
  {"k": "h1", "t": "Contents"},
  {"k": "p", "r": [{"t": "Five parts, in the order they build on each other. Part 1 explains why prices move at all. Part 2 is about the business behind the share. Part 3 and Part 4 are about reading the chart. Part 5 covers everything beyond ordinary shares."}]},
  {"k": "table", "head": [[{"t": "Part", "b": 1}], [{"t": "What it covers", "b": 1}], [{"t": "Why it matters", "b": 1}]], "rows": [[[{"t": "1. Market Mechanics"}], [{"t": "Supply, demand, and the macro forces (inflation, RBI rates, crude oil, global cues)"}], [{"t": "Explains the tide that lifts or sinks every boat"}]], [[{"t": "2. Fundamental Analysis"}], [{"t": "Reading the health of the business behind the share"}], [{"t": "Tells you WHAT is worth owning"}]], [[{"t": "3. Technical Analysis"}], [{"t": "Candlesticks, chart patterns, breakouts"}], [{"t": "Tells you WHEN the crowd is turning"}]], [[{"t": "4. Indicator Guide"}], [{"t": "Every indicator used in the app reports, explained plainly"}], [{"t": "Turns the numbers on your screen into meaning"}]], [[{"t": "5. Multi Asset"}], [{"t": "Futures, options, commodities, currency, crypto, global indices"}], [{"t": "Shows what else exists, and what it costs you"}]], [[{"t": "6. Before You Trade"}], [{"t": "Position sizing, stop losses, risk and reward"}], [{"t": "The part that decides whether you survive"}]]]},
  {"k": "h1", "t": "Part 1. Market Mechanics and Macroeconomics"},
  {"k": "h2", "t": "1.1 Why Prices Move At All"},
  {"k": "p", "r": [{"t": "A share price is not a fact handed down by anybody. It is simply the price at which the last buyer and the last seller agreed to do business. That is the whole of it. Everything else in this guide is an attempt to understand who those people are and what they are likely to do next."}]},
  {"k": "box", "kind": "analogy", "label": "Think of it like this", "lines": [[{"t": "Stand in a vegetable mandi at six in the morning. Forty buyers want tomatoes. Only ten crates arrived because the rain spoiled the rest. Nobody announces a price rise, yet the price rises anyway, because buyers outbid each other to get a crate before it runs out."}], [{"t": "Now stand in the same mandi at eleven. The crates are still half full and the market shuts at noon. Sellers begin cutting the price, because unsold tomatoes are worth nothing by evening."}], [{"t": "The stock exchange is that mandi, running all day, with shares instead of crates and a screen instead of shouting. The price rises when buyers are more desperate than sellers, and falls when sellers are more desperate than buyers. Nothing more mysterious than that."}]]},
  {"k": "p", "r": [{"t": "This is worth repeating, because it is easy to read a falling price as a sign the company is in trouble. Sometimes it does. Often it just means a large holder needed cash that week, and there were not enough buyers that day to absorb the shares."}]},
  {"k": "h3", "t": "Supply and demand in real terms"},
  {"k": "ul", "items": [[{"t": "More buyers than sellers: ", "b": 1}, {"t": "price rises until enough holders are tempted to sell."}], [{"t": "More sellers than buyers: ", "b": 1}, {"t": "price falls until it is cheap enough to tempt new buyers in."}], [{"t": "Volume ", "b": 1}, {"t": "is the number of shares that changed hands. A price move on heavy volume means many people agreed with it. The same move on thin volume may just be one impatient order."}]]},
  {"k": "box", "kind": "rule", "label": "The rule to remember", "lines": [[{"t": "Price tells you what happened. Volume tells you how much conviction was behind it. ", "b": 1}, {"t": "A breakout on huge volume is a crowd deciding something. The same breakout on nothing is often a trap."}]]},
  {"k": "h2", "t": "1.2 The Macro Environment: The Tide Under Every Boat"},
  {"k": "p", "r": [{"t": "You can pick a wonderful company and still lose money for two years, because the whole market was falling. These are the four forces that move the whole market at once."}]},
  {"k": "h3", "t": "Inflation: your money quietly shrinking"},
  {"k": "p", "r": [{"t": "Inflation is the rate at which prices in general rise. If inflation is six percent, the hundred rupee note in your pocket buys ninety four rupees worth of goods a year from now, without you spending a paisa."}]},
  {"k": "box", "kind": "analogy", "label": "Think of it like this", "lines": [[{"t": "Inflation is a slow leak in a bucket. You are not spending the water, but there is less of it every morning. This is why leaving all your savings in a cupboard is not \"safe\", it is a guaranteed slow loss."}]]},
  {"k": "h3", "t": "The RBI repo rate: the price of borrowing money"},
  {"k": "p", "r": [{"t": "The Reserve Bank of India lends money to commercial banks. The interest rate on that lending is called the repo rate. It is the single most important number in Indian finance, because everything else is priced off it."}]},
  {"k": "p", "r": [{"t": "When inflation runs hot, the RBI raises the repo rate to cool the economy down. Here is the chain of effects, and it is worth learning by heart:"}]},
  {"k": "ul", "items": [[{"t": "Repo rate rises, so banks pay more for money."}], [{"t": "Banks charge more on home loans, car loans and business loans."}], [{"t": "Companies borrow less, so they build fewer factories and hire more slowly."}], [{"t": "Future company profits are expected to be smaller, so investors will pay less for the shares today."}], [{"t": "At the same time, fixed deposits and bonds now pay more, so some money leaves shares entirely and moves there."}]]},
  {"k": "p", "r": [{"t": "The result: rising rates usually push share prices down, and falling rates usually push them up, regardless of how good the individual company is."}]},
  {"k": "box", "kind": "analogy", "label": "Think of it like this", "lines": [[{"t": "The repo rate is the thermostat of the economy. Turn it up and the room cools: activity slows, borrowing gets expensive, and speculative bets get abandoned first. Turn it down and the room warms: cheap money flows into property, business expansion and shares."}]]},
  {"k": "box", "kind": "note", "label": "Who feels it most", "lines": [[{"t": "Hurt most by rising rates: ", "b": 1}, {"t": "companies carrying heavy debt, real estate developers, and anything bought on loans (cars, homes, consumer durables). A highly indebted company pays more interest, and less is left for shareholders."}], [{"t": "Helped by rising rates: ", "b": 1}, {"t": "banks and lenders such as HDFC Bank often earn a wider gap between what they pay depositors and what they charge borrowers."}]]},
  {"k": "h3", "t": "Crude oil: India imports most of what it burns"},
  {"k": "p", "r": [{"t": "India buys the large majority of its crude oil from abroad and pays for it in US dollars. That makes the crude price a direct input into the Indian economy rather than a distant headline."}]},
  {"k": "ul", "items": [[{"t": "Crude rises, so India’s import bill rises and more rupees must be sold to buy dollars, which weakens the rupee."}], [{"t": "A weaker rupee makes every other import dearer, which pushes inflation up, which pressures the RBI to raise rates."}], [{"t": "Transport and packaging costs rise for almost every company, squeezing profit margins."}]]},
  {"k": "p", "r": [{"t": "Some businesses feel it immediately. Paint companies use crude derivatives as raw material. Tyre makers use rubber and carbon black. Airlines buy jet fuel, which is their single largest cost. When crude spikes, look at those first."}]},
  {"k": "p", "r": [{"t": "Reliance Industries is the interesting exception. It refines crude, so parts of its business can benefit when refining margins widen. This is why a single macro event helps some Indian companies and hurts others, and why \"oil is up so the market falls\" is too crude a rule to trade on."}]},
  {"k": "h3", "t": "Global events: why Indian markets watch America overnight"},
  {"k": "p", "r": [{"t": "Large international investors, called Foreign Institutional Investors, move money between countries looking for the best return for the risk. When the American central bank raises rates, US government bonds start paying more for almost no risk. Some of that money then leaves emerging markets like India and goes home."}]},
  {"k": "box", "kind": "analogy", "label": "Think of it like this", "lines": [[{"t": "Imagine a landlord with flats in two cities. When rents in the safer city rise sharply, he sells a flat in the riskier city to buy there instead. He may have nothing against the riskier city. The maths simply changed."}], [{"t": "When foreign investors sell in bulk, the Nifty falls even if Indian companies are doing perfectly well that quarter."}]]},
  {"k": "p", "r": [{"t": "Wall Street closes late at night Indian time. By the time you wake up, the GIFT Nifty (an Indian index traded outside normal Indian hours) has usually already reacted, which is why it is a reasonable early hint of how our market will open. Part 5 returns to this."}]},
  {"k": "h1", "t": "Part 2. Fundamental Analysis: Judging the Business"},
  {"k": "h2", "t": "2.1 The Core Idea: The Shop, Not The Price Tag"},
  {"k": "p", "r": [{"t": "When you buy a share you are buying a small ownership slice of a real business. Not a lottery ticket, not a number on a screen. A slice of a business."}]},
  {"k": "box", "kind": "analogy", "label": "Think of it like this", "lines": [[{"t": "Suppose a friend offers to sell you a kirana shop. You would not decide on the asking price alone. You would ask: how much does it sell in a day, what is the rent, how much stock is unsold, are there loans on it, do customers come back, and is a supermarket opening next door?"}], [{"t": "Only after all that does the asking price mean anything. Eighty lakh is expensive for a dying shop and cheap for a thriving one."}], [{"t": "Fundamental analysis is exactly that set of questions, asked about a listed company using its published accounts."}]]},
  {"k": "p", "r": [{"t": "Every listed Indian company must publish its results every three months. Those numbers are the raw material. The ratios below are just convenient ways of comparing them."}]},
  {"k": "h2", "t": "2.2 The Key Ratios, In Plain Language"},
  {"k": "h3", "t": "P/E ratio: how many years of profit you are paying"},
  {"k": "p", "r": [{"t": "P/E stands for Price to Earnings. Take the share price and divide it by the profit the company earns per share in a year."}]},
  {"k": "box", "kind": "analogy", "label": "Think of it like this", "lines": [[{"t": "The shop earns one lakh rupees of profit a year. The owner wants twenty lakh for it. You are paying twenty years of current profit, so the P/E is twenty."}], [{"t": "That is not automatically expensive. If the shop’s profit is growing thirty percent a year, you may earn it back far sooner. And it is not automatically cheap at a P/E of eight, if profits are shrinking every year."}]]},
  {"k": "ul", "items": [[{"t": "Only compare like with like. ", "b": 1}, {"t": "A software company and a steel company do not share a fair P/E. Compare a company with its own sector, and with its own history."}], [{"t": "A very low P/E is a question, not an answer. ", "b": 1}, {"t": "Ask why the market is unwilling to pay more. Often there is a reason."}]]},
  {"k": "h3", "t": "ROE and ROCE: the difference that is easy to miss"},
  {"k": "p", "r": [{"t": "Return on Equity (ROE) measures profit earned on the shareholders’ own money. Return on Capital Employed (ROCE) measures profit earned on all the money the business uses, which is the owners’ money plus the borrowed money."}]},
  {"k": "p", "r": [{"t": "The gap between the two is where borrowed money hides, and it matters enormously."}]},
  {"k": "table", "head": [[], [{"t": "Shopkeeper A", "b": 1}], [{"t": "Shopkeeper B", "b": 1}]], "rows": [[[{"t": "Own money put in"}], [{"t": "10 lakh"}], [{"t": "2 lakh"}]], [[{"t": "Money borrowed"}], [{"t": "nil"}], [{"t": "8 lakh"}]], [[{"t": "Total capital used"}], [{"t": "10 lakh"}], [{"t": "10 lakh"}]], [[{"t": "Annual profit"}], [{"t": "2 lakh"}], [{"t": "2 lakh"}]], [[{"t": "ROE (profit on own money)", "b": 1}], [{"t": "20 percent", "b": 1}], [{"t": "100 percent", "b": 1}]], [[{"t": "ROCE (profit on all money)", "b": 1}], [{"t": "20 percent", "b": 1}], [{"t": "20 percent", "b": 1}]]]},
  {"k": "p", "r": [{"t": "Shopkeeper B looks like a genius on ROE and is in fact no better at running a shop. He simply used the bank’s money. If sales fall for one season, A survives comfortably and B still owes the bank every month."}]},
  {"k": "box", "kind": "rule", "label": "The rule to remember", "lines": [[{"t": "Look at ROE and ROCE together. When ROE is far above ROCE, borrowing is doing the work, not the business. A consistently high ROCE (comfortably above fifteen percent for several years) is one of the strongest signs of a genuinely good business."}]]},
  {"k": "h3", "t": "Debt to Equity: how much of the business belongs to lenders"},
  {"k": "p", "r": [{"t": "This compares borrowed money against the owners’ money. A ratio of 1 means the company has borrowed one rupee for every rupee the owners put in."}]},
  {"k": "box", "kind": "analogy", "label": "Think of it like this", "lines": [[{"t": "A home loan is comfortable when your salary is steady and painful when your income is uncertain. A company is no different. Debt magnifies good years and can be fatal in bad ones, because interest must be paid whether or not the company made a profit."}]]},
  {"k": "ul", "items": [[{"t": "Below 0.5 is generally comfortable for an ordinary manufacturing or consumer business."}], [{"t": "Above 1 deserves a proper explanation before you invest."}], [{"t": "Banks and lending companies are the exception. Borrowing is their raw material, so this ratio is not meaningful for them and should not be compared against ordinary companies."}]]},
  {"k": "h3", "t": "Operating Profit Margin: what survives the running costs"},
  {"k": "p", "r": [{"t": "Of every hundred rupees of sales, how many rupees are left after the costs of actually running the business, before interest and tax. That is the operating profit margin."}]},
  {"k": "box", "kind": "analogy", "label": "Think of it like this", "lines": [[{"t": "Two shops each sell ten lakh of goods. One keeps twenty five thousand after all its costs, the other keeps one lakh fifty thousand. The second has room to survive a bad year, to cut prices against a competitor, and to fund its own expansion. The first is one bad season from trouble."}]]},
  {"k": "p", "r": [{"t": "Watch the direction as much as the level. A margin that improves year after year usually means the company has real pricing power or is getting more efficient. A margin quietly falling for three years is a warning that competition is biting."}]},
  {"k": "h3", "t": "Cash conversion: profit on paper versus money in the bank"},
  {"k": "p", "r": [{"t": "This ratio gets far less attention than the others, and it is the one that exposes the most trouble."}]},
  {"k": "box", "kind": "analogy", "label": "Think of it like this", "lines": [[{"t": "Your shop sells ten lakh of goods this year, all on credit, and not one customer has paid yet. Your accounts show a healthy profit. Your bank balance is empty. You cannot pay staff with an invoice."}], [{"t": "That is a company with profit and no cash. It may be perfectly innocent (a growing business often funds customers), or it may be that the \"sales\" are never going to be collected."}]]},
  {"k": "p", "r": [{"t": "The honest check is simple: over a few years, does the cash actually generated by operations roughly track the reported profit? If profits keep rising while operating cash flow does not follow, something needs explaining. Many well known accounting failures were visible in this gap years before the share price collapsed."}]},
  {"k": "box", "kind": "rule", "label": "The rule to remember", "lines": [[{"t": "Profit is an opinion, formed under accounting rules. Cash is a fact. When the two disagree for several years running, believe the cash."}]]},
  {"k": "h2", "t": "2.3 What Multibaggers Tend To Have In Common"},
  {"k": "p", "r": [{"t": "A \"multibagger\" is simply a share that multiplies your money several times over. Nobody can reliably identify them in advance, and anyone who claims otherwise is selling something. But the ones that worked in India have shared recognisable features, and it is worth knowing what they are."}]},
  {"k": "h3", "t": "A moat that gets wider as the business grows"},
  {"k": "p", "r": [{"t": "A moat is a durable advantage that competitors cannot easily copy. The important word is durable."}]},
  {"k": "p", "r": [{"t": "Avenue Supermarts, which runs DMART, is the clearest Indian example. It buys in enormous volume so it pays suppliers less, it owns many of its stores instead of paying rent, and it passes the savings on as low prices. Low prices bring more shoppers, more shoppers mean bigger volumes, bigger volumes mean even better buying terms. The advantage feeds itself. A new competitor cannot simply decide to have that."}]},
  {"k": "p", "r": [{"t": "Cupid Ltd is a different flavour of the same idea: a small company in a specialised regulated product where global approvals and tender relationships are slow and difficult to obtain, which keeps most competitors out. Small companies can have moats too, and those are often where the largest percentage gains come from, along with the largest risks."}]},
  {"k": "h3", "t": "A clean balance sheet"},
  {"k": "p", "r": [{"t": "Low debt is not exciting, and it is what allows a company to survive long enough for the growth story to play out. A great business with too much borrowing can still be wiped out by two bad years and a rate rise."}]},
  {"k": "h3", "t": "Profits growing faster than sales"},
  {"k": "p", "r": [{"t": "This is the single most useful pattern to look for, and it is easy to check."}]},
  {"k": "box", "kind": "analogy", "label": "Think of it like this", "lines": [[{"t": "If sales grow twenty percent and profits grow twenty percent, the company is simply getting bigger."}], [{"t": "If sales grow twenty percent and profits grow thirty five percent, then something better is happening: each new rupee of sales is more profitable than the last. The business is gaining efficiency or pricing power as it scales."}]]},
  {"k": "p", "r": [{"t": "That widening gap, sustained over several years, is what quietly turns a good company into a very large one."}]},
  {"k": "h3", "t": "A long runway"},
  {"k": "p", "r": [{"t": "Ask how big this business could reasonably become. A company that already serves nearly everyone who will ever want its product has limited room left, however excellent it is. A company with a small share of a very large and growing need has somewhere to go."}]},
  {"k": "box", "kind": "caution", "label": "Careful here", "lines": [[{"t": "Every one of these features is visible only in the past. None of them guarantees the future. Companies with all four have still failed, because of a regulation change, a new technology, a fraud, or simply a management that lost its way. Position sizing (Part 6) is what protects you from being wrong, and you will be wrong sometimes."}]]},
  {"k": "h1", "t": "Part 3. Technical Analysis and Reading Candlesticks"},
  {"k": "h2", "t": "3.1 What Technical Analysis Actually Measures"},
  {"k": "p", "r": [{"t": "Technical analysis studies the price and volume history of a share. It does not study the business. It is a way of measuring crowd behaviour: fear, greed, patience and panic, recorded as a chart."}]},
  {"k": "box", "kind": "analogy", "label": "Think of it like this", "lines": [[{"t": "Fundamental analysis asks whether the restaurant cooks good food. Technical analysis stands outside and counts how many people are queueing, and whether the queue is growing or thinning."}], [{"t": "Both are useful, and they answer different questions. A queue outside a bad restaurant is a fad. A great restaurant nobody has noticed yet is an opportunity, but you may wait a long time."}]]},
  {"k": "box", "kind": "rule", "label": "The rule to remember", "lines": [[{"t": "A sensible way to combine them: use fundamentals to decide WHAT you are willing to own, and technicals to help with WHEN you act. Never let a chart pattern talk you into owning a business you would not otherwise want."}]]},
  {"k": "h2", "t": "3.2 How To Read A Candlestick"},
  {"k": "p", "r": [{"t": "Each candle summarises one time period, usually one day, which is the timeframe most people start with. It packs four numbers into one shape."}]},
  {"k": "table", "head": [[{"t": "Part of the candle", "b": 1}], [{"t": "What it shows", "b": 1}], [{"t": "In plain terms", "b": 1}]], "rows": [[[{"t": "Open"}], [{"t": "The first traded price of the day"}], [{"t": "Where the argument started"}]], [[{"t": "Close"}], [{"t": "The last traded price of the day"}], [{"t": "Who was winning when the bell rang"}]], [[{"t": "High"}], [{"t": "The highest price reached"}], [{"t": "The furthest buyers managed to push"}]], [[{"t": "Low"}], [{"t": "The lowest price reached"}], [{"t": "The furthest sellers managed to push"}]], [[{"t": "Body"}], [{"t": "The block between open and close"}], [{"t": "The day’s actual outcome"}]], [[{"t": "Wicks (shadows)"}], [{"t": "The thin lines above and below the body"}], [{"t": "Ground that was taken and then lost"}]]]},
  {"k": "p", "r": [{"t": "A green (or white) candle means the close was above the open: buyers finished ahead. A red (or black) candle means the close was below the open: sellers finished ahead."}]},
  {"k": "fig", "id": "candle"},
  {"k": "box", "kind": "analogy", "label": "Think of it like this", "lines": [[{"t": "Picture a tug of war lasting one day. The body is where the rope ended up. The wicks show how far each team briefly dragged it before being pulled back."}], [{"t": "A long lower wick means sellers dragged the price far down during the day, and buyers hauled it all the way back before the close. That is useful information: somebody with money was willing to defend that level."}]]},
  {"k": "box", "kind": "note", "label": "Reading shapes at a glance", "lines": [[{"t": "Long body, tiny wicks: ", "b": 1}, {"t": "one side was in control all day. Conviction."}], [{"t": "Tiny body, long wicks both sides: ", "b": 1}, {"t": "a violent argument that settled nowhere. Indecision."}], [{"t": "Long upper wick: ", "b": 1}, {"t": "buyers pushed up and were beaten back down. Often a sign of selling into strength."}], [{"t": "Long lower wick: ", "b": 1}, {"t": "sellers pushed down and were beaten back up. Often a sign of buying into weakness."}]]},
  {"k": "h2", "t": "3.3 Classic Patterns, With Entry, Stop Loss and Target"},
  {"k": "p", "r": [{"t": "A pattern is only a shape until price confirms it. The most common mistake is acting on a shape before it completes. Every rule below waits for a closing price, not an intraday poke."}]},
  {"k": "h3", "t": "Symmetrical triangle: the coiled spring"},
  {"k": "p", "r": [{"t": "Highs get lower, lows get higher, and price squeezes into a narrowing point. Buyers are getting braver and sellers are getting more cautious at the same time, or the reverse. The market is compressing."}]},
  {"k": "ul", "items": [[{"t": "What it means: ", "b": 1}, {"t": "indecision under pressure. Neither side can win yet, so energy builds."}], [{"t": "What it does NOT tell you: ", "b": 1}, {"t": "the direction. A symmetrical triangle can break either way. Anyone who tells you it is \"a bullish pattern\" is guessing."}], [{"t": "Entry: ", "b": 1}, {"t": "only on a daily close outside the triangle, ideally with volume clearly above the recent average."}], [{"t": "Stop loss: ", "b": 1}, {"t": "just back inside the triangle. If price returns inside, the breakout failed and the reason for the trade has gone."}], [{"t": "Target: ", "b": 1}, {"t": "measure the height of the triangle at its widest point and project that distance from the breakout level."}]]},
  {"k": "h3", "t": "Bullish breakout: price clears a ceiling"},
  {"k": "p", "r": [{"t": "A resistance level is a price where sellers have repeatedly appeared and stopped the advance. A breakout is a decisive close above it."}]},
  {"k": "box", "kind": "analogy", "label": "Think of it like this", "lines": [[{"t": "Think of a room with a low ceiling. Price keeps bumping its head at 500 rupees and falling back. Each time, some holders who bought at 500 earlier and were trapped take the chance to exit at breakeven, which supplies the selling."}], [{"t": "Eventually those trapped holders are exhausted. The next attempt goes clean through, and the old ceiling becomes the new floor, because anyone who wants in now must pay above 500."}]]},
  {"k": "ul", "items": [[{"t": "Entry: ", "b": 1}, {"t": "a daily close above the resistance level, on volume noticeably higher than the recent average. Volume is what separates a real breakout from a trap."}], [{"t": "Stop loss: ", "b": 1}, {"t": "below the most recent swing low, or below the base the stock broke out of. If price closes back below the old ceiling, the breakout has failed."}], [{"t": "Target: ", "b": 1}, {"t": "the height of the base added to the breakout price, and take partial profits along the way rather than waiting for perfection."}]]},
  {"k": "fig", "id": "breakout"},
  {"k": "h3", "t": "Bearish breakdown: the same thing upside down"},
  {"k": "p", "r": [{"t": "A support level is a price where buyers have repeatedly stepped in. A breakdown is a decisive close below it, and the old floor then tends to act as a ceiling on any bounce. Entry, stop and target mirror the breakout exactly, in the opposite direction."}]},
  {"k": "h3", "t": "Bullish engulfing: a one day change of heart"},
  {"k": "p", "r": [{"t": "Two candles. The first is red. The second is green and its body completely covers (engulfs) the first candle’s body: it opens at or below the previous close and closes at or above the previous open."}]},
  {"k": "box", "kind": "analogy", "label": "Think of it like this", "lines": [[{"t": "On day one sellers won. On day two sellers opened in control again, and by the close buyers had not only recovered every inch but taken more ground than sellers gained the day before. Somebody decided, in one session, that this price was a bargain."}]]},
  {"k": "ul", "items": [[{"t": "Where it matters: ", "b": 1}, {"t": "after a clear fall, and at a level that already mattered (an old support, a 200 day average, a Fibonacci zone). In the middle of a sideways drift it means very little."}], [{"t": "Entry: ", "b": 1}, {"t": "above the high of the engulfing candle, so price must confirm the reversal rather than you assuming it."}], [{"t": "Stop loss: ", "b": 1}, {"t": "below the low of the engulfing candle."}], [{"t": "Strengthened by: ", "b": 1}, {"t": "heavy volume on the green candle, and an oversold momentum reading (Part 4)."}]]},
  {"k": "box", "kind": "caution", "label": "Careful here", "lines": [[{"t": "Patterns fail regularly. This is normal and not a defect. A pattern is a probability tilt, not a promise, which is exactly why every one of the rules above includes a stop loss written down before you enter."}]]},
  {"k": "h1", "t": "Part 4. The Complete Indicator Guide"},
  {"k": "p", "r": [{"t": "These are the indicators that appear in the app reports. Every one of them is a calculation on past price or volume. None of them knows the future. Used well, they summarise a great deal of chart history into a number you can act on. Used badly, they produce confident nonsense, and this section is careful to say when each one is unreliable."}]},
  {"k": "box", "kind": "rule", "label": "The rule to remember", "lines": [[{"t": "Indicators from the same family repeat each other. RSI, Stochastic, CCI and Williams %R all measure roughly the same thing. Four of them agreeing is not four opinions, it is one opinion said four times. Take one from each family instead: one for trend, one for momentum, one for volume."}]]},
  {"k": "h2", "t": "4.1 RSI, the Relative Strength Index"},
  {"k": "p", "r": [{"t": "A meter from 0 to 100 that measures how hard the price has been pushed recently, by comparing the size of recent gains against the size of recent falls."}]},
  {"k": "box", "kind": "analogy", "label": "Think of it like this", "lines": [[{"t": "RSI is the speedometer, not the steering wheel. It tells you how fast the move is going, not which way the road turns."}], [{"t": "A car at 130 kilometres per hour is not necessarily about to crash, but it cannot keep accelerating forever. That is exactly what a high RSI is telling you: this pace is unusual and hard to sustain."}]]},
  {"k": "fig", "id": "rsi"},
  {"k": "table", "head": [[{"t": "Reading", "b": 1}], [{"t": "Name", "b": 1}], [{"t": "What to take from it", "b": 1}]], "rows": [[[{"t": "Above 70"}], [{"t": "Overbought"}], [{"t": "Buyers have pushed hard. Rallies often pause or pull back from here. It is NOT an automatic sell signal."}]], [[{"t": "Below 30"}], [{"t": "Oversold"}], [{"t": "Sellers have pushed hard. Falls often stall and bounce from here. It is NOT an automatic buy signal."}]], [[{"t": "45 to 55"}], [{"t": "Neutral"}], [{"t": "Nobody is in control. The reading carries little information."}]]]},
  {"k": "box", "kind": "caution", "label": "Careful here", "lines": [[{"t": "A trap worth knowing: in a genuinely strong trend, RSI can sit above 70 for weeks while the price keeps climbing. Selling simply because RSI crossed 70 is one of the most reliable ways to exit a good position far too early. Overbought means \"stretched\", not \"finished\"."}]]},
  {"k": "h2", "t": "4.2 MACD, Moving Average Convergence Divergence"},
  {"k": "p", "r": [{"t": "It compares a fast average of price against a slow average of price. When the fast one crosses above the slow one, recent prices are pulling away upwards, and momentum has turned up. When it crosses below, momentum has turned down."}]},
  {"k": "box", "kind": "analogy", "label": "Think of it like this", "lines": [[{"t": "Two runners: a sprinter (the fast average) and a marathon runner (the slow one). When the sprinter overtakes, the near term pace has picked up. When the sprinter falls behind, the effort is fading."}]]},
  {"k": "ul", "items": [[{"t": "The signal: ", "b": 1}, {"t": "the crossover itself, up for bullish and down for bearish."}], [{"t": "Its weakness: ", "b": 1}, {"t": "it is early, so it misfires often on its own, and it misfires most in sideways markets where the two averages keep tangling."}], [{"t": "Use it with: ", "b": 1}, {"t": "the wider trend. A MACD buy signal while price sits above its 200 day average is a very different thing from the same signal in a downtrend."}]]},
  {"k": "h2", "t": "4.3 ADX, the Average Directional Index: The Most Important One To Learn First"},
  {"k": "p", "r": [{"t": "ADX measures how strong a trend is. It deliberately does not tell you which direction. This sounds useless and is in fact one of the most valuable filters there is."}]},
  {"k": "box", "kind": "analogy", "label": "Think of it like this", "lines": [[{"t": "ADX is not the compass, it is the answer to \"is there a road here at all?\""}], [{"t": "A compass is invaluable on a road. In the middle of a featureless field, the compass still points north confidently while getting you nowhere. A great many losses come from following a confident compass across a field."}]]},
  {"k": "table", "head": [[{"t": "ADX reading", "b": 1}], [{"t": "Market condition", "b": 1}], [{"t": "What to do about it", "b": 1}]], "rows": [[[{"t": "Below 20", "b": 1}], [{"t": "No trend, choppy and sideways", "b": 1}], [{"t": "Trend indicators produce FALSE SIGNALS here. This is the moment to HOLD and do nothing. The app deliberately holds its verdict when ADX is this low.", "b": 1}]], [[{"t": "20 to 25"}], [{"t": "Weak or forming trend"}], [{"t": "Treat signals with caution. Wait for confirmation before committing."}]], [[{"t": "Above 25"}], [{"t": "A real trend is in place"}], [{"t": "Trend following signals (moving averages, Supertrend, MACD) carry genuine weight here."}]], [[{"t": "Above 40"}], [{"t": "Very strong trend"}], [{"t": "Moves in the trend direction tend to keep going. Do not fight it on an overbought reading alone."}]]]},
  {"k": "box", "kind": "rule", "label": "The rule to remember", "lines": [[{"t": "If you remember only one rule from this entire guide, make it this one: when ADX is below 20, the market is choppy and directionless. ", "b": 1}, {"t": "Breakouts fail, crossovers whipsaw, and patterns do not complete. Doing nothing is a position, and in a sideways market it is usually the winning one."}]]},
  {"k": "fig", "id": "adx"},
  {"k": "h2", "t": "4.4 Stochastic Oscillator (%K and %D)"},
  {"k": "p", "r": [{"t": "It asks a narrow question: where did today’s close sit inside the high to low range of the recent past? Near the top of the range, or near the bottom?"}]},
  {"k": "box", "kind": "analogy", "label": "Think of it like this", "lines": [[{"t": "Think of a ball bouncing inside a lift shaft. Stochastic tells you whether the ball is near the ceiling or near the floor of its recent range. It reacts faster than RSI, which means it spots turns earlier and also cries wolf more often."}]]},
  {"k": "ul", "items": [[{"t": "Above 80 is overbought territory, below 20 is oversold."}], [{"t": "There are two lines: %K is the fast one, %D is a smoothed version of it. The trigger is %K crossing %D, not merely the level."}], [{"t": "It suits sideways and range bound markets, where it is often better than RSI. In a strong trend it stays pinned at an extreme and becomes useless."}]]},
  {"k": "h2", "t": "4.5 Moving Averages: SMA 20, 50 and 200"},
  {"k": "p", "r": [{"t": "A moving average is simply the average closing price over the last N days, recalculated each day. It smooths out daily noise so the underlying direction becomes visible."}]},
  {"k": "box", "kind": "analogy", "label": "Think of it like this", "lines": [[{"t": "One day of price is a single day’s mood. A moving average is the running mood of the last twenty, fifty or two hundred days. The longer the period, the slower and more serious it is."}]]},
  {"k": "table", "head": [[{"t": "Average", "b": 1}], [{"t": "Represents", "b": 1}], [{"t": "How it is normally used", "b": 1}]], "rows": [[[{"t": "SMA 20"}], [{"t": "Short term, roughly one trading month"}], [{"t": "The immediate pulse. Useful for timing entries in an existing trend."}]], [[{"t": "SMA 50"}], [{"t": "Medium term, roughly one quarter"}], [{"t": "The trend most swing traders actually follow."}]], [[{"t": "SMA 200"}], [{"t": "Long term, roughly one year"}], [{"t": "The dividing line of the whole market. Above it is considered a bull phase for that stock, below it a bear phase."}]]]},
  {"k": "p", "r": [{"t": "The 200 day average deserves special respect. Large institutions genuinely watch it, which makes it partly self fulfilling. A stock reclaiming its 200 day average after months below is a meaningful change of character, and a stock losing it after months above is a warning worth acting on."}]},
  {"k": "box", "kind": "note", "label": "The crossovers you will hear named", "lines": [[{"t": "Golden cross: ", "b": 1}, {"t": "the 50 day average crosses above the 200 day average. Widely read as a shift into a longer term uptrend."}], [{"t": "Death cross: ", "b": 1}, {"t": "the 50 day crosses below the 200 day. The mirror image, read as a shift into a longer term downtrend."}], [{"t": "Both are slow by nature. They confirm a change that has already begun, they do not predict one. That is a feature, not a fault."}]]},
  {"k": "fig", "id": "ma"},
  {"k": "h2", "t": "4.6 Supertrend and Parabolic SAR: The Automatic Traffic Lights"},
  {"k": "p", "r": [{"t": "Both draw a line that follows price at a distance and flips to the other side when the trend changes. They are trailing stop and reverse tools: they suggest where to get out, and then suggest the opposite position."}]},
  {"k": "box", "kind": "analogy", "label": "Think of it like this", "lines": [[{"t": "A Supertrend line is a guard rail that only ever moves in your favour. In an uptrend it sits below price and ratchets upward, never downward. It locks in ground you have already gained and refuses to give it back."}], [{"t": "Parabolic SAR is a series of dots doing the same job, and it tightens faster the longer a trend runs, as though it is getting nervous the further you go."}]]},
  {"k": "ul", "items": [[{"t": "Price above the line favours the upside. A close through the line is the usual signal to flip."}], [{"t": "They are excellent in strong trends and genuinely poor in sideways markets, where they flip repeatedly and generate loss after small loss."}], [{"t": "This is precisely why you check ADX first. Below 20, ignore both."}]]},
  {"k": "h2", "t": "4.7 MFI, the Money Flow Index"},
  {"k": "p", "r": [{"t": "MFI is RSI with volume added. It weighs each price move by how many shares actually traded, so it distinguishes a move that many people participated in from a move that happened on almost nothing."}]},
  {"k": "box", "kind": "analogy", "label": "Think of it like this", "lines": [[{"t": "RSI counts how loudly the crowd is cheering. MFI counts how many people are actually in the stadium."}], [{"t": "A price rising on thin volume is a small group getting excited. A price rising on heavy volume suggests larger participants, often institutions, are genuinely buying."}]]},
  {"k": "ul", "items": [[{"t": "Above 80 means heavy inflow. Watch for exhaustion."}], [{"t": "Below 20 means the stock is washed out. Sellers may be finished."}], [{"t": "The most useful signal is disagreement with price: if price makes a new high and MFI does not, the rally is running on fewer and fewer participants."}]]},
  {"k": "box", "kind": "caution", "label": "Careful here", "lines": [[{"t": "MFI needs real volume data to mean anything. For thinly traded small companies, or when a data feed does not carry volume, the reading should be ignored rather than trusted. The app deliberately shows nothing rather than a number in that situation."}]]},
  {"k": "h2", "t": "4.8 CCI and Williams %R: Spotting The Extremes"},
  {"k": "p", "r": [{"t": "Both answer the same question in slightly different ways: how far has the price strayed from what is normal for it recently?"}]},
  {"k": "ul", "items": [[{"t": "CCI (Commodity Channel Index): ", "b": 1}, {"t": "above +100 means unusually strong, below -100 means unusually weak. Despite the name it is used on shares, not only commodities."}], [{"t": "Williams %R: ", "b": 1}, {"t": "runs from 0 to -100. Above -20 is overbought, below -80 is oversold."}]]},
  {"k": "box", "kind": "analogy", "label": "Think of it like this", "lines": [[{"t": "These are the \"how unusual is this?\" gauges. A temperature of 42 degrees is not impossible in India, it is simply far from normal, and things that are far from normal tend to return towards it eventually."}]]},
  {"k": "box", "kind": "note", "label": "A note worth knowing", "lines": [[{"t": "Williams %R and the Stochastic %K are, mathematically, the same measurement shifted by a constant. If you already read one, the other adds no new information. Treating them as two independent confirmations is a genuine and common error."}]]},
  {"k": "h2", "t": "4.9 ATR, the Average True Range: Your Volatility Yardstick"},
  {"k": "p", "r": [{"t": "ATR measures how much a stock typically moves in a single day, in rupees. It says nothing about direction. It is purely a measure of how jumpy the stock is."}]},
  {"k": "box", "kind": "analogy", "label": "Think of it like this", "lines": [[{"t": "ATR is the difference between standing next to a sleeping cat and standing next to a sleeping tiger. Both are still. You would sensibly keep a very different distance from each."}], [{"t": "A stock that routinely swings 40 rupees a day needs a far wider stop loss than one that moves 4 rupees, even if you are risking the same amount of money on both."}]]},
  {"k": "box", "kind": "rule", "label": "The rule to remember", "lines": [[{"t": "This is the practical use, and it matters more than any signal in this guide. ", "b": 1}, {"t": "Set your stop loss at roughly 1.5 to 3 times the ATR away from your entry (2x ATR is a sensible default). A stop tighter than one ATR will be hit by ordinary daily noise, not by your idea being wrong."}]]},
  {"k": "fig", "id": "atr"},
  {"k": "p", "r": [{"t": "Concretely: you buy at 1,000 rupees and ATR is 25 rupees. A 2x ATR stop sits at 950. If you had instead placed a \"neat\" stop at 990, you would be stopped out by an entirely normal day, before the stock had any chance to do what you expected."}]},
  {"k": "p", "r": [{"t": "ATR also sizes your position. If your stop is 50 rupees away and you have decided to risk 5,000 rupees on this idea, then you buy 100 shares. The maths does the deciding, not your enthusiasm."}]},
  {"k": "h2", "t": "4.10 Support, Resistance and the 20 Day High and Low"},
  {"k": "p", "r": [{"t": "Support is a price where buyers have repeatedly appeared. Resistance is a price where sellers have repeatedly appeared. They are levels of memory, not physics."}]},
  {"k": "box", "kind": "analogy", "label": "Think of it like this", "lines": [[{"t": "A stock fell hard from 800 last year, and many people who bought near 800 are still holding at a loss. As price climbs back towards 800, those holders finally see a chance to escape at breakeven, and they sell. That supply is what creates resistance. It is human memory, priced."}]]},
  {"k": "ul", "items": [[{"t": "The 20 day high and low mark the recent battleground: the highest and lowest a stock has traded in roughly the last month. A close above the 20 day high is a simple, honest definition of short term strength."}], [{"t": "The more times a level has held, the more meaningful a break of it becomes."}], [{"t": "Once broken, roles reverse: old resistance tends to act as new support, and old support as new resistance."}]]},
  {"k": "h2", "t": "4.11 Fibonacci Retracement Levels"},
  {"k": "p", "r": [{"t": "After a strong move, prices rarely travel in a straight line. They pull back, and Fibonacci levels mark the depths at which pullbacks commonly end: 23.6 percent, 38.2 percent, 50 percent, 61.8 percent and 78.6 percent of the previous move."}]},
  {"k": "box", "kind": "analogy", "label": "Think of it like this", "lines": [[{"t": "Picture a staircase. A ball bouncing down does not fall to the bottom in one go, it pauses on steps. These percentages are the steps that traders around the world are watching, which is a large part of why they work at all."}]]},
  {"k": "table", "head": [[{"t": "Level", "b": 1}], [{"t": "Depth of pullback", "b": 1}], [{"t": "What it usually suggests", "b": 1}]], "rows": [[[{"t": "23.6 percent"}], [{"t": "Very shallow"}], [{"t": "A powerful trend that barely paused for breath."}]], [[{"t": "38.2 percent"}], [{"t": "Shallow"}], [{"t": "A healthy pause within a strong trend."}]], [[{"t": "50 percent"}], [{"t": "Half of the move given back"}], [{"t": "Common and still normal. Widely watched."}]], [[{"t": "61.8 percent"}], [{"t": "Deep"}], [{"t": "The last level where the original trend can be said to be intact."}]], [[{"t": "78.6 percent"}], [{"t": "Very deep"}], [{"t": "The move is in real doubt. Treat a bounce here with suspicion."}]]]},
  {"k": "p", "r": [{"t": "The 50 percent and 61.8 percent levels are where healthy pullbacks usually end. A retracement that slices through 78.6 percent is telling you the trend has probably finished, not that it is a bargain."}]},
  {"k": "fig", "id": "fib"},
  {"k": "box", "kind": "caution", "label": "Careful here", "lines": [[{"t": "Fibonacci levels are zones, not exact prices. Waiting for a stock to touch 61.83 to the paisa is false precision. Look for the price to stabilise near the level and then confirm with a candle pattern or a volume signal before acting."}]]},
  {"k": "h2", "t": "4.12 The Base Breakout Screener: Minervini and O’Neil Metrics"},
  {"k": "p", "r": [{"t": "Mark Minervini and William O’Neil independently studied what the biggest winning stocks looked like just before they ran. Both arrived at a similar picture: a long quiet period of tightening, followed by a decisive break on heavy volume. These four measurements separate a genuine breakout from a trap."}]},
  {"k": "h3", "t": "1. Tight consolidation, a range under about 10 percent"},
  {"k": "p", "r": [{"t": "For several weeks the stock trades in a narrow band instead of swinging wildly. The high to low range of the base is small, ideally under roughly ten percent."}]},
  {"k": "box", "kind": "analogy", "label": "Think of it like this", "lines": [[{"t": "A kettle coming to the boil goes quiet just before it whistles. Tightness means sellers have stopped dumping stock and buyers are quietly absorbing whatever appears. The disagreement has been settled without a fight."}]]},
  {"k": "h3", "t": "2. Volume drying up during the consolidation"},
  {"k": "p", "r": [{"t": "Volume should fall away as the base forms. This is the most under appreciated of the four."}]},
  {"k": "box", "kind": "analogy", "label": "Think of it like this", "lines": [[{"t": "Low volume in a base means almost nobody left wants to sell at these prices. The weak holders have already gone. When there is no supply left, it takes very little demand to move the price sharply."}]]},
  {"k": "h3", "t": "3. Range expansion on the break"},
  {"k": "p", "r": [{"t": "The breakout day should be visibly wider than the recent quiet days. A stock that has moved 1 percent a day for a month and then moves 6 percent has changed character, and that change is the signal."}]},
  {"k": "h3", "t": "4. A volume spike on the pivot break"},
  {"k": "p", "r": [{"t": "The pivot is the price at the top of the base, the level that must be cleared. When it is cleared, volume should surge well above the recent average, ideally by a wide margin."}]},
  {"k": "box", "kind": "rule", "label": "The rule to remember", "lines": [[{"t": "This is the single best filter for a false breakout. ", "b": 1}, {"t": "A pivot break on ordinary volume means a handful of orders lifted the price with nobody behind it, and those fail regularly. A pivot break on volume several times the recent average means institutions are buying, and they cannot buy their full position in one day, which is what gives the move follow through."}]]},
  {"k": "box", "kind": "note", "label": "Putting the four together", "lines": [[{"t": "A textbook setup reads: several weeks of quiet, narrow trading (tight range), on steadily falling volume (dry up), followed by one day that is both much wider than usual (range expansion) and traded on far heavier volume than usual (volume spike), closing above the pivot."}], [{"t": "Entry above the pivot. Stop loss below the low of the base. Target measured by adding the base height to the pivot. If the stock closes back inside the base, the setup has failed and the trade is over, however good the story sounded."}]]},
  {"k": "fig", "id": "base"},
  {"k": "h1", "t": "Part 5. The Multi Asset Ecosystem"},
  {"k": "h2", "t": "5.1 Futures and Options: Derivatives Without The Jargon"},
  {"k": "p", "r": [{"t": "A derivative is a contract whose value is derived from something else, such as a share or an index. You are not buying the thing. You are buying an agreement about the thing."}]},
  {"k": "h3", "t": "Futures: an agreement to trade later at a price fixed today"},
  {"k": "box", "kind": "analogy", "label": "Think of it like this", "lines": [[{"t": "You agree in January to buy a flat in June for 50 lakh, and you pay a token amount now to lock the deal. In June you must complete the purchase at 50 lakh, whatever the flat is then worth. If it is worth 60 lakh you have done well. If it is worth 40 lakh you must still pay 50 lakh."}], [{"t": "That token amount is called margin. A futures contract works this way, and the obligation runs in both directions."}]]},
  {"k": "p", "r": [{"t": "The critical part is that the token is small relative to the contract. You might control 10 lakh of exposure with 1.5 lakh of margin. This is leverage."}]},
  {"k": "h3", "t": "Options: paying for a choice, not an obligation"},
  {"k": "box", "kind": "analogy", "label": "Think of it like this", "lines": [[{"t": "An option is an insurance policy. You pay a small premium for the right to do something later. If you never need it, you lose only the premium. If you do need it, it pays out."}], [{"t": "The buyer of an option is the person taking out insurance: limited, known loss (the premium), with a large possible gain."}], [{"t": "The seller of an option is the insurance company: they collect the premium every time, and in exchange they carry a very large risk on the rare occasion things go badly wrong."}]]},
  {"k": "p", "r": [{"t": "A call option is the right to buy at a set price. A put option is the right to sell at a set price. The price you pay for that right is the premium, and it decays away as the expiry date approaches, which is a cost that works against option buyers every single day."}]},
  {"k": "h3", "t": "Why leverage cuts both ways"},
  {"k": "box", "kind": "caution", "label": "Careful here", "lines": [[{"t": "With five times leverage, a 20 percent move against you does not cost 20 percent of your capital. It removes all of it."}], [{"t": "Ordinary share investing lets you be wrong and wait. Leveraged positions do not, because losses are settled continuously and a margin call forces you out at the worst moment, often just before the move you predicted actually arrives."}], [{"t": "Indian regulators publish data showing that the large majority of individual traders lose money in derivatives. This is not a warning about being careless. It is the base rate. Learn ordinary investing thoroughly first, and treat derivatives as an advanced subject to approach much later, if at all."}]]},
  {"k": "h2", "t": "5.2 Commodities and Currency"},
  {"k": "p", "r": [{"t": "These are not separate worlds. They feed directly into Indian share prices, as Part 1 explained."}]},
  {"k": "table", "head": [[{"t": "Asset", "b": 1}], [{"t": "What drives it", "b": 1}], [{"t": "Its effect on Indian markets", "b": 1}]], "rows": [[[{"t": "Gold"}], [{"t": "Fear, real interest rates, and the strength of the US dollar"}], [{"t": "Behaves as insurance. It often rises when shares fall, which is why a small allocation smooths the ride."}]], [[{"t": "Silver"}], [{"t": "Both an industrial metal and a store of value"}], [{"t": "More volatile than gold, because industrial demand rises and falls with the economy."}]], [[{"t": "Crude oil"}], [{"t": "Global supply decisions and world growth"}], [{"t": "India imports most of it. Higher crude means a weaker rupee, higher inflation, and pressure on paints, tyres, airlines and logistics."}]], [[{"t": "USD to INR"}], [{"t": "Trade balance, foreign investment flows, and the RBI"}], [{"t": "A weaker rupee helps exporters (software services, pharmaceuticals) and hurts importers and anyone with foreign currency debt."}]]]},
  {"k": "box", "kind": "analogy", "label": "Think of it like this", "lines": [[{"t": "Gold is the umbrella you keep in the cupboard. On most days it does nothing at all, and you do not buy it expecting daily returns. You hold it for the day the weather turns, and that is precisely when it earns its place."}]]},
  {"k": "h2", "t": "5.3 Cryptocurrency"},
  {"k": "p", "r": [{"t": "Cryptocurrencies are digital assets recorded on a shared public ledger. It is worth being exact about how they differ from shares, because the two are often discussed as though they were the same activity."}]},
  {"k": "table", "head": [[], [{"t": "A share", "b": 1}], [{"t": "A cryptocurrency", "b": 1}]], "rows": [[[{"t": "What you own"}], [{"t": "A legal slice of a real business"}], [{"t": "A digital token, with no claim on any business"}]], [[{"t": "Where value comes from"}], [{"t": "Profits, assets and dividends"}], [{"t": "Only what the next buyer will pay"}]], [[{"t": "Can you value it?"}], [{"t": "Yes, using earnings and cash flow"}], [{"t": "There is no earnings based method. Price is sentiment"}]], [[{"t": "Trading hours"}], [{"t": "Exchange hours on working days"}], [{"t": "All day, every day, including festivals"}]], [[{"t": "Regulation in India"}], [{"t": "SEBI regulated, with investor protection"}], [{"t": "Not regulated as a security. Far less protection"}]], [[{"t": "Indian tax (as things stand)"}], [{"t": "Capital gains rules, losses can be set off"}], [{"t": "Flat 30 percent on gains, 1 percent TDS, and losses cannot be set off against other income"}]]]},
  {"k": "box", "kind": "caution", "label": "Careful here", "lines": [[{"t": "That tax treatment deserves a second read. Losses in crypto cannot be set off against other gains, which means an active trader can end up paying tax on winning trades while receiving no relief for losing ones. Confirm the current rules before you act, as they change."}], [{"t": "Volatility of 20 to 30 percent in a week is ordinary here, not exceptional. Position sizes should reflect that."}]]},
  {"k": "h2", "t": "5.4 Global Indices and Why Your Morning Starts in New York"},
  {"k": "p", "r": [{"t": "The S&P 500 tracks 500 large American companies. The Nasdaq is more concentrated in technology. Together they set the tone for risk appetite worldwide."}]},
  {"k": "p", "r": [{"t": "The sequence of a typical Indian trading day, in time order:"}]},
  {"k": "table", "head": [[{"t": "Time (India)", "b": 1}], [{"t": "What is happening", "b": 1}], [{"t": "Why you care", "b": 1}]], "rows": [[[{"t": "Previous night"}], [{"t": "US markets trade and close (roughly 2am India time)"}], [{"t": "The largest pool of global capital decides its mood"}]], [[{"t": "Early morning"}], [{"t": "Asian markets open, GIFT Nifty trades"}], [{"t": "GIFT Nifty is an Indian index traded across extended hours. It is the clearest early hint of our opening"}]], [[{"t": "9:15am"}], [{"t": "Nifty 50 and Sensex open"}], [{"t": "Often gapping up or down to match what was already decided overnight"}]], [[{"t": "Through the day"}], [{"t": "Indian news, results and flows take over"}], [{"t": "The overnight cue fades and domestic reality reasserts itself"}]]]},
  {"k": "box", "kind": "analogy", "label": "Think of it like this", "lines": [[{"t": "Global markets are a single large pond with connected channels. When somebody drops a heavy stone in the American end at 2am, the ripple reaches the Indian end by the time you open your app, whether or not anything changed in India."}]]},
  {"k": "p", "r": [{"t": "This is why a strong Indian company can open three percent lower on a day when nothing whatsoever happened to that company. Understanding this prevents a great deal of panic, and stops you selling a good holding because of somebody else’s news."}]},
  {"k": "h1", "t": "Part 6. Before You Place A Single Trade"},
  {"k": "p", "r": [{"t": "Everything so far helps you choose. This part decides whether you are still in the game in five years. It is short, it is unglamorous, and it matters more than every indicator in Part 4 combined."}]},
  {"k": "h2", "t": "6.1 Risk A Fixed, Small Amount"},
  {"k": "p", "r": [{"t": "Decide in advance the most you are willing to lose on any single idea, and make it a small percentage of your total capital, commonly one to two percent."}]},
  {"k": "box", "kind": "analogy", "label": "Think of it like this", "lines": [[{"t": "If you risk 2 percent per idea, you can be wrong ten times in a row and still have roughly 80 percent of your money, which is easily recoverable. If you risk 25 percent per idea, four mistakes end you."}], [{"t": "Nobody is right ten times out of ten. Plan for being wrong, because you will be."}]]},
  {"k": "h2", "t": "6.2 Write The Stop Loss Before You Enter"},
  {"k": "p", "r": [{"t": "A stop loss is the price at which you accept that the idea was wrong and you leave. Decide it before you buy, when you are calm and have no money at stake."}]},
  {"k": "ul", "items": [[{"t": "Place it where the setup is proved wrong (below the base, below the engulfing candle, below the trendline), not at an amount that merely feels tolerable."}], [{"t": "Give it room using ATR, as Part 4.9 explained. Roughly 1.5 to 3 times ATR keeps ordinary daily noise from knocking you out."}], [{"t": "Then honour it. A stop loss you move away from as price approaches is not a stop loss, it is a wish."}]]},
  {"k": "h2", "t": "6.3 Judge Risk Against Reward, Not Against Hope"},
  {"k": "p", "r": [{"t": "Before entering, compare how much you stand to lose to your stop against how much you reasonably expect to gain to your target."}]},
  {"k": "box", "kind": "rule", "label": "The rule to remember", "lines": [[{"t": "Below 1 to 1.5 is usually not worth taking. At 1 to 3, you can be right less than half the time and still make money over many trades. It is tempting to chase a high strike rate. Professionals chase a favourable ratio instead, and accept being wrong often."}]]},
  {"k": "fig", "id": "rr"},
  {"k": "h2", "t": "6.4 A Short Checklist Before Any Trade"},
  {"k": "table", "head": [[{"t": "Question", "b": 1}], [{"t": "If the answer is no", "b": 1}]], "rows": [[[{"t": "Would I want to own this business if the chart did not exist?"}], [{"t": "Reconsider. A chart is not a reason to own a bad company."}]], [[{"t": "Is ADX above 20, so the market is actually trending?"}], [{"t": "Stand aside. Below 20 the signals are unreliable."}]], [[{"t": "Did volume confirm the breakout or the pattern?"}], [{"t": "Treat it as a likely trap and wait."}]], [[{"t": "Have I written down my stop loss price?"}], [{"t": "Do not enter until you have."}]], [[{"t": "Is my risk to reward at least 1 to 1.5?"}], [{"t": "Skip it. Another opportunity will come."}]], [[{"t": "Is this position small enough that being wrong is survivable?"}], [{"t": "Reduce the size until it is."}]]]},
  {"k": "h2", "t": "6.5 The Honest Summary"},
  {"k": "p", "r": [{"t": "Fundamental analysis tells you what is worth owning. Technical analysis helps you decide when to act. Indicators summarise the chart, and every one of them is describing the past. Risk management is the only part of this document that is fully within your control, and it is the part that determines whether you are still investing in ten years."}]},
  {"k": "p", "r": [{"t": "Learn one indicator properly rather than twelve superficially. Start with ADX, because knowing when to do nothing is worth more than any signal telling you to act."}]},
  {"k": "box", "kind": "caution", "label": "Important disclaimer", "lines": [[{"t": "This guide is educational material only. It is not investment advice, and it is not a recommendation to buy or sell any security."}], [{"t": "MiyeeStock Buddy and its author are not registered with SEBI as an Investment Adviser or Research Analyst. Company names appear only as familiar illustrations of a concept, never as recommendations."}], [{"t": "Indicators, patterns and ratios describe what has already happened. They do not predict the future. Markets can and do behave in ways no indicator anticipated."}], [{"t": "Every investment decision, and every consequence of it, is yours alone. Please consult a SEBI registered adviser before acting, and never invest money you cannot afford to lose."}]]},
];


// ── figures ────────────────────────────────────────────────────────────────
// Inline SVG, drawn from these functions rather than shipped as images: the app
// is a single offline file with no CDN, so a PNG would have to be a base64 blob
// that cannot answer to the theme. These scale, restyle with the palette, and
// cost a few hundred bytes each.
//
// Colour rules, since these teach as much as they decorate:
//   Up and down keep the green/red the market expects, but the two steps were
//   picked so they stay apart under deuteranopia (ΔE 10.6 light, 10.9 dark,
//   against a floor of 8) rather than the usual pair, which measures 4.1 and is
//   a coin toss for roughly one man in twelve. Every up/down mark also carries a
//   shape channel (hollow body versus filled) and a written label, so the colour
//   is never the only thing saying which is which.
//   Text stays in the guide's text tokens. Only marks wear the series colours.

const _F = {                                   // shared geometry helpers
  // A polyline through [x,y] pairs.
  pl: (pts, o = {}) => `<polyline points="${pts.map(p => p.join(',')).join(' ')}" fill="none"`
    + ` stroke="${o.c || 'var(--ln-s1)'}" stroke-width="${o.w || 2}"`
    + ` stroke-linejoin="round" stroke-linecap="round"${o.d ? ` stroke-dasharray="${o.d}"` : ''} />`,
  ln: (x1, y1, x2, y2, o = {}) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"`
    + ` stroke="${o.c || 'var(--ln-grid)'}" stroke-width="${o.w || 1}"`
    + `${o.d ? ` stroke-dasharray="${o.d}"` : ''} stroke-linecap="round" />`,
  // Text always in an ink token, never a series colour.
  tx: (x, y, s, o = {}) => `<text x="${x}" y="${y}" font-size="${o.s || 11}"`
    + ` fill="${o.c || 'var(--ln-ink2)'}" text-anchor="${o.a || 'start'}"`
    + `${o.w ? ` font-weight="${o.w}"` : ''}>${_lnEsc(s)}</text>`,
  // Dot with the 2px surface ring that keeps it legible over a line.
  dot: (x, y, c, r) => `<circle cx="${x}" cy="${y}" r="${r || 4.5}" fill="${c}"`
    + ` stroke="var(--ln-page)" stroke-width="2" />`,
  // One candle. up=true draws a hollow body, so the direction survives without
  // colour; the wick runs the full high-to-low range behind it.
  candle: (x, hi, lo, o1, c1, up, w) => {
    const col = up ? 'var(--ln-up)' : 'var(--ln-down)';
    const top = Math.min(o1, c1), h = Math.max(2, Math.abs(c1 - o1)), ww = w || 13;
    return `<line x1="${x}" y1="${hi}" x2="${x}" y2="${lo}" stroke="${col}" stroke-width="2" stroke-linecap="round" />`
      + `<rect x="${x - ww / 2}" y="${top}" width="${ww}" height="${h}" rx="1.5"`
      + ` fill="${up ? 'var(--ln-page)' : col}" stroke="${col}" stroke-width="2" />`;
  },
};

// A figure is an <svg> plus a caption. The caption is the alt text too: the
// diagram repeats a point the prose has already made, so a reader who cannot
// see it loses nothing.
function _lnFig(title, viewBox, body, caption, legend) {
  return '<figure class="ln-fig">'
    + `<svg viewBox="${viewBox}" role="img" aria-label="${_lnEsc(caption)}" preserveAspectRatio="xMidYMid meet">`
    + `<title>${_lnEsc(title)}</title>${body}</svg>`
    + (legend ? `<div class="ln-fig-key">${legend}</div>` : '')
    + `<figcaption>${_lnEsc(caption)}</figcaption></figure>`;
}
const _lnKey = items => items.map(([c, t, shape]) =>
  `<span class="ln-key"><span class="ln-key-m ln-key-${shape || 'bar'}" style="--k:${c}"></span>${_lnEsc(t)}</span>`).join('');

const LEARN_FIGS = {

  // 3.2 Candlestick anatomy.
  candle() {
    const { candle, ln, tx } = _F;
    let s = candle(150, 28, 150, 118, 58, true) + candle(360, 32, 152, 62, 124, false);
    // Leaders run outward from the annotated candle only, so nothing crosses a
    // mark or another label.
    const lead = (x1, y1, x2, y2) => ln(x1, y1, x2, y2, { c: 'var(--ln-grid)' });
    s += lead(158, 28, 186, 28) + tx(191, 32, 'High');
    s += lead(158, 150, 186, 150) + tx(191, 154, 'Low');
    s += lead(142, 58, 108, 58) + tx(103, 62, 'Close', { a: 'end' });
    s += lead(142, 118, 108, 118) + tx(103, 122, 'Open', { a: 'end' });
    s += tx(150, 176, 'Close above open', { a: 'middle', w: 700, c: 'var(--ln-ink)' });
    s += tx(150, 190, 'buyers finished ahead', { a: 'middle' });
    s += tx(360, 176, 'Close below open', { a: 'middle', w: 700, c: 'var(--ln-ink)' });
    s += tx(360, 190, 'sellers finished ahead', { a: 'middle' });
    return _lnFig('Candlestick anatomy', '0 0 470 200', s,
      'One candle packs four prices into a shape: the body runs from open to close, and the thin wicks reach the high and the low. A hollow body closed up, a filled body closed down.',
      _lnKey([['var(--ln-up)', 'Closed up (hollow)', 'hollow'], ['var(--ln-down)', 'Closed down (filled)', 'bar']]));
  },

  // 3.3 / 4.10 Support, resistance and a breakout on volume.
  breakout() {
    const { pl, ln, tx, dot } = _F;
    const R = 46, S = 128;                       // resistance and support levels
    const path = [[20,120],[48,74],[76,110],[104,50],[132,96],[160,52],[188,104],[216,50],[248,44],[286,30],[320,22],[352,18]];
    let s = '';
    s += ln(16, R, 400, R, { c: 'var(--ln-down)', w: 2, d: '6 5' }) + tx(404, R + 4, 'Resistance', { c: 'var(--ln-ink2)' });
    s += ln(16, S, 400, S, { c: 'var(--ln-up)', w: 2, d: '6 5' }) + tx(404, S + 4, 'Support', { c: 'var(--ln-ink2)' });
    s += pl(path, { c: 'var(--ln-s1)' });
    s += dot(216, 50, 'var(--ln-s1)');
    s += ln(216, 44, 216, 24, { c: 'var(--ln-grid)' });
    s += tx(216, 18, 'Breaks out', { a: 'middle', w: 700, c: 'var(--ln-ink)' });
    // Volume, one bar per touch; the breakout bar is the tall one.
    const vol = [[48,10],[104,13],[160,11],[216,34],[286,26],[352,20]];
    vol.forEach(([x, h]) => { s += `<rect x="${x - 6}" y="${188 - h}" width="12" height="${h}" rx="3"`
      + ` fill="${x === 216 ? 'var(--ln-s1)' : 'var(--ln-grid)'}" />`; });
    s += ln(16, 188, 400, 188, { c: 'var(--ln-grid)' });
    s += tx(16, 166, 'Volume', { s: 10 });
    s += tx(216, 202, 'on heavy volume', { a: 'middle', s: 10 });
    return _lnFig('Resistance, then a breakout', '0 0 470 210', s,
      'Price bumps the same ceiling three times and falls back each time. The fourth attempt closes above it on much heavier volume, which is what separates a real breakout from a trap. The old ceiling then tends to act as the new floor.');
  },

  // 4.5 Moving averages and the golden cross.
  ma() {
    const { pl, ln, tx, dot } = _F;
    const price = [[20,128],[52,140],[84,118],[116,132],[148,104],[180,116],[212,86],[244,96],[276,62],[308,74],[340,44],[372,52],[400,34]];
    const s50   = [[20,140],[52,142],[84,138],[116,134],[148,130],[180,126],[212,122],[244,118],[276,106],[308,96],[340,80],[372,70],[400,58]];
    const s200  = [[20,116],[52,118],[84,120],[116,122],[148,124],[180,124],[212,122],[244,118],[276,112],[308,106],[340,100],[372,94],[400,88]];
    let s = ln(16, 152, 410, 152, { c: 'var(--ln-grid)' });
    s += pl(s200, { c: 'var(--ln-s3)' }) + pl(s50, { c: 'var(--ln-s2)' }) + pl(price, { c: 'var(--ln-s1)', w: 2 });
    s += dot(244, 118, 'var(--ln-s2)', 5);
    s += ln(244, 124, 244, 158, { c: 'var(--ln-grid)' });
    s += tx(244, 172, 'Golden cross', { a: 'middle', w: 700, c: 'var(--ln-ink)' });
    s += tx(244, 186, 'the 50 day crosses above the 200 day', { a: 'middle', s: 10 });
    return _lnFig('Moving averages and the golden cross', '0 0 424 194', s,
      'The longer the average, the slower and steadier the line. When the 50 day average crosses above the 200 day, the market is widely read as having shifted into a longer term uptrend.',
      _lnKey([['var(--ln-s1)', 'Price', 'line'], ['var(--ln-s2)', 'SMA 50', 'line'], ['var(--ln-s3)', 'SMA 200', 'line']]));
  },

  // 4.1 RSI as a meter.
  rsi() {
    const { ln, tx } = _F;
    const X = 30, W = 360, Y = 40, H = 22, at = v => X + (v / 100) * W;
    let s = `<rect x="${X}" y="${Y}" width="${W}" height="${H}" rx="6" fill="var(--ln-track)" />`;
    s += `<rect x="${X}" y="${Y}" width="${at(30) - X}" height="${H}" rx="6" fill="var(--ln-up)" opacity="0.5" />`;
    s += `<rect x="${at(70)}" y="${Y}" width="${X + W - at(70)}" height="${H}" rx="6" fill="var(--ln-down)" opacity="0.5" />`;
    [0, 30, 50, 70, 100].forEach(v => {
      s += ln(at(v), Y + H, at(v), Y + H + 5, { c: 'var(--ln-grid)' });
      s += tx(at(v), Y + H + 18, String(v), { a: 'middle', s: 10 });
    });
    s += tx(at(15), Y - 8, 'Oversold', { a: 'middle', w: 700, c: 'var(--ln-ink)' });
    s += tx(at(50), Y - 8, 'No one in control', { a: 'middle', c: 'var(--ln-ink2)' });
    s += tx(at(85), Y - 8, 'Overbought', { a: 'middle', w: 700, c: 'var(--ln-ink)' });
    // A reading, marked once. Labelling every step would be noise.
    const v = 78;
    s += _F.dot(at(v), Y + H / 2, 'var(--ln-s1)', 5);
    s += ln(at(v), Y + H + 24, at(v), Y + H + 32, { c: 'var(--ln-grid)' });
    s += tx(at(100), Y + H + 44, 'A reading of 78: stretched, not finished', { a: 'end', s: 10 });
    return _lnFig('The RSI meter', '0 0 420 100', s,
      'RSI is a speedometer, not a steering wheel. Above 70 the move is stretched and often pauses; below 30 it is washed out and often bounces. Neither is an automatic instruction to trade.');
  },

  // 4.3 ADX zones. The one figure the guide most wants read.
  adx() {
    const { ln, tx } = _F;
    const X = 26, W = 384, Y = 34, H = 26, at = v => X + (v / 60) * W;
    const band = (a, b, fill, op) => `<rect x="${at(a)}" y="${Y}" width="${at(b) - at(a) - 2}" height="${H}"`
      + ` rx="4" fill="${fill}"${op ? ` opacity="${op}"` : ''} />`;
    let s = band(0, 20, 'var(--ln-warn)', 0.55) + band(20, 25, 'var(--ln-track)')
          + band(25, 40, 'var(--ln-s1)', 0.45) + band(40, 60, 'var(--ln-s1)', 0.8);
    [0, 20, 25, 40, 60].forEach(v => {
      s += ln(at(v), Y + H, at(v), Y + H + 5, { c: 'var(--ln-grid)' });
      s += tx(at(v), Y + H + 18, String(v), { a: 'middle', s: 10 });
    });
    s += tx(at(10), Y + 17, 'HOLD', { a: 'middle', w: 800, s: 12, c: 'var(--ln-ink)' });
    s += tx(at(10), Y - 8, 'No trend, choppy', { a: 'middle', w: 700, c: 'var(--ln-ink)' });
    s += tx(at(22.5), Y - 8, 'Weak', { a: 'middle', s: 10 });
    s += tx(at(32.5), Y - 8, 'Real trend', { a: 'middle', w: 700, c: 'var(--ln-ink)' });
    s += tx(at(50), Y - 8, 'Very strong', { a: 'middle', w: 700, c: 'var(--ln-ink)' });
    s += tx(at(10), Y + H + 36, 'Trend signals misfire here', { a: 'middle', s: 10 });
    s += tx(at(40), Y + H + 36, 'Trend signals carry weight here', { a: 'middle', s: 10 });
    return _lnFig('What ADX is telling you', '0 0 436 92', s,
      'ADX answers whether there is a road here at all, not which way it points. Below 20 the market is choppy, trend signals misfire, and doing nothing is usually the winning move.');
  },

  // 4.11 Fibonacci retracement.
  fib() {
    const { pl, ln, tx } = _F;
    const lo = 150, hi = 30, at = p => hi + (lo - hi) * p;
    let s = '';
    [[0, '0%'], [0.236, '23.6%'], [0.382, '38.2%'], [0.5, '50%'], [0.618, '61.8%'], [0.786, '78.6%'], [1, '100%']].forEach(([p, t]) => {
      const y = at(p), key = p === 0.5 || p === 0.618;
      s += ln(150, y, 370, y, { c: key ? 'var(--ln-s1)' : 'var(--ln-grid)', d: key ? '' : '4 4' });
      s += tx(376, y + 4, t, { s: 10, w: key ? 700 : 400, c: key ? 'var(--ln-ink)' : 'var(--ln-ink2)' });
    });
    s += pl([[20, lo], [60, 120], [95, 96], [125, 52], [150, hi]], { c: 'var(--ln-s1)' });
    s += pl([[150, hi], [175, 62], [200, 52], [225, at(0.618)]], { c: 'var(--ln-s2)' });
    s += pl([[225, at(0.618)], [255, 74], [290, 58], [330, 34], [366, 22]], { c: 'var(--ln-s1)' });
    s += _F.dot(225, at(0.618), 'var(--ln-s2)');
    s += tx(84, 168, 'The move', { a: 'middle', s: 10 });
    s += tx(200, 168, 'Pullback', { a: 'middle', s: 10 });
    s += tx(300, 168, 'Trend resumes', { a: 'middle', s: 10 });
    return _lnFig('Fibonacci retracement levels', '0 0 430 178', s,
      'After a strong move, price rarely travels back in a straight line. It pauses at levels traders everywhere are watching. The 50 and 61.8 percent steps are where healthy pullbacks usually end.',
      _lnKey([['var(--ln-s1)', 'Trend', 'line'], ['var(--ln-s2)', 'Pullback', 'line']]));
  },

  // 4.9 ATR and the width of a sensible stop.
  atr() {
    const { ln, tx } = _F;
    const PX = 1.6;                              // pixels per rupee, both panels
    const draw = (cx, label, atr, note) => {
      const entry = 70, jitter = atr * PX, stop = entry + atr * 2 * PX;
      let g = tx(cx, 18, label, { a: 'middle', w: 700, c: 'var(--ln-ink)' });
      // The daily range as a band around entry, so "2x ATR" is visibly outside it.
      g += `<rect x="${cx - 46}" y="${entry - jitter}" width="92" height="${jitter * 2}" rx="4"`
        + ` fill="var(--ln-s1)" opacity="0.14" />`;
      g += ln(cx - 52, entry, cx + 52, entry, { c: 'var(--ln-s1)', w: 2 });
      g += tx(cx + 56, entry + 4, 'Entry', { s: 10 });
      g += ln(cx - 52, stop, cx + 52, stop, { c: 'var(--ln-down)', w: 2, d: '6 5' });
      g += tx(cx + 56, stop + 4, 'Stop', { s: 10 });
      g += ln(cx - 40, entry, cx - 40, stop, { c: 'var(--ln-grid)' });
      g += tx(cx - 44, (entry + stop) / 2 + 4, '2x ATR', { a: 'end', s: 10 });
      g += tx(cx, 190, note, { a: 'middle', s: 10 });
      return g;
    };
    let s = draw(110, 'Calm stock, ATR ' + String.fromCharCode(8377) + '4', 4, 'A stop 8 rupees out clears the noise');
    s += draw(330, 'Jumpy stock, ATR ' + String.fromCharCode(8377) + '25', 25, 'The same 8 rupees is inside one day');
    s += ln(220, 26, 220, 168, { c: 'var(--ln-grid)' });
    return _lnFig('Why a stop is measured in ATR, not rupees', '0 0 440 200', s,
      'The shaded band is a normal day for each stock. A stop closer than one ATR sits inside the noise and gets hit for reasons that have nothing to do with your idea being wrong.');
  },

  // 6.3 Risk against reward.
  rr() {
    const { ln, tx } = _F;
    const X = 120, entry = 146, RISK = 42, stop = entry + RISK, target = entry - RISK * 3;
    let s = `<rect x="${X}" y="${entry}" width="150" height="${stop - entry}" rx="4" fill="var(--ln-down)" opacity="0.22" />`;
    s += `<rect x="${X}" y="${target}" width="150" height="${entry - target}" rx="4" fill="var(--ln-up)" opacity="0.22" />`;
    s += ln(X - 10, entry, X + 160, entry, { c: 'var(--ln-s1)', w: 2 });
    s += ln(X - 10, stop, X + 160, stop, { c: 'var(--ln-down)', w: 2, d: '6 5' });
    s += ln(X - 10, target, X + 160, target, { c: 'var(--ln-up)', w: 2, d: '6 5' });
    s += tx(X - 16, entry + 4, 'Entry ' + String.fromCharCode(8377) + '1,000', { a: 'end', w: 700, c: 'var(--ln-ink)' });
    s += tx(X - 16, stop + 4, 'Stop ' + String.fromCharCode(8377) + '950', { a: 'end' });
    s += tx(X - 16, target + 4, 'Target ' + String.fromCharCode(8377) + '1,150', { a: 'end' });
    s += tx(X + 168, (entry + stop) / 2 + 4, 'Risk 1', { w: 700, c: 'var(--ln-ink)' });
    s += tx(X + 168, (entry + target) / 2 + 4, 'Reward 3', { w: 700, c: 'var(--ln-ink)' });
    s += tx(X + 75, 212, 'At 1 to 3 you can be right less than half the time and still make money', { a: 'middle', s: 10 });
    return _lnFig('Risk against reward', '0 0 440 224', s,
      'Measure what you lose if the stop is hit against what you gain if the target is reached. Below 1 to 1.5 the trade is usually not worth taking, however good the story sounds.');
  },

  // 4.12 The base: tight range, volume drying up, then the pivot break.
  base() {
    const { pl, ln, tx } = _F;
    const pivot = 56;
    let s = ln(120, pivot, 300, pivot, { c: 'var(--ln-s2)', w: 2, d: '6 5' });
    s += tx(304, pivot + 4, 'Pivot', { s: 10, w: 700, c: 'var(--ln-ink)' });
    s += pl([[20,116],[46,88],[72,64],[98,58],[124,66],[150,60],[176,68],[202,62],[228,66],[254,60],[280,52],[310,28],[340,20]], { c: 'var(--ln-s1)' });
    s += `<rect x="112" y="54" width="150" height="20" rx="4" fill="var(--ln-s1)" opacity="0.12" />`;
    s += tx(187, 92, 'Tight range, under 10 percent', { a: 'middle', s: 10 });
    const vol = [[26,26],[52,22],[78,18],[104,14],[130,10],[156,8],[182,7],[208,6],[234,6],[260,7],[292,34],[326,28]];
    vol.forEach(([x, h]) => { s += `<rect x="${x - 5}" y="${168 - h}" width="10" height="${h}" rx="3"`
      + ` fill="${x >= 292 ? 'var(--ln-s1)' : 'var(--ln-grid)'}" />`; });
    s += ln(16, 168, 350, 168, { c: 'var(--ln-grid)' });
    s += tx(16, 186, 'Volume', { s: 10 });
    s += tx(150, 186, 'drying up', { a: 'middle', s: 10 });
    s += tx(309, 186, 'then a spike', { a: 'middle', s: 10, w: 700, c: 'var(--ln-ink)' });
    return _lnFig('What a base looks like before it breaks', '0 0 380 196', s,
      'Weeks of narrow, quiet trading on falling volume means the sellers are finished. When there is no supply left, it takes very little demand to move the price sharply.');
  },
};

// ── rendering ──────────────────────────────────────────────────────────────
// The block model above is data, not markup, so every string that reaches the
// DOM is escaped here rather than trusted. Bold and italic are the only rich
// formatting the guide uses, and they are re-applied from the run flags.
function _lnEsc(s){
  return String(s == null ? '' : s)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;');
}
function _lnRuns(runs){
  return (runs || []).map(r => {
    let h = _lnEsc(r.t);
    if (r.b) h = '<b>' + h + '</b>';
    if (r.i) h = '<i>' + h + '</i>';
    return h;
  }).join('');
}
function _lnText(runs){ return (runs || []).map(r => r.t).join(''); }

// Stable, readable anchors so a heading can be linked to and returned to.
function _lnSlug(t){
  return 'ln-' + String(t).toLowerCase()
    .replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0,60);
}

function _lnBlockHTML(b){
  switch(b.k){
    case 'h2': return '<h3 class="ln-h2" id="' + _lnSlug(b.t) + '">' + _lnEsc(b.t) + '</h3>';
    case 'h3': return '<h4 class="ln-h3">' + _lnEsc(b.t) + '</h4>';
    case 'p':  return '<p class="ln-p">' + _lnRuns(b.r) + '</p>';
    case 'fig': return (typeof LEARN_FIGS[b.id] === 'function') ? LEARN_FIGS[b.id]() : '';
    case 'ul': return '<ul class="ln-ul">' + b.items.map(it => '<li>' + _lnRuns(it) + '</li>').join('') + '</ul>';
    case 'box': {
      const icon = b.kind === 'caution' ? '&#9888;&#65039;'
                 : b.kind === 'rule'    ? '&#128204;'
                 : b.kind === 'analogy' ? '&#128161;' : '&#8505;&#65039;';
      return '<div class="ln-box ln-box-' + b.kind + '">'
        + (b.label ? '<div class="ln-box-lbl">' + icon + ' ' + _lnEsc(b.label) + '</div>' : '')
        + b.lines.map(l => '<p>' + _lnRuns(l) + '</p>').join('')
        + '</div>';
    }
    case 'table': {
      const th = b.head.map(c => '<th>' + _lnRuns(c) + '</th>').join('');
      const tr = b.rows.map(r => '<tr>' + r.map(c => '<td>' + _lnRuns(c) + '</td>').join('') + '</tr>').join('');
      return '<div class="ln-tw"><table class="ln-tbl"><thead><tr>' + th + '</tr></thead><tbody>' + tr + '</tbody></table></div>';
    }
    default: return '';
  }
}

// Group the flat block list into parts (h1) and, inside each, groups (h2).
// Grouping is what makes both the contents rail and the search filter possible:
// a search hides whole groups rather than orphaning a heading from its body.
function _lnGroup(blocks){
  const parts = [];
  let part = null, grp = null;
  const newGrp = (title) => { grp = { title, id: title ? _lnSlug(title) : null, blocks: [] }; part.groups.push(grp); };
  for (const b of blocks){
    if (b.k === 'h1'){
      part = { title: b.t, id: _lnSlug(b.t), groups: [] };
      parts.push(part);
      newGrp(null);
      continue;
    }
    if (!part){ part = { title: null, id: 'ln-intro', groups: [] }; parts.push(part); newGrp(null); }
    if (b.k === 'h2'){ newGrp(b.t); continue; }
    grp.blocks.push(b);
  }
  return parts;
}

let _lnParts = null;

function renderLearn(){
  const body = document.getElementById('learn-body');
  const toc  = document.getElementById('learn-toc');
  if (!body || body.dataset.done === '1') return;
  _lnParts = _lnGroup(LEARN_BLOCKS);

  const secs = [], links = [];
  _lnParts.forEach((part, pi) => {
    const inner = part.groups.map(g => {
      const head = g.title ? '<h3 class="ln-h2" id="' + g.id + '">' + _lnEsc(g.title) + '</h3>' : '';
      const inner2 = g.blocks.map(_lnBlockHTML).join('');
      const hay = ((g.title || '') + ' ' + g.blocks.map(b =>
        b.k === 'table' ? b.head.concat(...b.rows).map(_lnText).join(' ')
        : b.k === 'ul'  ? b.items.map(_lnText).join(' ')
        : b.k === 'box' ? (b.label || '') + ' ' + b.lines.map(_lnText).join(' ')
        : b.k === 'fig' ? (b.cap || '')
        : b.t || _lnText(b.r)).join(' ')).toLowerCase();
      return '<div class="ln-grp" data-hay="' + _lnEsc(hay) + '">' + head + inner2 + '</div>';
    }).join('');
    secs.push('<section class="ln-part" data-part="' + pi + '">'
      + (part.title ? '<h2 class="ln-h1" id="' + part.id + '">' + _lnEsc(part.title) + '</h2>' : '')
      + inner + '</section>');
    if (!part.title) return;
    links.push('<a class="ln-toc-a" href="#' + part.id + '" onclick="return learnGoto(\'' + part.id + '\')">' + _lnEsc(part.title) + '</a>'
      + part.groups.filter(g => g.title).map(g =>
          '<a class="ln-toc-b" href="#' + g.id + '" onclick="return learnGoto(\'' + g.id + '\')">' + _lnEsc(g.title) + '</a>').join(''));
  });
  body.innerHTML = secs.join('');
  if (toc) toc.innerHTML = links.join('');
  body.dataset.done = '1';
  // Open on desktop, where the rail is the sticky contents column; folded on a
  // phone, where an unfolded one costs a screenful before the guide begins.
  const rail = document.getElementById('learn-rail');
  if (rail) rail.open = !(typeof window !== 'undefined' && window.innerWidth && window.innerWidth <= 940);
  _lnObserve();
}

// Highlight the contents entry for whatever is currently on screen.
function _lnObserve(){
  if (typeof IntersectionObserver !== 'function') return;
  const heads = document.querySelectorAll('#learn-body .ln-h1, #learn-body .ln-h2');
  if (!heads.length) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      document.querySelectorAll('#learn-toc a.on').forEach(a => a.classList.remove('on'));
      const a = document.querySelector('#learn-toc a[href="#' + e.target.id + '"]');
      if (a){ a.classList.add('on'); }
    });
  }, { rootMargin: '-70px 0px -75% 0px', threshold: 0 });
  heads.forEach(h => io.observe(h));
}

function learnGoto(id){
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior:'smooth', block:'start' });
  return false;
}

// Plain substring search over the pre-built haystack of each group. It hides
// rather than rebuilds, so scroll anchors and the contents rail stay valid.
function learnSearch(q){
  const term = String(q || '').trim().toLowerCase();
  const grps = document.querySelectorAll('#learn-body .ln-grp');
  let hits = 0;
  grps.forEach(g => {
    const show = !term || (g.dataset.hay || '').indexOf(term) >= 0;
    g.style.display = show ? '' : 'none';
    if (show && term) hits++;
  });
  document.querySelectorAll('#learn-body .ln-part').forEach(p => {
    const any = [...p.querySelectorAll('.ln-grp')].some(g => g.style.display !== 'none');
    p.style.display = any ? '' : 'none';
  });
  const note = document.getElementById('learn-searchnote');
  if (note){
    note.textContent = !term ? '' : hits ? (hits + ' section' + (hits === 1 ? '' : 's') + ' match "' + term + '"')
                                        : 'Nothing matches "' + term + '". Try a shorter word, for example "ADX" or "stop".';
    note.style.display = term ? 'block' : 'none';
  }
}

function learnClearSearch(){
  const i = document.getElementById('learn-search');
  if (i) i.value = '';
  learnSearch('');
  if (i) i.focus();
}
