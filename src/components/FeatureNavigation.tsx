import {
  Building2,
  FileText,
  FolderKanban,
  Handshake,
  HeartHandshake,
  ReceiptIndianRupee,
  Users,
  Lightbulb,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

interface NavItem {
  path: string;
  label: string;
  icon: LucideIcon;
  match: (pathname: string) => boolean;
}

const NAV_ITEMS: NavItem[] = [
  {
    path: "/offer-letters",
    label: "Offers",
    icon: FileText,
    match: (pathname) => pathname === "/offer-letters",
  },
  {
    path: "/agreements",
    label: "Agreements",
    icon: Handshake,
    match: (pathname) => pathname === "/agreements",
  },
  {
    path: "/partner-agreements",
    label: "Partners",
    icon: HeartHandshake,
    match: (pathname) => pathname === "/partner-agreements",
  },
  {
    path: "/quotations",
    label: "Quotations",
    icon: ReceiptIndianRupee,
    match: (pathname) => pathname === "/quotations",
  },
  {
    path: "/company-profiles",
    label: "Company",
    icon: Building2,
    match: (pathname) => pathname === "/company-profiles",
  },
  {
    path: "/projects",
    label: "Projects",
    icon: FolderKanban,
    match: (pathname) => pathname === "/projects" || pathname === "/mss-sites",
  },
  {
    path: "/employees",
    label: "Employees",
    icon: Users,
    match: (pathname) => pathname === "/employees",
  },
  {
    path: "/brochure",
    label: "Brochure",
    icon: Lightbulb,
    match: (pathname) => pathname === "/brochure",
  },
];

export function FeatureNavigation() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="feature-nav no-print" aria-label="Main navigation">
      <div className="feature-nav-inner">
        {NAV_ITEMS.map(({ path, label, icon: Icon, match }) => {
          const active = match(location.pathname);
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
