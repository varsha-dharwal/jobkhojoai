import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams, Link } from "react-router-dom";
import { motion } from "motion/react";
import api from "../api/client";
import FAQSection from "../components/FAQSection";
import SEO, { SITE_URL } from "../components/SEO";
import { ROADMAP_CATEGORIES, ROADMAPS } from "../data/roadmaps";
import { SKILL_ROADMAP_CATEGORIES } from "../data/skillRoadmaps";
import { getJobCountry } from "../utils/jobCountry";
import { slugify } from "../utils/slugify";
import { timeAgo } from "../utils/timeAgo";

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
            animate={{ opacity: 1, y: 0 }}
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

function JobSearchBar({ search, locationQuery, onSearch }){
  const [title, setTitle] = useState(search);
  const [place, setPlace] = useState(locationQuery);

  useEffect(() => {
    setTitle(search);
    setPlace(locationQuery);
  }, [search, locationQuery]);

  function submit(e){
    e.preventDefault();
    onSearch({ search: title.trim(), location: place.trim() });
  }

  return (
    <section className="home-search" aria-label="Find jobs">
      <form className="home-search-form" onSubmit={submit}>
        <label className="home-search-field">
          <SearchFieldIcon type="search" />
          <span className="sr-only">Job title, skills, or company</span>
          <input type="search" placeholder="Job title, skills, or company" value={title} onChange={e => setTitle(e.target.value)} />
        </label>
        <label className="home-search-field">
          <SearchFieldIcon type="location" />
          <span className="sr-only">Location</span>
          <input type="search" placeholder="City, state, or remote" value={place} onChange={e => setPlace(e.target.value)} />
        </label>
        <button type="submit" className="home-search-submit">Find jobs</button>
      </form>
    </section>
  );
}

function SearchFieldIcon({ type }){
  return type === "location" ? (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" stroke="currentColor" strokeWidth="1.8"/><circle cx="12" cy="10" r="2.2" stroke="currentColor" strokeWidth="1.8"/></svg>
  ) : (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" strokeWidth="1.8"/><path d="m16 16 5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
  );
}

function BannerIcon({ type }){
  const icons = {
    bookmark: <path d="M6 4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v16l-6-3.5L6 20V4Z" />,
    dislike: <><path d="M7 4h11v10H8l-3 3V4h2Z" /><path d="M11 14v4l2 3 2-1-1-6" /></>,
    share: <><path d="M12 15V3" /><path d="m8 7 4-4 4 4" /><path d="M5 13v7h14v-7" /></>,
    pay: <><rect x="3" y="6" width="18" height="12" rx="2" /><circle cx="12" cy="12" r="2.5" /><path d="M6 9h.01M18 15h.01" /></>,
    type: <><path d="M4 8h16v11H4z" /><path d="M8 8V5h8v3M2 12h20" /></>,
  };
  return <svg className="banner-icon" width="23" height="23" viewBox="0 0 24 24" fill="none" aria-hidden="true" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{icons[type]}</svg>;
}

function formatPay(job){
  if (!job || (!job.salaryMin && !job.salaryMax)) return "";
  if (job.salaryMin || job.salaryMax) return `${job.salaryMin || ""}${job.salaryMin && job.salaryMax ? " - " : ""}${job.salaryMax || ""}`;
  return "";
}

function JobBanner({ jobs, loading }){
  const [selectedId, setSelectedId] = useState(jobs[0]?._id || "");
  const featured = jobs.find(job => job._id === selectedId) || jobs[0];
  const suggestions = jobs;

  useEffect(() => {
    if (!jobs.some(job => job._id === selectedId)) setSelectedId(jobs[0]?._id || "");
  }, [jobs, selectedId]);

  return (
    <motion.section
      id="jobs"
      className="job-banner"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="job-banner-list">
        <div className="job-banner-welcome">
          <h1>Welcome, Varsha</h1>
          <span className="job-banner-salary">▣ ₹6L / yr</span>
        </div>
        <h2>Jobs for you</h2>
        {loading && <div className="job-banner-skeleton">Finding matching jobs...</div>}
        {!loading && suggestions.length === 0 && <div className="job-banner-skeleton">No matching jobs found yet.</div>}
        <div className="job-banner-feed">
        {suggestions.map(job => (
          <button type="button" className={`job-banner-card ${featured?._id === job._id ? "is-selected" : ""}`} key={job._id} onClick={() => setSelectedId(job._id)}>
            <span className="job-banner-badge">{job.remote ? "Remote" : "Easily apply"}</span>
            <strong>{job.title}</strong>
            <span>{job.organization}</span>
            <span>{job.location || "Location flexible"}</span>
            {(formatPay(job) || job.category) && <em>{formatPay(job)}{formatPay(job) && job.category ? " · " : ""}{job.category}</em>}
            <small>Updated {timeAgo(job.updatedAt || job.createdAt)}</small>
          </button>
        ))}
        </div>
      </div>

      <div className="job-banner-detail">
        {featured ? (
          <>
            <div className="job-banner-detail-head">
              <p className="job-banner-kicker">Recommended for you</p>
              <h2>{featured.title}</h2>
              <a href={featured.applyLink || "#jobs"} target={featured.applyLink ? "_blank" : undefined} rel={featured.applyLink ? "noreferrer" : undefined}>{featured.organization} ↗</a>
              <p>{featured.location || (featured.remote ? "Remote" : "Location flexible")}</p>
              <p className="job-banner-updated">Updated {timeAgo(featured.updatedAt || featured.createdAt)}</p>
              {(formatPay(featured) || featured.category) && <p className="job-banner-pay">{formatPay(featured)}{formatPay(featured) && featured.category ? " · " : ""}{featured.category}</p>}
              <div className="job-banner-actions">
                <Link className="job-banner-apply" to={`/jobs/${featured.slug}`}>Get full detail</Link>
                <button type="button" aria-label="Save job" title="Save job"><BannerIcon type="bookmark" /></button>
                <button type="button" aria-label="Not interested" title="Not interested"><BannerIcon type="dislike" /></button>
                <button type="button" aria-label="Share job" title="Share job"><BannerIcon type="share" /></button>
              </div>
            </div>
            <div className="job-banner-details">
              <h3>Job details</h3>
              <p>Here&apos;s how this job aligns with your profile.</p>
              {formatPay(featured) && <div className="job-banner-detail-row"><BannerIcon type="pay" /><div><strong>Pay</strong><span><BannerIcon type="pay" /> {formatPay(featured)}</span></div></div>}
              <div className="job-banner-detail-row"><BannerIcon type="type" /><div><strong>Job type</strong><span><BannerIcon type="type" /> {featured.category || "Full-time"}</span></div></div>
            </div>
          </>
        ) : (
          <div className="job-banner-empty">Your personalized job details will appear here.</div>
        )}
      </div>
    </motion.section>
  );
}

export default function Home(){
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [category, setCategory] = useState("All");
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [search, setSearch] = useState("");
  const [companyFilter, setCompanyFilter] = useState("");
  const [loading, setLoading] = useState(true);

  // Header-only filters (see Navbar) — not shown as controls on this page, only applied.
  const [onsiteOnly, setOnsiteOnly] = useState(false);
  const [datePosted, setDatePosted] = useState("");
  const [experienceLevels, setExperienceLevels] = useState([]);
  const [country, setCountry] = useState("");
  const locationQuery = searchParams.get("location") || "";

  // Sync filters from the URL so header and FAQ links can deep-link into filtered jobs.
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
    const params = {};
    if (category !== "All") params.category = category;
    if (remoteOnly) params.remote = "true";
    if (search) params.search = search;
    if (companyFilter) params.company = companyFilter;

    api.get("/jobs", { params })
      .then(res => setJobs(res.data))
      .catch(() => setJobs([]))
      .finally(() => setLoading(false));
  }, [category, remoteOnly, search, companyFilter]);

  const visibleJobs = jobs.filter(job => {
    if (onsiteOnly && job.remote) return false;
    // Remote roles are shown for either region; only on-site jobs get filtered by country.
    if (country && !job.remote && getJobCountry(job) !== country) return false;
    if (experienceLevels.length){
      const text = `${job.experience || ""} ${job.title || ""}`;
      if (!experienceLevels.some(level => EXPERIENCE_LEVEL_TESTS[level].test(text))) return false;
    }
    if (datePosted && Date.now() - new Date(job.createdAt).getTime() > DATE_POSTED_LIMITS_MS[datePosted]) return false;
    if (locationQuery && !job.remote && !String(job.location || "").toLowerCase().includes(locationQuery.toLowerCase())) return false;
    return true;
  });

  function submitHomeSearch(values){
    const params = new URLSearchParams(searchParams);
    ["search", "location"].forEach(key => {
      if (values[key]) params.set(key, values[key]);
      else params.delete(key);
    });
    navigate(`/?${params.toString()}#jobs`);
  }

  return (
    <main className="container">
      <SEO
        title="Tech Jobs & Internships | jobkhojoAI"
        description="Find verified tech jobs, internships, and remote-friendly roles in India and the USA. Explore career roadmaps, job alerts, and practical hiring advice on jobkhojoAI."
        path="/"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBSITE_SCHEMA) }} />
      <JobSearchBar search={search} locationQuery={locationQuery} onSearch={submitHomeSearch} />
      <JobBanner jobs={visibleJobs} loading={loading} />

      <motion.section
        id="roadmaps"
        style={{marginBottom:"var(--space-12)", scrollMarginTop:90}}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="section-heading">
          <h2>Career Roadmaps, Interview Prep &amp; Hiring Guides</h2>
          <p>Choose a career path, follow a learning roadmap, and read original articles that help job seekers improve application quality and interview readiness.</p>
        </div>

        <div className="roadmap-grid-block" style={{ marginBottom: 24 }}>
          <div className="roadmap-grid-badge-row">
            <span className="roadmap-grid-badge">Original Articles</span>
          </div>
          <p className="roadmap-grid-subtitle" style={{ marginTop: 12, marginBottom: 18 }}>
            Practical career advice for job seekers, freshers, and hiring-ready professionals.
          </p>
          <div className="roadmap-card-grid">
            {[
              { slug: "frontend-developer-roadmap-2026", label: "Frontend Developer Roadmap 2026" },
              { slug: "react-developer-interview-preparation", label: "React Interview Prep" },
              { slug: "how-to-spot-fake-job-posts", label: "How to Spot Fake Job Posts" },
            ].map((item, i) => (
              <Link key={item.slug} to={`/career-guide/${item.slug}`} className="roadmap-card" style={{ opacity: 1, transform: "none" }}>
                <span>{item.label}</span>
                <RoadmapCardIcon />
              </Link>
            ))}
          </div>
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

      <FAQSection />
    </main>
  );
}
