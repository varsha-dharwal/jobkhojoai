import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import { Bookmark, Menu, Search, X } from "lucide-react";
import Logo from "./Logo";
import { getSavedJobs, onSavedJobsChange } from "../utils/savedJobs";

const NAV = [
  { to: "/jobs", label: "Jobs", isActive: (p, s) => p.startsWith("/jobs") && !/type=internship/.test(s) },
  { to: "/jobs?type=internship", label: "Internships", isActive: (p, s) => p === "/jobs" && /type=internship/.test(s) },
  { to: "/career-paths", label: "Career paths", isActive: p => p.startsWith("/career-paths") || p.startsWith("/roadmap") },
  { to: "/career-insights", label: "Guides", isActive: p => p.startsWith("/career-insights") || (p.startsWith("/career-guide") && !p.endsWith("resume-builder")) },
];

export default function SiteHeader(){
  const { pathname, search } = useLocation();
  const [open, setOpen] = useState(false);
  const [savedCount, setSavedCount] = useState(0);

  useEffect(() => {
    setSavedCount(getSavedJobs().length);
    return onSavedJobsChange(() => setSavedCount(getSavedJobs().length));
  }, []);

  useEffect(() => { setOpen(false); }, [pathname, search]);

  useEffect(() => {
    if (!open) return;
    const onKey = e => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="site-header">
      <div className="container site-header-inner">
        <Link to="/" className="site-header-logo" aria-label="JobKhojo home">
          <Logo />
        </Link>

        <nav className="site-nav" aria-label="Primary">
          {NAV.map(item => (
            <Link key={item.label} to={item.to} className="site-nav-link" aria-current={item.isActive(pathname, search) ? "page" : undefined}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="site-header-actions">
          <Link to="/jobs" className="icon-button icon-button-outline header-search" aria-label="Search jobs">
            <Search size={18} aria-hidden="true" />
          </Link>
          <Link to="/saved-jobs" className="header-saved" aria-label={`Saved jobs${savedCount ? ` (${savedCount})` : ""}`}>
            <Bookmark size={18} aria-hidden="true" />
            <span className="header-saved-label">Saved</span>
            {savedCount > 0 && <span className="count-badge">{savedCount}</span>}
          </Link>
          <Link to="/career-guide/resume-builder" className="btn btn-primary btn-sm header-cta">Build your resume</Link>
          <button
            type="button"
            className="icon-button nav-toggle"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen(o => !o)}
          >
            {open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-nav" className="mobile-nav" aria-label="Mobile">
          <div className="container">
            {NAV.map(item => (
              <Link key={item.label} to={item.to} className="mobile-nav-link" aria-current={item.isActive(pathname, search) ? "page" : undefined}>
                {item.label}
              </Link>
            ))}
            <Link to="/career-guide/resume-builder" className="mobile-nav-link">Resume builder</Link>
            <Link to="/saved-jobs" className="mobile-nav-link">Saved jobs{savedCount > 0 ? ` (${savedCount})` : ""}</Link>
            <div className="mobile-nav-secondary">
              <Link to="/about">About</Link>
              <Link to="/contact">Contact</Link>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
