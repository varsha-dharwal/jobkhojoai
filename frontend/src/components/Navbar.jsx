import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import logo from "../assets/logo.png";
import FilterDropdown from "./FilterDropdown";
import QuickActionsMenu from "./QuickActionsMenu";

const links = [
  { to: "/", label: "Home", end: true },
];

const DATE_OPTIONS = [
  { value: "24h", label: "Past 24 hours" },
  { value: "week", label: "Past week" },
  { value: "month", label: "Past month" },
];
const LOCATION_OPTIONS = [
  { value: "remote", label: "Remote" },
  { value: "onsite", label: "On-site" },
];
const EXPERIENCE_OPTIONS = [
  { value: "fresher", label: "Fresher / Entry-level" },
  { value: "mid", label: "Mid-level (1–4 yrs)" },
  { value: "senior", label: "Senior (5+ yrs)" },
];
const EMPLOYMENT_OPTIONS = [
  { value: "Full-time", label: "Full-time" },
  { value: "Part-time", label: "Part-time" },
  { value: "Internship", label: "Internship" },
];

function SearchIcon(){
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M14 14l-3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

export default function Navbar(){
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const dateFilter = searchParams.get("datePosted") || "";
  const remoteParam = searchParams.get("remote");
  const locationFilter = remoteParam === "true" ? "remote" : remoteParam === "false" ? "onsite" : "";
  const experienceFilter = (searchParams.get("experience") || "").split(",").filter(Boolean);
  const employmentFilter = searchParams.get("category") || "";

  useEffect(() => {
    setQuery(searchParams.get("search") || "");
    if (searchParams.get("search") || searchParams.get("category") || searchParams.get("remote")
        || searchParams.get("datePosted") || searchParams.get("experience")) {
      setShowFilters(true);
    }
  }, [searchParams]);

  // Merges a partial filter update into the current URL query and always lands on the
  // homepage's jobs section, since that's the only place these filters take effect.
  function goToJobs(patch){
    const params = new URLSearchParams(searchParams);
    Object.entries(patch).forEach(([key, value]) => {
      const isEmpty = value === "" || value === undefined || (Array.isArray(value) && value.length === 0);
      if (isEmpty) params.delete(key);
      else params.set(key, Array.isArray(value) ? value.join(",") : value);
    });
    navigate(`/?${params.toString()}#jobs`);
  }

  function submitSearch(e){
    e.preventDefault();
    goToJobs({ search: query.trim() || undefined });
    setShowFilters(true);
    setOpen(false);
  }

  return (
    <header className="site-header">
      <div className="container site-header-inner">
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} style={{display:"inline-flex"}}>
          <Link to="/" className="logo-link" aria-label="jobkhojoAI home" onClick={() => setOpen(false)}>
            <img src={logo} alt="jobkhojoAI logo" width="100" height="100" fetchPriority="high" />
          </Link>
        </motion.div>

        <div className="site-header-right">
          <form className="header-search-desktop" role="search" onSubmit={submitSearch}>
            <SearchIcon />
            <input
              type="search"
              aria-label="Search jobs, skills, or companies"
              placeholder="Search jobs, skills, companies…"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </form>

          <nav className="nav-desktop" aria-label="Primary">
            {links.map(l => (
              <NavLink key={l.to} to={l.to} end={l.end}>{l.label}</NavLink>
            ))}
            <QuickActionsMenu />
          </nav>

          <button
            type="button"
            className="nav-toggle"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen(o => !o)}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              {open ? (
                <path d="M3 3l12 12M15 3L3 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
              ) : (
                <path d="M2 4.5h14M2 9h14M2 13.5h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
              )}
            </svg>
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="container header-filter-row">
          <div className="filter-pills" role="group" aria-label="Advanced job filters">
            <FilterDropdown label="Date posted" options={DATE_OPTIONS} selected={dateFilter} onApply={v => goToJobs({ datePosted: v })} />
            <FilterDropdown label="Location" options={LOCATION_OPTIONS} selected={locationFilter} onApply={v => goToJobs({ remote: v === "remote" ? "true" : v === "onsite" ? "false" : "" })} />
            <FilterDropdown label="Experience level" options={EXPERIENCE_OPTIONS} selected={experienceFilter} multiSelect onApply={v => goToJobs({ experience: v })} />
            <FilterDropdown label="Employment type" options={EMPLOYMENT_OPTIONS} selected={employmentFilter} onApply={v => goToJobs({ category: v })} />
          </div>
        </div>
      )}

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id="mobile-menu"
            className="container"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            style={{overflow:"hidden"}}
          >
            <nav className="nav-mobile open" aria-label="Mobile">
              <form className="header-search-mobile" role="search" onSubmit={submitSearch}>
                <SearchIcon />
                <input
                  type="search"
                  aria-label="Search jobs, skills, or companies"
                  placeholder="Search jobs, skills, companies…"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                />
              </form>
              {links.map(l => (
                <NavLink key={l.to} to={l.to} end={l.end} onClick={() => setOpen(false)}>{l.label}</NavLink>
              ))}
              <div style={{marginTop:8}}>
                <QuickActionsMenu onNavigate={() => setOpen(false)} />
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
