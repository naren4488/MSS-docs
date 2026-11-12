# Module testing report

**Updated 13 Nov 2026** (data cleared 12 Nov on production and locally; the full regression afterwards gave 2,518 passed, only V10 failing, see "Regression after the 12 Nov data clear"; suites now create their own data, and test customers get a default address. Earlier, 11 Nov 2026: plan final regression: all steps 0–10 built, 2,375 API checks passed with 3 known fails, e2e life cycle 120/120, browser suites clean at 1440 except known m2 I02–I04 and a dev-server socket note; plan step 10 A5 "Material" renamed "Stock" — menu, pages, drawers, toasts, server messages, right "Stock & Tools", default ledgers, `/materials` → `/stock` with redirects and old pins mapped, 0144; plan step 9 D2 part 2 sale orders: stock reserved at confirm with a warning when short, released on cancel / close / delivery; delivery challans in any unit, over-delivery and over-billing refused, bill from the SO, completed, books and stock check, 0143; plan step 9 D2 part 1 sale orders: B2B / B2C, approval limit and maker ≠ approver with the billing approve right, gap-free SO numbers at confirm, units, cancel, print, list and customer tab, 0142; plan step 9 D1 purchase orders: Q9 approval with the ₹50,000 limit, gap-free PO numbers when sent, goods received in any unit with over-receipt approval, bills pulling the lines and the PO's terms, books at the PO cost, print / PDF, list and vendor tab, 0141; plan step 8 E1 one sale document: B2B or B2C first, B2B / B2C number series per company and financial year, old INV / SB documents kept, GSTR-1 from the class, 0140; plan step 7 E2 bill in any unit on sale bills, purchase bills and credit notes, saved units per item, 0139; plan step 6 E3 / E4 items and services found from a bill line and added on the spot, typed goods lines marked "Not from stock", no migration; plan step 5 B1–B3 vendor category, payment terms, due dates and overdue, 0138; plan step 4 C addresses in parts on every party, employee, company, project site and bill, 0137; plan step 3 F1–F4 sidebar HR section, search, pins and page info, 0136; plan step 2 A1–A3 stock rates per purchase unit, rate hints and stock details, 0135; plan steps 0 H1 master values in use and 1 A4 stock conversion, 0134; module review: Platform, Settings & masters, People, Attendance and leave, Payroll and advances, Customers, Enquiries, Site visits, Quotations, Projects, Warehouse, Billing, Accounts, Tasks, Dashboard and analytics, Audit, Notifications / documents / jobs done; whole-project report in PROJECT_REVIEW_REPORT.md; Accounts round 2). First written 18 Sep 2026.  
App: `http://localhost:5173`  
Test data: all business data was cleared on 12 Nov. Create a customer (address line 1 + state) and a project first, then use that project for the checks below.  
Do not use old demo/seed project ids. Those can open fake data.

Two lists below. **Problems** = what is already wrong. **What to check** = what you click, and what you should see.

---

## Problems

These are known. If you see exactly this, it is not a new bug.

### Broken — do not trust the number or the save

| Where | Problem | What you will see |
|-------|---------|-------------------|

### Works, but this problem is real

| Where | Problem | What you will see |
|-------|---------|-------------------|
| Projects | Some old ids are fake | A seed/demo project can open mock details. Save may do nothing. Test customer is real. |
| Projects | Some field-ops flags are only in the browser | A site/schedule flag can reset on another computer. |
| Projects | Sidebar highlight was dropping on project pages | On `/projects/<id>` the left menu lost **Projects**. Fixed in code — refresh and confirm it stays highlighted. |
| Partners | List is slow | Each partner loads a ledger on the page. |
| Notifications | In the app only | Bell and list work. No email, SMS or WhatsApp yet (owner: later). |
| Appearance | This browser only | Light/dark saves on your machine. It does not change the theme for other people. |
| Security | 2FA not built | Password change works. The 2FA button stays disabled. |
| Quotations | Letterhead may be old | PDF/preview can open without the name, GST, and logo saved under Settings → Company. |

### Not built — the menu item is there, the product is not

| Where | Problem |
|-------|---------|
| Fixed assets | This is the tools list. No depreciation register. A calculator on the page is not real asset accounting. |
| Data flow | A static diagram. No numbers. |
| Calendar | No Google Calendar sync. No repeating events. |

### Not a problem — do not file these

- Active sites file-login / subsidy / loan filters can feel slow. They run in the browser.
- Tools status/category filters can make the list look short. They run after the list loads.
- Outsource Execution with no work order shows “No subcontractor work orders yet”. That empty state is correct.
- A normal user opening Settings → Company sees no permission. Only Super Admin can edit it.
- Enquiry list **Source type** is the master source (employee, agent, partner, …), not a single-agent picker.
- Quotation **New quotation** goes to `/quotations?create=1`.
- Quotation client section: name / phone / email / address come from the customer (read-only, "Edit on the customer"); city, state, PIN, GSTIN, PAN are editable on drafts (Module 9).

---

## What to check

Tick these in the app. If the result matches a row in **Problems**, mark it known. If something else breaks, write it at the bottom.

### First five (do these before the rest)

| # | What to check | Pass when |
|---|----------------|-----------|
| 1 | Log in | You land on Dashboard. Not a blank page. |
| 2 | Open test customer → tab **Outsource Execution**. Refresh. | Project stays open. Left sidebar **Projects** stays highlighted. Empty work orders show the empty message, not a crash. |
| 3 | Enquiries → site visit → deal not done → request reschedule (date + note) | Old visit is completed. You can book a new visit. |
| 4 | Timeline → a site visit → **Open in calendar** | Address bar is `/calendar?date=YYYY-MM-DD`. It must not be `/tasks/...`. |
| 5 | Settings → Company. Change name or GST. Refresh. | Form loads. Save sticks. It must not say company settings are not configured. |

### Overview

| What to check | Pass when | Problem if it fails this way |
|---------------|-----------|------------------------------|
| Dashboard: My day, then each tile's link | My day shows your own tasks, visits, follow-ups, attendance. Each tile's number equals the rows in the list its link opens. A schedule row opens a real page. | |
| Dashboard as a field user (installer) | Only My day and Due today; no ₹ amounts or customer names. | |
| Dashboard: Sales / Money received vs Accounts → P&L and Finance home | Sales = P&L sales for the same period; Money received = Finance home's list total; a reversed receipt is not counted. | |
| Analytics → Enquiries & Sales (old Business analytics link opens it) | Charts or a clear empty state; clicking a chart opens a list with the same count. | |

### Pipeline

| What to check | Pass when | Problem if it fails this way |
|---------------|-----------|------------------------------|
| Enquiries list and search | Rows load. Search by customer name finds them. | |
| Filters: priority, source type, status, system size | List changes. **Up to 3 kW** includes 0–3 kW jobs (not empty because min was skipped). | |
| New enquiry: Personal Reference, system phase, **required** capacity and budget | Save blocked until capacity > 0 and budget > 0. Capacity looks like `5kW`. Source employee is auto-assigned. | Empty capacity/budget used to save — that must fail now. |
| Edit enquiry: follow-up date | Date field is on the form (not create-only). Save updates follow-up. | |
| Enquiry **Share**: copy link, WhatsApp, email, PDF | Link opens this enquiry after login (`?view=`). WhatsApp/email compose with the text. PDF downloads. | |
| Book a site visit (enquiry → Schedule visit → Site visit, tick "Charge a visit fee") | One save: the box shows SV-… with who, date/time and the fee SVF-…; the person sees it on **Site visits**; Calendar shows it once ("Site visit — customer"). A second booking is refused. | Was 3 separate saves with no visit record. |
| Edit / Cancel the booked visit from the enquiry | Edit moves the visit and its task; Cancel asks a reason and cancels an unpaid fee too. | |
| **Site visits** page as the person doing it (e.g. a sales executive) | My visits → Travelled → Site visit complete with a photo, findings and Capture location; the enquiry then shows the change request waiting. "Couldn't do the visit" closes it with the reason and follow-up date. | Field staff couldn't open their profile before. |
| A visit's task on Calendar or Tasks | Complete / status is refused there ("update it on the visit"). | |
| Customer → **Visit fees** | Record a receipt (company cash; or agent, kept by agent); void one with a reason; refund part; waive the balance; Cancel greyed while money is held; Move to project once. Figures and the customer summary follow. | |
| Project wizard → Attach enquiry with a paid visit fee | Offers "Adjust the ₹X visit fee against this project"; ticked, the fee moves to the project (customer advance). | |
| Reschedule (see first five) | Old visit completed. New visit allowed. | |
| Convert enquiry to quotation or project | The new record opens. | |
| Enquiries list figures and filters | Total / New / In progress / Converted / Lost are the whole company's. "New" lists follow-up and meeting stages too; "Archived" lists archived enquiries. | |
| Enquiry: Mark as lost with a note, then Reopen | Reopen asks for a reason, goes to Follow-up; history shows the lost note and the reopen reason. Old quotations stay cancelled. | |
| Enquiry: create a project from it twice | Second time refused ("already converted"). A lost enquiry can't be converted or quoted. | |
| Enquiry: reassign to a sales person | They see "Enquiry assigned to you" in notifications; you don't. Someone who has left can't be picked. | |
| Enquiry: site-visit change request | Approve renames the customer (and their books account) and updates the enquiry; or Reject (nothing changes). Either works once. | |
| Add enquiry: search a customer by name or phone | Finds any active customer, not just the first 100. "+" with a phone already used selects that customer. | |
| Enquiry export with a filter (e.g. Lost) | CSV has only the filtered rows; opens in Excel with Hindi names intact. | |
| Enquiry drawer as a view-only user (e.g. Director) | Details and history show; no Edit, Assign, Reopen, Archive, Mark lost or Approve buttons. | |
| Quotations list: search, status, **system size** | Filters the list. Status chips match the dropdown. | |
| Open a quotation. Change status. Preview/PDF. | Saves. File or print view opens. PDF should look sharp (PNG capture). | PDF missing company logo/GST — known. |
| Quotation Share to Client | Type a WhatsApp number → Share on WhatsApp opens WhatsApp with the message; a draft becomes Sent (locked, valid 15 days). Email opens the mail app. | The panel's fields couldn't be typed in before. |
| Send a quotation, then try to edit it | Form is read-only with "Sent vN · locked · Valid until …"; **Revise (new version)** makes a draft v2 you can edit and send again. | Approved prices could be changed before. |
| Row ⋮ → Customer approved… | Amount starts at the price before subsidy; change it (e.g. ₹2,85,000) → Approved; drawer shows "Approved at ₹2,85,000". | |
| Mark lost / Negotiating / Cancel | Lost needs a reason (shown in the drawer); Negotiating works from Sent. | Both used to fail. |
| Subsidy: None → Central → Central + State | Central follows the size (2 kW ₹60,000, 3 kW+ ₹78,000), state ₹17,000; both editable; preview/PDF shows the same lines; None hides subsidy. | Used to fill ₹78,000 + ₹17,000 silently. |
| Expired quotation (no answer in 15 days) | List filter "Expired"; can't be approved; Revise and send again. | |
| Approved → Create project | Project wizard opens on Attach quotation with it chosen; the project's contract = the agreed amount; clicking twice makes one project. | |
| New quotation from the list | Opens create (`?create=1`). Client details come from the customer; city/state/PIN/GSTIN/PAN editable. Subsidy starts at None. | |
| New project → each of the 4 types | Own (from an approved quotation): contract = agreed amount. Partner: partner picked, partner's rate prefilled (e.g. ₹22/W × 5 kW = ₹1,10,000). Vendor code: default rate, change to per project. I&C: work scopes, no costs. All saved with the right type, partner and charge. | Old kinds (Solo / Fixed EPC, INC Given…) are gone. |
| Project rates page | Default per type with history; add a partner's own rate; a ₹2,500/W rate is refused; a rate in use can't be deleted, next month's can. New projects take the new rate; old projects keep theirs. | |
| Vendor code project: record the customer's ₹3,00,000 "for the partner", then Pay partner | Header shows "To pay on to partner"; paying more than (money in − our charge) is refused; after paying, Received = our charge; can't complete while money is still to pay on. | |
| Partner project → Materials Sent → Create sale bill | "Billed to <partner>"; the partner's Account tab shows the bill due; the end customer's page doesn't. | |
| Partners → open one | Account (charges, received, owed, to pay on, bills) and Rates tabs; GSTIN on the list; same phone twice refused. Sub-vendors and INC work sources no longer in the menu. | |
| Project: Complete while money is owed | Non-Director: refused, naming the amount owed (Indian format). Director / Super Admin: asked for a reason; the reason shows on the project and in History. Same for Cancel after money was received. | |
| Project: Edit | Contract and capacity read-only; **Request change** (new value / capacity / additional work, reason) → pending in Financials → Approve changes the contract and History; can't go below what was received; Reject changes nothing. | Edit used to change the contract directly. |
| Project receipts and loan tranches | Record a receipt and a loan tranche: Received and Outstanding in the header follow; future date refused; delete asks a reason; no receipt on a cancelled project. | Header used to show ₹0. |
| Archive | Only completed / cancelled; leaves the list; "Show archived" finds it; Unarchive brings it back. List stats cover the whole filtered list. | |
| Materials Sent: dispatch 10 of 20, return 4 | Available goes 20 → 10 → 14; returning more than on site or dispatching more than available shows the server's message; Project Cost shows the material at cost. | Stock used to drop twice. |
| Project Report: tick panel installation done | Refused until a serial photo and a GPS photo (with the phone's location — allow location) are uploaded; undoing a done item asks a reason. | |
| Completed project | Read-only for materials, progress, evidence, work logs, schedules, blockages. | |
| Outsource Execution | Work orders load in one request with the subcontractor name; no new order on a cancelled project. | |
| Project at Initialized: add a checklist line; complete a site visit and assign a team; schedule the install | Status moves Material finalized → Ready for install → In progress by itself, each step in History; a later status never moves back. | |
| Projects list → test customer | Header shows customer, kW, address, status, contract value, collected. | |
| Every project tab: Project Report, Document Creator, Uploads, Materials Sent, Financials, Field Operations, Team Roster, Outsource Execution, History | Each tab shows content or a designed empty state. Refresh keeps the tab. | Sidebar Projects drops highlight — that was the bug. Confirm it stays on. |
| Yellow “Before you mark this project complete” | Only when bills or documents are actually missing. | |
| History tab | Events show. Newer jobs include “Project created”. | Fake data only on old seed ids. |
| Active sites | Only field jobs. No draft, pending start, completed, or cancelled mixed in as active. | Stage filters slow — known. |
| Need-to-get on an active site | Sheet loads when opened. | |
| Timeline filters: dates / project / history / sites / payments | One request loads the list (filtered on the server); **Load more** adds older rows without repeats; KPIs match the dates. | |
| Timeline row click | Opens history, financials, materials, or field ops — not always the same project page. | |
| Calendar month | Tasks, site visits, milestones, with project or enquiry names. | |
| Complete an open calendar task | Status sticks. | |
| Cancel a calendar task | Asks a reason; Cancel is greyed out on completed tasks. | |
| Tasks: given to me / given by me / all, status, overdue, search | List filters; counts at the top match the filters; 50 rows then **Load more**. | |
| Create a task, open the drawer, start / hold (reason) / done | Saves; **History** shows each step with who and why. A past due date is refused. | |
| Reopen a done task (as the person it was given to, then as someone else) | The person (or Director / Super Admin) can reopen with a reason; others don't see Reopen. Done / cancelled tasks are read-only. | |
| Give a task to someone on approved leave that day | Picker shows "On leave"; warning shown; task still saves; drawer shows the leave banner. | |
| Open an alert "Task given to you" / "Overdue task" | Opens the Tasks page with that task's drawer open (`/tasks?task=…`). | |
| Employee profile → Tasks tab | Lists that person's tasks (open first); status changes ask a reason where needed. | |

### Warehouse and people

| What to check | Pass when | Problem if it fails this way |
|---------------|-----------|------------------------------|
| Materials list | Live stock with units (e.g. 12 pcs, 290 m); stats Items, Stock value, Low / out; the low-stock banner counts every item, not just the page. | Item 101+ shows in pickers. |
| Damage & scrap tab (Materials) | Report damage (warehouse / at site / in transit, reason required, not more than is free). An approver reviews: Write off (loss = qty × average cost, editable), Keep aside (not usable), Back to stock, Vendor replaces it. Kept aside → Review again. Scrap now (approver) goes out at once; others wait for approval. | Was "Coming in version 2". |
| Issue to a site with one bad row | Good rows are saved and locked; the bad row shows why; "Issue the rest" sends only that row. Completed / cancelled projects aren't offered; partner projects say the material is billed to the partner. | |
| Need to get | The project list opens; open projects only; quantities with units, ₹ per unit; recompute doesn't add the same shortfall twice. | |
| Tools: assign, return, retire | Holder and status update; the project shows the tool once; assigning an issued tool says "return it first". | Filters can shorten the list — known. |
| Templates: edit a quotation template and a site checklist | Save sticks. New quotation can copy the lines. | |
| Attendance: mark present / absent / half day / paid leave, refresh | Mark stays. The day is in the link (`/attendance?date=2026-11-03` opens 3 Nov). Half Day cuts half a day's pay; Edit → Half Paid Leave uses half a leave day. | |
| Attendance: Mark all present | Preview lists who will be marked and who is skipped; after confirming they show Present. Works on Sundays (a normal working day). | |
| Attendance on a holiday | Absent / Half Day / leave are refused. Adding a holiday over an absence clears the absence. | |
| Attendance as a worker (view + apply leave only) | Sees only their own row, no salary or payable. | |
| Two paid-leave marks for someone with 1 day left (two tabs at once) | Only one goes through. | |
| Leave approve or reject | Balance updates; board, payroll table and profile month cards refresh. Approve isn't offered on your own leave. | |
| Leave requests page (sidebar → HR → Leave requests) | Waiting / Approved / All with search; Approve / Reject in place. Approvers see a "Leave request waiting" notification. | |
| Leave across two months (e.g. 30 Nov + 1 Dec, 1 day each month) | Both days paid (each month's credit counts). | |
| Deactivate someone with leave after the leaving date | That leave is cancelled. | |
| Payroll page (sidebar → HR → Payroll), last month | Opening it creates nothing. "Build payroll" lists everyone on payroll (not an outside CA with "on payroll here" off), with advance recovery filled in. | |
| Payroll: Adjust a line — overtime 1500, bonus 2000, note, recovery 2000 | Extra pay ₹3,500 and recovery −₹2,000 on the line; net = gross + 3,500 − 2,000. Save needs a note when there's extra pay; negative amounts can't be saved. | |
| Payroll: change attendance after building, then reload | "Out of date" banner; Approve waits until Recalculate. | |
| Payroll: Approve, then Pay one person | Adjust disappears; Pay opens the Pay drawer on that month; the line shows Paid; Payslip downloads a PDF; Cancel payroll is hidden once someone is paid. | |
| Payroll as HR | Can build and adjust; no Approve, Pay or advance-limit setting. | |
| Attendance: change a day in a month already paid (as HR) | The board asks why; the change is saved and the difference goes on the next salary. A user without payroll rights is refused. | |
| Pay drawer on a month not built yet | Shows "Prepare salary" (or "Ask HR or Accounting"); opening the drawer creates nothing. A ₹0 line shows "Settle ₹0 salary". | |
| Advance ₹15,000 from the profile (limit ₹10,000) | Sent as a request; history shows "Waiting for approval" with Approve / Reject; someone other than the requester approves, then "Pay advance" (Cash) posts it to the books. Up to ₹10,000 an approver gives it at once. Nobody approves their own advance. | |
| Add employee with "On payroll here" off and salary empty | Saved with salary 0. With "On payroll here" on, salary 0 is refused. | |
| Employees: open a person | Profile, photo (or initials), Employment history (joined / left / rejoined with who and why), documents, leave load. Month cards show each month's salary as payroll prices it. HR can change or remove the photo. | |
| Employees: add a person with messy data (extra spaces in the name, "+91 98290 12345", email in capitals, Aadhaar with spaces) | Saved tidy: single spaces, 10-digit phone, lower-case email, 12-digit Aadhaar. A second person with the same number (with or without +91) is refused. | |
| Employees: new person signs in with their phone number as password | They are sent to Settings → Security to choose a new password first. | |
| Employees: search by name, phone, email or Aadhaar | Finds them. Stats bar Total / Active stay the whole company's counts while searching. | |
| Employees: Edit → Bank, add two accounts, remove the first | First is primary; after removing it the other becomes primary. Bad IFSC or a short account number is refused. | |
| Employees: upload a document | PDF, JPG, PNG, WebP, HEIC up to 15 MB upload and open (link works for 15 minutes; reopen for a fresh one). .html, .svg, .exe or a PDF renamed .jpg are refused with a plain message. | |
| Employees: deactivate a team leader | They leave their teams; the team still opens, with no leader. | |
| Employees list at tablet / phone width | Header badge doesn't cover the title; the table scrolls sideways so Pay / Task / ⋮ are reachable. | |
| Site visit complete → deal not done → ask for another visit (employee page or Site visits page) | Visit closes; the enquiry shows the requested date; a new visit can be booked. | |
| Teams: add members, set one leader | Detail shows them. Tasks tab lists team calendar work and tasks given to members, with who has each. | |
| Teams: switch company | Each company sees only its own teams. | |
| Agents: approve a commission | A 5 kW project with an agent gets a commission once it has started and money came in. Only an approver sees Approve (change the amount → reason needed). A payment before approval shows as advance and is used on approval. Reverse needs a reason; the payment stays struck out. | Was paid without approval. |
| Task catalog (who does what) | Moved to the mss-nk portal → "Tasks: who does what". No Tasks List under People any more. | |

### Finance

Use ₹1 on the test customer only.

| What to check | Pass when | Problem if it fails this way |
|---------------|-----------|------------------------------|
| Finance home: Sales, Money received, Net result | Sales = Accounts → P&L sales; Net result = P&L net profit; Money received = its list total. Hidden figures show “—”, never ₹0. | |
| Finance home / Analytics period: this month, last FY, pick dates | Totals and chart follow the period; this financial year starts 1 April. | |
| Record a project client payment | Row in history. Project **Collected** goes up. | Trust the history row, not the Revenue KPI. |
| Owner withdrawal | Saves. | Errors — known, not on the server. |
| Employee income | Saves. | Errors — known, not built. |
| Customers: open one | Projects, quotations, invoices, payments show. Sidebar highlight is **Customers**, not Finance home. | |
| Customers list: search a name, a phone, a GSTIN, a Hindi name | Each finds the customer. Figures Active / Individuals / Companies / Inactive stay the whole company's. | |
| Customers: add one with a phone (or GSTIN) another customer has | Refused inside the form, naming that customer, with "Open that customer". | |
| Customer page with a project receipt ₹1,00,000 and a bill receipt ₹50,000 | Received ₹1,50,000 (hover shows on bills / on projects); Outstanding = sale bills − received = the customer's balance in the books; "Advance" when they've paid more than billed. | |
| Customer page: Edit, clear the email, save | Email stays empty after reload. | |
| Customer page: rename the customer | Trial Balance / Sundry Debtors shows the new name (once they have a posted invoice or payment). | |
| Delete a customer with an enquiry or project | Explains what's linked and offers "Mark inactive instead"; the customer disappears from the list and pickers; the page shows Inactive and hides Create quotation / project / invoice; "Make active" brings them back. | |
| Delete a customer with nothing linked | Deleted. | |
| Customer page as Accounting (view customers, create bills) | Figures and tabs show; no Edit / Mark inactive / Create quotation / project / Record payment; Create invoice stays. | |
| Customer page: Notes tab, add a note; History tab | Note shows with the date; History lists readable events (e.g. "Payment received on project …") with links. | |
| Customer page at phone width | Figures in two columns, buttons wrap, no sideways scrolling. | |
| Invoice: Rajasthan customer vs Pune customer | Jaipur customer: CGST + SGST; Pune business (GSTIN 27…): IGST. Totals match to the paisa, with round-off. Save draft shows "no number yet"; Issue gives INV/2026-27/000N. | Out-of-state invoices used to get CGST/SGST. |
| Invoice: pay, overpay, void, advance | Card payment needs a bank account. Paying more than is due is refused with the amount due. Void a paid invoice (reason): the money shows as the customer's advance; Apply it to the corrected invoice. Reverse a receipt only as an approver. | Void used to drop the money from the books. |
| Invoice: print | Print opens a TAX INVOICE with both GSTINs, place of supply "Rajasthan (08)", HSN/SAC summary, amount in words, bank details. Download PDF saves INV-2026-27-000N.pdf. | |
| Vendor: add purchase bill | GST per line (5 % panels, 18 % cable) with paise; "Goods received now" ticked → stock goes up at once; the bill is **Waiting for approval** and can't be paid yet. Same bill number from the same vendor is refused. | Was fixed 18 % and paid / received without approval. |
| Vendor: approve, send back, cancel | Only an approver sees Approve / Send back / Cancel. Send back needs a reason; the bill can be fixed and sent again. Cancel is refused once paid or goods are in. History shows who and why. | |
| Vendor: receive goods later | Untick goods received; later Receive goods in two parts with 1 damaged piece: Part received → Received; damaged not in stock. | |
| Vendor: payment, advance, reverse | Payment mode required; can't put more on a bill than is due; extra stays as advance and pays the next approved bill. Reverse needs a reason; the payment stays struck out and the bill is due again. Cards: Billed (approved), Paid, Due, Advance, Waiting. | |
| Vendor: To acquire tab | Shortfalls of open projects for items this vendor supplied (or all); select → Make purchase bill prefilled; saved rows leave the list. | Was "Coming in version 2". |
| Finance → Purchase orders → New purchase order (as Accounts) | Vendor's terms shown ("Net 30 days (the vendor's)"); "polycab 4" finds the coil cable in Coil with "= 900 Meter in stock terms"; 2 % discount and a service line; the total with GST; "Up to ₹50,000 …" note. Save and send for approval → "Waiting for approval", "Draft PO-…", no number; Accounts has no Approve button. | |
| PO above ₹50,000 made by the stores manager | His Approve button is off with "above the ₹50,000 limit: someone other than …"; the Director approves. A Super Admin's own big PO too. | Q9. |
| Approve → Send to the vendor | The number PO/2026-27/000N appears only now; Print shows PURCHASE ORDER, both GSTINs and addresses, Net 30 days, CGST + SGST (IGST for an out-of-state vendor); PDF downloads. | |
| Receive goods counted in metres on a coil line | "450 Meter = 5 Coil of the order"; GRN/2026-27/000N with the challan; status Partly received; stock +450 m; 5 coils still to come. Refused pieces don't count. | |
| Receive more than ordered as Accounts / as the stores manager | Accounts: "an approver must allow it first", nothing saved. Stores manager: asked for a reason, then taken in. Or "Allow more" on the line first. | Q9. |
| Make purchase bill from the PO | Lines still to bill at the PO's net rate (item locked), due date from the PO's terms, no "Goods received now"; more than came in is refused. The bill shows "Purchase order PO/…" and the PO lists the bill. | |
| Edit a sent PO | Asks why; goes back for approval, keeps its number, Revision 1; can't go below what came in. | |
| Cancel a partly received PO / Close it | Cancel refused ("Close it instead"); Close (approver, reason) drops what is still to come. A PO received and billed in full closes by itself. | |
| Loans: SBI ₹5,00,000 at 10.5 % reducing, 36 months | EMI ₹16,251.22; schedule shows interest and principal per month. A repayment can't be more than what's left; each one splits interest then principal. Reverse with reason reopens the loan. Close with money left needs a settlement reason. | Loans used to close early with no interest. |
| Partners → Investments | Repay a chosen investment (not more than outstanding); cancel an investment only when nothing was repaid (reason); an adjustment needs a reason. | Slow list — known. |
| Vendorship Code Co. | List All / Active / Inactive. Code company at ₹1.5/W on a 5 kW project: fee ₹7,500 appears by itself; approve it; record a collection of ₹2,90,000 with ₹3,000 fee kept and a ₹10,000 payment: Account shows paid / kept / advance and "customer money passed on", and the project's received goes up. | |
| Subcontractors | Work order buttons only for the next step (Start → Mark completed → Approve). A payout must pick a work order and can't go above what's left. Reverse asks for a reason. | |
| INC Work Sources | Receipts / ledger load. | |
| Project → Outsource Execution → attach a subcontractor | Empty message is replaced by the work order. Same order shows under Finance → Subcontractors. | |

### Insights, audit, notifications, settings

| What to check | Pass when | Problem if it fails this way |
|---------------|-----------|------------------------------|
| Analytics: each panel, then export | Numbers or a clear empty state; panels you have no rights to are left out. CSV downloads (summary too). | |
| Old Audit links: `/audit`, `/audit/inventory`, `/audit/cash-bank`, `/audit/data-flow` | Land on the first Audit page you can open, Accounts closing stock, the cash ledger and Reports. | |
| Accounts → Reports → Trial Balance (as on 31 Mar) | Dr total = Cr total, with "Profit & Loss A/c (previous years)" and "Difference in opening balances" rows; rent, salaries etc. show only this year's amounts. | Used to carry earlier years. |
| Accounts → Reports → P&L and Balance Sheet | P&L trading part shows Opening and Closing Stock (e.g. 7 panels × ₹12,000 = ₹84,000 left in the warehouse); Balance Sheet shows Closing Stock under current assets and balances. Closing stock view lists the items; only the CA / Super Admin can lock a year-end figure. | Stock never showed before. |
| Daybook as a view-only user | No New / Edit / Reverse / Cancel buttons. A reversed entry opens read-only. A journal with the same ledger on both sides is refused. | |
| Audit → Debtors / creditors | Buckets Not due, 0–30, 31–60, 61–90, 90+ by due date; an invoice not yet due is not "overdue"; creditors from approved bills. | Used to put not-due invoices in 90+. |
| Audit → GST: pick a month | GSTR-1 (B2B with GSTIN, B2C large / small, HSN with quantity, documents issued, voided) and GSTR-3B (output tax, input credit split by the vendor's state, unregistered purchases apart, net payable); "Books check" green; Excel downloads open in Excel. | Used to show blank numbers and ₹0. |
| Accounts → Bank import: import the same statement twice | Second time: lines shown as duplicates, nothing posted. Lines already in the books (module, payroll, Daybook) are matched. Rows in a locked period are skipped with the reason. Suspense: split a line into two ledgers; unmap it. | |
| Fixed assets | | Tools list, not assets — known, not built. |
| Audit → Activity: edit a book entry, approve a bill, change a permission, sign in with a wrong password; then open Activity | Each shows with who / when (India time) and a link; filters by person / module / text work; CSV downloads. | |
| Audit → Fixed assets: approve a bill with a tool, then open the register | The tool is listed with its cost; "Matches the books". Depreciation for a year: preview (half rate if bought after 3 Oct) → Post → book value drops; Post again is refused; Cancel brings it back. Sold / scrapped asks how the money came in and books the profit or loss. | |
| Audit → Reports & export: Money received for this FY | The count equals Finance home's Money received list; CSV dates are DD-MM-YYYY; inventory valuation total = Accounts closing stock. | |
| Data flow | | Static diagram only — known, not built. |
| On GST or Activity | Sidebar highlight is that item. AUDIT menu has 5 items. | |
| Notifications bell and page | Bell pop-up and page agree; each alert opens its record (bill, loan, invoice, item, task, payroll month, advance on Payroll). Dismiss an "EMI due"; when it becomes overdue it comes back as "New again". A user without the money right sees no ₹ in alerts. | No email / WhatsApp — owner: later. |
| Approvals reach the approver: submit an advance above the limit, a payroll run, an agent commission, a stock adjustment | The approver gets "…waiting" in the bell; the requester of an above-limit advance doesn't; approving clears it within a refresh. | |
| Sidebar as an installer / HR / accounts user | Only pages that person can open; typing another page's address shows "not allowed". | |
| Settings → System (Super Admin) | Background jobs with last run and last success; "Not running" if the worker is stopped. | |
| Settings → Profile: change name, refresh | Name sticks. | Photo coming soon — known. |
| Settings → Appearance: light/dark, refresh | Theme sticks on this browser, with a short fade. | Other users unchanged — known. |
| Settings → Security: change password, log in, change it back | Login works with the new password. | 2FA disabled — known. |
| Settings → Masters: add a test item | It shows in the dropdown that uses that list. | |
| Settings → Departments / Designations | Add and edit a test row. System rows (Super Admin) cannot be deleted. | |
| Settings → Task templates | List opens. A save sticks or shows an error. | |
| Settings → Task automations: rule "enquiry created → Site survey", then add an enquiry | A task appears for someone with that designation, linked to the enquiry; the rule shows it under Recent runs. Switched-off rules do nothing. | |
| Settings pages | Main sidebar **Settings & data** stays highlighted. | |
| Settings → Companies (Super Admin) | Lists your companies. New company with a wrong GSTIN or a PAN not matching it is blocked; a valid one appears in the switcher. "Add existing person" lists only people from your companies. | |
| Employees → ⋮ → Reset password | Temporary password shown once. Old password stops working; the person must change it at sign-in. | |
| Leave the app unused for 7 days | You are signed out. | |
| Accounts → Ledgers → a bank ledger → "Print on invoices" on | New invoice offers that account (and only accounts marked this way). | |
| Accounts → Posting ledgers → Payment modes → UPI → a bank ledger | A UPI receipt with no bank account posts to that ledger. | |
| Settings → Masters | No "Payment Methods", dummy "Bank Accounts" or expense sub-category lists. A Sales Executive can still pick from every dropdown but can't change lists. | |

Designation access matrix: only if you can use a second login. Turn one feature off for a test role, confirm that person cannot open it, then turn it back on.

---

## One path that covers the main problems

About 20 minutes. Test customer. ₹1 only.

1. Enquiry → book a site visit. It shows on Calendar and Timeline.
2. Timeline → Open in calendar → that date, not `/tasks/...`.
3. Deal not done → reschedule. Old visit completed.
4. Open test customer. Every tab, including Outsource Execution. Sidebar **Projects** stays on.
5. Record ₹1 collected. Project Collected goes up. Finance home Money received goes up by ₹1 and lists the row.
6. Settings → Company still shows the saved name after refresh.
7. Log out. Back must not show project data.

**Stop if any of these fail in a new way:** login, project page blank, reschedule does not close the old visit, Open in calendar 404s, Company settings will not load for Super Admin.

---

## New problems only

Do not copy the tables above. Write only what is not already listed.

| Page | What you clicked | What happened | What you expected |
|------|------------------|---------------|-------------------|
| | | | |
| | | | |

### Accounts round 2 (10 Nov 2026)
| Check | Expected | Note |
|---|---|---|
| Add a material "solar panel" and "DC cable" | GST 5 % and 18 %; invoice / bill lines take the item's rate (editable). | |
| Partner / vendor code / I&C project: bill our charge | 18 % GST on top; line marked "our project charge"; an extra line on the same invoice counts as extra in the partner's account. | |
| Invoice → Raise credit note (part, with "goods came back") | Balance drops (or advance); stock goes up; GSTR-1 CDNR / CDNUR; void puts it back. | |
| Receipt from a business customer with TDS | Invoice closes for money + TDS; TDS receivable report shows it. Home owners: TDS not offered. | |
| Vendor bill with freight (both choices), reverse charge, a tool as asset | Item cost includes freight or Freight inward; reverse-charge GST in GSTR-3B 3.1(d); tool on the asset register. | |
| Approved bill → Raise debit note (2 pieces back) | Stock out, GST credit reversed, vendor balance down. | |
| Vendor / agent / subcontractor payment with TDS | Party gets the net; TDS payable report by month. | |
| Accounts → Stock | Warehouse value = Stock-in-hand ledger after receipts, dispatch, returns, scrap. | |
| Employee → Salary structure, then build payroll | PF / ESI / TDS lines as the preview; incentive lines from converted projects; payslip shows them. | PF / ESI off until switched on per person. |
| Approve payroll as the person who built it | "Someone else must approve what you created." HR can approve, not pay. | |
| Payroll → Bank salary file (AU) | CSV / Excel with one row per employee with bank details; the rest listed as missing. | Layout to match the bank's sample. |

### Plan steps 0 (H1) and 1 (A4) — 10 Nov 2026
Automated: `hr/h1a4_master_conversion.sh` 39/39, `pw/h1a4_ui` 73/73 at 1440 / 768 / 390 px.

| Check | Expected | Note |
|---|---|---|
| Settings → Masters → Vendor Categories → delete a category some vendors use | One dialog (no browser pop-up): "This value is in use — Used by 2 vendors"; **Deactivate** in the same dialog. After it the row shows "inactive" and **Reactivate**. | Built-in values offer Deactivate too. |
| Delete a value nobody uses | Deleted. | |
| Vendors list / details for a vendor whose category was deactivated | "Old Cable Suppliers (inactive)", not "Supplier". Edit keeps it selected; the dropdown doesn't offer other inactive ones. | Same for stock categories, enquiry source, project roof type / phase. |
| Materials → Add, purchase Coil, issue Meter, no factor | "Enter the conversion" on the Meter per coil field; nothing saved, even without opening stock. | Foot ↔ metre needs no entry. |
| Materials → Edit an item with stock, change the factor 90 → 100 | Reason asked, "Stock 360 Meter will read 400 Meter"; saved only with a reason and by someone with the stock approve right. History shows the change and the reason. | Without stock: no reason needed. |
| Vendor → Add purchase bill with an item that has no factor | "Line 1: DC cable has no conversion (meter per coil) — set it on the stock item" and a **Set the conversion on DC cable** button; nothing saved. The button opens the item's Edit form in a new tab; set it, come back, Save bill works. | Only older items can lack a factor; 0134 lists them. |

### Plan step 2 (A1–A3) — 11 Nov 2026
Automated: `hr/a1a3_stock_rates.sh` 42/42, `pw/a1a3_ui` 126/126 at 1440 / 768 / 390 px (data: `hr/a1a3_ui_setup.sh`).

| Check | Expected | Note |
|---|---|---|
| Materials → Add: purchase Coil, issue Meter, purchase 3200, sale 3600, factor 90 | Labels "Purchase rate (INR / Coil)" and "Sale rate (INR / Coil)". Under them "= ₹35.56 per Meter" and "= ₹40.00 per Meter", and "Margin ₹400.00 (12.5 %) over the purchase rate". The hints change as you type the rates or the factor; before the factor: "Enter the conversion to see the rate per Meter". | Same unit both sides: no per-unit hint, margin only. |
| Materials → Edit the cable, sale 3780 | "= ₹42.00 per Meter", "Margin ₹580.00 (18.1 %) over averaged cost". Saved as ₹3,780 per coil. | The list shows rates with "/Coil" when the units differ. |
| Item → Add stock, batch rate 3300 | "= ₹36.67 per Meter" under the batch rate. | |
| Open an item (details) | Sections: Overview (size, category, type, status, rates / HSN last changed, added and last edited with who), Stock (warehouse, available, reserved, issued, on sites, min. alert — each "360 m = 4 coils"), Units & conversion ("1 coil = 90 m", part-unit returns), Pricing (latest purchase, averaged cost, sale rate per coil and per m; margin), Value (at cost, at sale rate), Tax, Activity (last purchase bill / vendor / date / rate, last issue project / date, stock history link), Notes. | No sale rate: "Not set — bills start from the purchase rate"; value "at purchase rate". Orders (POs / SOs) come with plan D. |
| Invoices → New → Add from materials → the cable | Line rate ₹42 per meter (₹3,780 a coil ÷ 90), unit meter. 10 m = ₹420 + GST, not ₹37,800. | |
| …an item with no sale rate (earthing wire ₹2,500 per 50 m coil) | Rate ₹50 per meter with the amber note "At purchase rate per meter — this item has no sale rate". Typing a rate removes the note. | |
| Project → Materials Sent | Value of each item = on site × the sale rate per issue unit (cable 90 m × ₹42); an item without a sale rate is marked "at purchase rate". **Create sale bill**: same rates, unit, HSN and GST from the item; never the purchase cost of a "bought for the project" movement. | |
| Quotation → Add Item | Typed entry only — no "From Inventory" tab. Templates still fill lines. | Plan D6 / Q1. |
| Dashboard / Analytics → Inventory → stock value at sale rate | Stock (issue units) × sale rate per issue unit; no sale rate → purchase rate. | |

### Plan step 3 (F1–F4) — 11 Nov 2026
Automated: `hr/f_sidebar_prefs.sh` 28/28, `pw/f_sidebar_ui` 215/215 at 1440 / 768 / 390 px as Super Admin and a Sales Executive (data: `hr/f_sidebar_ui_setup.sh`, run `pw/f_sidebar_run.sh`).

| Check | Expected | Note |
|---|---|---|
| Sidebar (Super Admin) | An **HR** section after Warehouse & site: Employees, Teams, Attendance, Leave requests, Payroll, Payroll settings. No PEOPLE section. Warehouse & site has only Materials, Tools, Templates. Agents still under Finance, Payroll ledgers still under Accounts. | A person without HR rights sees no HR section at all. |
| Open Payroll settings / Payroll / Attendance / an employee | Breadcrumb "Home / HR / Payroll settings", "Home / HR / Payroll", "Home / HR / Attendance", "Home / HR / Employees / <name>". Only the item you are on is highlighted (Payroll settings, not Payroll too). | |
| Payroll page | A **Payroll ledgers** button next to Payroll settings opens Accounts → Payroll ledgers. | Only for people with the accounts right. |
| Sidebar search: type "salary", "GST", "stock", "leave" | Payroll, GST, Materials, Leave requests come first (section shown on the right). ↑ / ↓ move the highlight, Enter opens it and empties the box, Esc empties the box. "Nothing in the menu matches …" when nothing does. | Only pages you may open: a Sales Executive finds nothing for "salary". |
| Press "/" anywhere (not in a field) | The cursor goes to the sidebar search; on a tablet or phone the menu opens first. Typing "/" in a page's own field types a "/". | |
| Pin Payroll, GST, Materials, Tasks, Daybook | A pin shows when you point at an item (always in the phone menu). They appear under **Pinned** at the top in that order. | |
| Pin a 6th item (Employees) | "Replace a pin?" lists the five; choose Materials → Employees takes its place. Cancel changes nothing. | Max 5 (D15). |
| Reload, then sign in on another browser or open another company | Same pins, same order. | Saved per person, not per company. |
| A person loses a right after pinning a page | The pin is hidden; it is dropped the next time they change their pins. | |
| Click / hover / tap the ⓘ after the breadcrumb (Payroll, GST, Materials, an employee, an employee's attendance, Daybook, Dashboard) | A box with the page name and what the page is for, what you can do and where its numbers come from. Esc, a second click or a tap outside closes it. The ⓘ never covers the company badge or the breadcrumb; on phones it sits after the page title. | Text in `app/navigation/pageInfo.ts`. |

### Plan step 4 (C) — 11 Nov 2026
Automated: `hr/c_addresses.sh` 51/51, `pw/c_addresses_ui` 99/99 at 1440 / 768 / 390 px (data: `hr/c_addresses_ui_setup.sh`); updated `hr/z_customers.sh` (Z03–Z04: extra-addresses endpoint gone), `pw/m1_ui` 69/69, `pw/people_ui` 60/60, `pw/pt_create_ui` 177/177 for the new address form; `pw/customers_ui` 71/71, `pw/bp_parties_ui` 201/201, `pw/w_vendors_ui` 80/80, `pw/bl_invoices_ui` 52/52 re-run; full regression 2021 passed, 3 known fails (M04, V10, PT03); migration 0137 up / down / up locally. Two old checks were stale and are fixed: `customers_ui` A01 ("Edit" matched the sidebar's "Pin Debtors / creditors" button since step 3; now an exact match) and `pt_create_ui` A06 (the partner charge is ₹1,29,800 = ₹1,10,000 + 18 % GST since 0131).

| Check | Expected | Note |
|---|---|---|
| Customers → Add: line 1 "  House 9,  Near Water Tank", a long line 2, city "Bassi", state Rajasthan, PIN "30330" | Under State: "GST code 08". Save → "PIN code must be 6 digits (not starting with 0)." under the PIN, the form stays open. PIN 303301 → saved; the card shows "House 9, Near Water Tank, …, Bassi, Rajasthan - 303301". | The PIN box takes digits only, at most 6. Line 1 is needed once anything is filled. |
| Customers → Edit a customer whose old address was one line ("Ward 12, Near Bus Stand, Sikar 332001") | The card and the customer page show a **Check address** chip. Edit opens with the address split (line 1 "Ward 12, Near Bus Stand", city Sikar, state Rajasthan, PIN 332001) and an amber note "Check this address …". Save → the chip goes. | Customers that said only "Jaipur" open with city and state filled and line 1 empty to fill in. |
| Customer with GSTIN 08… and address state Gujarat | An amber note (not an error): "The GSTIN is registered in Rajasthan (08), but the address is in Gujarat (24). Bills take the place of supply from the GSTIN." | Same on vendors. |
| Vendors → open a vendor → open a purchase bill | A Vendor box at the top: name, address on its lines ("Ahmedabad, Gujarat (24) - 382445"), GSTIN or "— (unregistered)". | |
| Invoices → open an invoice for a Gujarat customer | Bill to: line 1, line 2, "Ahmedabad, Gujarat (24) - 382213". Place of supply Gujarat (24); IGST. Print / PDF show the same lines. | Bills made before the change show their old text. |
| Customer (Gujarat, no GSTIN) → Create invoice | Place of supply starts at Gujarat (24); the hint says inter-state. | GSTIN state first, then the address state, then the company's. |
| Employees → open → Edit Profile | Current address in parts; a tick "Permanent (home) address is the same as the current address" (on for new people, off for people added before) — untick to fill the home address. The profile shows both. | |
| Settings → Company: change the address state | GST state shows "Gujarat (24)" / "Rajasthan (08)" read-only. Save → Settings → Companies shows the same address and GST state. | The two screens share one address now. |
| Project → Edit | Site address in parts; clear line 1 → "Address line 1 is required (house / plot, street or village)." Save a new PIN → the project page and the site address change together. | New project: the site address starts from the customer's address. |
| Project → Documents → generate (WCR, agreement) | `{{customer.city}}`, `{{customer.state}}`, `{{customer.pincode}}`, `{{site.line1}}` etc. filled from the parts; `{{vendor.name}}` is the code company on a project using its code. | |
| Widths 1440 / 768 / 390 | City, State, PIN side by side from 640 px, stacked on phones; no sideways scroll in any form. | |

### Plan step 5 (B1–B3) — 11 Nov 2026
Automated: `hr/b_terms.sh` 89/89 (in `regress.sh` as `b_*.sh`), `pw/b_terms_ui` 144/144 at 1440 / 768 / 390 px (data: `hr/b_terms_ui_setup.sh`); Go unit tests for the terms rules (`models/payment_terms_test.go`, `service/payment_terms_test.go`); re-run `hr/b2_purchases.sh` 74/74, `hr/bl_billing.sh` 81/81, `hr/bp_parties.sh` 99/99, `hr/z_customers.sh` 25/25, `hr/c_addresses.sh` 51/51, `hr/h1a4_master_conversion.sh` 39/39 (its in-use example now a stock category: vendor categories are no master list any more), `pw/w_vendors_ui` 80/80, `pw/customers_ui` 71/71, `pw/bl_invoices_ui` 52/52, `pw/c_addresses_ui` 99/99, `pw/bp_parties_ui` 201/201, `pw/h1a4_ui` 70/70 (was 73: the vendor-details "(inactive)" check has no stock counterpart and was dropped at each width); full regression 2110 passed, 3 known fails (M04, V10, PT03); migration 0138 up / down / up locally.

| Check | Expected | Note |
|---|---|---|
| Vendors → Add vendor, no GSTIN, Category B2B, Save | "A B2B vendor is GST-registered: enter the GSTIN (or pick B2C / General Purchase)." Nothing saved. | B2C with a GSTIN is refused too. With no category picked: B2B when there is a GSTIN, else General Purchase. |
| Same form: Payment terms → Net N days, clear the days, Save | "Enter the credit days, for example 30." under Credit days. | Net starts at 30. |
| Net 45, Due from "The end of the bill's month", Part advance 20, a note | The grey line: "20 % advance, rest Net 45 days from month end · a bill dated today (11-11-2026) is due on 14-01-2027". Saved as General Purchase. | Custom needs a note; Full advance has no part %. |
| Vendors list | Figures Overdue / Due this week; filters Category (B2B / B2C / General Purchase) and Dues (Overdue / Due this week); a card reads "B2B · Net 30 days" and "Overdue ₹7,800 · 1 bill". | Overdue = approved bills past their due date (or bill date when none). |
| Vendor page (Net 30, a bill 45 days old part paid, one 25 days old) | Header "Payment terms: Net 30 days", Overdue figure. Dues block: Open ₹19,600 2 bills, Overdue ₹7,800, Due in 7 days ₹11,800; ageing Not due ₹11,800, 0–30 days ₹7,800; the bills "Overdue 15 days" (₹7,800 of ₹11,800) and "Due in 5 days". | |
| Edit the vendor: Net 30 → Net 45, Save | The form says "applies to new bills of this vendor; due dates already on bills stay". The old bills keep their due dates; "Category and payment-terms changes" lists "Net 30 days → Net 45 days". | Also on the Activity page. |
| Add purchase bill | Due date filled with today + 45, the hint "…'s terms: Net 45 days → <date>". Change the bill date → the due date follows. Type another due date → "Why a different due date? *"; Save without it → refused; with it → saved. | "Use the terms date" puts it back. |
| Open the part-paid overdue bill | Chip "Overdue 15 days"; under Due date "From the terms: Net 30 days. NEFT to HDFC a/c only". **Change due date** → no reason → "Write a reason of at least 3 letters."; today + 10 with a reason → "Due <date>", "Set on the bill: …", History "Due date set". | Approved bills only, approvers only. Empty date = back to the terms. |
| Bills tab → Due filter Overdue / Due this week | Only those approved bills; a Due date column with the chip. | |
| Customers → Dues filter Overdue | Only customers with an overdue bill (a home owner's sale bill with no due date counts from its date); cards "Overdue ₹68,000 · 1 bill", terms shown. | |
| Customer page (Net 15 from month end) | "Net 15 days from month end" in the header; Dues block with the invoice's chip. Create invoice → Due date = month end + 15 with the hint; another date → "Reason for this due date *". | Partner bills have no terms. |
| Customers → Add, terms Custom without a note | "Write the terms, …" under the note. With the note → saved; no due date is filled without credit days. | |
| Audit → Debtors / creditors → Creditors | The bill due in 5 days shows "Due in 5 days" (its due date from the terms); the welder's bill without a due date "40 days late" from its bill date. | Same rules as the Dues blocks. |
| Widths 1440 / 768 / 390 | No sideways scroll on the lists, forms, vendor / customer pages and bill views. | |

### Regression after the 12 Nov data clear — 12 Nov 2026
Run alone on the local test DB (migrations to 0151, API on :8080). The first run after the data clear gave 2,118 passed, 144 failed and 7 "timed out" suites. No product bugs: every failure was in the suites.
- **Full `regress.sh`:** 2,518 passed, 2 failed. V10 is known (it checks a migration of MSS's old letterhead bank account, and the data clear removed that account). `hr/bp_parties.sh` BA21 was timing-dependent and is fixed. Re-run alone four times, it passed 99/99 each time.
- **Customer address (row 27):** F, I, J, L, Q, R, SV, TK, TX, NT, PAYROLL and T created customers with no address and got a 422. `hr/lib.sh` `call` now adds a default line 1 + state to `POST /customers` when the body has no address. Set `NO_DEFAULT_ADDR=1` to switch it off: `q12_gst_terms.sh` R02 does, because it tests the 422.
- **Not timeouts:** p_vendor_code_billing, d1, d2, q11, q12 and q13 all passed, in 2–39 s. Their result lines (`RESULT …:`, `D1:`, `== Q13 done:`) didn't match the old `^[A-Z]+:` pattern. `regress.sh` now takes any "N passed, M failed" line. The 300 s cap is unchanged.
- **Fixtures:** S lost its statement file `stmts/match_test.csv`, which was restored from the master copy. M04 now makes its own old-style `INV-0001` invoice and checks that it keeps its number while the series goes on; M05 moves to the next number. NS N52 expects the year's count after any `MSC/<FY>/` number already used, so re-runs pass, and its clean-up removes the customer FY counter. BP BA21 posts the payment before reversing it.

### Plan final regression (steps 0–10) — 11 Nov 2026
Run on the local test DB (migrations 0134–0144 applied, API rebuilt from HEAD).
- **Full `regress.sh`:** 2,375 passed, 3 known fails (M04, V10, PT03). `hr/d1_purchase_orders.sh` and `hr/d2_sale_orders.sh` hit the 5-minute cap while the browser suites ran at the same time. Run alone they pass, 66/66 in 39 s and 62/62 in 31 s; the logs show no deadlock or server error.
- **`hr/e2e_lifecycle.sh`:** 120/120 (was 112/120). Eight checks were stale and are updated, not product bugs:
  - E072: maker-checker answers 409.
  - E092 / E102: Accounts may reverse receipts and approve commissions (Q17a / Q17b of 10 Nov).
  - E076 / E082 / E130 / E153 / E155: perpetual stock (Q10). A bill approved before the goods come goes to Goods in Transit; a dispatch credits Stock-in-Hand; closing stock comes from the ledger; the P&L has no closing-stock line; the balance sheet shows the Stock-in-Hand group.
- **Browser suites at 1440:**
  - Clean: `pw/m1_ui` 23/23, `pw/payroll_ui` 31/31, `pw/customers_ui` 25/25, `pw/bl_invoices_ui` 52/52, `pw/gs_gst_ui` 47/47, `pw/pe_exec_ui` 32/32.
  - `pw/pm_money_ui` 31/31. E01 was stale: its "Edit" button lookup matched the sidebar's "Pin Debtors / cr**edit**ors" (step 3), so it now matches exactly.
  - `pw/nt_ui` 67/68. A03 was stale: it read `document_number` (the field is `document_no`) and fell back to "INV/", so it now expects the B2B / B2C number. Left: admin-N99, the Vite dev server's live-reload socket on :5173 dropping (dev-server noise, not an app error).
  - `pw/m2_ui` 11/14, I02–I04 known.
- **`pw/w_materials_ui`** (fresh setup, 1440): 55/55. The "Choose company" screen that sometimes appeared right after setup did not show up. Reading the code: the company list has no cap, and a new company is in it at once. If it comes back, save a screenshot of the first page after login.
- **Product fixes:** none needed.

### Owner answers 11 Nov, rows 20, 21, 33 and 34 (stock names, Cable, return rounding) — 12 Nov 2026
Automated: `hr/q13_renames_rounding.sh` 11/11 (in `regress.sh`, listed by name):
- Q01–Q03 (fresh company): "Civil Stock" (stock and quotation categories), "Stock Procurement", Cable and Wiring on; `/master-data/bootstrap` lists Cable and Civil Stock, no Civil Material; the recommended stock ledger is "Stock-in-Hand".
- Q04–Q05 (existing companies): MSS has the new names and Cable on; no company keeps "Stock-in-Hand – Materials", "Civil Material" or "Material Procurement", and Cable is on everywhere.
- Q06–Q10 (row 34): a Cable item (₹3,514.29 a 100 m coil); 20 m dispatched at ₹35.1429 = ₹702.86, returned at the project's ₹35.143 with the stock at the same rate; books Dr Stock-in-Hand ₹702.86 · Cr Stock consumed – Projects ₹702.86, no Stock Adjustments line, project back to 0 (was ₹702.80 + ₹0.06 to Stock Adjustments).
- Q11: a real rate change (coil now ₹3,600) still posts its ₹8.57 to Stock Adjustments.

`pw/quotations_ui` 15/15 at 1440 (new R02: the quotation form shows "Stock Items", not "Material Items"); `pw/w_materials_ui` 55/55 at 1440.

Re-runs: `hr/ac_books.sh` 66/66, `hr/pe_projects_exec.sh` 68/68, `hr/e2_bill_units.sh` 55/55, `hr/w_warehouse.sh` 71/71, `hr/qt_quotations.sh` 40/40, `hr/b2_purchases.sh` 74/74, `hr/d1_purchase_orders.sh` 71/71, `hr/d2_sale_orders.sh` 79/79 (ledger name "Stock-in-Hand" in their expected lines). Stale fixtures fixed (not product bugs): `hr/qt_quotations.sh`, `hr/quotations_ui_setup.sh` and `hr/w_materials_ui_setup.sh` made customers without line 1 + state (row 27). Go unit test `TestReturnStockRate`; `go build / vet / test ./internal/...`, `tsc -b`, `npm run build` clean; 0151 up / down / up locally and the 0120–0151 chain on the PG18 prod-schema copy.

What to check: Stock → add an item in "Cable" or "Civil Stock"; a project blockage "Stock Procurement"; a quotation's "Stock Items" card and its PDF; send 20 m of a coil cable to a project and return it, then Accounts → the entries: the same amount both sides, nothing in Stock Adjustments.

### Owner answer 11 Nov, row 10 (Number series) — 12 Nov 2026
Automated: `hr/ns_number_series.sh` 25/25 (in `regress.sh`, listed by name):
- N01–N02: all 19 series listed with previews; the sales desk reads them with `can_edit` false.
- N10–N16 (B2B): prefix TAX + next 7 → the next issued bill is TAX/2026-27/0007, the old bill keeps B2B/2026-27/0001; next 5 or 7 refused 422 naming TAX/…/0007; back to B2B with next 1 refused (B2B/…/0001 exists); B2C can't take TAX (422 `taken`); bad prefix, 9 digits, separator "." 422; unknown series 404.
- N20: the second company's first B2B bill is still B2B/2026-27/0001.
- N30–N35 (PO, by the accountant): MSPO next 21 → MSPO/2026-27/0021; year off, "-", 5 digits → MSPO-00001, MSPO-00002; year back on → MSPO/2026-27/0022.
- N40 (SO): SORD, 6 digits, next 12 → SORD/2026-27/000012.
- N50–N53 (customers, shared): the accountant and the sales desk 403; Super Admin MSC/ next n → that customer number; year on → MSC/2026-27/0001; the setting removed → CUST- again (the suite puts the shared series back).
- N60–N63: the sales desk 403, the accountant 200 on B2B; Activity lines per change with "prefix B2B → TAX, next number 2 → 7"; nothing in the other company.

`pw/ns_ui` 26/26 at 1440 and 390 (data `hr/ns_ui_setup.sh`): the Settings menu link, groups and previews, "All companies" on customers; Change B2B with the live preview, saved, the next bill takes the number; a lower next number shows "… is already used"; the PO year switch off at 1440 (PO/0001) and on at 390 (PO/2026-27/0001); the sales desk sees no Change button; no sideways scroll, no page errors.

Re-runs: `hr/e1_sale_document.sh` 39/39, `hr/d1_purchase_orders.sh` 71/71, `hr/d2_sale_orders.sh` 79/79, `hr/z_customers.sh` 25/25. `go build / vet / test ./internal/...` clean (new unit tests for the formatter and series keys); `tsc -b` and `npm run build` clean. Migration 0150 up / down / up locally; the 0120–0150 chain on the PG18 prod-schema copy.

What to check: Settings → Number series as the accountant (change B2B, then issue a bill) and as someone without the accounts right (read-only). Try a next number below the last used. Customers / projects rows change only for a Super Admin.

### Owner answers 11 Nov, rows 18, 19, 24 and 36 (SO chunk) — 12 Nov 2026
Automated: `hr/d2_sale_orders.sh` 79/79. S46 now has the sales desk refused on deliver (403) and the stores manager delivering; S56 expects Cost of Goods Sold. New checks:
- S62–S64 (row 19): a new company has "Cost of Goods Sold" under Purchase Accounts with the cogs slot set; a delivery marked as made before 0149 keeps Purchases, new ones post to COGS; the P&L lists the line.
- S65–S69 (row 18): the sales desk and the stores manager get 403, no reason 422; the director cancels: SO back to confirmed, 150 m to deliver and reserved again, number kept, cancelled by / at; stock +90 m with movement return / `sale_delivery_cancel`; books keep the delivery entry and post the ₹3,240 reversal, the stock check matches; refused again (409), refused once billed (409 "is billed on this sale order"), unknown challan 404, other company 404, history.
- S70 (row 24): the sales desk and the director (no stock edit) get 403 on deliver; the stores manager delivers.
- S71–S72 (row 36a): the challan print (stores may open it) is `text/html` with our GSTIN, the customer and address parts, SO / DC numbers, the date, "5 Coil = 450 Meter", the batteries, no prices and the signature lines; the PDF link serves `application/pdf`; a cancelled challan prints CANCELLED; other company 404.
- S73–S78 (row 36b): 0 refused, the stores manager 403; ₹10,000 recorded against the SO (a customer receipt with the SO, posted in the books); the ₹31,860 bill issued from the SO takes it (partial, ₹21,860 due); ₹20,000 in two advances on a ₹15,930 bill → paid, ₹4,070 left as the customer's advance; voiding frees ₹20,000 again; an advance on a draft SO stays the customer's advance after the SO is cancelled; none on a cancelled SO (409).

`pw/d2_so_ui` 78/78 at 1440 and 390: X00 the sales desk sees no Deliver goods; X01 the accountant cancels the first challan (badge, reason, Confirmed again, 180 m reserved, stock back); X02 delivers again (two challans); X03 Print challan shows DELIVERY CHALLAN, the numbers, the customer, "= 90 Meter", the signature lines and no ₹; X04–X05 Record advance ₹2,000 (dialog fits a phone) listed on the SO; X06 issuing the bill uses it.

Re-runs: `hr/bl_billing.sh` 81/81, `hr/ac_books.sh` 66/66 and `hr/a2_sales.sh` 75/75 (both with fixture customer addresses for the row 27 rule), `hr/e1_sale_document.sh` 39/39. `go build / vet / test ./internal/...` clean; `tsc -b` and `npm run build` clean; migration 0149 up / down / up locally, and the 0120–0149 chain on the PG18 prod-schema copy.

What to check: on an SO with a challan not billed yet, Cancel challan as the director (the stock and the reserved figure come back). Print a challan. Record an advance on a confirmed SO, make the sale bill and issue it: the bill shows the advance received. In Accounts → Posting ledgers the "Cost of goods sold" slot.

### Owner answers 11 Nov, rows 11, 13, 22 and 35 (PO chunk) — 12 Nov 2026
Automated: `hr/d1_purchase_orders.sh` 71/71. D13 now checks that a Super Admin approves their own ₹60,000 PO (the page offers it only to them; the history says "Super Admin approved their own order above the limit" with their name). New checks:
- D80: 918 m = 10.2 Coil (2 %) taken in by the accountant without approval and logged; 918.9 m (2.1 %) is 403 `OVER_RECEIPT`.
- D81: the director sets 5 % and 945 m (10.5 Coil) then comes in; the other company keeps 2 %.
- D82: Approval limits are read by everyone; the stores manager, accountant and project admin get 403 (the old PO limit route too); 60 % is 422; the director sets ₹80,000 / ₹65,000, seen by the PO and SO settings; 4 Activity events.
- D83: last vendors per item; an item never bought is 422 `VENDOR_NEEDED` (nothing made); the project admin gets 403; three drafts, one per vendor, in purchase units (100 m → 2 Coil, 30 kg of legs → 3 Pcs).
- D84: the dashboard tile counts equal `?status=submitted` and `?status=goods_to_come`, and the list filter is sent.

`hr/d2_sale_orders.sh` 62/62: S16 is now SA self-approval. Fixture: the second company's customer got line 1 + state (row 27 rule).

Re-runs:
- `hr/w_warehouse.sh` 71/71 (fixture customer address for row 27).
- `hr/db_dashboard_be.sh` 64/64.
- `pw/d1_po_ui` at 1440 and 390: 84/84 (1440 and 390). New steps: O00 "up to 0.2 Coil extra without approval" in the receive dialog; K01–K02 the Super Admin approves their own ₹60,000 PO; K03–K04 Settings → Approval limits read-only for the accountant and changed by the director (60 % refused on screen, 3 % saved); N01–N05 Create PO from Need to get (vendor picked for MC4, 2 drafts, links open the draft with the project); T01–T02 the dashboard tile opens the filtered list.
- `go build / vet / test ./internal/...` clean; `tsc -b` and `npm run build` clean.
- Migration 0148 up / down / up locally, and the 0120–0148 chain on the PG18 prod-schema copy.

What to check: Settings → Approval limits as a non-director (read-only) and as the director (Change). On a sent PO of 10 coils, receive 918 m as someone without the approve right. On Stock → Need-to-Get report (needs project edit), tick items → Create PO. On the dashboard, the "POs waiting for approval" tile.

### Section P, who bills the client: vendor code on projects (owner answer 28) — 12 Nov 2026
Automated: `hr/p_vendor_code_billing.sh` 44/44 (run by `regress.sh` through `p_*.sh`) — one check per row of the section P table with the plan's examples: own + ours bills the client; own + another firm bills Surya Urja through its own customer record (another customer or a partner 422, the vendor code can't change once billed 409, completion refused while the firm owes, paid → completes); partner + ours bills the client ₹3,00,000 with our rate ₹2,40,000, the partner's margin bills ≤ ₹60,000 (₹60,001 422 `OVER_BILLING` and nothing saved, a second bill over the ₹20,000 left and an over-cap edit 422, a cancelled bill frees its amount), paid both ways → profit ₹2,40,000 and completes; vendor code only bills the client ₹3,00,000, the partner bills ₹3,00,000 (₹3,00,001 refused), our ₹15,000 charge bill, net ₹2,85,000, profit ₹15,000; partner + another firm and I&C bill the partner as before; payouts 410; the edit drawer switch (history); the partner account both sides; books (the client, the firm's ledger, the partner's vendor ledger, the partner's ledger; trial balance agrees); another company 404. `pw/p_vc_ui` 42/42 at 1440 and 390 (header vendor code and billed party for four rows, Financials "Who bills the client" with the partner's bill form prefilled with what is left, "Bill our charge" billed to the partner, the edit drawer, the partner page's bills to MSS, no sideways scroll, no page errors / 5xx). Suites updated where section P changes behaviour: `hr/pt_project_types.sh` 37/37 (vendor code projects bill the client, payouts 410, receipts credit the client, the partner owed the full amount; PT03 after the data clean), `pw/pt_details_ui` 162/162 at 390 / 768 / 1440 ("Who bills the client" instead of "Paid on to partner", the vendor code project bills the client ₹3,00,000 and owes the partner ₹3,00,000, no "for the partner" receipt on our code, the partner's bill form fits a phone), `pw/pt_create_ui` 186/189 then A06 passing on a partners-only re-run (partner step offers ours / another firm only, the client amount is required and previews the ₹40,000 margin / the ₹1,88,000 net, saved contracts ₹1,77,000 and ₹2,36,000; A06 now expects the client contract on the partner account; A04 fails only on a re-run because the partner already exists); fixture addresses for row 27 in `hr/pm_projects_money.sh` 41/41, `hr/pe_projects_exec.sh` 68/68, `hr/b2_purchases.sh` 74/74. Re-runs: `hr/bp_parties.sh` 99/99, `hr/bl_billing.sh` 81/81, `hr/q12_gst_terms.sh` 30/30; `go build / vet / test ./internal/...` clean; `tsc -b` and `npm run build` clean; migration 0147 up / down / up locally and the 0120–0147 chain on the prod-schema copy.

### Owner answers 11 Nov, rows 6, 26, 27, 9 and 31 (GST place of supply, customer address, partner terms, due-date reasons) — 12 Nov 2026
Automated: `hr/q12_gst_terms.sh` 30/30 (in `regress.sh`, listed by name) — a customer without a state 422 on `address_parts.state` (nothing saved), no address 422 naming line 1 and the state, line 1 + state enough, old-client text with a state passes and without one 422, an old customer without a state saves other fields but its address only once a state is added; B2C for a GSTIN customer with no warning and no GSTIN on the bill, B2B without a GSTIN 422; a Rajasthan customer's Gujarat-site project bill 24 with IGST ₹18,000, the place of supply changeable (08 → CGST + SGST), a Jaipur site 08, a site without a state falls back to the GSTIN state, trading sales by the customer, GSTR-1 B2B by the stored place of supply; a partner with Net 15 (Net without days 422), terms set / kept / cleared with Activity, a partner bill dated 20 days ago due 15 days later and overdue 5 days in the partner's Dues, the overdue list and Audit → Debtors (not the end customer's dues), another company 404; sale bills, draft edits, an issued bill, purchase bills and a partner bill: earlier due date without a reason accepted, later without a reason 422 `due_date_reason`, later with one kept. `pw/q12_ui` 34/34 at 1440 and 390. Re-runs: `hr/b_terms.sh` 89/89, `hr/c_addresses.sh` 51/51, `hr/e1_sale_document.sh` 39/39, `hr/bl_billing.sh` 81/81, `hr/gs_gst.sh` 57/57, `hr/bp_parties.sh` 99/99, `hr/z_customers.sh` 25/25, `pw/b_terms_ui` 144/144, `pw/c_addresses_ui` 99/99; `go build / vet / test ./internal/...` clean; `tsc -b` and `npm run build` clean; migration 0146 up / down / up locally and on the prod-schema copy.

| Where | Check | Result |
|---|---|---|
| Customers → Add, line 1 only | State marked *, "Choose the state (it decides the GST on bills)." under it, not saved; saved once Rajasthan is chosen (city, PIN empty) | Pass |
| Customer → Create sale bill, pick the Sanand (Gujarat) project | Place of supply Gujarat (24), "From the project site (Gujarat). Inter-state … IGST"; changed to Rajasthan → CGST + SGST, saved 08 | Pass |
| Same bill, B2C chosen for the GSTIN customer | Only "No GSTIN on the bill · numbered B2C/…", no warning | Pass |
| Same bill, due date 45 days (Net 30) | Reason marked *, Save draft stopped "… give DD-MM-YYYY: say why this bill is due later" | Pass |
| Same bill, due date 10 days | Reason box optional; saved as manual without a reason | Pass |
| Partner page (Net 15, bill 20 days old) | "Payment terms: Net 15 days", Dues block ₹1,47,500 "Overdue 5 days"; Edit profile shows the terms section | Pass |
| All of the above at 390 | No sideways scroll, no page or server errors | Pass |

Suites changed for the new rules or the 11 Nov data clean (not product bugs): `b_terms` B33 now types a later date and B81 adds an address; `c_addresses` C34 expects clearing a customer's address to be refused and C85 makes its no-address customer in the database; `z_customers` fixtures get an address and Z02 expects the address clear refused; `e1_sale_document` fixtures get an address and E26 makes its own old-series invoice (MSS's were cleared); `gs_gst` / `bp_parties` fixture addresses; `c_addresses_ui_setup` no-address customer made in the database; `pw/b_terms_ui` PB04 message text and CA02 address.

### Owner answers 11 Nov, rows 3 and 4 (item code, one-off unit used again) — 11 Nov 2026
Automated: `hr/q11_codes_units.sh` 23/23 (in `regress.sh`, listed by name) — codes trimmed and uppercase, a duplicate in another case 409 naming the other item, invalid characters / 21 characters 422, `/` and `-` allowed, edit / clear / keep, tools share codes, another company may reuse one; search by code (exact first, prefix, code + name word, no other company); one-off units counted across sale bill, purchase bill, PO and SO by name (any case, spaces) and conversion, offered from the second use, not after saved or dismissed; a project admin 403 on the offer data, dismiss and a code edit but searches by code. `pw/q11_ui` 39/39 at 1440/390 (run `pw/q11_run.sh`). Re-run: `hr/e34_inline_items.sh` 40/40, `hr/e2_bill_units.sh` 55/55, `hr/d1_purchase_orders.sh` 66/66, `hr/d2_sale_orders.sh` 62/62, `hr/a1a3_stock_rates.sh` 42/42, `pw/e34_inline_ui` 105/105, `pw/e2_units_ui` 86/86; Go build / vet / tests; `npx tsc -b && npm run build`; migration 0145 up / down / up locally.

| Where | Check | Result |
|---|---|---|
| Stock → search "dcc-4" | The item with code DCC-4 first, the code as a tag before its name | Pass |
| Stock → Edit, Item code = another item's code | Refused on the field: "item code PNL-545 is already used by Waaree …" | Pass |
| Sale bill line, type "dcc-4" | Exact code first, the code shown in the row; DCC-4B/… next | Pass |
| Sale bill line in Other unit… Pallet = 30 (used once before) | "You've used Pallet = 30 Pcs/Nos before. Save it for this item?" — Save switches the line to the saved unit | Pass |
| Same with Don't ask again | Never offered again for that item and unit | Pass |
| Project admin, a unit used before | No offer | Pass |

### Plan step 10 (A5, Material → Stock) — 11 Nov 2026
Automated: `hr/f_sidebar_prefs.sh` 31/31 (FP60–FP62 new: an old `/materials` pin is saved as `/stock`, old saved pins read back as `/stock` without a repeat, `/materials` + `/stock` together refused 422); ledger names updated in `hr/pe_projects_exec.sh` 68/68, `hr/ac_books.sh` 66/66 (AC28 now leaves the renamed "Purchases – Stock" / "Stock consumed …" ledgers out of its closing-stock row check), `hr/b2_purchases.sh` 74/74 (B233 line order follows the new name), `hr/r_books_parties.sh` 22/22, `hr/e2_bill_units.sh` 55/55, `hr/d2_sale_orders.sh` 62/62; `hr/nt_notify.sh` 52/52, `hr/au_audit.sh` 53/53 (links now `/stock`); `hr/e2e_lifecycle.sh` (not in `regress.sh`) 112/120 — its 8 fails are older behaviour changes (goods in transit, live stock, approvals), not the rename. Go unit tests for the pin mapping; migration 0144 down / up locally.
Screens: `pw/w_materials_ui` 76/76 at 1440/768/390 (R01 the page and menu say Stock, R02 `/materials?item=…` opens `/stock?item=…`), `pw/f_sidebar_ui` 215/215, `pw/a1a3_ui` 126/126 (DT03 updated to the "Free (on hand − reserved)" label from D2), `pw/h1a4_ui` 70/70 (right "Stock & Tools"), `pw/e34_inline_ui` 105/105, `pw/d1_po_ui` 90/90, `pw/d2_so_ui` 64/64, `pw/nt_ui` 162/166 (menu list now has Purchase / Sale orders; A03 still expects the old INV number prefix since E1 and N99 is a Vite reload message — both not from this step). Other suites' visible text updated too (a2, b2, d2, e2, p6, pt_details).

| Where | Check | Result |
|---|---|---|
| Sidebar → Warehouse & site → Stock | Menu, breadcrumb, page title and ⓘ say Stock; searching "materials" in the sidebar still finds it. | Pass |
| An old link `/materials?item=<id>` | Opens `/stock?item=<id>` with the item open. | Pass |
| Project → Stock sent | Tab, dispatch / return dialogs and toasts say stock. | Pass |
| Purchase bill / PO / SO line | Line type "Stock item". | Pass |

### Plan step 9 (D2 part 2, sale orders: reservation, delivery, billing) — 11 Nov 2026
Automated: `hr/d2_sale_orders.sh` 62/62 (S36–S61 new) — reservation: nothing before confirm, 6 coils reserve 540 m at confirm (stock details "so_reserved_quantity" 540 / 1 SO, free 360, also for the stores manager), 5 more coils with 360 m free confirm with the warning "needs 450 Meter but only 360 Meter is free" (kept in the history; free −90), cancel releases it, a confirmed SO changed to 7 coils keeps holding 630 m while it waits for re-approval; delivery: 180 Meter on a Coil line = 2 coils (DC/…/0001, partly delivered, reservation 450, stock log "issue" 180 m with reference sale_delivery at ₹36 a metre = ₹6,480), 451 m / 5.5 coils / a service line / a future date refused (422 `OVER_DELIVERY` "only 5 Coil is left to deliver"), the sales desk delivers a battery, a cancelled SO delivers nothing (409); billing: "Make sale bill" gives a B2B draft with the SO's lines (7 Coil at ₹4,050 = 630 m, batteries, the delivery charge), Net 30 terms and the SO link; drafts count as billed; a second bill for one more battery, an extra battery line on the draft (auto-linked), another customer or an item not on the SO refused (422 `OVER_BILLING` / 422); the draft line lowered to 4 coils leaves 3 to bill and back; issue, full payment (paid, listed on the SO); end to end the rest goes out (5 Coil + 2 batteries) → completed, nothing reserved, three challans, history partly_delivered → completed; books Dr Purchases – Materials · Cr Stock-in-Hand – Materials ₹6,480 and ₹38,200, stock check matches; voiding the bill → delivered, everything to bill, listed under "to bill", a new bill can be made; close: refused with nothing out (409), cancel refused after delivery (409), the sales desk can't close (403), the director closes (2 coils dropped and released, 3 still to bill, no more delivery 409), a closed SO is billed; a negative reservation refused by the database, the other company 404; an SO in Meter delivered in Coil (2 coils = 180 m refused, 1 coil = 90 m out, 60 m still reserved). `pw/d2_so_ui` 64/64 at 1440 and 390 (run `pw/d2_run.sh`; R01–R02, D01–D05, B01–B02 new): the confirmed SO shows "Reserved in the warehouse for this SO: 180 Meter", the Stock list "reserved · free"; the accountant delivers 1 Coil on the Meter line ("1 Coil = 90 Meter of the order", DC/… listed, 90 m out, 90 m still reserved), 2 more coils stopped ("More than ordered", nothing moved); Make sale bill opens the draft bill with "Sale order SO/…" (B2C, 180 Meter + the delivery charge); the SO lists the draft bill; "Fill everything left" → Completed, nothing reserved; no sideways scroll, no page / server errors. Related: `hr/d1_purchase_orders.sh` 66/66, `hr/e1_sale_document.sh` 39/39, `hr/e2_bill_units.sh` 55/55, `hr/a2_sales.sh` 75/75, `hr/w_warehouse.sh` 71/71, `hr/bl_billing.sh` 81/81, `pw/a2_ui` 210/210; `go build` / `go vet` / `go test ./internal/...`, `tsc -b`, `npm run build`; migration 0143 up / down / up locally. Full regression deferred to the end of all steps.

### Plan step 9 (D2 part 1, sale orders) — 11 Nov 2026
Automated: `hr/d2_sale_orders.sh` 36/36 (in `regress.sh`, listed by name) — B2B / B2C (B2B without a GSTIN refused at create, switch and confirm), terms from the customer, units (Coil / Meter), validation, rights (no billing right 403), the ₹50,000 limit (₹49,999 self-approved, ₹60,000 refused for the maker 403 `MAKER_CHECKER`, exactly ₹50,000 self-approved, Super Admin too, per-company and separate from the PO limit), send back / edit / resubmit, gap-free numbers (6 confirmed at once), financial-year series, change after confirm (reason, revision, number kept), cancel rules, filters / summary / customer tab, print (CGST / IGST, B2C "Unregistered", DRAFT, CANCELLED), PDF, Activity, two companies, sidebar pin, check constraints. `pw/d2_so_ui` 46/46 at 1440 and 390 (run `pw/d2_run.sh`): sales desk makes a B2C order (B2B stopped without a GSTIN), coil cable starts in Meter at ₹40, accountant approves and confirms, print, change after confirm with a reason, director re-approves; maker blocked above the limit, director approves and cancels; customer tab; search and B2B filter; no sideways scroll, no page / server errors. Related: `hr/d1_purchase_orders.sh` 66/66, `hr/e1_sale_document.sh` 39/39, `hr/f_sidebar_prefs.sh` 28/28, `pw/f_sidebar_ui` 215/215; Go unit tests; migration 0142 up / down / up locally. Full regression deferred to the end of all steps.

| Check | Expected | Result |
|---|---|---|
| Home owner (no GSTIN), B2B chosen | Red "has no GSTIN. A B2B order needs one"; Save stopped | Pass |
| Accountant's own ₹60,000 SO | Approve off, note "above the ₹50,000 limit"; director approves | Pass |
| Confirm | `SO/2026-27/0001`, next ones consecutive, none skipped | Pass |
| Change a confirmed SO | Reason asked; waiting for approval, revision 1, number kept | Pass |

### Plan step 9 (D1) — 11 Nov 2026
Automated: `hr/d1_purchase_orders.sh` 66/66 (in `regress.sh`, listed by name), `pw/d1_po_ui` 90/90 at 1440/768/390 (run `pw/d1_run.sh`; related browser suites via `pw/d1_related_ui.sh`, all passing); Go unit tests; related API suites b2, w, e2, e34, b_terms, c, a1a3, h1a4, bp all passing; full regression deferred to the end of all steps; migration 0141 up / down / up / down / up locally.
What the new suites check: Q9 (₹49,999 self-approved, ₹60,000 refused for the maker and approved by another, exactly ₹50,000, Super Admin held to the rule, limit per company), no-right users, gap-free numbers at sending (8 in parallel, 31 Mar → 2025-26, second company), two partial deliveries counted in metres on a coil line, refused pieces, over-receipt refused / allowed with a reason / allowance, cancel of a partly received PO refused, edits after approval (reason, revision, number kept), bills pulling lines and the PO's terms, over-billing refused, books at the PO cost and a price difference to Purchases, auto-close and reopen, lists / filters / links, print / PDF, two companies; end to end vendor Net 30 → PO → approve → receive partly → bill → stock and ledger → due date → pay → close. See the Finance table above for the screen checks.

### Plan step 8 (E1) — 11 Nov 2026
Automated: `hr/e1_sale_document.sh` 39/39 (in `regress.sh`, listed by name), `pw/e1_sale_doc_ui` 98/98 at 1440/768/390 (run `pw/e1_run.sh`); Go unit tests for the class, series per financial year, titles, GSTR-1 class and document ranges; `hr/bl_billing.sh` 81/81, `hr/m_invoices.sh` 5/6 (M04 known), `hr/gs_gst.sh` 57/57, `hr/a2_sales.sh` 75/75, `hr/e2_bill_units.sh` 55/55, `hr/e34_inline_items.sh` 40/40, `hr/pm_projects_money.sh` 41/41, `hr/pt_project_types.sh` 37/38 (PT03 known), `hr/b_terms.sh` 89/89, `hr/db_dashboard_be.sh` 64/64, `hr/z_customers.sh` 25/25, `hr/bp_parties.sh` 99/99 (BL14–BL17, BL23, BL53, BL57, M01–M05, GS12 / GS17, DB20 / DB22 now read the B2B / B2C numbers); `pw/bl_invoices_ui` 52/52, `pw/customers_ui` 71/71, `pw/b_terms_ui` 144/144, `pw/c_addresses_ui` 99/99, `pw/gs_gst_ui` 115/115, `pw/bp_parties_ui` 201/201, `pw/pt_details_ui` 163/163, `pw/e2_units_ui` 86/86, `pw/e34_inline_ui` 105/105, `pw/a1a3_ui` 126/126, `pw/a2_ui` 210/210, `pw/f_sidebar_ui` 215/215 (run `pw/e1_related_ui.sh`; labels "New sale bill", "Create sale bill", "Sales bills", the B2B / B2C filter); full regression 2244 passed, 3 known fails (M04, V10, PT03); `go build` / `go vet` / `go test ./internal/...`, `tsc -b`, `npm run build`; migration 0140 up / down / up / down / up locally

What the new suites check: B2B for a home owner with no GSTIN refused (422, nothing saved); the class from the GSTIN when not sent; an old client's `sale_bill` taken as the one document; B2C for a GSTIN company (GSTIN left off); issue gives B2B/2026-27/0001 and B2C/2026-27/0001 (16 characters); a second company starts at 0001; void keeps 0002 and the next is 0003, a discarded draft uses none; 10 bills issued at the same moment get 10 different, consecutive numbers; 31 Mar 2026 → …/2025-26/0001, 1 Apr 2026 → …/2026-27/…, a draft moved across 1 April takes the new year; a draft switches B2B ↔ B2C, an issued bill can't; a GSTIN removed after the draft stops the issue and uses no number; GSTR-1 B2B only B2B bills, B2C Large (Delhi home ₹2,91,200, Gujarat B2C bill ₹3,02,400 without the GSTIN), B2C Small; documents issued per series; credit notes CDNR / CDNUR / B2CS by their invoice; TDS only on B2B; print and PDF titles and numbers; old INV / SB documents open, print and take payments; list / summary / customer filters and figures; partner bills (B2B with the partner's GSTIN, B2C without, B2B without a GSTIN 422); end to end Net 30 customer → B2B with a coil line → issue → due date → paid → GSTR-1 B2B, then a home owner B2C → B2CS; the 0140 mapping in a rolled-back down → old rows → up run.

| Where | What you should see | Notes |
|---|---|---|
| Finance → **Sales bills** | Menu, breadcrumb and tab say "Sales bills"; the type filter is B2B and B2C / B2B only / B2C only; each row has a B2B / B2C badge; old documents show "Old invoice series" / "Old sale-bill series" under their INV / SB number. | Old links `?type=invoice` show the whole list. |
| New sale bill → choose **B2B**, pick a home owner | Red line "… has no GSTIN. A B2B bill needs one: add it to the customer, or choose B2C"; Save draft / Save & issue stopped with the same text; nothing saved. | |
| Switch to **B2C** → Save & issue | Issued `B2C/2026-27/000N`; the bill opens titled "B2C sale bill" with a B2C chip; the print says "B2C sale bill" and "GSTIN: Unregistered". | |
| New sale bill → pick a company with a GSTIN and Net 30 | B2B is selected by itself ("… (from the GSTIN — change it if needed)"); due date = bill date + 30; a cable line in Coil shows "= 180 Meter". Save & issue → `B2B/2026-27/000N`, print TAX INVOICE "B2B sale bill · registered buyer", "Invoice no: B2B/…", the GSTIN. | |
| B2C for a company with a GSTIN | Amber note: the GSTIN is left off and they can't claim input credit. Saved without the GSTIN. | Owner question in the plan. |
| A draft → Edit draft | B2B / B2C can still be switched; an issued bill can't. | |
| Customer page → **Sales bills & payments** | One list of every bill with a Type column (B2C sale bill, Sale bill (old series) …); figures "B2B bills" / "B2C bills". Button "Create sale bill". | |
| Project → Materials Sent → Create sale bill | The form opens with B2C (a home owner) or B2B (a GSTIN customer); issued in that series. | |
| Audit → GST → GSTR-1 | B2B lists only B2B bills with the GSTIN; a B2C bill to a company is in B2C Large / Small without its GSTIN; Documents issued has one row per series (B2B, B2C, old INV / SB). Credit notes against a B2B bill under CDNR. | B2C Large limit ₹1,00,000. |
| Record payment with TDS on a B2C bill | Refused: "TDS is only for business customers: a B2B bill …". | |

### Plan step 7 (E2) — 11 Nov 2026
Automated: `hr/e2_bill_units.sh` 55/55 (in `regress.sh`, listed by name), `pw/e2_units_ui` 86/86 at 1440/768/390 (run `pw/e2_run.sh`); Go unit test for a credit line in another unit; `hr/b2_purchases.sh` 74/74, `hr/bl_billing.sh` 81/81, `hr/a2_sales.sh` 75/75, `hr/w_warehouse.sh` 71/71 (W08 / W09 now use a unit the item has no conversion for — buying in the issue unit is allowed by E2), `hr/a1a3_stock_rates.sh` 42/42, `hr/h1a4_master_conversion.sh` 39/39, `hr/e34_inline_items.sh` 40/40, `hr/gs_gst.sh` 57/57; `pw/e34_inline_ui` 105/105, `pw/a2_ui` 210/210, `pw/a1a3_ui` 126/126, `pw/bl_invoices_ui` 52/52, `pw/w_vendors_ui` 80/80, `pw/b_terms_ui` 144/144, `pw/h1a4_ui` 70/70, `pw/b2_ui` 106/106, `pw/w_materials_ui` 70/70 (a2 I06, e34 IN03 and a1a3 IN01 / SB01 read a stock line's unit from the new dropdown; w_materials D03's double click no longer waits 30 s when the first click closes the dialog); full regression 2205 passed, 3 known fails (M04, V10, PT03); `go build` / `go vet` / `go test ./internal/...`, `tsc -b`, `npm run build`; migration 0139 up / down / up / down / up locally.
What the new suites check: the units of an item and the rates in each (coil cable, weight-based leg, GI strip); purchase in Coil and in Meter (stock in metres, averaged cost per coil, last purchase "billed as 45 Meter"); a new unit "Bundle = 10 m" entered once and then saved; a user without the stock create right uses a one-off unit but can't save one (403); a used unit can't be changed or removed (409 `IN_USE`), deactivate / reactivate work; fractions and rounding; GST intra / inter-state totals and the GSTR-1 HSN units; end to end purchase in coils → stock in metres → dispatch → invoice in coils and metres → print / PDF "= 180 Meter" → credit note of 20 m on a coil line (₹800, exactly 20 m back, books entries) → not enough on site in metres (409) → void; a debit note in coils (90 m out, not enough free stock 409, cancel puts 90 m back). On screen at three widths: the unit dropdowns, the Other unit dialog (save / one-off / entered in the purchase unit / no right), stock-terms notes and the free-stock warning, the credit note in metres, Stock details saved units.
Found: the books post a return's project cost at 4 decimals and Stock-in-Hand at 2, the paise go to Stock Adjustments (older behaviour, noted in the plan).

### Plan step 6 (E3 / E4) — 11 Nov 2026
Automated: `hr/e34_inline_items.sh` 40/40 (in `regress.sh`, listed by name), `pw/e34_inline_ui` 105/105 at 1440 / 768 / 390 px (run `pw/e34_run.sh`; data: `hr/e34_inline_ui_setup.sh`); re-run `hr/b2_purchases.sh` 74/74, `hr/bl_billing.sh` 81/81, `hr/w_warehouse.sh` 71/71, `hr/h1a4_master_conversion.sh` 39/39, `hr/a1a3_stock_rates.sh` 42/42, `hr/b_terms.sh` 89/89, `hr/a2_sales.sh` 75/75; `pw/w_vendors_ui` 80/80, `pw/bl_invoices_ui` 52/52, `pw/w_materials_ui` 70/70, `pw/b_terms_ui` 144/144, `pw/h1a4_ui` 70/70, `pw/a1a3_ui` 126/126, `pw/a2_ui` 210/210, `pw/b2_ui` 106/106 (DN05 was failing since step 5: two elements had the test id `bill-due`; the due date's is now `bill-due-date`); full regression 2150 passed, 3 known fails (M04, V10, PT03). No migration.

| Check | Expected | Note |
|---|---|---|
| Vendor → Add purchase bill → Line 1 Material: type "polycub" | Both Polycab cables under "Did you mean". | A word of 5+ letters may carry one typo. |
| Same field: "8544", then "17.2" | Only the cables (HSN starts with 8544); then the earthing rod "(17.2 mm x 3 m)" with "Bought in Pcs/Nos · ₹1,450/Pcs/Nos · HSN 74130000 · Earthing". | Search: every word, any order, in the name, size or category, or the start of the HSN. |
| Press Esc with the list open | The list closes; the bill stays open. | |
| Type a cable that isn't in stock ("Havells Solar DC Cable 4 sq mm – 100 m coil"), ↓ to "New stock item “…”", Enter | The small "New stock item" dialog: the typed name; "Similar items already in stock" (the Polycab 4 sq mm coil) with "Use this"; Category to choose (or taken from the closest item); GST 18 %. | Only with the stock create right. |
| Bought in Coil, Issued in Meter, rates 3150 / 3700, Add | "Meter per coil: enter how the units convert …". Enter 100 → "1 Coil = 100 Meter", "= ₹31.5 per Meter", "= ₹37 per Meter". Add → the line shows the cable, Qty (Coil), ₹3,150, GST 18 %, the cursor in Qty. | HSN "8544 4999" is saved as 85444999. |
| Line 2: + on "polycab solar dc cable 4 sq mm – 90 m coil" | "Already in stock: …"; Add refused ("… is already in stock. Use it, …"); "Use this" puts it on line 2 at ₹3,200. | The server refuses the same name too (409). |
| Save bill (goods received) → Materials → the new cable | 3 coils = 300 m in stock; details "1 coil = 100 m", sale ₹3,700.00 per coil = ₹37.00 per metre. | |
| Customer → Create invoice; Tab to "Add item", Enter | The cursor is in the new line's Description. | Keyboard only from here. |
| Type "havels 4sqmm", ↓, Enter, type 45 | The line: the new cable, HSN 85444999, unit meter, ₹37, GST 18 %; "From stock: … · 1 Coil = 100 Meter · Unlink"; 45 m → ₹1,964.70. | Typing alone never picks: ↓ then Enter. |
| Add item, type "MC4 connector pair (local market, loose)", Tab | The text stays; amber "Not from stock — a typed line …". Saved and opened, the bill shows "Not from stock" under it. | Q15: allowed for one-off items. |
| Add service, type "jvvnl inspection", ↓ Enter | Net meter liaisoning (by its description): SAC 998399, ₹3,500, "From the services list". | |
| Add service, type "Structure anti-rust painting", + | "New service": SAC 998719, rate 2500 → Add service → it is on the line and in the services list. | Billing create right. |
| Sign in as a project admin → Create invoice → Add item, type "polycab 6" | The cable is found; no "New stock item" row and no + on the item line; the service line has its +. | The server refuses a stock item from this login (403). |
| Widths 1440 / 768 / 390 | The lists open under the field (above it when there is no room), never cut off by the drawer; the dialogs scroll on a phone; no sideways scroll. | |
