# Planning: DEC to FEB sheet (Arkshakti)

> **Purpose:** Capture structure, tab analyses, and product decisions for the Dec–Feb / Arkshakti projects workbook.  
> **Status:** Analysis only — no new wiring beyond what’s already loaded in the app.  
> **Last updated:** 2026-07-29

Keep **this workbook’s** notes here only. Sister planning docs:

- Planning index (sheet vs UI docs) → [`README.md`](./README.md)
- MSS site register (same tabs, vendor MSS) → [`mss-sheet.md`](./mss-sheet.md)
- App UI: Our projects → [`ui-our-projects.md`](./ui-our-projects.md)
- App UI: Partner projects → [`ui-partner-projects.md`](./ui-partner-projects.md)
- Sub Vendor Payment / partner ledgers → [`sub-vendor-partner-ledger.md`](./sub-vendor-partner-ledger.md)
- Loans Ledgers → [`loans-ledgers.md`](./loans-ledgers.md)

Append new instructions under [Decision log](#decision-log). Add one section per tab as we analyze them.

---

## Source spreadsheet

| Field | Value |
|-------|--------|
| Label (app) | DEC to FEB (Arkshakti) |
| Spreadsheet ID | `1tkNFHBLjpOZkzayqObWO1VMYkGsD5uy-wrXaBcqHglE` |
| URL | https://docs.google.com/spreadsheets/d/1tkNFHBLjpOZkzayqObWO1VMYkGsD5uy-wrXaBcqHglE |
| App config | `DEC_TO_FEB_SPREADSHEET_ID`, `ARKSHAKTI_SHEET_TABS`, `PROJECT_SHEET_SOURCE_RULES.decToFeb` in `projects-config.ts` |
| Local snapshot | `tmp/dec-to-feb.xlsx` (analysis only; not source of truth) |
| Projects route | `/projects` |

### Workbook tabs (order)

| # | Tab name (exact) | Loaded in app today? | Analyzed? |
|---|------------------|----------------------|-----------|
| 1 | `MSS res` | Yes (Arkshakti set, first of 6) | Yes — see below |
| 2 | `SHRIPAL JI` | Yes | TBD |
| 3 | `Ajay (everest)` | Yes | TBD |
| 4 | `Rohit (RJ GREEN)` | Yes | TBD |
| 5 | `Pradeep (veer)` | Yes | TBD |
| 6 | `MSS COMMERCIAL` | Yes | TBD |
| 7 | `dilkhus` | No (after first 6) | TBD |
| 8 | `RAVI` | No | TBD |
| 9 | `ARKSHKATI COMM` | No | TBD |
| 10 | `ALWAR SITES` | No | TBD |

App rule: only the **first six** tabs are loaded (`tabCount: 6`, cutoff after `Pradeep (veer)` in config comments — note workbook order above differs slightly from comment order for MSS COMMERCIAL vs Ajay/Rohit/Pradeep).

---

## Decision log

### 2026-07-29 — Start Dec–Feb analysis

- User asked to open Dec–Feb and analyze first tab `MSS res` (columns, rows, especially Work status).
- Instruction: keep each Google Sheet’s planning in its **own** MD file (this file for Dec–Feb).

### 2026-07-29 — Projects UI: Sheet tab shortcut (Arkshakti → MSS res)

- Added chip filter on Projects page **below** Vendor/Partner/… filters and **above** the table.
- For now only **Arkshakti → `MSS res`** is listed (`PROJECT_SHEET_TAB_SHORTCUTS` in `projects-config.ts`).
- Clicking the chip sets **Vendor = Arkshakti** and **Partner (PROJECT TYPE) = MSS res** together (same as filtering both dropdowns).
- Click again clears only vendor + partner back to “all” (other filters unchanged).
- More Arkshakti (and later MSS) tabs can be appended to `PROJECT_SHEET_TAB_SHORTCUTS` later.

### 2026-07-29 — App split: Our projects vs Partner projects

- Product: two page tabs — **Our projects** (`MSS res`, `MSS COMMERCIAL`) vs **Partner projects** (all other loaded tabs).
- Our tab hides partner-only columns; Partner tab keeps them.
- Sheet-data stays in this file; app behaviour documented in `ui-our-projects.md` / `ui-partner-projects.md`.
- Arkshakti `MSS res` sheet-tab chip lives on **Our** scope only.

### Upcoming

- [ ] Analyze remaining loaded tabs (SHRIPAL JI … MSS COMMERCIAL)
- [ ] Decide whether excluded tabs (dilkhus, RAVI, …) matter later
- [ ] Work status: official meaning / enum / filter rules
- [ ] Column mapping vs `PROJECT_TABLE_HEADERS` (Arkshakti-only money cols)
- [ ] Add more sheet-tab chips as tabs are approved

---

## Tab: `MSS res`

| Field | Value |
|-------|--------|
| Tab | `MSS res` |
| Position | First tab |
| Analyzed | 2026-07-29 |

### Shape

| Metric | Value |
|--------|-------|
| Header row | Row 1 |
| Named columns | **32** (A–AF). Sheet `max_col` reports 73 but cols 33+ empty in data range |
| Non-empty data rows | **39** (all have NAME) |
| Sheet max_row | 984 (mostly empty template space) |

### Column names (exact header text)

| # | Header |
|---|--------|
| 1 | _(blank — serial / S.No)_ |
| 2 | UPDATE |
| 3 | NAME |
| 4 | KW |
| 5 | PH |
| 6 | LOCATION |
| 7 | DISCOM |
| 8 | K. NO |
| 9 | MOBILE |
| 10 | GMAIL |
| 11 | GPS / LINK |
| 12 | QUATATION IN BANK |
| 13 | FINAL DEAL with client |
| 14 | LOAN |
| 15 | Cash |
| 16 | File Login |
| 17 | Subsidy |
| 18 | Bank file / Cash |
| 19 | **Work status** |
| 20 | DISCOM WORK |
| 21 | Payment status |
| 22 | 1ST INSTALLMENT |
| 23 | 2ND INATALLMENT _(typo)_ |
| 24 | CASH TO MSS |
| 25 | Bank due |
| 26 | CASH DUE FROM CLIENT |
| 27 | NET DUE TO MSS |
| 28 | TOTAL Payment recieved _(typo)_ |
| 29 | Amount to us |
| 30 | Amount still with askshakti _(typo Arkshakti)_ |
| 31 | Total amount |
| 32 | REMARK |

Notes vs app `PROJECT_TABLE_HEADERS`: sheet has Arkshakti-specific money cols (`Amount to us`, `Amount still with askshakti`); app also has partner-only cols not on this MSS tab (`Deal with MSS`, `Payment with partner`). App normalizes `Work status` → `WORK STATUS`.

### Fill rates (highlights)

- 100%: serial, UPDATE, NAME, KW, DISCOM, File Login, Subsidy, Bank file/Cash, **Work status**, Payment status
- Weak: PH ~54%, GPS ~44%, Amount to us ~41%, REMARK ~8%

### KW mix

`3KW` 23 · `6KW` 8 · `5KW` 6 · `3+7KW` 2

### Serial quirk

Col A runs `1,2,3` then restarts at `1`…`36` (first 3 look like a HOLD/block section, rest main list).

### Sibling pipeline value sets (same tab)

| Column | Values (counts) |
|--------|-----------------|
| Payment status | `2nd installment` 21 · `pending` 13 · `Cash to mahi` 5 |
| DISCOM WORK | `Subsidy granted` 21 · `Pending` 12 · `Subsidy apply with site photo` 5 · blank 1 |
| File Login | `COMPLET` 26 · `File login` 7 · `Doc Recieved` 6 |
| Bank file / Cash | `Loan approved` 21 · `Loan apply` 8 · `CASH FILE` 5 · `Loan Rejected` 4 · `File into bank` 1 |

---

### Work status (column S) — focus

**100% filled · 4 distinct values · free text (not a locked dropdown in sheet)**

| Value (as written) | Count | Share |
|--------------------|------:|------:|
| `Panel` | 20 | 51% |
| `work not started` | 10 | 26% |
| `payment DUE` | 6 | 15% |
| `project on HOLD` | 3 | 8% |

**Meaning inferred from UPDATE + sibling columns (not official definitions):**

| Work status | Likely meaning | Typical companions |
|-------------|----------------|--------------------|
| `Panel` | Installation progressed to panel stage (or “panel done” shorthand) | Often `DISCOM WORK=Subsidy granted`, `Payment status=2nd installment` or `Cash to mahi`, `Bank file/Cash=Loan approved` or `CASH FILE` |
| `work not started` | Site not begun / blocked on docs, MK updates, loan | Almost always `Payment status=pending`, `DISCOM WORK=Pending`; UPDATE mentions docs / MK / call not answering / loan reject |
| `payment DUE` | Work largely done but money still outstanding | UPDATE often says completed + ₹ pending; `Payment status` usually `2nd installment`; DISCOM often subsidy granted |
| `project on HOLD` | Explicitly paused | UPDATE: incomplete docs / client refused / CIBIL bad; payment `pending`; loan often rejected |

**Cross-tabs (Work status × Payment status):**

| Work status | pending | 2nd installment | Cash to mahi |
|-------------|--------:|----------------:|-------------:|
| Panel | 0 | 16 | 4 |
| work not started | 10 | 0 | 0 |
| payment DUE | 0 | 5 | 1 |
| project on HOLD | 3 | 0 | 0 |

**Observations for later product work:**

1. Values are **inconsistent casing/spacing** (`payment DUE` vs others lowercase) — app filter already treats them as distinct strings.
2. `Panel` is the largest bucket but ambiguous (stage name, not “complete”).
3. `payment DUE` overlaps conceptually with **Payment status** — work done, money not; status is about receivables not installation stage.
4. `project on HOLD` and `work not started` are both “not progressing” but HOLD is intentional stop; “not started” is backlog/blocker.
5. No blank Work status on this tab (good for filters).
6. Sibling pipeline columns also matter: File Login, Bank file/Cash, DISCOM WORK — Work status alone is not the full lifecycle.

---

## Scratch / raw instructions from user

> Paste verbatim Dec–Feb notes below as they arrive.

_(moved MSS res analysis here; awaiting next tab / decisions)_
