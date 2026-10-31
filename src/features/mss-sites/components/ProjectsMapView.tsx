import { useEffect, useMemo, useState } from "react";
import { Copy, ExternalLink, MapPin } from "lucide-react";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, Tooltip, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { getProjectRowKey } from "../lib/dedupe-project-rows";
import { parseGpsLatLng } from "../lib/gps-maps-url";
import {
  buildProjectRowCopyPayload,
  copyTextToClipboard,
  projectRowCopyFieldLabel,
} from "../lib/project-row-copy";
import { PROJECT_TABLE_HEADERS } from "../lib/projects-columns";

const GPS_INDEX = PROJECT_TABLE_HEADERS.indexOf("GPS / LINK");
const WORK_STATUS_INDEX = PROJECT_TABLE_HEADERS.indexOf("WORK STATUS");
const LOCATION_INDEX = PROJECT_TABLE_HEADERS.indexOf("LOCATION");
const PROJECT_TYPE_INDEX = PROJECT_TABLE_HEADERS.indexOf("PROJECT TYPE");
const VENDOR_INDEX = PROJECT_TABLE_HEADERS.indexOf("VENDOR");

/** Default view when nothing is plottable — Jaipur / Rajasthan area. */
const DEFAULT_CENTER: [number, number] = [26.9124, 75.7873];
const DEFAULT_ZOOM = 9;

export interface ProjectsMapViewProps {
  headers: string[];
  rows: readonly (readonly string[])[];
  totalFilteredCount: number;
}

interface MapProjectPoint {
  key: string;
  lat: number;
  lng: number;
  name: string;
  system: string;
  contact: string;
  mapsUrl: string;
  workStatus: string;
  location: string;
  projectType: string;
  vendor: string;
  missing: ReturnType<typeof buildProjectRowCopyPayload>["missing"];
  copyText: string;
}

function cell(row: readonly string[], index: number): string {
  if (index < 0 || index >= row.length) return "";
  return (row[index] ?? "").trim();
}

function buildMapPoints(
  headers: string[],
  rows: readonly (readonly string[])[],
): { points: MapProjectPoint[]; skippedCount: number } {
  const points: MapProjectPoint[] = [];
  let skippedCount = 0;

  for (const row of rows) {
    const gpsRaw = cell(row, GPS_INDEX);
    const coords = parseGpsLatLng(gpsRaw);
    if (!coords) {
      skippedCount += 1;
      continue;
    }

    const payload = buildProjectRowCopyPayload(row);
    points.push({
      key: getProjectRowKey(headers, row),
      lat: coords.lat,
      lng: coords.lng,
      name: payload.name || "Unnamed site",
      system: payload.system,
      contact: payload.contact,
      mapsUrl: payload.mapsUrl,
      workStatus: cell(row, WORK_STATUS_INDEX),
      location: cell(row, LOCATION_INDEX),
      projectType: cell(row, PROJECT_TYPE_INDEX),
      vendor: cell(row, VENDOR_INDEX),
      missing: payload.missing,
      copyText: payload.text,
    });
  }

  return { points, skippedCount };
}

const pinIcon = L.divIcon({
  className: "projects-map-pin",
  html: `<span class="projects-map-pin-dot" aria-hidden="true"></span>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
  popupAnchor: [0, -10],
});

function FitToPoints({ points }: { points: readonly MapProjectPoint[] }) {
  const map = useMap();
  const signature = points.map((point) => `${point.lat},${point.lng}`).join("|");

  useEffect(() => {
    if (points.length === 0) {
      map.setView(DEFAULT_CENTER, DEFAULT_ZOOM);
      return;
    }
    if (points.length === 1) {
      map.setView([points[0].lat, points[0].lng], 14);
      return;
    }
    const bounds = L.latLngBounds(points.map((point) => [point.lat, point.lng] as [number, number]));
    map.fitBounds(bounds, { padding: [48, 48], maxZoom: 15 });
  }, [map, points, signature]);

  return null;
}

function MapPointPopup({ point }: { point: MapProjectPoint }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    if (!point.copyText.trim()) return;
    try {
      await copyTextToClipboard(point.copyText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="projects-map-popup">
      <p className="projects-map-popup-title">{point.name}</p>
      {point.system ? <p className="projects-map-popup-line">{point.system}</p> : null}
      {point.contact ? <p className="projects-map-popup-line">{point.contact}</p> : null}
      {point.workStatus ? (
        <p className="projects-map-popup-meta">
          <span className="projects-map-popup-label">Status</span>
          {point.workStatus}
        </p>
      ) : null}
      {point.projectType || point.vendor ? (
        <p className="projects-map-popup-meta">
          <span className="projects-map-popup-label">Type</span>
          {[point.projectType, point.vendor].filter(Boolean).join(" · ")}
        </p>
      ) : null}
      {point.location ? (
        <p className="projects-map-popup-meta">
          <span className="projects-map-popup-label">Location</span>
          {point.location}
        </p>
      ) : null}
      {point.missing.length > 0 ? (
        <p className="projects-map-popup-missing">
          Missing: {point.missing.map(projectRowCopyFieldLabel).join(", ")}
        </p>
      ) : null}
      <div className="projects-map-popup-actions">
        {point.mapsUrl ? (
          <a
            className="projects-map-popup-link"
            href={point.mapsUrl}
            target="_blank"
            rel="noreferrer"
          >
            <ExternalLink size={13} aria-hidden />
            Open in Maps
          </a>
        ) : null}
        <button
          type="button"
          className="projects-map-popup-copy"
          onClick={() => void handleCopy()}
          disabled={!point.copyText.trim()}
        >
          <Copy size={13} aria-hidden />
          {copied ? "Copied" : "Copy details"}
        </button>
      </div>
    </div>
  );
}

export function ProjectsMapView({ headers, rows, totalFilteredCount }: ProjectsMapViewProps) {
  const { points, skippedCount } = useMemo(() => buildMapPoints(headers, rows), [headers, rows]);

  if (points.length === 0) {
    return (
      <div className="projects-map-empty">
        <MapPin size={22} aria-hidden />
        <p className="projects-map-empty-title">No plottable locations</p>
        <p className="projects-map-empty-text">
          {totalFilteredCount === 0
            ? "No projects match your filters."
            : `None of the ${totalFilteredCount} filtered projects have parseable GPS coordinates. Rows with empty GPS, plus codes, or short Maps links are skipped for now.`}
        </p>
      </div>
    );
  }

  return (
    <div className="projects-map-view">
      <div className="projects-map-toolbar">
        <p className="projects-map-toolbar-count">
          <span className="projects-map-toolbar-value">{points.length}</span>
          {points.length === 1 ? " site on map" : " sites on map"}
          {skippedCount > 0 ? (
            <span className="projects-map-toolbar-skipped">
              · {skippedCount} without plottable GPS hidden
            </span>
          ) : null}
        </p>
        <p className="projects-map-toolbar-hint">Hover a pin for a quick look · click for full details</p>
      </div>
      <div className="projects-map-frame">
        <MapContainer
          center={DEFAULT_CENTER}
          zoom={DEFAULT_ZOOM}
          className="projects-map-leaflet"
          scrollWheelZoom
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <FitToPoints points={points} />
          {points.map((point) => (
            <Marker key={point.key} position={[point.lat, point.lng]} icon={pinIcon}>
              <Tooltip direction="top" offset={[0, -8]} opacity={1} className="projects-map-tooltip">
                <div className="projects-map-tooltip-body">
                  <strong>{point.name}</strong>
                  {point.system ? <span>{point.system}</span> : null}
                  {point.contact ? <span>{point.contact}</span> : null}
                  {point.projectType || point.vendor ? (
                    <span>
                      {[point.projectType, point.vendor].filter(Boolean).join(" · ")}
                    </span>
                  ) : null}
                  {point.location ? <span>{point.location}</span> : null}
                  {point.workStatus ? <span className="projects-map-tooltip-status">{point.workStatus}</span> : null}
                </div>
              </Tooltip>
              <Popup maxWidth={280} minWidth={220} className="projects-map-leaflet-popup">
                <MapPointPopup point={point} />
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
