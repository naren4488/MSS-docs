import { Check, Copy } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import {
  buildProjectRowCopyPayload,
  copyTextToClipboard,
  projectRowCopyFieldLabel,
  type ProjectRowCopyPayload,
} from "../lib/project-row-copy";

interface ProjectRowCopyCellProps {
  row: readonly string[];
}

export function ProjectRowCopyCell({ row }: ProjectRowCopyCellProps) {
  const [pending, setPending] = useState<ProjectRowCopyPayload | null>(null);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    if (!copied) {
      return undefined;
    }
    const timer = window.setTimeout(() => setCopied(false), 1600);
    return () => window.clearTimeout(timer);
  }, [copied]);

  useEffect(() => {
    if (!pending) {
      return undefined;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setPending(null);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [pending]);

  async function writePayload(payload: ProjectRowCopyPayload) {
    if (!payload.text.trim()) {
      setCopyError(true);
      return;
    }
    try {
      await copyTextToClipboard(payload.text);
      setCopied(true);
      setCopyError(false);
      setPending(null);
    } catch {
      setCopyError(true);
    }
  }

  function handleCopyClick() {
    const payload = buildProjectRowCopyPayload(row);
    setCopyError(false);
    if (payload.missing.length > 0) {
      setPending(payload);
      return;
    }
    void writePayload(payload);
  }

  const dialog =
    pending != null
      ? createPortal(
          <div className="dialog-overlay" role="presentation" onClick={() => setPending(null)}>
            <div
              className="dialog-card"
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              aria-describedby={descriptionId}
              onClick={(event) => event.stopPropagation()}
            >
              <p className="eyebrow">Incomplete details</p>
              <h2 id={titleId} style={{ marginTop: 0 }}>
                Some details are missing
              </h2>
              <p id={descriptionId} className="muted-text">
                These fields are empty for this site:
              </p>
              <ul className="projects-row-copy-missing-list">
                {pending.missing.map((key) => (
                  <li key={key}>{projectRowCopyFieldLabel(key)}</li>
                ))}
              </ul>
              {pending.text.trim() ? (
                <p className="muted-text">You can still copy the available lines, or cancel.</p>
              ) : (
                <p className="muted-text">Nothing is available to copy for this row.</p>
              )}
              <div className="dialog-actions">
                <button className="ghost-button" type="button" onClick={() => setPending(null)}>
                  Cancel
                </button>
                <button
                  className="primary-button"
                  type="button"
                  disabled={!pending.text.trim()}
                  onClick={() => void writePayload(pending)}
                >
                  Copy anyway
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <div className="projects-row-copy-cell">
        <button
          type="button"
          className={`projects-row-copy-trigger${copied ? " projects-row-copy-trigger--copied" : ""}`}
          aria-label={copied ? "Copied site details" : "Copy site details"}
          title={copied ? "Copied" : "Copy Maps link, name, kW/PH, contact"}
          onClick={handleCopyClick}
        >
          {copied ? <Check size={14} strokeWidth={2.5} /> : <Copy size={14} strokeWidth={2.25} />}
        </button>
        {copyError ? <span className="projects-row-copy-error">Copy failed</span> : null}
      </div>
      {dialog}
    </>
  );
}
