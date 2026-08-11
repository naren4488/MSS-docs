# App UI: Partner projects

> **Purpose:** Requirements and behaviour for the **Partner projects** tab on `/projects`.  
> **Kind:** Application UI / logic (not raw sheet data).  
> **Last updated:** 2026-08-09

Sister docs:

- Planning index → [`README.md`](./README.md)
- **Done / pending tracker** → [`partner-implementation-status.md`](./partner-implementation-status.md)
- Our projects UI → [`ui-our-projects.md`](./ui-our-projects.md)
- App UI: Shripal sites → [`ui-shripal-sites.md`](./ui-shripal-sites.md)
- App UI: Ajay sites → [`ui-ajay-sites.md`](./ui-ajay-sites.md)
- Sub Vendor Payment (money ledgers, related partners) → [`sub-vendor-partner-ledger.md`](./sub-vendor-partner-ledger.md)
- Dec–Feb sheet data (partner tabs in Arkshakti book) → [`dec-to-feb-sheet.md`](./dec-to-feb-sheet.md)

---

## Goal

Show **partner-led** site registers in their own surface, with partner money columns visible, filters scoped to partner tabs, and analytics that match Our/Shripal richness plus Satyanarayan’s Sub Vendor ledger.

---

## Scope definition

A row belongs to **Partner projects** when `PROJECT TYPE` is **not** Our / Shripal / Ajay (see `getProjectsScopeForProjectType()` in `projects-config.ts`).

Examples (non-exhaustive):

- From MSS workbook: `Rohit (RJ GREEN)`, `SATAYNARAYAN JI`, `KAVITA MAM`, …
- From Dec–Feb / Arkshakti: `Rohit (RJ GREEN)`, `Pradeep (veer)`, …

**Excluded** (own top-level tabs): `MSS res`, `MSS COMMERCIAL`, `SHRIPAL JI`, `Ajay (everest)`.

---

## UI behaviour

| Element | Behaviour |
|---------|-----------|
| Page tabs | `Our projects` \| `Shripal sites` \| `Ajay sites` \| `Partner projects` |
| Row set | All partner-scoped rows from the merged fetch. |
| Visible columns | Include partner-only: `Deal with MSS`, `Partner commission`, `Payment with partner`. |
| Partner filter | Labeled **Partner** — project types = partner sheet tabs. |
| Vendor filter | `MSS` / `Arkshakti` still apply. |
| Sheet tab chips | One chip per partner name (from loaded registers). Click filters to that partner; click again clears. |
| **Analytics** | Our/Shripal-style hero + overview, Satyanarayan Sub Vendor ledger, by-partner table. |
| **Download analytics** | Full-page PDF (not A4) — same path as Our / Shripal. |

### Analytics

**Hero:**

1. Total sites (partner count + vendor split)
2. Net due · MSS
3. Net due · Arkshakti
4. Due from clients (net + cash + bank)
5. **Client deal vs Deal with MSS** — equation layout: Final deal − Deal with MSS = Partner profit
6. Payment with partner
7. **Satyanarayan · Sub Vendor** closing balance
8. **Final sum** — both vendor registers + Satyanarayan Sub Vendor (same pattern as Ajay)

**Overview:** portfolio snapshot, partner deal vs MSS, by-partner register table, work status.

**Satyanarayan ledger panel:** Sub Vendor Payment tab `SATYANARAYAN ` (trailing space) · closing **₹1,63,372** · maps to Projects `SATAYNARAYAN JI`.

**By partner:** MSS receivable by partner (due from clients + partner advances). Unified Partner ledger table removed — Sub Vendor ledger covers cash detail.

---

## Why this UX

- Partner columns are meaningful here (deal with MSS, commission, payment with partner).
- Avoids mixing “our site” and “partner site” mental models in one table.
- Satyanarayan has a Sub Vendor money book like Ajay — surface it on Partner analytics without a separate top-level tab yet.
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

### 2026-08-09 — Analytics + Satyanarayan ledger

- Partner analytics upgraded to Our/Shripal-style hero + overview.
- Wired Satyanarayan Sub Vendor money ledger (static snapshot + UI) into Partner analytics.
- Enabled **Download analytics** for Partner scope.
- Removed unified Partner ledger table (Sub Vendor ledger is the cash detail surface).
- By-partner receivable table retained.

### Upcoming

- [ ] Optional vendor-split chips if same partner name needs MSS vs Arkshakti separately
- [ ] Whether Satyanarayan (or other partners) eventually get their own top-level tab like Ajay/Shripal
- [ ] Align remaining Sub Vendor tabs (Kavita, Vinod, …) when prioritized
