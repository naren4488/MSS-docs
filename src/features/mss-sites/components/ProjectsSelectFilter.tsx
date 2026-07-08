interface ProjectsSelectFilterProps<T extends string> {
  label: string;
  value: T;
  options: ReadonlyArray<{ value: T; label: string }>;
  onChange: (value: T) => void;
  isActive?: boolean;
}

export function ProjectsSelectFilter<T extends string>({
  label,
  value,
  options,
  onChange,
  isActive = false,
}: ProjectsSelectFilterProps<T>) {
  return (
    <div className={`projects-filter${isActive ? " projects-filter--active" : ""}`}>
      <span className="projects-filter-label">{label}</span>
      <select
        className="projects-select-input"
        value={value}
        onChange={(event) => onChange(event.target.value as T)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
