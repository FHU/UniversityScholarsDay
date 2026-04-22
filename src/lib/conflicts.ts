import type { Session } from "../types";

export function overlaps(a: Session, b: Session): boolean {
  return a.start < b.end && b.start < a.end;
}

export type ConflictMap = Map<string, Set<string>>;

export function findConflicts(sessions: Session[]): ConflictMap {
  const map: ConflictMap = new Map();
  for (let i = 0; i < sessions.length; i++) {
    for (let j = i + 1; j < sessions.length; j++) {
      if (overlaps(sessions[i], sessions[j])) {
        const a = sessions[i].id;
        const b = sessions[j].id;
        if (!map.has(a)) map.set(a, new Set());
        if (!map.has(b)) map.set(b, new Set());
        map.get(a)!.add(b);
        map.get(b)!.add(a);
      }
    }
  }
  return map;
}
