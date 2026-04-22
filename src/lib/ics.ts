import type { Session } from "../types";

// ICS spec: lines must be folded at 75 octets, fields escaped for commas, semicolons, newlines.
function escapeText(s: string): string {
  return s
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

function foldLine(line: string): string {
  // RFC 5545 content lines SHOULD be <= 75 octets; fold with CRLF + space.
  if (line.length <= 75) return line;
  const parts: string[] = [];
  let i = 0;
  while (i < line.length) {
    parts.push((i === 0 ? "" : " ") + line.slice(i, i + 74));
    i += 74;
  }
  return parts.join("\r\n");
}

// "2026-04-24T08:30:00-05:00" → "20260424T083000"
function toLocalIcsTime(iso: string): string {
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/);
  if (!m) throw new Error(`Bad ISO datetime: ${iso}`);
  return `${m[1]}${m[2]}${m[3]}T${m[4]}${m[5]}${m[6]}`;
}

function nowUtcStamp(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T` +
    `${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`
  );
}

// Minimal America/Chicago VTIMEZONE block for 2026 (already in DST on April 24).
const CHICAGO_VTIMEZONE = [
  "BEGIN:VTIMEZONE",
  "TZID:America/Chicago",
  "BEGIN:DAYLIGHT",
  "TZOFFSETFROM:-0600",
  "TZOFFSETTO:-0500",
  "TZNAME:CDT",
  "DTSTART:20070311T020000",
  "RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU",
  "END:DAYLIGHT",
  "BEGIN:STANDARD",
  "TZOFFSETFROM:-0500",
  "TZOFFSETTO:-0600",
  "TZNAME:CST",
  "DTSTART:20071104T020000",
  "RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU",
  "END:STANDARD",
  "END:VTIMEZONE",
];

export function buildIcs(sessions: Session[]): string {
  const stamp = nowUtcStamp();
  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Freed-Hardeman University//Scholars Day 2026//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:FHU Scholars' Day 2026",
    "X-WR-TIMEZONE:America/Chicago",
    ...CHICAGO_VTIMEZONE,
  ];

  for (const s of sessions) {
    const people = [...s.presenters, ...(s.mentors.length ? ["(Mentors) " + s.mentors.join(", ")] : [])];
    const description = people.join(" · ");
    const location = `${s.building} — ${s.room}`;
    lines.push(
      "BEGIN:VEVENT",
      `UID:${s.id}@fhu-scholars-day-2026`,
      `DTSTAMP:${stamp}`,
      `DTSTART;TZID=America/Chicago:${toLocalIcsTime(s.start)}`,
      `DTEND;TZID=America/Chicago:${toLocalIcsTime(s.end)}`,
      foldLine(`SUMMARY:${escapeText(s.title)}`),
      foldLine(`LOCATION:${escapeText(location)}`),
      foldLine(`DESCRIPTION:${escapeText(description)}`),
      "END:VEVENT"
    );
  }

  lines.push("END:VCALENDAR");
  return lines.join("\r\n") + "\r\n";
}

export function downloadIcs(sessions: Session[], filename = "fhu-scholars-day-2026.ics") {
  const ics = buildIcs(sessions);
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
