import { Check, ChevronDown } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface ProjectsMultiselectFilterProps {
  label: string;
  options: string[];
  selected: Set<string>;
  onChange: (next: Set<string>) => void;
  allSummaryLabel?: string;
  emptyOptionsLabel?: string;
  isActive?: boolean;
}

const PANEL_WIDTH = 280;
const PANEL_GAP = 6;

function getSummaryLabel(
  selected: Set<string>,
  options: string[],
  allSummaryLabel: string,
  emptyOptionsLabel: string,
) {
  if (options.length === 0) {
    return emptyOptionsLabel;
  }
  if (selected.size === 0) {
    return "None selected";
  }
  if (selected.size === options.length) {
    return allSummaryLabel;
  }
  if (selected.size === 1) {
    return [...selected][0];
  }
  return `${selected.size} selected`;
}

function getPanelPosition(trigger: HTMLButtonElement) {
  const rect = trigger.getBoundingClientRect();
  const width = Math.min(PANEL_WIDTH, window.innerWidth - 16);
  const left = Math.min(Math.max(8, rect.right - width), window.innerWidth - width - 8);
  const spaceBelow = window.innerHeight - rect.bottom - PANEL_GAP;
  const spaceAbove = rect.top - PANEL_GAP;
  const openAbove = spaceBelow < 220 && spaceAbove > spaceBelow;

  return {
    top: openAbove ? undefined : rect.bottom + PANEL_GAP,
    bottom: openAbove ? window.innerHeight - rect.top + PANEL_GAP : undefined,
    left,
    width,
  };
}

export function ProjectsMultiselectFilter({
  label,
  options,
  selected,
  onChange,
  allSummaryLabel = "All selected",
  emptyOptionsLabel = "No options",
  isActive = false,
}: ProjectsMultiselectFilterProps) {
  const [open, setOpen] = useState(false);
  const [panelPosition, setPanelPosition] = useState<{
    top?: number;
    bottom?: number;
    left: number;
    width: number;
  } | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  useEffect(() => {
    if (!open || !triggerRef.current) {
      return undefined;
    }

    function updatePosition() {
      if (!triggerRef.current) {
        return;
      }
      setPanelPosition(getPanelPosition(triggerRef.current));
    }

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node;
      if (rootRef.current?.contains(target) || panelRef.current?.contains(target)) {
        return;
      }
      setOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [open]);

  function toggleOption(option: string) {
    const next = new Set(selected);
    if (next.has(option)) {
      next.delete(option);
    } else {
      next.add(option);
    }
    onChange(next);
  }

  function selectAll() {
    onChange(new Set(options));
  }

  function clearAll() {
    onChange(new Set());
  }

  const panel =
    open && panelPosition
      ? createPortal(
          <div
            ref={panelRef}
            className="projects-multiselect-panel projects-multiselect-panel--portal"
            id={listId}
            role="listbox"
            aria-multiselectable="true"
            style={{
              top: panelPosition.top,
              bottom: panelPosition.bottom,
              left: panelPosition.left,
              width: panelPosition.width,
            }}
          >
            <div className="projects-multiselect-actions">
              <button type="button" onClick={selectAll}>
                Select all
              </button>
              <button type="button" onClick={clearAll}>
                Clear
              </button>
            </div>
            <div className="projects-multiselect-options">
              {options.map((option) => {
                const isSelected = selected.has(option);
                return (
                  <button
                    key={option}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    className={`projects-multiselect-option${isSelected ? " projects-multiselect-option--selected" : ""}`}
                    onClick={() => toggleOption(option)}
                  >
                    <span className="projects-multiselect-check" aria-hidden="true">
                      {isSelected ? <Check size={14} strokeWidth={2.5} /> : null}
                    </span>
                    <span>{option}</span>
                  </button>
                );
              })}
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <div className={`projects-filter${isActive ? " projects-filter--active" : ""}`} ref={rootRef}>
      <span className="projects-filter-label">{label}</span>
      <div className={`projects-multiselect${open ? " projects-multiselect--open" : ""}`}>
        <button
          ref={triggerRef}
          type="button"
          className="projects-multiselect-trigger"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-controls={listId}
          onClick={() => setOpen((value) => !value)}
        >
          <span className="projects-multiselect-summary">
            {getSummaryLabel(selected, options, allSummaryLabel, emptyOptionsLabel)}
          </span>
          <ChevronDown size={16} className="projects-multiselect-chevron" />
        </button>
      </div>
      {panel}
    </div>
  );
}
