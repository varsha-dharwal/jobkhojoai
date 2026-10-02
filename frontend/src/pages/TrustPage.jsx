import { Link } from "react-router";
import SEO from "../components/SEO";

export const POLICY_UPDATED = "2 October 2026";

// Shared layout for About / policy / legal pages: a readable single column with an
// "on this page" list. Section bodies are arrays of strings (paragraphs) and/or `list`.
export default function TrustPage({ title, description, path, eyebrow = "JobKhojo", heading, intro, updated = POLICY_UPDATED, sections = [], children }) {
  return (
    <main className="container doc-page">
      <SEO title={title} description={description} path={path} />
      <header className="doc-head">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{heading}</h1>
        {intro && <p className="lead">{intro}</p>}
        {updated && <p className="doc-updated">Last updated {updated}</p>}
      </header>

      {sections.length > 2 && (
        <nav className="doc-toc" aria-label="On this page">
          <p>On this page</p>
          <ol>
            {sections.map(s => <li key={s.id}><a href={`#${s.id}`}>{s.heading}</a></li>)}
          </ol>
        </nav>
      )}

      <div className="prose doc-body">
        {sections.map(s => (
          <section key={s.id} id={s.id}>
            <h2>{s.heading}</h2>
            {(s.paragraphs || []).map((p, i) => <p key={i}>{p}</p>)}
            {s.list && <ul>{s.list.map((item, i) => <li key={i}>{item}</li>)}</ul>}
            {s.after && s.after.map((p, i) => <p key={`a${i}`}>{p}</p>)}
          </section>
        ))}
        {children}
      </div>

      <aside className="doc-related" aria-label="Related pages">
        <Link to="/about">About</Link>
        <Link to="/job-verification-policy">How we review jobs</Link>
        <Link to="/editorial-policy">Editorial policy</Link>
        <Link to="/privacy-policy">Privacy</Link>
        <Link to="/terms">Terms</Link>
        <Link to="/contact">Contact</Link>
      </aside>
    </main>
  );
}
