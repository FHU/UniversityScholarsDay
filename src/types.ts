export type SessionType = "keynote" | "poster" | "oral" | "musical";

export type Session = {
  id: string;
  title: string;
  presenters: string[];
  mentors: string[];
  building: string;
  room: string;
  start: string;
  end: string;
  type: SessionType;
  sessionGroup: string;
  bio?: string;
};
