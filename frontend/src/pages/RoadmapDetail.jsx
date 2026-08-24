import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "motion/react";
import JourneyRoadmap from "../components/JourneyRoadmap";
import SEO from "../components/SEO";
import { ROADMAPS, HIRING_COMPANIES } from "../data/roadmaps";

export default function RoadmapDetail(){
  const { slug } = useParams();
  const roadmap = ROADMAPS[slug];

  if (!roadmap) return <Navigate to="/" replace />;

  return (
    <main className="container" style={{paddingTop:32, paddingBottom:60}}>
      <SEO
        title={`${roadmap.title} Roadmap | jobkhojoAI`}
        description={roadmap.tagline}
        path={`/roadmap/${slug}`}
      />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{maxWidth:640, marginBottom:56}}
      >
        <span className="hero-eyebrow"><span className="dot" aria-hidden="true" /> Career Roadmap</span>
        <h1 style={{fontSize:"clamp(28px, 5vw, 44px)", margin:"16px 0 12px", lineHeight:1.15}}>{roadmap.title}</h1>
        <p style={{color:"var(--color-text-secondary)", fontSize:16, lineHeight:1.7, margin:0}}>{roadmap.tagline}</p>
      </motion.div>

      <div style={{marginBottom:72}}>
        <JourneyRoadmap steps={roadmap.steps} />
      </div>

      <motion.section
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{textAlign:"center"}}
      >
        <h2 style={{fontSize:"clamp(22px, 4vw, 32px)", marginBottom:8}}>Start Your Journey in MNC</h2>
        <p style={{color:"var(--color-text-secondary)", maxWidth:520, margin:"0 auto 32px"}}>
          Follow this roadmap and you'll be ready for roles at companies like these.
        </p>
      </motion.section>

      <div className="company-marquee">
        <div className="company-marquee-track">
          {[...HIRING_COMPANIES, ...HIRING_COMPANIES].map((name, i) => (
            <span className="company-marquee-item" key={`${name}-${i}`}>{name}</span>
          ))}
        </div>
      </div>

      <div style={{textAlign:"center", marginTop:48}}>
        <Link to="/#jobs" className="btn btn-primary">Browse Matching Jobs</Link>
      </div>
    </main>
  );
}
