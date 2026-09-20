import {
  BLOCK_H,
  PANEL_GAP,
  PANEL_LONG,
  PANEL_SHORT,
  ROOF_W,
  SITE_PAD,
  WALKWAY,
  type HemanthSiteLayout,
} from "./build-hemanth-layout";
import { HEMANTH_LAYOUT_V1 } from "./hemanth-snapshot-v1";

/**
 * v2 = v1 geometry with walk 1 moved to just after row 1 and row 2 shifted
 * down below that walk. Row 2 mid band is recentered; one E–W module sits
 * under each north exhaust in the leftover strip.
 */
export function buildHemanthLayoutV2FromV1(v1: HemanthSiteLayout = HEMANTH_LAYOUT_V1): HemanthSiteLayout {
  const ox = SITE_PAD;
  const oy = SITE_PAD;
  const walkHalf = WALKWAY / 2;

  const rowYs = [...new Set(v1.roofPanels.map((p) => Math.round(p.y)))].sort((a, b) => a - b);
  const row1Y = rowYs[0];
  const row2YOld = rowYs[1];

  const walk1Top = row1Y + PANEL_LONG + PANEL_GAP;
  const walk1ChannelY = walk1Top + walkHalf;
  const walk1Bot = walk1Top + WALKWAY;
  const row2YNew = walk1Bot + PANEL_GAP;
  const row2Shift = row2YNew - row2YOld;

  let roofPanels = v1.roofPanels.map((panel) => {
    if (Math.round(panel.y) !== Math.round(row2YOld)) return { ...panel };
    return { ...panel, y: panel.y + row2Shift };
  });

  const northNsWalkH = walk1Bot - oy;
  const nsWalkY = walk1Bot;
  const nsWalkH = v1.southNsWalkY - walk1Bot;
  const walkLeft = v1.midRoofX - walkHalf;

  const row2Panels = roofPanels
    .filter((p) => Math.round(p.y) === Math.round(row2YNew))
    .sort((a, b) => a.x - b.x);

  if (row2Panels.length >= 12) {
    const westEdge = row2Panels.filter((_, i) => i < 3);
    const eastEdge = row2Panels.filter((_, i) => i >= 12);
    const midCount = 10;
    const northPads = v1.cylinders.filter((c) => c.n === 1 || c.n === 2).sort((a, b) => a.x - b.x);
    const ewY = northPads[0].y + BLOCK_H;

    const westLimit = westEdge[westEdge.length - 1].x + westEdge[westEdge.length - 1].w + PANEL_GAP;
    const eastLimit = eastEdge[0].x - PANEL_GAP;

    const ewPanels: Array<{ x: number; y: number; w: number; h: number }> = [];
    /** West E–W: flush after west N–S edge, under / past first exhaust. */
    if (westLimit + PANEL_LONG <= eastLimit + 0.01) {
      ewPanels.push({ x: westLimit, y: ewY, w: PANEL_LONG, h: PANEL_SHORT });
    }
    /** East E–W: flush before mid walk (and east N–S edge), under second exhaust. */
    const eastEwEnd = Math.min(eastLimit, walkLeft - PANEL_GAP);
    const eastEwX = eastEwEnd - PANEL_LONG;
    if (
      ewPanels.length > 0 &&
      eastEwX >= ewPanels[0].x + PANEL_LONG + PANEL_GAP - 0.01
    ) {
      ewPanels.push({ x: eastEwX, y: ewY, w: PANEL_LONG, h: PANEL_SHORT });
    }

    const midStart = (ewPanels[0]?.x ?? westLimit) + (ewPanels[0] ? PANEL_LONG + PANEL_GAP : 0);
    const midEndLimit = ewPanels[1] ? ewPanels[1].x - PANEL_GAP : eastLimit;
    const midClear = midEndLimit - midStart;
    const midUsed = midCount * PANEL_SHORT + Math.max(0, midCount - 1) * PANEL_GAP;
    const midX0 = midStart + Math.max(0, (midClear - midUsed) / 2);
    const midPanels: Array<{ x: number; y: number; w: number; h: number }> = [];
    for (let i = 0; i < midCount; i += 1) {
      const x = midX0 + i * (PANEL_SHORT + PANEL_GAP);
      if (x + PANEL_SHORT > midEndLimit + 0.01) break;
      midPanels.push({ x, y: row2YNew, w: PANEL_SHORT, h: PANEL_LONG });
    }

    roofPanels = [
      ...roofPanels.filter((p) => Math.round(p.y) !== Math.round(row2YNew)),
      ...westEdge,
      ...eastEdge,
      ...midPanels,
      ...ewPanels,
    ];
  }

  /**
   * Bottom two N–S rows: keep 23 panels, but put the N–S walk on the same
   * X as the mid walk (was a separate leftover-centred stub).
   */
  const southWalkX = v1.midRoofX;
  const southWalkRight = southWalkX + walkHalf;
  const bottomYs = [...new Set(roofPanels.map((p) => Math.round(p.y)))]
    .sort((a, b) => a - b)
    .slice(-2);
  const packBottomRow = (y: number) => {
    const eastSpace = ox + ROOF_W - southWalkRight;
    const eastCount = Math.floor((eastSpace + PANEL_GAP) / (PANEL_SHORT + PANEL_GAP));
    const westCount = 23 - eastCount;
    const panels: Array<{ x: number; y: number; w: number; h: number }> = [];
    for (let i = 0; i < westCount; i += 1) {
      panels.push({
        x: ox + i * (PANEL_SHORT + PANEL_GAP),
        y,
        w: PANEL_SHORT,
        h: PANEL_LONG,
      });
    }
    const eastStart = ox + ROOF_W - (eastCount * PANEL_SHORT + Math.max(0, eastCount - 1) * PANEL_GAP);
    for (let i = 0; i < eastCount; i += 1) {
      panels.push({
        x: eastStart + i * (PANEL_SHORT + PANEL_GAP),
        y,
        w: PANEL_SHORT,
        h: PANEL_LONG,
      });
    }
    return panels;
  };
  if (bottomYs.length === 2) {
    roofPanels = [
      ...roofPanels.filter((p) => !bottomYs.includes(Math.round(p.y))),
      ...packBottomRow(bottomYs[0]),
      ...packBottomRow(bottomYs[1]),
    ];
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
    ...v1,
    walk1PathD: `M${ox} ${walk1ChannelY} L${ox + ROOF_W} ${walk1ChannelY}`,
    walkHalf,
    midRoofX: v1.midRoofX,
    northNsWalkY: oy,
    northNsWalkH,
    nsWalkY,
    nsWalkH,
    southNsWalkX: southWalkX,
    southNsWalkY: v1.southNsWalkY,
    southNsWalkH: v1.southNsWalkH,
    roofPanels,
    rowStats,
  };
}

export const HEMANTH_LAYOUT_V2 = buildHemanthLayoutV2FromV1();

export const HEMANTH_V2_META = {
  label: "Dense layout",
  detail: "locked · walk 1 after row 1 · aligned south N–S walk",
} as const;
