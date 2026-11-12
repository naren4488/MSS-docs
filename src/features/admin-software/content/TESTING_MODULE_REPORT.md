# Module status and testing report

**Updated:** 13 Nov 2026

**Required-field marks (13 Nov 2026, owner):** every create / edit form shows one red `*` (shared `Label required` / `RequiredMark`) on the fields it refuses to save without, decided from each form's own checks; conditional fields (e.g. loan tenure unless bullet, GSTIN for B2B vendors, TDS amount once a section is picked) show it only when needed. Checked: type check passes, no old-style stars left, browser — login (phone, password) and Add employee (full name, phone, salary, department, designation) marked, optional fields not; no page errors. To test by hand: open any Add / Edit form, leave a marked field empty and save — it is refused; leave an unmarked field empty — it saves.
**What this is:** where each module stands today, and the main things to test by hand in each: an estimate of how complete it is, what's done, what's still pending, and how it's tested. Old Q&A logs are dropped; decisions live in [MODULE_WALKTHROUGH_ROUND2.md](./MODULE_WALKTHROUGH_ROUND2.md) and the plan files. The full feature list per module is in [OVERALL_PROJECT_STATUS.md](./OVERALL_PROJECT_STATUS.md).

## Testing by hand
- **App:** `http://localhost:5173` (local) or the live site.
- **Test data:** all business data was cleared on 12 Nov 2026, on production and locally. Logins, companies, settings, masters, the ledger list and employees remain. Start by creating a customer (address line 1 and state are required) and a project, then test with those.

## Overall
**About 85 % complete** (the average of the 17 modules below). Every module is built, reviewed once and covered by automatic tests. What's left: the decisions now being built, the access matrix, the teams design, the sheet import and real data, and a few placeholders.

**Last full regression (13 Nov 2026, on the production copy):** 2,612 API checks passed and 0 failed; the five end-to-end accounts runs passed 194/194; `attendance_ui` 63/63 at 1440 / 768 / 390. The local test database is now an exact copy of production (MSS only, its 23 employees and users, no business data, no MSE, no QA designations or users). Every suite works in its own test company, makes its own QA designations and removes them, and adds nothing to MSS.

| # | Module | Done | Status |
|---|---|---|---|
| 1 | Platform: sign-in, companies, users, access | 90 % | Working; header search built 13 Nov; access by own / team / department pending; profile photos in the header and staff lists, and **My space** for every employee (13 Nov) |
| 2 | Settings and masters | 91 % | Working; duplicate master values merged and blocked (7.1, 13 Nov); round-2 decisions 2.1–2.4 built 13 Nov (team master rights, signature / stamp / terms / UPI QR on prints, vendorship switch only, template editor with preview); company logo fixed and shown in the sidebar; MSS logo from `Mahi2.svg` set on production and locally; up to 3 number series per document (12 Nov) |
| 3 | People: employees, teams | 85 % | Working; round-2 decisions 3.1–3.6 built 13 Nov (crews, crew week board, exit checklist and history, final settlement, PAN + emergency contact, back-dated salary with approval); month-card formula and photo access pending; Teams switched off (Coming soon) 12 Nov; employee documents keep one current file per type with previous versions, uploads max 1 MB for now (13 Nov) |
| 4 | Attendance and leave | 95 % | Working; round-2 decisions 4.1–4.8 all built or decided 13 Nov (crew attendance at the site, paid-leave carry-forward with a 6-day cap, worked on a company holiday); every employee sees their own attendance and leave and applies for leave in **My space** (13 Nov) |
| 5 | Payroll and advances | 82 % | Working; final settlement, salary arrears and holiday-work pay built 13 Nov; AU bank file sample and CA check pending; incentives and referrals earned when the project is fully paid, recovery on cancellation and HR share (5.1–5.8, 13 Nov); **My space**: own salary, payslips, advance requests and incentives (13 Nov) |
| 6 | Customers | 93 % | Working; same mobile with a warning and family link added 13 Nov; account statement PDF and Share on WhatsApp (6.3, 6.4) built 13 Nov; sheet import pending |
| 7 | Enquiries | 92 % | Working; round-2 decisions 7.1–7.4 and 7.6 built 13 Nov (4 main statuses, repeat-lead warning, lost reasons list, overdue follow-ups + manager alert); Meta leads (7.5), sheet import and the daily report pending |
| 8 | Site visits, fees, calendar | 85 % | Working; round-2 decisions 8.0 and 8.2 built 13 Nov (Timeline under 10 requests, follow-up once in the calendar, optional visit companions); visit cost (8.1) parked for the CA |
| 9 | Quotations | 91 % | Working; Share on WhatsApp with a 7-day secure PDF link built 13 Nov |
| 10 | Projects | 75 % | Working; open questions on vendor-code billing; sheet import pending |
| 11 | Warehouse and procurement | 85 % | Working; one parked question, small gaps |
| 12 | Billing and finance parties | 86 % | Working; Share on WhatsApp for sale bills (7-day secure PDF link) built 13 Nov; partner dues figures pending |
| 13 | Accounts (books) | 80 % | Working; CA confirmations and real opening balances pending |
| 14 | Tasks | 85 % | Built, **switched off 12 Nov** (Coming soon) until Teams and Tasks are designed together at the end; teams view and access pending |
| 15 | Dashboard and analytics | 70 % | Working; analytics review (daily enquiry report) pending |
| 16 | Audit and reports | 85 % | Working |
| 17 | Notifications, documents, background jobs | 70 % | Bell alerts working; WhatsApp / email not started |
| — | Across all modules | — | Access matrix, prod / dev database split, sheet import tool, real data load, AWS clean-up |

## Module by module

### 1. Platform: sign-in, companies, users, access (90 %)
- **Done:**
  - Phone + password sign-in; forced password change on first sign-in; admin password reset; 7-day idle sign-out.
  - Multi-company, with the company chosen per browser tab and the data kept apart per company.
  - Companies page, designations and departments, the designation access matrix.
  - Sidebar with an HR section, search, up to 5 pins, and a page ⓘ on every page.
  - Header search (13 Nov, decision 1.1): one box finds customers, enquiries, projects, quotations, sale bills, purchase bills, vendors and employees by name, phone, document number or K-number; grouped by type, 5 each with "see all"; only types the person may view; Ctrl+K / Cmd+K from anywhere; full-screen on phones.
  - The "More actions" header button and the two-step sign-in placeholder are removed (13 Nov, decisions 1.2 / 1.3).
  - Your profile photo in the header (13 Nov); on phones it opens a menu with Your profile, Dark / Light theme and Log out.
- **Pending:**
  - Access by own / team / department records.
  - The full access-matrix review.
- **Tests:** `u_platform` 19, `f_sidebar_prefs` 31, `m1_search` 35; screens `m1_ui` 69, `f_sidebar_ui` 215, `m1_search_ui` 38, `avatar_ui` 34.
- **Test by hand, normal use:**
  - Sign in with a 10-digit phone, and with +91 in front; show / hide the password.
  - Sign out from the header; the back button doesn't reopen the app.
  - Settings → Security: change your password (old password needed); last sign-in and last change are shown.
  - Employees → ⋮ → Reset password: the temporary password shows once with Copy; the person must change it at sign-in and is signed out on their other devices.
  - Sidebar: search "salary" (→ Payroll), "gst", "stock" and the old word "materials"; ↑ ↓ Enter opens, Esc clears, "/" jumps to the search box.
  - Pins: pin 5 pages (order kept), a 6th asks which to replace; unpin; pins stay after sign-out and on another device.
  - ⓘ after the breadcrumb explains the page; on a phone it sits after the title.
  - Settings → Profile: upload a photo; it shows in the header at once. On a phone, tap the photo: Your profile, Dark / Light theme and Log out all work.
  - Company switcher: search, switch, open a second tab in another company; each tab keeps its company; reload keeps it.
  - Settings → Companies: add a company (code, names, GSTIN, PAN, address with state, badge colour, books start); the GST state comes from the address; edit; switch Active off and on.
  - Add an existing person to a company (designation, on payroll here, track attendance here); they see the company in the switcher.
  - Departments and designations: add, edit, deactivate, delete an unused one.
  - Designation access matrix: switch off one right (e.g. Customers → create) for a designation; sign in as that person: the button / page is gone and the API refuses.
  - Header search: press Ctrl+K (Cmd+K on a Mac) on any page, or click the search field; type a customer's name: results come grouped (Customers, Enquiries, Projects, …) with the number on the right; ↑ / ↓ move, Enter opens, Esc closes.
  - Header search by phone: type the mobile as "+91 90240 84005", "919024084005" or just "84005": the customer, their enquiries, quotations, projects and bills appear.
  - Header search by number: a customer number (CUST-…), enquiry and quotation numbers, a project number (PROJ-…), a sale bill (B2B/2026-27/…, B2C/…), a purchase bill number or its PO (PO/…), and a project's K-number (also typed with spaces).
  - Header search "see all": with more than 5 matches of a type, "See all" opens that list with the search already filled in.
  - The header has no "More actions" button; Settings → Security shows only the password form, without a two-step sign-in block.
- **Test by hand, edge cases:**
  - Wrong password, unknown phone, 9 digits, letters: clear errors, no crash.
  - Temporary password: trying to open any page before changing it sends you back to Settings → Security.
  - New password same as the old one, or too short: refused.
  - Nobody can reset their own password; only a Super Admin can reset a Super Admin.
  - Session: leave the app idle (or change the clock) past 7 days → signed out; normal use keeps you signed in.
  - A person with no right to a page who types its URL: the Unauthorized page, not a blank screen.
  - Company not in your circle: not in the switcher, and its URL / data can't be reached.
  - GSTIN or PAN in the wrong format: refused with the field named.
  - Phone width (390 px): menu, pins, search and the company switcher all work.
  - Header search with 1 letter, 2 digits or only spaces: just the hint, no results; "%" or "_" find nothing rather than everything.
  - Header search as a person without the enquiries right (e.g. a site engineer): no Enquiries group even for an exact enquiry number; types they can view still appear.
  - Header search in company A never shows company B's customers, vendors, employees or projects, even with the same name, phone or K-number; switch the company and search again.
  - Header search on a phone (390 px): the search icon in the top bar opens a full-screen search; the close button returns to the page.
  - "/" still jumps to the sidebar search, and Ctrl+K still opens the header search while typing in the sidebar search.

### 2. Settings and masters (91 %)
- **Done:**
  - Duplicate master values (13 Nov, decision 7.1, migration 0160): per company and list, values whose names differ only by capitals or spaces are merged into the best-cased one ("Meta Ads" over "Meta ads"), else the oldest; every record using the duplicate is moved first, then the duplicate is deleted (or switched off if a record can't move) and logged. MSS: "Meta ads" merged into "Meta Ads" and 18 doubled DISCOM areas merged (same DISCOM only); BRD calling and AI chatbots kept. A new or renamed value equal to an existing one (ignoring capitals and spaces) is refused with the existing name; DISCOM areas are checked within their DISCOM.
  - Masters → Enquiry → Lost Reasons (7.4): Price too high, Not interested, Trust / thinks it's fraud, Roof not suitable, Loan not possible, Went to a competitor, Not reachable, Other.
  - Approval limits: "Late follow-up alert (sales)" in days (7.6, default 2, 1–30).
  - Company settings; master lists with "in use" protection (a value in use can only be deactivated).
  - Payment modes, bank ledgers, Approval limits (PO / SO / extra-quantity %), Number series (20 series; Purchase bills added 13 Nov, 11.1).
  - Number series: up to 3 series per document kind (12 Nov, owner; migration 0162) — name, own format and counter, one default pre-filled on create forms, the others pickable; bills / SO / PO keep the series picked on the draft until Issue / Confirm / Send. Tested: 25 API checks on a copy of the test database (add, rename, next number, default switch, 4th refused, used or default series kept, unused removed, picked vs default numbering, unknown series 422, PO numbered from the draft's series) and in the browser (add a series in Settings, pick it on a new customer → its prefix).
  - Enquiry sources: "Social Media" renamed Meta Ads (same code), Data Calling and Maintenance & Sales Team added; a Banks list (14 banks); DISCOM JVVNL with 15 sub-division areas (built 13 Nov, migration 0152).
  - Each team edits its own master lists (13 Nov, decision 2.1, migration 0154): one right per master group (`masterdata_<group>`, create / edit / delete) in the designation access matrix; Accounts → finance, GST & tax and books lists; CA → GST & tax and books lists; HR → HR & team and employee data lists (new Leave Types list); Stores → stock lists; Sales manager → enquiry and quotation lists; Project admin → project lists; Super Admin and `masterdata` keep every group. The server checks the group of the item or category; the Masters page shows Add / Edit / Delete only on the person's groups and "View only" elsewhere.
  - Prints (decision 2.2): signature and stamp images (PNG / JPG ≤ 1 MB) in Settings → Company, printed as "For <legal name> / stamp + signature / Authorised Signatory" on sale bills (print + PDF), quotations, purchase orders, sale orders and delivery challans (text only without images); default invoice terms that fill a new sale bill (editable per bill, printed at the bottom); company UPI ID (name@bank) giving a "Scan to pay ₹X" QR on issued invoices for the amount due (hidden with no UPI ID or nothing due).
  - Vendorship is an on / off switch only (decision 2.3): the vendorship code number is gone from Settings → Company, the code companies (no DISCOM registration code) and the project screens ("Vendorship", "Our vendorship" / "Another firm's vendorship"); a request with a code number is refused, `null` is ignored; the columns `vendorship_code_number`, `partner_code_reference` and `discom_registration_code` are dropped.
  - Settings → Document templates (decision 2.4): formatted-text editor in a frame with the template's own CSS, "Insert field" buttons for the placeholders, live preview filled from a chosen project, raw HTML under "Advanced" for a Super Admin; the test leftovers "WCR PE" / "WCR address parts" are removed (switched off where a generated document uses them).
  - Company logo fix (owner bug): the logo box shows the stored logo through its signed link after a reload (the picked file shows only while uploading); "Remove logo"; the same for signature and stamp.
  - Sidebar logo: the active company's logo at the top of the sidebar and the phone menu (≈ 40 px, short name beside it), initials on the company colour without a logo; follows the company of the tab.
  - MSS logo (12 Nov): `Mahi2.svg` from MSS-docs as a transparent PNG (SVG uploads are refused), uploaded and set as the MSS logo on production (S3) and on the local test database.
- **Pending:**
  - Leave Types are a list for now; leave requests still use paid / unpaid.
  - The rest of the access-matrix review.
- **Tests:** `v_settings` 29 (V10 on a test-company bank ledger), `h1a4_master_conversion` 39, `ns_number_series` 25 (N01 now 20 series), `ca_import_prep` 33 (CA01–CA08 are the masters), `m2_settings_round2` 46, `m7_enquiries_r2` M7-00–M7-10 (merge and duplicate block); screens `m2_round2_ui` 26 (1440).
- **Test by hand, normal use:**
  - Masters: add a value to a list (unit, category, payment mode …), edit it, deactivate it, reactivate it.
  - Use a value on a record, then try to delete it: refused ("in use" with counts); Deactivate works and the old record still shows the value.
  - An inactive value is hidden in pickers for new records but still shown on records that have it.
  - Payment modes: each points to a cash or bank ledger; a receipt with that mode lands in that ledger.
  - Settings → Company: logo, address, bank details printed on invoices.
  - MSS company: the logo is the new MSS mark (sun, solar-panel “MSS”, “MAHI SOLAR SOLUTION”) in the Settings box, the sidebar and on PDFs; it stays sharp and inside 40–48 px in the sidebar.
  - Settings → Approval limits: change the PO limit, SO limit and extra-quantity % as Super Admin or Director; others see them read-only; the change shows in Activity.
  - Settings → Number series → **+ Add series** on Sale bills – B2B (e.g. name AMC, prefix AMC): the preview shows AMC/2026-27/0001. New sale bill (B2B): the **Series** picker shows Main (default) and AMC; pick AMC, save the draft, issue → AMC/2026-27/0001; a second bill left on the default gets B2B/…. Make AMC the default: new forms pre-fill it. Try Remove on AMC: refused (used).
  - Settings → Number series: change prefix, year part, digits and next number; the preview updates; create that document and check the number.
  - Settings → Number series → Purchase bills (our number, PUR/2026-27/0001): change the prefix to MSPUR → the next purchase bill is MSPUR/2026-27/0001… (11.1).
  - Masters as an HR person: HR & Team → Leave Types → Add item "Comp off"; open Stock & Tools: "View only", no Add / Edit / Delete. As an accountant: add a payment mode; as a stores manager: add a unit.
  - Settings → Company: upload a logo, reload the page — the logo is still there; the sidebar shows it at the top. Remove logo → the box and the sidebar go back to the icon / initials.
  - Upload a signature and a stamp; write default invoice terms; enter the UPI ID (e.g. mahisolar@okaxis); Save.
  - New sale bill: the terms are already filled; change them for this bill; issue; Print and PDF show the terms, "For <legal name>", stamp, signature, "Authorised Signatory" and a QR "Scan to pay ₹…" — scan it with a phone UPI app: payee, amount and bill number are filled.
  - Quotation preview / PDF, purchase order print, sale order print and delivery challan print show the same signature block.
  - Settings → Company → Vendorship: only the on / off switch; Finance → Vendorship Code Co. → add a company: no code number field; project edit drawer: "Under whose vendorship".
  - Settings → Document templates: pick Meter Test Application, click at the end of a paragraph, Insert field → customer.mobile, Save; choose a project → Preview: the document is filled; Generate the document on that project — it uses the new text.
  - Switch company in the header: the sidebar logo changes to that company's.
  - Masters → Enquiry Sources: only one "Meta Ads"; BRD calling and AI chatbots are there; add "Justdial" — saved.
  - Masters → Enquiry → Lost Reasons: add "Subsidy delay"; it appears in Mark as lost.
- **Test by hand, edge cases:**
  - Two values with the same name in one list: refused — also "META ADS", " meta  ads " or renaming "BRD calling" to "ai chatbots"; renaming a value to a new casing of its own name ("BRD Calling") is fine; a same-named switched-off value says "switch it back on instead".
  - DISCOM areas: the same area name under two different DISCOMs is allowed.
  - Number series: next number below the last one used is refused; two series with the same prefix (e.g. B2B and B2C, or series 1 and 2 of one kind) refused; a 4th series refused; the default or a series that already gave numbers can't be removed.
  - Year part off: one running count; on: restarts every 1 April.
  - Shared series (customers, projects, enquiries …) can only be changed by a Super Admin.
  - A person without the settings right: masters and settings are read-only, edit buttons hidden, API refuses.
  - An HR person sending an API request to add a unit or switch off a payment mode: 403; a made-up category id: 403.
  - UPI ID with a space, without "@bank" or with two "@": refused on the page and by the API.
  - Signature or stamp over 1 MB, or a PDF / text file: refused; logo still takes WebP / HEIC up to 2 MB.
  - A fully paid bill, a draft or a void bill: no QR; no UPI ID: no QR; no images: "For … / Authorised Signatory" text only.
  - A bill created with the terms box emptied on purpose: no default terms.
  - Leave the Settings → Company page open over 15 minutes, then reload: the logo still shows (fresh link).
  - Template: a misspelt field like {{customer.nmae}} is named under the preview and left as typed; leaving the template unsaved asks before switching.
  - A person with project view only: Document templates opens read-only (no Save, no Advanced).
  - A company without a logo: initials on the badge colour; a logo of an odd shape stays inside 40–48 px.

### 3. People: employees, teams (85 %)
- **Done:**
  - **Employee documents** (13 Nov, owner): one current file per type, a new upload replaces it and the old one is kept as a previous version ("Other" keeps every file; deleting the current brings back the previous); every upload form says **Max 1 MB** and warns before sending a bigger file (production proxy limit; the cause of the "Network error" on a 2.2 MB PDF).
  - Employees with salary, bank details, address (current + permanent), **PAN** (format checked, unique per company, optional) and an **emergency contact** (name, relation, phone).
  - Teams are **installation crews**: a person can be in several teams; the leader is always a member; past memberships are kept.
  - A team assigned to a project's site work shows in **every member's My day and calendar**, following who is in the team on each day (someone added later gets it from that day; someone removed drops off from that day).
  - **Crew week board** on Employees (replaces the Site Deployment Board): rows per team and member, a column per day, the project in each cell (✓ when marked at the site), "2 sites" as a hint.
  - **Exit checklist** in the Mark as left dialog: advance outstanding, tools with them, open tasks and site visits, leave waiting, days without attendance, unpaid salary, crews they lead, final salary preview. It only blocks while an advance is outstanding and no recovery is chosen.
  - **Exit and rejoin history** on the employee page (joined / left / rejoined, date, reason, who did it), backfilled from the old records; rejoining asks for the date and reason.
  - **Back-dated salary changes** wait for a Director's (or Super Admin's) approval on the salary tab; future-dated changes work as before.
  - Crew pay is not project cost (nothing books it to a project).
  - Employee documents (12 Nov, owner bug): View and Download work on production (fresh S3 link opened in a tab; Download saves under the file's own name); each document type takes its own formats (Passport Photo: photo only; ID / bank / address / certificate copies: photo or PDF; letters, agreements, résumés, Other: also Word), checked in the form and on the server.
- **Pending:**
  - Teams page switched off (12 Nov, owner): People → Teams shows **Soon** and `/teams`, `/teams/:id` show Coming soon until Teams and Tasks are designed at the end.
  - The formula behind the profile month cards.
  - Who can see employee photos (access matrix).
  - "Stock with them": only tools are tracked per person; materials are not.
- **Tests:** `m3_teams_people` 73 (with Modules 4 and 5), `a_employees` 41/41 on the production copy (the suite makes its own QA designations and removes them), `w_people` 43; screens `m3_ui` 50 at 1440 / 390, `people_ui` 20 at 1440 (60 at three widths); `md_doc_versions` 12, screens `md_ui` 21.
- **Test by hand, normal use:**
  - Employee page → Documents → Upload: the file picker is off until a type is chosen; Passport Photo offers only JPG / PNG / WebP / HEIC and refuses a PDF; Aadhaar takes a PDF or a photo; Offer Letter also a Word file. Upload, then **View** opens the file in a new tab and **Download** saves it under its name — on the live site (S3).
  - Add an employee with PAN (lower case is fine, it's saved in capitals) and an emergency contact; they show on the profile.
  - Make two teams and put the same person in both; the team page says "also in …".
  - Assign a team to a project (project → Assigned team, with dates); each member sees "Site work — <project>" in My day and the days in their calendar.
  - Employees → Crew week board: the crew, its members and the project each day; previous / next week.
  - Mark as left: the checklist lists the advance, tasks, visits, leave and final salary; tick "Recover the advance from the final salary" and confirm; the history card shows Left with the reason.
  - Take them back with a date and reason; the history shows Rejoined. Payroll pays nothing for the days in between (follow-up, 13 Nov).
  - Change a salary from a past date: it says it waits for a Director; sign in as a Director and approve on the salary tab; the arrears per month are listed.
  - Employee → Documents: upload an Aadhaar, then upload Aadhaar again: the form says it replaces the first; the list shows one Aadhaar and "Show previous versions (1)".
- **Test by hand, edge cases:**
  - Pick a file over 1 MB on any upload form: a warning shows under the picker and the file isn't sent.
  - Same PAN on a second person in the company: refused; a wrong PAN (ABCD1234F): refused on the form.
  - A leader can't be removed from their team until another leader is set.
  - Add someone to a crew mid-assignment: earlier days stay off their calendar.
  - Someone at two sites on one day: the board shows both with "2 sites", never a block.
  - Leave with an advance outstanding and no recovery ticked: Confirm stays disabled (the API refuses too).
  - HR (not a Director) can ask for a back-dated change but not approve it; a second back-dated change while one waits is refused.
  - Phone width: the checklist dialog scrolls inside; the week board scrolls inside its card.
  - Rejoin date on or before the leaving date, or in the future: refused.

### 4. Attendance and leave (95 %)
- **Done:**
  - **My space → Attendance & leave** (`/my-space`, 13 Nov, owner request): every employee sees their own month, leave balance and leave requests, applies for leave (from tomorrow, reason required) and cancels a pending one, without attendance or employee rights; colleagues' records stay closed; HR and Directors keep the full pages.
  - Daily attendance, half days, leave requests and approvals with an alert.
  - Leave balances, attendance locked after payroll, separate records per company.
  - **Crew attendance at the site** (`/crew-attendance`, linked from My day for leaders and from Attendance): a team leader ticks crew members and marks present or half day, with a time and the phone's location; the project is optional (today's assigned sites are offered). Every mark is kept, several sites a day; the day itself is the normal attendance (present beats half day; **two half-day marks at two sites, or at two times, make a full present day**, 13 Nov) and feeds payroll as usual. HR / Super Admin may mark any crew.
  - **Paid-leave year end** (4.3, 13 Nov): unused paid leave on 31 Mar carries into April up to a cap (company setting, default **6 days**); the rest lapses. Each person gets a "carried" and a "lapsed" history entry with the reason ("Year end 31 Mar 2027: 8 unused, 6 carried into Apr 2027 (cap 6)"). The worker runs it in April for the year just ended; HR / Super Admin can run it on the Leave requests page ("Run year-end for 31 Mar <year>"), which also shows the cap, each person's unused / carried / lapsed days and the runs. Running it again changes nothing for people already done.
  - **Worked on a company holiday** (4.4 / 4.5, 13 Nov): on a holiday the board offers "Worked full day", "Worked half day" and "Not worked" per person (the day stays a paid holiday). A crew leader's present mark on a holiday is recorded as worked on holiday (half day → worked half a day). Refused on a normal day and for a future day.
- **Pending:**
  - Nothing from the round-2 decisions. The access matrix and the teams design are tracked across all modules.
- **Tests:** `ma_my_attendance` 22, screens `ma_ui` 32 (1440 / 768 / 390), `m4_leave_holiday` 34 (M4-00 to M4-44), screens `m4_ui` 17 (1440), `m3_teams_people` (M3-20 to M3-37), screens `m3_ui` (C01–C09 at 1440 / 390), `attendance_ui` 63, `leave_reason_ui` 14, plus the attendance checks inside the payroll suites.
- **Test by hand, normal use:**
  - Sign in as a Sales Executive (no attendance rights): the menu has My space; its Attendance & leave tab it shows your month, balance and requests; apply for a day of leave with a reason, then cancel it; Attendance and other people's profiles stay closed.
  - Mark attendance for today: present, absent, half day, paid leave, half paid leave.
  - Mark for a whole team or many people at once.
  - Apply for leave as an employee (dates, type, reason); the approver gets an alert; approve; balance goes down.
  - Apply leave without a reason: Submit stays off and says a reason is required (13 Nov).
  - Reject a leave with a reason; the employee sees it.
  - Attendance page: month view per person with totals.
  - As a crew leader on a phone: My day → Mark crew attendance; tick members, Present, the time, the project; allow location; each member shows "09:15 · Present · <project>". Mark one of them again at a second site as half day: they stay present, both marks are listed.
  - Leave requests page → Paid-leave year end: pick "31 Mar 2026", press Run: the table lists each person's unused, carried and lapsed days; someone with 8 unused shows 6 carried and 2 lapsed; their April balance opens at 6.
  - Attendance board on a company holiday: press "Worked full day" for one person and "Worked half day" for another; the rows say "+1 day's pay" and "no extra pay".
  - Crew attendance on a holiday: the page says the day is a holiday; marking present records "Worked on holiday".
- **Test by hand, edge cases:**
  - Leave longer than the balance: warning or refusal as set.
  - Overlapping leave requests: refused.
  - Attendance for a future date: refused (also for crew marks).
  - Crew mark without location, for someone outside the crew, or by someone who doesn't lead the team: refused (the person outside the crew is named).
  - A crew member on leave that day isn't marked by the leader (HR changes leave).
  - A leader can mark up to 7 days back; HR any day.
  - Half day at one site in the morning and half day at another after lunch: the day shows Present. A single half-day mark stays Half day; the same half-day mark sent twice (same site, same time) stays Half day.
  - After payroll for a month is paid, that month's attendance can't be changed by a leader; unlocking needs HR / Super Admin with a reason.
  - Sunday is a normal working day (not auto-off).
  - Someone without the approve right can't approve leave.
  - Run the year end twice: the second run says nothing changed. Change the cap to 4 and add someone not yet carried: they get 4, the others keep what they had.
  - Year end for a 31 Mar that hasn't come yet: refused. A negative cap: refused. Staff without attendance edit can't run it.
  - Someone with 3 unused: all 3 carried, no lapse entry.
  - "Worked on holiday" on a normal day or a future day: refused. "Not worked" puts the day back to a plain holiday.

### 5. Payroll and advances (82 %)
- **Done:**
  - **My space** (13 Nov, owner request): every employee sees their own salary for approved months with the payslip PDF, asks for / withdraws an advance and sees what is left to recover, sees their incentive rules, each converted or referred project's state and the lines on their salary, and their details, bank account (last 4 digits) and documents, and uploads their own KYC — without payroll, advance or employee rights; nobody else's records.
  - **Incentives and referrals when fully paid** (13 Nov, 5.1–5.8, migration 0158): earned in the month the project is fully paid (a bank loan included); the monthly minimum counts the month's conversions and the first fully paid fill it; a cancellation recounts and takes money back from the next salary (never more than that month's pay); HR can share a line with someone in the same payroll.
  - Build → review → approve → pay, payslip PDF, extra pay (OT / bonus / incentive), incentive / referral rules.
  - Advances with a limit and a second approver; statutory deductions; payroll in the books.
  - **Final settlement:** the leaving month's line pays the days up to the leaving date and recovers the advance up to the net pay; the rest stays a recoverable advance. The line is tagged "Final settlement" and the payslip says so.
  - **No pay between leaving and rejoining** (13 Nov): the leaving month pays up to the leaving date, a month wholly in the gap leaves the person off the run, and the rejoining month pays from the rejoining date.
  - **Holiday work pay** (4.4 / 4.5, 13 Nov): each full day worked on a company holiday adds one day's pay (monthly salary ÷ days in the month, the same rate as the month's pay) as its own line, "Holiday work – 02 Oct 2026 (Gandhi Jayanti)", on that month's salary and payslip. A half day adds nothing. Once the month is approved, a later holiday-work mark becomes a correction on the next payroll (the usual lock).
  - **Salary arrears:** when a Director approves a back-dated change, the difference for each month already approved or paid is added to the next payroll as "Salary arrears — <month> (paid ₹…, due ₹…)" lines; a lower salary becomes a correction instead.
- **Pending:**
  - The salary bank file, which needs an AU bank sample.
  - CA check of the FY 2026-27 statutory figures.
- **Tests:** `m4_leave_holiday` (M4-25 to M4-30), `m3_teams_people` (M3-70 to M3-91, M3-100 to M3-103), `y_payroll` 38, `c2_payroll` 72, `m5_incentives` 23, `ms_my_space` 26; screens `payroll_ui` 75, `m5_ui` 23, `ms_ui` 39 (1440 / 768 / 390).
- **Test by hand, normal use:**
  - Build payroll for last month: everyone on payroll is listed with days, earnings, deductions, net.
  - Review → approve → pay; download a payslip PDF; the books get the salary entries.
  - Someone left mid-month with an advance: their line says Final settlement, pays the days worked and recovers the advance.
  - After an approved back-dated raise, build the next month: the person's line shows the arrears lines per month.
  - Someone marked "Worked full day" on a holiday: that month's line shows "Holiday work – <date>" for one day's pay (₹31,000 in a 31-day month → ₹1,000) and the payslip prints it.
  - Salary advance: request, approve, pay; it's deducted in the next payroll.
  - Payroll settings: components and statutory deductions.
  - Sales incentive (rule: ₹2,000 after the first 3): convert 5 projects in one month, fully pay them one by one (one with a bank loan); the 4th and 5th to be fully paid show ₹2,000 in the month they became fully paid, the first 3 show ₹0 ("fills the monthly minimum").
  - Payroll → Adjust → Share an incentive line with another person: their salary gets the share, yours drops.
  - Sign in as a Sales Executive: My space → Salary shows approved months only, download a payslip; Advances: ask for ₹2,000 with a reason, withdraw it; Incentives: each converted project's state; Documents & details: your details, bank account (last 4 digits), upload your Aadhaar.
- **Test by hand, edge cases:**
  - A project paid only partly (or only the down payment of a loan project): no incentive yet.
  - Cancel a project whose incentive was already paid and approved: the next payroll shows a red "Incentive reversed" line; with a small salary only that month's pay is taken, the rest next month.
  - Advance bigger than the final salary: net ₹0, the rest stays outstanding on the advance.
  - Advance above ₹10,000 needs a second approver; nobody approves their own advance.
  - Recalculating the run doesn't add the arrears twice (nor the holiday-work line).
  - Half day worked on a holiday: no extra line.
  - Holiday work marked after the month is approved: the line isn't changed; one day's pay is added to the next payroll as a correction.
  - Left 10 Nov, rejoined 20 Jan: November pays 10 days, December has no line for them, January pays 12 of 31 days.
  - Building payroll for the current (unfinished) month: refused.
  - Approving payroll twice / paying twice (double click): only once.
  - Person with no bank details: shown as a problem before paying.

### 6. Customers (93 %)
- **Done:**
  - Customers with the address in parts (line 1 + state required) and GSTIN; payment terms with a Dues block.
  - Several projects per customer; Mark inactive; history.
  - The same mobile allowed after a warning ("This number already belongs to …") you confirm, with an optional family link shown on both customers; GSTIN stays unique (I1, built 13 Nov).
  - The quick-create of a customer inside Add enquiry, the project wizard and the quotation start shows the same warning with three choices: **Use that customer** (default: selects the existing customer and closes the quick-create), **Save anyway**, **Link them as family** (one shared handler, `useQuickCreateCustomer`).
  - **Account statement (6.3, built 13 Nov):** the Statement button on the customer page, a date range (default this financial year to today), Download PDF or Print. The PDF has the letterhead (logo, company details), the customer's name / address / GSTIN, the opening balance on the start date, each bill, receipt, advance and credit note in date order with debit, credit and running balance, the closing balance, the dues (overdue / due later) and ageing, and the UPI QR for the amount due when a UPI ID is set. The figures are the customer page's (closing = Outstanding) and agree with the customer's ledger in the books. `GET /customers/{id}/statement?from=&to=` (customer view right).
  - **Share on WhatsApp (6.4, built 13 Nov):** on the statement (and on sale bills and quotations): a short message (company, document number, amount, due date for bills) with a secure link to the PDF; the number and message can be edited, then WhatsApp opens (`wa.me/91…`); Copy link instead; no mobile on file → the number is asked for. The link works 7 days without signing in, can't be guessed or edited, and every open is logged; an expired link shows "This link has expired".
- **Pending:**
  - The import of old customers from the sheets.
- **Tests:** `z_customers` 25, `c_addresses` 51, `ca_import_prep` 33, `m6_statement_share` 36; screens `customers_ui` 71, `c_addresses_ui` 99, `ca_ui` 12, `m6_ui` 30 (1440 and 390).
- **Test by hand, normal use:**
  - Create a customer: name, phone, email, address (line 1, line 2, city, state, PIN), GSTIN, type, payment terms.
  - Edit the customer; rename it (the ledger name follows); the change shows in history.
  - Customer page: details, projects, enquiries, sales bills & payments, Dues block (open / overdue / due in 7 days).
  - Search the list by name, phone, city, PIN; filter by dues.
  - Mark inactive: hidden from pickers for new work; Mark active again.
  - Delete a customer with nothing linked; one with records only offers Mark inactive.
  - Statement: open a customer with a bill, a part payment and a credit note → Statement → Download PDF: logo and company on top, opening balance, the three lines with a running balance, closing = the page's Outstanding, dues and ageing, UPI QR. Print opens the PDF in a new tab.
  - Statement → Share on WhatsApp: the customer's mobile is filled in, the message has the balance and the link; Open WhatsApp; open the link on a phone without signing in.
- **Test by hand, edge cases:**
  - Statement for a period after the bill: the bill is in the opening balance, not a line; a period with nothing in it: "No bills, receipts or credit notes", opening = closing.
  - Statement end date before the start date: the buttons are disabled.
  - Customer who paid ahead: the closing balance shows "Cr" (advance) and there is no QR.
  - Customer with only a landline: Share asks for a 10-digit mobile before WhatsApp opens.
  - Open a share link after 7 days (or an edited link): a clear "link has expired" / "not valid" page, no PDF.
  - No state or no line 1: refused (state is needed for GST).
  - PIN with 5 digits or starting with 0: refused.
  - GSTIN in the wrong format: refused; GSTIN of another state than the address: a note, not an error.
  - Same GSTIN as another customer: refused.
  - Same phone as another customer: a warning naming the other customer; "Save anyway" saves it (with "Link them as family"); "Go back" saves nothing.
  - Same phone in the quick-create (Add enquiry, project wizard, quotation): "Use that customer" selects the existing one and saves nothing; "Save anyway" adds a second customer on the number and selects it.
  - Payment terms Net 15: a new bill gets a due date 15 days ahead; changing the terms later doesn't move old due dates.
  - Very long name / address: saved and printed without breaking the invoice layout.

### 7. Enquiries (92 %)
- **Done:**
  - Four main statuses (7.2, 13 Nov): New, In progress (follow-up, meetings, notes, quotation draft / sent), Converted, Lost (incl. cancelled) on the list, filters, counts and the enquiry page; the detailed stage (or the lost reason) is a small second line. API: `main_status` on rows, `?main_status=`.
  - Repeat lead (7.3): picking a customer in Add enquiry (also the quick create from a customer) checks the phone's last 10 digits: "Open enquiry ENQ-… with <owner> (<status>)" with Open / Add follow-up; converted and lost ones are listed as history; a new enquiry can still be created. API: `GET /enquiries/phone-matches`.
  - Lost reasons (7.4, migration 0160): Mark as lost needs a reason from Masters → Lost Reasons, plus an optional note; enquiries lost before keep their text as the note with no reason; "Lost by reason" counts and a lost reason filter on the list (`?lost_reason_id=`, `GET /enquiries/lost-reasons`).
  - Overdue follow-ups (7.6): an "Overdue follow-ups" button on Enquiries (with the count); a follow-up more than N days late (Settings → Approval limits, default 2) alerts once in the bell: the lead owner's team leader, else the Sales Managers, else the Directors (no reports-to link exists); a new missed date alerts again; the worker job `followup-escalation` runs hourly.
  - Enquiries with source, owner, status, follow-ups, lost reason and reopen, change requests, conversion to a project.
  - A follow-up person on each follow-up (default the lead owner, changeable in the follow-up list); their alert, My day, task and calendar (E2, built 13 Nov).
  - Documents received: Pending / Partially / Yes + date + note on the enquiry, with a list filter (E3, built 13 Nov).
  - "Different sizes": panel, structure and inverter kW apart (e.g. 3 / 5 / 6); the panel kW is the system size; carried to the quotation and project (E4, built 13 Nov).
  - Requested visit on a new enquiry (7.7, built 13 Nov, migration 0167): Add enquiry (also from a customer, agent, partner or quotation) asks for "Visit date (requested)" (today or later) and "Visit note" (up to 200 characters) instead of a follow-up date; Edit enquiry keeps the follow-up date. The list and the enquiry show "Visit requested 15 Nov · after 5 pm · not assigned"; a "Visits to assign" filter with its count (`?visit_request=to_assign`, `counts.visits_to_assign`). Assign visit on the enquiry (managers, see below) opens the booking form prefilled; booking marks the request assigned. A request on an enquiry that already has an open visit shows as covered; lost / converted / archived ones drop out. **Assign: managers only (owner, 13 Nov, migration 0168):** a new matrix right "Assign requested visits" (site_visit `assign`; Sales Manager, Director, Super Admin) is needed for Site visits → To assign, the Assign visit button, `POST /enquiries/{id}/visit-request/assign` and the "New visit to assign" alert; sales executives get none of it (403) but still book visits from their enquiries (the request then shows as covered).
  - Quick-create a customer with a mobile already in use: the I1 warning "This number already belongs to <name> (CUST-…)" with Use that customer (default, selects them), Save anyway, Link them as family (`enquiries_ui` E13 passes again).
- **Pending:**
  - The import of the Sep–Nov enquiry tabs.
  - The daily enquiry report, planned with the analytics review.
  - Meta Ads leads arriving automatically (7.5, later).
- **Tests:** `f_enquiries` 26, `ca_import_prep` 33, `cb_project_fields` 63 (CB01–CB03 enquiry sizes), `m7_enquiries_r2` 51, `m7_visit_request` 35 (7.7: to assign, past date and note-without-date refused, bell to managers only, Sales Manager assigns → visit + task + assigned, sales executive / plain booker 403 on To assign and assign, executive still books from the enquiry (request covered), filter, covered / closed, other company, 0167 and 0168 down/up; rerun 13 Nov: all pass); screens `enquiries_ui` 42 (all pass; E13 checks the same-mobile warning, Use that customer and Save anyway; rerun 13 Nov at 1440: 16/16), `ca_ui` 12, `cb_ui` 26 (CBU01–CBU05), `m7_ui` 34 (1440 and 390), `m7_visit_ui` 48 (7.7 at 1440 and 390: the form's visit fields and no follow-up date, list line and filter, To assign tab, Assign → booked, a viewer sees no To assign; at 1440 a sales executive sees no To assign / Assign visit, a Sales Manager sees both, the filter stays for both, the matrix shows "Assign requested visits"; 13 Nov: all pass).
- **Test by hand, normal use:**
  - Create an enquiry: customer (new or existing), source, owner, kW, phase, budget, address, notes.
  - Create an enquiry with Visit date = the day after tomorrow and Visit note "after 5 pm": the list shows "Visit requested <date> · after 5 pm · not assigned"; "Visits to assign" lists it; people who can book visits get "New visit to assign: <customer>, <date> (after 5 pm)" in the bell.
  - Open the enquiry → Assign visit: the booking form has the date, "Customer asked: after 5 pm" in the notes and as a hint under Time; pick the sales person, add 17:30 and save: the visit gets its SV number and task, the sales person gets the alert, the enquiry says "… · assigned".
  - Quick-create a new customer from the enquiry form; with a mobile already in use, the warning names that customer and "Use that customer" selects them.
  - Add follow-ups with a date and note; the owner gets the reminder; it shows in My day and the calendar.
  - Change the owner; the new owner gets an "Enquiry assigned to you" alert.
  - Book a site visit from the enquiry.
  - Make a quotation from the enquiry.
  - Mark lost with a reason; reopen with a reason.
  - Convert to a project; the enquiry shows the project link.
  - List: search and filter by status, source, owner, date.
  - List: the status column says New / In progress / Converted / Lost with a small grey line (Follow-up, Quotation sent, Price too high …); the status filter's In progress shows follow-ups and quotations sent.
  - Add enquiry for a customer who already has an open enquiry: the yellow warning with the ENQ number, owner and status; Open goes to it; Add follow-up opens its schedule form; Create still makes a second enquiry.
  - Mark as lost: pick "Trust / thinks it's fraud", type a note; the list shows Lost / Trust …; "Lost by reason" counts it; click the count to filter.
  - Press "Overdue follow-ups": only enquiries whose follow-up date has passed; press again to clear.
  - A follow-up 3 days late: the lead owner's team leader (or the Sales Manager) gets "Follow-up 3 days late: ENQ-…" in the bell, once.
  - Tick "Different sizes" on a 3 kW enquiry, enter structure 5 and inverter 6; the enquiry page shows "3 kW panels · 5 kW structure · 6 kW inverter"; a quotation made from it starts with the same sizes.
- **Test by hand, edge cases:**
  - Visit date yesterday: "The visit date can't be in the past" (the API refuses it too); a visit note without a date: refused; a note over 200 characters: refused.
  - No visit date: no request, no alert (the enquiry looks as before).
  - An enquiry with a request that already has an open visit: shows "a visit is already booked" (covered), no alert, not in To assign.
  - Mark an enquiry with a waiting request as lost: it leaves To assign and the bell.
  - The requested date has passed before anyone assigns it: still in To assign (in red); Assign prefills today.
  - "Different sizes" ticked with the structure or inverter kW empty or 0: refused; unticking clears both.
  - Enquiry for a customer who already has an open enquiry: allowed, but check you see both.
  - A phone stored as +91 98290 12345 and typed as 098290 12345: still matched (last 10 digits); fewer than 10 digits: no warning.
  - Mark as lost without a reason: "Pick why the enquiry was lost", nothing saved; reopening clears the reason and note.
  - Settings → Approval limits: 0 or 31 days refused; with 5 days a 4-day-late follow-up raises no alert.
  - Changing the follow-up date hides the old alert; the alert never repeats for the same date.
  - Lost enquiry: its quotations stay cancelled when reopened.
  - Name change request at deal time (documents in another name): approve / reject once.
  - Follow-up date in the past: refused or warned.
  - kW 0 or negative, budget negative: refused.
  - Person with view-only rights: no edit, no status change.

### 8. Site visits, fees, calendar (85 %)
- **Done:**
  - A visit as its own record (scheduled → travelled → completed / not completed / cancelled), visit fees and receipts, the calendar.
  - Optional companions (8.2, built 13 Nov): a visit keeps one required person (the task, Travelled / Complete); other active staff can be added at booking or on Edit site visit. Companions see the visit in their My day ("companion"), their calendar and Site visits → My visits (tagged Companion, no Update menu); the card says "With …". Without site-visit edit they can't act on it (403). One open visit per enquiry and cancel-and-rebook stay as they were.
  - Site visits → **To assign** (7.7, 13 Nov): visits asked for on new enquiries, earliest date first, with the note, address and lead owner (`GET /site-visit-requests`). Managers only (owner, 13 Nov, migration 0168): the tab, **Assign visit** (opens the enquiry's booking form prefilled, saves through `POST /enquiries/{id}/visit-request/assign`) and the bell alert "New visit to assign" need the "Assign requested visits" right (Sales Manager, Director, Super Admin); others don't see the tab and get 403.
  - A follow-up shows once in the calendar (8.0, 13 Nov): while the enquiry has an open follow-up task, only the task shows, whatever its date (moving the task or the follow-up used to show it twice).
  - Timeline (8.0, 13 Nov): one feed call (since the Module 10 review); a fresh load now makes 6–9 API requests (was 11; ~83 before the feed).
- **Pending:**
  - The visit cost / money staff spend is not booked in the accounts (8.1, parked for the CA).
  - Who may book / complete / see all visits: the access-matrix review at the end.
- **Tests:** `sv_sitevisits` 54, `m8_visits_r2` 34 (both rerun 13 Nov with 7.7 and again with assign = managers only: all pass), `m7_visit_request` 35 (To assign and assign, managers only); screens `sitevisits_ui` 33, `visit_fees_ui` 47, `m8_ui` 36 (1440 and 390), `m7_visit_ui` 48 (To assign tab and Assign → booked, 1440 and 390; executive vs Sales Manager at 1440).
- **Test by hand, normal use:**
  - Book a site visit: date, time, visitor, address, optional fee.
  - Site visits → To assign: a visit requested on a new enquiry is listed; Assign visit → pick the person, add a time, a fee and a companion → saved; it leaves To assign and shows under To do.
  - Book a site visit with two companions: the chips show in the form, the enquiry card says "With A, B"; each companion sees it in My day (if today), the calendar and Site visits → My visits.
  - Edit site visit: remove a companion; they no longer see it; add another, they do.
  - Mark travelled → completed with location and notes; or not completed with a reason.
  - Reschedule and cancel (with a reason).
  - Visit fee: record the receipt (who collected, where the money is); it shows on the customer's Visit fees tab.
  - Move a fee to the project (adjust against the contract).
  - Calendar: day / week / month views show visits and follow-ups.
  - Schedule a follow-up, then move its task to another day on the calendar: the calendar shows it once, on the new day.
  - Open Timeline: it loads in one go (one feed call).
- **Test by hand, edge cases:**
  - Someone with site-visit view but no booking right: sees To assign and the request on the enquiry, no Assign button; booking through the API is refused (403).
  - A companion (no site-visit edit) tries Travelled / Complete: not offered on Site visits; refused if tried another way.
  - The required person chosen again as a companion, or the same companion twice: dropped, not an error.
  - A companion made the required person on edit: they stop being a companion and get the task.
  - Someone who left, or an employee of another company, as a companion: refused.
  - Cancel a visit with companions: it leaves their calendars; booking again starts without companions.
  - Completing a visit without location: refused.
  - Visit for a past date: allowed only as a record, or refused as set.
  - Fee receipt above the fee: refused.
  - Same visitor booked twice at the same time: warning.
  - A follow-up task completed: the enquiry's follow-up date shows again (once).

### 9. Quotations (91 %)
- **Done:**
  - Templates; versions (sending locks a version, a change makes a revision).
  - Subsidy options; expiry after 15 days; approval with the final amount, which becomes the project contract.
  - "Different sizes" on the version (from the enquiry, kept on revisions), shown on the print line (E4, built 13 Nov).
  - Default bank details carry the branch: AU Small Finance Bank, Vaishali Nagar Jaipur (from IFSC AUBL0002206, 12 Nov).
  - Client section (13 Nov, owner; 0165): Edit customer in a side panel (changes show on the quotation at once); project site address in parts, pre-filled from the customer, editable, printed on the quotation; Reference explained as an internal note. Tested in the browser on a test-DB copy: prefill, edit customer from the quotation, change and save the site, reopen, preview prints the site; 390 px fits.
  - Document as in MSS-docs (13 Nov, owner; 0166): English / Hindi, kW packages, brand and phase pickers rewrite the stock lines, auto generation, EMI / warranty, notes and signature block, central ₹78,000 pre-filled, customer PAN optional. Tested in the browser on a test-DB copy: 5 kW package (10 × 550 Wp, 3PH, ₹2,85,000), Waaree / Tata pickers, generation 22 units/day ₹63,360, preview in English and Hindi with the price kept, saved settings and quantity text ("50 तक") reloaded; API: bad PAN refused (422), PAN stored in capitals, cleared, copied to a new quotation with the site address; no page errors. (Letterhead logo didn't show on the test copy only — its file isn't in the local test storage; on S3 it serves.)
  - Terms from MSS-docs (13 Nov, owner): 27 terms in English / Hindi by default; an old untouched default set on a draft is replaced, edited and sent ones kept (checked by a script); browser: "Use MSS-docs terms" on a draft, the preview shows Site Survey Confirmation, Non-Polycab Inverter Technical Support, Final Payment & Price Finality, Delayed Payment & Legal Recovery; no page errors.
  - **Share on WhatsApp with a secure PDF link (6.4, built 13 Nov):** opening Share stores the preview PDF and puts a 7-day link in the message ("View the quotation PDF: …"); Copy link; the link opens without signing in. `POST /quotations/{id}/share` (quotation view right).
- **Pending:** nothing new.
- **Tests:** `qt_quotations` 40, `cb_project_fields` 63 (CB04–CB08), `m6_statement_share` M6-32–M6-35; screens `quotations_ui`, `qf_form` 47, `cb_ui` 26 (CBU06–CBU07).
- **Test by hand, normal use:**
  - Quotation → Client Information: the site address shows the customer's address ("same as the customer"); Edit customer → change the email and address line 2 → Save: the quotation shows the new email and the site follows. Change the site to another village, Save Quotation, reopen: it stays; Preview prints the site; "Use customer address" puts the customer's back.
  - Quotation → Document: pick the 5 kW package → Apply: kW, panels, price and the stock table change; change the panel brand to Waaree and the AC cable: the table rewrites; switch to Hindi: the text and table are in Hindi; Generation shows units and savings without typing; Preview: cover, tagline, phone, email, sanction load, signature block. Customers → Edit → PAN "abcde1234f" saves as ABCDE1234F; a wrong PAN shows an error; a new quotation for that customer shows the PAN.
  - Quotation → Terms & Conditions: a new quotation has 27 terms; switch to Hindi: the terms are in Hindi; edit a term, then "Use MSS-docs terms" → confirm: the standard terms come back.
  - Create a quotation from a template: items, kW, price, subsidy (none / central / central + state), terms.
  - Preview and download the PDF; company details, customer address and "Stock Items" heading look right; the bank block shows branch Vaishali Nagar Jaipur.
  - Send it: the version is locked; change → new revision → send again.
  - Approve with the final client amount (prefilled with the price before subsidy); it becomes the project contract.
  - Reject / cancel with a reason.
  - Tick "Different sizes" (3 kW panels, 5 structure, 6 inverter), save, preview: the size line reads "3 kW panels · 5 kW structure · 6 kW inverter"; the subsidy still follows the 3 kW.
  - Share to Client: after "Preparing a secure PDF link…" the link shows with Copy link and is in the message; Share on WhatsApp opens WhatsApp with it; the link opens the same PDF on a phone.
- **Test by hand, edge cases:**
  - Share a quotation whose client has no mobile: WhatsApp asks for the number; the link can still be copied.
  - Revise a quotation with different sizes: the new version keeps them.
  - Editing a sent version directly: refused (make a revision).
  - Quotation 15 days after sending: expired, can't be approved.
  - Subsidy above the slab (central max ₹78,000; state ₹17,000 default): capped or refused.
  - Approving a quotation of a lost enquiry: refused.
  - Very many items: PDF pages break cleanly.

### 10. Projects (75 %)
- **Done:**
  - Four project types and rates.
  - Who bills the client by vendor code (section P), the partner's bill to MSS.
  - Progress steps (file login, bank file, work, DISCOM, payment, DCR, subsidy), the checklist, team, stock sent, GPS photo proof.
  - Change requests, completion rules.
  - Built 13 Nov (chunk B): different sizes; loan bank (Banks list) + branch; bank quotation (from the quotation, editable) and loan sanctioned beside the deal; From bank / From client cash expected, received, due (receipts marked bank or cash, loan tranches as bank, cash expected editable); "File issue" blockage with its reason and File: Clear / Some issue in the header; subsidy Applied → Disbursed (date, central, state) or Rejected (reason), not in the books; inverter app / login / password; list filters for bank, cash / bank due and waiting for subsidy.
  - Gaps closed after chunk B: one list of every open File Issue (project, customer, reason, who is fixing it, days open; Projects → File: Some issue, also `?file=issue`) with File: Some issue / Clear filters; the wizard's "Different sizes" tick, prefilled from the quotation or enquiry (panel kW = capacity); bank / cash on the Finance invoice payment form feeds the project's bank and cash due.
- **Pending:**
  - Open questions from section P: GST on the client amount, setting the partner's bill off against our charge, GSTIN for code firms, the per-watt vendorship fee, whether money owed to a partner blocks completion.
  - GST on partner / vendor-code / I&C charges.
  - The import of sites from the MSS and Arkshakti sheets.
- **Tests:** `pm_projects_money` 41, `pe_projects_exec` 68, `pt_project_types` 37, `p_vendor_code_billing` 44, `cb_project_fields` 63 (CB09–CB63); screens `pt_create_ui` 189, `pt_details_ui` 162, `p_vc_ui` 42, `cb_ui` 26 (CBU08–CBU26).
- **Test by hand, normal use:**
  - Wizard: create an Own (EPC) project from an approved quotation; check customer, kW, contract and site address.
  - Create a Partner, a Vendor code only and an I&C only project; the rate comes from the partner (else the default) and can be edited.
  - Vendor code used: ours / another firm; the bill form then picks the client, the firm or the partner as the billed party.
  - Progress: file login steps → bank file / cash → work items (with GPS photo proof) → DISCOM → payment → DCR → subsidy type; the status moves on by itself.
  - Team: assign our team or a subcontractor (Outsource).
  - Stock sent to site: stock goes down, the project cost goes up; return to the warehouse.
  - Money: receipts, loan tranches, partner bills and payouts, the Financials tab totals.
  - Change request for a contract change; approve it; the contract updates.
  - Complete the project; cancel another one with a reason.
  - Loan project (deal ₹1,90,000): pick the bank and branch, enter loan sanctioned ₹1,50,000; the card shows From bank 1,50,000 and From client cash 40,000; record ₹1,00,000 "from Bank (loan)" and ₹25,000 from the client: bank due 50,000, cash due 15,000.
  - Add a blockage "File Issue" → "Wrong K-number": the header reads File: Some issue; resolve it: File: Clear.
  - Projects → File: Some issue: the Open file issues list shows each issue with its reason, who is fixing it and days open; the project link opens it; once resolved it leaves the list.
  - Wizard from a quotation with sizes 3 / 5 / 6: the Commercials step has Different sizes ticked with 5 / 6; empty the inverter kW and Next is refused; the project saves 3 / 5 / 6 with capacity 3.
  - Subsidy Applied → the list's "Waiting for subsidy" shows it; Disbursed with date and amounts → it leaves that list. Save the inverter app, login ID and password and read them back.
- **Test by hand, edge cases:**
  - Loan above the deal (₹3,50,000 on ₹3,00,000): cash expected 0, never negative; a typed cash expected replaces deal − loan until cleared.
  - Subsidy Disbursed without a date or with a future date, Rejected without a reason: refused. A File Issue blockage without its reason: refused.
  - Partner project without a partner or rate: refused.
  - Contract change below what's already received or invoiced: refused.
  - Complete while money is still owed: refused unless a Director / Super Admin gives a reason.
  - Cancel after money was received: refused unless a Director / Super Admin gives a reason.
  - Work item without serial / GPS photo where required: can't be marked done.
  - Partner's bill to MSS above what MSS owes: refused.
  - Changing the vendor code or client amount after a bill exists: refused.
  - Stock sent to a closed project: not offered.

### 11. Warehouse and procurement (85 %)
- **Done:**
  - Stock (rates per purchase unit; any unit on bills with saved units; item codes; reserved and free stock).
  - Vendors (B2B / B2C / General, terms).
  - Purchase bills with approval and goods received; purchase orders (approval limit, 2 % extra, Create PO from Need-to-get, dashboard tiles).
  - Sale orders (reserve, deliver, challan print, advances, cancel challan); damage and scrap; tools.
  - Our own number on every purchase bill (13 Nov, decision 11.1, migration 0163): PUR/2026-27/0001 per company and financial year (of the bill date, else today), given when the bill is saved, drafts too; a cancelled or rejected bill keeps it and numbers are never reused. Existing bills were numbered in bill-date order. "Our no." column in the vendor's bill list, "Our number" on the bill, the "Our number series" picker on Add purchase bill (when a 2nd series exists); searchable in the list and the header search. The vendor's number stays the GST and duplicate-check reference.
  - Purchase bill print / PDF (13 Nov, owner): Print and PDF on the bill detail (for anyone who can view the bill); letterhead, "PURCHASE BILL", our number and the vendor's bill number, bill / entry / due dates, vendor address, GSTIN and category, lines with HSN and "= N <issue unit>", freight / other charges, CGST + SGST or IGST, round-off, total, goods received, approved by or "Waiting for approval", PO number, notes, "For <company> – Authorised Signatory".
- **Pending:**
  - Reverse-charge self-invoice (11.1a): parked until the owner asks the CA.
  - Whether a PO can be cancelled after goods came in (parked).
  - No item-code box on the Tools form.
  - Stores staff can't use Create PO (access matrix).
- **Tests:** `m11_purchase_no` 19 (print, PDF, 403 without the view right), `w_warehouse` 71, `b2_purchases` 74, `d1_purchase_orders` 71, `d2_sale_orders` 79, `e2_bill_units` 55, `e34_inline_items` 40, `a1a3_stock_rates` 42, `q11_codes_units` 23; screens `m11_ui` 8 (1440; Print opens with our number, PDF downloads), `w_materials_ui`, `d1_po_ui` 84, `d2_so_ui` 78, `e34_inline_ui` 105, `e2_units_ui` 86.
- **Test by hand, normal use:**
  - Stock: add an item bought in coils (1 coil = 90 m), sold per metre; purchase and sale rate per coil; the form shows "= ₹ per metre"; stock details show both units, value, reserved and free.
  - Item code: give "DCC-4"; search it on a bill line.
  - Vendor: B2B (needs GSTIN), B2C (no GSTIN) or General; payment terms; address.
  - Purchase bill: lines from the search (add a missing item on the spot), any unit; save → approve → goods received (now or later, in parts); vendor due date from terms; pay the vendor.
  - Purchase order: create → submit → approve → send (PO number) → receive in parts in another unit → bill from the PO → closed.
  - Need-to-get → tick items → Create PO: one draft PO per vendor.
  - Sale order: create (B2B / B2C) → approve → confirm (SO number, stock reserved) → deliver (challan, print) → bill from the SO → completed; record an advance.
  - Damage & scrap, tools, templates.
  - Our number: add a purchase bill → the toast and the list show PUR/2026-27/0001 in "Our no."; the next is 0002; open it → "Our number"; type "0002" in the list search or "PUR/2026-27/0002" in the header search → found.
  - Settings → Number series → Purchase bills → + Add series (e.g. SPUR) → Add purchase bill shows "Our number series"; pick SPUR → SPUR/2026-27/0001.
  - Print: open a purchase bill → Print → a new tab shows "PURCHASE BILL" with PUR/2026-27/0001 and the vendor's number, "Waiting for approval" until approved, then "Approved by"; PDF downloads PUR-2026-27-0001.pdf.
- **Test by hand, edge cases:**
  - Our number: a draft with no vendor number or date still gets a number (this year); cancel a bill → it keeps its number and the next bill does not reuse it; a bill dated in March counts in the previous year (PUR/2025-26/…); a second company starts at 0001 of its own.
  - Conversion factor missing or 0: refused.
  - Changing a conversion when stock exists: needs the approve right and a reason; quantities are restated.
  - Same vendor bill number twice (any capitals or spaces): refused, naming our number of the first bill; another vendor may use the same number.
  - Paying an unapproved bill: refused; paying more than due becomes the vendor's advance.
  - PO above the limit: maker can't approve (Super Admin can); receiving 2 % extra is free, 2.1 % needs approval and a reason; billing more than received refused.
  - Cancelling a PO after goods came in: refused, Close instead.
  - SO: delivering or billing more than ordered refused; only stores can deliver; cancel a challan before billing (stock back), after billing refused.
  - Double click on approve / receive / deliver: happens once.
  - Selling more than free stock: a warning.

### 12. Billing and finance parties (86 %)
- **Done:**
  - One sale document with B2B / B2C series; due dates from terms; credit notes; receipts.
  - Partners and agents with commission; place of supply from the site state on project bills.
  - Payment on a project's invoice asks "Money from": From client (cash) by default or From bank (loan); the project's bank / cash received and due follow (P4 gap, closed after chunk B).
- **Pending:**
  - Dues figures and a dues filter on the partner list.
  - The section P open questions.
- **Share on WhatsApp (6.4, built 13 Nov):** on an issued sale bill: message with the bill number, the amount (balance due after a part payment) and the due date, plus a 7-day secure PDF link; Copy link; drafts can't be shared. `POST /billing-documents/{id}/share` (billing view right); public `GET /api/v1/share/{token}`.
- **Tests:** `bl_billing` 81, `m6_statement_share` M6-17, M6-20–M6-27, M6-40–M6-41, `bp_parties` 99, `e1_sale_document` 39, `a2_sales` 75, `b_terms` 89, `q12_gst_terms` 30, `cb_project_fields` CB57–CB60; screens `bl_invoices_ui` 52, `m6_ui` W*-20–21, `bp_parties_ui` 201, `b_terms_ui` 144, `cb_ui` CBU21–CBU23.
- **Test by hand, normal use:**
  - New sale bill: choose B2B (party must have a GSTIN) or B2C; lines from stock / services or typed; any unit; GST per line.
  - Issue it: number B2B/2026-27/0001 or B2C/2026-27/0001; print / PDF ("TAX INVOICE", B2B / B2C sale bill).
  - Due date from the customer's terms; overdue tag after the date.
  - Record a receipt (cash / bank / UPI); partial payment; the bill shows paid and due.
  - On a loan project's invoice, record ₹10,000 "From bank (loan)": the project's bank received goes up by 10,000 and bank due down; without a choice it counts as the client's cash.
  - Credit note against a bill: returns stock in the right unit and reduces what's due.
  - Bill to a partner; partner page shows terms, dues and both sides of the money.
  - Agents and commission approval.
  - Issued bill → Share on WhatsApp: the number, balance due and due date are in the message; Open WhatsApp; Copy link; open the link signed out.
- **Test by hand, edge cases:**
  - A draft bill has no Share button; a person without the billing view right can't make a link.
  - Change one letter of a shared link: "This link is not valid".
  - B2B for a customer without a GSTIN: refused (also at issue if the GSTIN was removed from the draft).
  - B2C for a customer with a GSTIN: allowed, no GSTIN printed.
  - Due date later than the terms needs a reason; earlier doesn't.
  - Project bill: place of supply = site state; site in another state → IGST.
  - Inter-state B2C bill above ₹1,00,000: shows as B2C Large in GSTR-1.
  - Void a bill: it keeps its number; no number is reused; drafts have no number.
  - Receipt above the amount due: refused or kept as advance.
  - Two people issuing bills at the same moment: no duplicate numbers.

### 13. Accounts (books) (80 %)
- **Done:**
  - Tally-style ledgers and groups; vouchers; bank import; live stock-in-hand; a Cost of goods sold ledger.
  - GST (GSTR-1 / 3B with an Excel export for the CA); TDS; debit notes; fixed assets; closing stock.
- **Pending:**
  - CA to confirm: partner ledgers under Sundry Debtors, the FY 2026-27 tax figures, material sent to sites at cost.
  - Real opening balances as on 1 Apr 2026 and the Tally ledger list.
- **Tests:** `ac_books` 66, `gs_gst` 57, five e2e runs 194; screens `gs_gst_ui` 115.
- **Test by hand, normal use:**
  - Ledgers and groups: balances match bills, receipts and payments.
  - Voucher entry (payment / receipt / contra / journal) and its number.
  - Bank statement import: lines match to receipts and payments; unmatched lines stay for review.
  - Day book, trial balance, P&L, balance sheet.
  - GSTR-1 (B2B / B2C Large / B2C Small / credit notes / documents issued), GSTR-3B, Excel for the CA.
  - TDS, debit notes, fixed assets and depreciation; closing stock from the warehouse.
- **Test by hand, edge cases:**
  - Voucher that doesn't balance: refused.
  - Editing a reversed entry: refused.
  - Entry in a locked period: refused.
  - Bank line matched twice: refused.
  - Deactivating a ledger with entries: allowed but history unchanged.

### 14. Tasks (85 %)
- **Done:** tasks with assignee, due date, reopen with a reason, automation rules, My day.
- **Switched off (12 Nov, owner):** Pipeline → Tasks, Settings → Task templates / Task automations and the employee **Tasks** tab show Coming soon; the code stays for the end.
- **Pending:** a teams view (teams design); who can see or close others' tasks (access matrix); switching the module back on.
- **Tests:** `tk` 61, `tx` 19.
- **Test by hand, normal use:**
  - While switched off: Pipeline → Tasks (greyed, **Soon**), `/tasks`, Settings → Task templates / Task automations and an employee's **Tasks · Soon** tab all show Coming soon, at 1440 and 390 px.
  - Create a task: title, assignee, due date, priority; it shows in their My day.
  - Assignee marks it done; it moves to done.
  - Reopen a done task (Director, admin or the assignee) with a reason.
  - Automation rules: an event (e.g. new enquiry, visit completed) creates a task.
  - Task list filters: mine, team, overdue.
- **Test by hand, edge cases:**
  - Task due in the past: shows as overdue.
  - Reopen without a reason: refused; someone else trying to reopen: refused.
  - Assigning to an exited employee: not offered.

### 15. Dashboard and analytics (70 %)
- **Done:** a dashboard with tiles by rights (Sales, Money received, Stock, PO tiles); one Analytics page.
- **Pending:** an analytics review, including the daily enquiry report by source (leads, interested, visits, conversions).
- **Tests:** `db_dashboard_be` 64, `dx` 35.
- **13 Nov (Module 7):** enquiry counts use the four main statuses (New = new only); the dashboard's "Follow-ups overdue" tile opens the same list as the new Overdue follow-ups button.
- **Test by hand, normal use:**
  - Dashboard: tiles change with the person's rights (Sales, Money received, Stock, PO tiles); each tile opens its filtered list.
  - My day: tasks, follow-ups and visits for today.
  - Analytics page: figures match the lists (enquiries, projects, receipts) for the same dates.
- **Test by hand, edge cases:**
  - A person with few rights sees only their tiles.
  - Empty company (no data): tiles show 0, no errors.

### 16. Audit and reports (85 %)
- **Done:** the Activity page over every history, a trimmed Audit menu, tools as fixed assets in the books.
- **Pending:** nothing specific; access-matrix rights only.
- **Tests:** `au_audit` 53.
- **Test by hand, normal use:**
  - Activity: edit a customer, a bill and a project; each change shows who, when and what changed.
  - Filters by date, person and record type.
- **Test by hand, edge cases:**
  - A person without the audit right can't open Activity.

### 17. Notifications, documents, background jobs (70 %)
- **Done:** bell alerts, documents and templates, a background worker (second container).
- **Pending:**
  - WhatsApp and email alerts, which need a WhatsApp Business number and email setup.
  - Clean-up of orphaned S3 files after the data clear.
- **Tests:** `nt_notify` 52; screens `nt_ui` 68.
- **Test by hand, normal use:**
  - Bell: leave request, task assigned, enquiry assigned, PO waiting for approval each create an alert; clicking opens the record; mark read.
  - Documents: upload to a project, open and download; generate a document from a template as PDF.
- **Test by hand, edge cases:**
  - Alert for a record the person can no longer see: opens Unauthorized, not an error.
  - Large upload or a wrong file type: a clear message.

## Across all modules (not counted in the module %)
- **Access matrix:** who can see and do what, in every module. The questions logged so far wait here.
- **Separate production and development databases:** before real data goes in.
- **Sheet import tool:** enquiries, MSS and Arkshakti sites, tab by tab with a preview. See [CUSTOMER_DATA_IMPORT_REPORT.md](./CUSTOMER_DATA_IMPORT_REPORT.md).
- **Real data load:** the Tally ledger list, opening balances, bank statements.
- **Upload limit on production:** the web proxy (nginx) in front of the API refuses requests over 1 MB, so every upload form says and enforces **max 1 MB** for now. Owner to set `client_max_body_size 16m;` for `api.mahisolarsolution.com` and reload nginx; then the app's limit goes to 15 MB (`VITE_MAX_UPLOAD_MB=15`).
- **Housekeeping:** regenerate Swagger. (The old API copy on port 8090 is stopped.)

## How the automatic tests run
- **API suites:** `docs/test-suites/hr/*.sh`, run together by `regress.sh` against the local test database (`mahi_test`, API on :8080). Each suite creates its own data.
- **Screen suites:** `docs/test-suites/pw/*.mjs` (Playwright), at 1440 / 768 / 390 px.
- **Details:** see `docs/test-suites/README.md`.
