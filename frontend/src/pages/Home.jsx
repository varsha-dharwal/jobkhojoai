import { useEffect, useState } from "react";
import { Form, Link, useLoaderData, useLocation, useNavigate } from "react-router";
import {
  ArrowRight, Search, MapPin, ChevronRight, CircleCheck, Link2, ShieldCheck,
  FileText, SquareArrowOutUpRight, Code2, Server, Layers, BarChart3, Palette, Cloud,
} from "lucide-react";
import SEO, { JsonLd, SITE_URL } from "../components/SEO";
import { fetchAllJobs, fetchCurrentJobs, toListJob } from "../lib/api";
import { experienceLevel, isRemote } from "../lib/jobs";
import { guideMeta, readingMinutes } from "../lib/guides";
import { ROADMAPS } from "../data/roadmaps";
import { CAREER_GUIDE_ARTICLES } from "../data/careerGuides";
import { legacyJobsUrl } from "../lib/jobFilters";

const FEATURED_PATHS = ["frontend", "backend", "full-stack", "data-science"];
const FEATURED_GUIDES = ["resume-guide-for-it-freshers", "how-to-spot-fake-job-posts", "internship-application-guide"];

function makeJobSections(jobs){
  const newestJobs = jobs.map(toListJob).sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  return [
    {
      key: "tech", title: "Tech Jobs", to: "/jobs",
      listings: newestJobs.filter(j => /software|developer|engineer|data|\bit\b|web|cloud|ai|machine learning|qa|tester|security|technical|javascript|react|python|java/i.test(`${j.title || ""} ${j.skills || ""}`)).slice(0, 10),
    },
    { key: "remote", title: "Remote Jobs", to: "/jobs?mode=remote", listings: newestJobs.filter(isRemote).slice(0, 10) },
    { key: "fresher", title: "Fresher & Internships", to: "/jobs?exp=fresher", listings: newestJobs.filter(j => experienceLevel(j) === "fresher" || j.category === "Internship").slice(0, 10) },
    {
      key: "tech-news", title: "AI & Latest Tech News", to: "/career-insights", isArticle: true,
      listings: CAREER_GUIDE_ARTICLES.filter(a => /ai|tech|developer|react|javascript|software|portfolio/i.test(`${a.title} ${a.summary}`)).slice(0, 10),
    },
    { key: "walk-in", title: "Walk-In Interviews", to: "/jobs?q=walk", listings: newestJobs.filter(j => /walk[\s-]?in/i.test(`${j.title || ""} ${j.skills || ""}`)).slice(0, 10) },
    { key: "international", title: "International Jobs", to: "/jobs?region=usa", listings: newestJobs.filter(j => /\b(united states|usa|u\.s\.?a?\.?)\b/i.test(j.location || "")).slice(0, 10) },
  ];
}

// The build-time data supplies the pre-rendered page; the browser refreshes it on each visit.
export async function loader(){
  const jobs = await fetchAllJobs();
  return {
    jobSections: makeJobSections(jobs),
    total: jobs.length,
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
  const { jobSections: prerenderedSections, total: prerenderedTotal, paths, guides } = useLoaderData();
  const [liveListing, setLiveListing] = useState({ jobSections: prerenderedSections, total: prerenderedTotal });
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    let isCurrent = true;
    fetchCurrentJobs()
      .then(jobs => {
        if (isCurrent) setLiveListing({ jobSections: makeJobSections(jobs), total: jobs.length });
      })
      .catch(() => {
        // Keep the pre-rendered listings visible if the live API is temporarily unavailable.
      });
    return () => { isCurrent = false; };
  }, []);

  const { jobSections, total } = liveListing;

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

      <section className="home-section home-listing-section" aria-labelledby="latest-heading">
        <div className="container">
          <SectionHead
            id="latest-heading"
            title="Explore opportunities"
            subtitle="Browse recent openings and practical tech guides by category."
            link={{ to: "/jobs", label: `View all ${total} jobs` }}
          />
          <div className="home-listing-grid">
            {jobSections.map(section => {
              return (
                <section className="home-listing-card" key={section.key} aria-labelledby={`home-list-${section.key}`}>
                  <header className="home-listing-card-head">
                    <h3 id={`home-list-${section.key}`}>{section.title}</h3>
                  </header>
                  {section.listings.length ? (
                    <ul className="home-listing-items">
                      {section.listings.map(item => (
                        <li key={section.isArticle ? item.slug : item._id}>
                          <Link to={section.isArticle ? `/career-guide/${item.slug}` : `/jobs/${item.slug}`}>
                            <ArrowRight className="home-listing-item-arrow" size={16} aria-hidden="true" />
                            <span>{item.title}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="home-listing-empty">No current listings in this category. Check back soon.</p>
                  )}
                  <Link className="home-listing-more" to={section.to}>Read More <ArrowRight size={15} aria-hidden="true" /></Link>
                </section>
              );
            })}
          </div>
        </div>
      </section>

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
