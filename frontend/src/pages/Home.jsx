import { useEffect } from "react";
import { Form, Link, useLoaderData, useLocation, useNavigate } from "react-router";
import {
  ArrowRight, Search, MapPin, ChevronRight, CircleCheck, Link2, ShieldCheck, UserRound, GraduationCap,
  House, Building2, FileText, SquareArrowOutUpRight, Code2, Server, Layers, BarChart3, Palette, Cloud,
} from "lucide-react";
import SEO, { JsonLd, SITE_URL } from "../components/SEO";
import { JobTile } from "../components/JobCard";
import { fetchAllJobs, toListJob } from "../lib/api";
import { experienceLevel, isRemote } from "../lib/jobs";
import { guideMeta, readingMinutes } from "../lib/guides";
import { ROADMAPS } from "../data/roadmaps";
import { CAREER_GUIDE_ARTICLES } from "../data/careerGuides";
import { legacyJobsUrl } from "../lib/jobFilters";

const CITY_GROUPS = [
  { label: "Bengaluru", q: "bengaluru", re: /bangalore|bengaluru|benguluru/i },
  { label: "Hyderabad", q: "hyderabad", re: /hyderabad/i },
  { label: "Mumbai", q: "mumbai", re: /mumbai/i },
  { label: "Pune", q: "pune", re: /pune/i },
  { label: "Chennai", q: "chennai", re: /chennai/i },
  { label: "Delhi NCR", q: "noida", re: /delhi|noida|gurugram|gurgaon/i },
];

const FEATURED_PATHS = ["frontend", "backend", "full-stack", "data-science"];
const FEATURED_GUIDES = ["resume-guide-for-it-freshers", "how-to-spot-fake-job-posts", "internship-application-guide"];

// Runs at build time; every number on the page is counted from the real listings.
export async function loader(){
  const jobs = await fetchAllJobs();
  const count = test => jobs.filter(test).length;
  const topCity = CITY_GROUPS
    .map(c => ({ ...c, n: count(j => c.re.test(j.location || "")) }))
    .sort((a, b) => b.n - a.n)[0];
  return {
    latest: jobs.slice(0, 8).map(toListJob),
    total: jobs.length,
    browse: [
      { key: "fresher", to: "/jobs?exp=fresher", label: "Freshers", n: count(j => experienceLevel(j) === "fresher") },
      { key: "internship", to: "/jobs?type=internship", label: "Internships", n: count(j => j.category === "Internship") },
      { key: "remote", to: "/jobs?mode=remote", label: "Remote jobs", n: count(isRemote) },
      ...(topCity?.n ? [{ key: "city", to: `/jobs?location=${topCity.q}`, label: `Jobs in ${topCity.label}`, n: topCity.n }] : []),
    ].filter(t => t.n > 0).map(({ key, to, label, n }) => ({ key, to, label, n })),
    paths: FEATURED_PATHS.filter(slug => ROADMAPS[slug]).map(slug => ({ slug, title: ROADMAPS[slug].title, steps: ROADMAPS[slug].steps.length })),
    guides: FEATURED_GUIDES
      .map(slug => CAREER_GUIDE_ARTICLES.find(a => a.slug === slug))
      .filter(Boolean)
      .map(a => ({ slug: a.slug, title: a.title, summary: a.summary, minutes: readingMinutes(a) })),
  };
}

const ORG_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "JobKhojo",
  url: SITE_URL,
  logo: `${SITE_URL}/images/logo-mark.png`,
  sameAs: ["https://instagram.com/jobkhojoAI"],
};

const WEBSITE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "JobKhojo",
  url: SITE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}/jobs?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

const BROWSE_ICONS = { fresher: UserRound, internship: GraduationCap, remote: House, city: Building2 };
const PATH_ICONS = { frontend: Code2, backend: Server, "full-stack": Layers, "data-science": BarChart3, "ui-ux": Palette, cloud: Cloud };

const HERO_IMAGE = {
  srcSet: "/images/hero-candidate-560.webp 560w, /images/hero-candidate-1120.webp 1120w",
  sizes: "(min-width: 1300px) 600px, 46vw",
};

function SectionHead({ id, title, subtitle, link }){
  return (
    <div className="home-head">
      <div>
        <h2 id={id}>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {link && <Link to={link.to} className="link-arrow">{link.label} <ArrowRight size={16} aria-hidden="true" /></Link>}
    </div>
  );
}

export default function Home(){
  const { latest, total, browse, paths, guides } = useLoaderData();
  const location = useLocation();
  const navigate = useNavigate();

  // Old links pointed at "/?search=…#jobs" and "/#roadmaps" — send them to the new pages.
  useEffect(() => {
    const legacy = legacyJobsUrl(location.search, location.hash);
    if (legacy) navigate(legacy, { replace: true });
    else if (location.hash === "#roadmaps") navigate("/career-paths", { replace: true });
  }, [location.search, location.hash, navigate]);

  return (
    <main className="home">
      <SEO
        title="JobKhojo — Jobs & Internships for Freshers and Early-Career Professionals in India"
        description="Find fresh jobs and internships in software, IT, design, data and support roles. Clear job details, a direct link to apply, plus career paths and practical guides."
        path="/"
      />
      <JsonLd data={ORG_SCHEMA} />
      <JsonLd data={WEBSITE_SCHEMA} />
      <link rel="preload" as="image" type="image/webp" imageSrcSet={HERO_IMAGE.srcSet} imageSizes={HERO_IMAGE.sizes} media="(min-width: 900px)" fetchPriority="high" />

      <section className="home-hero">
        <div className="container home-hero-grid">
          <div className="home-hero-copy">
            <h1>Find your next <span>job or internship.</span></h1>
            <p className="home-hero-lead">
              Fresh opportunities in software, design, data and more — with clear information and direct links to apply at the source.
            </p>

            <Form method="get" action="/jobs" className="hero-search" role="search" aria-label="Search jobs">
              <label className="hero-search-field">
                <Search size={18} aria-hidden="true" />
                <span className="sr-only">Job title, skill or company</span>
                <input name="q" type="search" placeholder="Job title, skill or company" autoComplete="off" />
              </label>
              <div className="hero-search-row">
                <label className="hero-search-field">
                  <MapPin size={18} aria-hidden="true" />
                  <span className="sr-only">Location</span>
                  <input name="location" type="text" placeholder="City or remote" autoComplete="off" />
                </label>
                <button type="submit" className="btn btn-primary btn-lg">Search jobs <ArrowRight size={18} aria-hidden="true" /></button>
              </div>
            </Form>

            <ul className="hero-assurances">
              <li><CircleCheck size={20} aria-hidden="true" className="ico-success" /> Fresh listings</li>
              <li><Link2 size={20} aria-hidden="true" className="ico-brand" /> Direct application links</li>
              <li><ShieldCheck size={20} aria-hidden="true" className="ico-teal" /> No registration required</li>
            </ul>
          </div>

          <picture className="home-hero-art">
            <source media="(min-width: 900px)" srcSet={HERO_IMAGE.srcSet} sizes={HERO_IMAGE.sizes} type="image/webp" />
            <img
              src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
              alt=""
              width="600"
              height="361"
              fetchPriority="high"
              decoding="async"
            />
          </picture>
        </div>
      </section>

      <section className="home-section" aria-labelledby="latest-heading">
        <div className="container">
          <SectionHead
            id="latest-heading"
            title="Latest opportunities"
            subtitle="Recently added jobs and internships. Every listing links to the original application page."
            link={{ to: "/jobs", label: `View all ${total} jobs` }}
          />
          <div className="job-tile-grid">
            {latest.map(job => <JobTile key={job._id} job={job} />)}
          </div>
        </div>
      </section>

      {browse.length > 0 && (
        <section className="home-section home-band" aria-labelledby="browse-heading">
          <div className="container">
            <SectionHead
              id="browse-heading"
              title="Browse jobs"
              subtitle="Find opportunities that match where you are right now."
              link={{ to: "/jobs", label: "All jobs" }}
            />
            <ul className="link-card-grid">
              {browse.map(t => {
                const Icon = BROWSE_ICONS[t.key];
                return (
                  <li key={t.key}>
                    <Link to={t.to} className="link-card">
                      <span className={`link-card-icon tone-${t.key}`}><Icon size={20} aria-hidden="true" /></span>
                      <span className="link-card-text">
                        <span className="link-card-title">{t.label}</span>
                        <span className="link-card-meta">{t.n} {t.n === 1 ? "job" : "jobs"}</span>
                      </span>
                      <ChevronRight size={18} aria-hidden="true" className="link-card-chevron" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      )}

      <section className="home-section" aria-labelledby="how-heading">
        <div className="container">
          <SectionHead id="how-heading" title="How JobKhojo works" subtitle="Simple, transparent and safe — here's exactly what we do with every listing." />
          <ol className="how-steps">
            <li>
              <span className="how-num" aria-hidden="true">1</span>
              <div>
                <Search size={26} aria-hidden="true" className="how-icon" />
                <h3>We find openings</h3>
                <p>We collect openings from company career pages and public job boards, focusing on roles for freshers and early-career candidates.</p>
              </div>
            </li>
            <li>
              <span className="how-num" aria-hidden="true">2</span>
              <div>
                <FileText size={26} aria-hidden="true" className="how-icon" />
                <h3>We write them up</h3>
                <p>Each listing is added by hand with the role, requirements, location and experience in one consistent format.</p>
              </div>
            </li>
            <li>
              <span className="how-num" aria-hidden="true">3</span>
              <div>
                <SquareArrowOutUpRight size={26} aria-hidden="true" className="how-icon" />
                <h3>You apply at the source</h3>
                <p>We link you straight to the employer or job board's application page. We never collect applications or charge candidates.</p>
              </div>
            </li>
          </ol>
        </div>
      </section>

      <section className="home-section home-section-tight" aria-labelledby="paths-heading">
        <div className="container">
          <SectionHead
            id="paths-heading"
            title="Explore career paths"
            subtitle="Step-by-step guides to learn in-demand skills and build real projects."
            link={{ to: "/career-paths", label: "View all career paths" }}
          />
          <ul className="link-card-grid">
            {paths.map((p, i) => {
              const Icon = PATH_ICONS[p.slug] || Code2;
              return (
                <li key={p.slug}>
                  <Link to={`/roadmap/${p.slug}`} className="link-card">
                    <span className={`link-card-icon ${i % 2 ? "tone-teal" : "tone-blue"}`}><Icon size={20} aria-hidden="true" /></span>
                    <span className="link-card-text">
                      <span className="link-card-title">{p.title}</span>
                      <span className="link-card-meta">{p.steps} steps</span>
                    </span>
                    <ChevronRight size={18} aria-hidden="true" className="link-card-chevron" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="home-section home-section-tight" aria-labelledby="guides-heading">
        <div className="container">
          <SectionHead
            id="guides-heading"
            title="Career guides"
            subtitle="Practical advice on resumes, internships, interviews and staying safe while job hunting."
            link={{ to: "/career-insights", label: "View all guides" }}
          />
          <ul className="guide-media-grid">
            {guides.map(g => {
              const meta = guideMeta(g.slug);
              return (
                <li key={g.slug}>
                  <article className="guide-media-card">
                    {meta.image && (
                      <img src={meta.image.src} srcSet={meta.image.srcSet} sizes="150px" alt="" width="150" height="112" loading="lazy" decoding="async" />
                    )}
                    <div className="guide-media-body">
                      <span className="topic-tag">{meta.topic}</span>
                      <h3><Link to={`/career-guide/${g.slug}`} className="stretched-link">{g.title}</Link></h3>
                      <p>{g.summary}</p>
                      <span className="guide-media-meta">{g.minutes} min read</span>
                    </div>
                  </article>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="home-section home-section-last" aria-labelledby="safe-heading">
        <div className="container">
          <div className="safety-band">
            <ShieldCheck size={44} aria-hidden="true" className="safety-band-icon" />
            <div className="safety-band-text">
              <h2 id="safe-heading">Your job search should be simple and safe.</h2>
              <p>JobKhojo doesn't charge candidates for anything. We link you to the original source and review listings to help you avoid suspicious posts.</p>
            </div>
            <Link to="/job-verification-policy" className="btn btn-secondary btn-brand-outline">
              Learn how we review listings <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
