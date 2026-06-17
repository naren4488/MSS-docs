import { Info } from "lucide-react";
import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface ProjectRowMoreCellProps {
  fields: Array<{ label: string; value: string }>;
}

const TOOLTIP_GAP = 8;
const TOOLTIP_WIDTH = 280;
const VIEWPORT_PADDING = 8;
const CLOSE_DELAY_MS = 120;

function getTooltipPosition(trigger: HTMLElement, tooltip: HTMLElement) {
  const triggerRect = trigger.getBoundingClientRect();
  const tooltipHeight = tooltip.offsetHeight;
  const width = Math.min(TOOLTIP_WIDTH, window.innerWidth - VIEWPORT_PADDING * 2);
  const maxHeight = window.innerHeight - VIEWPORT_PADDING * 2;

  let left = triggerRect.left - width - TOOLTIP_GAP;
  if (left < VIEWPORT_PADDING) {
    left = triggerRect.right + TOOLTIP_GAP;
  }
  left = Math.min(Math.max(VIEWPORT_PADDING, left), window.innerWidth - width - VIEWPORT_PADDING);

  const visibleHeight = Math.min(tooltipHeight, maxHeight);
  let top = triggerRect.top + triggerRect.height / 2 - visibleHeight / 2;
  top = Math.max(VIEWPORT_PADDING, Math.min(top, window.innerHeight - visibleHeight - VIEWPORT_PADDING));

  return { top, left, width, maxHeight };
}

export function ProjectRowMoreCell({ fields }: ProjectRowMoreCellProps) {
  const hasData = fields.some((field) => field.value.length > 0);
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<{
    top: number;
    left: number;
    width: number;
    maxHeight: number;
  } | null>(null);
  const cellRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const closeTimerRef = useRef<number | undefined>(undefined);
  const tooltipId = useId();

  function clearCloseTimer() {
    if (closeTimerRef.current !== undefined) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = undefined;
    }
  }

  function scheduleClose() {
    clearCloseTimer();
    closeTimerRef.current = window.setTimeout(() => setOpen(false), CLOSE_DELAY_MS);
  }

  function handleOpen() {
    clearCloseTimer();
    setOpen(true);
  }

  useLayoutEffect(() => {
    if (!open || !triggerRef.current || !tooltipRef.current) {
      return undefined;
    }

    function updatePosition() {
      if (!triggerRef.current || !tooltipRef.current) {
        return;
      }
      setPosition(getTooltipPosition(triggerRef.current, tooltipRef.current));
    }

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open, fields]);

  useEffect(() => {
    if (!open) {
      setPosition(null);
      return undefined;
    }

    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node;
      if (cellRef.current?.contains(target) || tooltipRef.current?.contains(target)) {
        return;
      }
      setOpen(false);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  useEffect(() => () => clearCloseTimer(), []);

  if (!hasData) {
    return <span className="projects-more-empty">—</span>;
  }

  const tooltip =
    open
      ? createPortal(
          <div
            ref={tooltipRef}
            id={tooltipId}
            className="projects-more-tooltip projects-more-tooltip--portal"
            role="tooltip"
            style={{
              top: position?.top ?? 0,
              left: position?.left ?? 0,
              width: position?.width ?? TOOLTIP_WIDTH,
              maxHeight: position?.maxHeight,
              visibility: position ? "visible" : "hidden",
            }}
            onMouseEnter={handleOpen}
            onMouseLeave={scheduleClose}
          >
            <dl className="projects-more-tooltip-list">
              {fields.map((field) => (
                <div key={field.label} className="projects-more-tooltip-item">
                  <dt>{field.label}</dt>
                  <dd>{field.value || "—"}</dd>
                </div>
              ))}
            </dl>
          </div>,
          document.body,
        )
      : null;

  return (
    <div
      ref={cellRef}
      className="projects-more-cell"
      onMouseEnter={handleOpen}
      onMouseLeave={scheduleClose}
    >
      <button
        ref={triggerRef}
        type="button"
        className={`projects-more-trigger${open ? " projects-more-trigger--open" : ""}`}
        aria-label="Show additional details"
        aria-expanded={open}
        aria-controls={tooltipId}
        onClick={() => setOpen((current) => !current)}
        onFocus={handleOpen}
      >
        <Info size={15} strokeWidth={2.25} />
      </button>
      {tooltip}
      <div className="projects-more-print" aria-hidden="true">
        {fields.map((field) => (
          <p key={field.label}>
            <strong>{field.label}:</strong> {field.value || "—"}
          </p>
        ))}
      </div>
    </div>
  );
}
