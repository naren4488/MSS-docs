/** Build a Google Maps URL from a sheet GPS / LINK cell (coords, URL, or plus code). */

export interface GpsLatLng {
  lat: number;
  lng: number;
}

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

/** Google Maps /@lat,lng or ?q=lat,lng / query=lat,lng / ll=lat,lng */
const MAPS_AT_RE = /@(-?\d{1,3}(?:\.\d+)?),\s*(-?\d{1,3}(?:\.\d+)?)/;
const MAPS_QUERY_RE = /[?&#](?:q|query|ll)=(-?\d{1,3}(?:\.\d+)?),\s*(-?\d{1,3}(?:\.\d+)?)/i;

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

function isValidLatLng(lat: number, lng: number): boolean {
  return Number.isFinite(lat) && Number.isFinite(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180;
}

function parseDms(raw: string): GpsLatLng | null {
  const match = raw.match(DMS_RE);
  if (!match) return null;

  const lat = dmsToDecimal(Number(match[1]), Number(match[2]), Number(match[3]), match[4]);
  const lng = dmsToDecimal(Number(match[5]), Number(match[6]), Number(match[7]), match[8]);

  if (!isValidLatLng(lat, lng)) return null;
  return { lat, lng };
}

function parseDecimal(raw: string): GpsLatLng | null {
  const withHemisphere = raw.match(DECIMAL_HEMISPHERE_RE);
  if (withHemisphere) {
    const lat = applyHemisphere(Number(withHemisphere[1]), withHemisphere[2]);
    const lng = applyHemisphere(Number(withHemisphere[3]), withHemisphere[4]);
    if (!isValidLatLng(lat, lng)) return null;
    return { lat, lng };
  }

  const pair = raw.trim().match(DECIMAL_PAIR_RE);
  if (!pair) return null;

  const lat = Number(pair[1]);
  const lng = Number(pair[2]);
  if (!isValidLatLng(lat, lng)) return null;
  return { lat, lng };
}

/** Extract lat/lng embedded in a Google Maps (or similar) URL when present. */
function parseLatLngFromMapsUrl(raw: string): GpsLatLng | null {
  const at = raw.match(MAPS_AT_RE);
  if (at) {
    const lat = Number(at[1]);
    const lng = Number(at[2]);
    if (isValidLatLng(lat, lng)) return { lat, lng };
  }

  const query = raw.match(MAPS_QUERY_RE);
  if (query) {
    const lat = Number(query[1]);
    const lng = Number(query[2]);
    if (isValidLatLng(lat, lng)) return { lat, lng };
  }

  try {
    const url = new URL(raw);
    const q = url.searchParams.get("q") || url.searchParams.get("query") || url.searchParams.get("ll");
    if (q) {
      const fromQuery = parseDecimal(q) ?? parseDms(q);
      if (fromQuery) return fromQuery;
    }
  } catch {
    // not a parseable URL
  }

  return null;
}

/**
 * Returns numeric coordinates when the GPS cell can be plotted on a map.
 * Skips empty cells, plus codes, and short links without embedded lat/lng.
 */
export function parseGpsLatLng(raw: string): GpsLatLng | null {
  const value = raw.trim();
  if (!value) return null;

  if (HTTP_URL_RE.test(value)) {
    return parseLatLngFromMapsUrl(value);
  }

  return parseDms(value) ?? parseDecimal(value);
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

  const coords = parseGpsLatLng(value);
  if (coords) {
    return mapsLatLngUrl(coords.lat, coords.lng);
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
