type Props = {
  value: string;
  onChange: (value: string) => void;
};

export function SearchBar({ value, onChange }: Props) {
  return (
    <div className="search-input-wrap" role="search">
      <span className="search-icon" aria-hidden="true">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      </span>
      <input
        type="search"
        className="search-input"
        placeholder="Search titles, presenters, mentors, rooms…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Search sessions"
      />
    </div>
  );
}
