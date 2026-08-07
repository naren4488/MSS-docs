# App UI: Shripal sites

> **Purpose:** Requirements and behaviour for the **Shripal sites** tab on `/projects`.  
> **Kind:** Application UI / logic (not raw sheet data).  
> **Last updated:** 2026-07-30

Sister docs:

- Planning index → [`README.md`](./README.md)
- Our projects UI → [`ui-our-projects.md`](./ui-our-projects.md)
- Partner projects UI → [`ui-partner-projects.md`](./ui-partner-projects.md)
- Loans Ledgers (Shripal cash + loan book) → [`loans-ledgers.md`](./loans-ledgers.md)
- Dec–Feb sheet data → [`dec-to-feb-sheet.md`](./dec-to-feb-sheet.md)

---

## Goal

Give **Shripal Ji** its own top-level Projects tab (alongside Our / Partner) because this register has special cases that should not be mixed into the generic partner list.

---

## Scope definition

A row belongs to **Shripal sites** when `PROJECT TYPE` is:

| PROJECT TYPE | Vendors |
|--------------|---------|
| `SHRIPAL JI` | `MSS`, `Arkshakti` |

Configured as `SHRIPAL_PROJECT_TYPES` / `isShripalProjectType()` in `projects-config.ts`.

Shripal rows are **excluded** from Partner projects chips and partner row scope.

---

## UI behaviour

| Element | Behaviour |
|---------|-----------|
| Page tabs | `Our projects` \| `Shripal sites` \| `Partner projects` |
| Row set | Only `SHRIPAL JI` rows (both vendors). |
| Visible columns | Same as Partner — includes Deal with MSS / commission / Payment with partner. |
| Vendor chips | **MSS** and **Arkshakti** shortcuts (lock Vendor + `SHRIPAL JI`). |
| Analytics | Partner-style metrics enabled (deal with MSS, profit, ledger, receivable) until Shripal-specific rules are defined. |

---

## Special cases (TBD)

Document Shripal-only rules here as they are decided (e.g. loan ledger linkage, dual cash/loan books, commission exceptions).

---

## Decision log

### 2026-07-30 — Shripal top-level tab

- User: add a tab specially for Shripal sites like Our / Partner because of special cases.
- Implemented scope `shripal`; removed Shripal from Partner name chips.

### Upcoming

- [ ] Capture concrete Shripal special-case rules (columns, analytics, loan linkage)
- [ ] Whether Shripal analytics should differ from generic partner analytics
