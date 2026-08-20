# App UI: Ajay sites

> **Purpose:** Requirements and behaviour for the **Ajay sites** tab on `/projects`.  
> **Kind:** Application UI / logic (not raw sheet data).  
> **Last updated:** 2026-08-20

Sister docs:

- Planning index → [`README.md`](./README.md)
- Our projects UI → [`ui-our-projects.md`](./ui-our-projects.md)
- Partner projects UI → [`ui-partner-projects.md`](./ui-partner-projects.md)
- Sub Vendor Payment (Ajay dual ledgers) → [`sub-vendor-partner-ledger.md`](./sub-vendor-partner-ledger.md)
- Dec–Feb sheet data → [`dec-to-feb-sheet.md`](./dec-to-feb-sheet.md)
- **Done / pending tracker** → [`partner-implementation-status.md`](./partner-implementation-status.md)

---

## Goal

Give **Ajay Ji** (`Ajay (everest)`) its own top-level Projects tab because this partner has a separate site register **and** a dual-ledger layout on the Sub Vendor Payment sheet that should stay linked in the UI.

---

## Scope definition

A row belongs to **Ajay sites** when `PROJECT TYPE` is:

| PROJECT TYPE | Vendors |
|--------------|---------|
| `Ajay (everest)` | `MSS`, `Arkshakti` |

Configured as `AJAY_PROJECT_TYPES` / `isAjayProjectType()` in `projects-config.ts`.

Ajay rows are **excluded** from Partner projects chips and partner row scope.

---

## Sub Vendor Payment — two tables on `Ajay` tab

The **SUB VENDOR PAYMENT** workbook tab `Ajay` has **two side-by-side ledgers** (live sheet, 2026-08-20):

| Block | Columns | Title | Header balance |
|-------|---------|-------|----------------|
| Left | A–E | **Money ledger** | **−₹1,78,500** *(we need to pay)* |
| Right | K–P | **Everest Solar Bill** | **₹73,816** |

**Money ledger (left):** PP / CASH in from Ajay; MSS / NEFT out (latest: **₹2.5L EVEREST BUILD SOLAR NEFT** on 10 Aug 2026; prior ₹3L on 30 Jul).

**Everest Solar Bill (right):** MSE vendor invoices through MSE/26-27/0157; eleven invoice lines totalling **₹73,816**.

**Removed (older snapshot):** middle **site commission** table (I–O, ~₹1,000/KW, +₹31,000) is no longer on the live tab.

Spreadsheet ID: `1UrgNeqxEpifcFroxnLU7U4Xah23Li5Hw` · configured as `AJAY_SUB_VENDOR_LEDGER` in `projects-config.ts`.

Money-ledger rows are seeded in `partner-mss-payments.ts` for analytics. Everest bill rows live in `ajay-sub-vendor-ledger.ts` and render in `AjaySubVendorLedgers.tsx`.

**Card colours:** negative balances = red (we need to pay); positive = green (we will receive).

---

## UI behaviour

| Element | Behaviour |
|---------|-----------|
| Page tabs | `Our projects` \| `Shripal sites` \| `Ajay sites` \| `Partner projects` |
| Row set | Only `Ajay (everest)` rows (both vendors). |
| Visible columns | Same as Partner — Deal with MSS / commission / Payment with partner. |
| Register pills | Single `Ajay Ji` chip (updates only Register filter). |
| Vendor filter | `MSS` / `Arkshakti` — independent from register pills. |
| Analytics | Hero: sites → **due from client** (cash+bank) → **payment with partner** → **due to MSS** → Sub Vendor ledgers → final sum; detailed overview. |
| Scope note | Info banner in analytics: MSS = pipeline, Arkshakti = backlog, Sub Vendor ledgers = separate cash. |

**Implementation status:** see [`partner-implementation-status.md`](./partner-implementation-status.md) — Ajay marked **done** for current requirement; **GST billing TBD**.

---

## Decision log

### 2026-08-09 — Sheet layout updated (live re-read)

- Site commission table (I–O) **removed** from Sub Vendor Payment `Ajay` tab.
- Two tables now: **money ledger** (−₹4,28,500) + **Everest Solar Bill** (₹69,179).
- New money row: 30 Jul 2026 · DR ₹3,00,000 · EVEREST BUILD SOLAR NEFT.
- Three new invoices: MSE/26-27/0125, 0137 (+0117 renumbered).

### 2026-08-09 — Ajay top-level tab + dual ledger note

- User: add Ajay sites tab like Shripal / Partner; note Sub Vendor Payment `Ajay` tab has **two tables**.
- Implemented scope `ajay`; removed `Ajay (everest)` from Partner name chips; added scope callout + planning doc.

### 2026-08-20 — Ledger refresh + balance colours

- Live re-read: money ledger **−₹1,78,500** (new ₹2.5L NEFT 10 Aug); Everest bills **₹73,816** (invoices 0141, 0157).
- Hero / ledger cards: **− red** = we need to pay · **+ green** = we will receive.

### 2026-08-20 — Hero money order (partner-style)

- Shared across Shripal / Ajay / Partner (not Our): **Total due from client** → **Payment with partner** → **Total due to MSS**, then other cards.
- Due from client = cash due + bank due (both shown). Due to MSS shows vendor split underneath.

### 2026-08-09 — Ajay analytics rework

- Hero: total sites, net due (Ark / MSS), money ledger, Everest bills, final sum.
- Overview: register snapshot, net-due mix, sum breakdown, work status by vendor.
- Deal totals + payment dues removed from all analytics tabs.
- **Superseded (2026-08-20):** money-card order updated (due from client / payment with partner / due to MSS).

### Upcoming

- [ ] **GST billing still to receive from Ajay** — calculation TBD (tracked in [`partner-implementation-status.md`](./partner-implementation-status.md))
- [ ] Optional: map Everest MSE invoices to site register rows
