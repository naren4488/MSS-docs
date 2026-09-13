import { ArrowRight, BatteryCharging, SunMedium } from "lucide-react";
import { Link } from "react-router-dom";

const KINDS = [
  {
    id: "ongrid",
    title: "Grid-connected",
    badge: "On-grid",
    tone: "grid",
    icon: SunMedium,
    lead: "For a rooftop plant that exports through the DISCOM meter.",
    points: ["Client, site and net-metering note", "Installed equipment record", "Cleaning and ACDB care", "Short terms and signatures"],
  },
  {
    id: "offgrid",
    title: "Off-grid",
    badge: "Standalone",
    tone: "offgrid",
    icon: BatteryCharging,
    lead: "For a standalone plant with a battery bank. No phase, no net meter.",
    points: ["Client and battery-room site", "Modules, PCU and battery record", "Backup and water-top-up care", "Short terms and signatures"],
  },
] as const;

export function AllHandovers() {
  return (
    <div className="page-shell">
      <section className="handover-landing">
        <div className="handover-landing-copy">
          <p className="eyebrow">New document</p>
          <h1>Project handover</h1>
          <p>
            A one-sitting letter you leave with the client after commissioning. It records the plant, greets them properly,
            and states the few things they must look after so the system keeps working.
          </p>
        </div>

        <div className="handover-kind-grid">
          {KINDS.map((kind) => {
            const Icon = kind.icon;
            return (
              <Link className={`handover-kind-card handover-kind-card--${kind.tone}`} key={kind.id} to={`/handover?kind=${kind.id}`}>
                <div className="handover-kind-card-top">
                  <span className="handover-kind-icon" aria-hidden>
                    <Icon size={18} />
                  </span>
                  <span className="handover-kind-badge">{kind.badge}</span>
                </div>
                <h2>{kind.title}</h2>
                <p>{kind.lead}</p>
                <ul>
                  {kind.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
                <span className="handover-kind-cta">
                  Open handover <ArrowRight size={15} aria-hidden />
                </span>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
