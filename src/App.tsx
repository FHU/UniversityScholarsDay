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
        Freed-Hardeman University · Celebrating Scholarship and Academic Achievement ·
        April 24, 2026
      </footer>
    </div>
  );
}
