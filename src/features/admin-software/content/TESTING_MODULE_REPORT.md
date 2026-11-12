# Module status and testing report

**Updated:** 13 Nov 2026
**What this is:** where each module stands today, and the main things to test by hand in each: an estimate of how complete it is, what's done, what's still pending, and how it's tested. Old Q&A logs are dropped; decisions live in [MODULE_WALKTHROUGH_ROUND2.md](./MODULE_WALKTHROUGH_ROUND2.md) and the plan files. The full feature list per module is in [OVERALL_PROJECT_STATUS.md](./OVERALL_PROJECT_STATUS.md).

## Testing by hand
- **App:** `http://localhost:5173` (local) or the live site.
- **Test data:** all business data was cleared on 12 Nov 2026, on production and locally. Logins, companies, settings, masters, the ledger list and employees remain. Start by creating a customer (address line 1 and state are required) and a project, then test with those.

## Overall
**About 80 % complete.** Every module is built, reviewed once and covered by automatic tests. What's left: the decisions now being built, the access matrix, the teams design, the sheet import and real data, and a few placeholders.

**Last full regression (12 Nov 2026, after the data clear):** 2,518 API checks passed and 1 failed. The failure is V10, which checks the AU letterhead bank account that the data clear removed. The five end-to-end accounts runs passed 194/194.

| # | Module | Done | Status |
|---|---|---|---|
| 1 | Platform: sign-in, companies, users, access | 90 % | Working; header search built 13 Nov; access by own / team / department pending |
| 2 | Settings and masters | 90 % | Working; round-2 decisions 2.1–2.4 built 13 Nov (team master rights, signature / stamp / terms / UPI QR on prints, vendorship switch only, template editor with preview); company logo fixed and shown in the sidebar |
| 3 | People: employees, teams | 75 % | Working; teams design and small HR gaps pending |
| 4 | Attendance and leave | 85 % | Working |
| 5 | Payroll and advances | 75 % | Working; incentive / commission and bank file pending |
| 6 | Customers | 90 % | Working; same mobile with a warning and family link added 13 Nov; sheet import pending |
| 7 | Enquiries | 85 % | Working; sheet import and the daily report pending |
| 8 | Site visits, fees, calendar | 75 % | Working; three known issues pending |
| 9 | Quotations | 90 % | Working |
| 10 | Projects | 75 % | Working; open questions on vendor-code billing; sheet import pending |
| 11 | Warehouse and procurement | 85 % | Working; one parked question, small gaps |
| 12 | Billing and finance parties | 85 % | Working; partner dues figures pending |
| 13 | Accounts (books) | 80 % | Working; CA confirmations and real opening balances pending |
| 14 | Tasks | 85 % | Working; teams view and access pending |
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
- **Pending:**
  - Access by own / team / department records.
  - The full access-matrix review.
- **Tests:** `u_platform` 19, `f_sidebar_prefs` 31, `m1_search` 35; screens `m1_ui` 69, `f_sidebar_ui` 215, `m1_search_ui` 38.
- **Test by hand, normal use:**
  - Sign in with a 10-digit phone, and with +91 in front; show / hide the password.
  - Sign out from the header; the back button doesn't reopen the app.
  - Settings → Security: change your password (old password needed); last sign-in and last change are shown.
  - Employees → ⋮ → Reset password: the temporary password shows once with Copy; the person must change it at sign-in and is signed out on their other devices.
  - Sidebar: search "salary" (→ Payroll), "gst", "stock" and the old word "materials"; ↑ ↓ Enter opens, Esc clears, "/" jumps to the search box.
  - Pins: pin 5 pages (order kept), a 6th asks which to replace; unpin; pins stay after sign-out and on another device.
  - ⓘ after the breadcrumb explains the page; on a phone it sits after the title.
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

### 2. Settings and masters (90 %)
- **Done:**
  - Company settings; master lists with "in use" protection (a value in use can only be deactivated).
  - Payment modes, bank ledgers, Approval limits (PO / SO / extra-quantity %), Number series (19 series).
  - Enquiry sources: "Social Media" renamed Meta Ads (same code), Data Calling and Maintenance & Sales Team added; a Banks list (14 banks); DISCOM JVVNL with 15 sub-division areas (built 13 Nov, migration 0152).
  - Each team edits its own master lists (13 Nov, decision 2.1, migration 0154): one right per master group (`masterdata_<group>`, create / edit / delete) in the designation access matrix; Accounts → finance, GST & tax and books lists; CA → GST & tax and books lists; HR → HR & team and employee data lists (new Leave Types list); Stores → stock lists; Sales manager → enquiry and quotation lists; Project admin → project lists; Super Admin and `masterdata` keep every group. The server checks the group of the item or category; the Masters page shows Add / Edit / Delete only on the person's groups and "View only" elsewhere.
  - Prints (decision 2.2): signature and stamp images (PNG / JPG ≤ 1 MB) in Settings → Company, printed as "For <legal name> / stamp + signature / Authorised Signatory" on sale bills (print + PDF), quotations, purchase orders, sale orders and delivery challans (text only without images); default invoice terms that fill a new sale bill (editable per bill, printed at the bottom); company UPI ID (name@bank) giving a "Scan to pay ₹X" QR on issued invoices for the amount due (hidden with no UPI ID or nothing due).
  - Vendorship is an on / off switch only (decision 2.3): the vendorship code number is gone from Settings → Company, the code companies (no DISCOM registration code) and the project screens ("Vendorship", "Our vendorship" / "Another firm's vendorship"); a request with a code number is refused, `null` is ignored; the columns `vendorship_code_number`, `partner_code_reference` and `discom_registration_code` are dropped.
  - Settings → Document templates (decision 2.4): formatted-text editor in a frame with the template's own CSS, "Insert field" buttons for the placeholders, live preview filled from a chosen project, raw HTML under "Advanced" for a Super Admin; the test leftovers "WCR PE" / "WCR address parts" are removed (switched off where a generated document uses them).
  - Company logo fix (owner bug): the logo box shows the stored logo through its signed link after a reload (the picked file shows only while uploading); "Remove logo"; the same for signature and stamp.
  - Sidebar logo: the active company's logo at the top of the sidebar and the phone menu (≈ 40 px, short name beside it), initials on the company colour without a logo; follows the company of the tab.
- **Pending:**
  - Leave Types are a list for now; leave requests still use paid / unpaid.
  - The rest of the access-matrix review.
- **Tests:** `v_settings` 28 / 29 (V10 needs rewriting), `h1a4_master_conversion` 39, `ns_number_series` 25, `ca_import_prep` 33 (CA01–CA08 are the masters), `m2_settings_round2` 46; screens `m2_round2_ui` 26 (1440).
- **Test by hand, normal use:**
  - Masters: add a value to a list (unit, category, payment mode …), edit it, deactivate it, reactivate it.
  - Use a value on a record, then try to delete it: refused ("in use" with counts); Deactivate works and the old record still shows the value.
  - An inactive value is hidden in pickers for new records but still shown on records that have it.
  - Payment modes: each points to a cash or bank ledger; a receipt with that mode lands in that ledger.
  - Settings → Company: logo, address, bank details printed on invoices.
  - Settings → Approval limits: change the PO limit, SO limit and extra-quantity % as Super Admin or Director; others see them read-only; the change shows in Activity.
  - Settings → Number series: change prefix, year part, digits and next number; the preview updates; create that document and check the number.
  - Masters as an HR person: HR & Team → Leave Types → Add item "Comp off"; open Stock & Tools: "View only", no Add / Edit / Delete. As an accountant: add a payment mode; as a stores manager: add a unit.
  - Settings → Company: upload a logo, reload the page — the logo is still there; the sidebar shows it at the top. Remove logo → the box and the sidebar go back to the icon / initials.
  - Upload a signature and a stamp; write default invoice terms; enter the UPI ID (e.g. mahisolar@okaxis); Save.
  - New sale bill: the terms are already filled; change them for this bill; issue; Print and PDF show the terms, "For <legal name>", stamp, signature, "Authorised Signatory" and a QR "Scan to pay ₹…" — scan it with a phone UPI app: payee, amount and bill number are filled.
  - Quotation preview / PDF, purchase order print, sale order print and delivery challan print show the same signature block.
  - Settings → Company → Vendorship: only the on / off switch; Finance → Vendorship Code Co. → add a company: no code number field; project edit drawer: "Under whose vendorship".
  - Settings → Document templates: pick Meter Test Application, click at the end of a paragraph, Insert field → customer.mobile, Save; choose a project → Preview: the document is filled; Generate the document on that project — it uses the new text.
  - Switch company in the header: the sidebar logo changes to that company's.
- **Test by hand, edge cases:**
  - Two values with the same name in one list: refused.
  - Number series: next number below the last one used is refused; two series with the same prefix (e.g. B2B and B2C) refused.
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

### 3. People: employees, teams (75 %)
- **Done:** employees with salary, bank details and address (current + permanent); teams per company; exit; employee pages.
- **Pending:**
  - The teams design: how teams link to projects, tasks and attendance.
  - The formula behind the profile month cards.
  - Exit history.
  - Who can see employee photos.
- **Tests:** `a_employees` 41; screens `people_ui` 60.
- **Test by hand, normal use:**
  - Add an employee: name, phone, designation, department, joining date, salary, bank details, current address, permanent address ("same as current" tick).
  - Edit an employee; the change shows in their history.
  - Upload a photo and documents.
  - Teams: create a team, add and remove members; the team shows on each member's page.
  - Employee in two companies: separate employee record and attendance in each.
  - Mark an employee as exited with a date; they drop out of pickers for new work but their past records stay.
- **Test by hand, edge cases:**
  - Same phone as another employee in the company: refused.
  - Salary 0: allowed only when "not on payroll".
  - Permanent address untick "same as current": both addresses required separately; PIN must be 6 digits.
  - Exited employee: can't be assigned new tasks, visits or attendance after the exit date.
  - Phone width: the employee page and its tabs work.

### 4. Attendance and leave (85 %)
- **Done:**
  - Daily attendance, half days, leave requests and approvals with an alert.
  - Leave balances, attendance locked after payroll, separate records per company.
- **Pending:** links to teams and projects (comes with the teams design).
- **Tests:** screens `attendance_ui` 63, plus the attendance checks inside the payroll suites.
- **Test by hand, normal use:**
  - Mark attendance for today: present, absent, half day, paid leave, half paid leave.
  - Mark for a whole team or many people at once.
  - Apply for leave as an employee (dates, type, reason); the approver gets an alert; approve; balance goes down.
  - Reject a leave with a reason; the employee sees it.
  - Attendance page: month view per person with totals.
- **Test by hand, edge cases:**
  - Leave longer than the balance: warning or refusal as set.
  - Overlapping leave requests: refused.
  - Attendance for a future date: refused.
  - After payroll for a month is approved, that month's attendance can't be changed; unlocking needs HR / Super Admin with a reason.
  - Sunday is a normal working day (not auto-off).
  - Someone without the approve right can't approve leave.

### 5. Payroll and advances (75 %)
- **Done:**
  - Build → review → approve → pay, payslip PDF, extra pay (OT / bonus / incentive).
  - Advances with a limit and a second approver; statutory deductions; payroll in the books.
- **Pending:**
  - Incentive / commission per converted project for sales staff.
  - The salary bank file, which needs an AU bank sample.
  - CA check of the FY 2026-27 statutory figures.
- **Tests:** `y_payroll` 38, `c2_payroll` 72; screens `payroll_ui` 75.
- **Test by hand, normal use:**
  - Build payroll for last month: everyone on payroll is listed with days, earnings, deductions, net.
  - Review → approve → pay; download a payslip PDF; the books get the salary entries.
  - Add extra pay (OT / bonus / incentive) to one person; it shows on their payslip.
  - Salary advance: request, approve, pay; it's deducted in the next payroll.
  - Payroll settings: components and statutory deductions.
- **Test by hand, edge cases:**
  - Advance above ₹10,000 needs a second approver.
  - Approver can't approve their own advance.
  - Building payroll for the current (unfinished) month: refused.
  - Approving payroll twice / paying twice (double click): only once.
  - Employee who joined or exited mid-month: pro-rated pay.
  - Person with no bank details: shown as a problem before paying.
  - Changing attendance after approval: blocked (see Attendance).

### 6. Customers (85 %)
- **Done:**
  - Customers with the address in parts (line 1 + state required) and GSTIN; payment terms with a Dues block.
  - Several projects per customer; Mark inactive; history.
  - The same mobile allowed after a warning ("This number already belongs to …") you confirm, with an optional family link shown on both customers; GSTIN stays unique (I1, built 13 Nov).
- **Pending:**
  - The import of old customers from the sheets.
- **Tests:** `z_customers` 25, `c_addresses` 51, `ca_import_prep` 33; screens `customers_ui` 71, `c_addresses_ui` 99, `ca_ui` 12.
- **Test by hand, normal use:**
  - Create a customer: name, phone, email, address (line 1, line 2, city, state, PIN), GSTIN, type, payment terms.
  - Edit the customer; rename it (the ledger name follows); the change shows in history.
  - Customer page: details, projects, enquiries, sales bills & payments, Dues block (open / overdue / due in 7 days).
  - Search the list by name, phone, city, PIN; filter by dues.
  - Mark inactive: hidden from pickers for new work; Mark active again.
  - Delete a customer with nothing linked; one with records only offers Mark inactive.
- **Test by hand, edge cases:**
  - No state or no line 1: refused (state is needed for GST).
  - PIN with 5 digits or starting with 0: refused.
  - GSTIN in the wrong format: refused; GSTIN of another state than the address: a note, not an error.
  - Same GSTIN as another customer: refused.
  - Same phone as another customer: a warning naming the other customer; "Save anyway" saves it (with "Link them as family"); "Go back" saves nothing.
  - Payment terms Net 15: a new bill gets a due date 15 days ahead; changing the terms later doesn't move old due dates.
  - Very long name / address: saved and printed without breaking the invoice layout.

### 7. Enquiries (85 %)
- **Done:**
  - Enquiries with source, owner, status, follow-ups, lost reason and reopen, change requests, conversion to a project.
  - A follow-up person on each follow-up (default the lead owner, changeable in the follow-up list); their alert, My day, task and calendar (E2, built 13 Nov).
  - Documents received: Pending / Partially / Yes + date + note on the enquiry, with a list filter (E3, built 13 Nov).
  - "Different sizes": panel, structure and inverter kW apart (e.g. 3 / 5 / 6); the panel kW is the system size; carried to the quotation and project (E4, built 13 Nov).
- **Pending:**
  - The import of the Sep–Nov enquiry tabs.
  - The daily enquiry report, planned with the analytics review.
- **Tests:** `f_enquiries` 26, `ca_import_prep` 33, `cb_project_fields` 63 (CB01–CB03 enquiry sizes); screens `enquiries_ui` 42, `ca_ui` 12, `cb_ui` 26 (CBU01–CBU05).
- **Test by hand, normal use:**
  - Create an enquiry: customer (new or existing), source, owner, kW, phase, budget, address, notes.
  - Quick-create a new customer from the enquiry form.
  - Add follow-ups with a date and note; the owner gets the reminder; it shows in My day and the calendar.
  - Change the owner; the new owner gets an "Enquiry assigned to you" alert.
  - Book a site visit from the enquiry.
  - Make a quotation from the enquiry.
  - Mark lost with a reason; reopen with a reason.
  - Convert to a project; the enquiry shows the project link.
  - List: search and filter by status, source, owner, date.
  - Tick "Different sizes" on a 3 kW enquiry, enter structure 5 and inverter 6; the enquiry page shows "3 kW panels · 5 kW structure · 6 kW inverter"; a quotation made from it starts with the same sizes.
- **Test by hand, edge cases:**
  - "Different sizes" ticked with the structure or inverter kW empty or 0: refused; unticking clears both.
  - Enquiry for a customer who already has an open enquiry: allowed, but check you see both.
  - Lost enquiry: its quotations stay cancelled when reopened.
  - Name change request at deal time (documents in another name): approve / reject once.
  - Follow-up date in the past: refused or warned.
  - kW 0 or negative, budget negative: refused.
  - Person with view-only rights: no edit, no status change.

### 8. Site visits, fees, calendar (75 %)
- **Done:** a visit as its own record (scheduled → travelled → completed / not completed / cancelled), visit fees and receipts, the calendar.
- **Pending:**
  - The timeline page makes too many server calls.
  - A follow-up shows twice in the calendar.
  - The visit cost is not booked in the accounts.
- **Tests:** `sv_sitevisits` 54; screens `sitevisits_ui` 33, `visit_fees_ui` 47.
- **Test by hand, normal use:**
  - Book a site visit: date, time, visitor, address, optional fee.
  - Mark travelled → completed with location and notes; or not completed with a reason.
  - Reschedule and cancel (with a reason).
  - Visit fee: record the receipt (who collected, where the money is); it shows on the customer's Visit fees tab.
  - Move a fee to the project (adjust against the contract).
  - Calendar: day / week / month views show visits and follow-ups.
- **Test by hand, edge cases:**
  - Completing a visit without location: refused.
  - Visit for a past date: allowed only as a record, or refused as set.
  - Fee receipt above the fee: refused.
  - Same visitor booked twice at the same time: warning.
  - Known: a follow-up can appear twice in the calendar; the timeline page loads slowly.

### 9. Quotations (90 %)
- **Done:**
  - Templates; versions (sending locks a version, a change makes a revision).
  - Subsidy options; expiry after 15 days; approval with the final amount, which becomes the project contract.
  - "Different sizes" on the version (from the enquiry, kept on revisions), shown on the print line (E4, built 13 Nov).
- **Pending:** nothing new.
- **Tests:** `qt_quotations` 40, `cb_project_fields` 63 (CB04–CB08); screens `quotations_ui`, `qf_form` 47, `cb_ui` 26 (CBU06–CBU07).
- **Test by hand, normal use:**
  - Create a quotation from a template: items, kW, price, subsidy (none / central / central + state), terms.
  - Preview and download the PDF; company details, customer address and "Stock Items" heading look right.
  - Send it: the version is locked; change → new revision → send again.
  - Approve with the final client amount (prefilled with the price before subsidy); it becomes the project contract.
  - Reject / cancel with a reason.
  - Tick "Different sizes" (3 kW panels, 5 structure, 6 inverter), save, preview: the size line reads "3 kW panels · 5 kW structure · 6 kW inverter"; the subsidy still follows the 3 kW.
- **Test by hand, edge cases:**
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
- **Pending:**
  - Whether a PO can be cancelled after goods came in (parked).
  - No item-code box on the Tools form.
  - Stores staff can't use Create PO (access matrix).
- **Tests:** `w_warehouse` 71, `b2_purchases` 74, `d1_purchase_orders` 71, `d2_sale_orders` 79, `e2_bill_units` 55, `e34_inline_items` 40, `a1a3_stock_rates` 42, `q11_codes_units` 23; screens `w_materials_ui`, `d1_po_ui` 84, `d2_so_ui` 78, `e34_inline_ui` 105, `e2_units_ui` 86.
- **Test by hand, normal use:**
  - Stock: add an item bought in coils (1 coil = 90 m), sold per metre; purchase and sale rate per coil; the form shows "= ₹ per metre"; stock details show both units, value, reserved and free.
  - Item code: give "DCC-4"; search it on a bill line.
  - Vendor: B2B (needs GSTIN), B2C (no GSTIN) or General; payment terms; address.
  - Purchase bill: lines from the search (add a missing item on the spot), any unit; save → approve → goods received (now or later, in parts); vendor due date from terms; pay the vendor.
  - Purchase order: create → submit → approve → send (PO number) → receive in parts in another unit → bill from the PO → closed.
  - Need-to-get → tick items → Create PO: one draft PO per vendor.
  - Sale order: create (B2B / B2C) → approve → confirm (SO number, stock reserved) → deliver (challan, print) → bill from the SO → completed; record an advance.
  - Damage & scrap, tools, templates.
- **Test by hand, edge cases:**
  - Conversion factor missing or 0: refused.
  - Changing a conversion when stock exists: needs the approve right and a reason; quantities are restated.
  - Same vendor bill number twice: refused.
  - Paying an unapproved bill: refused; paying more than due becomes the vendor's advance.
  - PO above the limit: maker can't approve (Super Admin can); receiving 2 % extra is free, 2.1 % needs approval and a reason; billing more than received refused.
  - Cancelling a PO after goods came in: refused, Close instead.
  - SO: delivering or billing more than ordered refused; only stores can deliver; cancel a challan before billing (stock back), after billing refused.
  - Double click on approve / receive / deliver: happens once.
  - Selling more than free stock: a warning.

### 12. Billing and finance parties (85 %)
- **Done:**
  - One sale document with B2B / B2C series; due dates from terms; credit notes; receipts.
  - Partners and agents with commission; place of supply from the site state on project bills.
  - Payment on a project's invoice asks "Money from": From client (cash) by default or From bank (loan); the project's bank / cash received and due follow (P4 gap, closed after chunk B).
- **Pending:**
  - Dues figures and a dues filter on the partner list.
  - The section P open questions.
- **Tests:** `bl_billing` 81, `bp_parties` 99, `e1_sale_document` 39, `a2_sales` 75, `b_terms` 89, `q12_gst_terms` 30, `cb_project_fields` CB57–CB60; screens `bl_invoices_ui` 52, `bp_parties_ui` 201, `b_terms_ui` 144, `cb_ui` CBU21–CBU23.
- **Test by hand, normal use:**
  - New sale bill: choose B2B (party must have a GSTIN) or B2C; lines from stock / services or typed; any unit; GST per line.
  - Issue it: number B2B/2026-27/0001 or B2C/2026-27/0001; print / PDF ("TAX INVOICE", B2B / B2C sale bill).
  - Due date from the customer's terms; overdue tag after the date.
  - Record a receipt (cash / bank / UPI); partial payment; the bill shows paid and due.
  - On a loan project's invoice, record ₹10,000 "From bank (loan)": the project's bank received goes up by 10,000 and bank due down; without a choice it counts as the client's cash.
  - Credit note against a bill: returns stock in the right unit and reduces what's due.
  - Bill to a partner; partner page shows terms, dues and both sides of the money.
  - Agents and commission approval.
- **Test by hand, edge cases:**
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
- **Pending:** a teams view (teams design); who can see or close others' tasks (access matrix).
- **Tests:** `tk` 61, `tx` 19.
- **Test by hand, normal use:**
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
- **Housekeeping:** regenerate Swagger; stop the old API copy on port 8090; rewrite test V10.

## How the automatic tests run
- **API suites:** `docs/test-suites/hr/*.sh`, run together by `regress.sh` against the local test database (`mahi_test`, API on :8080). Each suite creates its own data.
- **Screen suites:** `docs/test-suites/pw/*.mjs` (Playwright), at 1440 / 768 / 390 px.
- **Details:** see `docs/test-suites/README.md`.
