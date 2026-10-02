import { useEffect } from "react";
import { Link, useLoaderData, useLocation, useParams } from "react-router";
import { ArrowRight, ChevronRight } from "lucide-react";
import JourneyRoadmap from "../components/JourneyRoadmap";
import FAQSection from "../components/FAQSection";
import JobCard from "../components/JobCard";
import AdSlot from "../components/AdSlot";
import SEO, { JsonLd } from "../components/SEO";
import NotFound from "./NotFound";
import { ROADMAPS } from "../data/roadmaps";
import { AD_SLOTS } from "../config/adsense";
import { fetchAllJobs, toListJob } from "../lib/api";
import { relatedPathSlug } from "../lib/jobs";
import { slugify } from "../utils/slugify";

const TIER_LABELS = ["Beginner", "Intermediate", "Advanced"];
const SEARCH_TERMS = {
  frontend: "frontend", backend: "backend", "full-stack": "full stack", ai: "AI", ml: "machine learning",
  "data-science": "data", devops: "devops", cloud: "cloud", "ui-ux": "UI/UX", qa: "QA",
  "cyber-security": "security", "mobile-development": "mobile",
};

// Splits the roadmap's own "Projects" step into three tiers by position — no new
// project ideas are invented, this only regroups what's already there.
function getProjectTiers(roadmap){
  const projectsStep = roadmap.steps.find(s => s.topics?.[0]?.subject === "Projects");
  const items = projectsStep?.topics[0]?.items;
  if (!items?.length) return null;
  const size = Math.ceil(items.length / 3);
  return TIER_LABELS.map((label, i) => ({ label, items: items.slice(i * size, i * size + size) })).filter(t => t.items.length);
}

export async function loader({ params }){
  const jobs = await fetchAllJobs();
  return { jobs: jobs.filter(j => relatedPathSlug(j) === params.slug).slice(0, 4).map(toListJob) };
}

export default function RoadmapDetail(){
  const { slug } = useParams();
  const { hash } = useLocation();
  const { jobs } = useLoaderData() || { jobs: [] };
  const roadmap = ROADMAPS[slug];

  // Lets links like /roadmap/frontend#projects jump straight to that step.
  useEffect(() => {
    if (!hash) return;
    const el = document.getElementById(hash.slice(1));
    if (el) requestAnimationFrame(() => el.scrollIntoView({ block: "start" }));
  }, [hash, slug]);

  if (!roadmap) return <NotFound />;

  const projectTiers = getProjectTiers(roadmap);
  const learningSteps = roadmap.steps.filter(s => s.topics?.[0]?.subject !== "Projects");
  const projectsStep = roadmap.steps.find(s => s.topics?.[0]?.subject === "Projects");
  const projectsAnchor = projectsStep ? slugify(projectsStep.title) : "project-ideas";
  const searchTerm = SEARCH_TERMS[slug] || roadmap.title;

  return (
    <main className="container path-page">
      <SEO
        title={`${roadmap.title} Career Path: What to Learn, in Order | JobKhojo`}
        description={`A step-by-step ${roadmap.title.toLowerCase()} learning path — ${learningSteps.length} stages, the topics in each, project ideas, and current openings.`}
        path={`/roadmap/${slug}`}
      />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Career paths", item: "https://jobkhojoai.com/career-paths" },
          { "@type": "ListItem", position: 2, name: roadmap.title, item: `https://jobkhojoai.com/roadmap/${slug}` },
        ],
      }} />

      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link to="/career-paths">Career paths</Link>
        <ChevronRight size={14} aria-hidden="true" />
        <span aria-current="page">{roadmap.title}</span>
      </nav>

      <header className="doc-head">
        <p className="eyebrow eyebrow-teal">Career path</p>
        <h1>{roadmap.title}</h1>
        <p className="lead">{roadmap.tagline.replace(/`/g, "")}</p>
        <p className="doc-updated">{learningSteps.length} learning stages{projectTiers ? " · project ideas" : ""}</p>
      </header>

      <div className="path-layout">
        <nav className="path-toc" aria-label="Stages">
          <p>Stages</p>
          <ol>
            {learningSteps.map(step => <li key={step.title}><a href={`#${slugify(step.title)}`}>{step.title}</a></li>)}
            {projectTiers && <li><a href={`#${projectsAnchor}`}>Project ideas</a></li>}
          </ol>
        </nav>

        <div className="path-content">
          <JourneyRoadmap steps={learningSteps} />

          <div className="inline-ad">
            <AdSlot slot={AD_SLOTS.roadmapDetailMobileBanner} style={{ minHeight: 100 }} />
          </div>

          {projectTiers && (
            <section className="section" id={projectsAnchor} aria-labelledby="projects-heading">
              <div className="section-head">
                <h2 id="projects-heading">Project ideas by level</h2>
                <p>Build one or two from each level and write up what you decided and why — that's what interviewers ask about.</p>
              </div>
              <div className="tier-grid">
                {projectTiers.map(tier => (
                  <div className="panel" key={tier.label}>
                    <h3>{tier.label}</h3>
                    <ul className="plain-list">{tier.items.map(item => <li key={item}>{item}</li>)}</ul>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="section" aria-labelledby="jobs-heading">
            <div className="section-head section-head-row">
              <div>
                <h2 id="jobs-heading">Open roles on this path</h2>
                {jobs.length === 0 && <p>No matching openings right now — new jobs are added most days.</p>}
              </div>
              <Link to={`/jobs?q=${encodeURIComponent(searchTerm)}`} className="link-arrow">Search {searchTerm} jobs <ArrowRight size={16} aria-hidden="true" /></Link>
            </div>
            {jobs.length > 0 && <div className="job-list">{jobs.map(j => <JobCard key={j._id} job={j} />)}</div>}
          </section>

          {roadmap.faqs && (
            <FAQSection
              items={roadmap.faqs}
              title={`${roadmap.title}: common questions`}
            />
          )}
        </div>
      </div>
    </main>
  );
}
