import { useMemo } from "react";
import { FilePlus2 } from "lucide-react";
import { Link } from "react-router-dom";
import { AGREEMENT_TEMPLATES, getAgreementTemplateLabel } from "../lib/agreement-defaults";
import { formatDate } from "../lib/agreement-formatters";
import { listAgreements } from "../lib/agreement-storage";
import { PARTNER_TEMPLATES } from "@/features/partner-agreement/lib/partner-agreement-defaults";
import type { AgreementData, AgreementRecord } from "../types/agreement";

type CardField = { label: string; value: string; mono?: boolean; emphasis?: boolean };

function agreementCardTitle(record: AgreementRecord): string {
  const entity = record.content.party.entityName.trim();
  if (entity) return entity;
  return record.name.replace(/\s*[—–-]\s*Vendor Code Agreement$/i, "").trim() || record.name || "Untitled Agreement";
}

function agreementInitials(title: string): string {
  const words = title.split(/\s+/).filter(Boolean);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return title.slice(0, 2).toUpperCase() || "AG";
}

function shortTemplateLabel(template: AgreementData["template"]): string {
  if (template === "partnership") return "Vendor Code";
  if (template === "project-referral") return "Project Referral";
  if (template === "client-agreement") return "Client Agreement";
  if (template === "inc-installation-assign") return "INC Assignment";
  if (template === "inc-goodwill-execution") return "INC Goodwill";
  return getAgreementTemplateLabel(template);
}

function agreementCardFields(content: AgreementData): CardField[] {
  const fields: CardField[] = [];
  const party = content.party;
  const repName = party.representativeName.trim();
  const repTitle = party.representativeTitle.trim();

  if (repName) fields.push({ label: "Representative", value: repName });
  if (repTitle) fields.push({ label: "Title", value: repTitle });
  if (content.partyIsIndividual) fields.push({ label: "Party", value: "Individual" });

  if (content.template === "partnership") {
    if (content.showVendorChargePerWatt) {
      const rate = content.vendorChargePerWatt.trim();
      fields.push({
        label: "Vendor charge",
        value: rate === "" ? "Not set" : `₹${rate}/watt`,
        emphasis: true,
      });
    } else {
      fields.push({ label: "Vendor charge", value: "Hidden on PDF" });
    }
  }

  if (content.template === "project-referral") {
    if (content.showReferralCommission) {
      const amount = content.referralCommissionAmount.trim();
      fields.push({
        label: "Commission",
        value: amount === "" ? "Not set" : `₹${amount}/project`,
        emphasis: true,
      });
    } else {
      fields.push({ label: "Commission", value: "Hidden on PDF" });
    }
  }

  if (party.gst?.trim()) fields.push({ label: "GST", value: party.gst.trim(), mono: true });
  if (content.showPartyPan && party.pan?.trim()) fields.push({ label: "PAN", value: party.pan.trim(), mono: true });
  if (party.aadhaar?.trim()) fields.push({ label: "Aadhaar", value: party.aadhaar.trim(), mono: true });

  return fields;
}

export function AllAgreements() {
  const records = useMemo(() => listAgreements(), []);

  return (
    <div className="page-shell">
      <section className="template-picker" style={{ marginBottom: 32 }}>
        <div className="panel-header">
          <div>
            <p className="eyebrow">Create New</p>
            <h2 style={{ margin: "4px 0 0" }}>Pick a template</h2>
            <p className="muted-text" style={{ marginTop: 8, marginBottom: 0 }}>
              Choose a template below to create a new agreement. Saved agreements appear further down.
            </p>
          </div>
          <p className="muted-text">
            Vendor, referral, client and MSE fixed-rate partner templates — each starts from the right baseline.
          </p>
        </div>
        <div className="template-grid">
          {AGREEMENT_TEMPLATES.map((template) => (
            <Link
              className="template-card"
              key={template.id}
              to={`/agreement?template=${template.id}`}
            >
              <div className="template-card-icon">
                <FilePlus2 size={20} />
              </div>
              <div>
                <h3>{template.label}</h3>
                <p className="muted-text" style={{ margin: 0 }}>{template.description}</p>
              </div>
            </Link>
          ))}
          {PARTNER_TEMPLATES.map((template) => (
            <Link
              className="template-card"
              key={`partner-${template.id}`}
              to={`/partner-agreement?deal=${template.id}`}
            >
              <div className="template-card-icon">
                <FilePlus2 size={20} />
              </div>
              <div>
                <h3>{template.label}</h3>
                <p className="muted-text" style={{ margin: 0 }}>{template.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <div className="maker-toolbar" style={{ marginBottom: 24 }}>
        <div className="maker-heading">
          <p className="eyebrow">Saved Documents</p>
          <h1>Agreements</h1>
          <p>Open any saved agreement to continue editing it.</p>
        </div>
      </div>

      {records.length === 0 ? (
        <div className="empty-card">
          <p className="eyebrow">Nothing Saved Yet</p>
          <h2 style={{ marginTop: 0 }}>No saved agreements yet</h2>
          <p className="muted-text">
            Pick a template above to start a new agreement. Saved agreements will appear here.
          </p>
        </div>
      ) : (
        <div className="saved-grid saved-grid--agreements">
          {records.map((record) => {
            const title = agreementCardTitle(record);
            const fields = agreementCardFields(record.content);
            return (
              <article className="saved-card saved-card--agreement" key={record.id}>
                <div className="saved-card-accent" aria-hidden />
                <div className="saved-card-body">
                  <div className="saved-card-identity">
                    <span className="saved-card-avatar" aria-hidden>
                      {agreementInitials(title)}
                    </span>
                    <div className="saved-card-heading">
                      <div className="saved-card-badges">
                        <span className="saved-card-badge">{shortTemplateLabel(record.content.template)}</span>
                        {record.signed ? <span className="saved-card-badge saved-card-badge--signed">Signed</span> : null}
                      </div>
                      <h3>{title}</h3>
                    </div>
                  </div>

                  {fields.length > 0 || record.signed ? (
                    <dl className="saved-card-facts">
                      {fields.map((field) => (
                        <div
                          className={`saved-card-fact${field.emphasis ? " saved-card-fact--emphasis" : ""}`}
                          key={field.label}
                        >
                          <dt>{field.label}</dt>
                          <dd className={field.mono ? "saved-card-fact-mono" : undefined}>{field.value}</dd>
                        </div>
                      ))}
                      {record.signed ? (
                        <div className="saved-card-fact saved-card-fact--signed">
                          <dt>Status</dt>
                          <dd>
                            {record.signedNote?.trim() || "Hard copy signed"}
                            {record.signedAt ? ` · ${formatDate(record.signedAt)}` : ""}
                          </dd>
                        </div>
                      ) : null}
                    </dl>
                  ) : null}
                </div>
                <div className="saved-card-footer">
                  <p className="saved-card-updated">
                    {record.content.effectiveDate?.trim()
                      ? `Agreement date ${formatDate(record.content.effectiveDate)}`
                      : "No agreement date"}
                  </p>
                  <div className="saved-card-actions">
                    <Link className="primary-button saved-card-open" to={`/agreement/${record.id}`}>
                      Open
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
