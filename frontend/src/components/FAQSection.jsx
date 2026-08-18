import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { faqs } from "../data/faqData";

function FAQItem({ item, index, isOpen, onToggle }){
  const questionId = `faq-question-${index}`;
  const panelId = `faq-panel-${index}`;

  return (
    <div className="faq-item">
      <h3 style={{margin:0}}>
        <button
          type="button"
          id={questionId}
          className="faq-question"
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={onToggle}
        >
          <span>{item.question}</span>
          <motion.span
            className="faq-chevron"
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            aria-hidden="true"
          >
            <svg viewBox="0 0 24 24" fill="none" width="18" height="18"><path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </motion.span>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={panelId}
            role="region"
            aria-labelledby={questionId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            style={{overflow:"hidden"}}
          >
            <div className="faq-answer">
              <p style={{margin: item.links ? "0 0 10px" : 0}}>{item.answer}</p>
              {item.links && (
                <div style={{display:"flex", gap:16, flexWrap:"wrap"}}>
                  {item.links.map(l => (
                    <Link key={l.to} to={l.to} className="faq-link">{l.label} →</Link>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQSection(){
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <motion.section
      style={{marginBottom:"var(--space-12)"}}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      aria-labelledby="faq-heading"
    >
      <div className="section-heading">
        <h2 id="faq-heading">Frequently Asked Questions</h2>
        <p>
          Have questions about finding IT jobs, software developer opportunities or tech internships? Find
          answers to some of the most common questions about discovering and applying for technology
          opportunities on jobkhojoAI.
        </p>
      </div>
      <div className="faq-list">
        {faqs.map((item, i) => (
          <FAQItem
            key={item.question}
            item={item}
            index={i}
            isOpen={openIndex === i}
            onToggle={() => setOpenIndex(openIndex === i ? null : i)}
          />
        ))}
      </div>
    </motion.section>
  );
}
