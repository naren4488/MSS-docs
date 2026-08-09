import {
  getSheetTabShortcutsForScope,
  isSheetTabShortcutActive,
  type ProjectSheetTabShortcut,
  type ProjectsScope,
} from "../lib/projects-config";

interface ProjectsSheetTabFilterProps {
  scope: ProjectsScope;
  selectedVendors: ReadonlySet<string>;
  selectedProjectTypes: ReadonlySet<string>;
  allVendors: readonly string[];
  onSelectShortcut: (shortcut: ProjectSheetTabShortcut) => void;
  onClearShortcut: () => void;
}

function groupShortcuts(shortcuts: readonly ProjectSheetTabShortcut[]) {
  const groups = new Map<string, ProjectSheetTabShortcut[]>();
  for (const shortcut of shortcuts) {
    const list = groups.get(shortcut.group) ?? [];
    list.push(shortcut);
    groups.set(shortcut.group, list);
  }
  return [...groups.entries()];
}

export function ProjectsSheetTabFilter({
  scope,
  selectedVendors,
  selectedProjectTypes,
  allVendors,
  onSelectShortcut,
  onClearShortcut,
}: ProjectsSheetTabFilterProps) {
  const shortcuts = getSheetTabShortcutsForScope(scope);
  if (shortcuts.length === 0) {
    return null;
  }

  const groups = groupShortcuts(shortcuts);
  const title =
    scope === "partner" ? "Partners" : scope === "our" ? "Sheet tabs" : "Vendor";

  return (
    <div className="projects-sheet-tab-filter no-print" aria-label={title}>
      <p className="projects-sheet-tab-filter-title">{title}</p>
      <div className="projects-sheet-tab-filter-groups">
        {groups.map(([group, groupShortcuts]) => (
          <div key={group} className="projects-sheet-tab-filter-group">
            {scope === "our" || scope === "shripal" || scope === "ajay" ? (
              <span className="projects-sheet-tab-filter-group-label">{group}</span>
            ) : null}
            <div className="projects-sheet-tab-filter-chips" role="group" aria-label={`${group} tabs`}>
              {groupShortcuts.map((shortcut) => {
                const active = isSheetTabShortcutActive(
                  shortcut,
                  selectedVendors,
                  selectedProjectTypes,
                  allVendors,
                );
                const titleText = shortcut.vendor
                  ? `${shortcut.group} · ${shortcut.label} (Vendor + register)`
                  : `${shortcut.label} partner register`;
                return (
                  <button
                    key={shortcut.id}
                    type="button"
                    className={`projects-sheet-tab-chip${active ? " projects-sheet-tab-chip--active" : ""}`}
                    aria-pressed={active}
                    title={titleText}
                    onClick={() => {
                      if (active) {
                        onClearShortcut();
                      } else {
                        onSelectShortcut(shortcut);
                      }
                    }}
                  >
                    {shortcut.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
