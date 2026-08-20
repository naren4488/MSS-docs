# App UI: RJ Green sites

> **Purpose:** Requirements and behaviour for the **RJ Green** tab on `/projects`.  
> **Kind:** Application UI / logic (not raw sheet data).  
> **Last updated:** 2026-08-20

Sister docs:

- Planning index → [`README.md`](./README.md)
- Partner projects UI → [`ui-partner-projects.md`](./ui-partner-projects.md)
- Dec–Feb sheet data → [`dec-to-feb-sheet.md`](./dec-to-feb-sheet.md)
- **Done / pending tracker** → [`partner-implementation-status.md`](./partner-implementation-status.md)

---

## Goal

Give **Rohit (RJ GREEN)** its own top-level Projects tab with the same partner money columns previously shown under Partner projects — no separate Sub Vendor ledger for this partner yet.

---

## Scope definition

A row belongs to **RJ Green** when `PROJECT TYPE` is:

| PROJECT TYPE | Vendors |
|--------------|---------|
| `Rohit (RJ GREEN)` | `MSS`, `Arkshakti` |

Configured as `RJGREEN_PROJECT_TYPES` / `isRjGreenProjectType()` in `projects-config.ts`.

RJ Green rows are **excluded** from Partner projects chips and partner row scope.

---

## UI behaviour

| Element | Behaviour |
|---------|-----------|
| Page tabs | … \| `Satyanarayan` \| `RJ Green` \| `Partner projects` |
| Row set | Only `Rohit (RJ GREEN)` rows (both vendors) |
| Visible columns | Same as Partner — Deal with MSS / commission / Payment with partner |
| Register pills | Single `RJ Green` chip |
| Analytics | Partner-style hero (dues, payment with partner, deal vs MSS) + overview |
| Download analytics | Full-page PDF |

---

## Decision log

### 2026-08-20 — Split from Partner projects

Moved out of the aggregate Partner tab (same pattern as Ajay / Shripal / Satyanarayan). Columns unchanged; no dedicated ledger panel yet.
