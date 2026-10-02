import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Bookmark } from "lucide-react";
import JobCard from "../components/JobCard";
import SEO from "../components/SEO";
import { getSavedJobs, onSavedJobsChange } from "../utils/savedJobs";

export default function SavedJobs(){
  const [jobs, setJobs] = useState(null);

  useEffect(() => {
    setJobs(getSavedJobs());
    return onSavedJobsChange(() => setJobs(getSavedJobs()));
  }, []);

  return (
    <main className="container doc-page doc-page-wide">
      <SEO title="Saved jobs | JobKhojo" description="Jobs you've saved on JobKhojo." path="/saved-jobs" noindex />
      <header className="doc-head">
        <h1>Saved jobs</h1>
        <p className="lead">Saved on this device. Listings may close — open a job to check it's still available.</p>
      </header>

      {jobs && jobs.length === 0 && (
        <div className="empty-state">
          <Bookmark size={28} aria-hidden="true" />
          <h2>No saved jobs yet</h2>
          <p>Use the bookmark on any job to keep it here for later.</p>
          <Link to="/jobs" className="btn btn-primary">Browse jobs</Link>
        </div>
      )}
      {jobs && jobs.length > 0 && (
        <div className="job-list">
          {jobs.map(job => <JobCard key={job._id} job={job} headingLevel={2} />)}
        </div>
      )}
    </main>
  );
}
