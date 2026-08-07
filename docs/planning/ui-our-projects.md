# App UI: Our projects

> **Purpose:** Requirements and behaviour for the **Our projects** tab on `/projects`.  
> **Kind:** Application UI / logic (not raw sheet data).  
> **Last updated:** 2026-07-29

Sister docs:

- Planning index → [`README.md`](./README.md)
- Shripal sites UI → [`ui-shripal-sites.md`](./ui-shripal-sites.md)
- Partner projects UI → [`ui-partner-projects.md`](./ui-partner-projects.md)
- Sheet data (Dec–Feb / Arkshakti) → [`dec-to-feb-sheet.md`](./dec-to-feb-sheet.md)
- MSS main site register sheet → (TBD dedicated sheet MD if needed; tabs live under Projects config today)

---

## Goal

Separate **MSS residential & commercial** sites from partner-led registers so the table is not littered with empty partner-only columns and filters stay relevant.

---

## Scope definition

A row belongs to **Our projects** when `PROJECT TYPE` is one of:

| PROJECT TYPE | Typical vendors |
|--------------|-----------------|
| `MSS res` | `MSS`, `Arkshakti` |
| `MSS COMMERCIAL` | `Arkshakti` (Dec–Feb workbook) |

Configured in code as `OUR_PROJECT_TYPES` / `isOurProjectType()` in `projects-config.ts`.

Everything else → **Partner projects**.

---

## UI behaviour

| Element | Behaviour |
|---------|-----------|
| Page tabs | `Our projects` \| `Partner projects` (scope). Default: **Our projects**. |
| Table / Analytics | Same secondary toggle; analytics uses scoped + filtered rows. |
| Row set | Only Our-scope rows from the merged Google Sheet fetch. |
| Visible columns | Hide partner-only: `Deal with MSS`, `Partner commission`, `Payment with partner`. |
| Register filter | Labeled **Register** (not Partner) — options like `MSS res`, `MSS COMMERCIAL`. |
| Vendor filter | Still available (`MSS` / `Arkshakti`). |
| Sheet tab chips | Only shortcuts with `scope: "our"` (today: Arkshakti → `MSS res`). |
| Count | Shows filtered count within Our scope; “of N” only when inner filters active. |
| Analytics | Partner-only blocks hidden: Deal with MSS, Partner profit, Partner ledger, MSS receivable by partner. Nav limited to Overview / Deal totals / Payment dues. |

---

## Why this UX

- Partner columns were always empty on MSS res/comm → noise.
- Mixing partner tabs in one mega-table made Vendor + Partner filters harder.
- Sheet-tab chips (vendor + register together) belong naturally on Our for Arkshakti `MSS res`.
- Analytics partner metrics only apply on Partner projects.

---

## Decision log

### 2026-07-29 — Split introduced

- User: keep MSS res/comm separate from partners; two app tabs; better UX; empty partner columns fixed on Our.
- Docs pattern: sheet-data MD vs app-UI MD (this file).

### 2026-07-30 — Our analytics trimmed

- Removed from Our projects analytics: Deal with MSS, Partner profit (hero + deal table), Partner ledger section, MSS receivable by partner section.
- Kept: Net MSS receivable, sites, dues, final deal with client, overview, payment dues.

### Upcoming

- [ ] Add sheet-tab chips for MSS vendor `MSS res` and Arkshakti `MSS COMMERCIAL`
- [ ] Dedicated sheet-data MD for main MSS workbook if we deepen analysis
- [ ] Confirm whether any other PROJECT TYPE should count as “Our”
