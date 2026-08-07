# Planning: Sub Vendor Payment & Partner Ledgers

> **Purpose:** Capture sheet structure, product decisions, and pick-lists for the Sub Vendor Payment workbook / partner ledgers.  
> **Status:** Analysis only — not wired into the app yet.  
> **Last updated:** 2026-07-29

Keep **this workbook’s** notes here only. Sister planning docs:

- Planning index → [`README.md`](./README.md)
- DEC to FEB (Arkshakti) projects sheet → [`dec-to-feb-sheet.md`](./dec-to-feb-sheet.md)
- Loans Ledgers → [`loans-ledgers.md`](./loans-ledgers.md)
- App UI: Partner projects → [`ui-partner-projects.md`](./ui-partner-projects.md)

Append new instructions under [Decision log](#decision-log) as they are given.

---

## Source spreadsheet

| Field | Value |
|-------|--------|
| Title | SUB VENDOR PAYMENT |
| Spreadsheet ID | `1UrgNeqxEpifcFroxnLU7U4Xah23Li5Hw` |
| URL | https://docs.google.com/spreadsheets/d/1UrgNeqxEpifcFroxnLU7U4Xah23Li5Hw/edit?usp=sharing |
| Local snapshot (optional) | `tmp/sub-vendor-payment.xlsx` (downloaded for analysis; not source of truth) |

Related in-app code today:

- Partner ledger seed: `src/features/mss-sites/lib/partner-mss-payments.ts`
- Projects sheet config: `src/features/mss-sites/lib/projects-config.ts`
- Projects route: `/projects`

---

## Tabs overview

| Tab name (exact) | Role | Header balance (as of read) | Keep? |
|------------------|------|-----------------------------|-------|
| `VINOD JI` | Vendor ledger | −3,232 | TBD |
| `SATYANARAYAN ` (trailing space) | Partner ledger | +1,47,672 | TBD |
| `Ajay` | Dual: money ledger + per-site commission table | −7,28,500 / side +31,000 | TBD |
| `KAVITA` | Partner ledger (shorter) | +47,000 | TBD |
| `Copy of KAVITA` | Expanded Kavita + site payments | +1,20,000 | TBD |
| `DILKHS TEJAS POWER` | Vendor ledger (settled) | 0 | TBD |
| `RAVI JI SUNSMART` | Vendor ledger (site bills) | +1,21,150 | TBD |
| `ROHIT G DHAWAS` | Partner ledger + customer name list | +25,755 | TBD |
| `Sheet1` | Empty | — | Skip |
| `SUNNY` | Ledger (**CR/DR columns swapped**) | 0 | TBD |
| `BHARAT BHADWA` | Small vendor bill | −1,195 | TBD |
| `ROHIT JI PHULERA ` (trailing space) | Bright Solar / site payment flow | 0 | TBD |

---

## Common ledger layout (most tabs)

Row 1 (summary):

| Col | Meaning |
|-----|---------|
| A | Vendor / partner display name |
| C | Total DR (or first total) |
| D | Total CR (or second total) |
| E | Closing / net balance |
| F | Label `Balance` |

Row 2 (headers — typical):

`Date | Particular | DR | CR | Closing Balance | Remark`

**Variants:**

- **`SUNNY`**, **`BHARAT BHADWA`**, **`ROHIT JI PHULERA`**: headers are `Date | Particular | CR | DR | Closing Balance | Remark` (CR before DR).
- **`Ajay`**: left block is money ledger without Particular; right block is site-wise commission (`SR. NO. | SITE NAME | KW | DR | CR | Closing Balance | Remark`).
- **`ROHIT G DHAWAS`**: extra far-right column of customer / site names.
- **`Copy of KAVITA`**: includes site-level 1st/2nd/cash payments mixed into the same DR/CR ledger.

### Accounting convention (sheet as written)

- **DR** often = money paid out by MSS / advances / site costs charged one way.
- **CR** often = bills raised / money received / partner repayments / client collections.
- **Positive closing balance** vs **negative** meaning differs slightly by tab (who owes whom). Do **not** assume one global sign until we map each vendor.

### Date caveat

Some cells that look like `DD-MM-YYYY` were Excel-serialized and appear as wrong calendar dates when read as Date objects (e.g. `12-05-2026` → `2026-12-05`). Prefer text / `DD-MM-YYYY` parsing when importing.

---

## Per-tab notes (from first read)

### VINOD JI

- Payments + bills (one bill tagged `BILL ( SUNSMART )`).
- Net ≈ −3,232 (bills slightly exceed payments).

### SATYANARAYAN

- Almost all **PAYMENT** / advance rows; one material line (`10X2 ac cable 20m`).
- Balance ≈ +1,47,672 (MSS advances outstanding style).
- Overlaps existing in-app `SATAYNARAYAN JI` ledger naming (spelling differs).

### Ajay

- Left: large CR collections (PP/CASH) → deep negative balance (−7,28,500).
- Right: 8 named sites × KW commission (~₹1,000/KW) → +31,000.

### KAVITA vs Copy of KAVITA

- **KAVITA** ≈ early payment/received rows (matches many entries already in `partner-mss-payments.ts` for `KAVITA MAM`).
- **Copy of KAVITA** = same start + full site money movement (Santosh Devi, Parag Mangl, Sanjay Sharma, Madan Mohan, Punamchand, etc.). Likely the **working** sheet if we pick one.

### DILKHS TEJAS POWER

- Bill then payments; currently **settled (0)**.

### RAVI JI SUNSMART

- Site-tagged bills: Rawan Gate, Nirman Nagar, Ramesh Chand, Rakesh.
- Outstanding ≈ +1,21,150.

### ROHIT G DHAWAS

- Payments + `sites expense` + stamp/meter credits.
- Side name list (Nauratmal, Sarika, Urmila, etc.).
- Overlaps existing in-app Rohit Dhawas-style ledger.

### SUNNY

- CR/DR order swapped; mix of cheque/IMPS/agreement/GST/bill.
- Header balance shows 0 (running rows look inconsistent — verify before import).

### BHARAT BHADWA

- Single small bill (~1,195) outstanding.

### ROHIT JI PHULERA (Bright Solar)

- Client payment in → Bright Solar NEFT out; file commission + agreement deductions.
- Settled to 0 on last NEFT.

---

## Overlap with current app ledger

Existing `PARTNER_LEDGER_TRANSACTIONS` already covers some Kavita / Satyanarayan / Rohit-style cash movements. This Google Sheet is broader (vendor bills, site collections, dual Ajay layout).

When implementing:

1. Decide whether Sheet replaces, merges with, or stays parallel to `partner-mss-payments.ts`.
2. Normalize tab names ↔ `projectType` / vendor keys used in Projects analytics.
3. Resolve Kavita: use `KAVITA` vs `Copy of KAVITA` (not both unless intentional).

---

## Decision log

Append dated notes here. Do not delete older entries — strike through if superseded.

### 2026-07-29 — Intake started

- User shared the SUB VENDOR PAYMENT sheet for analysis only.
- Instruction: keep all further guidance about **this** sheet / partner ledgers in this planning MD.
- Later: each Google Sheet gets its **own** planning MD (Dec–Feb moved out).

### Upcoming (fill in as user instructs)

- [ ] Which tabs to import
- [ ] Which columns are required vs ignore
- [ ] DR/CR → app direction mapping (`mss_to_partner` / `partner_to_mss` / `site_expense` / bill / etc.)
- [ ] Name mapping (sheet tab ↔ project type / partner key)
- [ ] Kavita: short tab vs Copy of KAVITA
- [ ] Whether Ajay’s right-hand site table is commission ledger or separate
- [ ] Storage format (JSON vs TS module under `mss-sites`)
- [ ] Live sheet sync vs one-time snapshot

---

## Scratch / raw instructions from user

> Paste verbatim Sub Vendor Payment notes below as they arrive.

_(none yet beyond “analyse & keep planning in MD”)_
