import {
  BookOpen,
  Building2,
  FileText,
  FolderKanban,
  Handshake,
  HeartHandshake,
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
    matchList: (pathname) => pathname === "/agreements",
    matchMaker: (pathname) =>
      pathname.startsWith("/agreement") && !pathname.startsWith("/partner-agreement"),
  },
  {
    path: "/partner-agreements",
    label: "Partners",
    icon: HeartHandshake,
    matchList: (pathname) => pathname === "/partner-agreements",
    matchMaker: (pathname) => pathname.startsWith("/partner-agreement"),
  },
  {
    path: "/quotations",
    label: "Quotations",
    icon: ReceiptIndianRupee,
    matchList: (pathname) => pathname === "/quotations",
    matchMaker: (pathname) => pathname.startsWith("/quotation"),
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
  {
    path: "/brochure",
    label: "Brochure",
    icon: BookOpen,
    matchList: (pathname) => pathname === "/brochure",
    matchMaker: (pathname) => pathname === "/brochure",
  },
];
