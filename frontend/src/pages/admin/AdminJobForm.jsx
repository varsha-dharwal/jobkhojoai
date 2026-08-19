import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/client";

const empty = {
  title:"", organization:"", logoUrl:"", category:"Full-time", remote:false, location:"Across India",
  salaryMin:"", salaryMax:"", vacancies:"", experience:"", education:"", skills:"",
  startDate:"", lastDate:"", applyLink:"",
  roleDescription:"", responsibilities:"", requirements:"", aboutCompany:"",
};

function Field({ label, name, type="text", value, onChange, required=false }){
  return (
    <div style={{marginBottom:16}}>
      <label>{label}{required && " *"}</label>
      <input type={type} value={value || ""} onChange={e => onChange(name, e.target.value)} required={required} />
    </div>
  );
}

function TextArea({ label, name, value, onChange, rows=5, hint }){
  return (
    <div style={{marginBottom:16}}>
      <label>{label}</label>
      {hint && <p style={{margin:"-4px 0 8px", fontSize:12, color:"var(--color-text-tertiary)"}}>{hint}</p>}
      <textarea rows={rows} value={value || ""} onChange={e => onChange(name, e.target.value)} />
    </div>
  );
}

function FormSection({ title, subtitle, children }){
  return (
    <div className="card" style={{padding:24, marginBottom:20}}>
      <h2 style={{fontSize:16, margin:"0 0 2px"}}>{title}</h2>
      {subtitle && <p style={{margin:"0 0 18px", fontSize:13, color:"var(--color-text-tertiary)"}}>{subtitle}</p>}
      {!subtitle && <div style={{marginBottom:18}} />}
      {children}
    </div>
  );
}

export default function AdminJobForm(){
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [form, setForm] = useState(empty);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isEdit) return;
    api.get("/jobs/admin/all").then(res => {
      const job = res.data.find(j => j._id === id);
      if (job) setForm({
        ...job,
        startDate: job.startDate?.slice(0,10),
        lastDate: job.lastDate?.slice(0,10),
      });
    });
  }, [id]);

  function update(field, value){
    setForm(f => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e){
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      let job;
      if (isEdit) job = (await api.put(`/jobs/${id}`, form)).data;
      else job = (await api.post("/jobs", form)).data;
      setShareLink(`${window.location.origin}/jobs/${job.slug}`);
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't save, please check the fields.");
    } finally {
      setSaving(false);
    }
  }

  async function copyLink(){
    await navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (shareLink) {
    return (
      <main className="container" style={{paddingTop:32, paddingBottom:60, maxWidth:560}}>
        <h1 style={{fontSize:22, marginBottom:8}}>{isEdit ? "Job Updated!" : "Job Published!"}</h1>
        <p style={{color:"var(--color-text-secondary)", marginBottom:20}}>
          Share this link anywhere — your Instagram bio, a post, WhatsApp — so people can view the full job details.
        </p>
        <div className="card" style={{padding:16, display:"flex", gap:10, alignItems:"center", marginBottom:20, flexWrap:"wrap"}}>
          <input readOnly value={shareLink} style={{flex:"1 1 200px", minWidth:0}} onFocus={e => e.target.select()} />
          <button type="button" className="btn btn-primary" onClick={copyLink}>{copied ? "Copied!" : "Copy Link"}</button>
        </div>
        <div style={{display:"flex", gap:10, flexWrap:"wrap"}}>
          <a href={shareLink} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">View Job Page</a>
          <button type="button" className="btn btn-ghost" onClick={() => navigate("/admin/jobs")}>Back to Manage Jobs</button>
        </div>
      </main>
    );
  }

  return (
    <main className="container" style={{paddingTop:32, paddingBottom:60, maxWidth:680}}>
      <h1 style={{fontSize:22, marginBottom:20}}>{isEdit ? "Edit Job" : "Add New Job"}</h1>
      <form onSubmit={handleSubmit}>

        <FormSection title="Basic Info">
          <Field label="Job Title" name="title" value={form.title} onChange={update} required />
          <Field label="Organization" name="organization" value={form.organization} onChange={update} required />
          <Field label="Company Logo URL" name="logoUrl" value={form.logoUrl} onChange={update} />
          <p style={{margin:"-10px 0 16px", fontSize:12, color:"var(--color-text-tertiary)"}}>Optional — a full image URL, or a path like /logos/company.png. Leave blank to use an auto-generated initials badge.</p>

          <div className="form-grid-2">
            <div style={{marginBottom:16}}>
              <label>Category</label>
              <select value={form.category} onChange={e=>update("category", e.target.value)}>
                <option value="Full-time">Full-time</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
            <div style={{marginBottom:16}}>
              <label>Work Mode</label>
              <label style={{display:"flex", alignItems:"center", gap:8, fontWeight:400, fontSize:14, color:"var(--color-text-primary)", cursor:"pointer", height:44}}>
                <input
                  type="checkbox"
                  checked={!!form.remote}
                  onChange={e => update("remote", e.target.checked)}
                  style={{width:"auto"}}
                />
                Remote / Work from home
              </label>
            </div>
          </div>

          <Field label="Location" name="location" value={form.location} onChange={update} />

          <div className="form-grid-2">
            <Field label="Experience" name="experience" value={form.experience} onChange={update} />
            <Field label="Education" name="education" value={form.education} onChange={update} />
          </div>
          <Field
            label="Key Skills"
            name="skills"
            value={form.skills}
            onChange={update}
          />
          <p style={{margin:"-10px 0 16px", fontSize:12, color:"var(--color-text-tertiary)"}}>Comma-separated — shown as tags, e.g. Figma, Adobe XD, Sketch</p>
        </FormSection>

        <FormSection title="Compensation & Timeline">
          <div className="form-grid-2">
            <Field label="Salary Min" name="salaryMin" value={form.salaryMin} onChange={update} />
            <Field label="Salary Max" name="salaryMax" value={form.salaryMax} onChange={update} />
          </div>
          <Field label="Vacancies" name="vacancies" value={form.vacancies} onChange={update} />
          <div className="form-grid-2">
            <Field label="Start Date" name="startDate" type="date" value={form.startDate} onChange={update} />
            <Field label="Last Date" name="lastDate" type="date" value={form.lastDate} onChange={update} />
          </div>
        </FormSection>

        <FormSection title="Role Details" subtitle="This is what job seekers see on the job page — write it like a real listing.">
          <TextArea
            label="Role Description"
            name="roleDescription"
            value={form.roleDescription}
            onChange={update}
            rows={5}
            hint="One or more paragraphs. Each new line becomes a new paragraph."
          />
          <TextArea
            label="Key Responsibilities"
            name="responsibilities"
            value={form.responsibilities}
            onChange={update}
            rows={5}
            hint="One responsibility per line — each becomes a bullet point."
          />
          <TextArea
            label="Requirements"
            name="requirements"
            value={form.requirements}
            onChange={update}
            rows={5}
            hint="One requirement per line — each becomes a bullet point."
          />
        </FormSection>

        <FormSection title="About the Company">
          <TextArea
            label={`About ${form.organization || "the company"}`}
            name="aboutCompany"
            value={form.aboutCompany}
            onChange={update}
            rows={3}
            hint="A short blurb about who the employer is."
          />
        </FormSection>

        <FormSection title="Apply Link">
          <Field label="Official Apply Link" name="applyLink" value={form.applyLink} onChange={update} required />
        </FormSection>

        {error && <p style={{color:"var(--color-danger)", fontSize:13, marginBottom:12}}>{error}</p>}
        <button className="btn btn-primary" disabled={saving} style={{width:"100%"}}>
          {saving ? "Saving…" : isEdit ? "Update Job" : "Publish Job"}
        </button>
      </form>
    </main>
  );
}
