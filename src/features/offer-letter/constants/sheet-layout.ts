/**
 * ISO 216 A4 at ~96 CSS dpi (~794×1123px). Used by on-screen preview and print CSS — keep in sync.
 */
export const PAGE_WIDTH = 794;
export const PAGE_HEIGHT = 1123;

export const HEADER_HEIGHT = 150;
export const PAGE_TOP_BOTTOM_PADDING = 40;
export const PAGE_SIDE_PADDING = 56;

export const FIRST_PAGE_CAPACITY = PAGE_HEIGHT - HEADER_HEIGHT - PAGE_TOP_BOTTOM_PADDING * 2;
export const FOLLOWING_PAGE_CAPACITY = PAGE_HEIGHT - PAGE_TOP_BOTTOM_PADDING * 2;
