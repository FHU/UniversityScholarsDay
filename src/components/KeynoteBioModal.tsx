import { useEffect } from "react";
import type { Session } from "../types";

type Props = {
  session: Session;
  onClose: () => void;
};

export function KeynoteBioModal({ session, onClose }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const speaker = session.presenters[0] ?? "";

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Speaker biography for ${speaker}`}
    >
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="modal-close"
          onClick={onClose}
          aria-label="Close biography"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
        <h2>{speaker}</h2>
        <div className="modal-affiliation">{session.title}</div>
        {session.bio && <div className="modal-body">{session.bio}</div>}
      </div>
    </div>
  );
}
