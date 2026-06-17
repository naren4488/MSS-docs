import { Search, X } from "lucide-react";

interface ClientNameSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function ClientNameSearch({ value, onChange }: ClientNameSearchProps) {
  return (
    <div className="projects-filter">
      <label className="projects-filter-label" htmlFor="client-name-search">
        Client Name
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
