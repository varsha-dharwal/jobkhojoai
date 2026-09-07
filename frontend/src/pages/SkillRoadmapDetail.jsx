import { useEffect } from "react";
import { useParams, useLocation, Link, Navigate } from "react-router-dom";
import { motion } from "motion/react";
import JourneyRoadmap from "../components/JourneyRoadmap";
import SEO from "../components/SEO";
import { SKILL_ROADMAP_CATEGORIES, SKILL_ROADMAPS } from "../data/skillRoadmaps";

export default function SkillRoadmapDetail(){
  const { slug } = useParams();
  const { hash } = useLocation();
  const meta = SKILL_ROADMAP_CATEGORIES.find(s => s.slug === slug);
  const roadmap = SKILL_ROADMAPS[slug];

  useEffect(() => {
    if (!hash) return;
    const el = document.getElementById(hash.slice(1));
    if (el) requestAnimationFrame(() => el.scrollIntoView({ behavior: "smooth" }));
  }, [hash, slug]);

  if (!meta) return <Navigate to="/" replace />;

  return (
    <main className="container" style={{paddingTop:32, paddingBottom:60}}>
      <SEO
        title={`${meta.label} Roadmap | jobkhojoAI`}
        description={`Step-by-step ${meta.label} learning roadmap — coming soon on jobkhojoAI.`}
        path={`/skill-roadmap/${slug}`}
      />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{maxWidth:640, marginBottom: roadmap ? 56 : 40}}
      >
        <span className="hero-eyebrow"><span className="dot" aria-hidden="true" /> Skill Roadmap</span>
        <h1 style={{fontSize:"clamp(28px, 5vw, 44px)", margin:"16px 0 12px", lineHeight:1.15}}>{meta.label}</h1>
        {roadmap && (
          <p style={{color:"var(--color-text-secondary)", fontSize:16, lineHeight:1.7, margin:0}}>{roadmap.tagline}</p>
        )}
      </motion.div>

      {roadmap ? (
        <div style={{marginBottom:72}}>
          <JourneyRoadmap steps={roadmap.steps} />
        </div>
      ) : (
        <motion.div
          className="card"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{padding:32, marginBottom:48, textAlign:"center"}}
        >
          <p style={{color:"var(--color-text-secondary)", fontSize:16, lineHeight:1.7, margin:"0 0 20px"}}>
            We're building a full step-by-step {meta.label} roadmap — check back soon.
          </p>
          <Link to="/#roadmaps" className="btn btn-ghost">Browse Role Roadmaps Instead</Link>
        </motion.div>
      )}

      <div style={{textAlign:"center"}}>
        <Link to="/#jobs" className="btn btn-primary">Browse Matching Jobs</Link>
      </div>
    </main>
  );
}
