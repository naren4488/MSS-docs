# App UI: Our projects

> **Purpose:** Requirements and behaviour for the **Our projects** tab on `/projects`.  
> **Kind:** Application UI / logic (not raw sheet data).  
> **Last updated:** 2026-08-09

Sister docs:

- Planning index → [`README.md`](./README.md)
- **Done / pending tracker** → [`partner-implementation-status.md`](./partner-implementation-status.md)
- MSS site register sheet → [`mss-sheet.md`](./mss-sheet.md)
- Dec–Feb / Arkshakti sheet → [`dec-to-feb-sheet.md`](./dec-to-feb-sheet.md)
- Shripal sites UI → [`ui-shripal-sites.md`](./ui-shripal-sites.md)
- Partner projects UI → [`ui-partner-projects.md`](./ui-partner-projects.md)

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

Everything else → **Partner projects** (or Shripal / Ajay dedicated tabs).

**Live row counts (2026-08-09):** MSS res · MSS ≈ 53 · MSS res · Arkshakti ≈ 39 · MSS COMMERCIAL ≈ 11 · **~103** combined.

---

## UI behaviour

| Element | Behaviour |
|---------|-----------|
| Page tabs | `Our projects` \| `Shripal` \| `Ajay` \| `Partner` (scope). Default: **Our projects**. |
| Table / Analytics | Secondary toggle; analytics uses scoped + filtered rows. |
| **Download analytics** | Our + Analytics only — full-page PDF (custom page size, **not A4**). |
| Row set | Only Our-scope rows from the merged Google Sheet fetch. |
| Visible columns | Hide partner-only: `Deal with MSS`, `Partner commission`, `Payment with partner`. |
| Column order (dues) | … → Cash due from client → **Cash due to MSS** → **Total Due to MSS** → Payment received … |
| Register filter | Labeled **Register** — `MSS res`, `MSS COMMERCIAL`. |
| Vendor filter | `MSS` / `Arkshakti`. |
| Work status filter | Default excludes project-on-hold style statuses. |
| **Dues filter** | Optional: Net due ≠ 0 · Cash due ≠ 0 · Bank due ≠ 0 (OR). Empty = all sites. Replaces old Payment received filter. |
| Register pills | `MSS res`, `MSS commercial` (chips update only the **Register** filter; they do not change Vendor). |
| Count | Filtered count within Our scope; “of N” when inner filters active. |
| Analytics | Hero: total sites, net due (MSS / Arkshakti), payments received, **Due from clients** (cash + bank + net). Overview: register snapshot, dues-by-register table, work status by project type. No deal totals / payment dues sections. |

---

## Why this UX

- Partner columns were always empty on MSS res/comm → noise.
- Mixing partner tabs in one mega-table made Vendor + Partner filters harder.
- Register pills on Our should be independent from Vendor so users can keep a vendor filter while switching registers.
- Analytics partner metrics only apply on Partner projects.
- Dues ≠ 0 filter surfaces open balances (including surplus/return negatives), not just payment-received flags.

---

## Decision log

### 2026-08-09 — Current requirement complete (table + analytics)

- Analytics hero + rich overview + **Download analytics** (full page).
- Column order: Cash due to MSS **before** Total Due to MSS (all Projects tabs).
- Removed **Payment** (received / not received) filter.
- Added **Dues** filter: Net / Cash / Bank due **≠ 0**.
- Sheet live review: MSS workbook `MSS res` + Dec–Feb `MSS res` + `MSS COMMERCIAL`.
- Status: **done for current Our-projects requirement** — see [`partner-implementation-status.md`](./partner-implementation-status.md).

### 2026-08-09 — Our analytics summary cards

- Hero cards: total sites (MSS res + commercial split), net due by vendor, payments received, combined **Due from clients**.
- Overview: three-register snapshot, net-due mix, dues-by-register table, work status by `MSS res` / `MSS COMMERCIAL`.

### 2026-07-30 — Our analytics trimmed

- Removed partner-only analytics blocks from Our scope.
- Later superseded by 2026-08-09 Our-specific analytics redesign.

### 2026-07-29 — Split introduced

- User: keep MSS res/comm separate from partners; two app tabs; better UX; empty partner columns fixed on Our.
- Docs pattern: sheet-data MD vs app-UI MD (this file).

### Optional / later

- [ ] Optional: add a dedicated MSS-commercial source badge if the source mix changes again
- [ ] Confirm whether any other `PROJECT TYPE` should count as “Our”
- ~~Dedicated sheet-data MD for main MSS workbook~~ → done: [`mss-sheet.md`](./mss-sheet.md)
