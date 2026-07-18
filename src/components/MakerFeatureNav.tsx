import { useLocation, useNavigate } from "react-router-dom";
import { FEATURE_NAV_ITEMS } from "@/components/feature-nav-items";

interface MakerFeatureNavProps {
  isDirty?: boolean;
}

export function MakerFeatureNav({ isDirty = false }: MakerFeatureNavProps) {
  const location = useLocation();
  const navigate = useNavigate();

  function navigateTo(path: string) {
    if (isDirty && !window.confirm("You have unsaved changes. Leave this document anyway?")) {
      return;
    }
    navigate(path);
  }

  return (
    <div className="maker-feature-nav" role="navigation" aria-label="Document type">
      {FEATURE_NAV_ITEMS.map(({ path, label, icon: Icon, matchMaker }) => {
        const active = matchMaker(location.pathname);
        return (
          <button
            key={path}
            className={`maker-feature-nav-link ${active ? "active" : ""}`}
            type="button"
            aria-current={active ? "page" : undefined}
            onClick={() => navigateTo(path)}
          >
            <Icon size={14} aria-hidden />
            {label}
          </button>
        );
      })}
    </div>
  );
}
