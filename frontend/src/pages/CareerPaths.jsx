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

      <section className="prose doc-body paths-guide" aria-labelledby="choosing-a-path">
        <h2 id="choosing-a-path">How to choose a path</h2>
        <p>
          Most freshers don't need to pick a specialisation on day one, but picking one direction for the next six months
          makes learning far more effective than sampling everything. Three questions help:
        </p>
        <ul>
          <li><strong>What do you enjoy building?</strong> If you like seeing visual results, start with Frontend or UI/UX. If you prefer logic, data and systems, look at Backend, Data science or DevOps.</li>
          <li><strong>Where are the openings?</strong> Frontend, Backend, Full stack and QA roles make up most entry-level tech hiring in India, including the bulk drives at large IT services companies. AI, ML and Cyber security roles exist for freshers too, but usually expect stronger maths, a related degree or prior projects.</li>
          <li><strong>What can you show in three months?</strong> Pick the path where you can finish two real projects quickly. A deployed project you can explain beats a long list of half-finished courses.</li>
        </ul>

        <h2>How each path is organised</h2>
        <p>
          Every path is split into stages in the order most people learn them. Each stage lists the topics to cover; you
          don't need to master every topic before moving on, but you should be able to use the core ones in a small
          project. The last stage of each path suggests projects at beginner, intermediate and advanced level, and each
          page links to current openings that ask for those skills.
        </p>

        <h2>How long it takes</h2>
        <p>
          With one to two hours of focused practice a day, most people reach an employable level in a single path in six
          to nine months. Starting from a computer science degree shortens that; switching from a non-technical field
          lengthens it. Progress comes from building, so plan to spend at least half your time on projects rather than
          tutorials.
        </p>
        <p>
          Once you're applying, our <Link to="/career-guide/interview-tips">interview preparation guide</Link> and the
          free <Link to="/career-guide/resume-builder">resume builder</Link> cover the next steps.
        </p>
      </section>
    </main>
  );
}
