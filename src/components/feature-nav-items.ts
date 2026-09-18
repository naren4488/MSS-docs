import {
  Building2,
  ClipboardCheck,
  FileText,
  FolderKanban,
  Handshake,
  Receipt,
  ReceiptIndianRupee,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface FeatureNavItem {
  path: string;
  label: string;
  icon: LucideIcon;
  /** Active on list / browse pages (FeatureNavigation). */
  matchList: (pathname: string) => boolean;
  /** Active inside maker sticky nav (MakerFeatureNav). */
  matchMaker: (pathname: string) => boolean;
}

export const FEATURE_NAV_ITEMS: FeatureNavItem[] = [
  {
    path: "/offer-letters",
    label: "Offers",
    icon: FileText,
    matchList: (pathname) => pathname === "/offer-letters",
    matchMaker: (pathname) => pathname.startsWith("/offer-letter"),
  },
  {
    path: "/agreements",
    label: "Agreements",
    icon: Handshake,
    matchList: (pathname) => pathname === "/agreements" || pathname === "/partner-agreements",
    matchMaker: (pathname) =>
      (pathname.startsWith("/agreement") && pathname !== "/agreements") ||
      pathname.startsWith("/partner-agreement"),
  },
  {
    path: "/quotations",
    label: "Quotations",
    icon: ReceiptIndianRupee,
    matchList: (pathname) => pathname === "/quotations",
    matchMaker: (pathname) => pathname.startsWith("/quotation"),
  },
  {
    path: "/receipts",
    label: "Receipt",
    icon: Receipt,
    matchList: (pathname) => pathname === "/receipts",
    matchMaker: (pathname) => pathname.startsWith("/receipt") && pathname !== "/receipts",
  },
  {
    path: "/handovers",
    label: "Handover",
    icon: ClipboardCheck,
    matchList: (pathname) => pathname === "/handovers",
    matchMaker: (pathname) => pathname.startsWith("/handover") && pathname !== "/handovers",
  },
  {
    path: "/company-profiles",
    label: "Company",
    icon: Building2,
    matchList: (pathname) => pathname === "/company-profiles",
    matchMaker: (pathname) => pathname.startsWith("/company-profile"),
  },
  {
    path: "/projects",
    label: "Projects",
    icon: FolderKanban,
    matchList: (pathname) => pathname === "/projects" || pathname === "/mss-sites",
    matchMaker: (pathname) => pathname === "/projects" || pathname === "/mss-sites",
  },
  {
    path: "/employees",
    label: "Employees",
    icon: Users,
    matchList: (pathname) => pathname === "/employees",
    matchMaker: (pathname) => pathname.startsWith("/employee-directory") || pathname === "/employees",
  },
];
