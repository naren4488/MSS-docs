import { ArrowRight, Receipt } from "lucide-react";
import { Link } from "react-router-dom";

export function AllReceipts() {
  return (
    <div className="page-shell">
      <section className="handover-landing">
        <div className="handover-landing-copy">
          <p className="eyebrow">New document</p>
          <h1>Project confirmation receipt</h1>
          <p>
            Give this when a client pays a token or an advance. It records who paid, which plant the order is for, and how the
            money was received.
          </p>
        </div>

        <div className="handover-kind-grid" style={{ gridTemplateColumns: "minmax(280px, 460px)" }}>
          <Link className="handover-kind-card handover-kind-card--grid" to="/receipt">
            <div className="handover-kind-card-top">
              <span className="handover-kind-icon" aria-hidden>
                <Receipt size={18} />
              </span>
              <span className="handover-kind-badge">OCR</span>
            </div>
            <h2>Token / advance receipt</h2>
            <p>One page. Not a tax invoice.</p>
            <ul>
              <li>Client name, phone and site</li>
              <li>Capacity, phase, panels and inverter</li>
              <li>Amount, mode and payment reference</li>
              <li>Balance if you also enter the project amount</li>
            </ul>
            <span className="handover-kind-cta">
              Open receipt <ArrowRight size={15} aria-hidden />
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
}
