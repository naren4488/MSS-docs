import type { ReactNode } from "react";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { ImageUploader } from "@/features/offer-letter/components/ImageUploader";
import { BulletListEditor } from "@/features/offer-letter/components/BulletListEditor";
import type { AgreementCompany } from "@/features/agreement/types/agreement";
import type {
  QuotationData,
  QuotationGeneration,
  QuotationIssuer,
  QuotationPhase,
  QuotationAcCableBrand,
  QuotationEarthingWireOption,
  QuotationPanelBrand,
  QuotationStructureBrand,
  QuotationSubsidyScope,
} from "../types/quotation";
import { CommercialOfferEditor, MaterialItemEditor, TermItemEditor } from "./QuotationRowEditors";
import { stripSyncedCommercialRows, computeEffectivePayable, formatInrGrouped } from "../lib/quotation-formatters";
import {
  applyAcCableBrandToMaterials,
  applyCommercialCapacityToMaterials,
  applyEarthingWireToMaterials,
  applyOffgridCapacityToMaterials,
  applyPanelBrandToMaterials,
  applyPhaseToMaterialItems,
  applyQuotationIssuer,
  applyStructureBrandToMaterials,
  defaultSubsidyNote,
  isCommercialQuotation,
  isOffgridQuotation,
  offgridProjectAmount,
  resolveEarthingWireOption,
  resolvePanelBrand,
  resolveQuotationIssuer,
  syncOffgridOfferToCapacity,
} from "../lib/quotation-defaults";

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
  const issuer = resolveQuotationIssuer(data.issuer);

  function applyCommercialSizing(capacity: string, phase: QuotationPhase) {
    return {
      materialItems: applyCommercialCapacityToMaterials(data.materialItems, capacity, phase, data.language, {
        acCableBrand: data.acCableBrand === "Polycab" ? "Polycab" : "Ramsons",
      }),
    };
  }

  function applyOffgridSizing(capacity: string, phase: QuotationPhase) {
    return {
      materialItems: applyOffgridCapacityToMaterials(data.materialItems, capacity, phase, data.language),
      commercialOffer: syncOffgridOfferToCapacity(data.commercialOffer, capacity, data.language),
      projectAmount: offgridProjectAmount(capacity) || data.projectAmount,
    };
  }

  function setIssuer(next: QuotationIssuer) {
    if (next === issuer) return;
    onChange(applyQuotationIssuer(data, next));
  }

  return (
    <div className="stack">
      <AccordionSection
        title="Company (Letterhead)"
        helper="Switch MSS / MSE to fill logo, GST, bank and signatory. You can still edit fields after switching."
        defaultOpen
      >
        <div className="field" style={{ marginBottom: 12 }}>
          <label>Issue as</label>
          <div className="segmented-control" role="group" aria-label="Quotation issuer">
            <button
              type="button"
              className={`segment-button ${issuer === "mss" ? "active" : ""}`}
              onClick={() => setIssuer("mss")}
            >
              MSS
            </button>
            <button
              type="button"
              className={`segment-button ${issuer === "mse" ? "active" : ""}`}
              onClick={() => setIssuer("mse")}
            >
              MSE
            </button>
          </div>
          <p className="helper-text" style={{ marginTop: 6 }}>
            {issuer === "mse"
              ? "Mahi Solar Energy — proprietorship letterhead, bank and GST."
              : "Mahi Solar Solution Pvt Ltd — company letterhead, bank and GST."}
          </p>
        </div>
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
            ? "Grouped by customer, plant options and pricing. Capacity updates BOM qty and project amount (₹2,60,000 for 3 kW)."
            : commercial
              ? "Grouped by customer, plant options, site facts and pricing. Capacity updates panel qty and inverter kW."
              : "Grouped by customer, plant options and pricing. Subsidy and EMI control what appears on the PDF."
        }
        defaultOpen
      >
        <div className="editor-fieldset">
          <p className="editor-fieldset-title">Customer</p>
          <div className="field-grid">
            <div className="field">
              <label>Name</label>
              <input value={data.customerName} onChange={(event) => update("customerName", event.target.value)} />
            </div>
            <div className="field">
              <label>Phone</label>
              <input value={data.customerPhone} placeholder="e.g. 9876543210" onChange={(event) => update("customerPhone", event.target.value)} />
            </div>
            <div className="field full-span">
              <label>Email (optional)</label>
              <input
                type="email"
                value={data.customerEmail}
                placeholder="Shown on PDF only if filled"
                onChange={(event) => update("customerEmail", event.target.value)}
              />
            </div>
            <div className="field full-span">
              <label>Address</label>
              <textarea rows={2} value={data.address} onChange={(event) => update("address", event.target.value)} />
            </div>
          </div>
        </div>

        <div className="editor-fieldset">
          <p className="editor-fieldset-title">Plant & materials</p>
          <div className="field-grid">
            <div className="field">
              <label>Capacity</label>
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
            {offgrid ? (
              <div className="field">
                <label>Structure</label>
                <select
                  value={data.structureBrand === "Tata" ? "Tata" : "Apollo"}
                  onChange={(event) => {
                    const structureBrand = event.target.value as QuotationStructureBrand;
                    onChange({
                      ...data,
                      structureBrand,
                      materialItems: applyStructureBrandToMaterials(data.materialItems, structureBrand, data.language),
                    });
                  }}
                >
                  <option value="Apollo">Apollo · Leg 75×75</option>
                  <option value="Tata">Tata · Leg 72×72</option>
                </select>
              </div>
            ) : (
              <div className="field">
                <label>Phase</label>
                <select
                  value={data.phase}
                  onChange={(event) => {
                    const phase = event.target.value as QuotationPhase;
                    onChange({
                      ...data,
                      phase,
                      ...(commercial
                        ? applyCommercialSizing(data.capacity, phase)
                        : {
                            materialItems: applyPhaseToMaterialItems(
                              data.materialItems,
                              phase,
                              data.language,
                              data.acCableBrand === "Polycab" ? "Polycab" : "Ramsons",
                            ),
                          }),
                    });
                  }}
                >
                  <option value="1PH">Single Phase (1PH)</option>
                  <option value="3PH">Three Phase (3PH)</option>
                </select>
              </div>
            )}
            {offgrid ? null : (
              <div className="field">
                <label>Structure</label>
                <select
                  value={data.structureBrand === "Tata" ? "Tata" : "Apollo"}
                  onChange={(event) => {
                    const structureBrand = event.target.value as QuotationStructureBrand;
                    onChange({
                      ...data,
                      structureBrand,
                      materialItems: applyStructureBrandToMaterials(data.materialItems, structureBrand, data.language),
                    });
                  }}
                >
                  <option value="Apollo">Apollo · Leg 75×75</option>
                  <option value="Tata">Tata · Leg 72×72</option>
                </select>
              </div>
            )}
            <div className="field">
              <label>Panels</label>
              <select
                value={resolvePanelBrand(data.panelBrand ?? (offgrid ? "Waaree" : "Adani"))}
                onChange={(event) => {
                  const panelBrand = event.target.value as QuotationPanelBrand;
                  onChange({
                    ...data,
                    panelBrand,
                    materialItems: applyPanelBrandToMaterials(data.materialItems, panelBrand, data.language),
                  });
                }}
              >
                <option value="Adani">Adani</option>
                <option value="Waaree">Waaree</option>
                <option value="INA">INA</option>
              </select>
            </div>
            {offgrid ? null : (
              <>
                <div className="field">
                  <label>AC Cable</label>
                  <select
                    value={data.acCableBrand === "Polycab" ? "Polycab" : "Ramsons"}
                    onChange={(event) => {
                      const acCableBrand = event.target.value as QuotationAcCableBrand;
                      onChange({
                        ...data,
                        acCableBrand,
                        materialItems: applyAcCableBrandToMaterials(
                          data.materialItems,
                          acCableBrand,
                          data.phase,
                          data.language,
                          commercial ? { commercial: true, capacity: data.capacity } : undefined,
                        ),
                      });
                    }}
                  >
                    <option value="Ramsons">Ramsons · Al armoured</option>
                    <option value="Polycab">Polycab · Al armoured</option>
                  </select>
                </div>
                <div className="field">
                  <label>Earthing Wire</label>
                  <select
                    value={resolveEarthingWireOption(data.earthingWire)}
                    onChange={(event) => {
                      const earthingWire = event.target.value as QuotationEarthingWireOption;
                      onChange({
                        ...data,
                        earthingWire,
                        materialItems: applyEarthingWireToMaterials(data.materialItems, earthingWire, data.language),
                      });
                    }}
                  >
                    <option value="Polycab25">2.5 sq mm copper (Polycab)</option>
                    <option value="Indo6">6 sq mm copper clad (Indo)</option>
                    <option value="Ramsons16">16 sq mm aluminium (Ramsons)</option>
                    <option value="IndoOrRamsons">6 sq mm Indo or 16 sq mm Ramsons</option>
                  </select>
                </div>
              </>
            )}
          </div>
        </div>

        {commercial ? (
          <div className="editor-fieldset">
            <p className="editor-fieldset-title">Site facts</p>
            <div className="field-grid">
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
            </div>
          </div>
        ) : null}

        <div className="editor-fieldset">
          <p className="editor-fieldset-title">Pricing & PDF sections</p>
          <div className="field-grid">
            <div className="field">
              <label>Project Amount (incl. GST) (₹)</label>
              <input
                value={data.projectAmount}
                placeholder="e.g. 1,80,000"
                onChange={(event) => {
                  const projectAmount = event.target.value;
                  onChange({
                    ...data,
                    projectAmount,
                    effectivePayableAmount: String(
                      Math.max(
                        0,
                        computeEffectivePayable(
                          projectAmount,
                          data.centralSubsidy,
                          data.stateSubsidy,
                          data.subsidyScope === "central" ? "central" : "both",
                        ),
                      ),
                    ),
                  });
                }}
              />
            </div>
            <div className="field">
              <label>EMI & Financing</label>
              <select
                value={data.showEmiSection ? "show" : "hide"}
                onChange={(event) => update("showEmiSection", event.target.value === "show")}
              >
                <option value="show">Show on PDF</option>
                <option value="hide">Hide on PDF</option>
              </select>
            </div>
            {commercial || offgrid ? null : (
              <div className="field full-span">
                <label>Subsidy</label>
                <select
                  value={
                    data.showSubsidySection === false
                      ? "none"
                      : data.subsidyScope === "central"
                        ? "central"
                        : "both"
                  }
                  onChange={(event) => {
                    const value = event.target.value;
                    if (value === "none") {
                      onChange({ ...data, showSubsidySection: false });
                      return;
                    }
                    const subsidyScope = value as QuotationSubsidyScope;
                    const effectivePayableAmount = String(
                      Math.max(
                        0,
                        computeEffectivePayable(data.projectAmount, data.centralSubsidy, data.stateSubsidy, subsidyScope),
                      ),
                    );
                    onChange({
                      ...data,
                      showSubsidySection: true,
                      subsidyScope,
                      effectivePayableAmount,
                      subsidyNote: defaultSubsidyNote(data.language, subsidyScope),
                    });
                  }}
                >
                  <option value="both">Central + State</option>
                  <option value="central">Central only (MNRE)</option>
                  <option value="none">No subsidy (hide block)</option>
                </select>
              </div>
            )}
          </div>
        </div>

        <div className="editor-fieldset">
          <p className="editor-fieldset-title">Commercial offer</p>
          <p className="editor-fieldset-note">
            {offgrid
              ? "Rows on the PDF. Plant kW sets project amount; Customer Net Payable and turnkey price follow it. Solar Plant Capacity comes from Solar PV Modules."
              : commercial
                ? "Rows on the PDF. Project amount fills Customer Net Payable and the turnkey EPC box. DISCOM charges stay extra as actual."
                : data.showSubsidySection
                  ? "Rows on the PDF. Project amount fills Customer Net Payable and the investment box."
                  : "Rows on the PDF. Project amount fills Customer Net Payable. Subsidy block is hidden."}
          </p>
          <CommercialOfferEditor
            rows={stripSyncedCommercialRows(data.commercialOffer)}
            onChange={(next) => update("commercialOffer", stripSyncedCommercialRows(next))}
          />
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

      {commercial || offgrid || !data.showSubsidySection ? null : (
      <AccordionSection
        title="Effective Investment Section"
        helper="Controlled by Subsidy above. Effective payable is project amount minus total subsidy."
      >
        <div className="field-grid">
          <div className="field">
            <label>Central Subsidy (₹)</label>
            <input
              value={data.centralSubsidy}
              placeholder="e.g. 78,000"
              onChange={(event) => {
                const centralSubsidy = event.target.value;
                onChange({
                  ...data,
                  centralSubsidy,
                  effectivePayableAmount: String(
                    Math.max(
                      0,
                      computeEffectivePayable(
                        data.projectAmount,
                        centralSubsidy,
                        data.stateSubsidy,
                        data.subsidyScope === "central" ? "central" : "both",
                      ),
                    ),
                  ),
                });
              }}
            />
          </div>
          <div className="field">
            <label>State Subsidy (₹){data.subsidyScope === "central" ? " — not applied" : ""}</label>
            <input
              value={data.stateSubsidy}
              placeholder="e.g. 17,000"
              disabled={data.subsidyScope === "central"}
              onChange={(event) => {
                const stateSubsidy = event.target.value;
                onChange({
                  ...data,
                  stateSubsidy,
                  effectivePayableAmount: String(
                    Math.max(
                      0,
                      computeEffectivePayable(data.projectAmount, data.centralSubsidy, stateSubsidy, "both"),
                    ),
                  ),
                });
              }}
            />
          </div>
          <div className="field">
            <label>Effective Payable Amount (₹) — auto</label>
            <input
              readOnly
              value={formatInrGrouped(
                String(
                  computeEffectivePayable(
                    data.projectAmount,
                    data.centralSubsidy,
                    data.stateSubsidy,
                    data.subsidyScope === "central" ? "central" : "both",
                  ),
                ),
              )}
            />
          </div>
          <div className="field full-span">
            <label>Subsidy Eligibility Note</label>
            <textarea rows={2} value={data.subsidyNote} onChange={(event) => update("subsidyNote", event.target.value)} />
          </div>
        </div>
      </AccordionSection>
      )}

      {data.showEmiSection ? (
      <AccordionSection
        title="EMI & Financing Options"
        helper="Visibility is controlled by EMI & Financing in Customer Details."
      >
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
      </AccordionSection>
      ) : null}

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
