# App UI: Satyanarayan sites

> **Purpose:** Requirements and behaviour for the **Satyanarayan** tab on `/projects`.  
> **Kind:** Application UI / logic (not raw sheet data).  
> **Last updated:** 2026-08-20

Sister docs:

- Planning index → [`README.md`](./README.md)
- Partner projects UI → [`ui-partner-projects.md`](./ui-partner-projects.md)
- Sub Vendor Payment → [`sub-vendor-partner-ledger.md`](./sub-vendor-partner-ledger.md)
- **Done / pending tracker** → [`partner-implementation-status.md`](./partner-implementation-status.md)

---

## Goal

Give **Satyanarayan** (`SATAYNARAYAN JI`) its own top-level Projects tab — same partner money columns as Partner projects, plus the Sub Vendor Payment money ledger that previously lived under Partner analytics.

---

## Scope definition

A row belongs to **Satyanarayan** when `PROJECT TYPE` is:

| PROJECT TYPE | Vendors |
|--------------|---------|
| `SATAYNARAYAN JI` | `MSS` (sheet spelling; Sub Vendor tab is `SATYANARAYAN ` with trailing space) |

Configured as `SATYANARAYAN_PROJECT_TYPES` / `isSatyanarayanProjectType()` in `projects-config.ts`.

Satyanarayan rows are **excluded** from Partner projects chips and partner row scope.

---

## Sub Vendor Payment — money ledger

| Field | Value |
|-------|-------|
| Workbook tab | `SATYANARAYAN ` (trailing space) |
| Closing | **₹1,63,372** (we will receive) |
| Maps to | Projects `SATAYNARAYAN JI` |

Seed + UI: `satyanarayan-sub-vendor-ledger.ts`, `SatyanarayanSubVendorLedger.tsx`.

---

## UI behaviour

| Element | Behaviour |
|---------|-----------|
| Page tabs | … \| `Satyanarayan` \| `RJ Green` \| `Partner projects` |
| Row set | Only `SATAYNARAYAN JI` rows |
| Visible columns | Same as Partner — Deal with MSS / commission / Payment with partner |
| Register pills | Single `Satyanarayan Ji` chip |
| Analytics | Partner-style hero + Sub Vendor ledger + final sum (register + ledger) |
| Download analytics | Full-page PDF |

---

## Decision log

### 2026-08-20 — Split from Partner projects

Moved out of the aggregate Partner tab (same pattern as Ajay / Shripal). Columns unchanged; Sub Vendor ledger panel now lives only on this tab.
