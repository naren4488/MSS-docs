# Planning: Loans Ledgers

> **Purpose:** Capture structure and decisions for the Loans Ledgers Google Sheet (cash/bank + bank-loan EMI books).  
> **Status:** Analysis only — not wired into the app yet.  
> **Last updated:** 2026-08-20

Keep **this workbook’s** notes here only. Sister planning docs:

- Planning index → [`README.md`](./README.md)
- Sub Vendor Payment / partner ledgers → [`sub-vendor-partner-ledger.md`](./sub-vendor-partner-ledger.md)
- DEC to FEB (Arkshakti) projects → [`dec-to-feb-sheet.md`](./dec-to-feb-sheet.md)

Append new instructions under [Decision log](#decision-log).

---

## Source spreadsheet

| Field | Value |
|-------|--------|
| Title | Loans Ledgers |
| Spreadsheet ID | `1_CZnKHpPoISlSxjESlZdiQohpimMkbgHC6pA28hxQME` |
| URL | https://docs.google.com/spreadsheets/d/1_CZnKHpPoISlSxjESlZdiQohpimMkbgHC6pA28hxQME/edit?usp=sharing |
| Local snapshot | `tmp/loan-ledgers.xlsx` (analysis only; not source of truth) |
| Related app areas (later) | Projects / partner money / possible future “Loans” feature — TBD |

---

## Tabs overview

| Tab name (exact) | Layout type | Header balance(s) (live 2026-08-20) | Keep? |
|------------------|-------------|---------------------------------------|-------|
| `Shripal Ji` | Dual — Cash/Bank (left) + Loan EMI (right) | Cash/Bank −1,37,455 · Loan −3,68,750 · **both −5,06,205** | TBD |
| `Mahesh Bhaia` | Loan EMI only | −6,38,678 | TBD |
| `Yogeshwar` | Loan EMI only | −6,32,034 | TBD |
| `Montu boss` | Empty | — | **Skip** |
| `Sonu Uncle` | Loan EMI only | −2,83,877 | TBD |
| `NK papa` | Cash loan only | −4,00,000 | TBD |
| `Sanjay` | Cash loan (+ interest) | −5,50,000 | TBD |
| `MK Home` | Dual cash loans (left + right) | Left −1,68,000 · Right −2,64,000 · **both −4,32,000** | TBD |

**8 tabs total** · skip empty `Montu boss`.

---

## Two ledger patterns

### A) Bank loan EMI book (most common)

Used on: Mahesh Bhaia, Yogeshwar, Sonu Uncle, and the **right half** of Shripal Ji.

**Row 1 summary**

| Col | Meaning |
|-----|---------|
| A | Label `Loan` |
| C | Total Dr (EMIs paid so far / credits against outstanding) |
| D | Total Cr (principal + charges + interest booked) |
| E | Net `Balance Pending` (typically negative = outstanding) |
| F | Label `Balance Pending` |

**Row 2 headers**

`Date | Particular | Dr | Cr | Closing Balance | Remark`

**Typical opening sequence**

1. `Loan` — principal dispersed (Cr) — Remark: Amount dispersed  
2. `Charges` — file charge (Cr)  
3. `Interest` — interest booked (Cr)  
4. `EMI - N` — monthly repayment (Dr) — Remark often `MSS Paid` / `Self Paid` / `Paid by MSS`

**Extra meta on first EMI row (cols G–I on some sheets)**

- EMI amount (repeat)  
- Tenure e.g. `30 EMIs` / `36 EMIs` / `48 EMIs` / `18 EMIs`  
- Due day e.g. `3rd of every month` / `2nd of every month`

### B) Cash / Bank book

Used on: left half of Shripal Ji, NK papa, Sanjay, MK Home.

**Row 1 summary**

| Col | Meaning |
|-----|---------|
| A | Label `Cash / Bank` |
| C | Total DR |
| D | Total Cr |
| E | Net balance |
| F | Label `Balance` |

**Row 2 headers**

`Date | Particular | DR | Cr | Closing Balance | Remark`

**Typical rows**

- Cash loan received (Cr) + interest booked (Cr)  
- Interest installment / repayment (DR)  
- Ad-hoc expenses / PhonePe / RTGS / refunds (Shripal cash side)

### C) Dual layout (Shripal Ji only so far)

| Block | Columns | Title | In analysis? |
|-------|---------|-------|--------------|
| Left | A–F | Cash / Bank | **Yes** (Shripal Ji) |
| (gap) | G | empty | — |
| Right | H–M | Loan | No — sheet only |

Same dual idea as Ajay on Sub Vendor sheet (two ledgers side-by-side).

---

## Per-tab notes (first read)

### Shripal Ji

Dual layout on tab **`Shripal Ji`** (left Cash/Bank · right bank-loan EMI). **Analysis table below = Cash/Bank only** — loan EMI book stays on the sheet but is out of scope for planning / app analytics here.

**Cash / Bank — analysis table** (live sheet 2026-08-19):

| | | |
|---|---|---|
| **DR total** | **Cr total** | **Balance** |
| ₹66,600 | ₹2,04,055 | **−₹1,37,455** |

| Date | Particular | DR | Cr | Closing | Remark |
|------|------------|-----|-----|---------|--------|
| 09-02-2026 | Solvency Time | — | 10,000 | −10,000 | Phonepe |
| — | Online Verfication Solvency | — | 2,000 | −12,000 | Phonepe |
| — | Firm K account Me clint ka pay. | — | 49,785 | −61,785 | Phonepe |
| — | TIN Shade | — | 54,694 | −1,16,479 | Phonepe |
| — | RTGS | — | 41,226 | −1,57,705 | RTGS |
| 09-02-2026 | Phonepe | 15,000 | — | −1,42,705 | Phonepe |
| — | Phonepe | 28,900 | — | −1,13,805 | Phonepe |
| — | Phonepe | 2,700 | — | −1,11,105 | Phonepe |
| — | ajay pal ji ka cash payment | 20,000 | — | −91,105 | ajay pal ji paid |
| — | mukesh mali advance refund kia | — | 10,000 | −1,01,105 | srhipal ji ne advance refund kia jiska cash MSS me aaya tha |
| — | farma first time (8 farma) | — | 2,450 | −1,03,555 | cash paid by shripal ji |
| — | farma second time (16 farma) | — | 4,400 | −1,07,955 | cash paid by shripal ji |
| 03-03-2026 | 1st EMI | — | 14,750 | −1,22,705 | self paid by shripal ji |
| 03-04-2026 | 2nd EMI | — | 14,750 | −1,37,455 | self paid by shripal ji |
| — | pipe gaye the karansar | — | — | −1,37,455 | *(amount TBD)* |
| — | farma sheet (16 farma) | — | — | −1,37,455 | *(amount TBD)* |
| — | shri govind workshop se material | — | — | −1,37,455 | *(amount TBD)* |

**Loan EMI book (right half):** not included in analysis — live pending ≈ **−₹3,68,750** (EMI 5 logged Jul 2026; EMIs 3–5 paid by MSS). See sheet tab for full loan schedule.

- **Wired in app:** Shripal sites analytics · `SHRIPAL_CASH_BANK_LEDGER` · `shripal-cash-bank-ledger.ts` · `ShripalCashBankLedger.tsx`.

### Mahesh Bhaia

- Loan-only. Principal 6,00,000 + charges 25,620 + interest 1,16,073 → Cr total 7,41,693.  
- EMI 20,603 · **36 EMIs** · 3rd of every month.  
- 4 EMIs paid (MSS Paid on EMI-1); pending ≈ **−6,59,281**.

### Yogeshwar

- Loan-only. Principal 6,16,581 + charges 13,419 + interest 1,47,888.  
- EMI 16,206 · **48 EMIs** · 2nd of every month.  
- 8 EMIs all marked **MSS paid**; pending ≈ **−6,48,240**.  
- Oldest start in this book (Nov 2025).

### Montu boss

- Empty sheet — placeholder.

### Sonu Uncle

- Loan-only. Principal 3,09,497 + charges 14,759 + interest 41,141.  
- EMI 20,380 · **18 EMIs** · 3rd of every month.  
- 3 EMIs logged (remarks blank after EMI-1 meta); pending ≈ **−3,04,257**.

### NK papa

- Cash loan only: **4,00,000** received (25-06-2026). No EMI schedule / interest rows yet. Balance −4,00,000.

### Sanjay

- Cash loan **5,00,000** + interest **60,000** (6 months @ note 2%).  
- Remark: return by 27 Jun; first interest installment **10,000** paid by MSS (27-07-2026).  
- Balance ≈ **−5,50,000**.

### MK Home

- Two cash tranches same day (19-06-2026):  
  - 1,50,000 @ **1%** → interest 9,000 (6 months)  
  - 3,00,000 @ **1.5%** → interest 27,000 (6 months)  
- Balance ≈ **−4,86,000**.  
- Row “Interest - 1” exists but amounts empty — first installment noted as paid by MSS without figures yet.

---

## Accounting conventions (sheet as written)

- **Cr on loan book** = liability increases (disbursement, charges, interest).  
- **Dr on loan book** = liability decreases (EMI / repayment).  
- **Negative closing balance** ≈ amount still outstanding (Balance Pending).  
- Cash/Bank sign usage is messier (mix of expenses as Cr and receipts as DR on Shripal) — **do not assume one global sign** until mapped per person.  
- “Paid by MSS” / “MSS Paid” vs “Self Paid” is important for who funded the EMI.

### Date caveat

Same as other sheets: Excel date serials vs `DD-MM-YYYY` / `DD-MM-YY` text — prefer careful parsing on import.

---

## Rough outstanding snapshot (header balances)

Live sheet read **2026-08-20** (gviz). Montu boss skipped. Shripal + MK Home = **both ledgers**.

| Person | Kind | Pending |
|--------|------|--------:|
| Shripal Ji | Cash/Bank −1,37,455 + Loan EMI −3,68,750 | **−5,06,205** |
| Mahesh Bhaia | Bank loan EMI | **−6,38,678** |
| Yogeshwar | Bank loan EMI | **−6,32,034** |
| Sonu Uncle | Bank loan EMI | **−2,83,877** |
| NK papa | Cash loan | **−4,00,000** |
| Sanjay | Cash loan (+ interest) | **−5,50,000** |
| MK Home | Left −1,68,000 + Right −2,64,000 | **−4,32,000** |

**Total outstanding (7 people, excl. Montu):** **−₹34,42,794**

*(Header totals from live sheet; verify before any product use.)*

---

## Links to other MSS data

| Loan tab | Possible project / partner link |
|----------|----------------------------------|
| Shripal Ji | Projects `SHRIPAL JI` (MSS + Arkshakti tabs); Sub Vendor may also mention Shripal |
| Others | No confirmed project-tab mapping yet |

---

## Decision log

### 2026-08-20 — Live outstanding refresh (both Shripal ledgers)

- Re-read live Loans Ledgers via gviz.
- **Shripal Ji** dues = Cash/Bank **−₹1,37,455** + Loan EMI **−₹3,68,750** → **−₹5,06,205**.
- **MK Home** is dual on sheet (left −1,68,000 + right −2,64,000 → **−₹4,32,000**).
- Skip **Montu boss**. Combined pending for 7 people: **−₹34,42,794**.
- Bank EMI books moved vs prior snapshot: Mahesh −6,38,678 · Yogeshwar −6,32,034 · Sonu −2,83,877.

### 2026-08-20 — Cash / Bank wired into Shripal analytics

- Left block shown on **Shripal sites** analytics (hero + ledger table). Loan EMI block still out of scope for the app UI.

### 2026-08-19 — Shripal Ji analysis = Cash/Bank only

- User: include only **Cash / Bank** ledger in the analysis table for the Shripal Ji tab.  
- Per-tab notes + rough snapshot updated; loan EMI book remains on sheet but excluded from analysis tables.  
- Cash/Bank table refreshed from live sheet (incl. three placeholder expense rows without amounts).

### 2026-07-29 — Intake

- User shared Loans Ledgers sheet for planning reference.  
- Instruction: own MD file per Google Sheet (this file).  
- No app import / UI yet.

### Upcoming

- [ ] Which tabs to keep (skip Montu? merge cash vs loan?)  
- [ ] Official DR/CR meaning for Cash/Bank vs Loan  
- [ ] How “Paid by MSS” should appear in Projects analytics / partner ledger  
- [ ] Storage format (JSON / TS) if we seed later  
- [ ] Live sheet sync vs snapshot  

---

## Scratch / raw instructions from user

> Paste verbatim Loans Ledgers notes below as they arrive.

_(2026-07-29: “take this also … these are loan ledgers … create one more md file”)_
