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
        <div className="top-nav-header">
          <div className="brand-row">
            <img src="/FHULogo.png" alt="Freed-Hardeman University" className="brand-logo" />
            <div className="brand">
              <span className="brand-eyebrow">Freed-Hardeman University</span>
              <span className="brand-title">University Scholars' Day</span>
              <span className="brand-tagline">Celebrating Scholarship and Academic Achievement</span>
            </div>
          </div>
          <div className="brand-info">
            <p className="brand-date">April 24, 2026</p>
            {/* <p className="brand-location">Henderson, TN</p> */}
          </div>
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
