import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/client";

export default function AdminJobs(){
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState("");
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

  return (
    <main className="container" style={{paddingTop:32, paddingBottom:60}}>
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24, gap:12, flexWrap:"wrap"}}>
        <h1 style={{fontSize:22}}>Manage Jobs</h1>
        <div style={{display:"flex", gap:10, flexWrap:"wrap"}}>
          <Link to="/admin/jobs/new" className="btn btn-primary">+ Add Job</Link>
          <button className="btn btn-ghost" onClick={logout}>Logout</button>
        </div>
      </div>

      {loading && <p style={{color:"var(--color-text-tertiary)"}}>Loading…</p>}

      {jobs.map(job => (
        <div key={job._id} className="card" style={{padding:16, marginBottom:10, display:"flex", justifyContent:"space-between", alignItems:"center", gap:12, flexWrap:"wrap"}}>
          <div>
            <strong>{job.title}</strong>
            <div style={{fontSize:13, color:"var(--color-text-tertiary)"}}>{job.organization} · {job.status}</div>
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
    </main>
  );
}
