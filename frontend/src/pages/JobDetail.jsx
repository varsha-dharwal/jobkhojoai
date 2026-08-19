import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/client";
import CompanyAvatar from "../components/CompanyAvatar";
import { timeAgo } from "../utils/timeAgo";

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

  useEffect(() => {
    setState("loading");
    api.get(`/jobs/${slug}`)
      .then(res => { setJob(res.data); setState("ready"); })
      .catch(err => setState(err.response?.status === 404 ? "notfound" : "error"));
  }, [slug]);

  useEffect(() => {
    if (!job) return;
    document.title = `${job.title} — ${job.organization} | jobkhojoAI`;

    // JobPosting structured data for Google Jobs
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify({
      "@context": "https://schema.org/",
      "@type": "JobPosting",
      title: job.title,
      description: job.roleDescription || job.title,
      datePosted: job.createdAt,
      validThrough: job.lastDate,
      employmentType: job.category === "Internship" ? "INTERN" : "FULL_TIME",
      ...(job.remote ? { jobLocationType: "TELECOMMUTE" } : {}),
      hiringOrganization: { "@type": "Organization", name: job.organization },
      jobLocation: { "@type": "Place", address: { "@type": "PostalAddress", addressCountry: "IN", addressRegion: job.location } },
      baseSalary: { "@type": "MonetaryAmount", currency: "INR", value: { "@type": "QuantitativeValue", minValue: job.salaryMin, maxValue: job.salaryMax, unitText: "MONTH" } },
      ...(job.experience ? { experienceRequirements: job.experience } : {}),
      ...(job.education ? { educationRequirements: job.education } : {}),
      ...(job.skills ? { skills: job.skills } : {}),
    });
    document.head.appendChild(script);
    return () => document.head.removeChild(script);
  }, [job]);

  if (state === "loading") return <main className="container" style={{paddingTop:40}}>Loading…</main>;
  if (state === "notfound") return (
    <main className="container" style={{paddingTop:40}}>
      <h2>Job not found</h2>
      <p style={{color:"var(--color-text-secondary)"}}>This job may have expired, or the link may be incorrect.</p>
      <Link to="/" className="btn btn-primary" style={{marginTop:16}}>Back to Home</Link>
    </main>
  );
  if (state === "error") return <main className="container" style={{paddingTop:40, color:"var(--color-danger)"}}>Something went wrong, please try again.</main>;

  return (
    <main className="container" style={{paddingTop:32, paddingBottom:60, maxWidth:720}}>
      <div className="card" style={{padding:24, marginBottom:24, display:"flex", gap:16}}>
        <CompanyAvatar name={job.organization} logoUrl={job.logoUrl} size={56} />
        <div style={{flex:1, minWidth:0}}>
          <div style={{display:"flex", gap:8, flexWrap:"wrap", marginBottom:8}}>
            <span className={`badge ${job.category === "Internship" ? "badge-internship" : "badge-fulltime"}`}>{job.category}</span>
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

      <a href={job.applyLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{width:"100%", padding:"16px 0", fontSize:16}}>
        Apply Now — Official Website ↗
      </a>
      <p style={{fontSize:12, color:"var(--color-text-tertiary)", marginTop:10, textAlign:"center"}}>
        You will be redirected to the official recruiter's website. jobkhojoAI does not collect applications.
      </p>
    </main>
  );
}
