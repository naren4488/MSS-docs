# Planning docs — how we organize notes

> **Last updated:** 2026-08-09

For each Google Sheet / product area we keep **two kinds** of markdown:

| Kind | What it captures | Example |
|------|------------------|---------|
| **Sheet data** | Raw workbook structure: tabs, columns, balances, caveats from the spreadsheet | [`mss-sheet.md`](./mss-sheet.md), [`dec-to-feb-sheet.md`](./dec-to-feb-sheet.md), [`sub-vendor-partner-ledger.md`](./sub-vendor-partner-ledger.md), [`loans-ledgers.md`](./loans-ledgers.md) |
| **App UI / behaviour** | What we built (or plan to build) in the product: tabs, filters, column rules, UX | [`ui-our-projects.md`](./ui-our-projects.md), [`ui-shripal-sites.md`](./ui-shripal-sites.md), [`ui-ajay-sites.md`](./ui-ajay-sites.md), [`ui-satyanarayan-sites.md`](./ui-satyanarayan-sites.md), [`ui-rjgreen-sites.md`](./ui-rjgreen-sites.md), [`ui-partner-projects.md`](./ui-partner-projects.md) |
| **Implementation status** | Per-partner **done vs pending** in the codebase; open product questions | [`partner-implementation-status.md`](./partner-implementation-status.md) |

**Rules**

1. Sheet MDs stay focused on source data — update when the sheet changes or we learn more from analysis.
2. UI MDs stay focused on application requirements and behaviour — update when we change Projects UX / logic.
3. Cross-link both ways when they relate (e.g. MSS `MSS res` and Dec–Feb `MSS res` both feed **Our projects** — see [`mss-sheet.md`](./mss-sheet.md) vs [`dec-to-feb-sheet.md`](./dec-to-feb-sheet.md)).
4. Do not delete older decision-log entries — strike through if superseded.
5. **Done vs pending in the app** → update [`partner-implementation-status.md`](./partner-implementation-status.md) when a partner scope ships or new requirements are queued.
