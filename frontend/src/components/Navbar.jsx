import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import logo from "../assets/logo.png";
import api from "../api/client";
import { clearUserSession, getUserToken, onUserAuthChange } from "../utils/userAuth";
import { onNotificationsChange } from "../utils/notifications";

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/?category=Internship#jobs", label: "Interns" },
  { to: "/?experience=fresher#jobs", label: "Freshers" },
  { to: "/?experience=mid,senior#jobs", label: "Experienced" },
  { to: "/?remote=true#jobs", label: "Remote" },
  { to: "/#jobs", label: "Freelancer" },
];

function SearchIcon(){
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M14 14l-3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

function HeaderIcon({ type }){
  const paths = {
    bookmark: <path d="M6 4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v16l-6-3.5L6 20V4Z" />,
    message: <><path d="M4 5.5h16v10H8l-4 3v-13Z" /><path d="M8 9h8M8 12h5" /></>,
    notification: <><path d="M6 17h12l-1.3-2.2V10a4.7 4.7 0 0 0-9.4 0v4.8L6 17Z" /><path d="M10 19h4" /></>,
    profile: <><circle cx="12" cy="8" r="3" /><path d="M5.5 20a6.5 6.5 0 0 1 13 0" /></>,
  };
  return <svg className="header-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{paths[type]}</svg>;
}

function HeaderUtility({ label, type, to, unreadCount = 0 }){
  const accessibleLabel = unreadCount ? `${label}, ${unreadCount} unread` : label;
  const content = <><HeaderIcon type={type} />{unreadCount > 0 && <span className="header-notification-badge" aria-hidden="true">{unreadCount > 9 ? "9+" : unreadCount}</span>}<span className="sr-only">{accessibleLabel}</span><span className="header-tooltip" role="tooltip">{accessibleLabel}</span></>;
  return to ? <Link to={to} className="header-utility" aria-label={accessibleLabel}>{content}</Link> : <button type="button" className="header-utility" aria-label={accessibleLabel}>{content}</button>;
}

export default function Navbar(){
  const [open, setOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    setQuery(searchParams.get("search") || "");
  }, [searchParams]);

  useEffect(() => {
    let active = true;
    const refreshUnreadCount = () => {
      if (!getUserToken()) {
        setUnreadCount(0);
        return;
      }
      api.get("/users/me/notifications?summary=true")
        .then(({ data }) => { if (active) setUnreadCount(data.unreadCount || 0); })
        .catch(() => { if (active) setUnreadCount(0); });
    };
    refreshUnreadCount();
    const unsubscribeAuth = onUserAuthChange(refreshUnreadCount);
    const unsubscribeNotifications = onNotificationsChange(refreshUnreadCount);
    return () => {
      active = false;
      unsubscribeAuth();
      unsubscribeNotifications();
    };
  }, [location.pathname]);

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
    setOpen(false);
  }

  return (
    <header className="site-header">
      <div className="container site-header-inner">
        <div className="header-left-group">
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} style={{display:"inline-flex"}}>
            <Link to="/" className="logo-link" aria-label="jobkhojoAI home" onClick={() => setOpen(false)}>
              <img src={logo} alt="jobkhojoAI logo" width="100" height="100" fetchPriority="high" />
            </Link>
          </motion.div>

          <nav className="nav-desktop" aria-label="Primary">
            {links.map(l => (
              <NavLink key={l.label} to={l.to} end={l.end}>{l.label}</NavLink>
            ))}
          </nav>
        </div>

        <div className="site-header-right">
          <div className="header-utilities" aria-label="Account actions">
            <HeaderUtility label="My jobs" type="bookmark" to="/my-jobs" />
            <HeaderUtility label="Messages" type="message" />
            <HeaderUtility label="Notifications" type="notification" to="/notifications" unreadCount={unreadCount} />
            <div className="account-menu">
              <button type="button" className="header-utility" aria-label="Profile" aria-expanded={accountOpen} onClick={() => setAccountOpen(value => !value)}>
                <HeaderIcon type="profile" />
                <span className="header-tooltip" role="tooltip">Profile</span>
              </button>
              {accountOpen && (
                <div className="account-dropdown" role="menu">
                  <Link to="/profile" role="menuitem" onClick={() => setAccountOpen(false)}>Profile</Link>
                  <Link to="/profile?tab=preferences#country-language" role="menuitem" onClick={() => setAccountOpen(false)}>Country and languages</Link>
                  {getUserToken() && <><div className="account-dropdown-divider" /><button type="button" role="menuitem" className="account-signout" onClick={() => { clearUserSession(); setAccountOpen(false); navigate("/"); }}>Sign out</button></>}
                </div>
              )}
            </div>
            <span className="header-utility-divider" aria-hidden="true" />
            <Link to="/admin/jobs/new" className="admin-post-link">Admin / Post a Job</Link>
          </div>

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
                <NavLink key={l.label} to={l.to} end={l.end} onClick={() => setOpen(false)}>{l.label}</NavLink>
              ))}
              <div className="mobile-utility-links">
                <NavLink to="/my-jobs" onClick={() => setOpen(false)}>My jobs</NavLink>
                <NavLink to="/notifications" onClick={() => setOpen(false)}>Notifications{unreadCount > 0 ? ` (${unreadCount})` : ""}</NavLink>
                <NavLink to="/profile" onClick={() => setOpen(false)}>Profile</NavLink>
                <NavLink to="/profile?tab=preferences#country-language" onClick={() => setOpen(false)}>Country and languages</NavLink>
                <NavLink to="/contact" onClick={() => setOpen(false)}>Help</NavLink>
                <NavLink to="/privacy-policy" onClick={() => setOpen(false)}>Privacy Centre</NavLink>
                <NavLink to="/admin/jobs/new" onClick={() => setOpen(false)}>Admin / Post a Job</NavLink>
                {getUserToken() && <button type="button" className="mobile-signout" onClick={() => { clearUserSession(); setOpen(false); navigate("/"); }}>Sign out</button>}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
