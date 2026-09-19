import { jaipurWinterShadowCasts, stadiumHitsAabb } from "./jaipur-shadow";

type Mm = number;

export function formatMm(value: Mm): string {
  return `${Math.round(value)} mm`;
}

/** Fixed site layout for Mukesh Kumawat 80 kW — all values in mm. */
export const BLOCK_W = 1500;
export const BLOCK_H = 1000;
export const FROM_NORTH = 2300;
export const FROM_WEST = 6400;
export const GAP_12 = 7800;
export const GAP_23 = 7900;
export const FROM_EAST = 4700;
export const ROW_GAP = 9200;
export const FROM_SOUTH = 2400;

export const BLOCK_XS = [
  FROM_WEST,
  FROM_WEST + BLOCK_W + GAP_12,
  FROM_WEST + BLOCK_W + GAP_12 + BLOCK_W + GAP_23,
];

export const ROOF_W = FROM_WEST + BLOCK_W + GAP_12 + BLOCK_W + GAP_23 + BLOCK_W + FROM_EAST;
export const ROOF_H = FROM_NORTH + BLOCK_H + ROW_GAP + BLOCK_H + FROM_SOUTH;

export const ROW_YS = [FROM_NORTH, FROM_NORTH + BLOCK_H + ROW_GAP];

export const MM_PER_FT = 304.8;
export const CIRCLE_DIA_FT = 2;
export const CIRCLE_DIA = CIRCLE_DIA_FT * MM_PER_FT;
export const CYLINDER_HEIGHT_FT = 2;
export const CYLINDER_H = CYLINDER_HEIGHT_FT * MM_PER_FT;
export const CYLINDER_HEIGHT_LABEL = `${CYLINDER_HEIGHT_FT} ft`;
/** Use 90% of physical winter-solstice cast length for drawing. */
export const SHADOW_SCALE = 0.9;
/**
 * Mid-band 4×13 | walk | 3×13 inside the 9200 mm pad gap cannot clear full
 * 0.9× casts on row 8; packing uses a shorter exclusion so all seven rows fit.
 */
export const PACK_SHADOW_SCALE = 0.7;
export const JAIPUR_SHADOWS = jaipurWinterShadowCasts(CYLINDER_H).map((cast) => ({
  ...cast,
  lengthMm: cast.lengthMm * SHADOW_SCALE,
  dx: cast.dx * SHADOW_SCALE,
  dy: cast.dy * SHADOW_SCALE,
}));
const JAIPUR_SHADOWS_PACK = jaipurWinterShadowCasts(CYLINDER_H).map((cast) => ({
  ...cast,
  lengthMm: cast.lengthMm * PACK_SHADOW_SCALE,
  dx: cast.dx * PACK_SHADOW_SCALE,
  dy: cast.dy * PACK_SHADOW_SCALE,
}));

/** Portrait: short E–W × long N–S. Landscape swaps those axes. */
export const PANEL_SHORT = 1155;
export const PANEL_LONG = 2280;
/** Waaree module rating used for capacity totals. */
export const PANEL_WP = 590;
export const PANEL_BRAND = "Waaree";

export function panelCapacityKw(panelCount: number): number {
  return (panelCount * PANEL_WP) / 1000;
}

export function formatPanelCapacityKw(panelCount: number): string {
  const kw = panelCapacityKw(panelCount);
  const rounded = Math.round(kw * 100) / 100;
  return Number.isInteger(rounded) ? `${rounded} kW` : `${rounded.toFixed(2)} kW`;
}
/** Spacing between panels — not labeled on the diagram. */
export const PANEL_GAP = 20;
/** Corridor strip: 50 mm orange + 400 mm yellow + 50 mm orange. */
export const WALKWAY = 500;
export const WALKWAY_MARGIN = 50;
export const WALKWAY_PATH = WALKWAY - WALKWAY_MARGIN * 2;
/** Fixed pattern: 4 landscape rows, E–W walk 2, then 3 landscape rows (W–E facing). */
export const LANDSCAPE_ROWS_NORTH = 4;
export const LANDSCAPE_ROWS_SOUTH = 3;
/** Tiny gap so E–W walks 1/3 almost touch edge rows without overlapping. */
export const EDGE_WALK_GAP = 0;
/** West / east landscape band targets: 7 + walk + 6 (panel + 20 mm gaps). */
export const WEST_LANDSCAPE_TARGET = 7 * PANEL_LONG + 6 * PANEL_GAP;
export const EAST_LANDSCAPE_TARGET = 6 * PANEL_LONG + 5 * PANEL_GAP;

function stackHeight(rowCount: number, panelH: number, gap: number) {
  if (rowCount <= 0) return 0;
  return rowCount * panelH + (rowCount - 1) * gap;
}

type PanelPlacement = { x: number; y: number; w: number; h: number };

const ZOOM_MIN = 0.5;
const ZOOM_MAX = 4;
const ZOOM_STEP = 0.25;
const ZOOM_DEFAULT = 1;

function clampZoom(value: number) {
  return Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, Math.round(value * 100) / 100));
}

function aabbHitsAabb(
  ax: number,
  ay: number,
  aw: number,
  ah: number,
  bx: number,
  by: number,
  bw: number,
  bh: number,
): boolean {
  return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
}

type CylinderBlock = { n: number; x: number; y: number; cx: number; cy: number };
type WalkCorridor = { x: number; y: number; w: number; h: number };

function corridorFromSegment(x1: number, y1: number, x2: number, y2: number, half: number): WalkCorridor {
  if (Math.abs(y1 - y2) < 0.01) {
    const left = Math.min(x1, x2);
    const right = Math.max(x1, x2);
    return { x: left, y: y1 - half, w: right - left, h: half * 2 };
  }
  const top = Math.min(y1, y2);
  const bottom = Math.max(y1, y2);
  return { x: x1 - half, y: top, w: half * 2, h: bottom - top };
}

/**
 * E–W walkway centerline along `channelY`, with a U-bypass around each pad
 * on the given exhaust row so the corridor never covers the 1500×1000 pads.
 * `bypass`: "north" goes above the pads (walks 1 and 3); "south" goes below.
 */
function buildWalkUPath(
  ox: number,
  oy: number,
  walkHalf: number,
  channelY: number,
  padRowYMm: number,
  bypass: "north" | "south",
) {
  const padY = oy + padRowYMm;
  const bypassY = bypass === "north" ? padY - walkHalf : padY + BLOCK_H + walkHalf;
  const xEnd = ox + ROOF_W;

  type Pt = { x: number; y: number };
  const points: Pt[] = [{ x: ox, y: channelY }];
  const corridors: WalkCorridor[] = [];

  const append = (x: number, y: number) => {
    const prev = points[points.length - 1];
    if (Math.abs(prev.x - x) < 0.01 && Math.abs(prev.y - y) < 0.01) return;
    corridors.push(corridorFromSegment(prev.x, prev.y, x, y, walkHalf));
    points.push({ x, y });
  };

  for (const padX of BLOCK_XS) {
    const absPadX = ox + padX;
    const westLegX = absPadX - walkHalf;
    const eastLegX = absPadX + BLOCK_W + walkHalf;
    append(westLegX, channelY);
    append(westLegX, bypassY);
    append(eastLegX, bypassY);
    append(eastLegX, channelY);
  }
  append(xEnd, channelY);

  const d = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x} ${p.y}`).join(" ");
  return {
    channelY,
    walkTop: channelY - walkHalf,
    walkBot: channelY + walkHalf,
    pathD: d,
    corridors,
  };
}

/**
 * Layout:
 *   row1 (N–S portrait) → EW walk1 (on north exhaust line, U around pads) →
 *   rows 2–5 (E–W landscape) → EW walk2 → rows 6–8 → EW walk3 → row9
 * N–S walkway is centered and only spans between the outer EW walkways.
 */
export function buildSiteLayout(ox: number, oy: number) {
  const walkHalf = WALKWAY / 2;
  /** N–S walk centered in the gap between the west-6 and east-7 landscape blocks. */
  const nsWalkMidX =
    ox + WEST_LANDSCAPE_TARGET + (ROOF_W - WEST_LANDSCAPE_TARGET - EAST_LANDSCAPE_TARGET) / 2;
  const cylinderR = CIRCLE_DIA / 2;
  const cylinders: CylinderBlock[] = ROW_YS.flatMap((yMm, rowIndex) =>
    BLOCK_XS.map((xMm, colIndex) => {
      const x = ox + xMm;
      const y = oy + yMm;
      return {
        n: rowIndex * 3 + colIndex + 1,
        x,
        y,
        cx: x + BLOCK_W / 2,
        cy: y + BLOCK_H / 2,
      };
    }),
  );

  const row1Y = oy;
  const row9Y = oy + ROOF_H - PANEL_LONG;
  const row1Bot = row1Y + PANEL_LONG;

  const northBlock = stackHeight(LANDSCAPE_ROWS_NORTH, PANEL_SHORT, PANEL_GAP);

  /**
   * Mid pack lives in the 9200 mm gap between the two exhaust pad rows:
   *   4 × landscape WE (rows 2–5) → E–W walk 2 → 3 × landscape WE (rows 6–8).
   * Flush under the north pads; remaining gap slack (ROW_GAP − mid pack) sits
   * above the south pads and clears the walk-3 U-bypass. Walk 1 sits between
   * row 1 and the mid pack with equal clearance; walk 3 U-bypasses north of
   * the south pads.
   */
  const northPadBot = oy + FROM_NORTH + BLOCK_H;
  const southPadTop = oy + ROW_YS[1];

  const northRowsTop = northPadBot;
  const walk2Top = northRowsTop + northBlock;
  const southRowsTop = walk2Top + WALKWAY;

  const walk1Span = northRowsTop - row1Bot;
  const walk1Top = row1Bot + Math.max(0, (walk1Span - WALKWAY) / 2);
  const walk1ChannelY = walk1Top + walkHalf;
  const walk3ChannelY = southPadTop + BLOCK_H / 2;

  const northWalk = buildWalkUPath(ox, oy, walkHalf, walk1ChannelY, ROW_YS[0], "north");
  const southWalk = buildWalkUPath(ox, oy, walkHalf, walk3ChannelY, ROW_YS[1], "north");

  const uWalkCorridors = [...northWalk.corridors, ...southWalk.corridors];

  const hitsObstacle = (x: number, y: number, panelW: number, panelH: number) => {
    if (cylinders.some((block) => aabbHitsAabb(x, y, panelW, panelH, block.x, block.y, BLOCK_W, BLOCK_H))) {
      return true;
    }
    if (uWalkCorridors.some((c) => aabbHitsAabb(x, y, panelW, panelH, c.x, c.y, c.w, c.h))) {
      return true;
    }
    return cylinders.some((cyl) =>
      JAIPUR_SHADOWS_PACK.some((cast) =>
        stadiumHitsAabb(cyl.cx, cyl.cy, cylinderR, cast.dx, cast.dy, x, y, panelW, panelH),
      ),
    );
  };
  const obstacleRight = (x: number, y: number, panelW: number, panelH: number) => {
    let right = x;
    for (const block of cylinders) {
      if (aabbHitsAabb(x, y, panelW, panelH, block.x, block.y, BLOCK_W, BLOCK_H)) {
        right = Math.max(right, block.x + BLOCK_W);
      }
    }
    for (const c of uWalkCorridors) {
      if (aabbHitsAabb(x, y, panelW, panelH, c.x, c.y, c.w, c.h)) {
        right = Math.max(right, c.x + c.w);
      }
    }
    for (const cyl of cylinders) {
      for (const cast of JAIPUR_SHADOWS_PACK) {
        if (!stadiumHitsAabb(cyl.cx, cyl.cy, cylinderR, cast.dx, cast.dy, x, y, panelW, panelH)) continue;
        right = Math.max(right, Math.max(cyl.cx, cyl.cx + cast.dx) + cylinderR);
      }
    }
    return right;
  };

  const freeSpansAtY = (y: number, panelW: number, panelH: number, xMin: number, xMax: number) => {
    const spans: Array<{ x0: number; x1: number }> = [];
    let x = xMin;
    let steps = 0;
    while (x + panelW <= xMax + 0.01 && steps < 200000) {
      steps += 1;
      if (hitsObstacle(x, y, panelW, panelH)) {
        const nextX = obstacleRight(x, y, panelW, panelH);
        x = nextX > x ? nextX : x + 1;
        continue;
      }
      const start = x;
      while (x + panelW <= xMax + 0.01 && !hitsObstacle(x, y, panelW, panelH)) {
        x += 1;
        steps += 1;
        if (steps >= 200000) break;
      }
      spans.push({ x0: start, x1: x - 1 + panelW });
    }
    return spans;
  };

  const packSpanAligned = (
    y: number,
    panelW: number,
    panelH: number,
    span: { x0: number; x1: number },
    align: "west" | "east" | "center",
  ) => {
    const width = span.x1 - span.x0;
    const count = Math.floor((width + PANEL_GAP) / (panelW + PANEL_GAP));
    if (count <= 0) return [] as PanelPlacement[];
    const used = count * panelW + (count - 1) * PANEL_GAP;
    const startX =
      align === "east" ? span.x1 - used : align === "west" ? span.x0 : span.x0 + (width - used) / 2;
    const panels: PanelPlacement[] = [];
    for (let i = 0; i < count; i += 1) {
      panels.push({ x: startX + i * (panelW + PANEL_GAP), y, w: panelW, h: panelH });
    }
    return panels;
  };

  const packRowInRanges = (
    y: number,
    panelW: number,
    panelH: number,
    ranges: Array<{ xMin: number; xMax: number }>,
    mode: "walls" | "center",
    freeSpans: typeof freeSpansAtY,
  ) =>
    ranges.flatMap(({ xMin, xMax }, rangeIndex) => {
      const spans = freeSpans(y, panelW, panelH, xMin, xMax);
      return spans.flatMap((span, spanIndex) => {
        let align: "west" | "east" | "center" = "center";
        if (mode === "walls") {
          if (rangeIndex === 0 && spanIndex === 0) align = "west";
          else if (rangeIndex === ranges.length - 1 && spanIndex === spans.length - 1) align = "east";
        }
        return packSpanAligned(y, panelW, panelH, span, align);
      });
    });

  const packRowSymmetric = (
    y: number,
    panelW: number,
    panelH: number,
    ranges: Array<{ xMin: number; xMax: number }>,
  ) => packRowInRanges(y, panelW, panelH, ranges, "walls", freeSpansAtY);

  const fullWidthRanges = [{ xMin: ox, xMax: ox + ROOF_W }];
  const splitByNsWalkRanges = [
    { xMin: ox, xMax: nsWalkMidX - walkHalf },
    { xMin: nsWalkMidX + walkHalf, xMax: ox + ROOF_W },
  ];

  const walkMidYs = [northWalk.channelY, walk2Top + WALKWAY / 2, southWalk.channelY];
  const nsWalkY = northWalk.walkTop;
  const nsWalkH = southWalk.walkBot - northWalk.walkTop;

  const straightWalkCorridors: WalkCorridor[] = [{ x: ox, y: walk2Top, w: ROOF_W, h: WALKWAY }];
  const hitsWithStraightWalks = (x: number, y: number, panelW: number, panelH: number) =>
    hitsObstacle(x, y, panelW, panelH) ||
    straightWalkCorridors.some((c) => aabbHitsAabb(x, y, panelW, panelH, c.x, c.y, c.w, c.h));

  const freeSpansAtYAll = (y: number, panelW: number, panelH: number, xMin: number, xMax: number) => {
    const spans: Array<{ x0: number; x1: number }> = [];
    let x = xMin;
    let steps = 0;
    while (x + panelW <= xMax + 0.01 && steps < 200000) {
      steps += 1;
      if (hitsWithStraightWalks(x, y, panelW, panelH)) {
        let nextX = obstacleRight(x, y, panelW, panelH);
        for (const c of straightWalkCorridors) {
          if (aabbHitsAabb(x, y, panelW, panelH, c.x, c.y, c.w, c.h)) nextX = Math.max(nextX, c.x + c.w);
        }
        x = nextX > x ? nextX : x + 1;
        continue;
      }
      const start = x;
      while (x + panelW <= xMax + 0.01 && !hitsWithStraightWalks(x, y, panelW, panelH)) {
        x += 1;
        steps += 1;
        if (steps >= 200000) break;
      }
      spans.push({ x0: start, x1: x - 1 + panelW });
    }
    return spans;
  };

  /** Middle landscape rows: flush to outer west/east walls; center only between obstacles. */
  const packRowSymmetricAll = (
    y: number,
    panelW: number,
    panelH: number,
    ranges: Array<{ xMin: number; xMax: number }>,
  ) => packRowInRanges(y, panelW, panelH, ranges, "walls", freeSpansAtYAll);

  const northRowYs = Array.from(
    { length: LANDSCAPE_ROWS_NORTH },
    (_, i) => northRowsTop + i * (PANEL_SHORT + PANEL_GAP),
  );
  const southRowYs = Array.from(
    { length: LANDSCAPE_ROWS_SOUTH },
    (_, i) => southRowsTop + i * (PANEL_SHORT + PANEL_GAP),
  );

  const row1Portraits = packRowSymmetric(row1Y, PANEL_SHORT, PANEL_LONG, fullWidthRanges);

  /** In the wide gaps between row-1 portrait groups, fit E–W landscape panels (1155 N–S tall). */
  const fillRow1LandscapeInGaps = (portraits: PanelPlacement[]) => {
    const sorted = [...portraits].sort((a, b) => a.x - b.x);
    const extras: PanelPlacement[] = [];
    const y = row1Y; // sit at north of the row-1 band (clears walk-1 U)
    for (let i = 0; i < sorted.length - 1; i += 1) {
      const gapLeft = sorted[i].x + sorted[i].w + PANEL_GAP;
      const gapRight = sorted[i + 1].x - PANEL_GAP;
      const gapW = gapRight - gapLeft;
      if (gapW < PANEL_LONG - 0.01) continue;
      const count = Math.floor((gapW + PANEL_GAP) / (PANEL_LONG + PANEL_GAP));
      if (count <= 0) continue;
      const used = count * PANEL_LONG + (count - 1) * PANEL_GAP;
      let startX = gapLeft + (gapW - used) / 2;
      for (let n = 0; n < count; n += 1) {
        const x = startX + n * (PANEL_LONG + PANEL_GAP);
        if (hitsObstacle(x, y, PANEL_LONG, PANEL_SHORT)) continue;
        extras.push({ x, y, w: PANEL_LONG, h: PANEL_SHORT });
      }
    }
    return extras;
  };

  const roofPanels: PanelPlacement[] = [
    ...row1Portraits,
    ...fillRow1LandscapeInGaps(row1Portraits),
    ...northRowYs.flatMap((y) => packRowSymmetricAll(y, PANEL_LONG, PANEL_SHORT, splitByNsWalkRanges)),
    ...southRowYs.flatMap((y) => packRowSymmetricAll(y, PANEL_LONG, PANEL_SHORT, splitByNsWalkRanges)),
    ...packRowSymmetricAll(row9Y, PANEL_SHORT, PANEL_LONG, fullWidthRanges),
  ];

  /**
   * Sparse landscape rows pack the first east group a bit off the full-row grid.
   * Snap those panels onto the matching full-row east columns (e.g. row2 #6–8 → row3 #8–10)
   * when the whole move clears the next panel.
   */
  const nsWalkRight = nsWalkMidX + walkHalf;
  const alignSparseEastToFullRow = (sparseY: number, fullY: number) => {
    const sparse = roofPanels
      .filter((p) => Math.abs(p.y - sparseY) < 0.5 && p.x >= nsWalkRight - 0.5)
      .sort((a, b) => a.x - b.x);
    const full = roofPanels
      .filter((p) => Math.abs(p.y - fullY) < 0.5 && p.x >= nsWalkRight - 0.5)
      .sort((a, b) => a.x - b.x);
    const n = Math.min(3, sparse.length, full.length);
    if (n <= 0) return;
    const targets = full.slice(0, n).map((p) => p.x);
    const firstRemain = sparse[n];
    if (firstRemain && targets[n - 1] + PANEL_LONG + PANEL_GAP > firstRemain.x + 0.01) return;
    for (let i = 0; i < n; i += 1) sparse[i].x = targets[i];
  };
  if (northRowYs.length >= 2) alignSparseEastToFullRow(northRowYs[0], northRowYs[1]);
  if (southRowYs.length >= 2) {
    alignSparseEastToFullRow(southRowYs[southRowYs.length - 1], southRowYs[southRowYs.length - 2]);
  }

  const rowStatsMap = new Map<number, { y: number; h: number; count: number }>();
  for (const panel of roofPanels) {
    const key = Math.round(panel.y);
    const existing = rowStatsMap.get(key);
    if (existing) existing.count += 1;
    else rowStatsMap.set(key, { y: panel.y, h: panel.h, count: 1 });
  }
  const rowStats = [...rowStatsMap.values()].sort((a, b) => a.y - b.y);

  return {
    midRoofX: nsWalkMidX,
    walkHalf,
    walkMidYs,
    walk1PathD: northWalk.pathD,
    walk3PathD: southWalk.pathD,
    straightWalkTops: [walk2Top],
    nsWalkY,
    nsWalkH,
    cylinderR,
    cylinders,
    roofPanels,
    rowStats,
  };
}

export const SITE_PAD = Math.max(ROOF_W, ROOF_H) * 0.08;

export type SiteLayout = ReturnType<typeof buildSiteLayout>;

export function createSiteLayout() {
  return buildSiteLayout(SITE_PAD, SITE_PAD);
}

export const WORKING_SITE_LAYOUT = createSiteLayout();
