# App UI: Partner projects

> **Purpose:** Requirements and behaviour for the **Partner projects** tab on `/projects`.  
> **Kind:** Application UI / logic (not raw sheet data).  
> **Last updated:** 2026-07-29

Sister docs:

- Planning index → [`README.md`](./README.md)
- Our projects UI → [`ui-our-projects.md`](./ui-our-projects.md)
- App UI: Shripal sites → [`ui-shripal-sites.md`](./ui-shripal-sites.md)
- Sub Vendor Payment (money ledgers, related partners) → [`sub-vendor-partner-ledger.md`](./sub-vendor-partner-ledger.md)
- Dec–Feb sheet data (partner tabs in Arkshakti book) → [`dec-to-feb-sheet.md`](./dec-to-feb-sheet.md)

---

## Goal

Show **partner-led** site registers in their own surface, with partner money columns visible and filters scoped to partner tabs only.

---

## Scope definition

A row belongs to **Partner projects** when `PROJECT TYPE` is **not** in `OUR_PROJECT_TYPES` (`MSS res`, `MSS COMMERCIAL`).

Examples (non-exhaustive):

- From MSS workbook: `SHRIPAL JI`, `Rohit (RJ GREEN)`, `SATAYNARAYAN JI`, `Ajay (everest)`, `KAVITA MAM`, …
- From Dec–Feb / Arkshakti: `SHRIPAL JI`, `Ajay (everest)`, `Rohit (RJ GREEN)`, `Pradeep (veer)`, …

Configured via `getProjectsScopeForProjectType()` in `projects-config.ts`.

---

## UI behaviour

| Element | Behaviour |
|---------|-----------|
| Page tabs | `Our projects` \| `Partner projects`. |
| Row set | All non-Our rows from the merged fetch. |
| Visible columns | Include partner-only: `Deal with MSS`, `Partner commission`, `Payment with partner`. |
| Partner filter | Labeled **Partner** — project types = partner sheet tabs. |
| Vendor filter | `MSS` / `Arkshakti` still apply. |
| Sheet tab chips | One chip per partner name (from loaded registers). Click filters to that partner; click again clears. |
| Analytics | Includes Deal with MSS, Partner profit, Partner ledger, MSS receivable by partner. |

---

## Why this UX

- Partner columns are meaningful here (deal with MSS, commission, payment with partner).
- Avoids mixing “our site” and “partner site” mental models in one table.
- Sub-vendor cash ledgers remain a separate sheet/planning track; this tab is the **site register** view.
- Partner name chips mirror sheet tabs for fast filtering without the Partner dropdown.

---

## Decision log

### 2026-07-29 — Split introduced

- Same product decision as Our projects — dual tabs + column rules.
- Partner sheet-tab chips deferred until we pick which partners to shortcut.

### 2026-07-30 — Partner name tabs

- Added chips for every unique partner PROJECT TYPE from MSS + Arkshakti loaded tabs (e.g. Rohit, Kavita, Pradeep, …).
- Chip selects partner only (all vendors); partners on both MSS and Arkshakti still show together.
- **Shripal** moved to its own top-level tab — not listed in Partner chips.

### Upcoming

- [ ] Optional vendor-split chips if same partner name needs MSS vs Arkshakti separately
- [ ] Align naming with Sub Vendor Payment tabs where spellings differ
- [ ] Whether partner analytics should default differently from Our
