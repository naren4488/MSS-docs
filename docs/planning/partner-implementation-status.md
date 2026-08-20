# Partner implementation status

> **Purpose:** Living tracker for what we **built in the app** vs what is **still pending** per partner / scope.  
> **Kind:** Product + engineering status (not raw sheet data).  
> **Last updated:** 2026-08-20

Related docs:

- Planning index → [`README.md`](./README.md)
- Ajay UI spec → [`ui-ajay-sites.md`](./ui-ajay-sites.md)
- Satyanarayan UI → [`ui-satyanarayan-sites.md`](./ui-satyanarayan-sites.md)
- RJ Green UI → [`ui-rjgreen-sites.md`](./ui-rjgreen-sites.md)
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
| Sub Vendor · **Money ledger** | ✅ | Static data + UI in `ajay-sub-vendor-ledger.ts`, `AjaySubVendorLedgers.tsx`; closing **−₹1,78,500** (we need to pay) |
| Sub Vendor · **Everest Solar Bill** | ✅ | Eleven MSE invoices; closing **₹73,816**; shown in analytics hero + ledger tables |
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

### Done (codebase — current requirement)

| Area | Status | Notes |
|------|--------|-------|
| Top-level **Shripal sites** tab | ✅ | Scope `shripal`; excluded from Partner chips |
| Vendor chips | ✅ | MSS + Arkshakti shortcuts |
| **Analytics (Our-style)** | ✅ | Sites, net due by vendor, payments, due-from-clients card |
| **Extra: Payment with partner** | ✅ | Table column + hero + dues table (only partner extra vs Our) |
| **Loans Ledgers · Cash / Bank** | ✅ | Hero + full ledger section (`shripal-cash-bank-ledger.ts`) |
| **Download analytics** | ✅ | Full-page PDF (same path as Our) |

*(2026-08-20: removed Deal with MSS / Partner commission from table; removed deal hero + deal-split overview.)*

### Pending

| Item | Status | Notes |
|------|--------|-------|
| Live sync for Cash/Bank ledger | ⏳ Optional | Seeded snapshot — refresh from Loans Ledgers sheet when updated |

**Verdict:** Current Shripal analytics requirement is **done**.

---

## Satyanarayan

**Scope:** `Satyanarayan` tab · see [`ui-satyanarayan-sites.md`](./ui-satyanarayan-sites.md)

### Done (codebase — current requirement)

| Area | Status | Notes |
|------|--------|-------|
| Top-level **Satyanarayan** tab | ✅ | Scope `satyanarayan`; excluded from Partner chips |
| Partner-style columns | ✅ | Deal with MSS / commission / Payment with partner |
| **Sub Vendor money ledger** | ✅ | Tab `SATYANARAYAN ` · closing **₹1,63,372** · moved off Partner analytics |
| **Analytics** | ✅ | Partner-style hero + ledger + final sum (register + ledger) |
| **Download analytics** | ✅ | Full-page PDF |

---

## RJ Green

**Scope:** `RJ Green` tab · see [`ui-rjgreen-sites.md`](./ui-rjgreen-sites.md)

### Done (codebase — current requirement)

| Area | Status | Notes |
|------|--------|-------|
| Top-level **RJ Green** tab | ✅ | Scope `rjgreen`; excluded from Partner chips |
| Dual registers | ✅ | `Rohit (RJ GREEN)` on MSS + Arkshakti |
| Partner-style columns | ✅ | Same as Partner projects |
| **Analytics** | ✅ | Partner-style hero + overview (no dedicated Sub Vendor ledger yet) |
| **Download analytics** | ✅ | Full-page PDF |

---

## Partner projects (aggregate tab)

**Scope:** All partner tabs except Our / Shripal / Ajay / Satyanarayan / RJ Green · see [`ui-partner-projects.md`](./ui-partner-projects.md)

### Done (codebase — current requirement)

| Area | Status | Notes |
|------|--------|-------|
| Partner ledger + by-partner tables | ✅ / ❌ | By-partner receivable table kept; unified Partner ledger **removed** |
| **Analytics (partner-style)** | ✅ | Sites, dues, payment with partner, deal vs MSS (no Satyanarayan ledger / final-sum-with-ledger) |
| ~~Satyanarayan Sub Vendor on Partner~~ | ✅ → moved | Now on **Satyanarayan** tab (2026-08-20) |
| Partner money seed (Satyanarayan) | ✅ | Still in `partner-mss-payments.ts` for ledger history |
| **Download analytics** | ✅ | Full-page PDF (same path as Our / Shripal) |
| Rich Partner overview | ✅ | Portfolio snapshot, deal vs MSS, by-partner register table, work status |

**Key code paths**

- `projects-config.ts` — partner chip exclusion via `isDedicatedPartnerProjectType`
- `MssSitesAnalytics.tsx` — Partner hero + overview + by-partner table
- `partner-mss-payments.ts` — historical partner money seeds

### Pending

| Item | Status | Notes |
|------|--------|-------|
| Other Sub Vendor tabs (Kavita, Vinod, …) | ⏳ Optional | Wire when prioritized — see [`sub-vendor-partner-ledger.md`](./sub-vendor-partner-ledger.md) |

**Verdict:** Current Partner aggregate analytics requirement is **done**.

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
| 2026-08-20 | Satyanarayan / RJ Green | Own top-level tabs; Sub Vendor ledger moved off Partner aggregate |
| 2026-08-09 | Partner | Analytics = Our/Shripal-style + Satyanarayan Sub Vendor ledger; download PDF enabled |
| 2026-08-20 | Shripal | UI = Our projects + Payment with partner only (deal columns/analytics removed) |
| 2026-08-09 | Shripal | Analytics = Our layout + Payment with partner extra; download PDF enabled |
| 2026-08-09 | Our | Marked current requirement **done** (analytics, PDF download, dues ≠ 0 filter, column order); chips left optional |
| 2026-08-09 | Our | Analytics hero + overview for residential/commercial registers |
| 2026-08-09 | Ajay | Initial status doc: Ajay scope marked **done** per current requirement; **GST billing TBD** logged as only pending item |
