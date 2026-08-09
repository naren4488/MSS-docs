const DYNAMIC_ANALYTICS_PRINT_STYLE_ID = "mss-sites-analytics-dynamic-print";
const PX_TO_MM = 25.4 / 96;

/** Minimum page size so short analytics still print cleanly. */
const MIN_PAGE_WIDTH_MM = 280;
const MIN_PAGE_HEIGHT_MM = 400;

/**
 * Sizes the print page to the full analytics block (not A4) so Save as PDF
 * captures the whole dashboard as one continuous sheet.
 */
export function prepareMssSitesAnalyticsPrint(): () => void {
  const analytics = document.getElementById("mss-sites-analytics");
  if (!analytics) {
    return () => undefined;
  }

  const root = document.documentElement;
  root.classList.add("print-mss-sites-analytics");

  const widthPx = Math.ceil(Math.max(analytics.scrollWidth, analytics.getBoundingClientRect().width));
  const heightPx = Math.ceil(Math.max(analytics.scrollHeight, analytics.getBoundingClientRect().height));

  const pageWidthMm = Math.max(MIN_PAGE_WIDTH_MM, Math.ceil(widthPx * PX_TO_MM + 12));
  const pageHeightMm = Math.max(MIN_PAGE_HEIGHT_MM, Math.ceil(heightPx * PX_TO_MM + 12));

  let style = document.getElementById(DYNAMIC_ANALYTICS_PRINT_STYLE_ID) as HTMLStyleElement | null;
  if (!style) {
    style = document.createElement("style");
    style.id = DYNAMIC_ANALYTICS_PRINT_STYLE_ID;
    document.head.appendChild(style);
  }
  style.textContent = `@media print {
  @page mss-sites-analytics-page {
    size: ${pageWidthMm}mm ${pageHeightMm}mm;
    margin: 6mm;
  }
}`;

  return () => {
    root.classList.remove("print-mss-sites-analytics");
    style?.remove();
  };
}
