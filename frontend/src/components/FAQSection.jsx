import { Link } from "react-router";
import { faqs as siteFaqs } from "../data/faqData";

// Native <details> — accessible, works before hydration, and needs no animation library.
export default function FAQSection({ items, title = "Frequently asked questions", subtitle }){
  const faqs = items || siteFaqs;
  return (
    <section className="section" aria-labelledby="faq-heading">
      <div className="section-head">
        <h2 id="faq-heading">{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>
      <div className="faq-list">
        {faqs.map(item => (
          <details key={item.question} className="faq-item">
            <summary>{item.question}</summary>
            <div className="faq-answer">
              <p>{item.answer}</p>
              {item.links && (
                <p className="faq-links">
                  {item.links.map(l => <Link key={l.to} to={l.to}>{l.label} →</Link>)}
                </p>
              )}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
