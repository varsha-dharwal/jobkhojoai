import { Link } from "react-router-dom";
import { motion } from "motion/react";
import CompanyAvatar from "./CompanyAvatar";
import { timeAgo } from "../utils/timeAgo";

const MotionLink = motion.create(Link);

export default function JobCard({ job, index = 0 }){
  return (
    <MotionLink
      to={`/jobs/${job.slug}`}
      className="card"
      style={{display:"flex", gap:14, padding:20}}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3), ease: "easeOut" }}
      whileHover={{ y: -4, transition: { duration: 0.15 } }}
      whileTap={{ scale: 0.98 }}
    >
      <CompanyAvatar name={job.organization} logoUrl={job.logoUrl} />
      <div style={{flex:1, minWidth:0}}>
        <h3 style={{margin:"0 0 2px", fontSize:17, fontWeight:700}}>{job.title}</h3>
        <p style={{margin:"0 0 8px", color:"var(--color-text-secondary)", fontSize:14, fontWeight:600}}>{job.organization}</p>
        <p style={{margin:"0 0 12px", color:"var(--color-text-tertiary)", fontSize:13}}>
          {job.category} · {job.location} ({job.remote ? "Remote" : "On-site"})
          {job.experience && <> · {job.experience}</>} · {timeAgo(job.createdAt)}
        </p>
        {job.status === "active" && (
          <span className="status-pill"><span className="dot" aria-hidden="true" /> Actively Recruiting</span>
        )}
      </div>
    </MotionLink>
  );
}
