import { jaipurWinterShadowCasts, stadiumHitsAabb } from "./jaipur-shadow";
import {
  PANEL_BRAND,
  PANEL_GAP,
  PANEL_LONG,
  PANEL_SHORT,
  PANEL_WP,
  WALKWAY,
  WALKWAY_MARGIN,
  WALKWAY_PATH,
  formatMm,
  formatPanelCapacityKw,
} from "./build-site-layout";

export {
  formatMm,
  formatPanelCapacityKw,
  PANEL_BRAND,
  PANEL_WP,
  PANEL_SHORT,
  PANEL_LONG,
  PANEL_GAP,
  WALKWAY,
  WALKWAY_MARGIN,
  WALKWAY_PATH,
};

/** Hemant Tanwani 90 kW — exhaust pads match Mukesh (1500 × 1000). */
export const BLOCK_W = 1500;
export const BLOCK_H = 1000;

/** N → north exhaust row, gap between pad rows, south exhaust → S wall. */
export const FROM_NORTH = 2900;
export const ROW_GAP = 7100;
export const FROM_SOUTH = 5200;

/** W → west pad, gap between the two columns, east pad → E wall. */
export const FROM_WEST = 4300;
export const GAP_12 = 12200;
export const FROM_EAST = 8000;

export const BLOCK_XS = [FROM_WEST, FROM_WEST + BLOCK_W + GAP_12];
export const ROW_YS = [FROM_NORTH, FROM_NORTH + BLOCK_H + ROW_GAP];

export const ROOF_W = FROM_WEST + BLOCK_W + GAP_12 + BLOCK_W + FROM_EAST;
export const ROOF_H = FROM_NORTH + BLOCK_H + ROW_GAP + BLOCK_H + FROM_SOUTH;

export const MM_PER_FT = 304.8;
export const CIRCLE_DIA_FT = 2;
export const CIRCLE_DIA = CIRCLE_DIA_FT * MM_PER_FT;
export const CYLINDER_HEIGHT_FT = 2;
export const CYLINDER_H = CYLINDER_HEIGHT_FT * MM_PER_FT;
export const CYLINDER_HEIGHT_LABEL = `${CYLINDER_HEIGHT_FT} ft`;

/** Match Mukesh: 90% of full winter-solstice cast. */
export const SHADOW_SCALE = 0.9;
export const JAIPUR_SHADOWS = jaipurWinterShadowCasts(CYLINDER_H).map((cast) => ({
  ...cast,
  lengthMm: cast.lengthMm * SHADOW_SCALE,
  dx: cast.dx * SHADOW_SCALE,
  dy: cast.dy * SHADOW_SCALE,
}));

export const SITE_PAD = Math.max(ROOF_W, ROOF_H) * 0.08;

type CylinderBlock = { n: number; x: number; y: number; cx: number; cy: number };
type PanelPlacement = { x: number; y: number; w: number; h: number };
type WalkCorridor = { x: number; y: number; w: number; h: number };

export type HemanthSiteLayout = {
  midRoofX: number;
  walkHalf: number;
  walk1PathD: string;
  walk2PathD: string;
  /** N–S walk through rows 1–2 (unchanged by south-band walk shift). */
  northNsWalkX: number;
  northNsWalkY: number;
  northNsWalkH: number;
  /** N–S walk through rows 3–5 (west-shifted). */
  nsWalkY: number;
  nsWalkH: number;
  /** Separate N–S stub in the last-two-rows leftover (may not align with midRoofX). */
  southNsWalkX: number;
  southNsWalkY: number;
  southNsWalkH: number;
  cylinderR: number;
  cylinders: CylinderBlock[];
  roofPanels: PanelPlacement[];
  rowStats: Array<{ y: number; h: number; count: number }>;
};

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

/** E–W walk with U-bypass north of each pad on that exhaust row. */
function buildWalkUPath(
  ox: number,
  oy: number,
  walkHalf: number,
  channelY: number,
  padRowYMm: number,
) {
  const padY = oy + padRowYMm;
  const bypassY = padY - walkHalf;
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

/** Straight E–W walk (no pad bypass) — used between row 7 and the south wall. */
function buildStraightWalk(ox: number, walkHalf: number, channelY: number) {
  const xEnd = ox + ROOF_W;
  const corridors = [corridorFromSegment(ox, channelY, xEnd, channelY, walkHalf)];
  return {
    channelY,
    walkTop: channelY - walkHalf,
    walkBot: channelY + walkHalf,
    pathD: `M${ox} ${channelY} L${xEnd} ${channelY}`,
    corridors,
  };
}

/**
 * Layout:
 *   row1 + row2 N–S → straight EW walk1 → 3× N–S south band → straight EW walk2 → 2× N–S at south wall.
 *   Split N–S walks: north (rows 1–2), mid (rows 3–5), south stub (last two rows).
 */
export type HemanthLayoutVariant = "working" | "v2";

export function buildHemanthLayout(
  ox: number,
  oy: number,
  variant: HemanthLayoutVariant = "working",
): HemanthSiteLayout {
  const walkHalf = WALKWAY / 2;
  const cylinderR = CIRCLE_DIA / 2;
  const cylinders: CylinderBlock[] = ROW_YS.flatMap((yMm, rowIndex) =>
    BLOCK_XS.map((xMm, colIndex) => {
      const x = ox + xMm;
      const y = oy + yMm;
      return {
        n: rowIndex * BLOCK_XS.length + colIndex + 1,
        x,
        y,
        cx: x + BLOCK_W / 2,
        cy: y + BLOCK_H / 2,
      };
    }),
  );

  /**
   * working: mid N–S walk just west of the 6th panel from the east wall;
   *         same walk continues to the north wall through row 1.
   * v2: prior mid walk (≈14190); north segment stays at 14700 for row 2.
   */
  let nsWalkMidX: number;
  let northNsWalkMidX: number;
  if (variant === "v2") {
    nsWalkMidX = ox + 11_990;
    northNsWalkMidX = ox + 12_500;
  } else {
    const southBandEastKeep = 6;
    const southBandEastUsed =
      southBandEastKeep * PANEL_SHORT + Math.max(0, southBandEastKeep - 1) * PANEL_GAP;
    const southBandEastStart = ox + ROOF_W - southBandEastUsed;
    nsWalkMidX = southBandEastStart - PANEL_GAP - walkHalf;
    northNsWalkMidX = nsWalkMidX;
  }

  const row1Y = oy;
  /** Second N–S line immediately after row 1; walk 1 sits below it as a straight E–W. */
  const row2Y = row1Y + PANEL_LONG + PANEL_GAP;
  const walk1Top = row2Y + PANEL_LONG + PANEL_GAP;
  const walk1ChannelY = walk1Top + walkHalf;

  /**
   * Edge N–S rows keep 23 panels (11 west + 12 east) for now; walk mid above
   * is driven by row‑7 planning rather than the edge leftover.
   */
  const edgeNsCount = Math.floor((ROOF_W + PANEL_GAP) / (PANEL_SHORT + PANEL_GAP));
  const edgeNsWestCount = Math.floor(edgeNsCount / 2);
  const edgeNsEastCount = edgeNsCount - edgeNsWestCount;
  const edgeNsWestUsed = edgeNsWestCount * PANEL_SHORT + Math.max(0, edgeNsWestCount - 1) * PANEL_GAP;
  const edgeNsEastUsed = edgeNsEastCount * PANEL_SHORT + Math.max(0, edgeNsEastCount - 1) * PANEL_GAP;
  const edgeNsWestEnd = ox + edgeNsWestUsed;
  const edgeNsEastStart = ox + ROOF_W - edgeNsEastUsed;
  /** Last-two-rows leftover centre — N–S stub may differ from midRoofX. */
  const southNsWalkMidX = (edgeNsWestEnd + edgeNsEastStart) / 2;

  /**
   * South wall: 2× N–S portrait rows. Walk 2 sits just above them;
   * the south N–S band is stacked above that walkway.
   */
  const southNs2Y = oy + ROOF_H - PANEL_LONG;
  const southNs1Y = southNs2Y - PANEL_GAP - PANEL_LONG;
  const walk2BotTarget = southNs1Y - PANEL_GAP;
  const walk2ChannelY = walk2BotTarget - walkHalf;

  /** Walk 1 — straight E–W below the second north N–S row (no pad U-bypass). */
  const walk1 = buildStraightWalk(ox, walkHalf, walk1ChannelY);
  /** Walk 2 — straight E–W between south N–S band and wall rows. */
  const walk2 = buildStraightWalk(ox, walkHalf, walk2ChannelY);
  /** Three N–S rows above walk2 (same style as former “3rd last”), stacked northward. */
  const southBandYs = [0, 1, 2].map(
    (i) => walk2.walkTop - (i + 1) * (PANEL_LONG + PANEL_GAP),
  );

  /**
   * Split N–S walk: north segment (rows 1–2) + mid segment (rows 3–5).
   * Working uses the same X to the north wall; v2 keeps north at 14700.
   */
  const northNsWalkX = northNsWalkMidX;
  const northNsWalkY = oy;
  const northNsWalkH = walk1.walkBot - oy;
  const northNsCorridor: WalkCorridor = {
    x: northNsWalkX - walkHalf,
    y: northNsWalkY,
    w: WALKWAY,
    h: northNsWalkH,
  };
  const nsWalkY = walk1.walkBot;
  const nsWalkH = walk2.walkTop - walk1.walkBot;
  const nsCorridor: WalkCorridor = {
    x: nsWalkMidX - walkHalf,
    y: nsWalkY,
    w: WALKWAY,
    h: nsWalkH,
  };
  const southNsWalkX = southNsWalkMidX;
  const southNsWalkY = walk2.walkBot;
  const southNsWalkH = oy + ROOF_H - walk2.walkBot;
  const southNsCorridor: WalkCorridor = {
    x: southNsWalkX - walkHalf,
    y: southNsWalkY,
    w: WALKWAY,
    h: southNsWalkH,
  };

  const walkCorridors = [
    ...walk1.corridors,
    ...walk2.corridors,
    northNsCorridor,
    nsCorridor,
    southNsCorridor,
  ];

  const hitsObstacle = (x: number, y: number, panelW: number, panelH: number) => {
    if (cylinders.some((block) => aabbHitsAabb(x, y, panelW, panelH, block.x, block.y, BLOCK_W, BLOCK_H))) {
      return true;
    }
    if (walkCorridors.some((c) => aabbHitsAabb(x, y, panelW, panelH, c.x, c.y, c.w, c.h))) {
      return true;
    }
    return cylinders.some((cyl) =>
      JAIPUR_SHADOWS.some((cast) =>
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
    for (const c of walkCorridors) {
      if (aabbHitsAabb(x, y, panelW, panelH, c.x, c.y, c.w, c.h)) {
        right = Math.max(right, c.x + c.w);
      }
    }
    for (const cyl of cylinders) {
      for (const cast of JAIPUR_SHADOWS) {
        if (!stadiumHitsAabb(cyl.cx, cyl.cy, cylinderR, cast.dx, cast.dy, x, y, panelW, panelH)) continue;
        right = Math.max(right, Math.max(cyl.cx, cyl.cx + cast.dx) + cylinderR);
      }
    }
    return right;
  };

  const packInRanges = (
    y: number,
    panelW: number,
    panelH: number,
    ranges: Array<{ xMin: number; xMax: number }>,
  ): PanelPlacement[] => {
    const panels: PanelPlacement[] = [];
    ranges.forEach(({ xMin, xMax }, rangeIndex) => {
      const spans: Array<{ x0: number; x1: number }> = [];
      let x = xMin;
      let steps = 0;
      while (x + panelW <= xMax + 0.01 && steps < 400000) {
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
          if (steps >= 400000) break;
        }
        spans.push({ x0: start, x1: x - 1 + panelW });
      }
      spans.forEach((span, spanIndex) => {
        const width = span.x1 - span.x0;
        const count = Math.floor((width + PANEL_GAP) / (panelW + PANEL_GAP));
        if (count <= 0) return;
        const used = count * panelW + (count - 1) * PANEL_GAP;
        let align: "west" | "east" | "center" = "center";
        if (rangeIndex === 0 && spanIndex === 0) align = "west";
        else if (rangeIndex === ranges.length - 1 && spanIndex === spans.length - 1) align = "east";
        const startX =
          align === "east" ? span.x1 - used : align === "west" ? span.x0 : span.x0 + (width - used) / 2;
        for (let i = 0; i < count; i += 1) {
          panels.push({ x: startX + i * (panelW + PANEL_GAP), y, w: panelW, h: panelH });
        }
      });
    });
    return panels;
  };

  const fullWidth = [{ xMin: ox, xMax: ox + ROOF_W }];

  /**
   * Edge N–S rows: 23 panels — west half flush west, east half flush east
   * (touches east wall). N–S walk runs in the leftover between the halves.
   */
  const packFullNsRow = (y: number): PanelPlacement[] => {
    const panels: PanelPlacement[] = [];
    for (let i = 0; i < edgeNsWestCount; i += 1) {
      panels.push({
        x: ox + i * (PANEL_SHORT + PANEL_GAP),
        y,
        w: PANEL_SHORT,
        h: PANEL_LONG,
      });
    }
    for (let i = 0; i < edgeNsEastCount; i += 1) {
      panels.push({
        x: edgeNsEastStart + i * (PANEL_SHORT + PANEL_GAP),
        y,
        w: PANEL_SHORT,
        h: PANEL_LONG,
      });
    }
    return panels;
  };

  /** N–S row with `eastKeep` panels flush east; west filled to mid walk (+ optional squeeze). */
  const packNsRowEastKeep = (y: number, eastKeep: number, squeezeMm = 0): PanelPlacement[] => {
    const eastUsed = eastKeep * PANEL_SHORT + Math.max(0, eastKeep - 1) * PANEL_GAP;
    const eastStart = ox + ROOF_W - eastUsed;
    const walkLeft = nsWalkMidX - walkHalf;
    const panels: PanelPlacement[] = [];
    for (let i = 0; i < eastKeep; i += 1) {
      panels.push({
        x: eastStart + i * (PANEL_SHORT + PANEL_GAP),
        y,
        w: PANEL_SHORT,
        h: PANEL_LONG,
      });
    }
    let x = ox;
    while (x + PANEL_SHORT <= walkLeft + 0.01) {
      panels.push({ x, y, w: PANEL_SHORT, h: PANEL_LONG });
      x += PANEL_SHORT + PANEL_GAP;
    }
    if (squeezeMm > 0 && x + PANEL_SHORT <= walkLeft + squeezeMm + 0.01) {
      panels.push({ x, y, w: PANEL_SHORT, h: PANEL_LONG });
    }
    return panels.sort((a, b) => a.x - b.x);
  };

  /** Row 1 — working aligns gap to mid walk (6-from-east) up to north wall; v2 keeps 11+12. */
  const row1Panels =
    variant === "working" ? packNsRowEastKeep(row1Y, 6, 5) : packFullNsRow(row1Y);
  const roofPanels: PanelPlacement[] = [
    ...row1Panels,
    ...packInRanges(row2Y, PANEL_SHORT, PANEL_LONG, fullWidth),
  ];

  /** Three N–S rows above walk2 (obstacle-aware); then wall rows. */
  const southBandPanels = southBandYs.map((y) => packInRanges(y, PANEL_SHORT, PANEL_LONG, fullWidth));
  if (variant === "working") {
    /**
     * Rows 3–4 (southBand [2] and [1]): ~1170 mm west of walk — squeeze in one
     * more N–S panel (5 mm into the walk corridor).
     */
    const walkLeft = nsWalkMidX - walkHalf;
    for (const bandIndex of [1, 2]) {
      const y = southBandYs[bandIndex];
      const panels = southBandPanels[bandIndex];
      const west = panels
        .filter((p) => p.x + p.w <= walkLeft + 0.5)
        .sort((a, b) => a.x - b.x);
      if (west.length === 0) continue;
      const last = west[west.length - 1];
      const extraX = last.x + last.w + PANEL_GAP;
      if (extraX + PANEL_SHORT <= walkLeft + 5.01) {
        panels.push({ x: extraX, y, w: PANEL_SHORT, h: PANEL_LONG });
        panels.sort((a, b) => a.x - b.x);
      }
    }
  } else if (variant === "v2") {
    /**
     * v2 row 5: drop the 8th panel, then add one in the east-of-walk gap if it fits.
     */
    if (southBandPanels[0].length >= 8) {
      southBandPanels[0].splice(7, 1);
    }
    const row5Y = southBandYs[0];
    const row5 = southBandPanels[0];
    const walkRight = nsWalkMidX + walkHalf;
    const eastPanels = row5.filter((p) => p.x >= walkRight - 0.5).sort((a, b) => a.x - b.x);
    if (eastPanels.length > 0) {
      const extraX = eastPanels[0].x - PANEL_GAP - PANEL_SHORT;
      if (extraX + 0.01 >= walkRight) {
        row5.push({ x: extraX, y: row5Y, w: PANEL_SHORT, h: PANEL_LONG });
        row5.sort((a, b) => a.x - b.x);
      }
    }
  }
  for (const panels of southBandPanels) {
    roofPanels.push(...panels);
  }
  roofPanels.push(...packFullNsRow(southNs1Y));
  roofPanels.push(...packFullNsRow(southNs2Y));

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
    walk1PathD: walk1.pathD,
    walk2PathD: walk2.pathD,
    northNsWalkX,
    northNsWalkY,
    northNsWalkH,
    nsWalkY,
    nsWalkH,
    southNsWalkX,
    southNsWalkY,
    southNsWalkH,
    cylinderR,
    cylinders,
    roofPanels,
    rowStats,
  };
}

export function createHemanthLayout(variant: HemanthLayoutVariant = "working") {
  return buildHemanthLayout(SITE_PAD, SITE_PAD, variant);
}

/** Current working: mid walk west of 6th-from-east panel on rows 3–5. */
export const WORKING_HEMANTH_LAYOUT = createHemanthLayout("working");
