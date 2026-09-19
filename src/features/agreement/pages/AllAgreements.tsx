import { useMemo } from "react";
import { FilePlus2 } from "lucide-react";
import { Link } from "react-router-dom";
import { AGREEMENT_TEMPLATES, getAgreementTemplateLabel } from "../lib/agreement-defaults";
import { formatDate } from "../lib/agreement-formatters";
import { listAgreements } from "../lib/agreement-storage";
import type { AgreementData, AgreementRecord, AgreementTemplate } from "../types/agreement";

type CardField = { label: string; value: string; mono?: boolean; emphasis?: boolean };

type SavedCard = {
  id: string;
  href: string;
  title: string;
  badge: string;
  companyBadge: string;
  fields: CardField[];
  effectiveDate: string;
  updatedAt: string;
  signed?: boolean;
  signedAt?: string;
  signedNote?: string;
  group: SavedGroupId;
};

type SavedGroupId = "project-referral" | "fixed-rate" | "vendor-code" | "other";

type SavedGroup = {
  id: SavedGroupId;
  title: string;
  description: string;
  cards: SavedCard[];
};

type TemplateGroup = {
  id: string;
  title: string;
  description: string;
  templates: { id: AgreementTemplate; label: string; description: string }[];
};

function agreementCardTitle(record: AgreementRecord): string {
  const entity = record.content.party.entityName.trim();
  if (entity) return entity;
  return record.name.replace(/\s*[—–-]\s*.+$/i, "").trim() || record.name || "Untitled Agreement";
}

function agreementInitials(title: string): string {
  const words = title.split(/\s+/).filter(Boolean);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return title.slice(0, 2).toUpperCase() || "AG";
}

function shortTemplateLabel(template: AgreementData["template"]): string {
  if (template === "partnership") return "Vendor Code";
  if (template === "project-referral") return "Fixed Commission";
  if (template === "fixed-rate") return "Fixed Rate";
  if (template === "client-agreement") return "Client Agreement";
  if (template === "inc-installation-assign") return "INC Assignment";
  if (template === "inc-goodwill-execution") return "INC Goodwill";
  return getAgreementTemplateLabel(template);
}

function savedGroupFor(template: AgreementData["template"]): SavedGroupId {
  if (template === "project-referral") return "project-referral";
  if (template === "fixed-rate") return "fixed-rate";
  if (template === "partnership") return "vendor-code";
  return "other";
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

  if (content.template === "fixed-rate") {
    fields.push({ label: "Rate rows", value: String(content.rateCards.length), emphasis: true });
    if (content.showClientSchedule) {
      fields.push({
        label: "Annexure clients",
        value: String(content.clientRows.length + content.otherClientRows.length),
      });
    }
  }

  if (party.gst?.trim()) fields.push({ label: "GST", value: party.gst.trim(), mono: true });
  if (content.showPartyPan && party.pan?.trim()) fields.push({ label: "PAN", value: party.pan.trim(), mono: true });
  if (party.aadhaar?.trim()) fields.push({ label: "Aadhaar", value: party.aadhaar.trim(), mono: true });

  return fields;
}

const TEMPLATE_GROUPS: TemplateGroup[] = [
  {
    id: "referral-commission",
    title: "Project Referral — Fixed Commission (MSS)",
    description: "Like Shripal Ji: referrer brings the project; MSS executes end-to-end; fixed ₹ commission per project.",
    templates: AGREEMENT_TEMPLATES.filter((item) => item.id === "project-referral"),
  },
  {
    id: "referral-fixed-rate",
    title: "Project Referral — Fixed Rate Schedule (MSS)",
    description:
      "Like Satyanarayan Ji: partner brings projects and collects payment; MSS executes at an agreed per-system rate; partner keeps the surplus.",
    templates: AGREEMENT_TEMPLATES.filter((item) => item.id === "fixed-rate"),
  },
  {
    id: "vendor-code",
    title: "Vendor Code (MSS)",
    description: "Authorise a regional partner to operate under the MSS National Portal vendor code.",
    templates: AGREEMENT_TEMPLATES.filter((item) => item.id === "partnership"),
  },
  {
    id: "other",
    title: "Other MSS agreements",
    description: "INC assignment / goodwill letters and client installation agreements.",
    templates: AGREEMENT_TEMPLATES.filter(
      (item) =>
        item.id === "inc-installation-assign" ||
        item.id === "inc-goodwill-execution" ||
        item.id === "client-agreement",
    ),
  },
];

const SAVED_GROUP_META: Record<SavedGroupId, { title: string; description: string }> = {
  "project-referral": {
    title: "Project Referral — Fixed Commission",
    description: "Shripal Ji–style: fixed ₹ commission per referred project (MSS).",
  },
  "fixed-rate": {
    title: "Project Referral — Fixed Rate Schedule",
    description: "Satyanarayan Ji–style: per-system fixed rates + partner margin (MSS).",
  },
  "vendor-code": {
    title: "Vendor Code agreements",
    description: "Partners authorised under the MSS vendor code.",
  },
  other: {
    title: "Other agreements",
    description: "INC and client installation agreements.",
  },
};

function SavedCardView({ card }: { card: SavedCard }) {
  return (
    <article className="saved-card saved-card--agreement">
      <div className="saved-card-accent" aria-hidden />
      <div className="saved-card-body">
        <div className="saved-card-identity">
          <span className="saved-card-avatar" aria-hidden>
            {agreementInitials(card.title)}
          </span>
          <div className="saved-card-heading">
            <div className="saved-card-badges">
              <span className="saved-card-badge">{card.companyBadge}</span>
              <span className="saved-card-badge">{card.badge}</span>
              {card.signed ? <span className="saved-card-badge saved-card-badge--signed">Signed</span> : null}
            </div>
            <h3>{card.title}</h3>
          </div>
        </div>

        {card.fields.length > 0 || card.signed ? (
          <dl className="saved-card-facts">
            {card.fields.map((field) => (
              <div
                className={`saved-card-fact${field.emphasis ? " saved-card-fact--emphasis" : ""}`}
                key={field.label}
              >
                <dt>{field.label}</dt>
                <dd className={field.mono ? "saved-card-fact-mono" : undefined}>{field.value}</dd>
              </div>
            ))}
            {card.signed ? (
              <div className="saved-card-fact saved-card-fact--signed">
                <dt>Status</dt>
                <dd>
                  {card.signedNote?.trim() || "Hard copy signed"}
                  {card.signedAt ? ` · ${formatDate(card.signedAt)}` : ""}
                </dd>
              </div>
            ) : null}
          </dl>
        ) : null}
      </div>
      <div className="saved-card-footer">
        <p className="saved-card-updated">
          {card.effectiveDate?.trim()
            ? `Agreement date ${formatDate(card.effectiveDate)}`
            : "No agreement date"}
        </p>
        <div className="saved-card-actions">
          <Link className="primary-button saved-card-open" to={card.href}>
            Open
          </Link>
        </div>
      </div>
    </article>
  );
}

export function AllAgreements() {
  const groups = useMemo(() => {
    const cards: SavedCard[] = listAgreements().map((record) => ({
      id: record.id,
      href: `/agreement/${record.id}`,
      title: agreementCardTitle(record),
      badge: shortTemplateLabel(record.content.template),
      companyBadge: "MSS",
      fields: agreementCardFields(record.content),
      effectiveDate: record.content.effectiveDate,
      updatedAt: record.updatedAt,
      signed: record.signed,
      signedAt: record.signedAt,
      signedNote: record.signedNote,
      group: savedGroupFor(record.content.template),
    }));

    const order: SavedGroupId[] = ["project-referral", "fixed-rate", "vendor-code", "other"];
    return order
      .map<SavedGroup>((id) => ({
        id,
        title: SAVED_GROUP_META[id].title,
        description: SAVED_GROUP_META[id].description,
        cards: cards
          .filter((card) => card.group === id)
          .sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt)),
      }))
      .filter((group) => group.cards.length > 0);
  }, []);

  const totalCards = groups.reduce((sum, group) => sum + group.cards.length, 0);

  return (
    <div className="page-shell">
      <section className="template-picker" style={{ marginBottom: 32 }}>
        <div className="panel-header">
          <div>
            <p className="eyebrow">Create New</p>
            <h2 style={{ margin: "4px 0 0" }}>Pick a template</h2>
            <p className="muted-text" style={{ marginTop: 8, marginBottom: 0 }}>
              MSS agreements only. Fixed commission (Shripal-style) and fixed-rate schedule (Satyanarayan-style) are
              separate templates.
            </p>
          </div>
        </div>

        {TEMPLATE_GROUPS.map((group) => (
          <div key={group.id} style={{ marginTop: 22 }}>
            <div style={{ marginBottom: 10 }}>
              <h3 style={{ margin: 0, fontSize: 15 }}>{group.title}</h3>
              <p className="muted-text" style={{ margin: "4px 0 0", maxWidth: 720 }}>
                {group.description}
              </p>
            </div>
            <div className="template-grid">
              {group.templates.map((template) => (
                <Link className="template-card" key={template.id} to={`/agreement?template=${template.id}`}>
                  <div className="template-card-icon">
                    <FilePlus2 size={20} />
                  </div>
                  <div>
                    <h3>{template.label}</h3>
                    <p className="muted-text" style={{ margin: 0 }}>
                      {template.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </section>

      <div className="maker-toolbar" style={{ marginBottom: 24 }}>
        <div className="maker-heading">
          <p className="eyebrow">Saved Documents</p>
          <h1>Agreements</h1>
          <p>Shripal Ji and Satyanarayan Ji are listed in separate groups because their deals differ.</p>
        </div>
      </div>

      {totalCards === 0 ? (
        <div className="empty-card">
          <p className="eyebrow">Nothing Saved Yet</p>
          <h2 style={{ marginTop: 0 }}>No saved agreements yet</h2>
          <p className="muted-text">
            Pick a template above to start a new agreement. Saved agreements will appear here.
          </p>
        </div>
      ) : (
        <div className="stack" style={{ gap: 28 }}>
          {groups.map((group) => (
            <section key={group.id}>
              <div style={{ marginBottom: 12 }}>
                <h2 style={{ margin: 0, fontSize: 18 }}>{group.title}</h2>
                <p className="muted-text" style={{ margin: "4px 0 0" }}>
                  {group.description}
                </p>
              </div>
              <div className="saved-grid saved-grid--agreements">
                {group.cards.map((card) => (
                  <SavedCardView key={card.id} card={card} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
