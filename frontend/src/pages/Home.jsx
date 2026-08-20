import { useEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import api from "../api/client";
import JobCard from "../components/JobCard";
import VideoBackground from "../components/VideoBackground";
import FAQSection from "../components/FAQSection";

const FEATURES = [
  {
    title: "Verified Tech Jobs",
    body: "We only list real IT & software roles — no spam, no fake postings, just genuine tech opportunities.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none"><path d="M9 12.5 11 14.5 15.5 10M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
    ),
  },
  {
    title: "Fresher + Experienced Friendly",
    body: "From your first internship to a senior engineering role — jobkhojoAI covers every stage of a tech career.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none"><path d="M16 11a4 4 0 1 0-8 0 4 4 0 0 0 8 0ZM4 21a8 8 0 0 1 16 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
    ),
  },
  {
    title: "Remote & WFH Ready",
    body: "Filter for work-from-home and remote-friendly roles so you can find tech jobs that fit your life.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none"><path d="M3 11.5 12 4l9 7.5M5.5 10v9a1 1 0 0 0 1 1H9v-5.5h6V20h2.5a1 1 0 0 0 1-1v-9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
    ),
  },
];

const JOB_ROLES = [
  "Software Engineer", "Full Stack Developer", "Data Scientist", "DevOps Engineer",
  "Cloud Architect", "QA / Automation Engineer", "UI/UX Designer", "Product Manager",
  "Technical Support", "Mobile App Developer",
];

const SKILLS = [
  "React.js", "Node.js", "Python", "AWS", "Docker", "Java", "TypeScript",
  "SQL", "MongoDB", "Next.js", "Git", "REST APIs",
];

export default function Home(){
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [category, setCategory] = useState("All");
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Sync filters from the URL — lets internal links (e.g. from the FAQ) deep-link
  // into a filtered view even when already on this page (no component remount).
  useEffect(() => {
    const c = searchParams.get("category");
    setCategory(c === "Full-time" || c === "Part-time" || c === "Internship" ? c : "All");
    setRemoteOnly(searchParams.get("remote") === "true");
  }, [searchParams]);

  useEffect(() => {
    if (location.hash === "#jobs") {
      document.getElementById("jobs")?.scrollIntoView({ behavior: "smooth" });
    }
  }, [location]);

  useEffect(() => {
    setLoading(true);
    setError("");
    const params = {};
    if (category !== "All") params.category = category;
    if (remoteOnly) params.remote = "true";
    if (search) params.search = search;

    api.get("/jobs", { params })
      .then(res => setJobs(res.data))
      .catch(() => setError("Couldn't load jobs. Please try again in a moment."))
      .finally(() => setLoading(false));
  }, [category, remoteOnly, search]);

  return (
    <main className="container">
      <motion.section
        className="hero video-section"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <VideoBackground src="/videos/hero-bg.mp4" />
        <div className="video-section-content">
          <span className="hero-eyebrow"><span className="dot" aria-hidden="true" /> Tech Jobs & Internships</span>
          <h1>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.15, ease: "easeOut" }}
            >
              Launch Your Tech Career
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.35, ease: "easeOut" }}
            >
              Into The <span className="accent">Future</span>
            </motion.span>
          </h1>
          <p style={{color:"var(--color-text-secondary)"}}>
            Fresh IT & software job updates, internships, and remote-friendly roles for freshers and
            experienced tech talent — all in one place.
          </p>
          <a href="#jobs" className="btn btn-primary">Browse Jobs</a>
        </div>
      </motion.section>

      <motion.section
        style={{marginBottom:"var(--space-12)"}}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="section-heading">
          <h2>Why jobkhojoAI</h2>
          <p>Built to make finding your next tech role fast, honest, and genuinely useful.</p>
        </div>
        <div className="feature-grid">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              className="card feature-card"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.08, ease: "easeOut" }}
            >
              <div className="feature-icon" aria-hidden="true">{f.icon}</div>
              <h3 style={{margin:"0 0 8px", fontSize:17}}>{f.title}</h3>
              <p style={{margin:0, color:"var(--color-text-secondary)", fontSize:14, lineHeight:1.6}}>{f.body}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <motion.section
        style={{marginBottom:"var(--space-12)"}}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="section-heading">
          <h2>Trending Tech Roles &amp; Skills</h2>
          <p>The IT job titles and skills employers are hiring for right now.</p>
        </div>
        <div className="tag-columns">
          <div>
            <h3 style={{fontSize:14, textTransform:"uppercase", letterSpacing:.5, color:"var(--color-text-tertiary)", marginBottom:16}}>Popular Job Roles</h3>
            <div className="tag-pill-group">
              {JOB_ROLES.map((r, i) => (
                <motion.span
                  key={r}
                  className="tag-pill"
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.3, delay: i * 0.04, ease: "easeOut" }}
                  whileHover={{ scale: 1.06, borderColor: "var(--color-brand)", color: "var(--color-text-primary)" }}
                >
                  {r}
                </motion.span>
              ))}
            </div>
          </div>
          <div>
            <h3 style={{fontSize:14, textTransform:"uppercase", letterSpacing:.5, color:"var(--color-text-tertiary)", marginBottom:16}}>High-Demand Skills</h3>
            <div className="tag-pill-group">
              {SKILLS.map((s, i) => (
                <motion.span
                  key={s}
                  className="tag-pill"
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.3, delay: i * 0.04, ease: "easeOut" }}
                  whileHover={{ scale: 1.06, borderColor: "var(--color-brand)", color: "var(--color-text-primary)" }}
                >
                  {s}
                </motion.span>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      <div id="jobs">
        <motion.div
          className="section-heading"
          style={{textAlign:"left", margin:"0 0 24px"}}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <h2 style={{margin:0}}>Latest Job Openings</h2>
        </motion.div>

        <motion.section
          className="filter-bar"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{marginBottom:24}}
        >
          <input
            type="search"
            aria-label="Search jobs"
            placeholder="Search by title, skill, or company"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <div role="group" aria-label="Filter jobs by category" className="filter-pills">
            {["All","Full-time","Part-time","Internship"].map(c => (
              <motion.button
                key={c}
                type="button"
                aria-pressed={c === category}
                className={c === category ? "btn btn-primary" : "btn btn-ghost"}
                onClick={() => setCategory(c)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
              >
                {c}
              </motion.button>
            ))}
            <motion.button
              type="button"
              aria-pressed={remoteOnly}
              className={remoteOnly ? "btn btn-primary" : "btn btn-ghost"}
              onClick={() => setRemoteOnly(r => !r)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              Remote only
            </motion.button>
          </div>
        </motion.section>

        {loading && <p style={{color:"var(--color-text-tertiary)"}} role="status">Loading jobs…</p>}
        {error && <p style={{color:"var(--color-danger)"}} role="alert">{error}</p>}
        {!loading && !error && jobs.length === 0 && (
          <motion.div className="empty-state" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M4 7.5 12 3l8 4.5v9L12 21l-8-4.5v-9Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
              <path d="M4 7.5 12 12m0 0 8-4.5M12 12v9" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
            </svg>
            <div>
              <strong style={{color:"var(--color-text-secondary)", display:"block", marginBottom:4}}>No jobs match this filter yet</strong>
              Try a different category, or check back soon — new listings go up daily.
            </div>
          </motion.div>
        )}

        <AnimatePresence mode="popLayout">
          {jobs.length > 0 && (
            <div className="jobs-grid" style={{marginBottom:40}}>
              {jobs.map((job, i) => <JobCard key={job._id} job={job} index={i} />)}
            </div>
          )}
        </AnimatePresence>
      </div>

      <FAQSection />
    </main>
  );
}
