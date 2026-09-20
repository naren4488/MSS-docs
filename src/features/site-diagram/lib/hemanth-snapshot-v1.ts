import type { HemanthSiteLayout } from "./build-hemanth-layout";
import data from "./hemanth-snapshot-v1.json";

/** Frozen Hemant Tanwani v1 — do not regenerate when editing v2. */
export const HEMANTH_LAYOUT_V1 = data as HemanthSiteLayout;

export const HEMANTH_V1_META = {
  label: "v1",
  detail: "locked reference",
} as const;
