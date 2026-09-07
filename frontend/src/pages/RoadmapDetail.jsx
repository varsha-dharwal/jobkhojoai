import { useEffect } from "react";
import { useParams, useLocation, Link, Navigate } from "react-router-dom";
import { motion } from "motion/react";
import JourneyRoadmap from "../components/JourneyRoadmap";
import FAQSection from "../components/FAQSection";
import AdSlot from "../components/AdSlot";
import SEO from "../components/SEO";
import { ROADMAPS, HIRING_COMPANIES } from "../data/roadmaps";
import { SKILL_ROADMAP_CATEGORIES } from "../data/skillRoadmaps";
import { AD_SLOTS } from "../config/adsense";

const TIER_LABELS = ["Beginner Project Ideas", "Intermediate Project Ideas", "Advanced Project Ideas"];

// Splits the roadmap's own "Projects" step items into 3 even tiers by position —
// no new project ideas are invented, this just re-groups what's already there.
function getProjectTiers(roadmap){
  const projectsStep = roadmap.steps.find(s => s.topics?.[0]?.subject === "Projects");
  const items = projectsStep?.topics[0]?.items;
  if (!items?.length) return null;
  const size = Math.ceil(items.length / 3);
  return TIER_LABELS.map((label, i) => ({ label, items: items.slice(i * size, i * size + size) })).filter(t => t.items.length);
}

export default function RoadmapDetail(){
  const { slug } = useParams();
  const { hash } = useLocation();
  const roadmap = ROADMAPS[slug];

  // Lets links like /roadmap/frontend#portfolio-projects jump straight to that step.
  useEffect(() => {
    if (!hash) return;
    const el = document.getElementById(hash.slice(1));
    if (el) requestAnimationFrame(() => el.scrollIntoView({ behavior: "smooth" }));
  }, [hash, slug]);

  if (!roadmap) return <Navigate to="/" replace />;

  // Enhanced layout (related roadmaps row, ad rail, project tiers) — pilot on Frontend
  // only for now, gated by whether relatedRoadmaps is defined on this roadmap's data.
  const isEnhanced = Boolean(roadmap.relatedRoadmaps?.length);
  const relatedLinks = isEnhanced
    ? roadmap.relatedRoadmaps.map(s => SKILL_ROADMAP_CATEGORIES.find(c => c.slug === s)).filter(Boolean)
    : [];
  const projectTiers = isEnhanced ? getProjectTiers(roadmap) : null;

  const diagram = <JourneyRoadmap steps={roadmap.steps} />;

  return (
    <main className="container" style={{paddingTop:32, paddingBottom:60, maxWidth: isEnhanced ? 1400 : undefined}}>
      <SEO
        title={`${roadmap.title} Roadmap | jobkhojoAI`}
        description={roadmap.tagline}
        path={`/roadmap/${slug}`}
      />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{maxWidth:640, marginBottom: relatedLinks.length ? 20 : 56}}
      >
        <span className="hero-eyebrow"><span className="dot" aria-hidden="true" /> Career Roadmap</span>
        <h1 style={{fontSize:"clamp(28px, 5vw, 44px)", margin:"16px 0 12px", lineHeight:1.15}}>{roadmap.title}</h1>
        <p style={{color:"var(--color-text-secondary)", fontSize:16, lineHeight:1.7, margin:0}}>{roadmap.tagline}</p>
      </motion.div>

      {relatedLinks.length > 0 && (
        <div className="roadmap-related-row">
          <span className="roadmap-related-label">Related Roadmaps</span>
          {relatedLinks.map(r => (
            <Link key={r.slug} to={`/skill-roadmap/${r.slug}`} className="tag-pill">{r.label}</Link>
          ))}
        </div>
      )}

      <div style={{marginBottom:16, marginTop: relatedLinks.length ? 40 : 0}}>
        {isEnhanced ? (
          <div className="roadmap-main-grid">
            <div>{diagram}</div>
            <aside className="roadmap-ad-rail">
              <AdSlot slot={AD_SLOTS.roadmapDetailSidebar} style={{ width: 300, minHeight: 250 }} />
            </aside>
          </div>
        ) : diagram}
      </div>

      {isEnhanced && (
        <div className="roadmap-mobile-ad">
          <AdSlot slot={AD_SLOTS.roadmapDetailMobileBanner} style={{ minHeight: 100 }} />
        </div>
      )}

      {projectTiers && (
        <section id="project-ideas" style={{marginBottom:56, scrollMarginTop:96}}>
          <div className="roadmap-card-grid" style={{gridTemplateColumns:"repeat(auto-fit, minmax(220px, 1fr))"}}>
            {projectTiers.map(tier => (
              <div className="roadmap-tier-card" key={tier.label}>
                <span className="roadmap-grid-badge">{tier.label}</span>
                <div className="flow-branch-items" style={{marginTop:14}}>
                  {tier.items.map(item => <span className="flow-branch-item" key={item}>{item}</span>)}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <FAQSection
        items={roadmap.faqs}
        title={roadmap.faqs ? `${roadmap.title} FAQs` : undefined}
        subtitle={roadmap.faqs ? `Common questions about becoming a ${roadmap.title.toLowerCase()}.` : undefined}
      />

      {relatedLinks.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{textAlign:"center", marginBottom:56}}
        >
          <h2 style={{fontSize:"clamp(20px, 3.5vw, 26px)", marginBottom:20}}>Continue Learning with These Tracks</h2>
          <div style={{display:"flex", flexWrap:"wrap", gap:12, justifyContent:"center"}}>
            {relatedLinks.map(r => (
              <Link key={r.slug} to={`/skill-roadmap/${r.slug}`} className="btn btn-primary" style={{padding:"10px 20px"}}>{r.label}</Link>
            ))}
          </div>
        </motion.section>
      )}

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
