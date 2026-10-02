import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import SEO from "../components/SEO";
import { ROADMAP_CATEGORIES, ROADMAPS } from "../data/roadmaps";

export default function CareerPaths(){
  const paths = ROADMAP_CATEGORIES.map(c => ({ slug: c.slug, ...ROADMAPS[c.slug] })).filter(p => p.title);
  return (
    <main className="container doc-page doc-page-wide">
      <SEO
        title="Career Paths for Tech Roles: What to Learn, in Order | JobKhojo"
        description="Step-by-step career paths for frontend, backend, full stack, data, AI/ML, DevOps, cloud, UI/UX, QA, security and mobile roles — with project ideas and current openings."
        path="/career-paths"
      />
      <header className="doc-head">
        <p className="eyebrow eyebrow-teal">Career paths</p>
        <h1>Know what to learn next</h1>
        <p className="lead">
          Pick the role you're aiming for. Each path breaks it into stages, lists the topics to learn in order,
          suggests projects to build, and shows current openings that need those skills.
        </p>
      </header>
      <ul className="path-index">
        {paths.map(p => (
          <li key={p.slug}>
            <Link to={`/roadmap/${p.slug}`} className="path-index-card">
              <span className="path-index-title">{p.title}</span>
              <span className="path-index-desc">{p.tagline.replace(/`/g, "")}</span>
              <span className="path-index-meta">{p.steps.length} stages <ArrowRight size={14} aria-hidden="true" /></span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
