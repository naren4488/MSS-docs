# App UI: Shripal sites

> **Purpose:** Requirements and behaviour for the **Shripal sites** tab on `/projects`.  
> **Kind:** Application UI / logic (not raw sheet data).  
> **Last updated:** 2026-08-09

Sister docs:

- Planning index → [`README.md`](./README.md)
- **Done / pending tracker** → [`partner-implementation-status.md`](./partner-implementation-status.md)
- Our projects UI → [`ui-our-projects.md`](./ui-our-projects.md)
- Partner projects UI → [`ui-partner-projects.md`](./ui-partner-projects.md)
- Loans Ledgers (Shripal cash + loan book) → [`loans-ledgers.md`](./loans-ledgers.md)
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
| Page tabs | `Our projects` \| `Shripal sites` \| `Ajay sites` \| `Partner projects` |
| Row set | Only `SHRIPAL JI` rows (both vendors). |
| Visible columns | Same as Partner — includes **Deal with MSS** / commission / **Payment with partner**. |
| Vendor chips | **MSS** and **Arkshakti** shortcuts (lock Vendor + `SHRIPAL JI`). |
| Filters | Same as Projects globally (incl. Dues ≠ 0). |
| **Analytics** | Same layout as **Our projects**, plus partner-deal extras (see below). |
| **Download analytics** | Full-page PDF (not A4) — same as Our. |

### Analytics (Our-style + extras)

**Hero (shared with Our):**

1. Total sites (MSS / Arkshakti split)
2. Net due · MSS
3. Net due · Arkshakti
4. Payments received
5. Due from clients (net due + cash due + bank due)

**Extra hero cards (Shripal-only):**

6. **Client deal vs Deal with MSS** — Final deal with client (headline), Deal with MSS + Partner profit (client − MSS)
7. **Payment with partner** — sum of Payment with partner column

**Overview:** vendor register snapshot, partner deal vs MSS card, net-due mix, dues table (incl. Payment with partner), deal-split table, work status by vendor.

Generic Partner ledger / by-partner sections are **not** shown on Shripal (dedicated register analytics instead).

---

## Special cases (still open)

Document further Shripal-only rules here as decided (e.g. loan ledger linkage from [`loans-ledgers.md`](./loans-ledgers.md)).

---

## Decision log

### 2026-08-09 — Shripal analytics = Our + partner deal fields

- User: analytics same as Our projects; extras are Final deal vs Deal with MSS, and Payment with partner.
- Implemented Shripal hero + overview; enabled Download analytics; status marked done for current requirement.

### 2026-07-30 — Shripal top-level tab

- User: add a tab specially for Shripal sites like Our / Partner because of special cases.
- Implemented scope `shripal`; removed Shripal from Partner name chips.

### Optional / later

- [ ] Loan ledger linkage / dual cash-loan book rules in analytics
- [ ] Other Shripal special-case column rules as they come up
