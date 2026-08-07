# Planning docs — how we organize notes

> **Last updated:** 2026-07-29

For each Google Sheet / product area we keep **two kinds** of markdown:

| Kind | What it captures | Example |
|------|------------------|---------|
| **Sheet data** | Raw workbook structure: tabs, columns, balances, caveats from the spreadsheet | [`dec-to-feb-sheet.md`](./dec-to-feb-sheet.md), [`sub-vendor-partner-ledger.md`](./sub-vendor-partner-ledger.md), [`loans-ledgers.md`](./loans-ledgers.md) |
| **App UI / behaviour** | What we built (or plan to build) in the product: tabs, filters, column rules, UX | [`ui-our-projects.md`](./ui-our-projects.md), [`ui-shripal-sites.md`](./ui-shripal-sites.md), [`ui-partner-projects.md`](./ui-partner-projects.md) |

**Rules**

1. Sheet MDs stay focused on source data — update when the sheet changes or we learn more from analysis.
2. UI MDs stay focused on application requirements and behaviour — update when we change Projects UX / logic.
3. Cross-link both ways when they relate (e.g. Dec–Feb `MSS res` feeds **Our projects**).
4. Do not delete older decision-log entries — strike through if superseded.
