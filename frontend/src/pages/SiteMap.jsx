import { Link, useLoaderData } from "react-router";
import SEO from "../components/SEO";
import { fetchAllJobs } from "../lib/api";
import { COMPANY_GUIDES, LONG_GUIDES } from "../lib/content";
import { CAREER_GUIDE_ARTICLES } from "../data/careerGuides";
import { ROADMAP_CATEGORIES, ROADMAPS } from "../data/roadmaps";

export async function loader(){
  const jobs = await fetchAllJobs().catch(() => []);
  return { jobs: jobs.map(j => ({ slug: j.slug, title: j.title, organization: j.organization })) };
}

function Group({ title, links }){
  if (!links.length) return null;
  return (
    <section className="sitemap-group" aria-label={title}>
      <h2 className="h3">{title}</h2>
      <ul className="plain-list">
        {links.map(l => <li key={l.to}><Link to={l.to}>{l.label}</Link></li>)}
      </ul>
    </section>
  );
}

export default function SiteMap(){
  const { jobs } = useLoaderData();
  const longSlugs = new Set(LONG_GUIDES.map(g => g.slug));
  const guides = [
    ...LONG_GUIDES.map(g => ({ to: `/career-guide/${g.slug}`, label: g.title })),
    ...CAREER_GUIDE_ARTICLES.filter(a => !longSlugs.has(a.slug)).map(a => ({ to: `/career-guide/${a.slug}`, label: a.title })),
    { to: "/career-guide/interview-tips", label: "Interview tips" },
  ];

  return (
    <main className="container doc-page doc-page-wide">
      <SEO title="Sitemap: Every Page on JobKhojo | JobKhojo" description="All pages on JobKhojo in one place: open jobs, company hiring guides, career guides, career paths, tools and policies." path="/sitemap" />
      <header className="doc-head">
        <p className="eyebrow">Sitemap</p>
        <h1>Every page on JobKhojo</h1>
        <p className="lead">Use this page to find anything on the site. Job listings change daily, so this list is updated every morning.</p>
      </header>
      <div className="sitemap-grid">
        <Group title="Main pages" links={[
          { to: "/", label: "Home" },
          { to: "/jobs", label: "All jobs" },
          { to: "/jobs?type=internship", label: "Internships" },
          { to: "/saved-jobs", label: "Saved jobs" },
          { to: "/career-guide/resume-builder", label: "Free resume builder" },
        ]} />
        <Group title="Company hiring guides" links={COMPANY_GUIDES.map(c => ({ to: `/companies/${c.slug}`, label: `${c.name} hiring guide` }))} />
        <Group title="Career guides" links={guides} />
        <Group title="Career paths" links={[
          { to: "/career-paths", label: "All career paths" },
          ...ROADMAP_CATEGORIES.filter(c => ROADMAPS[c.slug]).map(c => ({ to: `/roadmap/${c.slug}`, label: ROADMAPS[c.slug].title })),
        ]} />
        <Group title="About JobKhojo" links={[
          { to: "/about", label: "About us" },
          { to: "/contact", label: "Contact" },
          { to: "/editorial-policy", label: "Editorial policy" },
          { to: "/job-verification-policy", label: "Job verification policy" },
          { to: "/content-correction-policy", label: "Content correction policy" },
          { to: "/privacy-policy", label: "Privacy policy" },
          { to: "/terms", label: "Terms of use" },
          { to: "/disclaimer", label: "Disclaimer" },
        ]} />
        <Group title={`Open jobs (${jobs.length})`} links={jobs.map(j => ({ to: `/jobs/${j.slug}`, label: `${j.title} at ${j.organization}` }))} />
      </div>
    </main>
  );
}
