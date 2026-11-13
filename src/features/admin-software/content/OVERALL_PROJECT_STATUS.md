# Mahi Solar — Modules, features and APIs

**Updated:** 13 Nov 2026 (**residential quotation templates from MSS-docs (13 Nov, owner; 0169)**: six templates — 3 kW 1PH ₹1,90,000, 5 kW 1PH ₹2,70,000, 5 kW 3PH ₹2,85,000, 6 kW 3PH ₹3,20,000, 8 kW 3PH ₹3,95,000, 10 kW 3PH ₹4,80,000, each with MSS-docs' material description table, ₹78,000 + ₹17,000 subsidy, phase, panels × watt and inverter; the old 3 kW / 5 kW templates updated in place; new companies get them; the template editor has a Package section and "Fill MSS-docs material table"; applying one on a quotation also sets the phase; **required fields marked `*` in every form (13 Nov, owner)**: one shared red mark (`<Label required>` / `RequiredMark`) on each field a form refuses to save without, in about 125 forms across every module (conditional fields marked only when they are needed; old mixed stars replaced); **quotation terms from MSS-docs (13 Nov, owner)**: all 27 MSS-docs terms and conditions in English or Hindi on new quotations, untouched old default terms on drafts replaced, "Use MSS-docs terms" button; **quotation document as in MSS-docs (13 Nov, owner; 0166)**: the quotation prints the MSS-docs layout (cover and tagline, letterhead, client box with phone / email / sanction load, Stock Items table, generation and savings, EMI / maintenance / warranty, notes, signature block) in **English or Hindi**; standard kW packages (MSS-docs material table) rewrite kW, price and stock lines; panel / structure / AC cable / earthing brand and phase pickers rewrite the stock lines; generation worked out from kW and the unit rate; central subsidy pre-filled ₹78,000 and state ₹17,000; quantity text like "50 तक" kept; **customer PAN** optional (also on the quotation); **quotation client section (13 Nov, owner; 0165)**: Edit customer in a side panel, project site address pre-filled from the customer and editable; **our own number on every purchase bill (13 Nov, owner 11.1; 0163)**: PUR/2026-27/0001 per company and year, given at create (drafts too), kept on cancel, never reused; "Our no." column, "Our number" on the bill, a series picker on Add purchase bill, searchable in the list and the header search; **number series: up to 3 per document (12 Nov, owner; 0162)**: each kind can have 3 named series, one default pre-filled on create forms, the others pickable; **employee documents, one file per type and upload size (13 Nov, owner)**: uploading a type already on file replaces it and keeps the old file as a previous version ("Other" keeps every file), migration 0161; every upload form says and enforces **max 1 MB** because the production proxy refuses bigger requests (shown as "Network error" before); **My space (13 Nov)**: every employee's own attendance and leave, salary and payslips, advances, incentives, documents and details; **employee documents (12 Nov, owner bug)**: View / Download work on S3 and each document type takes its own file formats; **Teams and Tasks switched off (12 Nov, owner)**: greyed menu items with a Soon chip, Coming soon pages, until they are designed together at the end; **MSS logo and quotation bank branch (12 Nov)**: MSS logo made from `Mahi2.svg`, set on production (S3) and locally; quotation default bank branch Vaishali Nagar Jaipur; **profile photos as avatars (13 Nov)**: the header shows your photo, and staff lists show each person's photo, with initials when there is none; **data cleared 12 Nov on production and the local test database**: kept logins, roles and rights, companies, settings, masters, templates (stock lines dropped), the ledger list (zero balances, party ledgers removed) and employees; everything else cleared and numbers restart at 1. **Full regression after the clear: 2,518 passed, only V10 failing** (it needs the cleared AU letterhead bank account). **Sheet import planned:** the enquiry, MSS and Arkshakti sheets are compared with the app, and the owner's decisions E1–E5, P1–P7 and I1–I7 are in CUSTOMER_DATA_IMPORT_REPORT.md. **Built 13 Nov (migrations 0152–0153):** masters (Meta Ads source, banks, JVVNL DISCOM areas); enquiry follow-up person and documents status; the same mobile allowed with a warning and a family link; different panel / structure / inverter sizes on enquiry, quotation and project; project loan bank and branch, bank quotation and loan sanctioned, bank vs cash due, File Issue blockage, subsidy disbursed / rejected, inverter login. **Small gaps built 13 Nov:** a list of open file issues, bank / cash on the Finance receipt form, sizes in the project wizard. **Round 2 module walkthrough** started: MODULE_WALKTHROUGH_ROUND2.md. Earlier, 12 Nov 2026: owner answers 11 Nov rows 20, 21, 33, 34 built — ledger "Stock-in-Hand", "Civil Stock", "Stock Procurement", quotation "Stock Items" on screens and PDF, stock category Cable on, a stock return posts the same amount to the project and Stock-in-Hand, migration 0151; all owner answers built except row 14 (parked); owner answer 11 Nov row 10 built — Settings → Number series: prefix, financial-year part, digits and next number per series, never below a used number, migration 0150; owner answers 11 Nov rows 18, 19, 24, 36 built — SO chunk: cancel a delivery challan, Cost of Goods Sold ledger, only the stores deliver, printed challan, advances on an SO, migration 0149; rows 11, 13, 22, 35 built — PO chunk: Super Admin self-approval of POs / SOs, 2 % over-receipt tolerance, Settings → Approval limits, Create PO from Need to get, PO dashboard tiles, migration 0148; rows 6, 26, 27, 9, 31 built, migration 0146; stock, billing and UX plan: all steps 0–10 built and through the final regression — 2,375 API checks with 3 known fails, e2e life cycle 120/120; 36 owner questions listed in STOCK_BILLING_AND_UX_PLAN.md; pushed to main 11 Nov 2026; plan step 10 A5 "Material" renamed "Stock" on every screen, print and server message where it means stock — menu, page, project tab "Stock sent", line type "Stock item", the "Stock & Tools" right, default books ledgers "Purchases – Stock", "Stock consumed – Projects", "Stock damaged at site", `/materials` → `/stock` with old links redirected, 0144; plan step 9 D2 part 2 sale orders — stock reserved at confirm (warning when short), delivery challans DC/… in any unit with stock out at average cost, sale bills made from the SO with over-billing refused, partly delivered → delivered → completed, close, books Dr Purchases · Cr Stock-in-hand, 0143; plan step 9 D2 part 1 sale orders — trading orders B2B / B2C, approval with the ₹50,000 limit (billing approve right), gap-free SO/2026-27/0001 at confirm, print / PDF, list, customer tab, 0142; plan step 9 D1 purchase orders — draft → approval (Q9 limit) → sent with a gap-free PO/2026-27/0001 number → goods received in any unit (GRN) → bills that pull the lines and the PO's terms → closed, 0141; plan step 8 E1 one sale document B2B / B2C, 0140; plan step 7 E2 bill in any unit — issue, purchase, saved or one-off units on sale bills, purchase bills and credit notes, stock always in the issue unit, saved units per item, 0139; plan step 6 E3 / E4 items and services searchable from a bill line's Description / item field and added on the spot, typed goods lines marked "Not from stock", no migration; plan step 5 B1–B3 vendor category B2B / B2C / General Purchase, payment terms on vendors and customers, due dates from the terms with overdue indicators and Dues blocks, migration 0138; plan step 4 C addresses in parts — line 1, line 2, city, state, PIN — on every party, employee, company, project site and bill, migration 0137; plan step 3 F1–F4 sidebar, 0136; plan step 2 A1–A3 stock rates per purchase unit, rate hints, stock details, migration 0135; plan steps 0 H1 master values in use and 1 A4 stock conversion, migration 0134; Modules 14 Tasks, 15 Dashboard and analytics, 16 Audit, 17 Notifications / documents / jobs reviewed — all 17 modules done, whole-project test and fixes 0130 (PROJECT_REVIEW_REPORT.md); Accounts round 2 0131–0133; Modules 6–11 reviewed, project types built, 11 Warehouse and procurement reviewed; each module carries its complete feature list and APIs in one place; replaces the 9 Sep 2026 status)
**Repos:** admin app `mahisolarsolution-frontend` · API `mahi-backend-new` (both on `main`, auto-deployed)
**Purpose:** one place for every module: what it does, every screen, action and automatic behaviour, its APIs and its review status. This is the starting point for the module-by-module review.
**Full endpoint list:** [API_INVENTORY.md](./API_INVENTORY.md), every endpoint with the permission it needs. Request and response shapes are in Swagger.

## Working agreements (7 Nov 2026)

- **Test data only:** until the whole application is built, there is one database for both production and development, holding test data. Real data (Tally ledgers, opening balances as at 1 Apr 2024, bank statements) is loaded at the end.
- **Review order:** we go through the modules one by one, in the order below. For each module we agree what it should do, fix the gaps, test it, then move on.
- **Every module is per company** (MSS, MSE, …). The company comes from the tab, and the database keeps each company's records separate.
- **Permissions** are per designation (Settings → Access). The defaults are derived from the task catalog: [DESIGNATION_PERMISSION_MATRIX.md](../../docs/DESIGNATION_PERMISSION_MATRIX.md). Who-can-do-what questions are collected and settled in one access-matrix review at the end, after all modules.

## How to read the feature lists

**Built:** 7 Nov 2026 from the router, menus, every screen and every backend route. Update it with every change.
**Tags:** **[no backend]** the screen calls an API that doesn't exist · **[backend only]** the API exists but no screen uses it · **[placeholder]** "coming soon" or disabled · **[demo]** runs on sample data.

**Most likely to matter in the review**
- Task automations: the whole Settings screen calls `/task-automation-rules`, which the backend doesn't have.
- Audit dashboard: Top 5 customers / vendors call `/analytics/finance/top-*`, which don't exist.
- Placeholders: two-factor auth, header search, project change requests, the materials Damage log, the vendor "To acquire" tab, invoice Duplicate, 8 of 9 Business analytics tabs, the creditors report, bank reconciliation.
- Backend only: most site-visit fee and visit-event actions; quotation versions / clone / templates / archive / loan; purchase-bill approval and goods-receipt confirmation; payroll run generate / recalculate / cancel; project cost approvals, milestones, procurement links, material damage.

## Module map

| # | Module | Screens (sidebar) | Main tables | APIs (approx.) |
|---|---|---|---|---|
| 1 | Platform: sign-in, companies, users, access | Login, company switcher, Settings | users, companies, roles, designations, features | ~45 |
| 2 | Settings and masters | Settings & data | master_*, company_settings, document templates | ~45 |
| 3 | People: employees, teams | HR → Employees, Teams | employees, employee_assignments, teams | ~30 |
| 4 | Attendance and leave | HR → Attendance, Leave requests | attendance, leave_requests, holidays, leave_year_end_runs | ~29 |
| 5 | Payroll and advances | HR → Payroll, Payroll settings; Employees → Pay; Accounts → Payroll ledgers | payroll_runs, payroll_items, payroll_payments, employee_advances | ~25 |
| 6 | Customers | Finance → Customers | customers, customer_*, document_share_links | 20 |
| 7 | Enquiries | Pipeline → Enquiries | enquiries, enquiry_activities | 17 |
| 8 | Site visits, fees, calendar | Calendar, enquiry/project pages | site_visit_*, calendar_events | ~36 |
| 9 | Quotations | Pipeline → Quotations | quotations, quotation_versions, templates | ~51 |
| 10 | Projects (core and execution) | Projects, Active sites, Timeline | projects, project_* | ~120 |
| 11 | Warehouse and procurement | Stock, Tools, Templates; Finance → Vendors, Purchase orders | inventory_items, purchase_orders, purchase_bills, goods receipts, vendors | ~85 |
| 12 | Billing and finance parties | Finance → Sales bills, Sale orders, Vendors, Loans, Partners, … | billing_documents, sale_orders, loans, partners, agents, … | ~110 |
| 13 | Accounts (books) | Accounts → … | acc_* | ~50 |
| 14 | Tasks | Pipeline → Tasks, Settings → Task templates | tasks, task_templates | ~20 |
| 15 | Dashboard and analytics | Dashboard, Business analytics, Analytics, Finance home | (computed) | ~35 |
| 16 | Audit and reports (older pages) | Audit & Books → … | audit_logs + computed | ~8 |
| 17 | Notifications, documents, background jobs | Notifications | notifications, documents, worker | ~10 |

---

## 1. Platform: sign-in, companies, users, access

**What it does:** signs people in, decides which company each browser tab works in, and controls what each person may do.

### Features

**Login (`/login`)**
- Sign in with phone number (10 digits, with or without +91) and password; show or hide the password
- Access and refresh tokens; the session refreshes automatically; signed out after 7 days without use (`SESSION_IDLE_TIMEOUT`, default 168h)
- A temporary, reset or first password must be changed first: the app sends you to Settings → Security until you do
- Log out from the header

**App shell (every page)**
- Sidebar sections: Overview, Pipeline, Warehouse & Site (Stock, Tools, Templates), **HR** (Employees, Teams, Attendance, Leave requests, Payroll, Payroll settings), Finance (Agents stay here), Accounts (Payroll ledgers stay here), Insights, Audit & Books, System, Settings & data. Only the items the person's rights open are shown; empty sections are hidden
- **Sidebar search** (box at the top of the sidebar and the phone menu): filters the menu by name and by page keywords ("salary" → Payroll, "GST" → GST, "stock" or the old name "materials" → Stock); ↑ / ↓ move, Enter opens, Esc clears (a second Esc closes the phone menu); "/" puts the cursor there from anywhere except while typing in a field (below desktop width it opens the phone menu first); only pages the person may open
- **Pinned items:** a pin on every menu item (on hover on desktop, always shown in the phone menu and on touch screens); up to 5 in a **Pinned** block at the top, in pin order; a 6th pin asks which one to replace; pins to pages the person can no longer open are hidden (and dropped at the next change); saved per person in the backend, so they follow the person to every browser, device and company; saving is instant on screen, and if the save fails the pin goes back with a message
- **Page info ⓘ** right after the breadcrumb (after the page title on phones): hover, click, tap or Enter shows what the page is for, what you can do there and where its numbers come from; Esc or a click outside closes it. One description per page, about 70 pages including detail pages (`app/navigation/pageInfo.ts`); the same list gives the search keywords
- Breadcrumbs ("Home / HR / Payroll", "Home / HR / Employees / <name>"), mobile slide-out menu, light/dark toggle
- Payroll page links to Accounts → Payroll ledgers (for people with the accounts right)
- Company switcher: search, "Not on payroll here" tag, company per browser tab (`X-Company-Id`), last company remembered
- Company badge in the company's colour (never covers the title or breadcrumb)
- **Header search** (owner decision 1.1, 13 Nov): one box — a field in the header on desktop, a search icon below that, Ctrl+K / Cmd+K from any page (the sidebar keeps "/"), full-screen on phones. Finds customers, enquiries, projects, quotations, sale bills, purchase bills, vendors and employees by name, phone (the last 10 digits, so "+91 90240 84005" finds 9024084005), document number (CUST-…, enquiry and quotation numbers, PROJ-…, B2B / B2C / INV / SB bill numbers, purchase bill and PO/… numbers) and project K-number (spaces ignored). Results grouped by type, at most 5 each with the number and status on the right, and "See all" opening that list with the search filled in (`?q=` on Customers, Enquiries, Projects, Quotations, Invoices, Vendors, Employees). ↑ / ↓ move, Enter opens, Esc closes. Starts at 2 characters (3 digits for a phone), waits for typing to pause; only the types the person may view are searched, and only in the tab's company
- No "More actions" header button (removed 13 Nov, decision 1.2)
- **Your photo in the header** (13 Nov): your profile photo (initials when there is none) next to your name; on desktop it opens Settings → Profile. On phones the photo opens a small menu (your name and role, Your profile, Dark / Light theme, Log out), which replaces the separate theme and log-out icons so the page title keeps its room. A new photo shows at once, without a reload
- Unauthorized and Not found pages

**Multi-company**
- One login per person, with an employee record in each company they work for
- The company is chosen per browser tab and switched from the header
- The database keeps every company's data apart (row-level security)
- **A Super Admin's circle:** the companies they work in or created (the platform admin also has the original company). They see and manage only these

**Settings → Companies (`/settings/companies`, Super Admin only)**
- List the companies in your circle, with people count
- New company: code, legal and short name, type, GSTIN/PAN checks, CIN, registered address in parts (line 1, line 2, city, state from the list of states and union territories, 6-digit PIN), badge colour, books start date, "Add me"
- **GST state from the address:** the state chosen in the address is the company's GST state (shown read-only with its code, e.g. "Rajasthan (08)"); a company whose address has no state yet shows its stored code with "choose the address state"
- **One address:** the address saved here is the address in Settings → Company of that company, and the other way round
- Card: the one-line address and a **Check address** chip while the address is still the one split from old text
- Edit a company; Active switch
- Add an existing person from the circle: search name or phone, designation, "on payroll here", "track attendance here"
- Automatic: a new company gets copies of masters, templates, task setup and accounts groups

**Settings → Designation access matrix (`/settings/role-matrix`)**
- Designations × features grid with rights view / create / edit / delete / approve / export (V/C/E/D switches), grouped; reset; save; read-only without `rbac` edit
- Extra rights shown as their own line under the feature: Site Visits → **Assign requested visits** (site_visit `assign`, 13 Nov, migration 0168; seeded for Sales Manager, Director, Super Admin and any sales head / manager designation). A save sends each changed cell's other rights too (approve, pay, assign …), so they are kept
- Defaults seeded from the task catalog (migration 0106); Super Admin is a role

**Settings → Departments (`/settings/departments`)**
- List with search and counts; add or edit (name, code, description); Active switch; delete or "Deactivate instead"

**Settings → Designations (`/settings/designations`)**
- List grouped by department, with search; add or edit (name, code, department, description, order); Active switch; delete

**Settings → Security (`/settings/security`)**
- Change password; last sign-in and last password change shown
- Two-factor authentication for admins **[placeholder]**

**Reset password (Employees → ⋮ → Reset password)** — for a forgotten password
- An admin resets it; the temporary password is shown once with Copy
- The person must change it at sign-in and is signed out on their other devices

**Automatic:** rights checked on every API call and page; each company's data kept apart (row-level security).

### APIs
- `/auth/*`: login, refresh, logout, change password
- `/me/companies`, `/me/last-company`
- `GET /search?q=` (owner decision 1.1; company-scoped, any signed-in person): groups `customers` (customer.view), `enquiries` (enquiry.view), `projects` (project.view), `quotations` (quotation.view), `sale_bills` (billing.view), `purchase_bills` and `vendors` (inventory.view), `employees` (employee.view); a type without the right is not searched. Each group: `items` [{id, title, subtitle, number, status}] up to 5 and `more`; `too_short: true` and no groups under 2 characters or 3 phone digits. No new table or index
- `GET /me/preferences`, `PUT /me/preferences` (any signed-in person, own row only, not company-scoped; PUT merges keys, `null` resets one; `sidebar_pins` = up to 5 sidebar paths, no repeats; unknown keys refused) — table `user_preferences` (migration 0136)
- `/companies` (Super Admin, within their circle): list, create, update (`address_parts`: its state sets `state_code` and the company settings' GST state and address), `GET /companies/{id}/candidates`, `POST /companies/{id}/members`
- `POST /users/{user_id}/reset-password` (needs `rbac.edit`; only a Super Admin can reset a Super Admin; nobody resets themselves)
- `/users`, `/roles`, `/features`, `/rbac`, `/departments`, `/designations`
- `/settings/role-matrix`, `/settings/designation-matrix`
- **Backend only:** `/users` list / activate / deactivate / roles; `/roles` CRUD (the old Roles screen redirects to Designations); `/rbac/matrix`; `/auth/change-password`; `/health`, `/ping`, `/swagger`

### Review status
**Status:** reviewed and done (7 Nov 2026, migration 0107). Tests: `hr/u_platform.sh` 19/19, `pw/m1_ui` 69/69 at 1440/768/390 px, fresh database M0 40/40.

Sidebar HR section, search, pins and page info (plan step 3, F1–F4, migration 0136, 11 Nov 2026): `hr/f_sidebar_prefs.sh` 31/31, `pw/f_sidebar_ui` 215/215 at 1440/768/390 px as Super Admin and a Sales Executive.

Header search, More actions and two-step removed (owner decisions 1.1–1.3, 13 Nov 2026): `hr/m1_search.sh` 35/35, `pw/m1_search_ui` 38/38 at 1440/390 px.

**Open:**
- Record-level access (own / team / department) is deferred.

## 2. Settings and masters

**What it does:** company details and all the dropdown lists the app uses.

### Features

**Master lists: no duplicates (13 Nov, 7.1, 0160)**
- A new or renamed value equal to another of the same list ignoring capitals and spaces is refused, naming the existing value (a switched-off one: "switch it back on instead"); DISCOM areas are checked within their DISCOM. Existing duplicates were merged per company: the best-cased value kept (else the oldest), every record moved to it, the duplicate deleted or switched off, logged in `master_item_merge_log` (`app_merge_duplicate_master_items()`)
- **Lost Reasons** list in the Enquiry group (7.4): Price too high, Not interested, Trust / thinks it's fraud, Roof not suitable, Loan not possible, Went to a competitor, Not reachable, Other

**Settings → Profile (`/settings/profile`)**
- Edit first and last name, email, phone; role shown
- Profile photo upload (JPG/PNG/GIF/WebP, up to 2 MB; needs a linked employee)

**Settings → Company (`/settings/company`)**
- Company name, legal name, industry, website, registered / billing address in parts (the shared address form), GSTIN, PAN, GST state (follows the address state, read-only with its code), default GST %
- The address is the same as the company's record in Settings → Companies; saving here updates both
- Logo upload (up to 2 MB; used on PDFs); theme colour. The box shows the **stored** logo through a fresh signed link (also after a reload); the picked file shows only while it uploads; **Remove logo** (13 Nov)
- **Signature and stamp** (13 Nov, decision 2.2): PNG / JPG up to 1 MB each, stored like the logo, with Change / Remove; printed as "For <legal name> / stamp + signature / Authorised Signatory" on sale bills (print and PDF), quotations, purchase orders, sale orders and delivery challans; without images only the text prints
- **Default invoice terms** (multi-line, up to 4,000 characters): fill the terms box of a new sale bill (editable per bill; emptied on purpose = none) and print at the bottom of the invoice
- **Company UPI ID** (name@bank, checked on the page and the server): issued invoices with an amount due print a QR (`upi://pay?pa=…&pn=<legal name>&am=<due>&cu=INR&tn=<bill no>`) with "Scan to pay ₹X"; no QR without a UPI ID, on drafts / void bills or when nothing is due
- **Vendorship: an on / off switch only** (decision 2.3). There is no vendor code number anywhere: files are logged in the PM Surya Ghar portal and the app only records whose vendorship a project is under. The number field is gone here, on code companies (no DISCOM registration code) and on projects; project screens say "Vendorship", "Our vendorship" / "Another firm's vendorship", "Under whose vendorship"
- MSS and MSE are filled in from the letterheads
- **MSS logo (12 Nov):** the MSS-docs logo `Mahi2.svg` (sun over solar-panel “MSS”, “MAHI SOLAR SOLUTION” in Lexend) turned into a transparent PNG (1600 × 1052 px, 127 KB) — logo uploads refuse SVG — and set with the same calls as Change logo (`POST /documents`, module `company`, then `PATCH /settings/company` with `logo_document_id`), so production stores it in S3. Set on production (stored in the S3 bucket, served through the signed sidebar link) and on the local test database

**Settings → Appearance (`/settings/appearance`)**
- Light or dark theme; accent colour

**Settings → Approval limits (`/settings/approval-limits`; owner rows 22 and 35c, 0148)**
- The PO approval limit, the SO approval limit (each ₹50,000 by default, the total with GST) and the over-receipt tolerance (2 % of each PO line by default)
- **Late follow-up alert (sales)** (13 Nov, 7.6, 0160): days a follow-up may be late before the lead owner's manager is alerted (default 2, 1–30)
- Everyone signed in sees them read-only; only a Super Admin or a Director can change them (server-enforced); each change is in Activity

**Settings → Number series (`/settings/number-series`; owner row 10, 0150)**
- Every series: B2B / B2C sale bills, credit notes, SO, DC, PO, GRN, purchase bills (our number, PUR; 11.1, 0163), debit notes, receipt / payment / contra / journal vouchers, customers, enquiries, site visits and fees, quotations, projects, loans — with the next number, the last used and a "Changed" mark
- Change the prefix, separator (/ or -), financial-year part (shown = counts from 1 each year; hidden = one running count), digits and next number, with a live preview ("B2B/2026-27/0007"); every new number is made by one formatter from these settings
- The next number can't be at or below one already used (checked on the documents and the counter); changes apply to new documents only; each change is in Activity
- **Up to 3 series per document kind (12 Nov, owner; migration 0162):** each kind can have series 1–3, each with a **name** (e.g. Solar, AMC, Site), its own prefix / format and **its own counter**; one is the **default**. Settings: **+ Add series** (a new prefix no other series of that kind or table uses), **Change** (name, format, next number), **Make default**, **Remove** (only series 2 / 3 that never gave a number and aren't the default; series 1 always stays). Series 1 keeps the original counters, so numbers already given are untouched; 2 and 3 count on their own keys (`b2b~2:2026-27`).
- **Picking the series on a document:** create forms show a **Series** picker — pre-filled with the default, shown only when the kind has more than one series: sale bills (B2B / B2C follows the bill type), credit notes, SO, delivery challans, PO, GRN, debit notes, vouchers (by type), customers, enquiries, quotations, projects, loans, project site visits. The pick goes with the save request (`?number_series=<series>:<slot>`; a series that doesn't exist → 422). Bills, SO and PO are numbered later (Issue / Confirm / Send): the series picked on the draft is kept (`series_slot`) and used then; editing a draft keeps its series. Not yet pickable (default series): site visits booked from an enquiry, site-visit fees (made automatically on completion), quotations started from the enquiry drawer button, automatic vouchers posted by other modules.
- **APIs:** `POST /settings/number-series/{series}/slots`, `DELETE …/slots/{slot}`, `PUT /settings/number-series/{series}` with `slot`, `name`, `is_default`; `GET /settings/number-series/{series}/options` (for pickers, anyone signed in)
- Super Admin or the accounts edit right changes the company's own series; series shared by all companies (customers, projects, enquiries …) only a Super Admin; everyone else read-only (server-enforced)

**Sidebar company logo (13 Nov):** the active company's logo (Settings → Company) at the top of the sidebar and the phone menu, above the menu search (≈ 40 px high, short name beside it); initials on the company colour when there is no logo; follows the company of the browser tab; the signed link comes with the company list (`GET /me/companies` → `logo_url`, cached 5 minutes, fetched again once if it has run out).

**Settings → Document templates (`/settings/document-templates`; decision 2.4, 13 Nov)**
- The five templates (Vendor Agreement MNRE Ph-II, Feasibility Report, Meter Test Application, Work Completion Report Annexure VIII, Panel & Inverter S.No. Report) edited as formatted text in a frame that carries the template's own CSS (tables, headings, spacing as printed): bold, italic, underline, heading, paragraph, lists, undo
- **Insert field** buttons put a placeholder at the cursor (customer, DISCOM, project, system, meter, company / vendor, document groups — e.g. `{{customer.name}}`, `{{discom.k_no}}`)
- **Live preview** from a project picked in a searchable dropdown, filled by the same code that generates the documents; misspelt fields are listed and left as typed
- **Advanced** (Super Admin): the raw HTML; needs the project edit right to save, view right to open
- The test leftovers "WCR PE" and "WCR address parts" were deleted (switched off where a generated document still points at them; the standard Work Completion Report switched back on where needed)

**Settings → Masters (`/settings/masters`)**
- Groups → categories → items: payment modes, units, project statuses, DISCOMs and areas and others. Every company has its own copy
- Master groups sidebar; search categories; expand / collapse all
- Edit a category's name and description
- Add, edit, delete, set default for items; deactivated items stay listed (marked "inactive") with **Reactivate**
- **Delete a value in use:** one dialog (no browser confirm). The server refuses with what uses it ("Used by 3 vendors and 12 stock items", counted over every table that stores the value); the same dialog then offers **Deactivate**. A built-in value offers Deactivate too. Keyed on the error code (`IN_USE` / `IMMUTABLE`), not the message
- **Deactivated values stay readable:** records keep showing the name with "(inactive)" (stock items, enquiry source, project roof type / phase); edit forms keep the record's current inactive value until it is changed; dropdowns for a new choice list active values only
- DISCOMs and areas by state
- **Reading** a list (any dropdown) is open to everyone signed in. **Changing** lists (13 Nov, decision 2.1): each team edits its own groups — one right per master group in the access matrix (`masterdata_projects`, `_inventory`, `_finance`, `_quotations`, `_enquiry`, `_hr_team`, `_employee_data`, `_gst_tax`, `_audit_books`, `_system`; view / create / edit / delete). Defaults: Accounts → finance, GST & tax, books; CA → GST & tax, books; HR → HR & team, employee data; Stores → stock; Sales manager → enquiry, quotations; Project admin → projects; Director view. `masterdata` stays the all-groups right (Super Admin). The server checks the group of the item / category on every change; the page shows Add / Edit / Delete only on the person's groups ("View only" elsewhere); anyone with a group right can open Masters
- **Leave Types** list in HR & Team (paid, unpaid), editable by HR
- Removed on 11 Nov 2026 (migration 0138, plan B1): the "Vendor Categories" list — a vendor's category is now the fixed field B2B / B2C / General Purchase
- Removed on 7 Nov 2026 (migration 0108): "Payment Methods" (merged into Payment Modes, records repointed), the dummy "Bank Accounts" list, and the unused expense sub-category lists (labour, transport, material, commission, outsource, outsource work tags)

**Bank accounts: one list**
- The bank ledger (Accounts → Ledgers, under Bank Accounts or Bank OD A/c) is the company's record of each account
- Invoices, receipts and loan repayments pick from the same accounts, and receipts post to that account's ledger
- "Print on invoices" on the ledger decides which accounts invoices offer
- MSS's and MSE's letterhead accounts became ledgers "AU Small Finance Bank 3501" / "7480", printed on invoices

**Payment modes → ledgers**
- In Accounts → Posting ledgers, each payment mode (UPI, cheque…) can point to a cash or bank ledger
- Used when a record names no bank account; otherwise cash goes to Cash and the rest to the default bank

**Addresses in parts (plan C, D10; migration 0137) — the same everywhere except enquiries and quotations**
- One address form for customers, vendors, partners, agents, subcontractors, code companies, employees (current and permanent), companies and project sites: line 1 (house / plot, street or village; required once anything is filled), line 2 (area, colony, landmark), city / town, state (dropdown of the 36 states and union territories plus "Other Territory", with the GST code shown), PIN code (6 digits, not starting with 0; the box keeps digits only); no district (Q6); country India, not shown
- Errors under the part, on leaving it and on save; the server checks the same rules and names the part (`address_parts.pincode`)
- The one-line text everywhere else (lists, cards, search, reports) is built from the parts: "line 1, line 2, city, State - PIN" (the state left out when it is the city, e.g. Delhi)
- **Old addresses:** every old one-line address was split by the migration (a trailing PIN, a known state name or spelling, a known city's state, the last comma part as the city; otherwise all of it in line 1) and is marked **Check address** until someone saves it from the form
- Bills keep the address they were made with (text and parts); the print shows line 1, line 2, "City, State (code) - PIN"

**Configuration:** document templates (placeholders include the address parts: `{{customer.line1}}`, `{{customer.line2}}`, `{{customer.city}}`, `{{customer.state}}`, `{{customer.pincode}}`, `{{site.state_code}}`, `{{customer_home.*}}` for the customer's own address, `{{company.line1}}` … `{{company.pincode}}`, and `{{vendor.*}}` — the DISCOM-registered vendor: the code company when the project uses another company's code, else our company) and document requirements, service presets, site-visit blocker types, site checklist templates.

**Sheet-import masters (owner, 13 Nov; migration 0152):** enquiry source "Social Media" is now **Meta Ads** (same id and code, old enquiries keep it), plus **Data Calling** and **Maintenance & Sales Team**; a **Banks** list under Finance (SBI, Bank of Baroda, PNB, Bank of India, Canara, UCO, Union, Indian Bank, Central Bank of India, Rajasthan Gramin Bank, HDFC, ICICI, Axis, Other) for the project bank field to come; DISCOM **JVVNL** with its sub-divisions as DISCOM areas (Jobner, Hathoj, Jhotwara, Kalwar, Sambhar, Renwal, Amber, Binayaka, Bagru, Govindgarh, Badpeepli, Phulera, Chomu, Sanganer, Dudu). In every company and in new ones.

**Other:** password, settings audit log. (The two-step sign-in placeholder was removed from Settings → Security, decision 1.3.)

**Automatic:** every master change goes to a history log.

### APIs
- `GET /settings/approval-limits` (anyone signed in; `can_edit`), `PUT /settings/approval-limits` {po_self_approval_limit, so_self_approval_limit, over_receipt_tolerance_percent} (Super Admin / Director, else 403; Activity)
- `GET /settings/number-series` (anyone signed in; per series `format`, `default`, `last_used`, `next_number`, `preview`, `can_edit`, `shared`), `PUT /settings/number-series/{series}` {prefix, separator, show_fy, digits, next_number} (Super Admin / accounts edit, shared series Super Admin only, else 403; 422 below a used number; Activity)
- `/settings/profile`, `/settings/company` (`address_parts`; its state sets `gst_state_code`; the company record gets the same address; 13 Nov: `signature_document_id`, `stamp_document_id`, `invoice_terms`, `upi_id` — "" clears, a bad UPI ID or a signature / stamp that is not a PNG / JPG ≤ 1 MB → 422; `logo_document_id: ""` removes the logo; the reply has fresh `logo_url`, `signature_url`, `stamp_url`; `vendorship_code_number` with a value → 422, `null` ignored), `/settings/audit-logs`
- `GET /settings/company/print` (any signed-in user): company name, legal name, `signature_url`, `stamp_url`, `invoice_terms`, `upi_id` — the quotation PDF and the new-bill terms use it
- `GET /me/companies`: each company's `logo_url` (sidebar)
- `POST /document-templates/preview` {project_id, html_template, css} (project view): the filled HTML, the known `fields` and the `unknown_fields`; nothing saved
- `/master-data/*`: reading categories and items is open to any signed-in user (`?include_inactive=true` for display lookups); bootstrap, groups and audit logs need `masterdata` or any `masterdata_<group>` view; changes need `masterdata` or the item's / category's `masterdata_<group>` right (else 403)
- `GET /master-data/items/{id}/usage`: what uses a value (`in_use`, `total`, `summary`, `uses[]`); `DELETE /master-data/items/{id}` on a value in use → 409 `IN_USE` with one `data.errors[]` per record kind; built-in → 409 `IMMUTABLE`; `GET /master-data/groups/{id}/tree?include_inactive=true` (Masters screen)
- `GET /bank-accounts`, `GET /bank-accounts/{id}`: read-only mirrors of the bank ledgers (with `ledger_id`, `print_on_invoice`). Add or edit accounts as ledgers
- `/accounts/posting-settings`: also `payment_modes`, saved with keys `mode:<payment_mode_id>`
- `/document-templates`, `/document-requirements`, `/service-presets`, `/discoms`, `/discom-areas`, `/documents` (upload)
- **Backend only:** master item reorder, metadata, audit logs, `/master-data/bootstrap` (used by Masters only); `/document-templates` CRUD; `/document-requirements` CRUD; `/settings/audit-logs`; `/service-presets` create / edit / delete (invoices read them)

### Review status
**Status:** reviewed and done (7 Nov 2026, migration 0108). Tests: `hr/v_settings.sh` 28/28, `pw/m2_ui` 42/42 at 1440/768/390 px, full regression A–V, fresh database M0 40/40.
**Round 2, 13 Nov 2026 (migrations 0155, 0156):** owner decisions 3.1a–3.6 built. Tests: `hr/m3_teams_people.sh` 66/66, `pw/m3_ui` 50/50 at 1440 / 390 px; reruns `a_employees`, `w_people` 43/43, `pw/people_ui` 20/20 at 1440.
**Plan step 4 (C), 11 Nov 2026 (migration 0137):** company address in parts shared by both screens, GST state from the address state, address placeholders in document templates. Tests: `hr/c_addresses.sh` (C60–C61, C93–C94), `pw/c_addresses_ui` (SC01–SC04) at 1440/768/390 px, `pw/m1_ui`.
**Owner decisions round 2, 13 Nov 2026 (2.1–2.4, migration 0154):** team master rights, signature / stamp / terms / UPI QR on prints, vendorship switch only (code numbers dropped), template editor with preview, leftover templates removed; plus the company-logo fix and the sidebar logo. Tests: `hr/m2_settings_round2.sh` 46/46, `pw/m2_round2_ui` 26/26 (1440); `v_settings` 28/29 (V10 legacy), `h1a4_master_conversion` 39/39, `bl_billing` 81/81.
**Plan step 0 (H1), 10 Nov 2026:** master values in use (refusal with counts, Deactivate in the dialog, inactive values readable). Tests: `hr/h1a4_master_conversion.sh` (H1 part, with A4: 39/39), `pw/h1a4_ui` 73/73 at 1440/768/390 px.

## 3. People: employees, teams

**What it does:** the staff list and how people are organised.

### Features

**Employees list (`/employees`)**
- Tabs: Payroll, Crew week board
- Search by name, phone, email or Aadhaar
- Filters: department, designation, status (Active / Inactive / All)
- Stats bar: whole-company total, active and designations (`GET /employees/summary`)
- Pagination with rows per page; the table scrolls sideways on narrow screens so Actions stay reachable
- Add New Employee: name, phone (stored as 10 digits), alternate phone, email (stored lower-case), date of birth (18+), Aadhaar (12 digits, spaces allowed), PAN (optional, like ABCDE1234F, saved in capitals, unique in the company), emergency contact (name, relation, 10-digit phone), current address in parts and permanent (home) address with a "same as current" tick (ticked for a new person), department + designation (more than one allowed), monthly salary (more than 0; 0 only when not on payroll — outside CA, owner, director), joining date, "on payroll here" and "track attendance here" switches. First password is the phone number; the person must change it at first sign-in
- Row buttons: Pay (Module 5), Task (assign a task)
- Row ⋮: Edit profile, Deactivate (Mark as left, with the exit checklist) / Reactivate (Take back: rejoining date and reason), Reset password, View details
- **Crew week board** (13 Nov, replaces the Site Deployment Board): rows per team and its members, a column per day (Mon–Sun, previous / next / this week), the project in each cell linked to the project (✓ = marked at the site by the crew leader), team and member names link to their pages; a person at two sites on a day gets a "2 sites" hint, never a block; scrolls inside its card on phones
- **Profile photos as avatars** (13 Nov): each person's photo, or their initials, on the Employees list, the employee panel, the attendance board and Analytics → top performers; from `GET /employees/photos` (any signed-in member of the company; only people with a photo, 15-minute links, refreshed every 10 minutes and right after a photo is uploaded or removed)

**Edit employee drawer**
- Profile: name, email, alternate phone, joining date, current address in parts, permanent (home) address or "same as current" (off for people added before), Aadhaar, PAN, emergency contact (name, relation, phone; an empty box clears it), date of birth (phone can't change); an address split from old text shows a note to check it
- Role & designation: add designations, set primary, remove, save (exactly one primary)
- Salary: record a change with reason (once a month, after the latest change); a future date is saved at once; **a past date waits for a Director's (or Super Admin's) approval** — the "Back-dated salary changes" list shows old → new, who asked, the status, Approve / Reject for Directors, and once approved the arrears per month and the payroll that pays them; salary history table (effective dates)
- Bank: add an account (bank name from the Indian bank list, holder, account number 9–18 digits, IFSC checked live); the first account is primary; Remove (needs delete right) makes the next account primary

**Employee details (`/employees/:employeeId`)**
- Header: Edit Profile, Deactivate / Activate
- **Mark as left (exit checklist, 13 Nov):** leaving date and reason, then what is still open: advance outstanding, tools with them, open tasks, open site visits, leave waiting, days this month without attendance, unpaid salary months, crews they lead, and the final salary (days paid, advance recovered, to pay before PF / ESI / TDS, advance still to recover). Warnings only; Confirm stays disabled while an advance is outstanding until "Recover the advance from the final salary" is ticked (or a cash repayment is recorded first)
- **Exit and rejoin history** card: every join, leave and rejoin with its date, reason and who did it (older records backfilled)
- Profile rows include PAN and the emergency contact
- Profile card (photo not shown yet): current address (with a **Check address** chip while it is the split old text) and permanent address ("Same as current address" when ticked)
- Documents: upload with a **required type** and notes, **max 1 MB** for now (the production web proxy refuses bigger requests; the API takes 15 MB — set `VITE_MAX_UPLOAD_MB=15` once nginx `client_max_body_size` is raised to 16m); a bigger file shows a warning under the picker and isn't sent; view, download, delete
- **One current file per type** (13 Nov, owner; migration 0161): uploading a type already on file says "Aadhaar is already on file (…). Uploading replaces it" and the old file becomes a **previous version** (kept, never deleted; listed under "Show previous versions (n)" with the date it was replaced); "Other" keeps any number of files; deleting the current file brings back the one before it; files uploaded twice before 0161 were sorted the same way (newest current)
  - **File formats per type (12 Nov, owner; the server checks the same):** Passport Photo → photo only (JPG, PNG, WebP, HEIC); Aadhaar, PAN, Bank Passbook / Cancelled Cheque, Address Proof, Education Certificate, Experience Letter → photo or PDF; Offer Letter, Agreement / Contract, Resume / CV, Other → PDF, Word (DOCX) or photo. The type is picked first; the file picker then offers only those formats and says which; a refused file is named ("Passport Photo takes JPG, PNG, WebP, HEIC only")
  - **View / Download fixed on production (12 Nov, owner bug):** the old buttons fetched the file through a redirect to S3, which the browser blocks (the bucket has no CORS rules), so nothing opened. View now asks `GET /documents/{id}` for a fresh 15-minute link and opens it in a new tab; Download uses its new `download_url`, a link that saves the file under its own name (`Content-Disposition: attachment`; local storage: `?dl=1&name=`)
- HR & Finance tabs:
  - Attendance: year select, month cards with present / paid leave / absent / holiday, **salary exactly as payroll prices it** (`GET /employees/{id}/salary-by-month`), advances; leave balance (edit default credit, edit month, grant days); Apply leave
  - Tasks: the person's tasks from the tasks list, with start / hold / done / cancel / reopen (reasons) (Module 14)
  - Site visits: site measurements (record / view / edit), scheduled visits (travelled, complete, not complete → reschedule or lost)
  - Payroll: month controls, give advance, pay salary, salary history, advance history, salary revisions, repay
  - Leave requests: approve, reject, cancel, revoke, request / approve / dismiss cancel

**Teams: switched off for now (12 Nov, owner)** — the menu item shows **Soon** and `/teams` shows Coming soon until Teams and Tasks are designed at the end (see Module 14). Crews on projects and the crew attendance page are not changed.

**Teams list (`/teams`)** (each company has its own teams)
- Stats; search (name and notes); status filter; sort; pagination
- Teams are installation crews (a leader and helpers). A person can be in several teams; the leader is always a member
- Create team: name, notes, members (at least 2), leader from the members
- Edit, deactivate / activate (buttons follow the team rights)

**Team details (`/teams/:teamId`)**
- Overview; members show "also in <other teams>"; Manage members; change leader (replace the leader before removing them); past memberships are kept (joined / left dates)
- Tabs: Projects worked on, Scheduled installations, Work history, Tasks assigned (team calendar work and tasks given to current members, with who has each)

**Moved elsewhere:** Agents are in the Finance menu (Module 12); the task catalog is in the mss-nk portal (Tasks: who does what).

**Automatic**
- Names (people, parties, items) saved with single spaces everywhere
- Deactivating someone takes them off their teams (and clears them as leader)
- A team assigned to a project's site work (project → Assigned team, from / to dates) puts the work in every member's **My day** ("Site work — <project>", with the crew and "you lead") and **calendar** (installations, one entry per day, linked to the project), following who is in the team each day: someone added later gets it from that day, someone removed drops off from that day. Without the project view right a person still sees their own crew work. The leader marks work items done with GPS photos as before
- Crew pay is not project cost: salaries are never booked to a project

### APIs
- `/employees` (list, summary, create, update — `current_address_parts`, `permanent_address_parts`, `permanent_same_as_current` (the server copies the current parts); assignments, salary history, salary by month, documents, bank accounts, deactivate / reactivate, attendance summary)
- `GET /employees/photos`: employee id, user id and a 15-minute link for everyone in the company with a profile photo (avatars; any signed-in member, 13 Nov)
- `/teams` (members with `other_teams`, leader, tasks)
- `GET /crew/week-board?from=` (team view): 7 days, teams, members, per-day sites (`assigned` / `marked`, time) and `several_sites`
- `GET /employees/{id}/exit-checklist?leaving_date=`, `GET /employees/{id}/service-history`; `POST /employees/{id}/deactivate` takes `advance_action` (`deduct_from_final_salary`, needed while an advance is outstanding); `POST /employees/{id}/reactivate` takes `rejoin_date`, `reason`
- Employee create / update take `pan`, `emergency_contact_name`, `emergency_contact_relation`, `emergency_contact_phone`
- `GET /salary-changes?status=&employee_id=`, `POST /salary-changes/{id}/approve | reject` (Director / Super Admin); `POST /employees/{id}/salary-history` with a past date returns `status: pending_approval`

### Review status
**Status:** reviewed and done (7 Nov 2026, migration 0109). Tests: `hr/w_people.sh` 43/43 (in `regress.sh`), `pw/people_ui` 60/60 at 1440/768/390 px, full regression A–W.
**Plan step 4 (C), 11 Nov 2026 (migration 0137):** current and permanent address in parts (Q7). Tests: `hr/c_addresses.sh` (C50–C53), `pw/c_addresses_ui` (EM01–EM06) at 1440/768/390 px, `hr/a_employees.sh` 41/41, `pw/people_ui`.

**Later, with the module that owns it**
- Departments and designations shared by all companies → access-control redesign.
- Profile photo access → access matrix.
- Leave requests and attendance dates (UTC vs IST) → Attendance (4).
- Site visit "Complete" saving only file names → Site visits (8).
- Team project overview loading every project → Projects (10).
- ~~Employee task tab → Tasks (14)~~ — done.

## 4. Attendance and leave

**What it does:** daily attendance and leave, feeding payroll.

### Features

**Attendance board (`/attendance?date=…`)**
- Date: previous, next, picker, Today; the day is kept in the link; search name, code or phone
- Show All / Marked / Unmarked; filter by status
- Statuses: present, absent, half day (½ day deducted), half paid leave (½ paid-leave day used), paid leave, unpaid leave, holiday, fun day
- **Worked on a company holiday** (4.4 / 4.5, 13 Nov): on a holiday each row offers Worked full day / Worked half day / Not worked (the day stays a paid holiday); the row says "+1 day's pay" or "no extra pay". A full day adds one day's pay to that month's salary (Module 5); a half day adds nothing. Refused on a normal day and on a future day
- Mark Present, Absent, Half Day, Paid Leave (Unpaid Leave for future days); Edit drawer adds Half Paid Leave and Clear
- Paid leave confirmation with the month's balance; "Mark Present instead of leave?" when a pending leave covers the day
- Absence → paid leave only within 7 days, then with a reason by a Super Admin
- Mark all present: preview who is marked or skipped, confirm (not future dates or holidays)
- **Lock after payroll** (decided in Module 5): once a month's salary is paid (or part paid), only HR or a Super Admin may change that month's attendance, and must give a reason; the board asks for it. The difference goes on the next salary as a correction at that day's rate
- **Sunday is a normal working day** (decision 7 Nov 2026): it can be marked like any day; leave over a Sunday uses it
- Without attendance edit: only your own row; salary, payable and advances only with payroll rights
- Work-log and "also assigned" hints; empty states

**Crew attendance at the site (`/crew-attendance`, 13 Nov)**
- For team leaders (link on My day: "Mark crew attendance at the site", and on the Attendance page); HR / Super Admin see and may mark every crew
- Day picker (today or earlier); one card per crew they lead: today's assigned sites, each member with today's status and every site mark (time · present / half day · project or note, other crew in brackets)
- Tick members (Select all), Present or Half day, time (now by default), project (today's sites, or none with a site note), site note; the phone's location is taken when marking and shown
- A person marked anywhere counts as present for the day (present beats half day); **two half-day marks at two sites (or two times) make a full present day**, one half-day mark stays a half day (13 Nov); marks at several sites the same day are all kept; the day is the normal attendance and feeds payroll
- Refused: no location, a future day, a time that isn't HH:MM, someone outside the crew (named in the result), a team they don't lead, more than 7 days back (leaders), a member on leave that day (HR changes leave)
- **On a company holiday** (13 Nov): the page says so; a present mark records "Worked on holiday" (a full day, one extra day's pay), a half-day mark "Worked half day on holiday" (nothing extra); two half-day marks make a full day

**Holidays (drawer)**
- Company holidays per company; list by source (Company / Calendar)
- Add a company holiday (clears leave, absent and half-day marks that day); delete (calendar holidays only by a Super Admin)

**Employee attendance view (`/attendance/employees/:employeeId`)**
- Details card; present (half days count ½), absent, paid / unpaid leave, holidays, working days, per-day pay, total payable
- Month calendar; history table by date range and status; "Request paid leave" on an absent day

**My space (`/my-space`, every employee; self-service, 13 Nov)** — one place for everything about yourself, in everyone's menu (HR section) whatever the designation; only the signed-in person's own records in the company the tab works in. `/my-attendance` opens its first tab.
- **Attendance & leave:** paid leave left and the month's balance; **Apply leave** from tomorrow onward (reason required; same paid / unpaid split rules); my leave requests with Cancel while pending and "Request cancel" once approved; the month day by day with totals and history
- **Salary:** each month once payroll is approved (never a draft): days paid of the month, gross, extra pay, attendance corrections, deductions (leave, other, PF / ESI / TDS, advance recovered), net pay, paid or not and when; **Download payslip** (PDF)
- **Advances:** ask for an advance (amount and reason; it always waits for someone else to approve), withdraw a request not yet approved (its reason is kept), each advance's status and what is left to recover, and the total still to recover from salary
- **Incentives:** the person's rules in words ("₹2,000 for each project you convert, after the first 3 of a month; earned when the project is fully paid"); each project converted, by month, as Earned / Fills the monthly minimum / Waiting for full payment / Cancelled; projects brought (referrals) with their state; incentive and referral lines on salaries (a recovery in red, a month still being prepared marked so)
- **Documents & details:** the details HR holds (name, phone, email, designation, department, joining date, date of birth, current address, PAN, emergency contact), the salary bank account with only the last 4 digits, the documents on file (open each) and **Upload** a KYC document (Aadhaar, PAN, bank proof …) that HR then sees on the profile
- My day's attendance tile opens it for anyone without attendance edit ("Not marked yet: HR or your crew lead marks it")

**Leave requests (`/leave-requests`)**
- Waiting / Approved / All; search by name
- Each request: person, dates, days, paid or unpaid, reason, status, when asked
- Approve / Reject; for a cancel request, Approve cancel / Keep leave; not on your own request
- Approving leave needs attendance → approve (HR and Director by default)
- Approvers get a "Leave request waiting" notification
- **Paid-leave year end** card (HR / Super Admin, 4.3, 13 Nov): carry-forward cap in days (company setting, default 6; half days allowed); "Run year-end for 31 Mar <year>" for the last three year ends; per person: unused on 31 Mar, carried to April, lapsed; the list of runs (who, when, cap, totals; "by the system on 1 April" for the worker's run). Running again changes nothing for people already carried

**Leave (on the employee profile)**
- Balance: opening, credit, used, available, reserved; grant days, edit default credit, edit a month (attendance edit only)
- Apply leave with a month-by-month paid / unpaid split preview; **a reason is required** (13 Nov: Submit stays off until it's typed; the API refuses a request without one, except the board's own entries)
- Requests: approve, reject, request cancel, approve cancel, dismiss, revoke (approve right; not your own)

**Automatic:** monthly paid-leave credit; every attendance change re-prices the month's payroll (or adds a correction to a later payroll); deactivating someone cancels their later leave; **the paid-leave year end runs in the worker during April** for the year that ended on 31 Mar (each company in its own scope; unused leave up to the cap carries into April, the rest lapses, both as history entries with the reason; April's balance starts from the carry and later months follow on).

### APIs
- `/attendance/board` (mark, autofill, clear), `/attendance` (filters: employee, team, status, dates, search), `/attendance/statuses`, `/attendance/leave-balances`, `/attendance/employees`, `/attendance/post-salary`
- `/holidays`, `/leave-requests` (approve / reject / revoke / dismiss need attendance → approve)
- `/attendance/board/mark` also takes `status_code: holiday_worked | holiday_worked_half` (holiday only); the board card has `holiday_work` (full / half)
- `GET /attendance/leave-year-end?year_end=` (cap, last year end, runs, each person's carry / lapse), `PUT /attendance/leave-year-end/settings` (`cap`), `POST /attendance/leave-year-end/run` (`year_end`; attendance edit), `GET /attendance/leave-adjustments?employee_id=` (balance history: edits, grants, year-end carry and lapse)
- `GET /crew/teams` has `holiday_name` when the day is a company holiday
- `GET /crew/teams?date=` (crews the person leads, or all for attendance edit, with members, day status, marks and today's sites), `POST /crew/attendance` (team_id, employee_ids, date, status, time, latitude, longitude, accuracy_m, project_id, site_note; per-person results), `GET /crew/attendance?date=&employee_id=`
- **Backend only:** `/attendance/post-salary` (the Pay drawer's "Prepare salary" button calls it; it no longer runs when the drawer opens)

### Review status
**Status:** reviewed and done (7 Nov 2026, migrations 0110–0112). Tests: `hr/x_attendance.sh` 28/28 and `hr/b_attendance.sh` 29/29 (both in `regress.sh`), `pw/attendance_ui` 63/63 at 1440/768/390 px, full regression A–X, fresh database M0 40/40. Plan and findings: [MODULE_REVIEW_PLAN.md](./MODULE_REVIEW_PLAN.md#module-4-attendance-and-leave).
**Round 2, 13 Nov 2026 (migration 0155):** crew attendance at the site. Tests: `hr/m3_teams_people.sh` (M3-20–M3-34), `pw/m3_ui` (C01–C09) at 1440 / 390 px.
**Follow-up, 13 Nov 2026 (BE 102888b, no migration):** two half-day crew marks = a present day. Tests: `hr/m3_teams_people.sh` M3-35–M3-37 (73/73).
**Round 2, decisions 4.3–4.5, 13 Nov 2026 (BE 572d33c, FE 14545fb, migration 0157):** paid-leave carry-forward with a 6-day cap, worked on a company holiday. Tests: `hr/m4_leave_holiday.sh` 34/34, `pw/m4_ui` 17/17 at 1440; reruns `m3_teams_people` 73/73, `pw/attendance_ui` 1440 all passed.

## 5. Payroll and advances

**What it does:** monthly salary and staff advances, posted into the books.

### Features

**Payroll (`/payroll?month=…`)**
- Flow: build the month for everyone on payroll → check and adjust each line → approve → pay one by one. Nothing is created just by opening a screen
- Month previous / next (finished months only); the month is kept in the link
- No payroll yet: "Build payroll for <month>" (payroll create); otherwise "Ask HR or Accounting"
- Status line (draft / approved / paid), people and paid count; totals: gross, extra pay, leave and other deductions, corrections, advance recovered, net to pay
- "Out of date" banner with Recalculate when attendance or salary changed after building; Approve (payroll approve; waits for recalculation); Cancel payroll with a reason (only while nobody is paid)
- Search by name; table on wide screens, cards on phones and tablets: payable days, gross, leave deduction, extra pay, other deductions, advance recovery, attendance corrections, net, paid status
- Adjust a line (draft only, unpaid): **extra pay** — overtime, bonus, incentive, what it's for (needed with extra pay); other deduction; advance recovery automatic or a chosen amount
- **Final settlement** tag on the line of someone who left in that month (days up to the leaving date; advance recovered up to the net pay, the rest stays a recoverable advance)
- **No pay between leaving and rejoining** (13 Nov, from the exit and rejoin history): the leaving month pays up to the leaving date, a month wholly in the gap leaves the person off the run, the rejoining month pays from the rejoining date
- **Incentives and referrals when the project is fully paid** (Module 5 round 2, 5.1–5.8, 13 Nov, migration 0158): a conversion incentive or a referral is earned in the month the project becomes fully paid — everything received, a bank loan included (the day the received total reaches the contract). The monthly minimum counts the projects converted in a month: the first ones fully paid fill it ("fills the monthly minimum of 3 (Aug 2026), not paid"), each one fully paid after that earns. A cancelled project leaves the count; money already paid for a project that no longer earns (cancelled, recount, no longer fully paid) comes back as a red "Incentive / Referral reversed — project … (why)" line on the next salary, no more than that month's pay (the rest in later months); HR can remove it with a reason to let it go
- **Share** an incentive or referral line (HR, draft payroll, before approval): choose someone in the same payroll, an amount (up to the line) and a reason; the line drops by that amount and the other person gets an "Incentive share from <name>" line. Shares are recovered from each holder if the project is cancelled
- Extra pay lines: incentives, referrals, **holiday work** ("Holiday work – 02 Oct 2026 (Gandhi Jayanti)": one day's pay, monthly salary ÷ days in the month, for each full day worked on a company holiday; 4.4, 13 Nov) and **salary arrears** ("Salary arrears — <month> (paid ₹…, due ₹… at the salary from …)") from an approved back-dated salary change, once per month
- Pay (opens the Pay salary drawer on that month); Payslip download
- Advance approval limit (advance approve right; default ₹10,000)

**Employees → Payroll tab**
- Month select (previous / next); salary, net, paid and status per employee
- Pay salary drawer: payable days, leave deduction, paid leave, attendance corrections, advance recovery (capped), net payment, payment mode, "Paid from (books)" bank or Automatic, date, reference; "Prepare salary" when the month isn't built (payroll create); "Settle ₹0 salary"; Payslip
- Part payments; undo a payment with a reason (history kept); prompt to add bank details
- Payroll books banner when ledgers aren't set, with "Post pending to books"

**Employee profile → Payroll tab**
- Pay calculation for the month (gross, leave, other deductions, extra pay, corrections, recovery, net)
- Salary history with Payslip per month, salary revisions, advance history
- Give advance: HR or the employee asks; within the limit (and not your own) it's approved and paid at once; above it, or without approve rights, it's sent as a request
- Advance history: status (waiting for approval, approved, rejected, …); Approve / Reject (approve right; nobody approves their own; above the limit someone other than the requester); Pay advance; recovered from salary or Record repayment in cash (advance edit)

**Payslip PDF** (per person per month): earnings ("Final settlement: salary for N of M days (left on …)" in the leaving month), extra pay with arrears and holiday-work lines, deductions, advance recovered, payments, advance left. Statutory deductions are not included yet.

**Add / Edit employee**
- "On payroll here" and "Track attendance here" switches; salary needed only when on payroll (staff with no salary: outside CA, owner, director)

**Accounts → Payroll ledgers (`/accounts/payroll-ledgers`)**
- Salary expense ledger, employee advances ledger, default bank; Post pending

**Automatic**
- Attendance, leave or salary changes re-price unpaid lines, or flag the month "out of date" if that fails
- After a month is paid, attendance changes (HR / Super Admin with a reason) add a correction at that day's rate to the next salary (see Module 4)
- Holiday work: the month's line keeps one "Holiday work" line per full day worked on a holiday (removed if the mark is taken back; a hand-edited amount is kept); once the month is approved, a later mark becomes a correction of one day's pay on the next payroll
- Salary, advance recovery, advances and repayments post to the books; when something can't be posted a warning shows, with "Post to books"
- A Director's approval of a back-dated salary change records the arrears of every month already approved or paid since the effective date; the next payroll pays them (a lower salary becomes a correction there); draft months from the effective date are flagged for recalculation

**Added in Accounts round 2 (0133):** salary structure on the employee (basic %, HRA %, allowances, PF / ESI on-off, UAN, ESIC no., PAN, tax regime and old-regime deductions, month preview); PF (12 %, EPS / EPF split, ₹15,000 ceiling, admin, EDLI), ESI (0.75 % / 3.25 % up to ₹21,000), TDS on salary from the yearly estimate with a monthly override; payslip, payroll register (CSV), PF (CSV + ECR), ESI and TDS files; employer PF / ESI expense and PF / ESI / TDS payable in the books; incentive / referral rules per employee (per converted project with monthly threshold, per project brought, per watt brought) as editable extra pay, each project once; AU Small Finance Bank bulk salary file (CSV / Excel, columns in Payroll settings, missing bank details listed); Payroll settings page (rates, slabs, bank file); HR approves, paying needs the pay right; nobody approves a payroll they built.

### APIs
- `/payroll/runs` (generate, recalculate, approve, cancel), `/payroll/items` (adjust, pay, payslip), `/payroll/employee-items`, `/payroll/payments` (undo), `/payroll/books-status`
- **My space (self-service):** `GET /me/payroll` (approved / paid months), `GET /me/payroll/items/{id}/payslip`, `GET|POST /me/advances`, `POST /me/advances/{id}/withdraw`, `GET /me/advances/{id}/deductions`, `GET /me/incentives`, `GET|POST /me/documents`, `GET /me/documents/{link_id}/download`, `GET /me/bank-accounts` — any signed-in member, own record only
- `POST /payroll/extra-lines/{id}/split` `{employee_id, amount, reason}` (payroll edit; draft run, unpaid lines; not the project's own referral amount or a recovery); extra lines carry `source` `rule` / `project` / `attendance` / `split` / `reversal` (reversal amounts are negative)
- `/payroll/items` and `/payroll/runs/{id}/items` carry `final_settlement` and `leaving_date`; extra lines may be `kind: arrears` or `kind: holiday_work` (source `attendance`)
- `/advances` (submit, approve, reject, pay, repay, cancel, deductions), `/advances/settings` (approval limit)
- `/accounts/payroll-ledgers`
- **Backend only:** cancel an advance; advance deductions list

### Review status
**Status:** reviewed and done (7 Nov 2026, migration 0113). Tests: `hr/y_payroll.sh` 38/38 and `hr/c_payroll.sh` 27/27 (in `regress.sh`), `pw/payroll_ui` 75/75 at 1440/768/390 px plus HR's view, `pw/people_ui` 60/60 and `pw/attendance_ui` 63/63 rerun, full regression A–Y, fresh database through 0113 and 0113 down/up. Plan and findings: [MODULE_REVIEW_PLAN.md](./MODULE_REVIEW_PLAN.md#module-5-payroll-and-advances).
**Round 2, 13 Nov 2026 (migration 0156):** final settlement and salary arrears. Tests: `hr/m3_teams_people.sh` (M3-70–M3-91); reruns `y_payroll` 38/38, `c2_payroll` 72/72.
**Follow-up, 13 Nov 2026 (BE 102888b, no migration):** no pay in the gap between leaving and rejoining. Tests: `hr/m3_teams_people.sh` M3-100–M3-103 (73/73); reruns `y_payroll` 38/38, `c2_payroll` 72/72, `a_employees` 41/41.
**Round 2, decision 4.4 / 4.5, 13 Nov 2026 (BE 572d33c, FE 14545fb, migration 0157):** holiday-work pay line. Tests: `hr/m4_leave_holiday.sh` M4-25–M4-30; reruns `y_payroll` 38/38, `c2_payroll` 72/72.

**Later (agreed):** statutory deductions (PF, ESI, professional tax, TDS); bank transfer file for bulk salary in net banking (format not final); project commission for employees in specific conditions (to discuss).

## 6. Customers

**What it does:** the customer master and everything linked to each customer.

### Features

**Customers list (`/finance/customers`)**
- Figures for the whole company: active, individuals, companies, inactive, **Overdue** (customers with an issued bill past its due date, and the amount) and **Due this week** (due today or in the next 7 days)
- Search name, phone, email, GSTIN, city or PIN code (debounced, any language); type filter; Active / Inactive filter; **Dues filter** (All / Overdue / Due this week, from the server); pagination; all kept in the link
- Add customer: type, name, phone, email, GSTIN, **PAN (optional, 13 Nov, owner; 0166 — 10 characters like ABCDE1234F, stored in capitals, copied to new quotations)**, address in parts (line 1, line 2, city / town, state from the list with its GST code, 6-digit PIN; **line 1 and the state are required** for a new customer — city and PIN optional — and for an existing one when its address is saved again, on this form and the quick customer forms of enquiries and projects, and on the server (owner row 27); errors under the part; a note — not an error — when the GSTIN's state differs from the address state), location (coordinates or map link), notes, **payment terms** (Full advance · On delivery / receipt · Net N days with credit days, due from the invoice date or the month end · Custom with a note; optional part advance %; a note printed on bills; a live line "Net 30 days · a bill dated today is due on …"). One name rule on screen and server (letters in any language, spaces and . , & ( ) / ' -; no digits)
- **One phone and one GSTIN per company:** a second customer with the same phone or GSTIN is refused, and the form names the existing customer with "Open that customer"
- Card: type, Inactive badge, one-line address with a **Check address** chip while it is the split old text, the payment terms, the dues line ("Overdue ₹68,000 · 1 bill", "Due this week …"), Edit, View, Delete, Start enquiry (each shown only with the right)
- **Inactive instead of delete:** delete works only for a customer with nothing linked; otherwise it says what's linked (e.g. "1 enquiry, 2 projects, 1 bill and 3 entries in the books") and offers "Mark inactive instead"

**Customer details (`/finance/customers/:customerId`)** — one page for everything
- Figures: contract value (not cancelled projects), B2B bills and B2C bills (plan E1; old invoices and sale bills counted by the GSTIN printed on them), received (hover: on bills / on projects / via sub-vendor), outstanding or advance, projects, quotations; an error message instead of hanging if they can't load
- **Received and Outstanding follow the books:** received counts bill receipts, project receipts and payments collected for us by a sub-vendor; Outstanding = sale bills (B2B + B2C, old invoices and sale bills included) − received, which equals the customer's balance in the books (negative shows as "Advance")
- Header: the payment terms ("Net 15 days from month end", or "No payment terms")
- **Dues block:** open, overdue, due in 7 days and due later (amounts and bill counts), ageing (not due, 0–30, 31–60, 61–90, 90+ days past the due date, as on Audit → Debtors), each open invoice / sale bill billed to the customer with its due date ("no due date — counted from the bill date"), an Overdue / Due chip and what is left; a bill opens the invoice
- **Payment terms changes** (who, when, before → after; applies to new bills only), also on the History tab
- Edit (confirms renaming: the name is on agreements and invoices; the books ledger is renamed too); fields can be cleared; payment terms changed or cleared (new invoices only; due dates already on bills stay); an address split from old text opens with a note to check it, and saving marks it checked
- Mark inactive (confirm) / Make active; inactive banner hides Create quotation / project / invoice
- Create quotation, create project (several per customer), create sale bill (B2B / B2C first), record payment (choose project)
- Tabs: Enquiries (follow-up, size, budget, status, project), Quotations, Projects (number, name, size, status, contract), Sales bills & payments (one list of every sale document with its type — B2B sale bill, B2C sale bill, Invoice / Sale bill (old series) — every payment received — on bills and on their own projects — with links to the bill or project), Notes (add and list), Visit fees (every fee with received, refunded, balance and status; receipts with who collected and who keeps the money, void with a reason, refund, waive, cancel, move to a project; summary strip), History (titles, links to enquiries, quotations, projects, invoices)
- **Sale orders tab** (plan D2, billing view right): the customer's sale orders with the list's figures and filters, "New sale order" for the customer (billing create right)
- Buttons follow the user's rights (customer create / edit / delete, quotation, project, billing)

**Same mobile, family link (I1, 13 Nov; migration 0152)**
- Two customers may share a mobile in one company (e.g. Rajesh and his wife Sugan Devi, each with a project). Saving one shows "This number already belongs to <name> (CUST-…)"; **Save anyway** saves it, with **Link them as family** ticked by default; **Go back** saves nothing. The same in every customer form (customers page, enquiry, quotation, project).
- Customer page: **Family** (the link both ways) and **Same mobile** lines with links; Link family / Change / Remove link
- The GSTIN stays unique in a company; the enquiry customer picker lists every customer on a searched mobile to pick from

**Account statement (6.3, 13 Nov)** — Statement button on the customer page (customer view right)
- A date range, default the current financial year (1 April) to today; Download PDF, Print (the PDF in a new tab), Share on WhatsApp
- The PDF on the letterhead (company logo, name, address, GSTIN, PAN, website): the customer's name, address, phone and GSTIN; the period; the **opening balance** on the start date; one row per sale bill, receipt (with the mode, reference and any TDS), advance and credit note in date order with date, document number, description, debit, credit and **running balance** (Dr = due from the customer, Cr = advance); the **closing balance**; the dues on the end date (open, overdue, due later) and the ageing buckets; the **UPI QR** for the amount due when Settings has a UPI ID
- The figures are the customer page's: bills = issued sale documents to the customer, credits = everything counted in Received (bill receipts incl. TDS, project receipts, sub-vendor, bank loan, visit fee, code company) and issued credit notes, so the closing balance on today = Outstanding (less any advance) and the running balances agree with the customer's ledger in the books

**Share on WhatsApp (6.4, 13 Nov; migration 0159)** — on the statement, sale bills and quotations
- The dialog makes a **secure link** to the PDF and fills a short message: company, document number, amount (balance due after a part payment), due date for bills, the link and its expiry. The customer's mobile (10 digits; +91 / spaces / a leading 0 accepted) and the message can be edited; **Open WhatsApp** opens `https://wa.me/91<mobile>?text=…`; **Copy link** copies just the link. No mobile on file (e.g. a landline) → the field asks for one and WhatsApp waits
- The link works **7 days** without signing in and opens only that PDF; it is the link id plus an HMAC signature (server secret), so it can't be guessed or edited. Bills and statements are made fresh when opened; a quotation's PDF (made in the browser) is stored when the link is made. Every open is logged (served / expired / error) and each link is in Activity. An expired link shows "This link has expired", an edited one "This link is not valid"
- Shown only to people who can view the document (customer view for statements, billing view for bills, quotation view for quotations); drafts can't be shared

**Automatic**
- Each customer gets a ledger under Sundry Debtors on their first posted invoice or payment; renaming the customer renames it; deleting an unused customer removes an unused ledger
- Inactive customers are hidden from lists and pickers and can't get new enquiries, quotations, projects or invoices (payments still allowed); "Make active" brings them back

### APIs
- `/customers` (list with `status`, `dues=overdue|due_week` and whole-company `counts` incl. `overdue`, `overdue_amount`, `due_week`, `due_week_amount`; each row has `dues` {open, overdue, overdue_count, due_week, due_week_count}; search incl. city and PIN, create, edit incl. `is_active` and clearing fields, delete); `payment_terms` in and out ({type, credit_days, due_basis, advance_percent, note, label}; omitted keeps, `{"type":""}` clears; 422 names the part, e.g. `payment_terms.note`); `address_parts` in and out (`address` stays the one-line text; an old client's `address` text is split and marked `unchecked`)
- `/customers/{id}/…` (enquiries, quotations, projects, invoices — every sale document since E1, payments, site-visit-fees, notes, timeline — incl. `payment_terms_changed`, financial-summary — with `total_b2b_amount` / `total_b2c_amount` since E1); **backend only:** `/customers/{id}/sale-bills` (the old SB series)
- `GET /customers/{id}/dues` [customer.view]: the Dues block (open / overdue / due_week / not_due with counts, oldest overdue days, `buckets`, `bills[]` with due date, source, days overdue, state); `GET /customers/{id}/history`: payment-terms changes
- **6.3 / 6.4 (13 Nov):** `GET /customers/{id}/statement?from=&to=` [customer.view] — the PDF (`statement-<from>-to-<to>.pdf`; `inline=1` to open in the browser; `format=json` for the figures: opening, lines[], totals, closing, dues); `POST /customers/{id}/statement/share` {from, to} [customer.view]; public `GET /api/v1/share/{token}` (no sign-in: the PDF, 410 expired page, 404 not valid page)
- Removed (0137, Q8): `/customers/{id}/addresses` and the unused `customer_addresses` table
- I1 (0152): create / edit take `confirm_same_phone` and `related_customer_id` ("" clears); a shared mobile without the confirmation → 409 `CUSTOMER_PHONE_SHARED` (message names the customers; `data.errors[]` `existing_customer_id`); detail / create / edit return `related_customer_id`, `family[]`, `same_phone_customers[]`

### Review status
**Status:** reviewed and done (8 Nov 2026, migration 0114). Tests: `hr/z_customers.sh` 25/25 (in `regress.sh`), `pw/customers_ui` 71/71 at 1440/768/390 px plus a view-only Accounting user, full regression A–Z. Plan and findings: [MODULE_REVIEW_PLAN.md](./MODULE_REVIEW_PLAN.md#module-6-customers).

**Owner answers 11 Nov, rows 27 and 6 (12 Nov 2026):** a customer needs address line 1 and the state (new customers; existing ones when the address is saved again; old text-only clients pass when the text names a state). Tests: `hr/q12_gst_terms.sh` (R01–R06), `pw/q12_ui` (CA01–CA04) at 1440/390, `hr/z_customers.sh` 25/25, `hr/c_addresses.sh` 51/51.

**Plan step 4 (C), 11 Nov 2026 (migration 0137):** address in parts; extra-addresses table dropped (Q8). Tests: `hr/c_addresses.sh` 51/51, `hr/z_customers.sh` 25/25, `pw/c_addresses_ui` (CU01–CU13) at 1440/768/390 px.

**Plan step 9 (D2 part 1), 11 Nov 2026 (migration 0142):** Sale orders tab on the customer page. Tests: `hr/d2_sale_orders.sh` S27, `pw/d2_so_ui` C01.

**Plan step 8 (E1), 11 Nov 2026 (migration 0140):** one "Sales bills" list on the customer page with the type of each bill, B2B / B2C figures, "Create sale bill". Tests: `hr/e1_sale_document.sh` (E30–E31), `pw/e1_sale_doc_ui` (C01–C02), `pw/customers_ui`, `hr/z_customers.sh` 25/25.

**Plan step 5 (B2–B3), 11 Nov 2026 (migration 0138):** payment terms on the customer, due dates of new invoices from them, Dues block, list figures and filter. Tests: `hr/b_terms.sh` (B80–B103), `pw/b_terms_ui` (CL01–CL03, CD01–CD02, CA01–CA02) at 1440/768/390 px, `pw/customers_ui` 71/71, `hr/z_customers.sh` 25/25.

**Owner decisions 13 Nov, 6.3 and 6.4 (migration 0159):** account statement PDF and Share on WhatsApp with a 7-day secure link. Tests: `hr/m6_statement_share.sh` 36/36, `pw/m6_ui` 30/30 at 1440/390, `hr/z_customers.sh` 25/25, `hr/bl_billing.sh` 81/81, `hr/qt_quotations.sh` 40/40.

**Later (agreed / noted):** site-visit fees on the customer page come with Module 8.

## 7. Enquiries

**What it does:** leads from first call to won (a project) or lost.

### Features

**Enquiries list (`/enquiries`)**
- **Four main statuses (7.2, 13 Nov):** New (new only), In progress (follow-up, meetings, notes, quotation draft / sent), Converted, Lost (lost + cancelled); the status column shows the main status with the detailed stage (or the lost reason) as a small second line; API rows carry `main_status`, the list takes `?main_status=`
- Figures for the whole company by main status, plus follow-ups overdue; **Lost by reason** counts (click one to filter)
- Search name, phone or ENQ number (debounced; rows stay while typing); filters: status (Open / New / In progress / Converted / Lost / **Archived**), priority, documents, source, **lost reason**, **Overdue follow-ups** (button with the count), system size
- Shared links (`?view=`, `?create=1`)
- Export CSV: every row matching the current filters; Excel-safe (typed formulas neutralised, Hindi and ₹ kept)
- Add enquiry: customer (server search of all active customers by name, phone or GSTIN — no 100-customer limit — or + new; a used phone or GSTIN selects the existing customer), **repeat-lead warning (7.3):** a customer whose phone (last 10 digits) has an open enquiry shows "Open enquiry ENQ-… with <owner> (<status>)" with Open / Add follow-up, converted and lost ones as history, and a new enquiry can still be made; source type and source, source note, referred by, expected referral commission, requirements, budget and capacity (more than 0), phase, address, priority, follow-up date, assignee (active employee of this company)

**Status flow (enforced on the server)**
- Working stages: New, Follow-up, Meeting, Note, Quotation draft / sent
- **Converted** only by creating a project from the enquiry (once, for its own customer)
- Or **Lost** (a reason from Masters → Lost Reasons is required, plus an optional note — 7.4, migration 0160; enquiries lost before keep their text as the note) / Cancelled
- A lost enquiry can be **reopened** by anyone who edits enquiries, with a reason recorded in its history; it goes back to Follow-up and its old quotations stay cancelled
- Archived or converted enquiries keep their status
- No new quotation for a lost, cancelled, archived or converted enquiry, or for an inactive customer

**View enquiry drawer**
- Customer, requirements, status history (IST date and time), quotation history; edit (fields can be cleared; customer details changed only if edited and allowed; editing doesn't overwrite the customer's address — the installation address stays on the enquiry)
- Assign / reassign to an active employee of this company only, with history; the new assignee gets an "Enquiry assigned to you" notification (not when you assign yourself)
- Book a site visit in one save (visit + task for the person + optional fee; see Module 8), edit or cancel it from the Site visit box; schedule or reschedule a follow-up
- Follow-up note; edit follow-up date
- Mark lost (Lost Reasons list + note; the page shows "Reason: …" and "Note: …"); reopen (back to Follow-up, with a reason); archive / unarchive
- Create quotation, view quotation, mark sent
- Share: copy link, email, WhatsApp, PDF
- **Site-visit change request** (finalised name, capacity, budget): approve (renames the customer and its books account and updates the enquiry, all together) or reject, once, by anyone who edits enquiries
- Buttons follow the user's rights: view-only users see the details and no action buttons

**Follow-up person and documents (E2, E3, 13 Nov; migration 0152)**
- Each follow-up has its own person, by default the lead owner (the schedule form's person is used). The enquiry page lists the open follow-ups with their person, changeable there; the Follow up box shows "Follow-up person". That person gets "Follow-up given to you", the follow-up in My day and on the calendar, and the day's follow-up task moves to them on a change
- **Documents received:** Pending / Partially / Yes + date + note on the enquiry page; the list filters by it. The project's detailed document checklist stays as it is

**Different sizes (E4, 13 Nov; migration 0153)**
- One size by default (kW = panels, structure and inverter). The **Different sizes** tick on the enquiry form shows structure kW and inverter kW (e.g. 3 / 5 / 6); the capacity then reads "Panel kW (system size)" — the size used for subsidy, DISCOM and bank papers
- The enquiry page shows "3 kW panels · 5 kW structure · 6 kW inverter"; the sizes carry to its quotation and project

**Requested visit on a new enquiry (7.7, owner request 13 Nov; migration 0167)**
- Add enquiry (from Enquiries, a customer, an agent, a partner or a quotation) asks for **Visit date (requested)** (optional, today or later) and **Visit note** ("morning", "after 5 pm", "call before coming"; up to 200 characters) instead of a follow-up date. Edit enquiry keeps the follow-up date; follow-ups are still added on the enquiry
- The request is not a booked visit: the list and the enquiry show "Visit requested 15 Nov · after 5 pm · not assigned"; **Visits to assign** filter on the list, with its count
- Managers (see below) get one bell alert "New visit to assign: <customer>, 15 Nov (after 5 pm)" (opens Site visits → To assign) and an **Assign visit** button on the enquiry: the normal booking form, prefilled with the date and the note (in the notes and as a hint under Time). Booking marks the request assigned. Others see the request, no button
- **Managers only (owner, 13 Nov; migration 0168):** the bell alert, Site visits → To assign and the Assign visit button need the "Assign requested visits" right (Sales Manager, Director, Super Admin). Sales executives get none of them (403) but still book visits from their enquiries as before; such a booking leaves the request covered, not assigned
- One open visit per enquiry stays: a request on an enquiry that already has an open visit shows as covered (no alert); lost, converted or archived enquiries drop out

**Late follow-ups (7.6, 13 Nov; migration 0160)**
- A follow-up more than N days late (Settings → Approval limits → "Late follow-up alert (sales)", default 2, 1–30) raises one bell alert "Follow-up N days late: ENQ-…" for the lead owner's team leader, else the company's Sales Managers, else the Directors (there is no reports-to link on people). Once per enquiry and follow-up date (a new missed date alerts again); the alert goes away when the date changes or the enquiry closes. Worker job `followup-escalation` (hourly)

**Duplicate master values (7.1, 13 Nov; migration 0160)**
- Values of one list whose names differ only by capitals or spaces were merged (best casing kept, records moved, logged); MSS "Meta ads" → "Meta Ads", doubled DISCOM areas merged; BRD calling and AI chatbots kept. New duplicates are refused in every master list (see Module 2)

**Automatic:** pending site-visit approvals raise a notification (with the customer's name); an assignment by someone else raises "Enquiry assigned to you" for the assignee; a project created from an enquiry (directly, in the wizard or from its approved quotation) marks it converted in the same save.

### APIs
- `/enquiries` (list with status sets and counts, create, edit, status, assign, activities, change request approve / reject, loss reason, archive / unarchive)
- `/projects/from-enquiry`, `/quotations/from-enquiry/{id}`
- E2: `POST /enquiries/{id}/activities` takes `assigned_to_user_id` or `assigned_to_employee_id`; `PATCH /enquiries/{id}/activities/{activity_id}` {assigned_to_user_id}; enquiries return `followup_user_id`, `followup_user_name`; activities `assigned_to_user_id`, `assigned_to_name`
- E3: `PATCH /enquiries/{id}/documents` {docs_status pending|partial|yes, docs_received_on, docs_note}; list filter `docs_status`
- E4: create / edit take and return `different_sizes`, `structure_kw`, `inverter_kw` (omitted keeps; false clears)
- 7.7: create (also `POST /customers/{id}/enquiries`) takes `visit_requested_on` (YYYY-MM-DD, today or later) and `visit_request_note`; enquiries return those plus `visit_request_status` (to_assign | covered | assigned | closed) and `visit_request_site_visit_id`; list filter `visit_request` (anyone with enquiry view), `counts.visits_to_assign`
- **Backend only:** close an activity; `PATCH loss-reason`; convert to project from the enquiry endpoint; assignment history list

### Review status
**Status:** reviewed and done (8 Nov 2026, migration 0115). Tests: `hr/f_enquiries.sh` 26/26 (in `regress.sh`), `pw/enquiries_ui` 42/42 at 1440/768/390 px plus a view-only Director, full regression. Plan and findings: [MODULE_REVIEW_PLAN.md](./MODULE_REVIEW_PLAN.md#module-7-enquiries).

**Later (noted):** the Director designation can only view enquiries (access-matrix review at the end). Site-visit booking and calendar permissions were fixed in Module 8.

## 8. Site visits, fees, calendar

**What it does:** site surveys from booking to outcome, the optional visit fee and its money, and everyone's schedule.

### Features

**Booking (enquiry drawer → Schedule visit → Site visit)**
- Date (today or later), time, who does it (active staff only), notes, optional "Charge a visit fee" with amount
- One save creates the visit (SV-…), its task on the person's calendar, the fee (SVF-…) and the enquiry's "visit assigned" mark; one open visit per enquiry, enforced by the server
- Site visit box on the enquiry: number, status, date and time, who, fee, notes; Edit (date, time, person — moves the visit and its task) and Cancel visit (reason; an unpaid fee is cancelled with it)
- Blocked for lost, converted or archived enquiries, inactive customers, and while the last visit's outcome waits for approval
- **Companions (optional, 8.2, 0164):** other active staff with a login can go along — added as chips at booking or on Edit site visit (removing one takes it off their calendar). The required person stays responsible (the task, Travelled / Complete); companions get no task. The box says "With A, B"; repeats and the required person are dropped; a companion made the required person stops being a companion; at most 10; someone who left or another company's employee is refused

**Site visits page (`/site-visits`, menu under Calendar)**
- My visits (the signed-in person's) for anyone who can view visits; Everyone for those who edit visits
- **To assign** (7.7, 13 Nov; `?tab=to_assign`): visits asked for on new enquiries and not booked yet, earliest date first, with the note, address and lead owner (`GET /site-visit-requests` [site_visit.assign]); managers only (13 Nov, 0168): tab, Assign and alert need "Assign requested visits"; **Assign visit** (managers) opens the enquiry's booking form prefilled; booking moves it to To do and marks the request assigned
- To do / Done / Cancelled; cards on phones, table on wider screens; long addresses wrap
- Travelled to site (task goes in progress)
- Couldn't do the visit: reason, optional follow-up date (goes on the enquiry), notes
- Site visit complete: site photos (uploaded), what you found, Capture location (GPS); deal done → documents received (uploaded), changed capacity / amount, final customer name → change request waits for approval on the enquiry; deal not done → ask for another visit (date, note) or mark the enquiry lost
- The person doing a visit can always act on it; others need site visit edit
- My visits also lists visits you go on as a companion: "Lead with A, B", a Companion tag, no Update menu (unless you have site visit edit); My day shows today's companion visits marked "companion"
- The same list and actions on the employee profile → Site visits → Scheduled site visits

**Recorded visits (project → Site visit drawer)**
- Visited by, date (not in the future), address, GPS, materials, blockers, photos, cost; editing replaces materials and photos and can clear blockers / cost
- Merge materials into the project's site checklist (once per visit, with units)

**Visit fees (customer → Visit fees tab)**
- Receipts: amount (up to what's due), date (not in the future, India date), collected by company / agent / partner, kept by company (cash/bank, payment mode) or the collector (their ledger); two receipts at once can't overpay
- Void a wrong receipt (reason; kept, struck through; the fee goes back to pending if it's no longer paid)
- Refund (amount up to what's held, mode, date, reason); fully refunded → Refunded
- Waive the balance (reason; money received stays income); Cancel only with no money held
- Move to project (once, up to what's held, same customer) — or at conversion, "Adjust the ₹X visit fee against this project" in the project wizard
- Fee amount can't go below what was received; rupees only

**Calendar (`/calendar`)**
- Mini month; day or range; category filters (site visits, installations, follow-ups, milestones, tasks, invoice due, EMI, vendor bills); project filter
- Counters: total, completed, overdue (India date); event list with Complete / Cancel for tasks and your own events
- A booked visit shows once ("Site visit — customer", number, time, address); clicking opens the enquiry or project
- Companions (8.2): on a person's own view (filtered to them, or someone without site-visit view, who sees only their own visits) the visit shows once as a read-only "site_visit_companion" row ("With <lead>"); the shared calendar still shows it once
- An enquiry follow-up shows once: while the enquiry has an open follow-up task (not an automation or visit task), only the task shows, on whatever day it is (8.0, 13 Nov; before, a moved task or follow-up showed twice); when the task is done, the enquiry's follow-up date shows again
- Add event: task (needs task create) or milestone (needs project edit); a visit's task is changed only on the visit

**Timeline (`/timeline`)**
- Timeline or calendar view; feed filter (all, project history, payments, site visits); daily / weekly; project filter; stats
- One `GET /timeline/feed` call per page (Module 10 review); a fresh load makes 6–9 API requests in all (8.0, 13 Nov: one `/auth/me` and one company-list refresh, was 11; ~83 before the feed)

**Automatic:** visit-fee receipts, refunds and adjustments post to the books (Site visit fees ledger: Dr cash/bank or the collector's ledger, Cr fees; refunds reverse; adjustments move the income to the customer, tagged to the project); voided receipts' entries are cancelled; the employee schedule reads the calendar for its date range.

### APIs
- `/enquiries/{id}/site-visits` (book; optional `companion_employee_ids`; marks a waiting request assigned only for a booker with site_visit.assign); `POST /enquiries/{id}/visit-request/assign` [site_visit.assign] (same body; books the waiting requested visit, 409 if none); `GET /site-visit-requests` [site_visit.assign]; `/site-visit-events` (list with `mine` — incl. visits as a companion —, `status`, dates; create a recorded visit), `/{id}` (get, edit; visits return `companions` [{employee_id, name}]), `/{id}/schedule` (also `companion_employee_ids`: a list replaces, `[]` removes, left out keeps), `/{id}/travelled|complete|not-complete|cancel`, items, photos, merge to checklist, link fee, delete / restore
- `/site-visit-fees` (list with dates, summary, create, edit), `/{id}/receipts` (+ `/{rid}/void`), `/waive`, `/cancel`, `/refund`, `/adjust`; `/customers/{id}/site-visit-fees`; `POST /projects/from-enquiry` takes `adjust_visit_fees`
- `/calendar/events` (range via `range_from`/`range_to` or `date_from`/`date_to`; create, edit, complete, cancel, reopen, status), `/calendar/counters`
- **Backend only:** visit items / photos / link-fee / delete / restore endpoints, fee create / edit (fees are made at booking)

### Review status
**Plan step 4 (C), 0137:** a visit keeps its address text (from the enquiry, D10); the API also returns `site_address_parts` read from it. Test: `hr/c_addresses.sh` C95, `hr/sv_sitevisits.sh` 54/54.
**Status:** reviewed 8 Nov 2026 (migration 0116) — see MODULE_REVIEW_PLAN.md Module 8. Tests: `hr/sv_sitevisits.sh` 54/54, `pw/sitevisits_ui` 33/33, `pw/visit_fees_ui` 47/47.

**Round 2 (owner decisions 13 Nov), built 13 Nov (backend 48e708e, frontend 1ab5061, migration 0164):** 8.0 Timeline under 10 requests and a follow-up once in the calendar; 8.2 optional visit companions. Tests: `hr/m8_visits_r2.sh` 34/34, `pw/m8_ui.mjs` 36/36 (1440 and 390); reruns `hr/sv_sitevisits.sh` 54/54, `pw/sitevisits_ui` 33/33, `pw/visit_fees_ui` 47/47.

**Open / later:** visit cost / money staff spend isn't posted as an expense (8.1, parked for the CA); who may book / complete / see all visits goes to the access-matrix review at the end.

## 9. Quotations

**What it does:** priced proposals with versions — draft, send (locked, valid 15 days), negotiate or revise, approve at the agreed amount, then the project.

### Features

**Quotations list (`/quotations`)**
- Search reference, customer, phone; filters: status (Draft, Sent, Negotiating, Expired, Approved, Converted, Lost, Cancelled), system size; figures for the whole company (Total, Draft, Sent, Negotiating, Approved, Converted, Lost, Cancelled); column chooser; pagination; archived ones hidden
- Row ⋮ by status: view, edit (draft) / open, preview / print; draft → mark sent (how), mark lost, cancel; sent / negotiating → customer approved (agreed amount), negotiating, revise, mark lost (reason), cancel; expired → revise, lost, cancel; approved → create project, lost, cancel

**New / edit quotation (`/quotations/new`, `?edit=`)**
- From an enquiry (prefilled, one open quotation per enquiry) or direct (customer + reason); apply a template
- Client from the customer record: name, phone, email, type read-only (always the customer's latest); **Edit customer** opens the customer form in a side panel on the quotation (13 Nov, owner) — saved changes show at once and the site address follows when it was still the customer's
- **Project site address (13 Nov, owner; migration 0165):** the same parts as the customer address (line 1, line 2, city, state, PIN), pre-filled from the customer when the quotation is made (existing quotations: from the customer, keeping a city / state / PIN typed on them), editable when the project is elsewhere; "Use customer address" resets it; printed on the quotation instead of the customer's address; city / state / PIN columns follow it. GSTIN and PAN start as the customer's (both optional, editable on the quotation)
- **Quotation document as in MSS-docs (13 Nov, owner; migration 0166):** the preview / PDF is the MSS-docs quotation — letterhead from Settings (logo, legal name, address, GSTIN, website), cover image and tagline, client box (name, phone, email, capacity and phase, sanction load, site address, date), Stock Items table, installation work, assumptions, customer scope, commercial offer, warranty, generation and savings, installation process, documents, terms, bank, represented by, notes and a signature block ("For <legal name>" with the stamp and signature from print settings). **Language** English or Hindi (switching rewrites the text sections and stock lines). **Standard packages** by kW (the MSS-docs material description table) set kW, panels, wattage, inverter, phase, price (GST-inclusive) and the stock lines. **Pickers:** phase, panel brand, structure brand, AC cable, earthing wire rewrite the stock lines; "Use the standard table" rebuilds it. **Commercial details:** sanction load, shadow-free area, connection type, roof type, DISCOM note, on-grid note. **Generation & savings** worked out from kW and the unit rate (no manual table). EMI, maintenance and warranty years. Settings are saved with the version (no new table); stock-line quantity text ("50 तक", "10 पैनल") is kept (`qty_label`). **Central subsidy pre-filled ₹78,000** (state ₹17,000), "Use slab" to switch
- **Terms & conditions from MSS-docs (13 Nov, owner):** all 27 MSS-docs quotation terms (validity, transit insurance, payment terms and phases, timeline, net metering, roof and site, additional work, measurement and post-installation changes, post-agreement material changes, site survey, material safety, cleaning, generation by season, warranty and limits, non-Polycab inverter support, subsidy, jurisdiction, warranty, photography, cancellation, file reversal and vendorship removal, force majeure, ownership, roof leakage, payment delay, final payment and price finality, delayed payment and legal recovery) in the quotation's language; a draft still holding the old untouched default set gets them on opening; edited terms and sent quotations are kept; "Use MSS-docs terms" resets a draft's terms
- Reference: an internal note, filled with the enquiry number when made from an enquiry; not printed
- System (capacity, panel and inverter brand / count / wattage, structure, floor height); estimate from capacity
- Material lines (typed, or from a quotation template; quantity > 0) — stock rates never reach quotations, so there is no "From Inventory" tab (plan D6 / Q1); pricing; subsidy: None / Central / Central + State — central by the PM Surya Ghar slab (₹30,000/kW up to 2 kW, ₹18,000 for the 3rd kW, max ₹78,000), state ₹17,000 by default, both editable, never more than the price; generation and savings
- Process, scope, assumptions, terms, warranty, subsidy notes; cover image and tagline; bank details and representative (default bank: AU Small Finance Bank, MSS current account, Vaishali Nagar Jaipur branch from IFSC AUBL0002206 — 12 Nov); sections shown in preview / PDF
- Save is one transaction (header, price, lines, preview options)
- Only a draft is editable; a sent quotation shows "Sent vN · locked · valid until …" with **Revise (new version)**; approved / converted / lost / cancelled / archived are read-only with their outcome

**Quotation drawer:** overview, valid until / expired, approved amount, lost reason, materials; actions as in the list; Create project (approved); View project (converted).

**Preview / share:** preview, print, download PDF (subsidy lines follow the scheme; "Valid until" in the summary and terms); share on WhatsApp (opens WhatsApp with the message) or email (opens the mail app) — either records the send; or mark sent (in person, etc.). **Secure PDF link (6.4, 13 Nov):** opening Share stores the preview PDF and puts a 7-day link in the message ("View the quotation PDF: …", replacing "find the PDF attached") with Copy link; the link opens without signing in (see Module 6).

**Status flow:** draft → sent (version locked, valid 15 days, India date) → negotiating → approved (final client-agreed amount, incl. GST before subsidy) → converted when the project is created (once). Revise a sent / negotiating / expired quotation → new draft version (the sent one stays). Lost needs a reason; cancel anything not converted. Expired ones can't be approved.

**Templates:** per-company template library (rows, services), applied in the form. **Residential templates from MSS-docs (13 Nov, owner; 0169):** 3 kW 1PH, 5 kW 1PH, 5 kW 3PH, 6 / 8 / 10 kW 3PH with MSS-docs' prices and material table (12 lines sized to the package); applying one sets kW, phase, panels × watt, inverter, price incl. GST, ₹78,000 central + ₹17,000 state subsidy and the material table. The table is in English; a Hindi quotation keeps the brand / phase pickers and "Standard table" to rebuild it in Hindi. The template picker lists them in kW order.

**Different sizes (E4, 13 Nov; migration 0153):** the System Configuration has the **Different sizes** tick (structure kW, inverter kW; the capacity is the panel kW). A quotation made from an enquiry starts with its sizes, a revision keeps them, and the print / PDF line reads "3 kW panels · 5 kW structure · 6 kW inverter". The subsidy still follows the panel kW.

**Automatic:** activity log (sent, revised, approved with amounts, lost); "awaiting response" alert after 3 days with the customer and valid-until date; the enquiry follows its quotation (draft / sent).

### APIs
- `/quotations` (list with status groups, expired, archived filters + counts; create; from-enquiry; get; edit header (draft); archive; status actions send / approve {client_agreed_amount} / negotiate / mark-lost {reason} (reject = lost) / cancel (withdraw = cancel) / revise; clone; versions (first version, revise via clone), `PUT …/versions/{v}/draft` (whole draft), version edit, preview options, loan details (gap worked out by the server), loan-gap approval, material items, activities, preview)
- `/quotation-templates` (+ material / service rows, apply)
- E4: versions (create, edit, `PUT …/draft`) take and return `different_sizes`, `structure_kw`, `inverter_kw`; the preview's `system_details` has them and `size_line`
- `POST /projects/from-quotation/{id}` (contract = agreed amount; once)
- **6.4 (0159):** `POST /quotations/{id}/share` [quotation.view] multipart `pdf` (the browser-made PDF, at most 15 MB, must be a PDF) + `amount` → a 7-day link (`token`, `path`, `expires_at`, `document_no`, `phone`, `amount`)
- **Backend only:** clone, version delete, price breakdown, bulk items, loan details / gap approval, preview, activities, server-side template apply

### Review status
**Owner decision 13 Nov, 6.4 (migration 0159):** Share on WhatsApp with a secure 7-day PDF link. Tests: `hr/m6_statement_share.sh` M6-32–M6-35, `hr/qt_quotations.sh` 40/40.
**Status:** reviewed 8 Nov 2026 (migration 0117) — see MODULE_REVIEW_PLAN.md Module 9. Tests: `hr/qt_quotations.sh` 40/40, `pw/quotations_ui` 26/26, `pw/qf_form` 47/47.
**Plan step 2 (Q1), 11 Nov 2026:** the Add material item drawer is typed entry only (the "From Inventory" tab and its stock-rate mapping are gone). Tests: `pw/a1a3_ui` (QT01–02), `pw/quotations_ui`, `pw/qf_form`.

**Open / later:** project funding type isn't carried from the quotation's payment type (Projects, 10); save-as-template removed; who approves loan-gap losses goes to the access-matrix review at the end.

## 10. Projects (core and execution)

**What it does:** the project from booking to handover, the biggest module.

### Features

**Projects list (`/projects`)**
- Search project or client; status, type and partner filters (sent to the server); "Show archived"; grid or list; partner name on partner-billed rows; stats for the whole filtered list (count, capacity, contract, received, remaining); pagination
- **Four project types** (0120): **Own projects (EPC)** (our customer; contract from the quotation / amount), **Partner projects** (a partner brings it at our rate), **Vendor code only projects** (we charge for our vendorship code), **I&C only projects** (we charge for installation). On the last three the partner is billed and owes us; giving the installation to another team is the Outsource tab on any type
- New Project wizard: type first. Own: source (new / enquiry / approved quotation — contract = the client-agreed amount, funding type from the quotation's payment type), vendorship code (ours / another company's), customer and system (site address in parts, filled from the customer's address and editable; from an enquiry or quotation the one-line text goes in line 1 to check; DISCOM, area, K-number, roof, BOM), contract with GST, referral, visit fee adjustment. Partner / Vendor code / I&C: partner (search, inline Add partner with GSTIN), end customer and site, rate & charge (partner's rate, else the default, editable; per watt or per project; GST %; live contract preview), partner projects choose whose vendorship code, I&C work scopes; review with server validation
- **Project rates (`/project-rates`)**: default rates per type and per-partner rates (per watt or per project, from a date, history kept); add; delete a rate that hasn't started; the project keeps the rate it was booked at

**Project details (`/projects/:projectId`)**
- Header (one layout for all types): type, customer, and on partner-billed types the partner and rate; Contract / Our charge, received (own: receipts, invoice receipts, visit fees moved in, bank loan tranches; others: receipts − money paid on to the partner), outstanding (or overpaid), to pay on to partner; archived / override badges
- Status bar: next status buttons; Complete is refused while money is owed and Cancel while money was received — a Director (or Super Admin) can go ahead with a reason, kept on the project; every change goes into the history (server); automatic steps on the server: checklist materials → material finalized, completed site visit + team → ready for install, installation scheduled or subcontractor assigned → in progress, site progress → in progress / installation complete
- Quick actions: Task, Site Visit, Outsource, Edit project, Archive (completed / cancelled only) / Unarchive
- Edit drawer: name, site address in parts (line 1 required), K-number, notes, partner economics; contract and capacity read-only with **Request change**
- Locked when completed or cancelled: no new movements, progress, evidence, checklist lines, work logs, teams, schedules, blockages or measurements (still readable)

**Tabs**
- Project Report: site status; progress sections and items (undoing a done item needs a reason); evidence photos (before / during / after / GPS / serial) — items can require a serial and / or GPS photo, GPS photos carry the phone's location and time; blockages (add, notes, resolve once); loan tranches
- Document Creator: meter test application, panel & inverter serial report, vendor agreement, feasibility, work completion report (WCR); values escaped, India dates; edits create a new version (old kept); PDF / HTML, audit
- Uploads: required customer and site documents; manual vendorship upload
- Stock sent: site checklist (templates append without duplicates; custom and site-visit lines kept; a line with stock on site can't be deleted); reservations (never beyond stock; released can't be edited); dispatch / return (available = stock − reserved − damaged; can't return more than on site; parallel-safe; deletes that would break stock refused); site damage (approved by someone else, at cost); sale bill from the stock sent
- **Stock sent value and sale bill (plan A1):** each item on site is valued, and the sale bill line priced, at the item's sale rate **per issue unit** from the server (the movements are in the issue unit; the sale rate is stored per purchase unit). No sale rate → the purchase rate per issue unit, marked "at purchase rate" on the row and the bill line. Bill lines take unit, HSN and GST from the item. The purchase cost of a "bought for the project" movement (a total) is never used as a rate
- Financials: milestones (percent stored as an amount, total ≤ contract, paid status from receipts); receipts (no edit; delete with a reason; refused on cancelled / archived projects and future dates; on partner-billed types "from the partner" or "for the partner — customer's / bank's money"); bank loan tranches (own projects); **Who bills the client** (section P, 0147: vendor code used ours / another firm on Own and Partner projects; MSS bills the client, the vendor code firm or the partner; on our code the client amount, what MSS owes the partner — margin or full amount — the partner's bills to MSS as purchase bills from its vendor record capped at what is owed, our charge bill to the partner on vendor code projects and the net; payouts to partners read-only); invoices; profit on partner-billed projects counts only our charge plus bills to the partner, on client-billed ones the client amount less what MSS owes the partner; change requests on every type (contract value / capacity / additional work, reason, pending → approve / reject; never below received or invoiced; a per-watt project's capacity change keeps the booked rate)
- Project Cost: from the books (material at cost, tagged expenses and income, accrual and realised profit); cost approvals are budgets only
- Field Operations: site visit → team → schedule → done; work categories / scopes; work logs (no future dates or negative units); tool movements; scheduled installations; blockages
- Team Roster: assign / remove team (valid dates); site measurements; assign tasks ("Generate tasks" uses each template's due offset); India date defaults
- Outsource Execution: subcontractor work orders for the project in one call with paid and balance (open project only, no negative amounts); payments; ledger
- History: timeline with notes

**Sizes, loan, cash and subsidy (owner decisions 13 Nov, E4 / P1–P7; migration 0153)** — a card under the project header, edited in one form:
- Sizes: one size, or panel / structure / inverter kW (from the quotation or enquiry; editable). The panel kW stays the project capacity
- Loan (shown when funding is a loan): bank from the Banks list + branch; **bank quotation** (the approved quotation's bank-approved, else loan filing amount, until typed over) and **loan sanctioned**, next to the deal with the client
- Money: **From bank** expected (loan sanctioned) / received / due and **From client cash** expected (deal − loan, never below 0, or typed by hand) / received / due. Each receipt is bank or cash ("Bank (loan)" in Received from is bank; loan tranches are bank); bank + cash = the received total
- **File: Clear / Some issue** badge in the header: some issue while a "File Issue" blockage is open. Add Blockage → File Issue asks what it is (name mismatch, wrong K-number, missing document, other)
- **Subsidy:** Not applied → Applied (waiting) → Disbursed (date, central, state) or Rejected (reason). The client's money: nothing goes to the books
- **Inverter login:** app / portal, login ID, password — plain text, seen by anyone who can view the project (owner's choice)
- Projects list filters: Loan bank, Cash due / Bank due, Subsidy (waiting / disbursed / rejected), File (Some issue / Clear)
- **Open file issues (gap closed 13 Nov):** Projects → File: Some issue (or `/projects?file=issue`) lists every open File Issue across projects, oldest first — project (link), customer, reason, who is fixing it, days open (`GET /projects/file-issues`, `?file_status=some_issue|clear` on `/projects`)
- **Wizard sizes (gap closed 13 Nov):** the Create Project wizard has the "Different sizes" tick beside the capacity (Commercials for own projects, Rate for the others), prefilled from the quotation's version or the enquiry; the capacity is the panel kW; sizes sent with the create win over the copied ones

**Timeline page (`/timeline`)**: one feed of project history, site visits and receipts across projects (each receipt once, India times), filtered by date / project / kind on the server, with KPIs and Load more; fits phone width.

**Automatic (books):** project receipts and loan tranches (Dr bank, Cr customer); material dispatched / returned at cost (Dr Stock used on projects tagged to the project, Cr Purchases); approved site damage (Dr Stock damaged at site, Cr Stock used on projects); employee referral commission once the project has started and money is received (Dr Commission, Cr the employee); an agent's commission becomes "calculated" on the same trigger. Notifications: blockage alerts (open projects only), overdue milestones (India date).

### APIs
- `/projects` (about 120: header (`site_address_parts`; `project_address` and `site_address` are its one-line text), economics, progress, work, material, tools, procurement, payments, loan tranches, cost, blockages, change requests with approve / reject, documents, timeline, team, site checklist, measurements, work orders, unarchive)
- `/timeline/feed`
- Chunk B (0153): `GET` / `PATCH /projects/{id}/site-info` (also `site_info` on `GET /projects/{id}`); list `loan_bank_id`, `money_due=cash|bank`, `subsidy=waiting|disbursed|rejected`; receipts take / return `source` bank | cash (`/projects/{id}/payment-receipts`, `/payment-receipts`); blockages take / return `sub_reason`
- **Backend only:** cost approvals; procurement need-line edit / link / delete; document audit / delete; vendorship economics edit

### Review status
**Status:** reviewed 8 Nov 2026 (Module 10, migrations 0118–0119). See MODULE_REVIEW_PLAN.md.
**Plan step 4 (C), 11 Nov 2026 (migration 0137):** site address in parts; document placeholders from the parts; `{{vendor.*}}` is the code company on projects using its code. Tests: `hr/c_addresses.sh` (C70–C73, C93–C94), `pw/c_addresses_ui` (PR01–PR04), `pw/pt_create_ui`, `hr/pe_projects_exec.sh` 68/68, `hr/pm_projects_money.sh` 41/41, `hr/pt_project_types.sh` 37/38 (PT03 known).

**Open:**
- Project types built 8 Nov 2026 (0120; MODULE_REVIEW_PLAN.md "Project types"). GST on partner / vendor code / I&C charges is still to be decided (GST % per project, default 0).
- Stock is periodic (dispatch credits Purchases) — a stock-in-hand ledger and valuation need the CA (Accounts).
- Team project overview and work logs vs attendance — with the Teams discussion.

## 11. Warehouse and procurement

**What it does:** stock of materials and tools, ordering from vendors (purchase orders), buying from vendors, approval of vendor bills, damage and scrap.

### Features

**Stock (`/stock`; old `/materials` links open it with their query)**
- Tabs: Stock; Damage & scrap
- Search (every word, any order, in the name, size / spec or category, or the start of the HSN or the item code; "4sqmm" finds "4 sq mm"; an exact item code first); category and active filters; stats (items, stock value, low / out); low-stock banner over every item; quantities with units and Indian grouping
- Need-to-Get: pick an open project, compute shortfalls (checklist − sent − reserved − free stock; no duplicates on recompute), quantities with units, ₹ per unit, paging
- **Item code (owner Q4, 0145):** an optional short code per stock item or tool ("DCC-4", "PNL-545") on Add, Edit and the quick dialog from a bill line; letters, digits, - and /, at most 20, stored in capitals, unique in the company (a taken code is refused naming the other item); shown as a tag before the name in the list and in Stock details → Overview; found as a prefix by the list and line searches, an exact code first
- Add new stock item: name, category, HSN, purchase and issue unit (from the units master) with conversion, minimum stock, purchase / sale rate, opening stock; validation (no negative / blank numbers); duplicate name refused; edit; deactivate
- **Conversion factor whenever the units differ** (with or without opening stock): length per piece, weight per piece / metre / foot, manual factor (e.g. Coil → Meter "Meter per coil"); foot ↔ metre uses the fixed 0.3048; the same unit both sides is saved as "same unit". Checked in the form and on the server
- **Edit → conversion:** the factor can be corrected. Free while the item has no stock or movements; after that only with the stock **approve** right and a reason; stock, reserved, issued, damaged, lost and on-site quantities are restated in the new factor (same purchase-unit quantity and value; the form shows "Stock 360 Meter will read 400 Meter"); recorded in the item's history and the stock conversion log. An item without a factor says so on its Edit form
- `/stock?edit=<item id>` opens that item's Edit form (used by the purchase bill's link)
- **Rates per purchase unit (plan A1, D1):** purchase rate **and** sale rate are entered and stored per purchase unit ("Purchase rate (INR / Coil)", "Sale rate (INR / Coil)"). The server derives the issue-unit rates (`sale_rate_per_issue_unit`, `cost_per_issue_unit`, …); screens never convert. The list shows "/Coil" after the rates when the units differ
- **Rate hints (A2):** on Add, Edit and Add stock, under each rate when the units differ: "= ₹40.00 per Meter"; under the sale rate also "Margin ₹400.00 (12.5 %) over averaged cost" (on Add: over the typed purchase rate). Live as the units, factor or rates change
- **Stock details (A3):** Overview (name, size / spec, category, type, status, rates / HSN last changed, added and last edited — when and by whom); Stock (warehouse, **free** (on hand − reserved), reserved, **reserved for sale orders** (plan D2), issued, on sites, **on order** (still to come on approved / sent purchase orders, plan D1), minimum alert — each in the issue unit with the purchase-unit equivalent, "450 m = 5 coils"); Units & conversion ("1 coil = 90 m", part-unit returns); Pricing (latest purchase rate, averaged cost, sale rate — per purchase and per issue unit; margin over averaged cost); Value (at averaged cost; at sale rate, or at purchase rate when there is no sale rate); Tax (HSN, GST); Activity (last purchase: bill, vendor, date, quantity, rate — or Add stock; last issue: project, date, quantity; stock history link); Notes
- **Extra units for bills (plan E2, Q14):** in Stock details → Units & conversion, each unit saved for the item ("1 Bundle = 10 Meter", "used on 3 lines" / "not used yet"); Add a unit (stock create right); Change / Remove (stock edit right) only while no bill, purchase or credit-note line uses it, afterwards only Deactivate / Reactivate; changes in the item's history. The last purchase says "billed as 45 Meter" when that bill line was in another unit (quantity and rate shown in the purchase unit)
- Stock history with sign, unit, IST time, paging
- Add stock with batch pricing (new average cost); issue to an open site (optional transport task; partner / vendor code / I&C projects say the material is billed to the partner); return from site (to warehouse or another site, part units; same "on site" rule as the server); a failed row doesn't repeat the saved ones
- **Damage & scrap tab:** report damage (warehouse / at site / in transit, reason, not more than is free); an approver reviews: write off (loss at average cost per issue unit, editable), keep aside (not usable), back to stock, vendor replaces it, no stock effect; kept-aside items can be reviewed again; scrap now (approver, one step) or scrap waiting for approval; history with outcome and loss

**Tools (`/tools`)**
- Stats; search; category and status filters
- Add / edit (name, category, condition, value, purchase date); issue to person or open site (the server records the tool on the project once); an issued tool must be returned first; re-issue; return with condition; retire with reason; audit log

**Templates (`/templates`)**
- Quotation and site checklist templates; segment filter; add (name, capacity, materials, services with SAC, GST %); edit; view; delete
- **Package (13 Nov, owner; 0169):** phase, panels, panel watt, inverter kW, price incl. GST, central and state subsidy, with "After subsidy" worked out; **Fill MSS-docs material table** fills MSS-docs' table for the kW (panels / watt / inverter worked out when blank; asks before replacing rows). Cards and the details panel show "3 kW · 1PH · 6 × 550 Wp · inverter 3.6 kW" and "₹1,90,000 · after subsidy ₹95,000"; quotation templates are listed by segment, then kW, then phase

**Vendors (`/finance/vendors`, Finance menu)**
- Figures: vendors, due, **Overdue** and **Due this week** (approved bills past their due date / due today or in the next 7 days), billed, with dues
- Cards: category · payment terms, billed (approved bills), paid, due, advance, waiting for approval, the dues line ("Overdue ₹7,800 · 1 bill", "Due this week …") and an Overdue badge; **category filter (B2B / B2C / General Purchase)** and **Dues filter** (Overdue / Due this week); search; every vendor reachable (paging); add / edit (category, GSTIN 15, PAN 10, duplicate phone / GSTIN refused, address in parts with a note when the GSTIN's state differs from the address state, payment terms), deactivate / reactivate, details (Check address chip for a split old address); vendor ledger
- **Category (plan B1, Q5):** B2B = GST-registered (GSTIN required), B2C = unregistered (no GSTIN), General Purchase = small / petty purchases (GSTIN optional). On Add it starts "From the GSTIN" (B2B with one, else General Purchase); a hint says what each means; the form and the server refuse B2B without a GSTIN and B2C with one; removing a B2B vendor's GSTIN needs another category in the same save
- **Payment terms (B2):** the shared section of the customer form (Full advance · On delivery / receipt · Net N days · Custom; credit days, due from the bill date or the month end, part advance %, note on bills; live preview); a change applies to new bills only

**Vendor details**
- Header: category, payment terms ("Payment terms: Net 30 days"); figures billed, paid, due, **overdue** (bills past the due date), advance, waiting for approval
- **Dues block:** open, overdue, due in 7 days, due later (amounts, bill counts), ageing (not due, 0–30, 31–60, 61–90, 90+ days past the due date, as on Audit → Creditors), each open approved bill with its due date (or "no due date — counted from the bill date"), an Overdue / Due chip and what is left of the total; a bill opens it
- **Category and payment-terms changes** (who, when, before → after)
- Tabs: To acquire, **Purchase orders** (the vendor's POs with the list's figures and filters, "New purchase order" for the vendor), Purchase Bills (with a **Due date** column and chip and an **Overdue / Due this week** filter), Payment History, Debit notes
- **Our own number on every purchase bill (13 Nov, owner decision 11.1; migration 0163):** PUR/2026-27/0001 from the Purchase bills series (Settings → Number series; up to 3 series, "Our number series" picker on Add purchase bill when there is more than one), per company and financial year of the bill date (a draft without a date: this year). Given when the bill is saved, drafts too; a cancelled or rejected bill keeps it and numbers are never reused; existing bills were numbered in bill-date order. Shown as **Our no.** (first column of the vendor's bill list, also on phone cards), **Our number** on the bill, in the PO's bill list and in the duplicate message; searchable in the list and the header search (the hit shows our number and "Vendor bill …"). The vendor's bill number stays the reference for GST matching and the duplicate check. Not yet: the reverse-charge self-invoice (11.1a, parked for the CA)
- **Purchase bill print / PDF (13 Nov, owner):** Print and PDF buttons on the bill detail, for anyone with the stores (inventory) view right — the same right as opening the bill. The PO print's style: letterhead (logo, company, GSTIN, state, PAN), "PURCHASE BILL", our number and the vendor's bill number, bill / entry / due dates and terms, the vendor's address in parts, GSTIN and category (B2B / B2C / General Purchase), lines (item, HSN, quantity with unit and "= N <issue unit>" when billed in another unit, rate, taxable, GST %, CGST + SGST or IGST by the vendor's state, amount), freight, other charges, discount, round-off, total and amount in words, goods received (Received / Partly received / Pending), approved by and when or "Waiting for approval", the PO number (or PO reference) and project, notes, and "For <company>" with the stamp / signature and "Authorised Signatory". Draft / sent-back bills carry a DRAFT mark, cancelled ones CANCELLED. APIs: `GET /inventory/purchase-bills/{id}/print` (HTML), `GET /inventory/purchase-bills/{id}/pdf` ({url}); both inventory.view
- **Add purchase bill:** vendor's bill number (unique per vendor), bill date and **due date from the vendor's terms** (filled, follows the bill date until a date is typed; the hint shows the terms and their date; a different date shows "Why a different due date?" — needed only when the date is **later** than the terms (owner row 31), optional for an earlier one; "Use the terms date"), open project, PO reference, lines (material / tool / other expense) with the item's purchase unit, rate, GST 0/5/12/18/28 % per line, discount, other charges, totals with paise; "Goods received now" (ticked by default; damaged pieces kept out of stock); save as draft; pay now only for approvers (approves the bill)
- **Line search (plan E4):** a line's Stock item / Tool field finds stock by name, size, HSN start ("8544"), item code start ("DCC-4", exact code first, the code shown in the row) or category, words in any order, a typo forgiven ("polycub" → Polycab, under "Did you mean"); each row shows the purchase unit, the conversion ("1 Coil = 90 Meter"), the latest rate per purchase unit, HSN and category; ↑ / ↓ / Enter (the first row is ready), Esc closes the list (not the bill); picking fills the unit, rate (a rate typed on the line stays) and GST and moves to the quantity
- **Add on the spot (E3):** "+ New stock item “typed”" (the list's last row) and a + by the field, with the stock create right: a small dialog — name, category (guessed from the name, else the closest item's category, else chosen), HSN (4 / 6 / 8 digits), bought in / issued in with the factor ("1 Coil = 100 Meter"), purchase and sale rate per purchase unit with "= ₹37 per Meter", GST; similar names already in stock shown with "Use this"; an exact name refused (a deactivated one: reactivate instead). The new item (a tool on a tool line) is put on the line and is in Stock at once
- **Bill in any unit (plan E2, D4):** a stock or tool line has a **Unit** dropdown — the purchase unit (default, "Coil (90 Meter)"), the issue unit ("Meter"), units saved for the item, and **Other unit…** (a dialog: pick a unit or type a new name, "1 Bundle = __ Meter" or entered in the purchase unit, a preview of the rate and the stock quantity, "Save this unit for {item}" ticked by default with the stock create right; a new name joins the units list). The Qty and Rate labels follow the unit; the rate follows it (a rate at the old unit's default takes the new unit's latest purchase rate, a typed rate is converted). Under the line: "= 180 Meter in stock terms (1 Coil = 90 Meter)". **A one-off unit used again (owner Q3):** from the second use of the same unit name (any case) and conversion for the item on any sale bill, purchase bill, PO or SO of the company, the line offers "You've used Pallet = 30 Pcs/Nos before. Save it for this item?" — Save (the line switches to the saved unit) or Don't ask again (remembered per item and unit); stock create right only. Goods received in any unit go into stock as qty × conversion in the issue unit (the averaged cost per purchase unit counts the purchase-unit equivalent); debit notes send back and cancel in the same issue units. A line with goods already in can't change unit
- **A line whose stock item has no conversion:** the bill is refused before anything is saved, naming the line and the item ("Line 2: DC cable has no conversion (meter per coil) — set it on the stock item"), with a **Set the conversion on DC cable** link that opens the item's Edit form in a new tab (same company); save the bill again after. Goods receipt, Add stock and debit notes give the same message
- **Bill details:** for a bill made from a purchase order, a **Purchase order** link to it (the free-text reference is then "Vendor's order ref"); the vendor's name, address (line 1, line 2, "City, State (code) - PIN") and GSTIN or "unregistered"; the due date with where it came from ("From the terms: Net 30 days" / "Set on the bill: <reason>"), the payment terms as on the bill and the due chip (Overdue 15 days / Due in 5 days / Due 20-12-2026); approval (Draft / Waiting for approval / Approved / Sent back / Cancelled), goods (Not / Part / Received) and payment chips; lines with received / damaged / pending; payments (reversed struck out with reason); receipts; history (who, when, why)
- **Actions:** send for approval, edit (draft / sent back / waiting: creator or approver), approve, send back (reason), cancel (reason; refused when paid or goods are in), receive goods (all or part), record payment, **change due date** (approved bills with money owed, approvers; always a reason; empty = back to the terms; in the history)
- **Payments:** mode required, IST date, amounts on chosen approved bills (not above what is due) or oldest first; extra = advance, applied to the next approved bill; reverse with a reason (approver)
- **To acquire:** shortfalls of open projects for items this vendor supplied (or all); make a purchase bill from them (linked; they leave the list)

**Purchase orders (`/finance/purchase-orders`, Finance menu; plan D1, 0141)**
- **List:** figures — waiting for approval, approved to send, awaiting delivery, delivery overdue, goods in to bill, value still to come — each filters the list on a click; the filter **Goods still to come** and `?status=` links from the dashboard tiles (0148); search by PO no., vendor, vendor's reference, project or item; filters by status (also open / awaiting delivery / to bill), vendor and "Delivery overdue"; each PO with its status, "Delivery N days late", % received and billed amount; cards on phones, a table from 768 px; "New purchase order" (stock create right)
- **Approval (Q9 + owner row 11):** above the company's limit someone other than the maker / last changer approves; a **Super Admin may approve their own** (Approve stays on for them, the note says so, the history says "Super Admin approved their own order above the limit"); the same for sale orders
- **Over-receipt tolerance (owner row 13, 0148):** up to the company's % (default 2 %) of each line, in the line's unit, comes in without approval (logged); above it an approver with a reason; the receive dialog shows "up to 0.2 Coil extra without approval"
- **Create PO from Need to get (owner row 35a):** in Stock → Need-to-Get report, tick short items → "Create PO" → each item to its last vendor (pick one for items never bought) → one draft PO per vendor in purchase units (rounded up to whole purchase units), with the project; links to the drafts
- **Dashboard tiles (owner row 35b):** "POs waiting for approval" and "Goods still to come" (open lines, POs, value before GST) in the Stock group, for people with the stock rights
- **New / edit PO:** vendor (active vendors, its GSTIN and terms in the list), the vendor's quote / reference, PO date (not in the future), expected delivery (not before the PO date), deliver to our warehouse or a project site (project required; its site address prints), project; **payment terms** copied from the vendor ("Change for this PO" opens the shared terms section; the PO keeps its own terms); lines — material, tool (stock search by every word, typos, HSN; add a missing item on the spot; any unit of the item with "= 900 Meter in stock terms") or service / expense — quantity, rate, discount %, GST; line totals and totals with GST by rate; a note on the ₹50,000 rule; notes and terms printed on the PO; save as draft or send for approval
- **Approval (Q9):** the stock approve right approves (from draft or waiting) or sends back with a reason; above the company's limit (₹50,000 with GST by default, Super Admin included) the person who made or last changed the PO can't approve it — the button is off with the reason; the limit per company is changed through the API by the settings edit right
- **Send to the vendor:** gives the number `PO/2026-27/0001` (per company and the PO date's financial year, in the order of sending, no gaps); print and PDF (our and the vendor's addresses in parts, GSTINs, deliver-to address, lines with HSN / unit / rate / discount / CGST + SGST or IGST, "= 900 Meter" under a line in another unit, totals in words, terms, notes, approved by)
- **Receive goods (GRN):** per line what came in, counted in the unit ordered or another unit of the item ("450 Meter = 5 Coil of the order"), pieces refused at the door, a note; the vendor's challan no., date, notes; numbered `GRN/2026-27/0001`; stock goes in (issue units) at the PO's net rate; more than ordered needs an approver — "Allow more than ordered" on a line (extra + reason) or the approver's own receipt with a reason
- **Lines on the PO page:** ordered / received (refused) / to come / billed / to bill in the unit ordered; goods received list (GRN, challan, who, value, issue-unit quantities); bills made from the PO with their status and payment (link to the bill); history (made, sent for approval, approved, sent with the number, changed with the reason and totals, goods received, more allowed, closed, cancelled)
- **Make purchase bill:** the purchase-bill form pre-filled with every line still to bill (what came in and isn't billed, service lines ordered) at the PO's net rate, the item / unit / type locked, the PO's project and terms (due date from the PO's terms); rate and GST editable, lines can be left out, other-expense lines added; a bill can't be more than what came in; no "Goods received now" (the goods came in on the PO)
- **Edit after approval:** an approved or sent PO changes only with a reason and goes back for approval (a sent PO keeps its number, revision + 1 on the screen and the print); received / billed lines keep their item and unit and can't go below what came in or was billed
- **Close** (approver, reason) when the rest won't come; **cancel** (reason) only while nothing came in and no bill is made — a partly received PO must be closed instead; a PO received and billed in full closes by itself, and opens again if its bill is cancelled

**Automatic:** a new bill's due date from the vendor's payment terms (Net N from the bill date or the month end; advance / on delivery = the bill date; editing the terms never moves an existing due date); an approved bill with money owed is overdue after its due date (else its bill date), worked out when read; approval of a vendor bill makes it payable, applies the vendor's advance and posts it to the books (Dr Purchases + Input GST, Cr vendor); payments post Dr vendor, Cr cash/bank; reversed payments never count; low stock / bill due / awaiting approval notifications.

**Added in Accounts round 2 (0131–0132):** GST rate on each material (panels / inverters 5 %, others 18 %) filling bill lines; freight per bill into item cost or Freight inward; reverse-charge tick; tool lines booked as asset or expense; vendor debit notes from an approved bill (returned pieces and / or amount, stock and GST credit reversed, vendor advance, cancel; Debit notes tab on the vendor); TDS on vendor payments (section, net to the vendor); bills approved by Director, Accounts (not their own), Inventory manager, Super Admin; live stock in the books (bill → Goods in transit → Stock-in-hand on receipt → project on dispatch).

### APIs
- `/inventory/items`, `/inventory/tools`, `/inventory/vendors` (+ `/{id}/ledger` with `overdue` / `due_week`, `/{id}/to-acquire`; list `?vendor_category=b2b|b2c|general_purchase&dues=overdue|due_week`, each row's `summary` has `overdue`, `overdue_count`, `due_week`, `due_week_count`), `/inventory/purchase-bills` (+ submit, approve, reject, cancel, receive; a bill carries `vendor_address`, `vendor_address_parts`, `vendor_gstin`, `due_date_source`, `due_date_reason`, `payment_terms_text`, `due_state`, `days_overdue`; list `?due=overdue|due_week`, `sort=due_date`; create / edit take `due_date_reason`, edit `due_date: ""` = back to the terms), vendors take `address_parts`, `vendor_category` (with `vendor_category_label` out) and `payment_terms` (as customers), `/inventory/goods-receipts`, `/inventory/vendor-payments` (+ allocate, reverse), `/inventory/damage-logs` (+ review), `/inventory/scrap-logs` (+ approve_now), `/inventory/stock-adjustments`, `/inventory/stock-transactions`
- `GET /inventory/items?search=` (plan E4): every word of the search must be in the name, size / spec or category label (any order; squeezed spellings too; one- or two-letter words only at a word's start) or start the HSN code or the item code; the whole text as the start of the item code also matches; an exact item code first, then codes starting with the text (Q4); `%` is a character, not a wildcard
- **Item code (Q4, 0145):** `POST` / `PATCH /inventory/items` take `item_code` (PATCH: omitted keeps, `""` clears; 422 invalid, 409 `DUPLICATE` naming the other item); item responses return `item_code`
- **One-off units used again (Q3, 0145):** `GET /inventory/items/{id}/one-off-units` [inventory.create] (each unit name + conversion with `use_count`, `document_count`, `saved`, `dismissed`, `offer`, `offer_text`); `POST /inventory/items/{id}/one-off-units/dismiss` {unit_label} [inventory.create]
- `GET /inventory/items` and `/{id}` (every item response): derived `issue_units_per_purchase_unit`, `cost_per_issue_unit`, `purchase_rate_per_issue_unit`, `sale_rate_per_issue_unit` (null with no sale rate), `bill_rate_per_purchase_unit`, `bill_rate_per_issue_unit`, `bill_rate_basis` (`sale_rate` / `purchase_rate` / `none`), `created_by`, `updated_by` (0135). The invoice item picker and the project screens use these
- **Bill units (E2, 0139):** `GET /inventory/items/{id}/units` [inventory.view] (the units a line can be in with the sale / purchase / cost rate in each, saved units with `use_count` / `in_use`); `POST /inventory/items/{id}/units` [inventory.create] (`unit_id` or `unit_label`, `issue_qty_per_unit`); `PATCH` / `DELETE /inventory/items/{id}/units/{unit_id}` [inventory.edit] (unused only, else 409 `IN_USE`); `POST …/deactivate`, `…/reactivate` [inventory.edit]; `POST /inventory/units` [inventory.create] (a unit for the units list from a bill, Q13). Purchase-bill lines take any unit as `purchase_unit_id` (+ `issue_qty_per_unit` for a one-off) and return `unit_kind`, `issue_qty_per_unit`, `stock_qty`, `stock_unit`; debit-note lines return `stock_qty`; the summary has `extra_units` and `last_purchase.billed_quantity` / `billed_unit`
- `GET /inventory/items/{id}/summary` [inventory.view]: the stock details — item, `created_by_name`, `updated_by_name`, `rates_changed_at` / `_by_name`, `on_site_quantity`, `value_at_cost`, `value_at_sale_rate` (+ basis), margin per purchase / issue unit and %, `last_purchase` (bill or Add stock), `last_issue`
- `PATCH /inventory/items/{id}/conversion` (`conversion_type`, `conversion_value`, `reason`): with stock or movements needs `inventory.approve` (403 `PRIVILEGE_REQUIRED`) and a reason (422 `REASON_REQUIRED`). `POST /inventory/items` and `PATCH …/issue-unit` refuse a missing factor (422, field `conversion_value`, code `CONVERSION_MISSING`)
- Bills / goods receipts / Add stock / debit notes with an item without a factor: 422 `CONVERSION_MISSING`, `data.errors[]` with `field` (`items[1].inventory_item_id`), the message and `ref` (the item id)
- `GET /inventory/vendors/{id}/dues` [inventory.view]: the Dues block; `GET /inventory/vendors/{id}/history`: category and payment-terms changes; `PATCH /inventory/purchase-bills/{id}/due-date` {due_date, reason} [inventory.approve or approve_bill]: an approved bill's due date (0138)
- Removed (0138): `vendors.category_id` and the `vendor_categories` master list (an old client's `category_id` is ignored)
- **Purchase orders (plan D1, 0141):** `GET /inventory/purchase-orders` [inventory.view] (`?status=draft|submitted|rejected|approved|sent|partly_received|received|closed|cancelled|open|awaiting|to_bill&vendor_id&project_id&overdue=1&search&date_from&date_to&sort=po_date|expected_delivery_date|total_amount`); `GET …/summary` [view] (`?vendor_id`); `GET …/settings` [view] / `PUT …/settings` {self_approval_limit} [settings.edit + Super Admin / Director, 0148]; `POST /inventory/purchase-orders/from-need` {project_id, lines[{inventory_item_id, issue_quantity, vendor_id}]} [create] (one draft per vendor; 422 `VENDOR_NEEDED`); `GET /inventory/items/last-vendors?item_ids=` [view]; list `?status=goods_to_come`; the order carries `super_admin_may_self_approve`, `over_receipt_tolerance_percent`, lines `free_over_quantity`; `POST /inventory/purchase-orders` [create] (`submit: true` sends for approval; `payment_terms` omitted = the vendor's); `GET` / `PATCH /inventory/purchase-orders/{id}` [view / edit] (after approval a `reason` is needed; it goes back for approval); `POST …/{id}/submit` [edit], `…/approve` and `…/reject` {reason} [approve; 403 `MAKER_CHECKER` above the limit for the maker], `…/send` [edit] (number given), `…/cancel` {reason} [edit or approve; 409 `PARTLY_RECEIVED`], `…/close` {reason} [approve], `…/receive` {receipt_date, challan_no, notes, over_receipt_reason, lines[{purchase_order_line_id, unit_id, accepted_quantity, rejected_quantity, notes}]} [edit; 403 `OVER_RECEIPT` / 422 `OVER_RECEIPT_REASON`], `…/allow-over-receipt` {purchase_order_line_id, extra_quantity, reason} [approve], `GET …/{id}/print` (HTML), `…/pdf` ({url}) [view]; 0149: `POST …/{id}/deliver` [inventory.edit only], `POST …/{id}/deliveries/{delivery_id}/cancel` {reason} [billing.approve], `GET …/{id}/deliveries/{delivery_id}/print` (HTML) and `…/pdf` ({url}) [billing.view or inventory.edit], `POST …/{id}/advance` {amount, payment_mode, date_received, bank_account_id, reference_no} [billing.create]; the SO returns `advances`, `advance_received`, `advance_unapplied` and each delivery's `status` / `cancel_reason` / `cost_ledger`
- Purchase bills take `purchase_order_id` (no lines = every line still to bill) and lines' `purchase_order_line_id`; 422 `OVER_BILLING` above what came in; bills return `purchase_order_id`, `purchase_order_no` and lines' `purchase_order_line_id`, `po_cost_amount`; list `?purchase_order_id=`. Goods receipts return `purchase_order_id` and `grn_number`. The item summary has `on_order_quantity` and `on_order_pos`
- **Backend only:** PO approval limit settings (no screen yet; `PUT /inventory/purchase-orders/settings`); goods receipt edit / confirm / cancel (the screens use Receive goods); item sensitive flag, issue unit, audit log; adjustment reject / reverse; stock transaction detail. `mark-received` now answers "use Receive goods".

### Review status
**Plan step 4 (C), 11 Nov 2026 (migration 0137):** vendor address in parts; the bill shows it. Tests: `hr/c_addresses.sh` (C40–C41, C90–C92), `pw/c_addresses_ui` (VE01–VE05), `hr/b2_purchases.sh` 74/74, `hr/w_warehouse.sh` 71/71.
**Status:** reviewed 9 Nov 2026 (migration 0121; see MODULE_REVIEW_PLAN "Module 11"). Tests: `hr/w_warehouse.sh` 71/71, `pw/w_vendors_ui` 80/80, `pw/w_materials_ui` 70/70 at 1440/768/390 px.
**Plan step 1 (A4), 10 Nov 2026 (migration 0134):** "Conversion value is required" on a purchase bill came from items saved without a factor (the form asked for it only with opening stock; the server never checked). Now required everywhere, editable, named on the bill. 0134 lists items without a factor, sets same-unit / foot↔metre ones, leaves the rest for the Edit form, and adds the check `inventory_items_conversion_value_chk` (validated once none are left, NOT VALID until then). Tests: `hr/h1a4_master_conversion.sh` 39/39, `pw/h1a4_ui` 73/73, `hr/w_warehouse.sh` 71/71, `hr/b2_purchases.sh` 74/74. To do with the owner: run the 0134 list read-only on production.
**Plan step 2 (A1–A3), 11 Nov 2026 (migration 0135):** the sale rate was stored as typed and multiplied by issue-unit quantities (a coil rate billed per metre). Now per purchase unit like the purchase rate, converted by the server wherever it is used (invoice item picker, project Stock sent value and sale bill, dashboard stock value); no sale rate → the purchase rate converted, marked on the line. 0135 converts existing sale rates of items whose units differ once (per conversion type, NOTICE counts; marked on the column so it never converts twice; down reverses), adds `created_by` / `updated_by` and the SQL helper `app_purchase_per_issue_unit`. Tests: `hr/a1a3_stock_rates.sh` 42/42, `pw/a1a3_ui` 126/126 at 1440/768/390 px, `hr/w_warehouse.sh` 71/71, `hr/b2_purchases.sh` 74/74, `hr/a2_sales.sh` 75/75, `hr/db_dashboard_be.sh` 64/64, `hr/qt_quotations.sh` 40/40, `hr/bl_billing.sh` 81/81, `hr/pe_projects_exec.sh` 68/68. Orders on the details (open POs / SOs) come with plan D.

**Plan step 6 (E3 / E4), 11 Nov 2026 (no migration):** search from a purchase bill line (typos, codes, size, category) and a missing stock item or tool added on the spot from the line with its units, factor and rates per purchase unit; the server's item search by every word. Tests: `hr/e34_inline_items.sh` 40/40, `pw/e34_inline_ui` 105/105 at 1440/768/390 px, `hr/b2_purchases.sh` 74/74, `hr/w_warehouse.sh` 71/71, `hr/h1a4_master_conversion.sh` 39/39, `hr/a1a3_stock_rates.sh` 42/42, `hr/b_terms.sh` 89/89; UI suites listed in TESTING_MODULE_REPORT.

**Plan step 7 (E2), 11 Nov 2026 (migration 0139):** purchase-bill and debit-note lines in any unit of the item (purchase, issue, saved, one-off), stock always moved in the issue unit by the server; saved units per item with the Q14 rule; Stock details list them. Tests: `hr/e2_bill_units.sh` (U10–U13, U24–U26, U40–U44, U92–U97), `pw/e2_units_ui` (PB01–PB05, ST01–ST04), `hr/w_warehouse.sh` 71/71 (W08 / W09 now use a unit the item has no conversion for: buying in the issue unit is allowed), `hr/b2_purchases.sh` 74/74, `hr/h1a4_master_conversion.sh` 39/39, `hr/a1a3_stock_rates.sh` 42/42.

**Plan step 5 (B1–B3), 11 Nov 2026 (migration 0138):** vendor category B2B / B2C / General Purchase (master list removed; local mapping 374 B2B, 991 General Purchase, 0 B2C), payment terms on vendors, due dates of new purchase bills from them (typed dates with a reason, approved bills moved with a reason), overdue state on bills, Dues block, list figures and filters. Tests: `hr/b_terms.sh` 89/89, `pw/b_terms_ui` 144/144 at 1440/768/390 px, `pw/w_vendors_ui` 80/80, `hr/b2_purchases.sh` 74/74, `hr/h1a4_master_conversion.sh` 39/39 (its in-use example moved to a stock category).

**Plan step 10 (A5), 11 Nov 2026 (migration 0144):** "Material" is "Stock" wherever it means stock: menu, page title, breadcrumb and page info ("materials" still finds it in the sidebar search), the Stock page's forms, drawers, toasts and empty states, the project tab "Stock sent", the purchase-bill / PO / SO line type "Stock item", the invoice picker "Add from stock…", project cost "Stock", analytics "Bought stock", dashboard "Stock to get", checklist templates' stock rows, server messages and project timeline ("Stock issued", "Stock returned to the warehouse"), the right and Settings → Masters group "Stock & Tools", the item type "Stock item", and the default ledgers "Purchases – Stock", "Stock consumed – Projects", "Stock damaged at site" (renamed in every company, Q4). `/materials` became `/stock`; old links, notifications and Activity links redirect with their query, and pins saved as `/materials` read and save as `/stock`. Unchanged on purpose: quotations and quotation templates, terms ("Ownership of Materials"), project status "Material finalized" and work scope "Material Transport" (Q3), database names and API fields (the ledger, the "Civil Material" category, the "Material Procurement" blockage reason and the quotation "Material Items" were renamed later, owner rows 20 and 21, 0151). Tests: see TESTING_MODULE_REPORT.

**Owner answers 11 Nov, rows 20, 21, 33 and 34 — stock names, Cable, return rounding (12 Nov 2026, migration 0151):** the stock ledger is "Stock-in-Hand" in every company and for new ones; stock category "Civil Stock" (and in the quotation categories), blockage reason "Stock Procurement"; the quotation form's "Stock Items" card and the quotation PDF heading "Stock Items"; the stock category "Cable" on by default and in every company. A return of company stock goes back into the warehouse at the same 4-decimal rate an issue uses, and at the project's rate when they agree to the paisa, so the books post one amount on both sides (20 m at ₹35.143: ₹702.86 to project and Stock-in-Hand, nothing to Stock Adjustments); a real rate change still goes to Stock Adjustments. Tests: `hr/q13_renames_rounding.sh` 11/11, `pw/quotations_ui` R02.

**Owner answer 11 Nov, row 10 — Number series (12 Nov 2026, migration 0150):** Settings → Number series for every document series (prefix, separator, financial-year part, digits, next number; live preview); never below a used number; new documents only; Activity; shared series Super Admin only. Tests: `hr/ns_number_series.sh` 25/25, `pw/ns_ui` 26/26 (1440 and 390); re-runs e1 39/39, d1 71/71, d2 79/79, z_customers 25/25.

**Owner answers 11 Nov, rows 11, 13, 22 and 35 — PO chunk (12 Nov 2026, migration 0148):** Super Admin approves their own PO / SO above the limit (logged); 2 % over-receipt tolerance per company; Settings → Approval limits (Super Admin / Director change); Create PO from Need to get (one draft per vendor, purchase units); dashboard tiles for POs waiting for approval and goods still to come. Tests: `hr/d1_purchase_orders.sh` 71/71, `hr/d2_sale_orders.sh` 62/62, `hr/w_warehouse.sh` 71/71, `hr/db_dashboard_be.sh` 64/64, `pw/d1_po_ui` 84/84 (1440 and 390).
**Plan step 9 (D1), 11 Nov 2026 (migration 0141):** purchase orders end to end — Q9 approval with the per-company limit, gap-free numbers at sending, goods received in any unit with over-receipt approval, bills that pull the lines and the PO's terms with over-billing refused, books at the PO cost (price differences to Purchases), print / PDF, list, vendor tab, links. Tests: `hr/d1_purchase_orders.sh` 66/66, `pw/d1_po_ui` at 1440/768/390 px (see TESTING_MODULE_REPORT), Go unit tests; `hr/b2_purchases.sh` 74/74, `hr/w_warehouse.sh` 71/71, `hr/e2_bill_units.sh` 55/55, `hr/e34_inline_items.sh` 40/40, `hr/b_terms.sh` 89/89, `hr/c_addresses.sh` 51/51, `hr/a1a3_stock_rates.sh` 42/42, `hr/h1a4_master_conversion.sh` 39/39, `hr/bp_parties.sh` 99/99.

**Owner answer 11 Nov, row 31 (12 Nov 2026):** a typed purchase-bill due date needs a reason only when it is later than the vendor's terms. Tests: `hr/q12_gst_terms.sh` (D05–D06), `hr/b_terms.sh` 89/89, `pw/b_terms_ui`.

**Owner answers 11 Nov, rows 3 and 4 (migration 0145):** optional item code per stock item / tool, searchable on lines and in the Stock list; a one-off unit used again offered as "save it for this item". Tests: `hr/q11_codes_units.sh` 23/23, `pw/q11_ui` 39/39 at 1440/390, `hr/e34_inline_items.sh` 40/40, `hr/e2_bill_units.sh` 55/55, `hr/d1_purchase_orders.sh` 66/66, `hr/d2_sale_orders.sh` 62/62, `hr/a1a3_stock_rates.sh` 42/42.

**Open:** the Tools page form has no item code field yet (a tool gets one from a bill line's quick dialog); purchase orders — "Create PO" from the project procurement needs page, receiving a site delivery straight onto the project, cancelling a PO after goods came in (owner row 14, skipped); the Need-to-Get report needs the project edit right (access matrix); the vendor category doesn't yet drive the GST treatment of purchase bills (input credit only for B2B) or the GST reports; stock isn't valued in the books and damage / scrap post to the old company ledger only (P10); returning goods to a vendor (debit note); freight in the average cost; who approves bills and damage (access matrix).

## 12. Billing and finance parties

**What it does:** invoices, receipts and advances, loans, and everyone the company pays or is paid by.

### Features

**Sales bills (`/finance/invoices`)** — one sale document (plan E1): every bill is **B2B** (a registered buyer, GSTIN on the bill) or **B2C** (a consumer, no GSTIN)
- Stats from the server with the same filters as the list (billed, received, pending, overdue, advances); B2B / B2C filter (B2B and B2C · B2B only · B2C only), status (incl. open / overdue), "money to collect" chip, date range, search; paging past 100; each row has a B2B / B2C badge, old documents say "Old invoice series" / "Old sale-bill series"
- **B2B or B2C is the first question** of New sale bill: until chosen it follows the client's GSTIN (the partner's on a partner bill); B2B for a party with no GSTIN is stopped ("… has no GSTIN. A B2B bill needs one: add it to the customer, or choose B2C"; the server refuses it at save and again at issue); B2C for a party with a GSTIN is our choice: allowed with no warning, the GSTIN left off the bill (owner row 6); a draft can switch, an issued bill can't; the line under the choice says what prints and the series ("numbered B2B/2026-27/… when issued")
- New sale bill: client (searchable, all customers; on a partner, vendor code or I&C project the partner is billed and the end customer kept for paperwork), project and quotation, place of supply (every state with its GST code; on a **project's bill it starts from the project site's state** — "From the project site (Gujarat)" — and stays editable (owner row 26); otherwise from the customer's GSTIN state, else the state of the customer's address; the server does the same when none is sent; GSTR-1 reports the stored place of supply), service lines (SAC) and item lines (HSN), qty, unit, rate, GST 0/5/8.9/12/18/28 %; the server decides CGST/SGST or IGST (company state vs place of supply); totals to the paisa with round-off; **due date from the billed party's payment terms** — the customer's, or the partner's on a partner bill (owner row 9) — (follows the invoice date until a date is typed; the hint shows the terms; only a date **later** than the terms needs a reason, an earlier one needs none — owner row 31), payment terms (filled from the customer's terms while empty), notes, bank account (print-on-invoice first)
- Save draft (no number) or Save & issue: numbers at issue from the class's own series, per company and financial year (1 April) — `B2B/2026-27/0001`, `B2C/2026-27/0001` — consecutive with no gaps (taken in the issue transaction; void keeps its number; a discarded draft never had one); bills from before keep their `INV/…` / `SB/…` numbers and still open, print and take payments ("Invoice (old series)", "Sale bill (old series)"); optional payment received now (cash, bank, UPI, cheque, card; bank account for non-cash)
- Detail: the title (B2B sale bill, B2C sale bill, … (old series)) and a B2B / B2C chip; the seller's and buyer's address on their own lines (line 1, line 2, "City, State (code) - PIN"; bills made before the parts show their text as it was); issue, edit draft, discard draft, record payment (never above what is due), edit due date / terms (a reason when the date differs from the customer's terms; empty = back to the terms), the due date shows where it came from ("From the terms" / "Set on the bill: <reason>") with its chip, void with reason (money received becomes the customer's advance), reverse a receipt (approver, reason), print (server tax invoice: "B2B sale bill · registered buyer" / "B2C sale bill" under TAX INVOICE, "Invoice no: B2B/2026-27/0001"; seller and buyer address in parts, seller and buyer GSTIN, place of supply, HSN/SAC summary, CGST/SGST/IGST, round-off, amount in words, bank details, signatory; VOID mark), download PDF
- **Print additions (13 Nov, decision 2.2; Settings → Company):** a new sale bill starts with the company's default invoice terms (editable, printed at the bottom); the print and PDF end with a UPI QR "Scan to pay ₹<amount due>" when the company has a UPI ID and money is due (issued bills only), then "For <legal name> / stamp + signature / Authorised Signatory" (the same block on sale orders, delivery challans, purchase orders and quotations)
- **Description search (plan E4):** the Description of every item and service line finds stock items (name, size, HSN start, category, a typo forgiven) or services (name, description, SAC start) as you type; ↓ then Enter picks (typing alone never picks, so a typed line stays as typed). A stock item fills the line in its issue unit at the server's rate per issue unit (the "at purchase rate" note when there's no sale rate), HSN and GST, then the quantity (selected, so typing replaces it); a service fills SAC, rate and GST. Under the line: "From stock: <item> · 1 Coil = 100 Meter" or "From the services list", each with Unlink; a typed goods line is marked **"Not from stock"** (Q15: allowed for one-off items; the bill view marks it too). "Add item" / "Add service" put the focus in the new line's Description
- **Add on the spot (E3):** "+ New stock item “typed”" and a + by the field on item lines (stock create right; the same quick dialog as on purchase bills, the line then at the new rate per issue unit); "+ New service" on service lines (billing create right: name, SAC, rate, GST); similar names shown with "Use this"; duplicates refused. Without the right there is no row and no +
- **Bill in any unit (plan E2, D4):** a stock line's Unit is a dropdown — the issue unit (default, "Meter"), the purchase unit ("Coil (90 Meter)"), units saved for the item, a one-off unit, and **Other unit…** (the same dialog as on purchase bills; without the stock create right "Save this unit" is off and explained, and a unit not in the list is used by name on that line only). The rate follows the unit from the server's rates (₹3,600 a coil, ₹40 a metre, ₹400 a 10 m bundle; a typed rate is converted); "= 180 Meter in stock terms (1 Coil = 90 Meter)" under the line, and "Only 70 Meter free in the warehouse" when the line is more than the free stock (a warning: the bill moves no stock). Saved lines keep the unit, quantity and rate as entered plus the conversion and the quantity in the issue unit; the bill view, print and PDF show "= 180 Meter" under such a line. A one-off unit used before for the item offers "Save it for this item?" under the line (owner Q3, stock create right); the line search also finds an item by its code (owner Q4, exact code first, the code shown in the row). GST and totals are unchanged rules; the GSTR-1 HSN summary carries the unit as billed (coil / bundle OTH, metre MTR, kg KGS)
- **Credit note in another unit (E2):** a stock line has an **In** dropdown (default the invoice line's unit): 20 m back on a 2-coil line credits ₹800 (20 / 90 of a ₹3,600 coil), shows "= 20 Meter in stock terms (0.2222 coil of the invoice line)", and with "Goods came back" restocks exactly 20 m (`stock_qty`); what is left on the line counts in its own unit; a return above what is on site is refused in metres; void takes the same 20 m out; the note view says "back in stock: 20 Meter"
- "Add from services list" and the Description search have the whole services list (every page)
- **Add from materials (item lines):** HSN, GST and the rate **per issue unit** from the stock item (the sale rate is per purchase unit; the server converts — a ₹3,600 coil of 90 m bills at ₹40 per metre). No sale rate → the purchase rate per issue unit with an amber "At purchase rate … — this item has no sale rate" note, cleared when the rate is typed (plan A1 / D5)
- Customer page: one "Sales bills" list (every sale document with its type), advances (unapplied money) with apply to an open invoice and record advance
- **Money from (P4 gap, closed 13 Nov):** recording a payment on a project's own (not partner-billed) invoice asks From client (cash) — the default — or From bank (loan); it is saved on the receipt (`source` on `POST /billing-documents/{id}/payments`) and the project's bank / cash received and due follow
- **TDS on receipts only on B2B bills** (old documents: a business customer with a GSTIN, as before)
- Project Stock sent → Create sale bill opens the same form (class from the customer's GSTIN)

**Sale orders (`/finance/sale-orders`, Finance menu; plan D2, 0142–0143; owner rows 18, 19, 24, 36, 0149)** — trading sales only (EPC projects keep the project as the order)
- **List:** figures — waiting for approval, approved to confirm, confirmed, delivery overdue, to bill, confirmed value — each filters on a click; search by SO no., customer, phone, the customer's order ref or item; filters by status (also open, to deliver, to bill, partly delivered, delivered, completed, closed), B2B / B2C and "Delivery overdue"; B2B / B2C chip, status and "Delivery N days late" per SO; cards on phones, a table from 768 px; "New sale order" (billing create right)
- **New / edit SO:** B2B or B2C first (follows the customer's GSTIN until chosen; B2B without a GSTIN is stopped with the same text as the sale bill; B2C with a GSTIN warned), customer (searchable), SO date, delivery date, the customer's order ref; payment terms from the customer ("Change for this SO"); lines — material / tool from the shared search (starts in the issue unit at the sale rate per issue unit, any unit of the item, "= 900 Meter in stock terms") or a service / charge; quantity, rate, discount %, GST; add on the spot; totals with GST per rate and the approval-limit note; notes and terms text; Save as draft or Save and send for approval
- **SO page:** status, B2B / B2C, revision, the customer (link) with GSTIN and address in parts, terms, totals; the limit note; actions by status and right — send for approval, approve (off for the maker above the limit, with the reason), send back (reason), **confirm** (gives `SO/2026-27/0001`), edit (after approval with a reason: back for approval, number kept, revision + 1), cancel (reason; not once anything went out or is billed), **deliver goods**, **make sale bill**, **close** (approver, reason: the rest is dropped), print, PDF; the stock warning after confirm and "Reserved in the warehouse for this SO"; lines ordered / delivered / to deliver / billed / to bill / reserved; **Deliveries** (challan, date, vehicle, both units, value at cost) and **Sale bills** (link, status, amount, due); history with deliveries and each status step
- **Stock reserved (Q10):** at confirm, what is still to deliver in issue units (the item's reserved stock, so Free = on hand − reserved everywhere); more than the free stock is a warning, not a refusal; a numbered SO waiting for re-approval keeps holding; cancel / close / completed release; each delivery lowers it
- **Deliver goods:** a delivery challan `DC/2026-27/0001` (gap-free) with date, vehicle no., notes; each stock line counted in any unit of the item ("1 Coil = 90 Meter of the order"), "Fill everything left"; more than is left refused (422 `OVER_DELIVERY`); stock leaves in issue units through the warehouse stock log at the average cost; **only the stock edit right (stores)** — the billing right alone gets 403 and no button (row 24)
- **Cancel a challan (row 18):** an approver (billing approve right) with a reason, only while none of its quantity is billed (409 otherwise, "cancel or void the bill first"); the stock comes back in issue units (movement return), the reservation is set again for what is still to deliver, the SO steps back (partly delivered → confirmed …), the books entry is reversed on the cancel day, and the challan keeps its number with a "Cancelled" badge, who and why
- **Printed challan (row 36a):** "Print challan" / "PDF" on each challan — our company and the customer with the address in parts, SO no., DC no., date, vehicle, items with quantity and unit ("= 450 Meter" under another unit), no prices, signature lines (stores, driver, receiver, signatory); stores can open it too
- **Record advance (row 36b):** money from the SO's customer recorded against the SO (a customer receipt; cash or bank); the SO page lists the advances (received, used on bills, not used); when a bill made from the SO is **issued** the advance pays it first (oldest first, up to the bill amount) and the rest stays the customer's advance; voiding the bill frees it; cancelling the SO leaves it as the customer's advance; not on a cancelled / closed / completed SO
- **Make sale bill:** a draft B2B / B2C sale bill (the SO's class, customer, terms, lines in the SO's units at the net rate and GST) opened in Sales bills; part bills by API; more than ordered refused (422 `OVER_BILLING`; drafts count, cancelled / void free); the bill shows "Sale order SO/…"; status confirmed → partly delivered → delivered → completed (delivered and billed in full); a voided bill moves it back
- **Rules:** the billing approve right approves; above the company's limit (₹50,000 by default, its own setting) not the maker or the last changer — Super Admin too; numbers per company and the SO date's financial year at confirm, no gaps; the SO posts nothing in the books; a delivery posts **Dr Cost of Goods Sold** · Cr Stock-in-hand at cost (perpetual stock; row 19 — a "Cost of Goods Sold" ledger under Purchase Accounts in every company and new companies, posting slot "Cost of goods sold", shown in the P&L; deliveries made before 0149 keep Purchases), the bill as any sale bill

**Loans (`/finance/loans`)**
- Stats; search; status and type filters; export CSV
- Add / edit loan: source, lender, principal, interest method per loan (reducing — bank-style EMI on the balance; flat — on the original amount), rate, tenure, EMI / bullet / interest-only / manual, optional EMI override, start date (first EMI a month later, month-end safe), bank account received in, linked project
- Details: principal owed, interest paid, next EMI, overdue; schedule with principal / interest per row; repayment (capped at what is left; split interest first then principal, oldest rows first; manual split for manual loans); reverse repayment with reason; close (settlement needs a reason; remaining rows waived)

**Partners (`/finance/partners`)** — one list for everyone who brings partner, vendor code or I&C projects
- List with search (name, phone, GSTIN) and status; add / edit (name, phone — unique, GSTIN, email, address in parts, **payment terms** — the same section as customers, changes recorded in Activity — notes); deactivate
- **Payment terms and dues (owner row 9, 0146):** a bill to the partner (partner, vendor code or I&C project) gets its due date from the partner's terms; the partner page shows the terms and a **Dues block** (open, overdue, due in 7 days, ageing, each open bill with its chip); the bills are in the sales-bills overdue list and Audit → Debtors by their due date
- Details: **Account** (what they owe: our charges, received, owed on projects, money to pay on to them, bills to them and what's due), **Rates**, **Investments** (money they put into a project; repayment against a chosen investment, never above what's outstanding; cancel with reason when nothing repaid), **Ledger** (from the server; adjustments need a reason); create enquiry

**Agents (`/agents`, Finance menu)**
- List with search and status; add / edit (address in parts; the list's location is the city; commission per kW or per project)
- Details: Enquiries, Projects, Quotations, Commissions (worked out automatically when the project has started and money came in; an approver approves, the amount can be changed with a reason; cancel with reason), payments (go to approved commissions first; the rest waits as advance and is used on approval; reverse with reason), ledger cards (awaiting approval, approved due, advance, paid out); create enquiry; deactivate / reactivate

**Vendorship Code Co. (`/vendorship-companies`)** — another company whose vendor code we use; the customer's money comes to them and they pass it on
- List with All / Active / Inactive; create (name, DISCOM code, fee per watt, phone, email, address in parts), edit, deactivate / reactivate
- Details: Account per project (fee, kept, paid, due, customer money passed on; "we owe them", advance); fees (created automatically per project; approve, cancel with reason); record collection (project of this company, amount received, fee kept); record payment to the company; reversals with reason

**Subcontractors (`/finance/subcontractors`)**
- List, search, status; add (default rate per kW, address in parts), edit, deactivate
- Work orders (project, scope, per kW with planned kW or fixed amount, dates): Start → Mark completed → Approve (approver; above the contract needs a reason); cancel with reason before any payout; payouts against a work order, never above what is left, tagged to its project; reverse payout (approver, reason); cards: committed, approved, paid, due / advance

**Automatic:** B2B / B2C numbers per company and financial year at issue; overdue (invoices, EMIs) worked out in IST and cleared when paid or the due date moves; agent commission when a project qualifies; code-company fee per project; every money record posts to the books (invoice journal with round-off; receipts Dr cash/bank Cr customer or partner — kept on void; loan repayment split into principal and Interest on loans; commission on approval; subcontract work on approval, payouts to the subcontractor; vendorship fee on approval, collections credit the customer); reversed records drop out; overdue receivable and EMI notifications (active loans only). Bank loan tranches and visit fees moved to a project pay that project's open invoices oldest first (any rest is the customer's advance and pays the next invoice at issue; released again if the tranche is deleted or the invoice voided) — 0130.

**Added in Accounts round 2 (0131–0133):** services list (installation, I&C, AMC, vendor code charge, partner project charge) and material GST rates on invoice lines; 18 % GST on our charge on partner / vendor-code / I&C projects; each line marked our charge or extra (partner account and economics count each once); credit notes (part / whole invoice, quantity and / or amount, reason, CN numbering, PDF / print, void, advance applied to another invoice, goods back to the warehouse per line); TDS on receipts for business customers (TDS receivable report by quarter, CSV); TDS on agent and subcontractor payments; partners' investments in their own ledger (Unsecured Loans) next to their debtor ledger; receipts reversed by Director, Accounts, CA, Super Admin; commissions approved by Director, Accounts, Super Admin.

### APIs
- **Sale orders (plan D2 part 1, 0142):** `GET /sale-orders` [billing.view] (`?status=draft|submitted|rejected|approved|confirmed|cancelled|open&customer_id&supply_class=b2b|b2c&overdue=1&search&date_from&date_to&sort=so_date|delivery_date|total_amount`); `GET …/summary` [view] (`?customer_id`); `GET …/settings` [view] / `PUT …/settings` {self_approval_limit} [settings.edit]; `POST /sale-orders` [create] (`supply_class`; `submit: true`; `payment_terms` omitted = the customer's; 422 `gstin_required`); `GET` / `PATCH /sale-orders/{id}` [view / edit] (after approval a `reason`); `POST …/{id}/submit` [edit], `…/approve` and `…/reject` {reason} [approve; 403 `MAKER_CHECKER`], `…/confirm` [edit] (number given; B2B re-checked), `…/cancel` {reason} [edit or approve], `GET …/{id}/print` (HTML), `…/pdf` ({url}) [view]
- **E1 (0140):** `POST /billing-documents` takes `supply_class` (`b2b` | `b2c`; left out = B2B with a GSTIN, else B2C; 422 `gstin_required` for B2B without the billed party's GSTIN; `document_type` from old clients ignored, other values 422); `PATCH /billing-documents/{id}` takes `supply_class` on drafts (409 on issued ones); issue re-checks the GSTIN (422, no number used). Documents return `supply_class`, `number_series` (B2B / B2C / INV / SB), `old_series`, `doc_title`. `GET /billing-documents` and `/summary` take `?supply_class=`; `document_type=sale_bill` = the old SB series. `GET /customers/{id}/invoices` lists every sale document (with `supply_class`, `number_series`, `doc_title`); `/customers/{id}/sale-bills` only the old SB series (backend-only now). Financial summary adds `total_b2b_amount`, `total_b2c_amount`
- **E2 (0139):** item lines (`POST /billing-documents`, item-lines POST / PATCH) take `unit_id` and, for a unit the item doesn't know, `issue_qty_per_unit` (422 "1 Bundle = how many Meter?" without it); without `unit_id` the unit text is matched to the item's units, unknown text stays the issue unit. Lines return `unit_id`, `unit_kind` (issue / purchase / extra / one_off), `issue_qty_per_unit`, `stock_qty`, `item_unit_id`, `stock_unit`. Credit-note lines take `unit_id` / `issue_qty_per_unit` and return those plus `invoice_line_qty`; returns move `stock_qty`
- `GET /service-presets?search=` (plan E4): every word in the name or description (any order) or the start of the SAC; `POST /service-presets` [billing.create] is what "+ New service" calls (409 on a name already in the list, any case / spacing)
- `/billing-documents` (+ issue, cancel, void, payments, lines, summary, pdf, print; create without `due_date` fills it from the billed party's terms (the partner's on a partner bill, 0146), `due_date_reason` when a typed date is later than the terms (422 otherwise; an earlier date needs none), PATCH `due_date: ""` = back to the terms; documents carry `due_date_source`, `due_date_reason`; `billing_address_parts` / `company_address_parts` kept with the text snapshots and refreshed at issue; `place_of_supply_state` may be left out: on a project's bill the project site's state, else the billed party's GSTIN state, else its address state), `/payment-receipts` (+ apply, reverse), `/loans` (+ repayments, reverse, close, schedule)
- `/partners` (+ account — with the partner's bills to MSS, 0147 —, vendor (the partner's own vendor record, 0147), investments, repayments, ledger, adjustments), `/agents` (+ commissions approve / cancel, payments, reverse, ledger), `/vendorship-code-owners` (+ account, payables approve / cancel, payments, code-giver-receipts, reverse), `/subcontractors` (+ work-orders transition / approve, payouts, reverse, ledger) — each takes `address_parts`; `/sub-vendors` and `/inc-work-sources` remain server-side only
- **6.4 (0159):** `POST /billing-documents/{id}/share` [billing.view] → a 7-day public link to the bill's PDF (422 `not_issued` for a draft) with `document_no`, `phone`, `amount` / `amount_label` (balance due after a part payment), `due_date`; opened at `GET /api/v1/share/{token}`
- **Backend only:** partner agreements; agent payment allocate

### Review status
**Owner decision 13 Nov, 6.4 (migration 0159):** Share on WhatsApp on issued sale bills (bill number, balance due, due date, 7-day secure PDF link, Copy link). Tests: `hr/m6_statement_share.sh` 36/36, `pw/m6_ui` W*-20–21, `hr/bl_billing.sh` 81/81.

**Section P, who bills the client (owner answer 28; 12 Nov 2026, migration 0147):** the firm whose vendor code the project uses bills the client — "Vendor code used: ours / another firm" (the existing vendorship mode and code company list) in the wizard, edit drawer and header; client amount on partner / vendor code projects on our code; MSS bills the client, the code company (through its own customer record) or the partner; the partner bills MSS through a purchase bill from its own vendor record, capped at what MSS owes (margin or full amount); our charge billed to the partner on vendor code projects, net shown; received, outstanding, the completion check, economics and the books follow the billed party; payouts to partners read-only (POST 410). Tests: `hr/p_vendor_code_billing.sh` 44/44, `pw/p_vc_ui` 42/42 at 1440/390, `hr/pt_project_types.sh` 37/37, `hr/pm_projects_money.sh` 41/41, `hr/pe_projects_exec.sh` 68/68, `hr/bp_parties.sh` 99/99, `hr/bl_billing.sh` 81/81, `hr/b2_purchases.sh` 74/74, `hr/q12_gst_terms.sh` 30/30.

**Owner answers 11 Nov, rows 6, 26, 9 and 31 (12 Nov 2026, migration 0146):** B2C for a GSTIN customer without a warning; place of supply on project bills from the site's state (form and server; GSTR-1 follows the stored value); payment terms, due dates and a Dues block for partners; only a later due date than the terms needs a reason (sale and purchase bills, issued-bill due date). Tests: `hr/q12_gst_terms.sh` 30/30, `pw/q12_ui` 34/34 at 1440/390, `hr/b_terms.sh` 89/89, `hr/e1_sale_document.sh` 39/39, `hr/bl_billing.sh` 81/81, `hr/gs_gst.sh` 57/57, `hr/bp_parties.sh` 99/99.

**Owner answers 11 Nov, rows 3 and 4 (migration 0145):** sale bill and SO lines find stock by its item code and offer to save a one-off unit used again. Tests: `hr/q11_codes_units.sh` 23/23, `pw/q11_ui` (IN01–IN04, OF01–OF05, QS01–QS03, PA01), `hr/d2_sale_orders.sh` 62/62, `hr/e2_bill_units.sh` 55/55.
**Plan step 4 (C), 11 Nov 2026 (migration 0137):** addresses in parts on bills (print and PDF), place of supply from the state, parties' addresses in parts. Tests: `hr/c_addresses.sh` (C42–C44, C80–C85), `pw/c_addresses_ui` (IN01–IN04), `hr/bl_billing.sh` 81/81, `hr/bp_parties.sh` 99/99.
**Status:** reviewed 9 Nov 2026 (migrations 0122–0124; see MODULE_REVIEW_PLAN "Module 12"). Tests: `hr/bl_billing.sh` 81/81, `hr/bp_parties.sh` 99/99, `pw/bl_invoices_ui` 52/52, `pw/bp_parties_ui` 201/201 at 1440/768/390 px.

**Plan step 6 (E3 / E4), 11 Nov 2026 (no migration):** item and service lines searchable from the Description, a missing stock item or service added on the spot, typed goods lines marked "Not from stock". Tests: `hr/e34_inline_items.sh` (E30–E34, E40–E42, E54–E60), `pw/e34_inline_ui` (IN01–IN12, RT01–RT03), `hr/bl_billing.sh` 81/81, `hr/a2_sales.sh` 75/75; `pw/bl_invoices_ui`, `pw/a2_ui`, `pw/a1a3_ui` re-run (see TESTING_MODULE_REPORT).

**Plan step 9 (D2 part 2), 11 Nov 2026 (migration 0143):** stock reservation, delivery challans in any unit, sale bills from the SO, statuses to completed, close, books. Tests: `hr/d2_sale_orders.sh` 62/62, `pw/d2_so_ui` 64/64 at 1440/390 (see TESTING_MODULE_REPORT); `hr/d1_purchase_orders.sh` 66/66, `hr/e1_sale_document.sh` 39/39, `hr/e2_bill_units.sh` 55/55, `hr/a2_sales.sh` 75/75, `hr/w_warehouse.sh` 71/71, `hr/bl_billing.sh` 81/81.

**Plan step 9 (D2 part 1), 11 Nov 2026 (migration 0142):** sale orders, core — B2B / B2C, customer terms and address, lines in any unit, approval with the per-company limit and maker ≠ approver, gap-free SO numbers at confirm, changes after approval, cancel, print / PDF, list, SO page, customer tab, sidebar / pins / page info. Tests: `hr/d2_sale_orders.sh` 36/36, `pw/d2_so_ui` 46/46 at 1440/390 (see TESTING_MODULE_REPORT), Go unit tests; `hr/d1_purchase_orders.sh` 66/66, `hr/e1_sale_document.sh` 39/39, `hr/f_sidebar_prefs.sh` 28/28, `pw/f_sidebar_ui` 215/215.

**Plan step 8 (E1), 11 Nov 2026 (migration 0140):** one sale document, B2B or B2C first, own series per company / class / financial year, old INV / SB documents kept, GSTR-1 from the class. Tests: `hr/e1_sale_document.sh` 39/39, `pw/e1_sale_doc_ui` 98/98 at 1440/768/390, `hr/bl_billing.sh` 81/81, `hr/gs_gst.sh` 57/57, `pw/bl_invoices_ui` 52/52 (see TESTING_MODULE_REPORT); Go unit tests for the class, series and GSTR-1 rules.

**Plan step 7 (E2), 11 Nov 2026 (migration 0139):** sale-bill and credit-note lines in any unit of the item, the conversion and the issue-unit quantity on each line, returns restocked in issue units. Tests: `hr/e2_bill_units.sh` (U20–U32, U50–U72, U80–U91), `pw/e2_units_ui` (IN01–IN08, OU01–OU05, CN01–CN03, RT01–RT05), `hr/bl_billing.sh` 81/81, `hr/a2_sales.sh` 75/75, `hr/gs_gst.sh` 57/57; Go unit test for the credit line in another unit.

**Plan step 5 (B3), 11 Nov 2026 (migration 0138):** due dates of new invoices / sale bills from the customer's terms, reasons and history for other dates. Tests: `hr/b_terms.sh` (B83–B103), `pw/b_terms_ui` (IN01–IN04), `pw/bl_invoices_ui` 52/52, `hr/bl_billing.sh` 81/81, `hr/bp_parties.sh` 99/99.

**Open:** sale orders — record advance against an SO, cancelling a delivery challan, a printed challan — and the owner questions in the plan (D2 as built, parts 1 and 2); credit / debit notes, e-invoicing (IRN), TDS on payments, duplicate invoice; books for a loan settlement write-off and partner ledger adjustments; partner repayments can't be reversed yet; who approves (access matrix).

## 13. Accounts (books)

**What it does:** Tally-style double-entry books for each company, the reports built on them, and GST returns for the CA.

### Features

**Accounts home (`/accounts`):** like Tally's Gateway (Masters, Transactions, Reports); new Payment / Receipt / Contra / Journal.

**Cost center — ledger master (`/accounts/ledgers`)**
- Tree type → group → sub-group → ledger with counts on each row; search; show inactive; expand / collapse; detail panel
- New group / sub-group (name, under, type, affects gross profit, order)
- New ledger: name, group, opening Dr / Cr (balance-sheet ledgers only — income and expense ledgers start each year at zero), GSTIN, PAN, phone, bank details with live IFSC, print on invoices; edit; delete or deactivate (history never moves); quick create from any ledger field; opening / group changes refused while the books are locked (CA may)
- The 28 Tally groups and system ledgers are locked; party ledgers are found by link, GSTIN, phone, then name anywhere under Sundry Debtors / Creditors, and carry GSTIN / PAN / phone

**Ledger page:** other side of each entry, running balance, opening / closing (income / expense ledgers open each financial year at zero); monthly summary with drill-in; detailed view; print; CSV with numeric columns.

**Group summary:** period totals with drill-down from the reports; print.

**Daybook (`/accounts/daybook`)**
- Date range (financial year by default); type, ledger, project filters kept in the link; search; Tally columns with a detailed view; pagination
- Entry drawer: view, edit, cancel (reason), reverse (date checks) — buttons only for users with the right; reversed entries and reversals read-only
- Period lock / unlock (CA and Super Admin only)

**New / edit entry**
- Payment, Receipt, Contra as vouchers; Journal as a Dr / Cr grid; same ledger on both sides refused
- Ledger picker with quick create; project tags per line or split equally; EMI split (interest optional); line notes
- Saved entry's type and number can't change; module, payroll and reversed entries open read-only

**Reports (`/accounts/reports`)**
- Trial Balance (Dr = Cr, with "Profit & Loss A/c (previous years)" and "Difference in opening balances" rows; income / expense from 1 April)
- P&L two-sided with Opening and Closing Stock in the trading part, gross and net profit
- Balance Sheet two-sided with Closing Stock under current assets and Profit & Loss A/c (previous years + this year)
- **Closing stock:** worked out from the warehouse at average cost on any date, item by item; the CA can lock a year-end figure
- Ledger statement / cash & bank books; group-wise; financial year, from / to, Today, This month; CSV; print (without the sidebar)

**Bank import (`/accounts/bank-import`)**
- Bank ledger; .xlsx / .xls / .csv; saved layouts per bank (AU included); map columns, date format, amount style
- Preview; lines already in the books (from modules, payroll or the Daybook) are matched; a statement imported twice shows duplicates and posts nothing; rows before the books start or in a locked period are skipped with the reason; commit or discard; history

**Map suspense (`/accounts/suspense`):** imported lines go to Suspense; map to a ledger or split into several; another of our banks becomes a Contra; unmap; "remember for narrations with"; ageing.

**Posting ledgers — books link (`/accounts/posting-ledgers`):** ledger per module (each checked for the right type), incl. stock written off, loan waiver / settlement, partner adjustments, bank charges; payment mode → cash / bank ledger; create recommended; Posted / Pending / Outside / Needs a CA / Cancelled lists; Post pending.

**GST (`/audit/gst`)**
- Month picker; GSTR-1 (B2B per invoice with GSTIN, B2C large and small, nil rated, HSN summary with quantity and unit, documents issued, voided; since plan E1 the section follows the bill's B2B / B2C class — a B2C bill never reports a GSTIN — credit notes follow their invoice (CDNR / CDNUR / B2CS), and documents issued has one range per series: B2B, B2C and the old INV / SB) and GSTR-3B (outward tax, inter-state to unregistered, input credit from approved bills split by the vendor's state (the GSTIN's state; a vendor without GSTIN by the state of its address, 0137), unregistered purchases listed apart, net payable), purchase register; each checked against the books' GST ledgers; Excel downloads for the CA

**Audit pages:** debtor and creditor ageing (not due, 0–30, 31–60, 61–90, 90+) by due date; registers (sales: issued only; purchases: approved; payments: not reversed); GST summary; periods by financial year. Audit P&L, cash & bank ledger and expense reports removed (the books have them); Audit cash & bank opens the books.

**Automatic:** every money module posts after every save (one run per company at a time, across the API and the worker); a posted record is never left without its entry or posted twice; module entries dated in IST; warehouse scrap / damage write-offs, loan settlements and partner adjustments post; worker safety net every 15 minutes; imported lines to Suspense; party ledgers created; period locks enforced.

**Purchase orders (plan D1, 0141):** a PO posts nothing; goods received against a PO post Dr Stock-in-hand / Cr Goods in transit at the PO's cost (live stock); the bill made from the PO clears Goods in transit at that cost and puts any difference to the bill's rate in Purchases, so Goods in transit holds PO goods received and not billed yet, and the stock check still matches.

**Added in Accounts round 2 (0131–0133):** live stock-in-hand (Goods in transit, Stock-in-hand, Stock adjustments; Stock view = warehouse value vs ledger, CA align; live / periodic switch for CA / Super Admin); new posting slots (TDS receivable, TDS payable, GST payable on reverse charge, Freight inward, asset-type ledgers, PF / ESI / TDS payable, employer PF / ESI); TDS payable report by month / section / party; GSTR-1 CDNR / CDNUR and net figures; GSTR-3B 3.1(d), table 4 (4(A)(3), 4(B)(2), net ITC); purchase register with reverse charge and debit notes. Real books will start 1 Apr 2026.

### APIs
- `/accounts/*` (tree, groups, ledgers and monthly, entries, reports and group summary, closing stock, financial years and lock, bank formats and imports, suspense map / unmap, posting settings, module postings and sync, payroll ledgers)
- `/gst/gstr1`, `/gst/gstr3b`, `/gst/purchase-register` (+ `.xlsx`); `/audit/ageing/{debtors|creditors}`

### Review status
**Plan step 8 (E1), 11 Nov 2026 (migration 0140):** GSTR-1 sections from the bill's B2B / B2C class, credit notes by their invoice, documents issued per series (B2B, B2C, old INV / SB). Tests: `hr/e1_sale_document.sh` (E17–E21, E33–E35), `hr/gs_gst.sh` 57/57 (GS12 / GS17 read the new series); Go unit tests `classifySale`, `buildDocRanges`.

**Plan step 4 (C), 0137:** a vendor without a GSTIN is intra / inter-state by its address state in the purchase register, GSTR-3B and debit notes. Tests: `hr/c_addresses.sh` C92, `hr/gs_gst.sh` 57/57.
**Status:** reviewed 9 Nov 2026 (migration 0125; see MODULE_REVIEW_PLAN "Module 13"). Tests: `hr/ac_books.sh` 66/66, `hr/gs_gst.sh` 57/57, `pw/ac_books_ui` 85/85, `pw/gs_gst_ui` 115/115 at 1440/768/390 px.

**Open:** GST credit / debit notes and reverse charge; partner ledger group (CA to confirm); statutory deduction ledgers (after the payroll decision); payment-mode remapping still moves past postings.

## 14. Tasks

**What it does:** work given to people, from templates; full history; automatic tasks from rules.

**Switched off for now (12 Nov, owner):** Teams and Tasks are designed together and built at the very end. The menu items (People → Teams, Pipeline → Tasks, Settings → Task templates and Task automations) stay, greyed with a **Soon** chip; their routes (`/teams`, `/teams/:id`, `/tasks`, `/settings/task-templates`, `/settings/task-automations`) and the employee page's **Tasks** tab show a **Coming soon** page. The module code and APIs below are unchanged and switch back on by restoring the routes in `AppRouter.tsx` (shared `ComingSoon` component in `src/components/coming-soon.tsx`).

### Features

**Tasks (`/tasks`)**
- Given to me / Given by me / All; status, department, overdue filters; search (waits until you stop typing); counts from the server (open, in progress, on hold, overdue, done); 50 at a time with Load more; `/tasks?task=<id>` opens a task (alert links use it)
- New task (needs the create right): template, assignee (eligible for the template's departments; "On leave" shown for the due date, with a warning — still allowed), title, due date (not before today, India date), priority, instructions, related enquiry / quotation / project / customer (must exist)
- Drawer: start, hold (reason), take off hold, cancel (reason), save progress (checklist / form / document checklist), attachments (photo with GPS, file, document slot), complete; reassign; edit; leave banner when the person is on approved leave that day; History (who did what and why, in plain sentences)
- Reopen: a completed task by the person it was given to, the Director or Super Admin; a cancelled task by anyone who can edit tasks — always with a reason. Finished tasks are read-only (no edits, reassigning or file changes)
- Buttons follow the user's rights

**Employee profile → Tasks tab:** the person's tasks (open first, then finished, Load more), start / hold / done / cancel / reopen with reasons; site visits stay on their own tab.

**Assign task (from Employees, Projects, Team Roster):** person or team, project, date, instructions; creates tasks.

**Calendar:** tasks show on their due date; cancel / hold from the calendar asks a reason; reopen goes through the same rule.

**Settings → Task templates:** per company; name, category, department / designation, priority, due days, description; response type (checklist / form / document checklist); form builder (text, number, date, time, paragraph, checkbox, radio, checkboxes, yes / no / N.A., photo, file, instruction) with reorder and JSON mode; "photo proof required"; delete.

**Settings → Task automations:** rules — when an enquiry / quotation / project is created or moves to a stage, or a task from a template is completed (optionally only with a given outcome) → give out a task from a template to someone with a designation (taking turns, or whoever has fewest open tasks), priority and due days optional; switch on / off, edit, delete (tasks already made stay); last used, how often, recent runs.

**Automatic:**
- Rules fire from the database on every save path; never twice for the same record and stage; a failing rule never blocks the save; chains stop after 5 levels; a rule can't create the template it listens to.
- Enquiry tasks: completing, cancelling, holding or reopening adds a line to the enquiry timeline.
- Alerts: "Task given to you" (last 14 days, still open) and "Overdue task" (to the person and whoever gave it), India date.
- Overdue tasks show on the Dashboard.

### APIs
- `/tasks` (filters incl. `assigned_employee_id`, `include_visits`, `limit`), `/tasks/summary`, `/tasks/{id}`, `/tasks/{id}/status`, `/assignee`, `/response`, `/complete`, `/reopen`, `/events`, `/attachments`
- `/task-templates` (incl. `assignable-employees?date=`), `/task-categories`
- `/task-automation-rules` (+ `/{id}/runs`)

### Review status
**Status:** reviewed 10 Nov 2026 (migration 0126) — see MODULE_REVIEW_PLAN.md "Module 14".

**Open:**
- Tasks made by a rule show the rule's author as "given by".
- Who may see all tasks and change other people's tasks → access matrix.

## 15. Dashboard and analytics

**What it does:** the overview screens — a quick daily view (Dashboard), deeper figures (Analytics) and the money overview (Finance home). Every figure has one definition shared by all three, the alerts and the lists they open.

### Features

**Dashboard (`/`)**
- **My day** (everyone): my tasks (due today / overdue / open), my site visits today, my follow-ups (due today / overdue), my attendance today; short list of the items
- **Money** (money right): Sales this month (and this financial year, before GST, from the books), Money received this month (and this year), Customers owe (open invoices, due in 7 days), Overdue from customers, Loan EMIs due in 7 days, We owe vendors (approved bills; overdue) — overdue by the due date, which new bills now get from the party's payment terms (0138)
- **Enquiries & quotations:** open enquiries, follow-ups overdue, quotations waiting (sent, not expired)
- **Projects & sites:** active, in progress, ready to install, on hold, blocked, blockages, procurement issues, sites live (whole company); project activity list; overdue project tasks
- **Stock:** low-stock materials, procurement gaps on live projects; stock value at sale rate (Analytics → Inventory) = available issue units × the sale rate per issue unit, or the purchase rate when there is no sale rate (plan A1)
- **Tasks** (Director): open, overdue, due today, done this month
- **People:** Not at work today (absent, half day, on paid / unpaid leave, not marked, with names), Payroll for last month (not built / built / approved / paid)
- Due today list; quick actions; alerts (by alert rights; amounts in ₹)
- Each tile opens a list showing exactly that number; tiles only with rights to their area; failed sections named, never shown as zero

**Analytics (`/analytics`, analytics right)**
- Period: this month, last month, this / last quarter, this / last financial year, last 12 months, pick dates (India dates; kept in the link)
- **Business overview:** header Sales, Money received, Active projects, On payroll, Stock value; sections Pipeline, Customers, People, Operations, Inventory, Finance (debtor buckets with drill-down), Project distribution (by project type), Top performers; CSV per section incl. summary
- **Enquiries & Sales:** filters (source type, source, person, priority, salesperson), tiles, volume, funnel, salesperson table, source, pipeline ageing, site visits and documents, loss reasons, "Needs attention today"; every chart opens a paged list from the server
- `/business-analytics` opens this tab

**Finance home (`/finance`, finance right):** Sales, Money received, Expenses, Net result (P&L incl. stock), Customers owe, We owe vendors, Cash & bank (per ledger); April–March month chart; paged Money received and Sales entries lists; export.

### APIs
- `/dashboard` (+ older per-section `/dashboard/*`), `/analytics/*` (summary, inventory, customers, people, finance, pipeline, operations, project-distribution, top-performers, enquiries/*, exports), `/finance/home` (+ `revenue-details`, `money-received-details`, `expense-details`, `outstanding-details`, `cash-surplus-details`)
- List filters used by the tiles: `/enquiries?overdue=true|status=…`, `/quotations?in_flight=true`, `/projects?status_group=running`, `/loans?emi_due_days=7`, `/billing-documents?overdue=true|receivable=open`, `/inventory/items?low_stock=true`, `/tasks?overdue=true`

### Review status
**Status:** reviewed 10 Nov 2026 (migration 0127) — see MODULE_REVIEW_PLAN.md "Module 15".

**Open:** who sees money and the project / stock tiles → access matrix.

## 16. Audit and reports

**What it does:** the audit section for the owner and the CA — who owes whom, GST, report downloads, a full activity trail and the fixed-asset register.

### Features
- **Debtors / creditors** (`/audit/debtors-creditors`): ageing by due date (no due date = invoice date; new bills get it from the party's payment terms, 0138), open documents, paging, CSV. The vendor and customer pages show the same buckets per party (Dues block)
- **GST** (`/audit/gst`): GSTR-1, GSTR-3B, purchase register, Excel for the CA (Module 13)
- **Reports & export** (`/audit/reports`): sales register, Money received (all sources, reversed out), debtors, creditors, inventory valuation (= Accounts closing stock), fixed-asset register; financial-year periods; DD-MM-YYYY CSVs; downloads need the money right
- **Activity** (`/audit/activity`): every change across modules in one feed — books entries (before / after), bills (incl. due-date changes with the reason), purchase orders (made, approved, sent, changed, goods received, more allowed, closed, cancelled; link to the PO), vendor category and payment-terms changes, tasks, projects, enquiries, quotations, items, masters, settings, salary, plus permission and role changes, rows deleted outright and sign-ins / sign-outs; filter by period, person, module, text; links to the record; Load more; CSV
- **Fixed assets** (`/audit/fixed-assets`): register (asset, bill, date, quantity, cost, depreciation, book value, status) tied to the Tools & Equipment and Accumulated depreciation ledgers; add an asset bought earlier; depreciation for a year (WDV / SLM, half rate after 3 October, preview, edit, post, cancel) by the CA / Super Admin; sold / scrapped with money received and the profit or loss
- **Automatic:** approved bills post tool lines to Tools & Equipment; depreciation and disposal journals; sign-ins and deletes recorded
- **Removed:** Audit dashboard, Inventory audit, Cash & bank, Data flow (links redirect to Accounts / Reports)

**Added in Accounts round 2 (0132):** assets of every kind (tools & equipment, vehicle, computer, furniture, plant, other) with their own ledgers; method and rate per asset (editable; depreciation uses each asset's own rate); add any asset (optionally posting the purchase); tools on purchase bills — move to assets / back to expense (CA / Super Admin).

### APIs
- `/audit/ageing/*`, `/gst/*`, `/audit/reports` (+ `/{slug}`, `/{slug}/export`), `/activity` (+ `/export`; `/audit/logs` returns the same feed), `/fixed-assets` (+ `/depreciation/preview`, `/depreciation`, `/depreciation/{fy}`, `/{id}/dispose`)

### Review status
**Status:** reviewed 10 Nov 2026 (migration 0128) — see MODULE_REVIEW_PLAN.md "Module 16".

**Open:** tools bought before 0128 stay as expenses; who among audit users sees amounts → access matrix.

## 17. Notifications, documents, background jobs

### Features

**Alerts (bell and `/notifications`):** bell pop-up with the latest alerts (each opens its record), count refreshes every 30 s and after every save; page with search, type and severity filters, open / high-priority counts, dismiss, dismiss all, Load more; a dismissed alert comes back marked "New again" when its state changes (e.g. EMI due → overdue); no ₹ amounts for people without the money right; sidebar badge.

**Alerts raised automatically:**
- Money and stock: low stock (materials), EMI due / overdue, overdue receivable (no due date = invoice date), vendor bill due within 7 days / overdue (approved, received or part-received, unpaid), milestone overdue, project blockage
- Waiting for approval (to whoever holds the approve right): purchase bill, advance request (high above the company limit; never to the requester), payroll run, agent commission, work order, code-company fee, stock adjustment / scrap / damage, leave request / cancel request, project change request (pending only), enquiry site-visit change
- Pipeline: quotation awaiting response, quotation expiring in 2 days, quotation expired
- Personal: task given to you, overdue task, enquiry assigned to you, site visit booked for you

**Documents:** stored per company (S3 in production, local disk in tests); every read gives a fresh 15-minute link (no permanent public links); `GET /documents/{id}` also returns `download_url`, a link that saves the file under its original name (12 Nov); each upload names its module and needs that module's right; allowed: PDF, JPG / PNG / WebP / HEIC photos, XLSX / XLS / CSV, DOCX, MP4 / MOV videos — extension and content must agree; 15 MB cap in the API (1 MB through the production proxy for now); another company's document is "not found"; a file is removed with its record; orphaned files counted (removed only when `DOCUMENT_CLEANUP_DELETE=true`).

**Employee page:** photo (HR can change / remove; initials otherwise); Employment history (joined, left with reason and who recorded it, rejoined and by whom).

**Sidebar and Settings menu:** only pages the person can open; empty sections hidden.

**Background worker** (second container `<name>-worker` in production):
- Overdue statuses (invoices, loans, project milestones) hourly, India date
- Books sync every 15 minutes per company, plus an immediate sync after each money save
- Orphaned-file count / clean-up
- A database lock per job; a heartbeat per job — Settings → System (Super Admin) shows last run / success / error and "Not running" when stale; `mahi-worker -once` runs jobs once

### APIs
- `/notifications` (list, count, acknowledge, acknowledge all, get), `/documents` (+ `/{id}`, `/{id}/file`), `/files/<key>?t=` (signed), `/employees/{id}/photo` (PUT / DELETE), `/system/jobs`, `/health/worker`

### Review status
**Plan step 4 (C), 0137:** project document placeholders from the address parts (see Settings → Configuration). Test: `hr/c_addresses.sh` C93–C94.
**Status:** reviewed 10 Nov 2026 (migration 0129) — see MODULE_REVIEW_PLAN.md "Module 17".

**Open:** WhatsApp / email alerts (later); who receives approval alerts → access matrix; malware scan.

---

## How we'll review each module

For each module, in order:
1. **Walk through it:** screens, what each button does, which records it creates.
2. **Agree the rules:** who may do what (per designation), what has to be true before an action, and what the books get.
3. **Gaps:** list them, then fix them with real-shaped test data.
4. **Test:** API suite plus browser checks at 1440 / 768 / 390, then commit to `main`.

**Proposed order:** 1 Platform → 2 Settings / masters → 3 People → 4 Attendance / leave → 5 Payroll → 6 Customers → 7 Enquiries → 8 Site visits / calendar → 9 Quotations → 10 Projects → 11 Warehouse → 12 Billing / finance parties → 13 Accounts → 14 Tasks → 15 Dashboard / analytics → 16 Audit → 17 Notifications / jobs.

## Related documents

| Document | About |
|---|---|
| [API_INVENTORY.md](./API_INVENTORY.md) | every endpoint with its permission |
| [MODULE_WALKTHROUGH_ROUND2.md](./MODULE_WALKTHROUGH_ROUND2.md) | round 2 walkthrough (13 Nov 2026): open points per module and the owner's decisions |
| [STOCK_BILLING_AND_UX_PLAN.md](./STOCK_BILLING_AND_UX_PLAN.md) | stock, billing, orders and sidebar plan: decisions, answers, as-built notes, section P (who bills the client) |
| [CUSTOMER_DATA_IMPORT_REPORT.md](./CUSTOMER_DATA_IMPORT_REPORT.md) | the enquiry, MSS and Arkshakti sheets compared with the app; import decisions |
| [MODULE_REVIEW_PLAN.md](./MODULE_REVIEW_PLAN.md) | round 1 module review: decisions and project types |
| [MULTI_COMPANY_IMPLEMENTATION_PLAN.md](../../docs/MULTI_COMPANY_IMPLEMENTATION_PLAN.md) | companies, isolation |
| [ACCOUNTS_LEDGER_DAYBOOK_IMPLEMENTATION_PLAN.md](../../docs/ACCOUNTS_LEDGER_DAYBOOK_IMPLEMENTATION_PLAN.md) | the books, P0–P9 |
| [HR_PAYROLL_AUDIT_AND_PLAN.md](../../docs/HR_PAYROLL_AUDIT_AND_PLAN.md) | people, attendance, payroll |
| [BUSINESS_OPERATIONS_TASKS_BY_DESIGNATION.md](../../docs/BUSINESS_OPERATIONS_TASKS_BY_DESIGNATION.md) | who does what |
| [DESIGNATION_PERMISSION_MATRIX.md](../../docs/DESIGNATION_PERMISSION_MATRIX.md) | rights per designation |
| [ACCESS_CONTROL_AND_TASKS_PLAN.md](../../docs/ACCESS_CONTROL_AND_TASKS_PLAN.md) | deferred access work |
| `docs/test-suites/README.md` | how to run the tests |
