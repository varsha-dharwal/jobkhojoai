import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import JobCard from "../components/JobCard";
import SEO from "../components/SEO";
import { getSavedJobs, onSavedJobsChange } from "../utils/savedJobs";

export default function SavedJobs(){
  const [jobs, setJobs] = useState(getSavedJobs());

  useEffect(() => onSavedJobsChange(() => setJobs(getSavedJobs())), []);

  return (
    <main className="container" style={{paddingTop:32, paddingBottom:60}}>
      <SEO title="Saved Jobs | jobkhojoAI" description="Jobs you've saved on jobkhojoAI." path="/saved-jobs" noindex />
      <div className="section-heading" style={{textAlign:"left", margin:"0 0 24px"}}>
        <h2 style={{margin:0}}>Saved Jobs</h2>
        <p>Jobs you've bookmarked, saved on this device.</p>
      </div>

      {jobs.length === 0 ? (
        <div className="empty-state">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 3.5h12a1 1 0 0 1 1 1V21l-7-4-7 4V4.5a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
          </svg>
          <div>
            <strong style={{color:"var(--color-text-secondary)", display:"block", marginBottom:4}}>No saved jobs yet</strong>
            Tap "Save Job" on any listing to bookmark it for later.
          </div>
          <Link to="/" className="btn btn-primary" style={{marginTop:16}}>Browse Jobs</Link>
        </div>
      ) : (
        <div className="jobs-grid">
          {jobs.map((job, i) => <JobCard key={job._id} job={job} index={i} />)}
        </div>
      )}
    </main>
  );
}
