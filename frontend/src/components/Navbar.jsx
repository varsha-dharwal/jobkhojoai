import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import logo from "../assets/logo.png";

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
  { to: "/privacy-policy", label: "Privacy" },
  { to: "/terms", label: "Terms" },
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
  const navigate = useNavigate();

  function submitSearch(e){
    e.preventDefault();
    const q = query.trim();
    navigate(q ? `/?search=${encodeURIComponent(q)}#jobs` : "/#jobs");
    setOpen(false);
  }

  return (
    <header className="site-header">
      <div className="container site-header-inner">
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} style={{display:"inline-flex"}}>
          <Link to="/" className="logo-link" aria-label="jobkhojoAI home" onClick={() => setOpen(false)}>
            <img src={logo} alt="jobkhojoAI logo" />
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
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
