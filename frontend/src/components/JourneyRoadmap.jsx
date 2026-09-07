import { motion } from "motion/react";
import { slugify } from "../utils/slugify";

// Flowchart-style roadmap: a center spine with each step as a highlighted node sitting
// on it, connected by a dashed branch line to a card of that step's topics/items —
// alternating left/right per step, echoing roadmap.sh's diagram shape in our own theme.
// All content comes straight from the steps prop (data/roadmaps.js) — nothing added.
function BranchCard({ step, align }){
  if (!step.topics?.length) return null;
  return (
    <motion.div
      className="flow-branch"
      initial={{ opacity: 0, x: align === "left" ? 16 : -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {step.topics.map(group => (
        <div className="flow-branch-card" key={group.subject}>
          <span className="flow-branch-label">{group.subject}</span>
          <div className="flow-branch-items">
            {group.items.map(item => (
              <span className="flow-branch-item" key={item}>{item}</span>
            ))}
          </div>
        </div>
      ))}
    </motion.div>
  );
}

export default function JourneyRoadmap({ steps }){
  return (
    <div className="flow-track">
      {steps.map((step, i) => {
        const branchOnRight = i % 2 === 0;
        return (
          <div className="flow-row" id={slugify(step.title)} style={{scrollMarginTop:96}} key={step.title}>
            <div className="flow-slot flow-slot-left">
              {!branchOnRight && (
                <>
                  <BranchCard step={step} align="left" />
                  <span className="flow-connector" aria-hidden="true" />
                </>
              )}
            </div>

            <div className="flow-slot flow-slot-node">
              <motion.div
                className="flow-node"
                initial={{ opacity: 0, scale: 0.92 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                <span className="flow-node-num" aria-hidden="true">{i + 1}</span>
                <span>
                  <span className="flow-node-title">{step.title}</span>
                  {step.description && <span className="flow-node-desc">{step.description}</span>}
                </span>
              </motion.div>
            </div>

            <div className="flow-slot flow-slot-right">
              {branchOnRight && (
                <>
                  <span className="flow-connector" aria-hidden="true" />
                  <BranchCard step={step} align="right" />
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
