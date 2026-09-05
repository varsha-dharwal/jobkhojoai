import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/client";
import CompanyAvatar from "../components/CompanyAvatar";
import { timeAgo } from "../utils/timeAgo";
import { isJobSaved, toggleSavedJob } from "../utils/savedJobs";
import SEO from "../components/SEO";
import { getJobCountry } from "../utils/jobCountry";

function BookmarkIcon({ filled }){
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} aria-hidden="true">
      <path d="M6 3.5h12a1 1 0 0 1 1 1V21l-7-4-7 4V4.5a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  );
}

function ShareIcon(){
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="18" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="6" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="18" cy="19" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M8.2 10.7 15.8 6.3M8.2 13.3l7.6 4.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

function CheckIcon(){
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function formatDate(d){
  return new Date(d).toLocaleDateString("en-IN", { day:"2-digit", month:"long", year:"numeric" });
}

const Row = ({ label, value }) => !value ? null : (
  <div className="detail-row">
    <span style={{color:"var(--color-text-tertiary)", fontSize:13, textTransform:"uppercase", letterSpacing:.4}}>{label}</span>
    <span className="detail-value" style={{fontWeight:600, textAlign:"right"}}>{value}</span>
  </div>
);

function Bullets({ text }){
  const items = (text || "").split("\n").map(s => s.trim()).filter(Boolean);
  if (!items.length) return null;
  return (
    <ul style={{margin:0, paddingLeft:20, display:"flex", flexDirection:"column", gap:10}}>
      {items.map((item, i) => <li key={i} style={{color:"var(--color-text-secondary)", lineHeight:1.6}}>{item}</li>)}
    </ul>
  );
}

function Paragraphs({ text }){
  const paras = (text || "").split("\n").map(s => s.trim()).filter(Boolean);
  if (!paras.length) return null;
  return (
    <div style={{display:"flex", flexDirection:"column", gap:14}}>
      {paras.map((p, i) => <p key={i} style={{margin:0, color:"var(--color-text-secondary)", lineHeight:1.7}}>{p}</p>)}
    </div>
  );
}

function SectionTitle({ icon, children }){
  return (
    <div style={{display:"flex", alignItems:"center", gap:10, marginBottom:16}}>
      <div className="feature-icon" style={{margin:0, width:36, height:36, flexShrink:0}}>{icon}</div>
      <h2 style={{margin:0, fontSize:18}}>{children}</h2>
    </div>
  );
}

const icons = {
  role: <svg viewBox="0 0 24 24" fill="none"><path d="M9 12.5 11 14.5 15.5 10M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  responsibilities: <svg viewBox="0 0 24 24" fill="none"><path d="M9 11l2 2 4-4M5 6.5A2.5 2.5 0 0 1 7.5 4h9A2.5 2.5 0 0 1 19 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 5 17.5v-11Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  requirements: <svg viewBox="0 0 24 24" fill="none"><path d="M9 4.5h6a1 1 0 0 1 1 1V6h1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h1v-.5a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M9 12h6M9 15.5h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  company: <svg viewBox="0 0 24 24" fill="none"><path d="M4 21V5a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v16M14 21v-9a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v9M8 7h1M8 11h1M8 15h1M17 13h1M17 17h1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
};

export default function JobDetail(){
  const { slug } = useParams();
  const [job, setJob] = useState(null);
  const [state, setState] = useState("loading"); // loading | ready | notfound | error
  const [saved, setSaved] = useState(false);
  const [justShared, setJustShared] = useState(false);

  useEffect(() => {
    setState("loading");
    api.get(`/jobs/${slug}`)
      .then(res => { setJob(res.data); setState("ready"); setSaved(isJobSaved(res.data._id)); })
      .catch(err => setState(err.response?.status === 404 ? "notfound" : "error"));
  }, [slug]);

  function handleToggleSave(){
    setSaved(toggleSavedJob(job));
  }

  async function handleShare(){
    const url = `${window.location.origin}/jobs/${job.slug}`;
    const shareData = { title: `${job.title} — ${job.organization}`, text: `Check out this job on jobkhojoAI: ${job.title} at ${job.organization}`, url };
    if (navigator.share) {
      try { await navigator.share(shareData); } catch { /* user cancelled */ }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setJustShared(true);
      setTimeout(() => setJustShared(false), 1800);
    } catch { /* clipboard unavailable */ }
  }

  if (state === "loading") return <main className="container" style={{paddingTop:40}}>Loading…</main>;
  if (state === "notfound") return (
    <main className="container" style={{paddingTop:40}}>
      <SEO title="Job Not Found | jobkhojoAI" description="This job listing has expired or the link is incorrect." path={`/jobs/${slug}`} noindex />
      <h2>Job not found</h2>
      <p style={{color:"var(--color-text-secondary)"}}>This job may have expired, or the link may be incorrect.</p>
      <Link to="/" className="btn btn-primary" style={{marginTop:16}}>Back to Home</Link>
    </main>
  );
  if (state === "error") return <main className="container" style={{paddingTop:40, color:"var(--color-danger)"}}>Something went wrong, please try again.</main>;

  // Google for Jobs (the main US search surface for job listings) keys heavily off
  // addressCountry/currency in this schema — getting them wrong can keep a US job
  // out of US results entirely, so these are derived per-job rather than assumed to be India.
  const jobIsUSA = getJobCountry(job) === "USA";

  const jobSchema = {
    "@context": "https://schema.org/",
    "@type": "JobPosting",
    title: job.title,
    description: job.roleDescription || job.title,
    datePosted: job.createdAt,
    validThrough: job.lastDate,
    employmentType: job.category === "Internship" ? "INTERN" : job.category === "Part-time" ? "PART_TIME" : "FULL_TIME",
    ...(job.remote ? { jobLocationType: "TELECOMMUTE" } : {}),
    hiringOrganization: { "@type": "Organization", name: job.organization },
    jobLocation: { "@type": "Place", address: { "@type": "PostalAddress", addressCountry: jobIsUSA ? "US" : "IN", addressRegion: job.location } },
    baseSalary: { "@type": "MonetaryAmount", currency: jobIsUSA ? "USD" : "INR", value: { "@type": "QuantitativeValue", minValue: job.salaryMin, maxValue: job.salaryMax, unitText: jobIsUSA ? "YEAR" : "MONTH" } },
    ...(job.experience ? { experienceRequirements: job.experience } : {}),
    ...(job.education ? { educationRequirements: job.education } : {}),
    ...(job.skills ? { skills: job.skills } : {}),
  };

  return (
    <main className="container" style={{paddingTop:32, paddingBottom:60, maxWidth:720}}>
      <SEO
        title={`${job.title} — ${job.organization} | jobkhojoAI`}
        description={(job.roleDescription || `${job.title} at ${job.organization}. ${job.location} · ${job.category}.`).slice(0, 160)}
        path={`/jobs/${job.slug}`}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jobSchema) }} />
      <div className="card" style={{padding:24, marginBottom:24, display:"flex", gap:16}}>
        <CompanyAvatar name={job.organization} logoUrl={job.logoUrl} size={56} />
        <div style={{flex:1, minWidth:0}}>
          <div style={{display:"flex", gap:8, flexWrap:"wrap", marginBottom:8}}>
            <span className={`badge ${job.category === "Internship" ? "badge-internship" : job.category === "Part-time" ? "badge-parttime" : "badge-fulltime"}`}>{job.category}</span>
            {job.remote && <span className="badge badge-remote">Remote</span>}
          </div>
          <h1 style={{fontSize:"clamp(20px, 4vw, 28px)", lineHeight:1.2, margin:"0 0 4px"}}>{job.title}</h1>
          <p style={{color:"var(--color-text-secondary)", fontWeight:600, margin:"0 0 4px"}}>{job.organization}</p>
          <p style={{color:"var(--color-text-tertiary)", fontSize:13, margin:"0 0 12px"}}>
            {job.location} ({job.remote ? "Remote" : "On-site"}) · {timeAgo(job.createdAt)}
          </p>
          {job.status === "active" && (
            <span className="status-pill"><span className="dot" aria-hidden="true" /> Actively Recruiting</span>
          )}
        </div>
      </div>

      <div className="card" style={{padding:24, marginBottom:28}}>
        <Row label="Experience" value={job.experience} />
        <Row label="Salary" value={job.salaryMin && job.salaryMax ? `${job.salaryMin} – ${job.salaryMax}` : (job.salaryMin || job.salaryMax)} />
        <Row label="Vacancies" value={job.vacancies} />
        <Row label="Education" value={job.education} />
        <Row label="Start Date" value={job.startDate ? formatDate(job.startDate) : null} />
        <Row label="Last Date" value={job.lastDate ? formatDate(job.lastDate) : null} />
      </div>

      {job.skills && (
        <section style={{marginBottom:32}}>
          <h2 style={{fontSize:14, textTransform:"uppercase", letterSpacing:.5, color:"var(--color-text-tertiary)", marginBottom:16}}>Key Skills</h2>
          <div className="tag-pill-group">
            {job.skills.split(",").map(s => s.trim()).filter(Boolean).map(s => (
              <span key={s} className="tag-pill">{s}</span>
            ))}
          </div>
        </section>
      )}

      {job.roleDescription && (
        <section style={{marginBottom:32}}>
          <SectionTitle icon={icons.role}>Role Description</SectionTitle>
          <Paragraphs text={job.roleDescription} />
        </section>
      )}

      {job.responsibilities && (
        <section style={{marginBottom:32}}>
          <SectionTitle icon={icons.responsibilities}>Key Responsibilities</SectionTitle>
          <Bullets text={job.responsibilities} />
        </section>
      )}

      {job.requirements && (
        <section style={{marginBottom:32}}>
          <SectionTitle icon={icons.requirements}>Requirements</SectionTitle>
          <Bullets text={job.requirements} />
        </section>
      )}

      {job.aboutCompany && (
        <section style={{marginBottom:32}}>
          <SectionTitle icon={icons.company}>About {job.organization}</SectionTitle>
          <Paragraphs text={job.aboutCompany} />
        </section>
      )}

      <div style={{display:"flex", gap:12, marginBottom:14}}>
        <button
          type="button"
          onClick={handleToggleSave}
          className="btn btn-ghost"
          style={{flex:1, color: saved ? "var(--color-brand-strong)" : undefined, borderColor: saved ? "var(--color-brand)" : undefined}}
          aria-pressed={saved}
        >
          <BookmarkIcon filled={saved} /> {saved ? "Saved" : "Save Job"}
        </button>
        <button type="button" onClick={handleShare} className="btn btn-ghost" style={{flex:1}}>
          {justShared ? <><CheckIcon /> Link Copied</> : <><ShareIcon /> Share</>}
        </button>
      </div>

      <a href={job.applyLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{width:"100%", padding:"16px 0", fontSize:16}}>
        Apply Now — Official Website ↗
      </a>
      <p style={{fontSize:12, color:"var(--color-text-tertiary)", marginTop:10, textAlign:"center"}}>
        You will be redirected to the official recruiter's website. jobkhojoAI does not collect applications.
      </p>
    </main>
  );
}
