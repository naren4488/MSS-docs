import {
  getSheetTabShortcutsForScope,
  isSheetTabShortcutActive,
  type ProjectSheetTabShortcut,
  type ProjectsScope,
} from "../lib/projects-config";

interface ProjectsSheetTabFilterProps {
  scope: ProjectsScope;
  selectedProjectTypes: ReadonlySet<string>;
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
  selectedProjectTypes,
  onSelectShortcut,
  onClearShortcut,
}: ProjectsSheetTabFilterProps) {
  const shortcuts = getSheetTabShortcutsForScope(scope);
  if (shortcuts.length === 0) {
    return null;
  }

  const groups = groupShortcuts(shortcuts);
  const title =
    scope === "partner" ? "Partners" : "Register";

  return (
    <div className="projects-sheet-tab-filter no-print" aria-label={title}>
      <p className="projects-sheet-tab-filter-title">{title}</p>
      <div className="projects-sheet-tab-filter-groups">
        {groups.map(([group, groupShortcuts]) => (
          <div key={group} className="projects-sheet-tab-filter-group">
            <div
              className={`projects-sheet-tab-filter-chips${
                scope === "partner" ? " projects-sheet-tab-filter-chips--scroll" : ""
              }`}
              role="group"
              aria-label={`${group} tabs`}
            >
              {groupShortcuts.map((shortcut) => {
                const active = isSheetTabShortcutActive(shortcut, selectedProjectTypes);
                const titleText = `${shortcut.label} register`;
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
