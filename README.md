# AIStockAuditor
**AdvanceStockAnalyzer** — An offline-capable web app for investors, shipped as `index.html` plus one data file. Combines a **Stock Analyser** (Indian/US/Crypto markets, live charts, AI Entry/Exit signals) with a **Portfolio Manager** (track Equity, Crypto, MF, FD, P&amp;L, AI Hold/Exit/Harvest insights). No login required for stock analysis. The Portfolio Manager offers optional, invite-only sync via Firebase. Serve the folder over http, see Running it below.
📊 AdvanceStockAnalyzer — App Description
AdvanceStockAnalyzer is an all-in-one, offline-capable single-page web application built for Indian and global investors. It combines two powerful tools under one roof:

🔍 Stock Analyser
A real-time technical analysis engine supporting Indian, US, and Crypto markets. Enter any stock symbol to get live price data, interactive candlestick/line charts, and AI-powered signals including Entry, Exit, and Stop Loss levels, Fibonacci retracements, Bollinger Bands, SMA (20/50/200), ATR volatility, support/resistance zones, and multi-timeframe swing/short/long-term trade recommendations — all with currency-aware formatting (₹ or $).

💼 Portfolio Manager
A comprehensive personal portfolio tracker for India Equity, US Equity, Crypto, Mutual Funds, and FD/Bonds. Features include manual entry, CSV bulk import with sample templates, Yahoo Finance LTP fetch, P&L tracking, and a Portfolio Analysis tab with performance charts, concentration risk alerts, and currency exposure breakdown.

A built-in 🧠 AI Insights engine evaluates each holding and recommends Hold / Accumulate / Exit / Tax-Loss Harvest / Gain Harvest actions. The ⚙️ Data Management tab enables full JSON export/import, asset class clearing, and storage stats.

No server. No login. Runs entirely in your browser.

### Running it

Serve the folder over http rather than opening `index.html` by double-clicking it. The Indian company list lives in `india-stocks.json` beside the page, and browsers refuse to read a sibling file from a `file://` URL, so the stock search comes up empty that way (the app says so rather than failing silently). Any static host works:

```
python -m http.server 8000     # then open http://localhost:8000
```

GitHub Pages, Netlify or any static host serves it as-is. Keep `index.html` and `india-stocks.json` together.

### Refreshing the Indian company list

```
npm run stocks:refresh     # downloads from NSE and BSE, rewrites the list
node build.js              # copies it next to index.html
```

If the exchanges block the download, fetch the files in a browser and pass them in:

```
npm run stocks:refresh -- --nse ./EQUITY_L.csv --bse ./bse-scrips.csv
```

Rows are matched on ISIN and merged, so a company keeps its BSE code even though NSE's file does not carry one. Companies missing from a download are reported but never deleted, so a half-finished download cannot empty the list. Add `--dry-run` to see the changes without writing.
