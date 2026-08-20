# App UI: Shripal sites

> **Purpose:** Requirements and behaviour for the **Shripal sites** tab on `/projects`.  
> **Kind:** Application UI / logic (not raw sheet data).  
> **Last updated:** 2026-08-20

Sister docs:

- Planning index → [`README.md`](./README.md)
- **Done / pending tracker** → [`partner-implementation-status.md`](./partner-implementation-status.md)
- Our projects UI → [`ui-our-projects.md`](./ui-our-projects.md)
- Partner projects UI → [`ui-partner-projects.md`](./ui-partner-projects.md)
- Loans Ledgers (Shripal **Cash/Bank** book only in analysis) → [`loans-ledgers.md`](./loans-ledgers.md)
- Dec–Feb sheet data → [`dec-to-feb-sheet.md`](./dec-to-feb-sheet.md)
- MSS sheet data → [`mss-sheet.md`](./mss-sheet.md)

---

## Goal

Give **Shripal Ji** its own top-level Projects tab (alongside Our / Ajay / Partner) because this register has partner deal fields and special cases that should not be mixed into the generic partner list.

---

## Scope definition

A row belongs to **Shripal sites** when `PROJECT TYPE` is:

| PROJECT TYPE | Vendors |
|--------------|---------|
| `SHRIPAL JI` | `MSS`, `Arkshakti` |

Configured as `SHRIPAL_PROJECT_TYPES` / `isShripalProjectType()` in `projects-config.ts`.

Shripal rows are **excluded** from Partner projects chips and partner row scope.

**Live row counts (local snapshots):** MSS workbook ≈ 32 · Arkshakti ≈ 5.

---

## UI behaviour

| Element | Behaviour |
|---------|-----------|
| Page tabs | `Our projects` \| `Shripal sites` \| `Ajay sites` \| `Satyanarayan` \| `RJ Green` \| `Partner projects` |
| Row set | Only `SHRIPAL JI` rows (both vendors). |
| Visible columns | Same as **Our projects**, plus **Payment with partner** only (`Deal with MSS` / `Partner commission` hidden; **PAYMENT STATUS** in MORE; **Cash due to MSS** hidden). |
| Register pills | Single `Shripal Ji` chip (updates only Register filter). |
| Vendor filter | `MSS` / `Arkshakti` — independent from register pills. |
| Filters | Same as Projects globally (incl. Dues ≠ 0; **Cash due** filter uses **Cash due from client**). |
| **Analytics** | Same layout as **Our projects**, plus **Payment with partner** hero + dues column. |
| **Download analytics** | Full-page PDF (not A4) — same as Our. |

### Analytics (Our-style + Payment with partner)

**Hero order:**

1. Total sites (MSS / Arkshakti split)
2. **Total due from client** — cash + bank (breakdown listed)
3. **Payment with partner**
4. **Total due to MSS** — with MSS / Arkshakti split
5. Payments received
6. **Loans ledger · Cash / Bank** — closing balance from Loans Ledgers workbook (left block)

**Overview:** vendor register snapshot, net-due mix, dues table (Our columns + Payment with partner), work status by vendor.

**Loans Ledgers · Cash / Bank:** full left-block ledger from the Loans Ledgers workbook (`Shripal Ji` tab, columns A–F) — hero summary + dedicated section with line items. Loan EMI block (right side) not shown.

Generic Partner ledger / deal-split sections are **not** shown on Shripal.

---

## Special cases (still open)

Document further Shripal-only rules here as decided (e.g. loan ledger linkage from [`loans-ledgers.md`](./loans-ledgers.md)).

---

## Decision log

### 2026-08-20 — Hero money order (partner-style)

- Shared with Ajay / Partner: **Total due from client** (cash + bank) → **Payment with partner** → **Total due to MSS**, then payments received + Cash / Bank ledger.

### 2026-08-20 — Cash / Bank ledger in analytics

- User: show Shripal **Cash / Bank** ledger (Loans Ledgers left block) on Shripal sites analytics.
- Seeded in `shripal-cash-bank-ledger.ts` · rendered in `ShripalCashBankLedger.tsx` · hero + nav section.

### 2026-08-20 — Table columns: PAYMENT STATUS in MORE; hide Cash due to MSS

- **PAYMENT STATUS** moved to MORE column (all Projects scopes).
- **Our + Shripal:** **Cash due to MSS** removed from main table (duplicate of Cash due from client on these registers).
- **Cash due ≠ 0** filter uses **Cash due from client** on Our + Shripal.

### 2026-08-20 — Shripal UI = Our + Payment with partner only

- User: table columns and analytics like Our projects; keep only **Payment with partner** as the extra (hide Deal with MSS / Partner commission; remove deal hero + deal-split overview).

### 2026-08-09 — Shripal analytics = Our + partner deal fields

- User: analytics same as Our projects; extras are Final deal vs Deal with MSS, and Payment with partner.
- Implemented Shripal hero + overview; enabled Download analytics; status marked done for current requirement.
- **Superseded (2026-08-20):** deal fields removed from Shripal UI; Payment with partner remains the only extra.

### 2026-07-30 — Shripal top-level tab

- User: add a tab specially for Shripal sites like Our / Partner because of special cases.
- Implemented scope `shripal`; removed Shripal from Partner name chips.

### Optional / later

- [ ] ~~Cash/Bank ledger linkage in analytics~~ → **done** (2026-08-20; see [`loans-ledgers.md`](./loans-ledgers.md))
- [ ] Other Shripal special-case column rules as they come up
