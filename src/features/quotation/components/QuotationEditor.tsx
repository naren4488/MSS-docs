import type { ReactNode } from "react";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { ImageUploader } from "@/features/offer-letter/components/ImageUploader";
import { BulletListEditor } from "@/features/offer-letter/components/BulletListEditor";
import type { AgreementCompany } from "@/features/agreement/types/agreement";
import type { QuotationData, QuotationGeneration, QuotationPhase } from "../types/quotation";
import { CommercialOfferEditor, MaterialItemEditor, TermItemEditor } from "./QuotationRowEditors";
import { stripSyncedCommercialRows, computeEffectivePayable, formatInrGrouped } from "../lib/quotation-formatters";
import { applyCommercialCapacityToMaterials, applyOffgridCapacityToMaterials, applyPhaseToMaterialItems, isCommercialQuotation, isOffgridQuotation, offgridProjectAmount, syncOffgridOfferToCapacity } from "../lib/quotation-defaults";

interface QuotationEditorProps {
  data: QuotationData;
  onChange: (next: QuotationData) => void;
}

function AccordionSection({
  title,
  helper,
  children,
  defaultOpen = false,
}: {
  title: string;
  helper?: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className="editor-section">
      <button className="accordion-trigger" type="button" onClick={() => setOpen((value) => !value)}>
        <span>{title}</span>
        <ChevronDown size={18} style={{ transform: open ? "rotate(180deg)" : undefined, transition: "transform 0.2s ease" }} />
      </button>
      {open ? (
        <div className="accordion-content">
          {helper ? <p className="helper-text">{helper}</p> : null}
          {children}
        </div>
      ) : null}
    </section>
  );
}

export function QuotationEditor({ data, onChange }: QuotationEditorProps) {
  function update<K extends keyof QuotationData>(key: K, value: QuotationData[K]) {
    onChange({ ...data, [key]: value });
  }

  function updateCompany<K extends keyof AgreementCompany>(key: K, value: AgreementCompany[K]) {
    onChange({ ...data, company: { ...data.company, [key]: value } });
  }

  function updateGeneration<K extends keyof QuotationGeneration>(key: K, value: QuotationGeneration[K]) {
    onChange({ ...data, generation: { ...data.generation, [key]: value } });
  }

  const commercial = isCommercialQuotation(data);
  const offgrid = isOffgridQuotation(data);
  const sizesFromCapacity = commercial || offgrid;

  function applyCommercialSizing(capacity: string, phase: QuotationPhase) {
    return {
      materialItems: applyCommercialCapacityToMaterials(data.materialItems, capacity, phase, data.language),
    };
  }

  function applyOffgridSizing(capacity: string, phase: QuotationPhase) {
    return {
      materialItems: applyOffgridCapacityToMaterials(data.materialItems, capacity, phase, data.language),
      commercialOffer: syncOffgridOfferToCapacity(data.commercialOffer, capacity, data.language),
      projectAmount: offgridProjectAmount(capacity) || data.projectAmount,
    };
  }

  return (
    <div className="stack">
      <AccordionSection title="Company (Letterhead)" helper="Appears in the header on page 1.">
        <ImageUploader label="Company Logo" value={data.company.logoUrl} onChange={(value) => updateCompany("logoUrl", value)} />
        <div className="field-grid">
          <div className="field full-span">
            <label>Company Name *</label>
            <input value={data.company.name} onChange={(event) => updateCompany("name", event.target.value)} />
          </div>
          <div className="field">
            <label>Phone</label>
            <input value={data.company.phone} onChange={(event) => updateCompany("phone", event.target.value)} />
          </div>
          <div className="field">
            <label>Email</label>
            <input value={data.company.email} onChange={(event) => updateCompany("email", event.target.value)} />
          </div>
          <div className="field full-span">
            <label>Address</label>
            <textarea rows={2} value={data.company.address} onChange={(event) => updateCompany("address", event.target.value)} />
          </div>
          <div className="field">
            <label>GST Number</label>
            <input value={data.company.gst} onChange={(event) => updateCompany("gst", event.target.value)} />
          </div>
        </div>
      </AccordionSection>

      <AccordionSection title="Proposal Header" helper="Title, date, cover image and tagline.">
        <div className="stack">
          <div className="field-grid">
            <div className="field">
              <label>Title</label>
              <input value={data.title} onChange={(event) => update("title", event.target.value)} />
            </div>
            <div className="field">
              <label>Date of Proposal</label>
              <input type="date" value={data.proposalDate} onChange={(event) => update("proposalDate", event.target.value)} />
            </div>
          </div>
          <ImageUploader label="Cover / Hero Image" value={data.coverImageUrl} onChange={(value) => update("coverImageUrl", value)} />
          <div className="field">
            <label>Tagline</label>
            <input value={data.tagline} onChange={(event) => update("tagline", event.target.value)} />
          </div>
        </div>
      </AccordionSection>

      <AccordionSection
        title="Customer Details"
        helper={
          offgrid
            ? "Customer, site address and plant capacity. Panel qty, Microtek PCU kW, battery count and project amount update from the plant kW (₹2,60,000 for 3 kW)."
            : commercial
              ? "Customer, site address, plant capacity and commercial site facts. Panel qty and inverter kW update from the plant kW."
              : "Customer, site address, plant capacity and phase."
        }
        defaultOpen
      >
        <div className="field-grid">
          <div className="field">
            <label>Customer Name</label>
            <input value={data.customerName} onChange={(event) => update("customerName", event.target.value)} />
          </div>
          <div className="field">
            <label>Customer Phone</label>
            <input value={data.customerPhone} placeholder="e.g. 9876543210" onChange={(event) => update("customerPhone", event.target.value)} />
          </div>
          <div className="field">
            <label>Customer Email (optional)</label>
            <input
              type="email"
              value={data.customerEmail}
              placeholder="Shown on PDF only if filled"
              onChange={(event) => update("customerEmail", event.target.value)}
            />
          </div>
          <div className="field">
            <label>Capacity of Power Plant</label>
            <input
              value={data.capacity}
              placeholder={commercial ? "e.g. 100 KW" : "e.g. 3 KW"}
              onChange={(event) => {
                const capacity = event.target.value;
                if (!sizesFromCapacity || !/^\s*\d+(?:\.\d+)?\s*(kwp?|kilowatt)/i.test(capacity)) {
                  update("capacity", capacity);
                  return;
                }
                onChange({
                  ...data,
                  capacity,
                  ...(offgrid ? applyOffgridSizing(capacity, data.phase) : applyCommercialSizing(capacity, data.phase)),
                });
              }}
              onBlur={(event) => {
                if (!sizesFromCapacity) return;
                const capacity = event.target.value;
                onChange({
                  ...data,
                  capacity,
                  ...(offgrid ? applyOffgridSizing(capacity, data.phase) : applyCommercialSizing(capacity, data.phase)),
                });
              }}
            />
          </div>
          {offgrid ? null : (
            <div className="field">
              <label>System Phase</label>
              <select
                value={data.phase}
                onChange={(event) => {
                  const phase = event.target.value as QuotationPhase;
                  onChange({
                    ...data,
                    phase,
                    ...(commercial
                      ? applyCommercialSizing(data.capacity, phase)
                      : { materialItems: applyPhaseToMaterialItems(data.materialItems, phase, data.language) }),
                  });
                }}
              >
                <option value="1PH">Single Phase (1PH)</option>
                <option value="3PH">Three Phase (3PH)</option>
              </select>
            </div>
          )}
          <div className="field full-span">
            <label>Address</label>
            <textarea rows={2} value={data.address} onChange={(event) => update("address", event.target.value)} />
          </div>
          {commercial ? (
            <>
              <div className="field">
                <label>Sanction load</label>
                <input
                  value={data.sanctionLoad}
                  placeholder="e.g. 150 kW"
                  onChange={(event) => update("sanctionLoad", event.target.value)}
                />
              </div>
              <div className="field">
                <label>Shadow-free area</label>
                <input
                  value={data.shadowFreeArea}
                  placeholder="e.g. 8000 sq. ft."
                  onChange={(event) => update("shadowFreeArea", event.target.value)}
                />
              </div>
              <div className="field">
                <label>Connection type</label>
                <input
                  value={data.connectionType}
                  placeholder="e.g. HT Three Phase"
                  onChange={(event) => update("connectionType", event.target.value)}
                />
              </div>
              <div className="field">
                <label>Type of roof</label>
                <input
                  value={data.roofType}
                  placeholder="e.g. Tin shed / RCC rooftop"
                  onChange={(event) => update("roofType", event.target.value)}
                />
              </div>
            </>
          ) : null}
        </div>
      </AccordionSection>

      <AccordionSection
        title="Material Description"
        helper={
          offgrid
            ? "Off-grid BOM: 5 × Waaree 590 Wp Topcon Bifacial, Microtek 5.1 kW PCU, DC cable, 5 × Luminous 220 Ah tubular. No earthing, LA, AC cable, AC/DC DB, or solar meter. Solar Plant Capacity on the PDF follows the Solar PV Modules row. Drag items to reorder."
            : commercial
              ? "Commercial BOM: cables as per site, ESE LA, HT generation meter, ACDB panel, cable tray / walkway / MCS. Solar Plant Capacity on the PDF follows the Solar PV Modules row. Drag items to reorder."
              : "Bill of materials. Solar Plant Capacity on the PDF follows the Solar PV Modules row. Drag items to reorder."
        }
        defaultOpen
      >
        <MaterialItemEditor items={data.materialItems} onChange={(next) => update("materialItems", next)} />
      </AccordionSection>

      <AccordionSection title="Assumptions">
        <BulletListEditor label="Assumptions" items={data.assumptions} onChange={(next) => update("assumptions", next)} />
      </AccordionSection>

      <AccordionSection title="Customer Scope">
        <BulletListEditor label="Customer Scope" items={data.customerScope} onChange={(next) => update("customerScope", next)} />
      </AccordionSection>

      {commercial || offgrid ? (
        <AccordionSection title="Scope of Work" helper="MSS design, supply, testing and commissioning.">
          <BulletListEditor label="Scope of Work" items={data.ourScope} onChange={(next) => update("ourScope", next)} />
        </AccordionSection>
      ) : null}

      <AccordionSection
        title="Commercial Offer"
        helper={
          offgrid
            ? "Solar Plant Capacity on the PDF is filled from Solar PV Modules (qty, wattage and make). Plant kW sets the project amount (₹2,60,000 for 3 kW). Customer Net Payable and the turnkey price box follow that amount."
            : commercial
              ? "Solar Plant Capacity on the PDF is filled from Solar PV Modules (qty, wattage and make). Project amount fills Customer Net Payable and the turnkey EPC price box. DISCOM charges stay extra as actual."
              : data.showSubsidySection
                ? "Solar Plant Capacity on the PDF is filled from Solar PV Modules (qty, wattage and make). Project amount fills Customer Net Payable and the investment box on the PDF."
                : "Solar Plant Capacity on the PDF is filled from Solar PV Modules (qty, wattage and make). Project amount fills Customer Net Payable on the PDF. Subsidy section is hidden."
        }
        defaultOpen
      >
        <div className="field-grid" style={{ marginBottom: 12 }}>
          <div className="field full-span">
            <label>Project Amount (incl. GST) (₹)</label>
            <input value={data.projectAmount} placeholder="e.g. 1,80,000" onChange={(event) => update("projectAmount", event.target.value)} />
          </div>
        </div>
        <CommercialOfferEditor
          rows={stripSyncedCommercialRows(data.commercialOffer)}
          onChange={(next) => update("commercialOffer", stripSyncedCommercialRows(next))}
        />
      </AccordionSection>

      {offgrid ? null : (
      <AccordionSection
        title="Solar Power Generation"
        helper="Day / month / year figures auto-calculate from panel watt × qty. Year 1 = 4 units/kW/day; years 2–5 = 3.9 units/kW/day."
      >
        <div className="toggle-row" style={{ marginBottom: 12 }}>
          <span>Show Generation Table</span>
          <button
            className={`toggle ${data.showGeneration ? "on" : ""}`}
            type="button"
            onClick={() => update("showGeneration", !data.showGeneration)}
          >
            <span className="toggle-thumb" />
          </button>
        </div>
        {data.showGeneration ? (
          <div className="field-grid">
            <div className="field">
              <label>Saving unit rate (₹ / unit)</label>
              <input
                value={data.generation.unitRate}
                placeholder="8"
                onChange={(event) => updateGeneration("unitRate", event.target.value)}
              />
            </div>
            <div className="field full-span">
              <p className="helper-text" style={{ margin: 0 }}>
                Preview updates automatically when you change solar panel quantity or wattage in Material Description.
              </p>
            </div>
          </div>
        ) : null}
      </AccordionSection>
      )}

      <AccordionSection
        title="Warranty Badges"
        helper={
          offgrid
            ? "Panel shows 30 years. Inverter and battery show as per MICROTEK company warranty. Setup & BOS stays at 5 years."
            : "The 'Up to N Years' circular badges."
        }
      >
        <div className="toggle-row" style={{ marginBottom: 12 }}>
          <span>Show Warranty Badges</span>
          <button
            className={`toggle ${data.showWarrantyBadges ? "on" : ""}`}
            type="button"
            onClick={() => update("showWarrantyBadges", !data.showWarrantyBadges)}
          >
            <span className="toggle-thumb" />
          </button>
        </div>
        {data.showWarrantyBadges ? (
          <div className="field-grid">
            <div className="field">
              <label>Solar Panel Warranty (years)</label>
              <input value={data.warrantySolarPanelYears} onChange={(event) => update("warrantySolarPanelYears", event.target.value)} />
            </div>
            {offgrid ? (
              <>
                <div className="field">
                  <label>Setup & BOS Warranty (years)</label>
                  <input value={data.warrantySetupBosYears} onChange={(event) => update("warrantySetupBosYears", event.target.value)} />
                </div>
                <div className="field full-span">
                  <p className="helper-text" style={{ margin: 0 }}>
                    Inverter and battery badges always show “As per MICROTEK company warranty” on the PDF.
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="field">
                  <label>Inverter Warranty (years)</label>
                  <input value={data.warrantyInverterYears} onChange={(event) => update("warrantyInverterYears", event.target.value)} />
                </div>
                <div className="field">
                  <label>Setup & BOS Warranty (years)</label>
                  <input value={data.warrantySetupBosYears} onChange={(event) => update("warrantySetupBosYears", event.target.value)} />
                </div>
              </>
            )}
          </div>
        ) : null}
      </AccordionSection>

      <AccordionSection title="Installation Process" helper="Numbered step diagram. Edit or reorder the steps.">
        <div className="toggle-row" style={{ marginBottom: 12 }}>
          <span>Show Installation Process</span>
          <button
            className={`toggle ${data.showInstallationProcess ? "on" : ""}`}
            type="button"
            onClick={() => update("showInstallationProcess", !data.showInstallationProcess)}
          >
            <span className="toggle-thumb" />
          </button>
        </div>
        {data.showInstallationProcess ? (
          <BulletListEditor label="Steps" items={data.installationSteps} onChange={(next) => update("installationSteps", next)} />
        ) : null}
      </AccordionSection>

      {commercial || offgrid ? null : (
      <AccordionSection title="Effective Investment Section" helper="Subsidies only. Effective payable is calculated as project amount minus total subsidy.">
        <div className="toggle-row" style={{ marginBottom: 12 }}>
          <span>Show Subsidy Section</span>
          <button
            className={`toggle ${data.showSubsidySection ? "on" : ""}`}
            type="button"
            onClick={() => update("showSubsidySection", !data.showSubsidySection)}
          >
            <span className="toggle-thumb" />
          </button>
        </div>
        {data.showSubsidySection ? (
        <div className="field-grid">
          <div className="field">
            <label>Central Subsidy (₹)</label>
            <input value={data.centralSubsidy} placeholder="e.g. 78,000" onChange={(event) => update("centralSubsidy", event.target.value)} />
          </div>
          <div className="field">
            <label>State Subsidy (₹)</label>
            <input value={data.stateSubsidy} placeholder="e.g. 17,000" onChange={(event) => update("stateSubsidy", event.target.value)} />
          </div>
          <div className="field">
            <label>Effective Payable Amount (₹) — auto</label>
            <input
              readOnly
              value={formatInrGrouped(String(computeEffectivePayable(data.projectAmount, data.centralSubsidy, data.stateSubsidy)))}
            />
          </div>
          <div className="field full-span">
            <label>Subsidy Eligibility Note</label>
            <textarea rows={2} value={data.subsidyNote} onChange={(event) => update("subsidyNote", event.target.value)} />
          </div>
        </div>
        ) : (
          <p className="helper-text" style={{ margin: 0 }}>
            Hidden on the PDF. Subsidy amounts stay saved if you turn this back on.
          </p>
        )}
      </AccordionSection>
      )}

      <AccordionSection title="EMI & Financing Options">
        <div className="toggle-row" style={{ marginBottom: 12 }}>
          <span>Show EMI & Financing Section</span>
          <button
            className={`toggle ${data.showEmiSection ? "on" : ""}`}
            type="button"
            onClick={() => update("showEmiSection", !data.showEmiSection)}
          >
            <span className="toggle-thumb" />
          </button>
        </div>
        {data.showEmiSection ? (
          <div className="field-grid">
            <div className="field full-span">
              <label>Loan Amount (₹) - Auto: {data.emiInfo.uptoLoanAmount}</label>
              <input value={data.emiInfo.uptoLoanAmount} placeholder="e.g. ₹2,00,000" onChange={(event) => update("emiInfo", { ...data.emiInfo, uptoLoanAmount: event.target.value })} />
            </div>
            <div className="field full-span">
              <label>Interest Rate - Auto: {data.emiInfo.interestRate}</label>
              <input value={data.emiInfo.interestRate} placeholder="e.g. ~6% per annum" onChange={(event) => update("emiInfo", { ...data.emiInfo, interestRate: event.target.value })} />
            </div>
            <div className="field">
              <label>5-Year EMI - Auto: {data.emiInfo.tenure5YearEmi}</label>
              <input value={data.emiInfo.tenure5YearEmi} placeholder="e.g. ₹3,865/month" onChange={(event) => update("emiInfo", { ...data.emiInfo, tenure5YearEmi: event.target.value })} />
            </div>
            <div className="field">
              <label>7-Year EMI - Auto: {data.emiInfo.tenure7YearEmi}</label>
              <input value={data.emiInfo.tenure7YearEmi} placeholder="e.g. ₹2,790/month" onChange={(event) => update("emiInfo", { ...data.emiInfo, tenure7YearEmi: event.target.value })} />
            </div>
            <div className="field">
              <label>10-Year EMI - Auto: {data.emiInfo.tenure10YearEmi}</label>
              <input value={data.emiInfo.tenure10YearEmi} placeholder="e.g. ₹1,983/month" onChange={(event) => update("emiInfo", { ...data.emiInfo, tenure10YearEmi: event.target.value })} />
            </div>
          </div>
        ) : null}
      </AccordionSection>

      <AccordionSection title="Warranty & Maintenance">
        <div className="toggle-row" style={{ marginBottom: 12 }}>
          <span>Show Component Warranty & Maintenance</span>
          <button
            className={`toggle ${data.showComponentWarranty ? "on" : ""}`}
            type="button"
            onClick={() => update("showComponentWarranty", !data.showComponentWarranty)}
          >
            <span className="toggle-thumb" />
          </button>
        </div>
        {data.showComponentWarranty ? (
          <div className="field-grid">
            <div className="field">
              <label>Maintenance Frequency</label>
              <input value={data.maintenanceFrequency} placeholder="e.g. Quarterly" onChange={(event) => update("maintenanceFrequency", event.target.value)} />
            </div>
            <div className="field full-span">
              <label>Maintenance After 2 Years</label>
              <input value={data.maintenanceAfterYears} placeholder="e.g. Available at competitive rates" onChange={(event) => update("maintenanceAfterYears", event.target.value)} />
            </div>
          </div>
        ) : null}
      </AccordionSection>

      <AccordionSection title="Additional Notes">
        <div className="field-grid">
          {offgrid ? (
            <div className="field full-span">
              <label>Off-grid plant note</label>
              <textarea rows={3} value={data.onGridNote} onChange={(event) => update("onGridNote", event.target.value)} />
            </div>
          ) : commercial ? (
            <>
              <div className="field full-span">
                <label>On-grid plant note</label>
                <textarea rows={3} value={data.onGridNote} onChange={(event) => update("onGridNote", event.target.value)} />
              </div>
              <div className="field full-span">
                <label>DISCOM / statutory charges</label>
                <input value={data.discomChargesNote} onChange={(event) => update("discomChargesNote", event.target.value)} />
              </div>
            </>
          ) : null}
          {offgrid ? null : (
            <>
              <div className="field full-span">
                <label>Net Metering Note</label>
                <input value={data.netMeteringNote} onChange={(event) => update("netMeteringNote", event.target.value)} />
              </div>
              <div className="field full-span">
                <label>Load Extension Note</label>
                <textarea rows={2} value={data.loadExtensionNote} onChange={(event) => update("loadExtensionNote", event.target.value)} />
              </div>
            </>
          )}
        </div>
      </AccordionSection>

      <AccordionSection title="Terms & Conditions">
        <TermItemEditor items={data.terms} onChange={(next) => update("terms", next)} />
      </AccordionSection>

      {!commercial && !offgrid && data.showSubsidySection ? (
      <AccordionSection title="Required Documents for Subsidy">
        <BulletListEditor label="Documents" items={data.subsidyDocuments} onChange={(next) => update("subsidyDocuments", next)} />
      </AccordionSection>
      ) : null}

      <AccordionSection title="Bank Details">
        <div className="field-grid">
          <div className="field full-span">
            <label>Account Name</label>
            <input value={data.bankAccountName} onChange={(event) => update("bankAccountName", event.target.value)} />
          </div>
          <div className="field">
            <label>Bank</label>
            <input value={data.bankName} onChange={(event) => update("bankName", event.target.value)} />
          </div>
          <div className="field">
            <label>A/c No.</label>
            <input value={data.bankAccountNo} onChange={(event) => update("bankAccountNo", event.target.value)} />
          </div>
          <div className="field">
            <label>IFSC Code</label>
            <input value={data.bankIfsc} onChange={(event) => update("bankIfsc", event.target.value)} />
          </div>
          <div className="field">
            <label>GST No.</label>
            <input value={data.bankGst} onChange={(event) => update("bankGst", event.target.value)} />
          </div>
        </div>
      </AccordionSection>

      <AccordionSection title="Represented By">
        <div className="field-grid">
          <div className="field">
            <label>Name</label>
            <input value={data.repName} onChange={(event) => update("repName", event.target.value)} />
          </div>
          <div className="field">
            <label>Title</label>
            <input value={data.repTitle} onChange={(event) => update("repTitle", event.target.value)} />
          </div>
          <div className="field full-span">
            <label>Company</label>
            <input value={data.repCompany} onChange={(event) => update("repCompany", event.target.value)} />
          </div>
          <div className="field full-span">
            <label>Mobile Number(s)</label>
            <input value={data.repMobiles} onChange={(event) => update("repMobiles", event.target.value)} />
          </div>
        </div>
      </AccordionSection>

      <AccordionSection title="Settings">
        <div className="toggle-grid">
        <div className="toggle-row">
            <span>Show Solar Panel Wattage Info</span>
            <button
              className={`toggle ${data.showWattageInfo ? "on" : ""}`}
              type="button"
              onClick={() => update("showWattageInfo", !data.showWattageInfo)}
            >
              <span className="toggle-thumb" />
            </button>
          </div>
          
          <div className="toggle-row">
            <span>Show Letterhead Header on Page 1</span>
            <button
              className={`toggle ${data.showLetterhead ? "on" : ""}`}
              type="button"
              onClick={() => update("showLetterhead", !data.showLetterhead)}
            >
              <span className="toggle-thumb" />
            </button>
          </div>
          <div className="toggle-row">
            <span>Show Page Numbers</span>
            <button
              className={`toggle ${data.showPageNumbers ? "on" : ""}`}
              type="button"
              onClick={() => update("showPageNumbers", !data.showPageNumbers)}
            >
              <span className="toggle-thumb" />
            </button>
          </div>
        </div>
      </AccordionSection>
    </div>
  );
}
