import type { CSSProperties } from "react";
import mahi2Svg from "../../public/assets/Mahi2.svg?raw";

const MSS_LOGO_URL = "/assets/Mahi2.svg";

const KNOWN_INLINE_SVG: Record<string, string> = {
  [MSS_LOGO_URL]: mahi2Svg,
};

function isSvgSrc(src: string) {
  const path = src.split("?")[0].toLowerCase();
  return path.endsWith(".svg") || src.startsWith("data:image/svg+xml");
}

function prepareSvg(raw: string) {
  let svg = raw.replace(/^\uFEFF/, "").replace(/<\?xml[\s\S]*?\?>/i, "").trim();
  // Inlined SVG can use the page Lexend font; <img src=".svg"> cannot.
  svg = svg.replace(/font-family:\s*Lexend-Regular,\s*Lexend/gi, "font-family: Lexend, sans-serif");
  svg = svg.replace(/<svg\b([^>]*)>/i, (_, attrs: string) => {
    const next = attrs.replace(/\s(width|height)\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "");
    return `<svg${next} style="width:100%;height:100%;display:block;overflow:visible">`;
  });
  return svg;
}

/** Clip SVG padding so the company name sits close under the mark — same as MSS letterhead. */
export const LETTERHEAD_LOGO_WRAP: CSSProperties = {
  display: "flex",
  justifyContent: "center",
  height: 84,
  overflow: "hidden",
  marginBottom: 2,
};

interface CompanyLogoProps {
  src?: string;
  alt: string;
  maxHeight?: number;
  maxWidth?: number;
}

export function CompanyLogo({ src, alt, maxHeight = 96, maxWidth = 260 }: CompanyLogoProps) {
  const url = (src === "/assets/mss-logo.png" ? MSS_LOGO_URL : src ?? "").trim();
  if (!url) {
    return null;
  }

  const inline = url in KNOWN_INLINE_SVG ? prepareSvg(KNOWN_INLINE_SVG[url]) : null;
  const width = Math.min(maxWidth, Math.round(maxHeight * (4096 / 3002.27)));
  const box: CSSProperties = {
    height: maxHeight,
    width,
    maxWidth,
    overflow: "visible",
    flexShrink: 0,
  };

  if (inline) {
    return <div className="company-logo" role="img" aria-label={alt} style={box} dangerouslySetInnerHTML={{ __html: inline }} />;
  }

  return (
    <img
      alt={alt}
      src={url}
      crossOrigin={isSvgSrc(url) ? undefined : "anonymous"}
      style={{
        display: "block",
        height: maxHeight,
        maxHeight,
        maxWidth,
        width: "auto",
        objectFit: "contain",
      }}
    />
  );
}
