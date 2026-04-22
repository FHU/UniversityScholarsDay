import { format, parseISO } from "date-fns";

export function formatTimeRange(startIso: string, endIso: string): string {
  const start = parseISO(startIso);
  const end = parseISO(endIso);
  const startStr = format(start, "h:mm");
  const endStr = format(end, "h:mm a");
  return `${startStr}–${endStr}`;
}

export function formatTime(iso: string): string {
  return format(parseISO(iso), "h:mm a");
}
