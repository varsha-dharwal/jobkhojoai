import { useEffect, useState } from "react";
import { useLocation, useSearchParams, Link } from "react-router-dom";
import { motion } from "motion/react";
import api from "../api/client";
import JobSlider from "../components/JobSlider";
import VideoBackground from "../components/VideoBackground";
import FAQSection from "../components/FAQSection";
import FeaturedCompanies from "../components/FeaturedCompanies";
import JobShelf from "../components/JobShelf";
import SkeletonCards from "../components/SkeletonCards";
import SEO, { SITE_URL } from "../components/SEO";
import { ROADMAP_CATEGORIES, ROADMAPS } from "../data/roadmaps";
import { SKILL_ROADMAP_CATEGORIES } from "../data/skillRoadmaps";
import { getJobCountry } from "../utils/jobCountry";
import { slugify } from "../utils/slugify";

const MotionTagLink = motion.create(Link);

function RoadmapCardIcon(){
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// One stacked, full-width block: a centered pill badge as the section label, then a
// 3-column grid of card-buttons — matches the roadmap.sh layout pattern (stacked
// groups of a card grid each), redone in jobkhojoAI's own dark/teal theme.
function RoadmapGridBlock({ badge, subtitle, items, hrefFor }){
  return (
    <div className="roadmap-grid-block">
      <div className="roadmap-grid-badge-row">
        <span className="roadmap-grid-badge">{badge}</span>
      </div>
      {subtitle && <p className="roadmap-grid-subtitle">{subtitle}</p>}
      <div className="roadmap-card-grid">
        {items.map((item, i) => (
          <MotionTagLink
            key={item.slug}
            to={hrefFor(item)}
            className="roadmap-card"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.3, delay: i * 0.03, ease: "easeOut" }}
            whileHover={{ borderColor: "var(--color-brand)", color: "var(--color-text-primary)" }}
          >
            <span>{item.label}</span>
            <RoadmapCardIcon />
          </MotionTagLink>
        ))}
      </div>
    </div>
  );
}

const ORG_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "jobkhojoAI",
  url: SITE_URL,
  logo: `${SITE_URL}/favicon.svg`,
  sameAs: ["https://instagram.com/jobkhojoAI"],
  areaServed: ["IN", "US"],
};

const WEBSITE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "jobkhojoAI",
  url: SITE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}/?search={search_term_string}#jobs`,
    "query-input": "required name=search_term_string",
  },
};

// Project Ideas pulls real project names straight out of each role roadmap's own
// "Projects" step (data/roadmaps.js) instead of duplicating fresh content — the anchor
// lets a click land directly on that step inside the full roadmap page.
const PROJECT_CATEGORIES = ROADMAP_CATEGORIES.map(r => {
  const projectsStep = ROADMAPS[r.slug]?.steps.find(s => s.topics?.[0]?.subject === "Projects");
  return projectsStep ? { slug: r.slug, label: r.label, anchor: slugify(projectsStep.title) } : null;
}).filter(Boolean);

// Extra filters driven by the header's search bar (date posted / on-site / experience
// level) aren't covered by the backend's category+remote params, so they're applied
// as a client-side pass on top of the fetched list, on top of whatever this page's own
// search/category/remote controls already narrowed down.
const EXPERIENCE_LEVEL_TESTS = {
  fresher: /fresh|entry|graduate|0\s*-?\s*1|intern/i,
  mid: /mid[\s-]?level|associate|\b[1-4]\+?\s*(years|yrs|yr)\b/i,
  senior: /senior|lead|principal|manager|\b[5-9]\+?\s*(years|yrs|yr)\b/i,
};
const DATE_POSTED_LIMITS_MS = { "24h": 864e5, week: 6048e5, month: 2592e6 };

export default function Home(){
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [category, setCategory] = useState("All");
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [search, setSearch] = useState("");
  const [companyFilter, setCompanyFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Header-only filters (see Navbar) — not shown as controls on this page, only applied.
  const [onsiteOnly, setOnsiteOnly] = useState(false);
  const [datePosted, setDatePosted] = useState("");
  const [experienceLevels, setExperienceLevels] = useState([]);
  const [country, setCountry] = useState("");

  // Sync filters from the URL — lets internal links (e.g. the header search, the FAQ,
  // or a Featured Companies tile) deep-link into a filtered view even when already on this page.
  useEffect(() => {
    const c = searchParams.get("category");
    setCategory(c === "Full-time" || c === "Part-time" || c === "Internship" ? c : "All");
    setRemoteOnly(searchParams.get("remote") === "true");
    setOnsiteOnly(searchParams.get("remote") === "false");
    setSearch(searchParams.get("search") || "");
    setCompanyFilter(searchParams.get("company") || "");
    setDatePosted(searchParams.get("datePosted") || "");
    setExperienceLevels((searchParams.get("experience") || "").split(",").filter(Boolean));
    setCountry(searchParams.get("country") || "");
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
    if (companyFilter) params.company = companyFilter;

    api.get("/jobs", { params })
      .then(res => setJobs(res.data))
      .catch(() => setError("Couldn't load jobs. Please try again in a moment."))
      .finally(() => setLoading(false));
  }, [category, remoteOnly, search, companyFilter]);

  const visibleJobs = jobs.filter(job => {
    if (onsiteOnly && job.remote) return false;
    // Remote jobs are shown for either region — only on-site jobs get filtered by country.
    if (country && !job.remote && getJobCountry(job) !== country) return false;
    if (experienceLevels.length){
      const text = `${job.experience || ""} ${job.title || ""}`;
      if (!experienceLevels.some(level => EXPERIENCE_LEVEL_TESTS[level].test(text))) return false;
    }
    if (datePosted && Date.now() - new Date(job.createdAt).getTime() > DATE_POSTED_LIMITS_MS[datePosted]) return false;
    return true;
  });

  return (
    <main className="container">
      <SEO
        title="jobkhojoAI — Tech Jobs & Internships in India & the USA"
        description="Daily updated Tech & IT job alerts across India and the USA — software jobs, internships, and remote-friendly roles for freshers and experienced professionals, all in one place."
        path="/"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBSITE_SCHEMA) }} />
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
        id="roadmaps"
        style={{marginBottom:"var(--space-12)", scrollMarginTop:90}}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="section-heading">
          <h2>Roadmaps &amp; Project Ideas</h2>
          <p>Pick a role, go deep on a skill, or grab a project idea — all mapped to what employers are hiring for right now.</p>
        </div>

        <RoadmapGridBlock
          badge="Role-based Roadmaps"
          subtitle="Tap a role to see its full career roadmap."
          items={ROADMAP_CATEGORIES}
          hrefFor={r => `/roadmap/${r.slug}`}
        />
        <RoadmapGridBlock
          badge="Skill-based Roadmaps"
          subtitle="Going deep on one skill? Start here."
          items={SKILL_ROADMAP_CATEGORIES}
          hrefFor={s => `/skill-roadmap/${s.slug}`}
        />
        <RoadmapGridBlock
          badge="Project Ideas"
          subtitle="Real build ideas, pulled straight from each roadmap."
          items={PROJECT_CATEGORIES}
          hrefFor={p => `/roadmap/${p.slug}#${p.anchor}`}
        />
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
          <h2 style={{margin:0}}>Latest Tech Jobs</h2>
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

        {companyFilter && (
          <div className="active-filter-chip">
            Showing jobs at <strong>{companyFilter}</strong>
            <button type="button" onClick={() => setCompanyFilter("")} aria-label={`Clear ${companyFilter} filter`}>×</button>
          </div>
        )}

        {country && (
          <div className="active-filter-chip">
            Showing <strong>{country}</strong> jobs (incl. remote)
            <button type="button" onClick={() => setCountry("")} aria-label={`Clear ${country} filter`}>×</button>
          </div>
        )}

        {loading && <SkeletonCards count={6} />}
        {error && <p style={{color:"var(--color-danger)"}} role="alert">{error}</p>}
        {!loading && !error && visibleJobs.length === 0 && (
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

        {visibleJobs.length > 0 && (
          <div style={{marginBottom:40}}>
            <JobSlider jobs={visibleJobs} />
          </div>
        )}
      </div>

      <FeaturedCompanies />

      <JobShelf
        title="Remote Jobs"
        subtitle="Fully remote tech roles you can do from anywhere."
        params={{ remote: "true" }}
        viewAllHref="/?remote=true#jobs"
      />

      <JobShelf
        title="Latest Internships"
        subtitle="Kickstart your tech career with these internship openings."
        params={{ category: "Internship" }}
        viewAllHref="/?category=Internship#jobs"
      />

      <FAQSection />
    </main>
  );
}
