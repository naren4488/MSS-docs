# App UI: Sales team sites

> **Purpose:** Requirements and behaviour for the **Sales team sites** tab on `/projects`.  
> **Kind:** Application UI / logic (not raw sheet data).  
> **Last updated:** 2026-09-11

Sister docs:

- Planning index → [`README.md`](./README.md)
- **Done / pending tracker** → [`partner-implementation-status.md`](./partner-implementation-status.md)
- Our projects UI → [`ui-our-projects.md`](./ui-our-projects.md)
- MSS sheet data → [`mss-sheet.md`](./mss-sheet.md)

---

## Goal

Show the MSS workbook **`CALL TEAM SITE`** register as its own page tab, immediately after **Our projects**, labelled **Sales team sites**. Same dues columns as Our (no partner deal fields).

---

## Scope definition

A row belongs to **Sales team sites** when `PROJECT TYPE` is:

| PROJECT TYPE (app) | Sheet tab (exact) | Vendor |
|--------------------|-------------------|--------|
| `Sales team sites` | `CALL TEAM SITE` | `MSS` |

Configured as `CALL_TEAM_SHEET_NAME` / `SALES_PROJECT_TYPE` / `isSalesProjectType()` in `projects-config.ts`.

Sales rows are **excluded** from Our projects and from Partner projects.

**Live named rows (2026-09-11):** ≈ 26 on MSS `CALL TEAM SITE`.

---

## UI behaviour

| Element | Behaviour |
|---------|-----------|
| Page tabs | `Our projects` \| **`Sales team sites`** \| `Shripal` \| … |
| Row set | MSS `CALL TEAM SITE` only. |
| Visible columns | Our-style: hide Deal with MSS / Partner commission / Payment with partner; hide Cash due to MSS. |
| **Cash due ≠ 0** filter | Uses **Cash due from client**. |
| Register chip | `Sales team` (filters to this register; one register today). |
| Analytics | Our-style hero (sites, net due MSS, payments, due from clients) + overview. |
| **Download analytics** | Full-page PDF, same path as Our. |

---

## Decision log

### 2026-09-11 — Load Call team as Sales team sites

- User: the Call team sheet tab should appear in the app as **Sales team sites**, next to Our projects.
- Sheet name stays `CALL TEAM SITE` for gviz; app `PROJECT TYPE` is `Sales team sites`.
