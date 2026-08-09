# Planning: MSS site register sheet

> **Purpose:** Capture structure, tab analyses, and product decisions for the **MSS site register** Google Sheet (primary Projects workbook).  
> **Status:** Analysis in progress — tabs loaded in app; per-tab deep dives mostly TBD.  
> **Last updated:** 2026-08-09

Keep **this workbook’s** notes here only. Sister planning docs:

- Planning index → [`README.md`](./README.md)
- Dec–Feb / Arkshakti workbook (also has `MSS res`, partner tabs) → [`dec-to-feb-sheet.md`](./dec-to-feb-sheet.md)
- App UI: Our projects → [`ui-our-projects.md`](./ui-our-projects.md)
- App UI: Shripal / Ajay / Partner → [`ui-shripal-sites.md`](./ui-shripal-sites.md), [`ui-ajay-sites.md`](./ui-ajay-sites.md), [`ui-partner-projects.md`](./ui-partner-projects.md)
- Sub Vendor Payment → [`sub-vendor-partner-ledger.md`](./sub-vendor-partner-ledger.md)
- Loans Ledgers → [`loans-ledgers.md`](./loans-ledgers.md)

Append new instructions under [Decision log](#decision-log). Add one section per tab as we analyze them.

---

## Source spreadsheet

| Field | Value |
|-------|--------|
| Label (app) | MSS site register |
| Spreadsheet ID | `1fe4vitjQwMhw92QltKECwBylbJ8ORWK3TsaI6548SEg` |
| URL | https://docs.google.com/spreadsheets/d/1fe4vitjQwMhw92QltKECwBylbJ8ORWK3TsaI6548SEg |
| App config | `PROJECTS_SPREADSHEET_ID`, `PROJECT_SHEET_TABS`, `PROJECT_SHEET_SOURCE_RULES.mss` in `projects-config.ts` |
| Local snapshot | `tmp/mss-projects.xlsx` (analysis only; not source of truth) |
| Projects route | `/projects` |
| Vendor tag in app | `MSS` |

### Load rules (app)

Configured as an **explicit tab list** in `PROJECT_SHEET_TABS` (not “everything until tab X”). Comments in config describe intent: partner registers through **DHERAJ JI SITES**, excluding **summary** and **ALWAR SITES**.

**gviz caveat:** wrong tab name → API **silently returns `MSS res` data**. Tab 9 must be **`KAVITA MAM`** (not `KAVITA MAAM`).

---

## Workbook tabs (live audit 2026-08-09)

| # | Tab name (exact) | Rows w/ NAME | Loaded in app? | App scope (if loaded) |
|---|------------------|-------------:|----------------|------------------------|
| 1 | `MSS res` | 53 | Yes | **Our projects** |
| 2 | `SHRIPAL JI` | 32 | Yes | **Shripal sites** |
| 3 | `SATAYNARAYAN JI` | 23 | Yes | Partner projects |
| 4 | `Rohit (RJ GREEN)` | 10 | Yes | Partner projects |
| 5 | `CALL TEAM SITE` | 18 | No | — |
| 6 | `POORAN JI ` _(trailing space)_ | 3 | No | — |
| 7 | `Ajay (everest)` | 30 | Yes | **Ajay sites** |
| 8 | `RAVI JI SITES` | 6 | Yes | Partner projects |
| 9 | `ravi inc ` | 6 | No | — |
| 10 | `dilkhush inc ` | 2 | No | — |
| 11 | `ROHIT JI PHULERA` | 2 | Yes | Partner projects |
| 12 | `JITENDRA JI` | 1 | Yes | Partner projects |
| 13 | `KAVITA MAM` | 7 | Yes | Partner projects |
| 14 | `SUNNY JI` | 2 | Yes | Partner projects |
| 15 | `DHERAJ JI SITES` | 1 | Yes | Partner projects |
| 16 | `ALWAR SITES` | 22 | No (excluded) | — |
| 17 | `summary` | 9 | No (dashboard) | — |

**11 tabs loaded** · **129 named site rows** (MSS vendor only; merged with Arkshakti in app).

Same partner tab names often exist on the **Dec–Feb** workbook under vendor **Arkshakti** — see [`dec-to-feb-sheet.md`](./dec-to-feb-sheet.md). Row counts and columns can differ between workbooks.

---

## Common column layouts

### A) `MSS res` — our residential register

~**30** named columns (A–AD). No partner money columns.

| # | Header (live MSS res) |
|---|------------------------|
| 1 | NO |
| 2 | update |
| 3 | NAME |
| 4 | KW |
| 5 | PH |
| 6 | BANK |
| 7 | LOCATION |
| 8 | DISCOM |
| 9 | K.NO |
| 10 | MOBILE |
| 11 | GMAIL |
| 12 | GPS / LINK |
| 13 | QUATATION IN BANK |
| 14 | FINAL DEAL with client |
| 15 | LOAN |
| 16 | Cash |
| 17 | File login |
| 18 | SUBSIDY |
| 19 | BANK FILE/CASH |
| 20 | **WORK STATUS** |
| 21 | DISCOM WORK |
| 22 | PAYMENT STATUS |
| 23 | 1ST INSTALLMENT |
| 24 | 2ND INATALLMENT _(typo)_ |
| 25 | CASH TO MSS |
| 26 | Bank due |
| 27 | CASH DUE FROM CLIENT |
| 28 | NET DUE TO MSS |
| 29 | TOTAL Payment recieved _(typo)_ |
| 30 | REMARK |

Notes:

- Live MSS res has **BANK** (col 6); older Arkshakti `MSS res` snapshot used LOCATION in col 6 without BANK — column order differs slightly between workbooks.
- No `Deal with MSS` / `Payment with partner` / `Amount still with askshakti` on MSS **`MSS res`** (those appear on partner tabs or Arkshakti book).

### B) Partner tabs (e.g. `SHRIPAL JI`, `SATAYNARAYAN JI`, …)

Same pipeline columns plus partner money fields, typically:

- **DEAL WITH MSS** (between final deal and loan/cash)
- **CASH DUE TO MSS** / commission-style columns (position varies by tab)
- Often **Amount still with askshakti** / **Total amount** on wider tabs

App shows partner-only columns on Partner / Shripal / Ajay scopes; hides them on **Our projects**.

---

## Tab: `MSS res`

| Field | Value |
|-------|--------|
| Tab | `MSS res` |
| Position | First tab |
| Analyzed | 2026-08-09 (live MSS workbook) |

### Shape

| Metric | Value |
|--------|-------|
| Header row | Row 1 |
| Named columns | **30** (see table above) |
| Rows with NAME | **53** |
| Sheet max_row | ~977 (template space below) |

### Work status (column 20) — live values

**100% filled · 4 distinct values** (renamed since older Arkshakti-only analysis in `dec-to-feb-sheet.md`):

| Value | Count |
|-------|------:|
| `I&C Completed` | 23 |
| `Work Not Started Yet` | 20 |
| `Project On Hold` | 8 |
| `Structure Work` | 2 |

Older Dec–Feb / Arkshakti `MSS res` snapshot used different strings (`Panel`, `payment DUE`, `work not started`, `project on HOLD`) — **do not assume one enum across workbooks** until mapped.

---

## Other loaded tabs (TBD)

| Tab | Notes |
|-----|--------|
| `SHRIPAL JI` | Dedicated app tab; partner columns · see [`ui-shripal-sites.md`](./ui-shripal-sites.md) |
| `Ajay (everest)` | Dedicated app tab · Sub Vendor Payment dual ledger · [`ui-ajay-sites.md`](./ui-ajay-sites.md) |
| `SATAYNARAYAN JI` | Spelling vs Sub Vendor `SATYANARAYAN ` tab |
| `Rohit (RJ GREEN)` | Overlaps Sub Vendor / ledger naming variants |
| `RAVI JI SITES` | Small register |
| `JITENDRA JI` | Mostly empty rows |
| `KAVITA MAM` | Spelling critical for gviz |
| `SUNNY JI` | Small register |
| `ROHIT JI PHULERA` | Bright Solar flow · related Sub Vendor tab |
| `DHERAJ JI SITES` | Single site when read |

---

## Not loaded (candidates / skip)

| Tab | Why skipped today |
|-----|-------------------|
| `summary` | Dashboard — not site register |
| `ALWAR SITES` | Explicitly excluded in config |
| `CALL TEAM SITE` | Not in `PROJECT_SHEET_TABS` |
| `POORAN JI ` | Not in list |
| `ravi inc ` / `dilkhush inc ` | Not in list |

---

## Decision log

### 2026-08-09 — MSS sheet planning file created

- User noted there was no dedicated MD for the MSS workbook (only Dec–Feb, Sub Vendor, Loans).
- Created this file; live tab audit + `MSS res` column/work-status snapshot from Google Sheet.

### Upcoming

- [ ] Per-tab analysis for loaded partner registers
- [ ] Decide whether `CALL TEAM SITE`, `POORAN JI`, `ravi inc`, `dilkhush inc` should load
- [ ] Map Work status strings MSS vs Arkshakti vs app filters
- [ ] Column mapping vs `PROJECT_TABLE_HEADERS` for MSS-only vs partner tabs
- [ ] Align config comments with explicit tab list vs workbook order

---

## Scratch / raw instructions from user

> Paste verbatim MSS sheet notes below as they arrive.

_(none yet beyond “add MSS sheet MD”)_
