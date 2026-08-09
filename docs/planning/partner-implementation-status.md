# Partner implementation status

> **Purpose:** Living tracker for what we **built in the app** vs what is **still pending** per partner / scope.  
> **Kind:** Product + engineering status (not raw sheet data).  
> **Last updated:** 2026-08-09

Related docs:

- Planning index → [`README.md`](./README.md)
- Ajay UI spec → [`ui-ajay-sites.md`](./ui-ajay-sites.md)
- Our projects UI → [`ui-our-projects.md`](./ui-our-projects.md)
- Sub Vendor ledgers (sheet) → [`sub-vendor-partner-ledger.md`](./sub-vendor-partner-ledger.md)

**How to use this file**

- Add a section when a new partner scope gets non-trivial app work.
- Move items from **Pending** → **Done** when shipped; do not delete history — strike through superseded pending lines if needed.
- Link to UI MDs and code paths so future work picks up quickly.

---

## Ajay (everest)

**Scope:** `Ajay sites` tab · `PROJECT TYPE` = `Ajay (everest)` · vendors **MSS** + **Arkshakti**

### Done (codebase — current requirement)

| Area | Status | Notes |
|------|--------|-------|
| Top-level **Ajay sites** tab | ✅ | Scope `ajay` in `projects-config.ts`; excluded from Partner projects chips |
| Dual registers in one view | ✅ | MSS pipeline (29 sites) + Arkshakti backlog (31 sites); zero name overlap after RAJENDRA SETHI removed from MSS sheet |
| Sub Vendor · **Money ledger** | ✅ | Static data + UI in `ajay-sub-vendor-ledger.ts`, `AjaySubVendorLedgers.tsx`; closing **−₹4,28,500** |
| Sub Vendor · **Everest Solar Bill** | ✅ | Nine MSE invoices; closing **₹69,179**; shown in analytics hero + ledger tables |
| Column import fixes | ✅ | `TOTAL Payment recieved` header aliases; Arkshakti-only money cols intentionally not imported |
| Partner money ledger seed | ✅ | `partner-mss-payments.ts` — PP / cash / NEFT rows incl. Jul 2026 ₹3L EVEREST BUILD SOLAR |
| **Analytics (Ajay-specific)** | ✅ | Hero: total sites · net due Arkshakti · net due MSS · both Sub Vendor cards · **final sum** (registers + ledgers) |
| Analytics (global cleanup) | ✅ | **Deal totals** and **Payment dues** sections removed from **all** Projects analytics tabs |
| Rich Ajay overview | ✅ | Register snapshot, net-due mix by sign, final-sum breakdown table, work status per vendor |
| Sheet audit (Aug 2026) | ✅ | All three Ajay tabs verified — NET DUE formula, Sub Vendor running balances, business rules confirmed (₹2K deal, partner returns, etc.) |

**Key code paths**

- `src/features/mss-sites/lib/projects-config.ts` — `AJAY_PROJECT_TYPES`, `AJAY_SUB_VENDOR_LEDGER`
- `src/features/mss-sites/components/MssSitesAnalytics.tsx` — Ajay hero + overview
- `src/features/mss-sites/components/AjaySubVendorLedgers.tsx` — dual ledger tables
- `src/features/mss-sites/lib/ajay-sub-vendor-ledger.ts` — ledger row snapshots

### Pending

| Item | Status | Notes |
|------|--------|-------|
| **GST billing still to receive from Ajay** | ⏳ **Discuss later** | How much GST billing MSS is yet to get from him — **calculation method not decided**. No app logic yet. |
| Invoice ↔ site mapping | ⏳ Optional | Everest MSE invoices have no site names on sheet; manual mapping if we ever tie bills to register rows |

---

## Shripal

**Scope:** `Shripal sites` tab · see [`ui-shripal-sites.md`](./ui-shripal-sites.md)

### Done

- (No dedicated analytics rework like Ajay / Our yet — standard partner-style analytics after global deal/dues removal.)

### Pending

- _(Add items here when Shripal-specific requirements come up.)_

---

## Partner projects (aggregate tab)

**Scope:** All partner tabs except Our / Shripal / Ajay · see [`ui-partner-projects.md`](./ui-partner-projects.md)

### Done

- Partner ledger + by-partner analytics (unchanged scope; deal/dues sections removed globally).

### Pending

- _(Add per-partner pending items here, or split into subsections when a partner gets its own scope tab.)_

---

## Our projects

**Scope:** `Our projects` tab · see [`ui-our-projects.md`](./ui-our-projects.md)

### Done (codebase — current requirement)

| Area | Status | Notes |
|------|--------|-------|
| Scope split from Partner | ✅ | `MSS res` + `MSS COMMERCIAL` |
| **Analytics summary cards** | ✅ | Net due by vendor, payments received, **Due from clients** card, rich overview |
| **Download analytics** | ✅ | Full-page PDF (not A4) — Our + Analytics only |
| Column order (dues) | ✅ | Cash due to MSS **before** Total Due to MSS (global table headers) |
| **Dues filter** | ✅ | Net / Cash / Bank due **≠ 0** (OR); Payment received filter removed |
| Sheet data review (Aug 2026) | ✅ | MSS res (53 + 39) + Commercial (11) |

**Key code paths**

- `projects-config.ts` — `OUR_PROJECT_TYPES`
- `MssSitesAnalytics.tsx` — Our hero + overview
- `prepare-mss-sites-analytics-print.ts` — analytics PDF page sizing
- `projects-columns.ts` — headers, dues filter, column order

### Pending

| Item | Status | Notes |
|------|--------|-------|
| Sheet-tab chips (MSS → MSS res, Ark → MSS COMMERCIAL) | ⏳ Optional | Only Arkshakti → MSS res chip exists today |
| Extra PROJECT TYPEs as “Our” | ⏳ Optional | Confirm if anything beyond res + commercial |

**Verdict:** Current Our-projects requirement is **done**. Optional polish only.

---

## Changelog

| Date | Partner | Change |
|------|---------|--------|
| 2026-08-09 | Our | Marked current requirement **done** (analytics, PDF download, dues ≠ 0 filter, column order); chips left optional |
| 2026-08-09 | Our | Analytics hero + overview for residential/commercial registers |
| 2026-08-09 | Ajay | Initial status doc: Ajay scope marked **done** per current requirement; **GST billing TBD** logged as only pending item |
