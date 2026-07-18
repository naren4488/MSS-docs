import { useLocation, useNavigate } from "react-router-dom";
import { FEATURE_NAV_ITEMS } from "@/components/feature-nav-items";

export function FeatureNavigation() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="feature-nav no-print" aria-label="Main navigation">
      <div className="feature-nav-inner">
        {FEATURE_NAV_ITEMS.map(({ path, label, icon: Icon, matchList }) => {
          const active = matchList(location.pathname);
          return (
            <button
              key={path}
              className={`feature-nav-link ${active ? "active" : ""}`}
              type="button"
              aria-current={active ? "page" : undefined}
              onClick={() => navigate(path)}
            >
              <Icon size={14} strokeWidth={2} aria-hidden />
              <span>{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
