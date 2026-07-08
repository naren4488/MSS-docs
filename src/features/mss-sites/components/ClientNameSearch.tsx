import { Search, X } from "lucide-react";

interface ClientNameSearchProps {
  value: string;
  onChange: (value: string) => void;
  isActive?: boolean;
  className?: string;
}

export function ClientNameSearch({ value, onChange, isActive = false, className = "" }: ClientNameSearchProps) {
  return (
    <div className={`projects-filter${isActive ? " projects-filter--active" : ""} ${className}`.trim()}>
      <label className="projects-filter-label" htmlFor="client-name-search">
        Search client
      </label>
      <div className="projects-search-input-wrap">
        <Search size={16} className="projects-search-icon" aria-hidden="true" />
        <input
          id="client-name-search"
          type="search"
          className="projects-search-input"
          placeholder="Search by name…"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
        {value ? (
          <button
            type="button"
            className="projects-search-clear"
            aria-label="Clear search"
            onClick={() => onChange("")}
          >
            <X size={14} />
          </button>
        ) : null}
      </div>
    </div>
  );
}
