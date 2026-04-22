import { useState } from "react";
import { TopNav } from "./components/TopNav";
import { ScheduleView } from "./components/ScheduleView";
import { MyScheduleView } from "./components/MyScheduleView";
import { useSelections } from "./hooks/useSelections";
import { SESSIONS } from "./data/sessions";

export type Tab = "schedule" | "my";

export default function App() {
  const [tab, setTab] = useState<Tab>("schedule");
  const { selected, toggle, clear } = useSelections();

  return (
    <div className="app-shell">
      <TopNav
        activeTab={tab}
        onTabChange={setTab}
        selectionCount={selected.size}
      />
      <main className="app-main">
        {tab === "schedule" ? (
          <ScheduleView
            sessions={SESSIONS}
            selected={selected}
            onToggle={toggle}
          />
        ) : (
          <MyScheduleView
            sessions={SESSIONS}
            selected={selected}
            onToggle={toggle}
            onClear={clear}
            onBrowse={() => setTab("schedule")}
          />
        )}
      </main>
      <footer className="app-footer">
        <p>&copy; 2026 · Freed-Hardeman University</p>
        <p>
          <a href="mailto:jdeweese@FHU.edu" className="footer-email-link" aria-label="Email jdeweese@FHU.edu">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect width="20" height="16" x="2" y="4" rx="2"/>
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
          </svg>
        </a>
        </p>
      </footer>
    </div>
  );
}
