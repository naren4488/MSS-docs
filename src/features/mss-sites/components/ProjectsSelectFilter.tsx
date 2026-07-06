interface ProjectsSelectFilterProps<T extends string> {
  label: string;
  value: T;
  options: ReadonlyArray<{ value: T; label: string }>;
  onChange: (value: T) => void;
}

export function ProjectsSelectFilter<T extends string>({
  label,
  value,
  options,
  onChange,
}: ProjectsSelectFilterProps<T>) {
  return (
    <div className="projects-filter">
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
