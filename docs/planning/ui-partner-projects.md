# App UI: Partner projects

> **Purpose:** Requirements and behaviour for the **Partner projects** tab on `/projects`.  
> **Kind:** Application UI / logic (not raw sheet data).  
> **Last updated:** 2026-08-20

Sister docs:

- Planning index → [`README.md`](./README.md)
- **Done / pending tracker** → [`partner-implementation-status.md`](./partner-implementation-status.md)
- Our projects UI → [`ui-our-projects.md`](./ui-our-projects.md)
- App UI: Shripal sites → [`ui-shripal-sites.md`](./ui-shripal-sites.md)
- App UI: Ajay sites → [`ui-ajay-sites.md`](./ui-ajay-sites.md)
- App UI: Satyanarayan sites → [`ui-satyanarayan-sites.md`](./ui-satyanarayan-sites.md)
- App UI: RJ Green sites → [`ui-rjgreen-sites.md`](./ui-rjgreen-sites.md)
- Sub Vendor Payment (money ledgers, related partners) → [`sub-vendor-partner-ledger.md`](./sub-vendor-partner-ledger.md)
- Dec–Feb sheet data (partner tabs in Arkshakti book) → [`dec-to-feb-sheet.md`](./dec-to-feb-sheet.md)

---

## Goal

Show **remaining partner-led** site registers in one aggregate surface, with partner money columns visible, filters scoped to partner tabs, and analytics for dues / deal margins / by-partner rollups.

Dedicated partners with their own tabs (Shripal, Ajay, Satyanarayan, RJ Green) are **excluded**.

---

## Scope definition

A row belongs to **Partner projects** when `PROJECT TYPE` is **not** Our / Shripal / Ajay / Satyanarayan / RJ Green (see `getProjectsScopeForProjectType()` / `isDedicatedPartnerProjectType()` in `projects-config.ts`).

Examples (non-exhaustive):

- From MSS workbook: `KAVITA MAM`, `DHERAJ JI SITES`, …
- From Dec–Feb / Arkshakti: `Pradeep (veer)`, …

**Excluded** (own top-level tabs): `MSS res`, `MSS COMMERCIAL`, `SHRIPAL JI`, `Ajay (everest)`, `SATAYNARAYAN JI`, `Rohit (RJ GREEN)`.

---

## UI behaviour

| Element | Behaviour |
|---------|-----------|
| Page tabs | `Our projects` \| `Shripal sites` \| `Ajay sites` \| `Satyanarayan` \| `RJ Green` \| `Partner projects` |
| Row set | All remaining partner-scoped rows from the merged fetch. |
| Visible columns | Include partner-only: `Deal with MSS`, `Partner commission`, `Payment with partner`. |
| Partner filter | Labeled **Partner** — project types = remaining partner sheet tabs. |
| Vendor filter | `MSS` / `Arkshakti` still apply. |
| Sheet tab chips | One chip per partner name (from loaded registers). Click filters to that partner; click again clears. |
| **Analytics** | Partner-style hero + overview + by-partner receivable table. |
| **Download analytics** | Full-page PDF (not A4) — same path as Our / Shripal. |

### Analytics

**Hero:**

1. Total sites (partner count + vendor split)
2. **Total due from client** — cash + bank (breakdown listed)
3. **Payment with partner**
4. **Total due to MSS** — with MSS / Arkshakti split
5. **Client deal vs Deal with MSS** — equation layout: Final deal − Deal with MSS = Partner profit

**Overview:** portfolio snapshot, partner deal vs MSS, by-partner register table, work status.

**By partner:** MSS receivable by partner (due from clients + partner advances).

~~Satyanarayan Sub Vendor ledger~~ — moved to the **Satyanarayan** tab (2026-08-20).

---

## Why this UX

- Partner columns are meaningful here (deal with MSS, commission, payment with partner).
- Avoids mixing “our site” and “partner site” mental models in one table.
- Heavy partners (Ajay, Shripal, Satyanarayan, RJ Green) get dedicated tabs; this tab stays the catch-all.
- Partner name chips mirror sheet tabs for fast filtering without the Partner dropdown.

---

## Decision log

### 2026-08-20 — Satyanarayan + RJ Green own tabs

`SATAYNARAYAN JI` and `Rohit (RJ GREEN)` moved to top-level tabs. Partner analytics no longer includes Satyanarayan Sub Vendor or final-sum-with-ledger cards.

### 2026-08-09 — Partner analytics parity

Hero + overview aligned with Our/Shripal richness; Satyanarayan Sub Vendor was embedded here before the dedicated tab.

### 2026-08-09 — Chip filter

Partner sheet-tab chips replace the Partner dropdown for fast filtering.
