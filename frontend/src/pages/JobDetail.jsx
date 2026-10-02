import { useEffect, useState } from "react";
import { Link, useLoaderData } from "react-router";
import {
  ArrowUpRight, Share2, Check, MapPin, Briefcase, Clock, GraduationCap, Wallet, Users,
  CalendarDays, Globe, Laptop, ShieldAlert, Route as RouteIcon, ChevronRight,
} from "lucide-react";
import SEO, { JsonLd } from "../components/SEO";
import CompanyAvatar from "../components/CompanyAvatar";
import SaveJobButton from "../components/SaveJobButton";
import JobCard from "../components/JobCard";
import AdSlot from "../components/AdSlot";
import { AD_SLOTS } from "../config/adsense";
import { fetchAllJobs, fetchJob, toListJob } from "../lib/api";
import {
  applyTarget, experienceText, formatDate, jobPostingSchema, jobTypeLabel, locationLabel, postedLabel,
  relatedPathSlug, salaryText, similarJobs, skillsList, textLines, workMode,
} from "../lib/jobs";
import { ROADMAPS } from "../data/roadmaps";

// Build time: every active job is pre-rendered with its similar jobs.
export async function loader({ params }){
  const jobs = await fetchAllJobs();
  const job = jobs.find(j => j.slug === params.slug) || await fetchJob(params.slug);
  if (!job) return { job: null, similar: [] };
  const pathSlug = relatedPathSlug(job);
  return {
    job,
    similar: similarJobs(job, jobs).map(toListJob),
    path: pathSlug && ROADMAPS[pathSlug] ? { slug: pathSlug, title: ROADMAPS[pathSlug].title } : null,
  };
}

// Browser: pre-rendered pages use the build data. Jobs posted after the last build
// aren't pre-rendered, so they're fetched from the API on demand.
export async function clientLoader({ params, serverLoader }){
  try {
    const data = await serverLoader();
    if (data?.job) return data;
  } catch {
    // not pre-rendered — fall through to the live API
  }
  const job = await fetchJob(params.slug).catch(() => undefined);
  if (job === undefined) return { job: null, similar: [], failed: true };
  if (!job) return { job: null, similar: [] };
  const all = await fetchAllJobs().catch(() => []);
  return { job, similar: similarJobs(job, all).map(toListJob) };
}

function Paragraphs({ text }){
  const lines = textLines(text);
  if (!lines.length) return null;
  return <div className="prose">{lines.map((p, i) => <p key={i}>{p}</p>)}</div>;
}

function Bullets({ text }){
  const lines = textLines(text);
  if (!lines.length) return null;
  return <ul className="prose-list">{lines.map((item, i) => <li key={i}>{item}</li>)}</ul>;
}

function Fact({ icon: Icon, label, children }){
  if (!children) return null;
  return (
    <div className="fact">
      <dt><Icon size={16} aria-hidden="true" />{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}

function ShareButton({ job }){
  const [copied, setCopied] = useState(false);
  async function share(){
    const url = `${window.location.origin}/jobs/${job.slug}`;
    if (navigator.share) {
      try { await navigator.share({ title: `${job.title} at ${job.organization}`, url }); } catch { /* cancelled */ }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch { /* clipboard unavailable */ }
  }
  return (
    <button type="button" className="btn btn-secondary" onClick={share}>
      {copied ? <Check size={16} aria-hidden="true" /> : <Share2 size={16} aria-hidden="true" />}
      <span>{copied ? "Link copied" : "Share"}</span>
    </button>
  );
}

function ApplyButton({ job, target, className = "" }){
  return (
    <a href={job.applyLink} target="_blank" rel="noopener noreferrer nofollow" className={`btn btn-primary btn-lg ${className}`}>
      {target.label} <ArrowUpRight size={18} aria-hidden="true" />
    </a>
  );
}

function Unavailable({ failed }){
  return (
    <main className="container status-page">
      <SEO title="Job not available | JobKhojo" description="This job listing has closed or the link is incorrect." path="/jobs" noindex />
      <p className="eyebrow">{failed ? "Couldn't load this job" : "Listing closed"}</p>
      <h1>{failed ? "We couldn't load this job right now" : "This job is no longer available"}</h1>
      <p className="lead">
        {failed
          ? "Our server may be waking up. Please try again in a few seconds."
          : "It may have closed, or the link may be incorrect. Similar roles are often still open."}
      </p>
      <div className="status-page-actions">
        {failed && <button type="button" className="btn btn-primary" onClick={() => window.location.reload()}>Try again</button>}
        <Link to="/jobs" className={failed ? "btn btn-secondary" : "btn btn-primary"}>Browse open jobs</Link>
      </div>
    </main>
  );
}

export default function JobDetail(){
  const { job, similar, failed, path } = useLoaderData();

  // Keep the floating "Ask" button clear of the mobile sticky apply bar.
  useEffect(() => {
    document.documentElement.classList.add("has-apply-bar");
    return () => document.documentElement.classList.remove("has-apply-bar");
  }, []);

  if (!job) return <Unavailable failed={failed} />;

  const target = applyTarget(job);
  const skills = skillsList(job);
  const salary = salaryText(job);
  const exp = experienceText(job);
  const location = locationLabel(job);
  const descriptionText = textLines(job.roleDescription).join(" ");

  return (
    <main className="container job-page">
      <SEO
        title={`${job.title} at ${job.organization} — ${location} | JobKhojo`}
        description={(descriptionText || `${job.title} at ${job.organization}, ${location}. ${jobTypeLabel(job)}${exp ? `, ${exp}` : ""}.`).slice(0, 158)}
        path={`/jobs/${job.slug}`}
        type="article"
      />
      <JsonLd data={jobPostingSchema(job)} />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Jobs", item: "https://jobkhojoai.com/jobs" },
          { "@type": "ListItem", position: 2, name: job.title, item: `https://jobkhojoai.com/jobs/${job.slug}` },
        ],
      }} />

      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link to="/jobs">Jobs</Link>
        <ChevronRight size={14} aria-hidden="true" />
        <span aria-current="page">{job.title}</span>
      </nav>

      <div className="job-layout">
        <article className="job-main">
          <header className="job-header">
            <CompanyAvatar name={job.organization} logoUrl={job.logoUrl} size={56} />
            <div className="job-header-text">
              <h1>{job.title}</h1>
              <p className="job-header-company">{job.organization}</p>
              <ul className="job-header-meta">
                <li><MapPin size={15} aria-hidden="true" />{location}</li>
                {!/remote/i.test(location) && <li><Laptop size={15} aria-hidden="true" />{workMode(job)}</li>}
                <li><Briefcase size={15} aria-hidden="true" />{jobTypeLabel(job)}{exp ? ` · ${exp}` : ""}</li>
                {salary && <li><Wallet size={15} aria-hidden="true" />{salary}</li>}
              </ul>
              <p className="job-header-posted" suppressHydrationWarning>
                <Clock size={14} aria-hidden="true" /> {postedLabel(job.createdAt)}
                {job.lastDate && <> · Apply by {formatDate(job.lastDate)}</>}
              </p>
            </div>
          </header>

          <div className="job-actions">
            <ApplyButton job={job} target={target} />
            <SaveJobButton job={job} />
            <ShareButton job={job} />
          </div>
          {target.note && <p className="apply-note">{target.note} JobKhojo doesn't collect applications.</p>}

          {skills.length > 0 && (
            <section className="job-section" aria-labelledby="skills-heading">
              <h2 id="skills-heading">Skills</h2>
              <ul className="chip-list">{skills.map(s => <li key={s} className="chip">{s}</li>)}</ul>
            </section>
          )}

          {textLines(job.roleDescription).length > 0 && (
            <section className="job-section" aria-labelledby="about-role">
              <h2 id="about-role">About the role</h2>
              <Paragraphs text={job.roleDescription} />
            </section>
          )}

          {textLines(job.responsibilities).length > 0 && (
            <section className="job-section" aria-labelledby="responsibilities">
              <h2 id="responsibilities">Responsibilities</h2>
              <Bullets text={job.responsibilities} />
            </section>
          )}

          {textLines(job.requirements).length > 0 && (
            <section className="job-section" aria-labelledby="requirements">
              <h2 id="requirements">Requirements</h2>
              <Bullets text={job.requirements} />
            </section>
          )}

          {textLines(job.aboutCompany).length > 0 && (
            <section className="job-section" aria-labelledby="about-company">
              <h2 id="about-company">About {job.organization}</h2>
              <Paragraphs text={job.aboutCompany} />
            </section>
          )}

          <section className="callout callout-warning" aria-labelledby="before-apply">
            <h2 id="before-apply"><ShieldAlert size={18} aria-hidden="true" /> Before you apply</h2>
            <ul>
              <li>Genuine employers don't charge fees for interviews, training, "registration" or offer letters.</li>
              <li>If anything feels off, check the company's own careers page first. <Link to="/career-guide/how-to-spot-fake-job-posts">How to spot a fake job</Link></li>
            </ul>
          </section>

          <div className="job-bottom-apply">
            <ApplyButton job={job} target={target} />
          </div>

          <div className="job-inline-ad">
            <AdSlot slot={AD_SLOTS.jobDetailMobileBanner} style={{ minHeight: 100 }} />
          </div>
        </article>

        <aside className="job-aside">
          <section className="panel" aria-labelledby="overview-heading">
            <h2 id="overview-heading">Job overview</h2>
            <dl className="facts">
              <Fact icon={CalendarDays} label="Posted"><span suppressHydrationWarning>{formatDate(job.createdAt)}</span></Fact>
              <Fact icon={Briefcase} label="Job type">{jobTypeLabel(job)}</Fact>
              <Fact icon={Laptop} label="Work mode">{workMode(job)}</Fact>
              <Fact icon={MapPin} label="Location">{location}</Fact>
              <Fact icon={Clock} label="Experience">{exp}</Fact>
              <Fact icon={GraduationCap} label="Education">{job.education}</Fact>
              <Fact icon={Wallet} label="Salary">{salary}</Fact>
              <Fact icon={Users} label="Openings">{job.vacancies}</Fact>
              <Fact icon={CalendarDays} label="Starts">{job.startDate ? formatDate(job.startDate) : null}</Fact>
              <Fact icon={CalendarDays} label="Apply by">{job.lastDate ? formatDate(job.lastDate) : null}</Fact>
              <Fact icon={Globe} label="Apply at">{target.host}</Fact>
            </dl>
          </section>

          {path && (
            <section className="panel panel-path" aria-labelledby="path-heading">
              <h2 id="path-heading"><RouteIcon size={18} aria-hidden="true" /> Preparing for this role?</h2>
              <p>The {path.title} career path lays out what to learn, in order, with project ideas.</p>
              <Link to={`/roadmap/${path.slug}`} className="link-arrow">View the {path.title} path →</Link>
            </section>
          )}

          <div className="job-aside-ad">
            <AdSlot slot={AD_SLOTS.jobDetailSidebar} style={{ width: 300, minHeight: 250 }} />
          </div>
        </aside>
      </div>

      {similar.length > 0 && (
        <section className="section" aria-labelledby="similar-heading">
          <div className="section-head section-head-row">
            <h2 id="similar-heading">Similar jobs</h2>
            <Link to="/jobs" className="link-arrow">All jobs →</Link>
          </div>
          <div className="job-list">
            {similar.map(j => <JobCard key={j._id} job={j} />)}
          </div>
        </section>
      )}

      <div className="apply-bar">
        <div className="apply-bar-text">
          <strong>{job.title}</strong>
          <span>{job.organization}</span>
        </div>
        <ApplyButton job={job} target={target} />
      </div>
    </main>
  );
}
