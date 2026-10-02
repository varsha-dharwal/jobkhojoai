import { Link, useParams } from "react-router";
import JourneyRoadmap from "../components/JourneyRoadmap";
import SEO from "../components/SEO";
import NotFound from "./NotFound";
import { SKILL_ROADMAP_CATEGORIES, SKILL_ROADMAPS } from "../data/skillRoadmaps";

export default function SkillRoadmapDetail(){
  const { slug } = useParams();
  const meta = SKILL_ROADMAP_CATEGORIES.find(s => s.slug === slug);
  const roadmap = SKILL_ROADMAPS[slug];

  if (!meta) return <NotFound />;
  const ready = Boolean(roadmap?.steps?.length);

  return (
    <main className="container doc-page">
      <SEO
        title={`${meta.label} Learning Path | JobKhojo`}
        description={roadmap?.tagline || `A step-by-step ${meta.label} learning path is coming soon on JobKhojo.`}
        path={`/skill-roadmap/${slug}`}
        noindex={!ready}
      />
      <header className="doc-head">
        <p className="eyebrow eyebrow-teal">Skill path</p>
        <h1>{meta.label}</h1>
        {roadmap?.tagline && <p className="lead">{roadmap.tagline}</p>}
      </header>
      {ready ? (
        <JourneyRoadmap steps={roadmap.steps} />
      ) : (
        <div className="empty-state">
          <h2>This skill path is being written</h2>
          <p>In the meantime, the role-based career paths cover {meta.label} in context.</p>
          <Link to="/career-paths" className="btn btn-secondary">Browse career paths</Link>
        </div>
      )}
    </main>
  );
}
