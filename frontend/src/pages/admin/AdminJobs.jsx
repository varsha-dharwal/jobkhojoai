import ProtectedRoute from "../../components/ProtectedRoute";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import api from "../../api/client";
import { MIN_NOTE_WORDS, wordCount } from "../../lib/jobs";

const JOB_BOARDS = /(^|\.)(linkedin\.com|naukri\.com|indeed\.com|foundit\.in|shine\.com|internshala\.com|glassdoor\.(com|co\.in)|apna\.co|instahyre\.com)$/;

function hostOf(url){
  try { return new URL(url).hostname.replace(/^www\./, ""); } catch { return ""; }
}

// What the admin needs to see at a glance for each job.
function jobState(job){
  const words = wordCount(job.editorNote);
  return {
    open: job.open !== false,
    visible: job.open !== false && words >= MIN_NOTE_WORDS,
    noteWords: words,
    jobBoard: JOB_BOARDS.test(hostOf(job.applyLink)),
  };
}

const BADGE = {
  green: { background: "#ECFDF5", color: "#166534" },
  amber: { background: "#FEF3C7", color: "#92400E" },
  grey: { background: "#F1F5F9", color: "#475569" },
};

function Badge({ tone, children }){
  return <span style={{ ...BADGE[tone], fontSize: 12, fontWeight: 600, padding: "3px 8px", borderRadius: 999, whiteSpace: "nowrap" }}>{children}</span>;
}

const FILTERS = [
  { id: "all", label: "All", test: () => true },
  { id: "needs-note", label: "Needs note", test: s => s.open && !s.visible },
  { id: "visible", label: "Visible to Google", test: s => s.visible },
  { id: "closed", label: "Closed", test: s => !s.open },
];

function AdminJobsPage(){
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState("");
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  function load(){
    setLoading(true);
    api.get("/jobs/admin/all")
      .then(res => setJobs(res.data))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleDelete(id){
    if (!confirm("Are you sure you want to permanently delete this job?")) return;
    await api.delete(`/jobs/${id}`);
    load();
  }

  async function toggleStatus(job){
    await api.put(`/jobs/${job._id}`, { status: job.status === "active" ? "expired" : "active" });
    load();
  }

  async function copyLink(job){
    await navigator.clipboard.writeText(`${window.location.origin}/jobs/${job.slug}`);
    setCopiedId(job._id);
    setTimeout(() => setCopiedId(""), 2000);
  }

  function logout(){
    localStorage.removeItem("jobkhojoai_token");
    navigate("/admin/login");
  }

  const rows = jobs.map(job => ({ job, state: jobState(job) }));
  const counts = Object.fromEntries(FILTERS.map(f => [f.id, rows.filter(r => f.test(r.state)).length]));
  const shown = rows.filter(r => FILTERS.find(f => f.id === filter).test(r.state));

  return (
    <main className="container" style={{paddingTop:32, paddingBottom:60}}>
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16, gap:12, flexWrap:"wrap"}}>
        <h1 style={{fontSize:22}}>Manage Jobs</h1>
        <div style={{display:"flex", gap:10, flexWrap:"wrap"}}>
          <Link to="/admin/jobs/new" className="btn btn-primary">+ Add Job</Link>
          <Link to="/admin/messages" className="btn btn-ghost">Messages</Link>
          <button className="btn btn-ghost" onClick={logout}>Logout</button>
        </div>
      </div>

      {!loading && (
        <p style={{fontSize:14, color:"var(--color-text-secondary)", margin:"0 0 16px"}}>
          {counts.visible} of {jobs.length - counts.closed} open jobs are visible in Google search. A job shows up there once its
          JobKhojo note has {MIN_NOTE_WORDS}+ words. Jobs close 30 days after posting unless they have a later Last Date.
        </p>
      )}

      <div style={{display:"flex", gap:8, flexWrap:"wrap", marginBottom:16}} role="group" aria-label="Filter jobs">
        {FILTERS.map(f => (
          <button key={f.id} type="button" className={filter === f.id ? "btn btn-primary btn-sm" : "btn btn-ghost btn-sm"} aria-pressed={filter === f.id} onClick={() => setFilter(f.id)}>
            {f.label} ({counts[f.id]})
          </button>
        ))}
      </div>

      {loading && <p style={{color:"var(--color-text-tertiary)"}}>Loading…</p>}

      {shown.map(({ job, state }) => (
        <div key={job._id} className="card" style={{padding:16, marginBottom:10, display:"flex", justifyContent:"space-between", alignItems:"center", gap:12, flexWrap:"wrap"}}>
          <div style={{minWidth:0}}>
            <strong>{job.title}</strong>
            <div style={{fontSize:13, color:"var(--color-text-tertiary)", margin:"2px 0 6px"}}>
              {job.organization} · posted {new Date(job.createdAt).toLocaleDateString("en-IN")}
              {job.lastDate && <> · last date {new Date(job.lastDate).toLocaleDateString("en-IN")}</>}
            </div>
            <div style={{display:"flex", gap:6, flexWrap:"wrap"}}>
              {state.open ? <Badge tone="green">Open</Badge> : <Badge tone="grey">Closed</Badge>}
              {state.open && (state.visible
                ? <Badge tone="green">Visible to Google</Badge>
                : <Badge tone="amber">Needs note ({state.noteWords}/{MIN_NOTE_WORDS} words)</Badge>)}
              {state.jobBoard && <Badge tone="amber">Links to a job board</Badge>}
            </div>
          </div>
          <div style={{display:"flex", gap:8, flexWrap:"wrap"}}>
            <button className="btn btn-ghost" onClick={() => toggleStatus(job)}>
              {job.status === "active" ? "Mark Expired" : "Mark Active"}
            </button>
            <button className="btn btn-ghost" onClick={() => copyLink(job)}>{copiedId === job._id ? "Copied!" : "Copy Link"}</button>
            <Link to={`/admin/jobs/${job._id}/edit`} className="btn btn-ghost">Edit</Link>
            <button className="btn btn-danger" onClick={() => handleDelete(job._id)}>Delete</button>
          </div>
        </div>
      ))}
      {!loading && jobs.length === 0 && <p style={{color:"var(--color-text-tertiary)"}}>No jobs have been added yet.</p>}
      {!loading && jobs.length > 0 && shown.length === 0 && <p style={{color:"var(--color-text-tertiary)"}}>No jobs match this filter.</p>}
    </main>
  );
}

export default function AdminJobs(){
  return <ProtectedRoute><AdminJobsPage /></ProtectedRoute>;
}
