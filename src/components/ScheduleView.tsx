import { useMemo, useState } from "react";
import type { Session } from "../types";
import { SearchBar } from "./SearchBar";
import { RoomFilter } from "./RoomFilter";
import { SessionCard } from "./SessionCard";
import { KeynoteBioModal } from "./KeynoteBioModal";
import { formatTimeRange } from "../lib/format";

type Props = {
  sessions: Session[];
  selected: Set<string>;
  onToggle: (id: string) => void;
};

type TimeBlock = {
  key: string;
  start: string;
  end: string;
  label: string; // session group label
  sessions: Session[];
};

function groupByBlock(sessions: Session[]): TimeBlock[] {
  const map = new Map<string, TimeBlock>();
  for (const s of sessions) {
    const key = `${s.start}|${s.end}|${s.sessionGroup}`;
    if (!map.has(key)) {
      map.set(key, {
        key,
        start: s.start,
        end: s.end,
        label: s.sessionGroup,
        sessions: [],
      });
    }
    map.get(key)!.sessions.push(s);
  }
  return Array.from(map.values()).sort((a, b) => a.start.localeCompare(b.start));
}

function matchesSearch(session: Session, query: string): boolean {
  if (!query.trim()) return true;
  const q = query.toLowerCase();
  return (
    session.title.toLowerCase().includes(q) ||
    session.presenters.some((p) => p.toLowerCase().includes(q)) ||
    session.mentors.some((m) => m.toLowerCase().includes(q)) ||
    session.room.toLowerCase().includes(q) ||
    session.building.toLowerCase().includes(q) ||
    session.sessionGroup.toLowerCase().includes(q)
  );
}

export function ScheduleView({ sessions, selected, onToggle }: Props) {
  const [query, setQuery] = useState("");
  const [rooms, setRooms] = useState<Set<string>>(new Set());
  const [bioSession, setBioSession] = useState<Session | null>(null);

  const allRooms = useMemo(() => {
    const s = new Set<string>();
    sessions.forEach((sess) => s.add(`${sess.building} · ${sess.room}`));
    return Array.from(s).sort();
  }, [sessions]);

  const filtered = useMemo(() => {
    return sessions.filter((s) => {
      if (!matchesSearch(s, query)) return false;
      if (rooms.size > 0 && !rooms.has(`${s.building} · ${s.room}`)) return false;
      return true;
    });
  }, [sessions, query, rooms]);

  const blocks = useMemo(() => groupByBlock(filtered), [filtered]);

  const toggleRoom = (room: string) => {
    setRooms((prev) => {
      const next = new Set(prev);
      if (next.has(room)) next.delete(room);
      else next.add(room);
      return next;
    });
  };

  return (
    <>
      <div className="filter-bar">
        <SearchBar value={query} onChange={setQuery} />
        <RoomFilter
          rooms={allRooms}
          selected={rooms}
          onToggle={toggleRoom}
          onClear={() => setRooms(new Set())}
        />
      </div>

      {blocks.length === 0 && (
        <div className="empty-state">
          <h2>No sessions match your filters.</h2>
          <p>Try clearing the search or room filter to see more.</p>
        </div>
      )}

      {blocks.map((block) => (
        <section className="timeblock" key={block.key}>
          <div className="timeblock-header">
            <span className="timeblock-time">
              {formatTimeRange(block.start, block.end)}
            </span>
            <span className="timeblock-label">· {block.label}</span>
          </div>
          <div className="session-grid">
            {block.sessions.map((s) => (
              <SessionCard
                key={s.id}
                session={s}
                selected={selected.has(s.id)}
                onToggle={onToggle}
                onShowBio={s.bio ? setBioSession : undefined}
              />
            ))}
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
