import type { Tab } from "../App";

type Props = {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  selectionCount: number;
};

export function TopNav({ activeTab, onTabChange, selectionCount }: Props) {
  return (
    <header className="top-nav">
      <div className="top-nav-inner">
        <div className="brand">
          <span className="brand-eyebrow">Freed-Hardeman University</span>
          <span className="brand-title">University Scholars' Day</span>
          <span className="brand-date">Friday · April 24, 2026</span>
        </div>
        <nav className="tab-bar" aria-label="Primary">
          <button
            type="button"
            className="tab"
            aria-current={activeTab === "schedule" ? "page" : undefined}
            onClick={() => onTabChange("schedule")}
          >
            Schedule
          </button>
          <button
            type="button"
            className="tab"
            aria-current={activeTab === "my" ? "page" : undefined}
            onClick={() => onTabChange("my")}
          >
            My Schedule
            <span className="tab-count" aria-label={`${selectionCount} selected`}>
              {selectionCount}
            </span>
          </button>
        </nav>
      </div>
    </header>
  );
}
