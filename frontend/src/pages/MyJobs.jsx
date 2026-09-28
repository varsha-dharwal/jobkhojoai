import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import CompanyAvatar from "../components/CompanyAvatar";
import { getSavedJobs, onSavedJobsChange, toggleSavedJob } from "../utils/savedJobs";
import { getApplications, migrateGuestJobsToAccount, onMyJobsChange, syncMyJobs, updateApplicationStatus } from "../utils/myJobs";
import { timeAgo } from "../utils/timeAgo";
import { getUserToken, onUserAuthChange } from "../utils/userAuth";
import api from "../api/client";
import AuthModal from "../components/resume-builder/AuthModal";

const TABS = [
  { id: "saved", label: "Saved" },
  { id: "applied", label: "Applied" },
  { id: "interview", label: "Interviews" },
  { id: "archived", label: "Archived" },
];

function EmptyState({ tab }) {
  const copy = {
    saved: ["No jobs saved yet", "Jobs you save appear here.", "Not seeing a job?"],
    applied: ["No applications yet", "Jobs you mark as applied appear here.", "Not seeing an application?"],
    interview: ["No interviews yet", "Scheduled interviews appear here.", "Not seeing an interview?"],
    archived: ["Nothing yet", "Applications you archive appear here.", "Not seeing an archived application?"],
  }[tab];

  return (
    <div className="my-jobs-empty">
      <div className="my-jobs-empty-art" aria-hidden="true">
        <svg viewBox="0 0 96 76" fill="none">
          <path d="M16 61h64" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          <path d="M25 58V22a5 5 0 0 1 5-5h36a5 5 0 0 1 5 5v36" stroke="currentColor" strokeWidth="3" />
          <path d="M36 30h24M36 40h16" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          <path d="m62 17 11 10-11 10-11-10 11-10Z" fill="var(--color-brand-soft)" stroke="var(--color-brand)" strokeWidth="2" />
        </svg>
      </div>
      <h2>{copy[0]}</h2>
      <p>{copy[1]}</p>
      <strong className="my-jobs-empty-help">{copy[2]}</strong>
      <Link to="/" className="btn btn-primary">Find jobs <span aria-hidden="true">→</span></Link>
    </div>
  );
}

function StatusPill({ status }) {
  const labels = { applied: "Applied", viewed: "Application viewed", interview: "Interview", archived: "Archived" };
  return <span className={`my-job-status my-job-status-${status}`}>{labels[status]}</span>;
}

function ManageApplicationModal({ item, job, onClose, onArchive }) {
  const [reporting, setReporting] = useState(false);
  const [reported, setReported] = useState(false);
  const [reason, setReason] = useState("Job is closed or expired");
  const [details, setDetails] = useState("");
  const [reportError, setReportError] = useState("");

  async function submitReport(e) {
    e.preventDefault();
    setReportError("");
    try {
      await api.post(`/jobs/${job._id}/report`, { reason, details });
      setReported(true);
    } catch {
      setReportError("We could not send your report. Please try again.");
    }
  }

  return (
    <div className="manage-job-overlay" role="presentation" onMouseDown={e => e.target === e.currentTarget && onClose()}>
      <section className="manage-job-modal" role="dialog" aria-modal="true" aria-labelledby="manage-job-title">
        <div className="manage-job-modal-header">
          <h2 id="manage-job-title">Manage this application:</h2>
          <button type="button" className="manage-job-close" aria-label="Close" onClick={onClose}>×</button>
        </div>
        {!reporting ? (
          <div className="manage-job-options">
            <Link to={`/jobs/${job.slug}`} onClick={onClose}>
              <span className="manage-job-option-icon" aria-hidden="true">▣</span>
              <strong>View and manage details</strong>
            </Link>
            <button type="button" onClick={() => { onArchive(item._id); onClose(); }}>
              <span className="manage-job-option-icon" aria-hidden="true">▣</span>
              <strong>Archive</strong>
            </button>
            <button type="button" onClick={() => setReporting(true)}>
              <span className="manage-job-option-icon" aria-hidden="true">⚑</span>
              <strong>Report job</strong>
            </button>
          </div>
        ) : (
          <form className="manage-job-report" onSubmit={submitReport}>
            {reported ? (
              <div className="manage-job-reported">
                <strong>Thanks for letting us know.</strong>
                <p>Your report has been recorded for review.</p>
                <button type="button" className="btn btn-primary" onClick={onClose}>Done</button>
              </div>
            ) : (
              <>
                <p>Tell us what is wrong with this job listing.</p>
                {reportError && <p role="alert" className="my-jobs-error">{reportError}</p>}
                <label>Reason
                  <select value={reason} onChange={e => setReason(e.target.value)}>
                    <option>Job is closed or expired</option>
                    <option>Incorrect job information</option>
                    <option>Suspicious or unsafe listing</option>
                  </select>
                </label>
                <label>Additional details
                  <textarea value={details} onChange={e => setDetails(e.target.value)} rows="3" placeholder="Add more context (optional)" />
                </label>
                <div className="manage-job-report-actions">
                  <button type="button" className="btn btn-ghost" onClick={() => setReporting(false)}>Back</button>
                  <button type="submit" className="btn btn-primary">Submit report</button>
                </div>
              </>
            )}
          </form>
        )}
      </section>
    </div>
  );
}

function JobActivityCard({ item, type, onRemove, onStatusChange }) {
  const [statusOpen, setStatusOpen] = useState(false);
  const [manageOpen, setManageOpen] = useState(false);
  const job = type === "saved" ? item : item.job;
  const status = type === "saved" ? null : item.status;
  const activityDate = type === "saved" ? item.savedAt : item.appliedAt;

  function formatAppliedDate(date) {
    return new Date(date).toLocaleDateString("en-IN", { weekday: "long" });
  }

  const source = type === "saved" ? "" : (item.source || ((job.applyLink || "").toLowerCase().includes("indeed") ? "Indeed" : "jobkhojoAI"));

  return (
    <article className="my-job-card">
      <CompanyAvatar name={job.organization} logoUrl={job.logoUrl} size={52} />
      <div className="my-job-card-main">
        <div className="my-job-card-topline">
          {status && <StatusPill status={status} />}
          {type === "saved" && <span className="my-job-status my-job-status-saved">Saved</span>}
          <span className="my-job-date">{type === "saved" ? "Saved" : "Added"} {timeAgo(activityDate)}</span>
        </div>
        <Link to={`/jobs/${job.slug}`} className="my-job-title">{job.title}</Link>
        <p className="my-job-company">{job.organization}</p>
        <p className="my-job-meta">{job.location || "Location flexible"} · {job.remote ? "Remote" : job.category || "On-site"}</p>
        {type !== "saved" && <p className="my-job-applied-on">Applied on {source} on {formatAppliedDate(activityDate)}</p>}
      </div>
      <div className="my-job-card-actions">
        {type === "saved" ? (
          <>
            <Link to={`/jobs/${job.slug}`} className="btn btn-ghost">View job</Link>
            <button type="button" className="btn btn-quiet" onClick={() => onRemove(job._id)}>Remove</button>
          </>
        ) : (
          <>
            <div className="my-job-action-menu-wrap">
              <button type="button" className="my-job-update-button" onClick={() => setStatusOpen(value => !value)}>Update status</button>
              {statusOpen && (
                <div className="my-job-status-menu" role="menu">
                  <button type="button" onClick={() => { onStatusChange(item._id, "applied"); setStatusOpen(false); }}>Applied</button>
                  <button type="button" onClick={() => { onStatusChange(item._id, "viewed"); setStatusOpen(false); }}>Application viewed</button>
                  <button type="button" onClick={() => { onStatusChange(item._id, "interview"); setStatusOpen(false); }}>Interview</button>
                  <button type="button" onClick={() => { onStatusChange(item._id, "archived"); setStatusOpen(false); }}>Archived</button>
                </div>
              )}
            </div>
            <div className="my-job-action-menu-wrap">
              <button type="button" className="my-job-more-button" aria-label="Manage this application" onClick={() => setManageOpen(true)}>•••</button>
            </div>
          </>
        )}
      </div>
      {manageOpen && <ManageApplicationModal item={item} job={job} onClose={() => setManageOpen(false)} onArchive={onStatusChange} />}
    </article>
  );
}

export default function MyJobs() {
  const [activeTab, setActiveTab] = useState("applied");
  const [data, setData] = useState({ savedJobs: [], applications: [] });
  const [loading, setLoading] = useState(Boolean(getUserToken()));
  const [loadError, setLoadError] = useState("");
  const [signedIn, setSignedIn] = useState(Boolean(getUserToken()));
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    const loadJobs = () => setData({ savedJobs: getSavedJobs(), applications: getApplications() });
    loadJobs();
    if (getUserToken()) {
      setLoading(true);
      syncMyJobs()
        .then(setData)
        .catch(() => setLoadError("Your saved jobs could not be refreshed. Showing this device's history."))
        .finally(() => setLoading(false));
    }
    const unsubscribeSaved = onSavedJobsChange(loadJobs);
    const unsubscribeApplications = onMyJobsChange(loadJobs);
    const unsubscribeAuth = onUserAuthChange(() => {
      const authenticated = Boolean(getUserToken());
      setSignedIn(authenticated);
      if (authenticated) syncMyJobs().then(setData).catch(() => {});
    });
    return () => { unsubscribeSaved(); unsubscribeApplications(); unsubscribeAuth(); };
  }, []);

  function removeSaved(jobId) {
    const job = data.savedJobs.find(item => item._id === jobId);
    if (job) toggleSavedJob(job);
  }

  function updateStatus(applicationId, status) { updateApplicationStatus(applicationId, status); }

  const applications = data.applications.filter(item => activeTab === "applied" ? ["applied", "viewed"].includes(item.status) : item.status === activeTab);
  const items = activeTab === "saved" ? data.savedJobs : applications;
  const counts = {
    saved: data.savedJobs.length,
    applied: data.applications.filter(item => ["applied", "viewed"].includes(item.status)).length,
    interview: data.applications.filter(item => item.status === "interview").length,
    archived: data.applications.filter(item => item.status === "archived").length,
  };

  return (
    <main className="container my-jobs-page">
      <SEO title="My Jobs | jobkhojoAI" description="Track saved jobs and applications on jobkhojoAI." path="/my-jobs" noindex />
      <div className="my-jobs-header">
        <h1>My Jobs</h1>
        {!signedIn && <button type="button" className="btn btn-ghost my-jobs-sync-button" onClick={() => setShowAuth(true)}>Sign in to sync your jobs</button>}
      </div>
      {loadError && <p className="my-jobs-error" role="status">{loadError}</p>}
      <nav className="my-jobs-tabs" aria-label="My jobs sections">
        {TABS.map(tab => (
          <button key={tab.id} type="button" className={activeTab === tab.id ? "is-active" : ""} onClick={() => setActiveTab(tab.id)}>
            <strong>{counts[tab.id]}</strong><span>{tab.label}</span>
          </button>
        ))}
      </nav>
      {loading ? <p className="my-jobs-loading" role="status">Loading your jobs…</p> : items.length === 0 ? <EmptyState tab={activeTab} /> : (
        <section className="my-jobs-list" aria-label={`${activeTab} jobs`}>
          {activeTab === "saved" ? items.map(item => <JobActivityCard key={item._id} item={item} type={activeTab} onRemove={removeSaved} onStatusChange={updateStatus} />) : (
            [
              { title: "Last 14 days", jobs: items.filter(item => Date.now() - new Date(item.appliedAt || item.updatedAt).getTime() <= 14 * 864e5) },
              { title: "Older", jobs: items.filter(item => Date.now() - new Date(item.appliedAt || item.updatedAt).getTime() > 14 * 864e5) },
            ].filter(group => group.jobs.length > 0).map(group => (
              <div className="my-jobs-group" key={group.title}>
                <h2>{group.title}</h2>
                <div>{group.jobs.map(item => <JobActivityCard key={item._id} item={item} type={activeTab} onRemove={removeSaved} onStatusChange={updateStatus} />)}</div>
              </div>
            ))
          )}
        </section>
      )}
      {showAuth && <AuthModal context="jobs across devices" onClose={() => setShowAuth(false)} onSuccess={async ({ mode, guestJobs }) => {
        setShowAuth(false);
        setSignedIn(true);
        try {
          const synced = mode === "register"
            ? await migrateGuestJobsToAccount(guestJobs.savedJobs, guestJobs.applications)
            : await syncMyJobs();
          setData(synced);
        } catch {
          setLoadError("Your jobs could not be synced right now. They are still saved on this device.");
        }
      }} />}
    </main>
  );
}
