import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";
import AuthModal from "../components/resume-builder/AuthModal";
import CompanyAvatar from "../components/CompanyAvatar";
import SEO from "../components/SEO";
import { getUserToken, onUserAuthChange } from "../utils/userAuth";
import { notifyNotificationsChanged } from "../utils/notifications";
import { timeAgo } from "../utils/timeAgo";

function BriefcaseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 8.5h16v10a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 18.5v-10Z" fill="currentColor" opacity=".18" />
      <path d="M4 8.5h16v10a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 18.5v-10ZM9 8.5V6.8A1.8 1.8 0 0 1 10.8 5h2.4A1.8 1.8 0 0 1 15 6.8v1.7M4 12h16M10 12v2h4v-2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function JobNotification({ item, onReadChange }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const job = item.job;
  const location = [job.location, job.remote ? "Remote" : ""].filter(Boolean).join(" · ");

  return (
    <article className={`notification-card${item.readAt ? " is-read" : " is-unread"}`}>
      <div className="notification-card-icon"><BriefcaseIcon /></div>
      <div className="notification-card-main">
        <div className="notification-card-copy">
          <p><strong>{item.readAt ? "Job matched to your resume." : "New job match for you."}</strong> Based on your skills, this role could be a good fit.</p>
        </div>
        <Link
          to={`/jobs/${job.slug}`}
          className="notification-job-link"
          onClick={() => { if (!item.readAt) onReadChange(item, true); }}
        >
          <span className="notification-job-heading">
            <CompanyAvatar name={job.organization} logoUrl={job.logoUrl} size={38} />
            <span className="notification-job-title-block">
              <strong>{job.title}</strong>
              <span>{job.organization}</span>
            </span>
          </span>
          <span className="notification-job-meta">
            {location || job.category || "Explore this opportunity"}
            {job.experience ? ` · ${job.experience}` : ""}
          </span>
          {item.matchedSkills?.length > 0 && (
            <span className="notification-match-skills">
              {item.matchedSkills.slice(0, 4).map((skill) => <span key={skill}>{skill}</span>)}
              {item.matchedSkills.length > 4 && <span>+{item.matchedSkills.length - 4}</span>}
            </span>
          )}
        </Link>
      </div>
      <div className="notification-card-actions">
        <time dateTime={item.createdAt} title={new Date(item.createdAt).toLocaleString()}>{timeAgo(item.createdAt)}</time>
        <div className="notification-menu-wrap">
          <button
            type="button"
            className="notification-more-button"
            aria-label={`More options for ${job.title}`}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((value) => !value)}
          >
            <span aria-hidden="true">•••</span>
          </button>
          {menuOpen && (
            <div className="notification-action-menu" role="menu">
              <button type="button" role="menuitem" onClick={() => { onReadChange(item, !item.readAt); setMenuOpen(false); }}>
                Mark as {item.readAt ? "unread" : "read"}
              </button>
            </div>
          )}
        </div>
      </div>
      {!item.readAt && <span className="notification-unread-dot" aria-label="Unread" />}
    </article>
  );
}

function EmptyNotifications({ hasResume, onSignIn }) {
  if (!hasResume) {
    return (
      <section className="notification-empty card">
        <div className="notification-empty-icon"><BriefcaseIcon /></div>
        <h2>Build your resume to find matching jobs</h2>
        <p>Once your resume skills are saved to your account, we’ll show relevant job matches here.</p>
        <Link to="/career-guide/resume-builder" className="btn btn-primary">Build your resume</Link>
      </section>
    );
  }
  return (
    <section className="notification-empty card">
      <div className="notification-empty-icon"><BriefcaseIcon /></div>
      <h2>You’re all caught up</h2>
      <p>There are no job matches here right now. We’ll add active jobs that fit your resume skills.</p>
      <Link to="/" className="btn btn-ghost">Explore all jobs</Link>
      {!getUserToken() && <button type="button" className="btn btn-primary" onClick={onSignIn}>Sign in</button>}
    </section>
  );
}

export default function Notifications() {
  const [activeTab, setActiveTab] = useState("all");
  const [notifications, setNotifications] = useState([]);
  const [hasResume, setHasResume] = useState(false);
  const [loading, setLoading] = useState(Boolean(getUserToken()));
  const [signedIn, setSignedIn] = useState(Boolean(getUserToken()));
  const [loadError, setLoadError] = useState("");
  const [showAuth, setShowAuth] = useState(false);

  const loadNotifications = useCallback(async () => {
    if (!getUserToken()) {
      setSignedIn(false);
      setNotifications([]);
      setHasResume(false);
      setLoading(false);
      return;
    }
    setSignedIn(true);
    setLoading(true);
    setLoadError("");
    try {
      const { data } = await api.get("/users/me/notifications");
      setNotifications(data.notifications || []);
      setHasResume(Boolean(data.hasResume));
      notifyNotificationsChanged();
    } catch {
      setLoadError("We couldn’t load your notifications. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotifications();
    return onUserAuthChange(loadNotifications);
  }, [loadNotifications]);

  const unreadCount = useMemo(() => notifications.filter((item) => !item.readAt).length, [notifications]);
  const visibleNotifications = useMemo(
    () => activeTab === "unread" ? notifications.filter((item) => !item.readAt) : notifications,
    [activeTab, notifications]
  );

  async function changeReadState(item, shouldRead) {
    const previous = notifications;
    const readAt = shouldRead ? new Date().toISOString() : null;
    setNotifications((current) => current.map((notification) => notification._id === item._id ? { ...notification, readAt } : notification));
    try {
      await api.patch(`/users/me/notifications/${item._id}/${shouldRead ? "read" : "unread"}`);
      notifyNotificationsChanged();
    } catch {
      setNotifications(previous);
      setLoadError("We couldn’t update that notification. Please try again.");
    }
  }

  async function markAllRead() {
    const previous = notifications;
    const readAt = new Date().toISOString();
    setNotifications((current) => current.map((item) => ({ ...item, readAt: item.readAt || readAt })));
    try {
      await api.patch("/users/me/notifications/read-all");
      notifyNotificationsChanged();
    } catch {
      setNotifications(previous);
      setLoadError("We couldn’t update your notifications. Please try again.");
    }
  }

  return (
    <main className="container notifications-page">
      <SEO title="Notifications | jobkhojoAI" description="Job recommendations matched to your resume skills." path="/notifications" noindex />
      <header className="notifications-header">
        <div>
          <p className="notifications-eyebrow">YOUR JOB MATCHES</p>
          <h1>Notifications</h1>
          <p className="notifications-subtitle">Active jobs selected for your resume skills.</p>
        </div>
        {signedIn && unreadCount > 0 && (
          <button type="button" className="btn btn-ghost notifications-mark-all" onClick={markAllRead}>Mark all as read</button>
        )}
      </header>

      <div className="notifications-toolbar">
        <div className="notifications-tabs" role="tablist" aria-label="Filter notifications">
          <button type="button" role="tab" aria-selected={activeTab === "all"} className={activeTab === "all" ? "is-active" : ""} onClick={() => setActiveTab("all")}>All <span>{notifications.length}</span></button>
          <button type="button" role="tab" aria-selected={activeTab === "unread"} className={activeTab === "unread" ? "is-active" : ""} onClick={() => setActiveTab("unread")}>Unread <span>{unreadCount}</span></button>
        </div>
        {!signedIn && <button type="button" className="btn btn-ghost notifications-sign-in" onClick={() => setShowAuth(true)}>Sign in to see matches</button>}
      </div>

      {loadError && <p className="notifications-error" role="alert">{loadError}</p>}
      {loading ? <p className="notifications-loading" role="status">Loading your notifications…</p> : visibleNotifications.length ? (
        <section className="notifications-list" aria-label={`${activeTab} notifications`}>
          {visibleNotifications.map((item) => <JobNotification key={item._id} item={item} onReadChange={changeReadState} />)}
        </section>
      ) : (
        <EmptyNotifications hasResume={signedIn && hasResume} onSignIn={() => setShowAuth(true)} />
      )}

      {showAuth && <AuthModal context="job recommendations" onClose={() => setShowAuth(false)} onSuccess={async () => {
        setShowAuth(false);
        setSignedIn(true);
        await loadNotifications();
      }} />}
    </main>
  );
}
