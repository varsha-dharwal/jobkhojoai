import { motion } from "motion/react";

// Simple vertical timeline: numbered circle per step, connected by a dashed line
// that draws itself in (top to bottom) as each step scrolls into view. Each step's
// title sits next to one card per subject it covers (e.g. "HTML" and "CSS" get
// their own separate cards) — if a card's topics don't fit, it scrolls horizontally.
export default function JourneyRoadmap({ steps }){
  return (
    <div className="journey-track">
      {steps.map((step, i) => (
        <div className="journey-step" key={step.title}>
          <div className="journey-node-col">
            <motion.div
              className="journey-node"
              initial={{ scale: 0.6, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              {i + 1}
            </motion.div>
            {i < steps.length - 1 && (
              <motion.div
                className="journey-connector"
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
              />
            )}
          </div>
          <motion.div
            className="journey-row"
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <h3 className="journey-title">{step.title}</h3>
            {step.topics?.length > 0 && (
              <div className="journey-subject-cards">
                {step.topics.map(group => (
                  <div className="journey-subject-card" key={group.subject}>
                    <span className="journey-subject-label">{group.subject}</span>
                    <div className="journey-subject-scroll">
                      {group.items.map(item => (
                        <span className="journey-subject-pill" key={item}>{item}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      ))}
    </div>
  );
}
