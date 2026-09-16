import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";

export const CAREER_GUIDE_LINKS = [
  { to: "/career-insights", label: "Career Insights" },
  { to: "/career-guide/frontend-developer-roadmap-2026", label: "Frontend Developer Roadmap 2026" },
  { to: "/career-guide/react-developer-interview-preparation", label: "React Developer Interview Preparation" },
  { to: "/career-guide/how-to-spot-fake-job-posts", label: "How to Spot Fake Job Posts" },
  { to: "/career-guide/interview-tips", label: "Interview Tips" },
  { to: "/career-guide/resume-builder", label: "Resume Builder" },
];

function ChevronIcon(){
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" style={{marginLeft:4}}>
      <path d="M2.5 4.5 6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// Desktop-only "Career Guide" nav dropdown — sits between Home and the quick
// actions bolt icon. Mobile shows the same links flattened (see Navbar.jsx).
export default function CareerGuideMenu(){
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

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

  return (
    <div className="filter-dropdown nav-dropdown" ref={ref}>
      <button
        type="button"
        className="nav-dropdown-trigger"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen(o => !o)}
      >
        Career Guide <ChevronIcon />
      </button>
      {open && (
        <div className="filter-dropdown-panel nav-dropdown-panel" role="menu">
          {CAREER_GUIDE_LINKS.map(l => (
            <NavLink key={l.to} to={l.to} className="quick-actions-item" onClick={() => setOpen(false)}>
              {l.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}
