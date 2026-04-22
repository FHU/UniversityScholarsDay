import type { Session, SessionType } from "../types";

type Props = {
  session: Session;
  selected: boolean;
  onToggle: (id: string) => void;
  onShowBio?: (session: Session) => void;
};

const TYPE_LABELS: Record<SessionType, string> = {
  keynote: "Keynote",
  oral: "Oral",
  poster: "Poster",
  musical: "Musical",
};

const TYPE_CLASSES: Record<SessionType, string> = {
  keynote: "badge badge-keynote",
  oral: "badge badge-oral",
  poster: "badge badge-poster",
  musical: "badge badge-musical",
};

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 2.5l2.93 6.6 7.07.7-5.32 4.9 1.55 7.1L12 18.3 5.77 21.8l1.55-7.1L2 9.8l7.07-.7z" />
    </svg>
  );
}

export function SessionCard({ session, selected, onToggle, onShowBio }: Props) {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Don't toggle when clicking internal buttons (bio link)
    const target = e.target as HTMLElement;
    if (target.closest("[data-stop]")) return;
    onToggle(session.id);
  };

  const handleKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onToggle(session.id);
    }
  };

  return (
    <div
      className="session-card"
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      aria-label={`${selected ? "Remove" : "Add"} ${session.title} ${selected ? "from" : "to"} my schedule`}
      onClick={handleClick}
      onKeyDown={handleKey}
    >
      <div className="session-card-top">
        <span className={TYPE_CLASSES[session.type]}>{TYPE_LABELS[session.type]}</span>
        <span className="star-btn" aria-hidden="true">
          <StarIcon filled={selected} />
        </span>
      </div>

      <h3 className="session-title">{session.title}</h3>

      {session.presenters.length > 0 && (
        <div className="session-presenters">{session.presenters.join(", ")}</div>
      )}

      {session.mentors.length > 0 && (
        <div className="session-mentors">
          Mentor{session.mentors.length > 1 ? "s" : ""}: {session.mentors.join(", ")}
        </div>
      )}

      <div className="session-meta">
        <span className="room-chip">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M20 10c0 7-8 13-8 13s-8-6-8-13a8 8 0 0 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          {session.building} · {session.room}
        </span>
      </div>

      {session.bio && onShowBio && (
        <button
          type="button"
          className="bio-link"
          data-stop
          onClick={(e) => {
            e.stopPropagation();
            onShowBio(session);
          }}
        >
          Read speaker bio →
        </button>
      )}
    </div>
  );
}
