import { useEffect, useState } from "react";
import { Link, useLoaderData } from "react-router";
import {
  ArrowUpRight, Share2, Check, MapPin, Briefcase, Clock, Wallet,
  CalendarDays, CalendarX, Globe, Laptop, Route as RouteIcon, ChevronRight, Building2, PenLine,
} from "lucide-react";
import SEO, { JsonLd } from "../components/SEO";
import CompanyAvatar from "../components/CompanyAvatar";
import SaveJobButton from "../components/SaveJobButton";
import JobCard from "../components/JobCard";
import AdSlot from "../components/AdSlot";
import { AD_SLOTS } from "../config/adsense";
import JobArticle from "../components/JobArticle";
import JobAlertModal from "../components/JobAlertModal";
import { JOB_ARTICLE_AUTHOR } from "../lib/site";
import { fetchAllJobs, fetchJob, toListJob } from "../lib/api";
import {
  applyTarget, experienceText, formatDate, isIndexableJob, jobPostingSchema, jobTypeLabel, locationLabel,
  noteBlocks, postedLabel, relatedPathSlug, salaryText, similarJobs, textLines, wasUpdated, workMode,
} from "../lib/jobs";
import { ROADMAPS } from "../data/roadmaps";
import { companyGuideForJob } from "../lib/content";

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
  const pathSlug = relatedPathSlug(job);
  return {
    job,
    similar: similarJobs(job, all).map(toListJob),
    path: pathSlug && ROADMAPS[pathSlug] ? { slug: pathSlug, title: ROADMAPS[pathSlug].title } : null,
  };
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
  const [shareUnavailable, setShareUnavailable] = useState(false);
  async function share(){
    setShareUnavailable(false);
    const url = `${window.location.origin}/jobs/${job.slug}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: `${job.title} at ${job.organization}`, url });
        return;
      } catch (error) {
        if (error?.name === "AbortError") return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch { setShareUnavailable(url); }
  }
  return (
    <>
      <button type="button" className="btn btn-secondary" onClick={share}>
        {copied ? <Check size={16} aria-hidden="true" /> : <Share2 size={16} aria-hidden="true" />}
        <span>{copied ? "Link copied" : "Share Job"}</span>
      </button>
      {shareUnavailable && <label className="share-status">Copy this link if sharing is unavailable:
        <input type="url" readOnly value={shareUnavailable} onFocus={event => event.target.select()} aria-label="Job page link to copy" />
      </label>}
    </>
  );
}

function ApplyButton({ className = "", onClick }){
  return (
    <button type="button" onClick={onClick} className={`btn btn-primary btn-lg ${className}`}>
      Apply Here <ArrowUpRight size={18} aria-hidden="true" />
    </button>
  );
}

function publicationTime(date){
  if (!date || Number.isNaN(new Date(date).getTime())) return "";
  return new Intl.DateTimeFormat("en-IN", { hour: "numeric", minute: "2-digit", hour12: true, timeZone: "Asia/Kolkata" }).format(new Date(date));
}

// JobKhojo's own write-up on the job: the original part of the page.
function EditorNote({ job }){
  const blocks = noteBlocks(job.editorNote);
  if (!blocks.length) return null;
  return (
    <section className="job-section editor-note" aria-labelledby="editor-note">
      <h2 id="editor-note"><PenLine size={18} aria-hidden="true" /> JobKhojo's note on this job</h2>
      <p className="editor-note-meta">
        Written by {JOB_ARTICLE_AUTHOR.name}
        {wasUpdated(job) && <> · <span suppressHydrationWarning>Updated {formatDate(job.updatedAt)}</span></>}
      </p>
      <div className="prose">
        {blocks.map((b, i) => b.type === "heading"
          ? <h3 key={i}>{b.text}</h3>
          : b.type === "list"
            ? <ul key={i} className="prose-list">{b.items.map((item, j) => <li key={j}>{item}</li>)}</ul>
            : <p key={i}>{b.text}</p>)}
      </div>
    </section>
  );
}

function ClosedNotice({ job }){
  return (
    <section className="callout closed-notice" aria-labelledby="closed-heading">
      <h2 id="closed-heading"><CalendarX size={18} aria-hidden="true" /> This job has closed</h2>
      <p>
        {job.lastDate ? <>Applications closed on <span suppressHydrationWarning>{formatDate(job.lastDate)}</span>. </> : "This listing is no longer accepting applications. "}
        The details below are kept for reference. Similar roles that are still open are listed further down.
      </p>
      <Link to="/jobs" className="btn btn-primary">Browse open jobs</Link>
    </section>
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
  const [showAlertModal, setShowAlertModal] = useState(false);

  // Keep the floating "Ask" button clear of the mobile sticky apply bar.
  const showApplyBar = !!job && !job.closed;
  useEffect(() => {
    if (!showApplyBar) return;
    document.documentElement.classList.add("has-apply-bar");
    return () => document.documentElement.classList.remove("has-apply-bar");
  }, [showApplyBar]);

  if (!job) return <Unavailable failed={failed} />;

  const target = applyTarget(job);
  const salary = salaryText(job);
  const exp = experienceText(job);
  const location = locationLabel(job);
  const descriptionText = textLines(job.roleDescription).join(" ");
  const validCreatedAt = job.createdAt && !Number.isNaN(new Date(job.createdAt).getTime());
  const publishedDate = validCreatedAt ? formatDate(job.createdAt) : "";
  const publishedTime = validCreatedAt ? publicationTime(job.createdAt) : "";
  const closed = !!job.closed;
  // Only jobs with JobKhojo's own note are offered to search engines.
  const indexable = isIndexableJob(job);
  const companyPage = companyGuideForJob(job);

  return (
    <>
    <main className="container job-page">
      <SEO
        title={`${job.title} at ${job.organization} — ${location} | JobKhojo`}
        description={(descriptionText || `${job.title} at ${job.organization}, ${location}. ${jobTypeLabel(job)}${exp ? `, ${exp}` : ""}.`).slice(0, 158)}
        path={`/jobs/${job.slug}`}
        type="article"
        noindex={!indexable}
      />
      {indexable && <JsonLd data={jobPostingSchema(job)} />}
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
              {JOB_ARTICLE_AUTHOR?.name && <p className="job-byline">
                By {JOB_ARTICLE_AUTHOR.name}
                {publishedDate && <> <span aria-hidden="true">·</span> {publishedDate}</>}
                {publishedTime && <> <span aria-hidden="true">·</span> {publishedTime}</>}
              </p>}
              <p className="job-header-company">{job.organization}</p>
              <ul className="job-header-meta">
                <li><MapPin size={15} aria-hidden="true" />{location}</li>
                {!/remote/i.test(location) && <li><Laptop size={15} aria-hidden="true" />{workMode(job)}</li>}
                <li><Briefcase size={15} aria-hidden="true" />{jobTypeLabel(job)}{exp ? ` · ${exp}` : ""}</li>
                {salary && <li><Wallet size={15} aria-hidden="true" />{salary}</li>}
              </ul>
              {(publishedDate || job.lastDate) && <p className="job-header-posted" suppressHydrationWarning>
                {publishedDate && <><Clock size={14} aria-hidden="true" /> {postedLabel(job.createdAt)}</>}
                {wasUpdated(job) && <> | Updated {formatDate(job.updatedAt)}</>}
                {job.lastDate && !closed && <>{publishedDate ? " | " : ""}Apply by {formatDate(job.lastDate)}</>}
              </p>}
            </div>
          </header>

          {closed && <ClosedNotice job={job} />}
          <EditorNote job={job} />

          <JobArticle job={job} relatedJobs={similar} path={path} />

          <div className="job-inline-ad">
            <AdSlot slot={AD_SLOTS.jobDetailMobileBanner} style={{ minHeight: 100 }} />
          </div>
        </article>

        <aside className="job-aside">
          <section className="panel job-action-panel" aria-label="Job actions">
            <ApplyButton onClick={() => setShowAlertModal(true)} />
            <div className="job-action-secondary">
              <SaveJobButton job={job} />
              <ShareButton job={job} />
            </div>
            {target.note && <p className="apply-note">{target.note} JobKhojo doesn't collect applications.</p>}
          </section>

          <section className="panel job-overview-panel" aria-labelledby="overview-heading">
            <h2 id="overview-heading">Job overview</h2>
            <dl className="facts">
              <Fact icon={CalendarDays} label="Posted">{publishedDate ? <span suppressHydrationWarning>{publishedDate}</span> : null}</Fact>
              <Fact icon={CalendarDays} label="Updated">{wasUpdated(job) ? <span suppressHydrationWarning>{formatDate(job.updatedAt)}</span> : null}</Fact>
              {closed && <Fact icon={CalendarX} label="Status">Closed</Fact>}
              <Fact icon={Briefcase} label="Job type">{jobTypeLabel(job)}</Fact>
              <Fact icon={Laptop} label="Work mode">{workMode(job)}</Fact>
              <Fact icon={MapPin} label="Location">{location}</Fact>
              <Fact icon={Clock} label="Experience">{exp}</Fact>
              <Fact icon={Globe} label="Apply at">{target.host}</Fact>
            </dl>
          </section>

          {companyPage && (
            <section className="panel panel-path" aria-labelledby="company-guide-heading">
              <h2 id="company-guide-heading"><Building2 size={18} aria-hidden="true" /> How {companyPage.name} hires</h2>
              <p>Eligibility, selection rounds and how to prepare, in our {companyPage.name} hiring guide.</p>
              <Link to={`/companies/${companyPage.slug}`} className="link-arrow">Read the {companyPage.name} guide →</Link>
            </section>
          )}

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
            <h2 id="similar-heading">{closed ? "Similar jobs that are still open" : "Similar jobs"}</h2>
            <Link to="/jobs" className="link-arrow">All jobs →</Link>
          </div>
          <div className="job-list">
            {similar.map(j => <JobCard key={j._id} job={j} />)}
          </div>
        </section>
      )}

      {!closed && (
        <div className="apply-bar">
          <div className="apply-bar-text">
            <strong>{job.title}</strong>
            <span>{job.organization}</span>
          </div>
          <ApplyButton onClick={() => setShowAlertModal(true)} />
        </div>
      )}
      {showAlertModal && <JobAlertModal onClose={() => setShowAlertModal(false)} onApply={() => window.location.assign(job.applyLink)} />}
    </main>
    </>
  );
}
