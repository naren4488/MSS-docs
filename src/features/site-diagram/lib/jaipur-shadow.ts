/** Jaipur, Rajasthan — used for winter-solstice sun position. */
export const JAIPUR_LAT_DEG = 26.9124;

/** Solar declination on 21 December, degrees. */
export const WINTER_SOLSTICE_DECLINATION_DEG = -23.44;

/** Generation-window solar hours on the winter solstice (local solar time). */
export const SHADOW_SOLAR_HOURS = [9, 9.5, 10, 10.5, 11, 11.5, 12, 12.5, 13, 13.5, 14, 14.5, 15];

export type SunPosition = {
  altitudeRad: number;
  azimuthFromNorthRad: number;
};

export type ShadowCast = {
  hour: number;
  altitudeDeg: number;
  sunAzimuthDeg: number;
  lengthMm: number;
  dx: number;
  dy: number;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function toDeg(rad: number) {
  return (rad * 180) / Math.PI;
}

/** Sun altitude and azimuth (from north, clockwise) at a solar hour on 21 Dec. */
export function sunPositionWinterSolstice(latDeg: number, solarHour: number): SunPosition {
  const lat = (latDeg * Math.PI) / 180;
  const decl = (WINTER_SOLSTICE_DECLINATION_DEG * Math.PI) / 180;
  const hourAngle = ((solarHour - 12) * 15 * Math.PI) / 180;

  const sinAlt = Math.sin(lat) * Math.sin(decl) + Math.cos(lat) * Math.cos(decl) * Math.cos(hourAngle);
  const altitudeRad = Math.asin(clamp(sinAlt, -1, 1));

  const cosAz =
    (Math.sin(decl) * Math.cos(lat) - Math.cos(decl) * Math.sin(lat) * Math.cos(hourAngle)) /
    Math.max(Math.cos(altitudeRad), 1e-6);
  let azimuthFromNorthRad = Math.acos(clamp(cosAz, -1, 1));
  if (hourAngle > 0) azimuthFromNorthRad = Math.PI * 2 - azimuthFromNorthRad;

  return { altitudeRad, azimuthFromNorthRad };
}

export function shadowLengthMm(heightMm: number, altitudeRad: number): number {
  const tanAlt = Math.tan(altitudeRad);
  if (tanAlt <= 0.02) return heightMm * 50;
  return heightMm / tanAlt;
}

/**
 * Plan offset of the top-face shadow.
 * SVG y grows south, so a due-north shadow is negative y.
 */
export function shadowOffsetMm(heightMm: number, sun: SunPosition): { dx: number; dy: number; lengthMm: number } {
  const lengthMm = shadowLengthMm(heightMm, sun.altitudeRad);
  const shadowAz = sun.azimuthFromNorthRad + Math.PI;
  return {
    dx: Math.sin(shadowAz) * lengthMm,
    dy: -Math.cos(shadowAz) * lengthMm,
    lengthMm,
  };
}

export function jaipurWinterShadowCasts(heightMm: number): ShadowCast[] {
  return SHADOW_SOLAR_HOURS.map((hour) => {
    const sun = sunPositionWinterSolstice(JAIPUR_LAT_DEG, hour);
    const offset = shadowOffsetMm(heightMm, sun);
    return {
      hour,
      altitudeDeg: toDeg(sun.altitudeRad),
      sunAzimuthDeg: toDeg(sun.azimuthFromNorthRad),
      ...offset,
    };
  });
}

/** True if the cylinder-shadow stadium overlaps an axis-aligned rectangle. */
export function stadiumHitsAabb(
  cx: number,
  cy: number,
  radius: number,
  dx: number,
  dy: number,
  rx: number,
  ry: number,
  rw: number,
  rh: number,
): boolean {
  return segmentHitsAabb(cx, cy, cx + dx, cy + dy, rx - radius, ry - radius, rx + rw + radius, ry + rh + radius);
}

function segmentHitsAabb(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  minX: number,
  minY: number,
  maxX: number,
  maxY: number,
): boolean {
  let t0 = 0;
  let t1 = 1;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const clips: Array<[number, number]> = [
    [-dx, x1 - minX],
    [dx, maxX - x1],
    [-dy, y1 - minY],
    [dy, maxY - y1],
  ];
  for (const [p, q] of clips) {
    if (p === 0) {
      if (q < 0) return false;
      continue;
    }
    const t = q / p;
    if (p < 0) {
      if (t > t1) return false;
      if (t > t0) t0 = t;
    } else {
      if (t < t0) return false;
      if (t < t1) t1 = t;
    }
  }
  return true;
}
