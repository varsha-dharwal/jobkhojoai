import { Link } from "react-router";
import { MapPin, Briefcase, Clock } from "lucide-react";
import CompanyAvatar from "./CompanyAvatar";
import SaveJobButton from "./SaveJobButton";
import { experienceText, jobTypeLabel, locationLabel, postedLabel, salaryText, skillsList, workMode } from "../lib/jobs";

// Scan order: title → company → where/how → experience/salary → skills → freshness.
export default function JobCard({ job, headingLevel = 3 }){
  const Heading = `h${headingLevel}`;
  const exp = experienceText(job);
  const salary = salaryText(job);
  const skills = skillsList(job, 4);
  const mode = workMode(job);
  const location = locationLabel(job);

  return (
    <article className="job-card">
      <CompanyAvatar name={job.organization} logoUrl={job.logoUrl} size={44} />
      <div className="job-card-body">
        <Heading className="job-card-title">
          <Link to={`/jobs/${job.slug}`} className="stretched-link">{job.title}</Link>
        </Heading>
        <p className="job-card-company">{job.organization}</p>
        <ul className="job-card-meta" aria-label="Job details">
          <li><MapPin size={14} aria-hidden="true" />{location}{mode === "Remote" && !/remote/i.test(location) ? " · Remote" : ""}</li>
          <li><Briefcase size={14} aria-hidden="true" />{jobTypeLabel(job)}{exp ? ` · ${exp}` : ""}</li>
          {salary && <li className="job-card-salary">{salary}</li>}
        </ul>
        {skills.length > 0 && (
          <ul className="chip-list" aria-label="Skills">
            {skills.map(s => <li key={s} className="chip">{s}</li>)}
          </ul>
        )}
      </div>
      <div className="job-card-aside">
        <span className="job-card-posted" suppressHydrationWarning>
          <Clock size={13} aria-hidden="true" />{postedLabel(job.createdAt).replace("Posted ", "")}
        </span>
        <SaveJobButton job={job} compact />
      </div>
    </article>
  );
}

// Compact vertical card for grids (homepage "Latest opportunities").
export function JobTile({ job }){
  const exp = experienceText(job);
  const skills = skillsList(job, 3);
  const location = locationLabel(job);
  const mode = workMode(job);
  return (
    <article className="job-tile">
      <div className="job-tile-head">
        <CompanyAvatar name={job.organization} logoUrl={job.logoUrl} size={44} />
        <div className="job-tile-text">
          <h3 className="job-tile-title">
            <Link to={`/jobs/${job.slug}`} className="stretched-link">{job.title}</Link>
          </h3>
          <p className="job-tile-company">{job.organization}</p>
          <ul className="job-tile-meta">
            <li><MapPin size={13} aria-hidden="true" /><span>{location}{mode === "Remote" && !/remote/i.test(location) ? " · Remote" : ""}</span></li>
            <li><Briefcase size={13} aria-hidden="true" /><span>{jobTypeLabel(job)}{exp && exp.length <= 14 ? ` · ${exp}` : mode === "On-site" ? " · On-site" : ""}</span></li>
          </ul>
        </div>
      </div>
      {skills.length > 0 && (
        <ul className="chip-list job-tile-skills" aria-label="Skills">
          {skills.map(s => <li key={s} className="chip chip-quiet">{s}</li>)}
        </ul>
      )}
      <div className="job-tile-foot">
        <span className="job-card-posted" suppressHydrationWarning>
          <Clock size={13} aria-hidden="true" />{postedLabel(job.createdAt).replace("Posted ", "")}
        </span>
        <SaveJobButton job={job} compact />
      </div>
    </article>
  );
}

export function JobCardSkeleton(){
  return (
    <div className="job-card job-card-skeleton" aria-hidden="true">
      <span className="skeleton skeleton-avatar" />
      <div className="job-card-body">
        <span className="skeleton" style={{ width: "55%", height: 16 }} />
        <span className="skeleton" style={{ width: "30%", height: 12 }} />
        <span className="skeleton" style={{ width: "70%", height: 12 }} />
      </div>
    </div>
  );
}
