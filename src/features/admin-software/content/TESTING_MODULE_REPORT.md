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
| 1 | Platform: sign-in, companies, users, access | 85 % | Working; placeholders and access by own / team / department pending |
| 2 | Settings and masters | 85 % | Working; new master values in build |
| 3 | People: employees, teams | 75 % | Working; teams design and small HR gaps pending |
| 4 | Attendance and leave | 85 % | Working |
| 5 | Payroll and advances | 75 % | Working; incentive / commission and bank file pending |
| 6 | Customers | 85 % | Working; same mobile with a warning in build |
| 7 | Enquiries | 80 % | Working; follow-up person, documents status and different sizes in build |
| 8 | Site visits, fees, calendar | 75 % | Working; three known issues pending |
| 9 | Quotations | 85 % | Working; different sizes in build |
| 10 | Projects | 70 % | Working; loan / cash / subsidy fields in build; open questions on vendor-code billing |
| 11 | Warehouse and procurement | 85 % | Working; one parked question, small gaps |
| 12 | Billing and finance parties | 85 % | Working; partner dues figures pending |
| 13 | Accounts (books) | 80 % | Working; CA confirmations and real opening balances pending |
| 14 | Tasks | 85 % | Working; teams view and access pending |
| 15 | Dashboard and analytics | 70 % | Working; analytics review (daily enquiry report) pending |
| 16 | Audit and reports | 85 % | Working |
| 17 | Notifications, documents, background jobs | 70 % | Bell alerts working; WhatsApp / email not started |
| — | Across all modules | — | Access matrix, prod / dev database split, sheet import tool, real data load, AWS clean-up |

## Module by module

### 1. Platform: sign-in, companies, users, access (85 %)
- **Done:**
  - Phone + password sign-in; forced password change on first sign-in; admin password reset; 7-day idle sign-out.
  - Multi-company, with the company chosen per browser tab and the data kept apart per company.
  - Companies page, designations and departments, the designation access matrix.
  - Sidebar with an HR section, search, up to 5 pins, and a page ⓘ on every page.
- **Pending:**
  - The header search and the "More actions" button are placeholders.
  - Two-factor sign-in is a placeholder.
  - Access by own / team / department records.
  - The full access-matrix review.
- **Tests:** `u_platform` 19, `f_sidebar_prefs` 28; screens `m1_ui` 69, `f_sidebar_ui` 215.
- **Test by hand:**
  - Sign in with your phone, with and without +91; a wrong password shows an error.
  - Employees → ⋮ → Reset password: the temporary password is shown once; at sign-in the person must change it.
  - Sidebar: search "salary" (→ Payroll) and "gst"; pin 5 pages, a 6th asks which to replace; click ⓘ next to a page title.
  - Header company switcher: open two browser tabs in two companies; each keeps its own data.
  - Settings → Companies: add a company with an address; its state becomes the GST state (e.g. Rajasthan (08)); add an existing person to it.
  - Settings → Designation access matrix: remove one right from a designation, sign in as that person, and the page or button is gone.

### 2. Settings and masters (85 %)
- **Done:**
  - Company settings; master lists with "in use" protection (a value in use can only be deactivated).
  - Payment modes, bank ledgers, Approval limits (PO / SO / extra-quantity %), Number series (19 series).
- **Pending:**
  - **In build:** sources Meta Ads, Data Calling and Maintenance & Sales Team; the banks list; JVVNL DISCOM areas.
  - Who may edit which masters (access matrix).
- **Tests:** `v_settings` 28 / 29 (V10 needs rewriting), `h1a4_master_conversion` 39, `ns_number_series` 25.
- **Test by hand:**
  - Masters: add a value, use it on a record, then try to delete it: refused ("in use"), Deactivate works; the old record still shows the value.
  - Settings → Approval limits: change the PO limit as Super Admin; a normal user sees it read-only.
  - Settings → Number series: change a prefix and the next number, create that document, check the number; a next number below the last used is refused.
  - Payment modes: each points to a cash or bank ledger; a receipt with that mode lands in that ledger.

### 3. People: employees, teams (75 %)
- **Done:** employees with salary, bank details and address (current + permanent); teams per company; exit; employee pages.
- **Pending:**
  - The teams design: how teams link to projects, tasks and attendance.
  - The formula behind the profile month cards.
  - Exit history.
  - Who can see employee photos.
- **Tests:** `a_employees` 41; screens `people_ui` 60.
- **Test by hand:**
  - Add an employee with a current and a permanent address ("same as current" tick), salary and bank details.
  - Teams: create a team and add members; the team shows on the employee page.
  - Mark an employee as exited; they no longer appear for new work.

### 4. Attendance and leave (85 %)
- **Done:**
  - Daily attendance, half days, leave requests and approvals with an alert.
  - Leave balances, attendance locked after payroll, separate records per company.
- **Pending:** links to teams and projects (comes with the teams design).
- **Tests:** screens `attendance_ui` 63, plus the attendance checks inside the payroll suites.
- **Test by hand:**
  - Mark attendance for a day, including a half day.
  - Apply for leave as an employee; the approver gets an alert; approve it; the balance goes down.
  - After payroll is approved for a month, that month's attendance is locked; unlocking needs a reason.

### 5. Payroll and advances (75 %)
- **Done:**
  - Build → review → approve → pay, payslip PDF, extra pay (OT / bonus / incentive).
  - Advances with a limit and a second approver; statutory deductions; payroll in the books.
- **Pending:**
  - Incentive / commission per converted project for sales staff.
  - The salary bank file, which needs an AU bank sample.
  - CA check of the FY 2026-27 statutory figures.
- **Tests:** `y_payroll` 38, `c2_payroll` 72; screens `payroll_ui` 75.
- **Test by hand:**
  - Payroll: build last month → review → approve → pay; download a payslip PDF.
  - Salary advance above ₹10,000 needs a second approver; it is deducted in the next payroll.
  - Extra pay (OT / bonus / incentive) shows on the payslip.
  - Accounts → ledgers show the salary entries after payment.

### 6. Customers (85 %)
- **Done:**
  - Customers with the address in parts (line 1 + state required) and GSTIN; payment terms with a Dues block.
  - Several projects per customer; Mark inactive; history.
- **Pending:**
  - **In build:** the same mobile allowed with a warning and a family link.
  - The import of old customers from the sheets.
- **Tests:** `z_customers` 25, `c_addresses` 51; screens `customers_ui` 71, `c_addresses_ui` 99.
- **Test by hand:**
  - New customer without a state: refused; with line 1 + state: saved.
  - GSTIN from another state than the address: a note (not an error).
  - Payment terms "Net 15": a new sale bill for this customer gets a due date 15 days ahead.
  - Same mobile as another customer: refused today (after chunk A: a warning you confirm, plus a family link).
  - Mark inactive: the customer disappears from pickers for new work and can be made active again.

### 7. Enquiries (80 %)
- **Done:** enquiries with source, owner, status, follow-ups, lost reason and reopen, change requests, conversion to a project.
- **Pending:**
  - **In build:** a follow-up person on each follow-up; documents received (Yes / Partially / Pending + date); different panel / structure / inverter sizes.
  - The import of the Sep–Nov enquiry tabs.
  - The daily enquiry report, planned with the analytics review.
- **Tests:** `f_enquiries` 26; screens `enquiries_ui` 42.
- **Test by hand:**
  - Create an enquiry with a source, owner, kW and budget.
  - Add a follow-up with a date: the owner gets the reminder and it shows in My day / calendar.
  - Mark lost with a reason, then reopen it (a reason is required).
  - Convert: a project is created with the customer, kW and amount.

### 8. Site visits, fees, calendar (75 %)
- **Done:** a visit as its own record (scheduled → travelled → completed / not completed / cancelled), visit fees and receipts, the calendar.
- **Pending:**
  - The timeline page makes too many server calls.
  - A follow-up shows twice in the calendar.
  - The visit cost is not booked in the accounts.
- **Tests:** `sv_sitevisits` 54; screens `sitevisits_ui` 33, `visit_fees_ui` 47.
- **Test by hand:**
  - Book a site visit with a fee → mark travelled → completed (with location); record the fee receipt.
  - The calendar shows the visit; reschedule and cancel work and keep their reason.
  - A follow-up appears once in the calendar (known issue: it can show twice).

### 9. Quotations (85 %)
- **Done:**
  - Templates; versions (sending locks a version, a change makes a revision).
  - Subsidy options; expiry after 15 days; approval with the final amount, which becomes the project contract.
- **Pending:** **in build:** different panel / structure / inverter sizes.
- **Tests:** `qt_quotations` 40; screens `quotations_ui`, `qf_form` 47.
- **Test by hand:**
  - Create a quotation from a template; choose the subsidy (none / central / central + state).
  - Send it: the version locks; change it → a new revision to send again.
  - A sent quotation expires after 15 days and can't be approved after that.
  - Approve with the final client amount: it becomes the project contract value.

### 10. Projects (70 %)
- **Done:**
  - Four project types and rates.
  - Who bills the client by vendor code (section P), the partner's bill to MSS.
  - Progress steps (file login, bank file, work, DISCOM, payment, DCR, subsidy), the checklist, team, stock sent, GPS photo proof.
  - Change requests, completion rules.
- **Pending:**
  - **Next chunk:** loan bank + branch; bank quotation and loan sanctioned; bank due vs cash due; "File issue" blockage; subsidy disbursed / rejected; inverter login.
  - Open questions from section P: GST on the client amount, setting the partner's bill off against our charge, GSTIN for code firms, the per-watt vendorship fee, whether money owed to a partner blocks completion.
  - GST on partner / vendor-code / I&C charges.
  - The import of sites from the MSS and Arkshakti sheets.
- **Tests:** `pm_projects_money` 41, `pe_projects_exec` 68, `pt_project_types` 37, `p_vendor_code_billing` 44; screens `pt_create_ui` 189, `pt_details_ui` 162, `p_vc_ui` 42.
- **Test by hand:**
  - Create one project of each type: Own, Partner, Vendor code only, I&C only; check the rate fills in.
  - Vendor code used: ours vs another firm; the bill form picks the right billed party (client / firm / partner).
  - Progress steps: file login → bank file → work → DISCOM → payment; the status moves on by itself.
  - Send stock to the site: stock goes down and the project cost goes up.
  - Contract change only through a change request; completing with money still owed is refused unless a Director gives a reason.

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
- **Test by hand:**
  - Stock item bought in coils of 90 m, sale rate per coil: the form shows the per-metre rate; stock details show both units.
  - Purchase bill in coils → approve → goods received: stock rises in metres; the vendor's due date comes from their terms.
  - PO above ₹50,000: the maker can't approve it (Super Admin can); receive 2 % extra without approval; above that needs approval.
  - Need-to-get → Create PO: one draft PO per vendor.
  - Sale order: confirm reserves stock (free stock goes down); deliver part → challan print; cancel the challan → stock comes back.

### 12. Billing and finance parties (85 %)
- **Done:**
  - One sale document with B2B / B2C series; due dates from terms; credit notes; receipts.
  - Partners and agents with commission; place of supply from the site state on project bills.
- **Pending:**
  - Dues figures and a dues filter on the partner list.
  - The section P open questions.
- **Tests:** `bl_billing` 81, `bp_parties` 99, `e1_sale_document` 39, `a2_sales` 75, `b_terms` 89, `q12_gst_terms` 30; screens `bl_invoices_ui` 52, `bp_parties_ui` 201, `b_terms_ui` 144.
- **Test by hand:**
  - New sale bill: choose B2B (customer must have a GSTIN) or B2C; issue it → number B2B/2026-27/0001 or B2C/…
  - Due date comes from the customer's terms; an earlier date needs no reason, a later one does.
  - Record a receipt; the bill shows paid / due; a credit note returns stock in the right unit.
  - Project bill: place of supply defaults to the site's state (IGST when the site is in another state).

### 13. Accounts (books) (80 %)
- **Done:**
  - Tally-style ledgers and groups; vouchers; bank import; live stock-in-hand; a Cost of goods sold ledger.
  - GST (GSTR-1 / 3B with an Excel export for the CA); TDS; debit notes; fixed assets; closing stock.
- **Pending:**
  - CA to confirm: partner ledgers under Sundry Debtors, the FY 2026-27 tax figures, material sent to sites at cost.
  - Real opening balances as on 1 Apr 2026 and the Tally ledger list.
- **Tests:** `ac_books` 66, `gs_gst` 57, five e2e runs 194; screens `gs_gst_ui` 115.
- **Test by hand:**
  - Accounts → Ledgers: balances match the bills and receipts entered.
  - Make a voucher entry; import a bank statement and match lines.
  - GSTR-1 puts bills in B2B / B2C Large / B2C Small; the Excel export opens.
  - P&L shows Cost of goods sold for sale-order deliveries; closing stock comes from the warehouse.

### 14. Tasks (85 %)
- **Done:** tasks with assignee, due date, reopen with a reason, automation rules, My day.
- **Pending:** a teams view (teams design); who can see or close others' tasks (access matrix).
- **Tests:** `tk` 61, `tx` 19.
- **Test by hand:**
  - Create a task for someone: it shows in their My day; they mark it done.
  - Reopen a done task (Director / admin / assignee) with a reason.
  - An automation rule creates a task when its event happens.

### 15. Dashboard and analytics (70 %)
- **Done:** a dashboard with tiles by rights (Sales, Money received, Stock, PO tiles); one Analytics page.
- **Pending:** an analytics review, including the daily enquiry report by source (leads, interested, visits, conversions).
- **Tests:** `db_dashboard_be` 64, `dx` 35.
- **Test by hand:**
  - Dashboard: tiles change with the person's rights (Sales, Money received, Stock, PO tiles).
  - Analytics: the figures match the lists they come from (enquiries, projects, receipts).

### 16. Audit and reports (85 %)
- **Done:** the Activity page over every history, a trimmed Audit menu, tools as fixed assets in the books.
- **Pending:** nothing specific; access-matrix rights only.
- **Tests:** `au_audit` 53.
- **Test by hand:**
  - Activity: change a customer or bill; the change shows with who, when and what changed; the filters work.

### 17. Notifications, documents, background jobs (70 %)
- **Done:** bell alerts, documents and templates, a background worker (second container).
- **Pending:**
  - WhatsApp and email alerts, which need a WhatsApp Business number and email setup.
  - Clean-up of orphaned S3 files after the data clear.
- **Tests:** `nt_notify` 52; screens `nt_ui` 68.
- **Test by hand:**
  - An action that alerts (leave request, task, PO waiting) shows in the bell; clicking opens the record.
  - Upload a document to a project; generate a document from a template as PDF.

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
