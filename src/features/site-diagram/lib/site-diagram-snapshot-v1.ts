import type { SiteLayout } from "./build-site-layout";
import data from "./site-diagram-snapshot-v1.json";

/** Frozen max-panels layout — do not regenerate when editing the working diagram. */
export const SAVED_SITE_LAYOUT_V1 = data as SiteLayout;

export const SAVED_SNAPSHOT_META = {
  label: "Max panels diagram",
  detail: "locked reference",
} as const;
