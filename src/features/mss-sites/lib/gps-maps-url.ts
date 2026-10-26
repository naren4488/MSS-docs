/** Build a Google Maps URL from a sheet GPS / LINK cell (coords, URL, or plus code). */

const HTTP_URL_RE = /^https?:\/\//i;

/** DMS: 26°56'14.2"N 75°44'44.9"E (tolerant of spaces / quotes / commas). */
const DMS_RE =
  /(\d{1,3})\s*[°º]\s*(\d{1,2})\s*['′’]\s*(\d{1,2}(?:\.\d+)?)\s*["″”']?\s*([NSns])\s*[,;\s]+\s*(\d{1,3})\s*[°º]\s*(\d{1,2})\s*['′’]\s*(\d{1,2}(?:\.\d+)?)\s*["″”']?\s*([EWew])/;

/** Decimal with hemisphere: 27.14413° N, 75.41084° E */
const DECIMAL_HEMISPHERE_RE =
  /(-?\d{1,3}(?:\.\d+)?)\s*°?\s*([NSns])\s*[,;\s]+\s*(-?\d{1,3}(?:\.\d+)?)\s*°?\s*([EWew])/;

/** Plain decimal pair: 26.9422621, 75.7177459 */
const DECIMAL_PAIR_RE = /^(-?\d{1,3}(?:\.\d+)?)\s*,\s*(-?\d{1,3}(?:\.\d+)?)$/;

/** Open Location Code prefix, optionally followed by a place name. */
const PLUS_CODE_RE = /^[23456789CFGHJMPQRVWX]{2,8}\+[23456789CFGHJMPQRVWX]{2,7}\b/i;

function dmsToDecimal(degrees: number, minutes: number, seconds: number, hemisphere: string): number {
  const absolute = degrees + minutes / 60 + seconds / 3600;
  return /[SWsw]/.test(hemisphere) ? -absolute : absolute;
}

function applyHemisphere(value: number, hemisphere: string): number {
  const absolute = Math.abs(value);
  return /[SWsw]/.test(hemisphere) ? -absolute : absolute;
}

function mapsQueryUrl(query: string): string {
  return `https://www.google.com/maps?q=${encodeURIComponent(query)}`;
}

function mapsLatLngUrl(lat: number, lng: number): string {
  const latText = Number(lat.toFixed(7));
  const lngText = Number(lng.toFixed(7));
  return mapsQueryUrl(`${latText},${lngText}`);
}

function parseDms(raw: string): { lat: number; lng: number } | null {
  const match = raw.match(DMS_RE);
  if (!match) return null;

  const lat = dmsToDecimal(
    Number(match[1]),
    Number(match[2]),
    Number(match[3]),
    match[4],
  );
  const lng = dmsToDecimal(
    Number(match[5]),
    Number(match[6]),
    Number(match[7]),
    match[8],
  );

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  if (Math.abs(lat) > 90 || Math.abs(lng) > 180) return null;
  return { lat, lng };
}

function parseDecimal(raw: string): { lat: number; lng: number } | null {
  const withHemisphere = raw.match(DECIMAL_HEMISPHERE_RE);
  if (withHemisphere) {
    const lat = applyHemisphere(Number(withHemisphere[1]), withHemisphere[2]);
    const lng = applyHemisphere(Number(withHemisphere[3]), withHemisphere[4]);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
    if (Math.abs(lat) > 90 || Math.abs(lng) > 180) return null;
    return { lat, lng };
  }

  const pair = raw.trim().match(DECIMAL_PAIR_RE);
  if (!pair) return null;

  const lat = Number(pair[1]);
  const lng = Number(pair[2]);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  if (Math.abs(lat) > 90 || Math.abs(lng) > 180) return null;
  return { lat, lng };
}

/**
 * Returns a Google Maps URL when the cell is a link, coordinates, or plus code.
 * Returns null for empty / non-location text so the UI can keep plain text.
 */
export function resolveGpsMapsUrl(raw: string): string | null {
  const value = raw.trim();
  if (!value) return null;

  if (HTTP_URL_RE.test(value)) {
    return value;
  }

  const dms = parseDms(value);
  if (dms) {
    return mapsLatLngUrl(dms.lat, dms.lng);
  }

  const decimal = parseDecimal(value);
  if (decimal) {
    return mapsLatLngUrl(decimal.lat, decimal.lng);
  }

  if (PLUS_CODE_RE.test(value)) {
    return mapsQueryUrl(value);
  }

  return null;
}

export function isGpsLinkFieldLabel(label: string): boolean {
  const key = label.trim().replace(/\s+/g, " ").toUpperCase();
  return (
    key === "GPS / LINK" ||
    key === "GEO LOCATION" ||
    key.startsWith("LOCATION (GPS")
  );
}
