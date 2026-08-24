import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { getSavedJobs, onSavedJobsChange } from "../utils/savedJobs";

export const QUICK_LINKS = [
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
  { to: "/privacy-policy", label: "Privacy Policy" },
  { to: "/terms", label: "Terms & Conditions" },
];

function BoltIcon(){
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  );
}

export function BookmarkIcon(){
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 3.5h12a1 1 0 0 1 1 1V21l-7-4-7 4V4.5a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  );
}

// Replaces the About/Contact/Privacy/Terms links in the header — those, plus
// Saved Jobs, live inside this icon-triggered dropdown instead. `onNavigate` lets
// the mobile menu also close itself when an item here is picked.
export default function QuickActionsMenu({ onNavigate }){
  const [open, setOpen] = useState(false);
  const [savedCount, setSavedCount] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    setSavedCount(getSavedJobs().length);
    return onSavedJobsChange(() => setSavedCount(getSavedJobs().length));
  }, []);

  useEffect(() => {
    if (!open) return;
    function onClickOutside(e){ if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    function onKeyDown(e){ if (e.key === "Escape") setOpen(false); }
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function pick(){
    setOpen(false);
    onNavigate?.();
  }

  return (
    <div className="filter-dropdown" ref={ref}>
      <button
        type="button"
        className="quick-actions-trigger"
        aria-label="Quick actions"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen(o => !o)}
      >
        <BoltIcon />
      </button>
      {open && (
        <div className="filter-dropdown-panel quick-actions-panel" role="menu">
          <NavLink to="/saved-jobs" className="quick-actions-item" onClick={pick}>
            <BookmarkIcon /> Saved Jobs
            {savedCount > 0 && <span className="quick-actions-badge">{savedCount}</span>}
          </NavLink>
          <div className="quick-actions-divider" />
         
        </div>
      )}
    </div>
  );
}
