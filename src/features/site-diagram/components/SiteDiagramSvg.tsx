import {
  BLOCK_H,
  BLOCK_W,
  BLOCK_XS,
  CIRCLE_DIA_FT,
  CYLINDER_HEIGHT_LABEL,
  FROM_EAST,
  FROM_NORTH,
  FROM_SOUTH,
  FROM_WEST,
  GAP_12,
  GAP_23,
  JAIPUR_SHADOWS,
  PANEL_LONG,
  PANEL_SHORT,
  ROOF_H,
  ROOF_W,
  ROW_GAP,
  ROW_YS,
  SITE_PAD,
  WALKWAY,
  WALKWAY_MARGIN,
  WALKWAY_PATH,
  formatMm,
  type SiteLayout,
} from "../lib/build-site-layout";

type SiteDiagramSvgProps = {
  layout: SiteLayout;
  /** Unique prefix so multiple diagrams on one page do not clash on defs ids. */
  idPrefix: string;
  ariaLabel?: string;
};

export function SiteDiagramSvg({ layout, idPrefix, ariaLabel }: SiteDiagramSvgProps) {
  const pad = SITE_PAD;
  const svgW = ROOF_W + pad * 2;
  const svgH = ROOF_H + pad * 2;
  const ox = pad;
  const oy = pad;
  const fs = Math.max(ROOF_W, ROOF_H) * 0.016;
  const fsDim = fs * 0.78;
  const fsBlock = fs * 0.7;
  const tick = fs * 0.28;
  const halo = fsDim * 0.22;
  const row1Cy = oy + ROW_YS[0] + BLOCK_H / 2;

  const {
    midRoofX,
    walkHalf,
    walk1PathD,
    walk3PathD,
    straightWalkTops,
    nsWalkY,
    nsWalkH,
    cylinderR,
    cylinders,
    roofPanels,
    rowStats,
  } = layout;

  const roofClipId = `${idPrefix}-roof-clip`;
  const portraitPatternId = `${idPrefix}-panel-cells-portrait`;
  const landscapePatternId = `${idPrefix}-panel-cells-landscape`;

  return (
    <svg
      className="site-diagram-svg site-diagram-svg--fill"
      viewBox={`0 0 ${svgW} ${svgH}`}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label={
        ariaLabel ??
        `Rooftop ${formatMm(ROOF_W)} by ${formatMm(ROOF_H)} with six ${CIRCLE_DIA_FT} ft by ${CYLINDER_HEIGHT_LABEL} cylinders and their Jaipur winter-solstice shadows`
      }
    >
      <text
        className="site-diagram-compass-label"
        x={ox + ROOF_W / 2}
        y={oy - pad * 0.78}
        textAnchor="middle"
        fontSize={fs * 1.5}
      >
        N
      </text>
      <text
        className="site-diagram-compass-label"
        x={ox + ROOF_W / 2}
        y={oy + ROOF_H + pad * 0.92}
        textAnchor="middle"
        fontSize={fs * 1.5}
      >
        S
      </text>
      <text
        className="site-diagram-compass-label"
        x={ox - pad * 0.78}
        y={oy + ROOF_H / 2}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={fs * 1.5}
      >
        W
      </text>
      <text
        className="site-diagram-row-summary"
        x={ox - pad * 0.32}
        y={oy - fsDim * 0.15}
        textAnchor="end"
        fontSize={fsDim * 0.85}
        stroke="#ffffff"
        strokeWidth={halo}
        paintOrder="stroke"
      >
        {rowStats.length} rows
      </text>
      {rowStats.map((row, index) => (
        <text
          key={`${idPrefix}-row-stat-${index}`}
          className="site-diagram-row-stat"
          x={ox - pad * 0.12}
          y={row.y + row.h / 2}
          textAnchor="end"
          dominantBaseline="middle"
          fontSize={fsDim * 0.72}
          stroke="#ffffff"
          strokeWidth={halo * 0.85}
          paintOrder="stroke"
        >
          {index + 1} · {row.count}
        </text>
      ))}
      <text
        className="site-diagram-compass-label"
        x={ox + ROOF_W + pad * 0.55}
        y={oy + ROOF_H / 2}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={fs * 1.5}
      >
        E
      </text>

      <defs>
        <clipPath id={roofClipId}>
          <rect x={ox} y={oy} width={ROOF_W} height={ROOF_H} />
        </clipPath>
        <pattern
          id={portraitPatternId}
          width={PANEL_SHORT / 6}
          height={PANEL_LONG / 12}
          patternUnits="userSpaceOnUse"
        >
          <rect
            className="site-diagram-panel-cell"
            x={(PANEL_SHORT / 6) * 0.08}
            y={(PANEL_LONG / 12) * 0.08}
            width={(PANEL_SHORT / 6) * 0.84}
            height={(PANEL_LONG / 12) * 0.84}
          />
        </pattern>
        <pattern
          id={landscapePatternId}
          width={PANEL_LONG / 12}
          height={PANEL_SHORT / 6}
          patternUnits="userSpaceOnUse"
        >
          <rect
            className="site-diagram-panel-cell"
            x={(PANEL_LONG / 12) * 0.08}
            y={(PANEL_SHORT / 6) * 0.08}
            width={(PANEL_LONG / 12) * 0.84}
            height={(PANEL_SHORT / 6) * 0.84}
          />
        </pattern>
      </defs>
      <rect className="site-diagram-roof" x={ox} y={oy} width={ROOF_W} height={ROOF_H} />
      <g clipPath={`url(#${roofClipId})`}>
        <rect
          className="site-diagram-walkway-margin"
          x={midRoofX - walkHalf}
          y={nsWalkY}
          width={WALKWAY_MARGIN}
          height={nsWalkH}
        />
        <rect
          className="site-diagram-walkway-margin"
          x={midRoofX + walkHalf - WALKWAY_MARGIN}
          y={nsWalkY}
          width={WALKWAY_MARGIN}
          height={nsWalkH}
        />
        <rect
          className="site-diagram-walkway-path"
          x={midRoofX - WALKWAY_PATH / 2}
          y={nsWalkY}
          width={WALKWAY_PATH}
          height={nsWalkH}
        />
        <path
          className="site-diagram-walkway-stroke-margin"
          d={walk1PathD}
          fill="none"
          strokeWidth={WALKWAY}
          strokeLinecap="square"
          strokeLinejoin="miter"
        />
        <path
          className="site-diagram-walkway-stroke-path"
          d={walk1PathD}
          fill="none"
          strokeWidth={WALKWAY_PATH}
          strokeLinecap="square"
          strokeLinejoin="miter"
        />
        {straightWalkTops.map((walkTop, index) => (
          <g key={`${idPrefix}-ew-walk-straight-${index}`}>
            <rect className="site-diagram-walkway-margin" x={ox} y={walkTop} width={ROOF_W} height={WALKWAY_MARGIN} />
            <rect
              className="site-diagram-walkway-margin"
              x={ox}
              y={walkTop + WALKWAY - WALKWAY_MARGIN}
              width={ROOF_W}
              height={WALKWAY_MARGIN}
            />
            <rect
              className="site-diagram-walkway-path"
              x={ox}
              y={walkTop + WALKWAY_MARGIN}
              width={ROOF_W}
              height={WALKWAY_PATH}
            />
          </g>
        ))}
        <path
          className="site-diagram-walkway-stroke-margin"
          d={walk3PathD}
          fill="none"
          strokeWidth={WALKWAY}
          strokeLinecap="square"
          strokeLinejoin="miter"
        />
        <path
          className="site-diagram-walkway-stroke-path"
          d={walk3PathD}
          fill="none"
          strokeWidth={WALKWAY_PATH}
          strokeLinecap="square"
          strokeLinejoin="miter"
        />
      </g>

      <text
        className="site-diagram-area-label"
        x={ox + ROOF_W / 2}
        y={oy - pad * 0.22}
        textAnchor="middle"
        fontSize={fsDim}
        stroke="#ffffff"
        strokeWidth={halo}
        paintOrder="stroke"
      >
        Rooftop · {formatMm(ROOF_W)} × {formatMm(ROOF_H)}
      </text>
      <DimensionH
        x1={ox}
        x2={ox + ROOF_W}
        y={oy + ROOF_H + pad * 0.18}
        label={formatMm(ROOF_W)}
        fontSize={fsDim}
        tick={tick}
        halo={halo}
        labelSide="below"
      />
      <DimensionV
        x={ox + ROOF_W + pad * 0.22}
        y1={oy}
        y2={oy + ROOF_H}
        label={formatMm(ROOF_H)}
        fontSize={fsDim}
        tick={tick}
        halo={halo}
        labelSide="end"
      />

      <g clipPath={`url(#${roofClipId})`}>
        {roofPanels.map((panel, index) => (
          <SolarPanel
            key={`${idPrefix}-panel-${index}`}
            x={panel.x}
            y={panel.y}
            width={panel.w}
            height={panel.h}
            portraitPatternId={portraitPatternId}
            landscapePatternId={landscapePatternId}
          />
        ))}
      </g>

      {cylinders.map((block) => (
        <g key={`${idPrefix}-block-${block.n}`}>
          <rect className="site-diagram-inner" x={block.x} y={block.y} width={BLOCK_W} height={BLOCK_H} />
          {/* Pad size once on NW pad only — avoids colliding with FROM_SOUTH / row dims. */}
          {block.n === 1 ? (
            <>
              <DimensionH
                x1={block.x}
                x2={block.x + BLOCK_W}
                y={block.y - tick * 2.2}
                label={formatMm(BLOCK_W)}
                fontSize={fsBlock * 0.85}
                tick={tick * 0.85}
                halo={halo}
                labelSide="above"
              />
              <DimensionV
                x={block.x - tick * 2.2}
                y1={block.y}
                y2={block.y + BLOCK_H}
                label={formatMm(BLOCK_H)}
                fontSize={fsBlock * 0.85}
                tick={tick * 0.85}
                halo={halo}
                labelSide="start"
              />
            </>
          ) : null}
        </g>
      ))}

      <g className="site-diagram-shadows" clipPath={`url(#${roofClipId})`}>
        {cylinders.map((block) =>
          JAIPUR_SHADOWS.map((cast) => (
            <CylinderShadow
              key={`${idPrefix}-shadow-${block.n}-${cast.hour}`}
              cx={block.cx}
              cy={block.cy}
              r={cylinderR}
              dx={cast.dx}
              dy={cast.dy}
            />
          )),
        )}
      </g>

      {cylinders.map((block) => (
        <circle
          key={`${idPrefix}-cylinder-${block.n}`}
          className="site-diagram-circle"
          cx={block.cx}
          cy={block.cy}
          r={cylinderR}
        />
      ))}

      {/* N/S setbacks in the west margin so labels clear pad size + bottom row panels. */}
      <DimensionV
        x={ox + FROM_WEST * 0.35}
        y1={oy}
        y2={oy + FROM_NORTH}
        label={formatMm(FROM_NORTH)}
        fontSize={fsDim}
        tick={tick}
        halo={halo}
        labelSide="end"
      />
      <DimensionV
        x={ox + FROM_WEST * 0.35}
        y1={oy + ROOF_H - FROM_SOUTH}
        y2={oy + ROOF_H}
        label={formatMm(FROM_SOUTH)}
        fontSize={fsDim}
        tick={tick}
        halo={halo}
        labelSide="end"
      />
      <DimensionV
        x={midRoofX}
        y1={oy + FROM_NORTH + BLOCK_H}
        y2={oy + FROM_NORTH + BLOCK_H + ROW_GAP}
        label={formatMm(ROW_GAP)}
        fontSize={fsDim}
        tick={tick}
        halo={halo}
        labelSide="end"
      />
      <DimensionH
        x1={ox}
        x2={ox + FROM_WEST}
        y={row1Cy}
        label={formatMm(FROM_WEST)}
        fontSize={fsDim}
        tick={tick}
        halo={halo}
        labelSide="above"
      />
      <DimensionH
        x1={ox + ROOF_W - FROM_EAST}
        x2={ox + ROOF_W}
        y={row1Cy}
        label={formatMm(FROM_EAST)}
        fontSize={fsDim}
        tick={tick}
        halo={halo}
        labelSide="above"
      />
      <DimensionH
        x1={ox + BLOCK_XS[0] + BLOCK_W}
        x2={ox + BLOCK_XS[1]}
        y={row1Cy}
        label={formatMm(GAP_12)}
        fontSize={fsDim}
        tick={tick}
        halo={halo}
        labelSide="above"
      />
      <DimensionH
        x1={ox + BLOCK_XS[1] + BLOCK_W}
        x2={ox + BLOCK_XS[2]}
        y={row1Cy}
        label={formatMm(GAP_23)}
        fontSize={fsDim}
        tick={tick}
        halo={halo}
        labelSide="above"
      />
      <DimensionH
        x1={ox + BLOCK_XS[0] + BLOCK_W}
        x2={ox + BLOCK_XS[1]}
        y={oy + ROW_YS[1] + BLOCK_H / 2}
        label={formatMm(GAP_12)}
        fontSize={fsDim}
        tick={tick}
        halo={halo}
        labelSide="above"
      />
      <DimensionH
        x1={ox + BLOCK_XS[1] + BLOCK_W}
        x2={ox + BLOCK_XS[2]}
        y={oy + ROW_YS[1] + BLOCK_H / 2}
        label={formatMm(GAP_23)}
        fontSize={fsDim}
        tick={tick}
        halo={halo}
        labelSide="above"
      />
    </svg>
  );
}

function SolarPanel({
  x,
  y,
  width,
  height,
  portraitPatternId,
  landscapePatternId,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  portraitPatternId: string;
  landscapePatternId: string;
}) {
  const frame = Math.min(width, height) * 0.04;
  const landscape = width > height;
  return (
    <g className="site-diagram-panel">
      <rect className="site-diagram-panel-frame" x={x} y={y} width={width} height={height} />
      <g transform={`translate(${x + frame} ${y + frame})`}>
        <rect
          width={width - frame * 2}
          height={height - frame * 2}
          fill={landscape ? `url(#${landscapePatternId})` : `url(#${portraitPatternId})`}
        />
      </g>
    </g>
  );
}

function CylinderShadow({
  cx,
  cy,
  r,
  dx,
  dy,
}: {
  cx: number;
  cy: number;
  r: number;
  dx: number;
  dy: number;
}) {
  const length = Math.hypot(dx, dy);
  if (length < 0.5) {
    return <circle cx={cx} cy={cy} r={r} />;
  }
  const ux = dx / length;
  const uy = dy / length;
  const px = -uy * r;
  const py = ux * r;
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} />
      <circle cx={cx + dx} cy={cy + dy} r={r} />
      <polygon
        points={`${cx + px},${cy + py} ${cx + dx + px},${cy + dy + py} ${cx + dx - px},${cy + dy - py} ${cx - px},${cy - py}`}
      />
    </g>
  );
}

function DimensionH({
  x1,
  x2,
  y,
  label,
  fontSize,
  tick,
  halo = 0,
  labelSide = "above",
}: {
  x1: number;
  x2: number;
  y: number;
  label: string;
  fontSize: number;
  tick: number;
  halo?: number;
  labelSide?: "above" | "below";
}) {
  if (x2 - x1 < 1) return null;
  const mid = (x1 + x2) / 2;
  const labelY = labelSide === "above" ? y - tick * 2.4 - fontSize * 0.15 : y + tick * 2.4 + fontSize * 0.75;
  return (
    <g className="site-diagram-dim">
      <line x1={x1} y1={y - tick} x2={x1} y2={y + tick} />
      <line x1={x2} y1={y - tick} x2={x2} y2={y + tick} />
      <line x1={x1} y1={y} x2={x2} y2={y} />
      {label ? (
        <text
          x={mid}
          y={labelY}
          textAnchor="middle"
          fontSize={fontSize}
          stroke="#ffffff"
          strokeWidth={halo}
          paintOrder="stroke"
        >
          {label}
        </text>
      ) : null}
    </g>
  );
}

function DimensionV({
  x,
  y1,
  y2,
  label,
  fontSize,
  tick,
  halo = 0,
  labelSide = "start",
}: {
  x: number;
  y1: number;
  y2: number;
  label: string;
  fontSize: number;
  tick: number;
  halo?: number;
  labelSide?: "start" | "end";
}) {
  if (y2 - y1 < 1) return null;
  const mid = (y1 + y2) / 2;
  const tx = labelSide === "start" ? x - tick * 2.8 - fontSize * 0.2 : x + tick * 2.8 + fontSize * 0.2;
  return (
    <g className="site-diagram-dim">
      <line x1={x - tick} y1={y1} x2={x + tick} y2={y1} />
      <line x1={x - tick} y1={y2} x2={x + tick} y2={y2} />
      <line x1={x} y1={y1} x2={x} y2={y2} />
      {label ? (
        <text
          x={tx}
          y={mid}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={fontSize}
          stroke="#ffffff"
          strokeWidth={halo}
          paintOrder="stroke"
          transform={`rotate(-90 ${tx} ${mid})`}
        >
          {label}
        </text>
      ) : null}
    </g>
  );
}
