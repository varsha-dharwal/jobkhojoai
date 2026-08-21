import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import api from "../api/client";
import JobCard from "./JobCard";
import SkeletonCards from "./SkeletonCards";

export default function JobShelf({ title, subtitle, params, viewAllHref }){
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get("/jobs", { params: { ...params, limit: 4 } })
      .then(res => setJobs(res.data))
      .catch(() => setJobs([]))
      .finally(() => setLoading(false));
    // params is a fixed object per usage site — this shelf never re-queries with different filters
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!loading && jobs.length === 0) return null;

  return (
    <motion.section
      style={{ marginBottom: "var(--space-12)" }}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="shelf-heading">
        <div>
          <h2>{title}</h2>
          {subtitle && <p>{subtitle}</p>}
        </div>
        <Link to={viewAllHref} className="shelf-view-all">View all →</Link>
      </div>
      {loading ? <SkeletonCards count={4} /> : (
        <div className="jobs-grid">
          {jobs.map((job, i) => <JobCard key={job._id} job={job} index={i} />)}
        </div>
      )}
    </motion.section>
  );
}
