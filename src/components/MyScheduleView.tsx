import { useMemo, useState } from "react";
import type { Session } from "../types";
import { SessionCard } from "./SessionCard";
import { KeynoteBioModal } from "./KeynoteBioModal";
import { findConflicts } from "../lib/conflicts";
import { downloadIcs } from "../lib/ics";
import { formatTimeRange } from "../lib/format";

type TimeBlock = { key: string; start: string; end: string; label: string; sessions: Session[] };

function groupByBlock(sessions: Session[]): TimeBlock[] {
  const map = new Map<string, TimeBlock>();
  for (const s of sessions) {
    const key = `${s.start}|${s.end}|${s.sessionGroup}`;
    if (!map.has(key)) map.set(key, { key, start: s.start, end: s.end, label: s.sessionGroup, sessions: [] });
    map.get(key)!.sessions.push(s);
  }
  return Array.from(map.values()).sort((a, b) => a.start.localeCompare(b.start));
}

type Props = {
  sessions: Session[];
  selected: Set<string>;
  onToggle: (id: string) => void;
  onClear: () => void;
  onBrowse: () => void;
};

export function MyScheduleView({
  sessions,
  selected,
  onToggle,
  onClear,
  onBrowse,
}: Props) {
  const [bioSession, setBioSession] = useState<Session | null>(null);

  const mine = useMemo(() => {
    return sessions
      .filter((s) => selected.has(s.id))
      .sort((a, b) => a.start.localeCompare(b.start));
  }, [sessions, selected]);

  const conflicts = useMemo(() => findConflicts(mine), [mine]);
  const blocks = useMemo(() => groupByBlock(mine), [mine]);
  const sessionIdx = useMemo(() => {
    const m = new Map<string, number>();
    mine.forEach((s, i) => m.set(s.id, i));
    return m;
  }, [mine]);

  const count = mine.length;

  if (count === 0) {
    return (
      <div className="empty-state">
        <h2>No sessions selected yet.</h2>
        <p>
          Browse the schedule and tap any session to add it to your personal
          itinerary.
        </p>
        <div style={{ marginTop: 18 }}>
          <button type="button" className="btn-primary" onClick={onBrowse}>
            Browse the schedule
          </button>
        </div>
      </div>
    );
  }

  const handleExport = () => downloadIcs(mine);

  return (
    <>
      <div className="my-schedule-header">
        <div>
          <h1 className="my-schedule-title">My Schedule</h1>
          <div className="my-schedule-sub">
            {count} session{count === 1 ? "" : "s"} selected
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button type="button" className="btn-secondary" onClick={onClear}>
            Clear all
          </button>
          <button type="button" className="btn-primary" onClick={handleExport}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <path d="M16 2v4M8 2v4M3 10h18" />
            </svg>
            Add to Calendar
          </button>
        </div>
      </div>

      {blocks.map((block) => (
        <section className="timeblock" key={block.key}>
          <div className="timeblock-header">
            <span className="timeblock-time">{formatTimeRange(block.start, block.end)}</span>
            <span className="timeblock-label">· {block.label}</span>
          </div>
          <div className="my-schedule-list">
            {block.sessions.map((s) => {
              const idx = sessionIdx.get(s.id)!;
              const prev = idx > 0 ? mine[idx - 1] : null;
              const prevConflicts = prev && conflicts.get(s.id)?.has(prev.id);
              return (
                <div key={s.id} className="my-schedule-item">
                  {prevConflicts && (
                    <div className="conflict-notice" role="note">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
                        <path d="M12 9v4" />
                        <path d="M12 17h.01" />
                      </svg>
                      <div>
                        <strong>These overlap.</strong> You can only attend one — pick the
                        one you care about most.
                      </div>
                    </div>
                  )}
                  <SessionCard
                    session={s}
                    selected
                    onToggle={onToggle}
                    onShowBio={s.bio ? setBioSession : undefined}
                  />
                </div>
              );
            })}
          </div>
        </section>
      ))}

      {bioSession && (
        <KeynoteBioModal
          session={bioSession}
          onClose={() => setBioSession(null)}
        />
      )}
    </>
  );
}
