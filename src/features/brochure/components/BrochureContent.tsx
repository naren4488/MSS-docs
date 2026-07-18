import type { CSSProperties, ComponentType } from "react";
import {
  BadgeCheck,
  Building2,
  ClipboardList,
  IndianRupee,
  MapPin,
  Phone,
  PlugZap,
  ShieldCheck,
  SolarPanel,
  Sparkles,
  Wrench,
} from "lucide-react";
import type { BrochureData } from "../types/brochure";

interface BrochureContentProps {
  data: BrochureData;
}

const NAVY = "#0B2048";
const NAVY_MID = "#14306b";
const NAVY_SOFT = "#1a3a7a";
const GOLD = "#E8A317";
const GOLD_SOFT = "#F5C842";
const CREAM = "#F4F7FC";
const INK = "#152036";
const MUTED = "#5b667a";

const pageStyle: CSSProperties = {
  width: 794,
  minHeight: 1123,
  margin: "0 auto 28px",
  background: "#ffffff",
  color: INK,
  fontFamily: "Lexend, sans-serif",
  boxShadow: "0 24px 60px rgba(11, 32, 72, 0.14)",
  overflow: "hidden",
  position: "relative",
};

const gridBackdrop: CSSProperties = {
  position: "absolute",
  inset: 0,
  backgroundImage:
    "linear-gradient(rgba(20, 48, 107, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(20, 48, 107, 0.04) 1px, transparent 1px)",
  backgroundSize: "28px 28px",
  pointerEvents: "none",
};

const SERVICE_ICONS: ComponentType<{ size?: number; color?: string; strokeWidth?: number }>[] = [
  SolarPanel,
  Sparkles,
  Building2,
];

const WHY_ICONS: ComponentType<{ size?: number; color?: string; strokeWidth?: number }>[] = [
  BadgeCheck,
  ClipboardList,
  IndianRupee,
  Wrench,
  ShieldCheck,
  PlugZap,
];

function SectionLabel({ children }: { children: string }) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: 1.4,
        textTransform: "uppercase",
        color: GOLD,
        marginBottom: 8,
      }}
    >
      <span style={{ width: 22, height: 2, background: GOLD, display: "inline-block" }} />
      {children}
    </div>
  );
}

export function BrochureContent({ data }: BrochureContentProps) {
  const { company, hero, services, brands, whyChoose, process, warranty, scheme, contactCta } = data;

  return (
    <div className="brochure-content" style={{ padding: "28px 0 40px", background: "#e8edf5" }}>
      {/* ── Page 1: Cover ── */}
      <div data-export-page="true" style={pageStyle}>
        <div style={gridBackdrop} />

        {/* Top brand bar */}
        <div
          style={{
            position: "relative",
            padding: "28px 40px 22px",
            background: `linear-gradient(135deg, ${NAVY} 0%, ${NAVY_MID} 55%, ${NAVY_SOFT} 100%)`,
            color: "#ffffff",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              right: -40,
              top: -50,
              width: 220,
              height: 220,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(232,163,23,0.28) 0%, transparent 70%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: "40%",
              bottom: -80,
              width: 280,
              height: 160,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)",
            }}
          />

          <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 18 }}>
            <img
              src={company.logo}
              alt={`${company.name} logo`}
              style={{
                height: 72,
                width: "auto",
                objectFit: "contain",
                background: "#ffffff",
                borderRadius: 8,
                padding: "6px 10px",
              }}
            />
            <div>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  letterSpacing: 0.6,
                  lineHeight: 1.2,
                  textTransform: "uppercase",
                }}
              >
                {company.name}
              </div>
              <div style={{ marginTop: 6, fontSize: 12, color: GOLD_SOFT, letterSpacing: 1.2, fontWeight: 600 }}>
                {company.tagline}
              </div>
            </div>
          </div>
        </div>

        {/* Slogan ribbon */}
        <div
          style={{
            position: "relative",
            margin: "0 40px",
            marginTop: -14,
            background: `linear-gradient(90deg, ${GOLD} 0%, ${GOLD_SOFT} 100%)`,
            color: NAVY,
            borderRadius: 8,
            padding: "12px 20px",
            fontWeight: 700,
            fontSize: 15,
            letterSpacing: 0.4,
            textAlign: "center",
            boxShadow: "0 10px 24px rgba(232, 163, 23, 0.28)",
            zIndex: 2,
          }}
        >
          {company.slogan}
        </div>

        {/* Hero copy */}
        <div style={{ position: "relative", padding: "36px 40px 28px" }}>
          <SectionLabel>Rooftop solar · Jaipur & Rajasthan</SectionLabel>
          <h1
            style={{
              margin: "0 0 14px",
              fontSize: 34,
              lineHeight: 1.18,
              fontWeight: 700,
              color: NAVY,
              maxWidth: 560,
            }}
          >
            {hero.title}
          </h1>
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.65, color: MUTED, maxWidth: 580 }}>
            {hero.subtitle}
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${hero.promises.length}, 1fr)`,
              gap: 0,
              marginTop: 26,
              borderTop: `1px solid rgba(20, 48, 107, 0.12)`,
              borderBottom: `1px solid rgba(20, 48, 107, 0.12)`,
            }}
          >
            {hero.promises.map((promise, index) => (
              <div
                key={promise}
                style={{
                  padding: "14px 12px",
                  fontSize: 13,
                  fontWeight: 700,
                  color: NAVY,
                  textAlign: "center",
                  borderRight:
                    index < hero.promises.length - 1 ? "1px solid rgba(20, 48, 107, 0.12)" : "none",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    width: 8,
                    height: 8,
                    background: GOLD,
                    marginRight: 8,
                    transform: "rotate(45deg)",
                    verticalAlign: "middle",
                  }}
                />
                {promise}
              </div>
            ))}
          </div>
        </div>

        {/* Services */}
        <div style={{ position: "relative", padding: "8px 40px 32px" }}>
          <SectionLabel>{services.title}</SectionLabel>
          <p style={{ margin: "0 0 18px", fontSize: 13, color: MUTED }}>{services.subtitle}</p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
            {services.items.map((item, index) => {
              const Icon = SERVICE_ICONS[index % SERVICE_ICONS.length];
              return (
                <div
                  key={item.title}
                  style={{
                    padding: "18px 16px",
                    background: index === 1 ? `linear-gradient(160deg, ${NAVY} 0%, ${NAVY_MID} 100%)` : CREAM,
                    color: index === 1 ? "#ffffff" : INK,
                    borderRadius: 10,
                    border: index === 1 ? "none" : "1px solid rgba(20, 48, 107, 0.08)",
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 8,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: index === 1 ? "rgba(232,163,23,0.2)" : "rgba(20, 48, 107, 0.08)",
                      marginBottom: 12,
                    }}
                  >
                    <Icon size={18} color={index === 1 ? GOLD_SOFT : NAVY_MID} strokeWidth={2} />
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8, lineHeight: 1.3 }}>{item.title}</div>
                  <div
                    style={{
                      fontSize: 11.5,
                      lineHeight: 1.55,
                      color: index === 1 ? "rgba(255,255,255,0.82)" : MUTED,
                    }}
                  >
                    {item.description}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Brands */}
        <div style={{ position: "relative", padding: "4px 40px 28px" }}>
          <SectionLabel>{brands.title}</SectionLabel>
          <p style={{ margin: "0 0 16px", fontSize: 13, color: MUTED }}>{brands.subtitle}</p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {brands.groups.map((group) => (
              <div
                key={group.label}
                style={{
                  background: "#ffffff",
                  border: "1px solid rgba(20, 48, 107, 0.1)",
                  borderTop: `3px solid ${GOLD}`,
                  borderRadius: 8,
                  padding: "14px 16px",
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: 0.8,
                    textTransform: "uppercase",
                    color: NAVY_MID,
                    marginBottom: 10,
                  }}
                >
                  {group.label}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {group.brands.map((brand) => (
                    <span
                      key={brand}
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: INK,
                        background: CREAM,
                        padding: "6px 10px",
                        borderRadius: 6,
                      }}
                    >
                      {brand}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact strip page 1 */}
        <div
          style={{
            position: "relative",
            marginTop: "auto",
            background: `linear-gradient(90deg, ${NAVY} 0%, ${NAVY_MID} 100%)`,
            color: "#ffffff",
            padding: "22px 40px",
            display: "grid",
            gridTemplateColumns: "1.2fr 1fr",
            gap: 20,
            alignItems: "center",
          }}
        >
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.2, color: GOLD_SOFT, marginBottom: 6 }}>
              CALL US NOW
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: 0.5 }}>{company.phone}</div>
            <div style={{ marginTop: 8, fontSize: 12, color: "rgba(255,255,255,0.75)" }}>{company.email}</div>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <MapPin size={18} color={GOLD_SOFT} style={{ marginTop: 2, flexShrink: 0 }} />
            <div style={{ fontSize: 12, lineHeight: 1.55, color: "rgba(255,255,255,0.88)" }}>{company.address}</div>
          </div>
        </div>
      </div>

      {/* ── Page 2: Credibility ── */}
      <div data-export-page="true" style={pageStyle}>
        <div style={gridBackdrop} />

        {/* Why choose */}
        <div style={{ position: "relative", padding: "36px 40px 28px" }}>
          <SectionLabel>Why Mahi Solar</SectionLabel>
          <h2 style={{ margin: "0 0 8px", fontSize: 26, fontWeight: 700, color: NAVY }}>{whyChoose.title}</h2>
          <p style={{ margin: "0 0 22px", fontSize: 13, color: MUTED, maxWidth: 520 }}>{whyChoose.subtitle}</p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {whyChoose.items.map((item, index) => {
              const Icon = WHY_ICONS[index % WHY_ICONS.length];
              return (
                <div
                  key={item.title}
                  style={{
                    display: "flex",
                    gap: 12,
                    padding: "14px 14px",
                    borderRadius: 8,
                    background: index % 2 === 0 ? CREAM : "#ffffff",
                    border: "1px solid rgba(20, 48, 107, 0.08)",
                  }}
                >
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 8,
                      background: NAVY,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={16} color={GOLD_SOFT} strokeWidth={2} />
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: NAVY, marginBottom: 4 }}>{item.title}</div>
                    <div style={{ fontSize: 11.5, lineHeight: 1.5, color: MUTED }}>{item.description}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Process */}
        <div
          style={{
            position: "relative",
            margin: "0 40px",
            padding: "22px 22px 20px",
            borderRadius: 12,
            background: `linear-gradient(135deg, ${NAVY} 0%, ${NAVY_MID} 100%)`,
            color: "#ffffff",
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.2, color: GOLD_SOFT, marginBottom: 6 }}>
            OUR PROCESS
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{process.title}</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.72)", marginBottom: 18 }}>{process.subtitle}</div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12 }}>
            {process.steps.map((step, index) => (
              <div key={step.title}>
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: GOLD,
                    color: NAVY,
                    fontSize: 12,
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 10,
                  }}
                >
                  {index + 1}
                </div>
                <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 6 }}>{step.title}</div>
                <div style={{ fontSize: 11, lineHeight: 1.5, color: "rgba(255,255,255,0.75)" }}>{step.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Warranty + Scheme */}
        <div
          style={{
            position: "relative",
            padding: "28px 40px 24px",
            display: "grid",
            gridTemplateColumns: "1.05fr 1fr",
            gap: 18,
          }}
        >
          <div>
            <SectionLabel>{warranty.title}</SectionLabel>
            <h3 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 700, color: NAVY }}>{warranty.title}</h3>
            <p style={{ margin: "0 0 14px", fontSize: 12, color: MUTED }}>{warranty.subtitle}</p>

            <div style={{ display: "grid", gap: 8 }}>
              {warranty.items.map((item) => (
                <div
                  key={item.label}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1.2fr",
                    gap: 8,
                    padding: "9px 12px",
                    background: CREAM,
                    borderRadius: 6,
                    borderLeft: `3px solid ${GOLD}`,
                  }}
                >
                  <span style={{ fontSize: 11.5, fontWeight: 600, color: MUTED }}>{item.label}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: NAVY }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              borderRadius: 12,
              border: `1px solid rgba(20, 48, 107, 0.12)`,
              padding: "20px 18px",
              background: `linear-gradient(180deg, #fff9eb 0%, #ffffff 55%)`,
            }}
          >
            <div
              style={{
                display: "inline-block",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: 1,
                textTransform: "uppercase",
                color: NAVY,
                background: GOLD_SOFT,
                padding: "4px 10px",
                borderRadius: 4,
                marginBottom: 12,
              }}
            >
              Government scheme support
            </div>
            <h3 style={{ margin: "0 0 10px", fontSize: 16, fontWeight: 700, color: NAVY, lineHeight: 1.35 }}>
              {scheme.title}
            </h3>
            <p style={{ margin: "0 0 14px", fontSize: 12, lineHeight: 1.55, color: MUTED }}>{scheme.subtitle}</p>
            <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "grid", gap: 8 }}>
              {scheme.points.map((point) => (
                <li key={point} style={{ display: "flex", gap: 8, fontSize: 12, color: INK, lineHeight: 1.45 }}>
                  <ShieldCheck size={15} color={NAVY_MID} style={{ flexShrink: 0, marginTop: 1 }} />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Final CTA */}
        <div
          style={{
            position: "relative",
            margin: "8px 40px 0",
            padding: "24px 26px",
            borderRadius: 12,
            background: CREAM,
            border: `1px solid rgba(20, 48, 107, 0.1)`,
            display: "grid",
            gridTemplateColumns: "1.4fr auto",
            gap: 20,
            alignItems: "center",
          }}
        >
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: NAVY, marginBottom: 6 }}>{contactCta.title}</div>
            <div style={{ fontSize: 12.5, color: MUTED, lineHeight: 1.5 }}>{contactCta.subtitle}</div>
            <div style={{ marginTop: 12, fontSize: 11.5, color: MUTED }}>
              GST: {company.gst} · {company.website}
            </div>
          </div>
          <a
            href={`tel:${company.phone.replace(/\s/g, "")}`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              background: GOLD,
              color: NAVY,
              textDecoration: "none",
              fontWeight: 700,
              fontSize: 14,
              padding: "14px 20px",
              borderRadius: 8,
              whiteSpace: "nowrap",
            }}
          >
            <Phone size={18} />
            {company.phone}
          </a>
        </div>

        {/* Footer */}
        <div
          style={{
            position: "relative",
            marginTop: 28,
            padding: "16px 40px",
            background: NAVY,
            color: "#ffffff",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 11,
          }}
        >
          <span style={{ color: GOLD_SOFT, fontWeight: 700, letterSpacing: 1.2 }}>{data.footerLine}</span>
          <span style={{ color: "rgba(255,255,255,0.65)" }}>© {new Date().getFullYear()} {company.shortName}</span>
        </div>
      </div>
    </div>
  );
}
