import type { HemanthSiteLayout } from "./build-hemanth-layout";
import data from "./hemanth-snapshot-v1.json";

/** Frozen Hemant Tanwani baseline layout — do not regenerate when editing the dense layout. */
export const HEMANTH_LAYOUT_V1 = data as HemanthSiteLayout;

export const HEMANTH_V1_META = {
  label: "Baseline layout",
  detail: "locked N–S reference",
} as const;
