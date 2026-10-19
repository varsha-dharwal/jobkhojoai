import { Link } from "react-router";
import { Building2, FileText, MessagesSquare } from "lucide-react";
import SEO from "../components/SEO";
import { CAREER_GUIDE_ARTICLES } from "../data/careerGuides";
import { COMPANY_GUIDES, LONG_GUIDES } from "../lib/content";

const TOOLS = [
  { to: "/career-guide/interview-tips", icon: MessagesSquare, title: "Interview preparation guide", summary: "HR, technical, coding and behavioural rounds, with a 7-day prep plan and interview-day checklist." },
  { to: "/career-guide/resume-builder", icon: FileText, title: "Free resume builder", summary: "Build a clean, ATS-friendly fresher resume step by step and download it as a PDF." },
];

// A suggested reading order for someone starting their first job search.
const START_HERE = [
  { to: "/career-guide/resume-guide-for-it-freshers", title: "Get your resume right", text: "Recruiters at large employers screen hundreds of fresher resumes per opening. A clear one-page resume with your eligibility details and two or three solid projects gets you past the first filter." },
  { to: "/career-guide/how-to-spot-fake-job-posts", title: "Learn to spot fake offers", text: "Fake jobs target freshers most. Know the warning signs, such as fees for training or offer letters and interviews held only on chat apps, before you start applying widely." },
  { to: "/career-guide/internship-application-guide", title: "Apply in the right places", text: "Internships and campus-style drives are the most common way into a first tech job. Apply through official careers pages where you can, and keep track of what you sent where." },
  { to: "/career-guide/interview-tips", title: "Prepare for the rounds", text: "Most fresher hiring follows the same pattern: an online test, a technical interview and an HR round. Practise each one separately rather than only solving coding problems." },
];

export default function CareerInsights(){
  const longSlugs = new Set(LONG_GUIDES.map(g => g.slug));
  const shortGuides = CAREER_GUIDE_ARTICLES.filter(a => !longSlugs.has(a.slug));

  return (
    <main className="container doc-page doc-page-wide">
      <SEO
        title="Career Guides for Freshers & Early-Career Tech Jobs | JobKhojo"
        description="Practical guides on resumes, internships, interviews, company hiring processes, salaries and spotting fake job offers, written for freshers and early-career candidates in India."
        path="/career-insights"
      />
      <header className="doc-head">
        <p className="eyebrow">Career guides</p>
        <h1>Practical advice for your job search</h1>
        <p className="lead">
          Resumes, internships, interviews, company hiring processes and staying safe from fake offers. Every guide is
          written for freshers and early-career candidates in India, and updated when hiring practices change.
        </p>
      </header>

      <section className="section" aria-labelledby="start-here">
        <h2 id="start-here" className="h3 list-heading">New to job hunting? Start here</h2>
        <ol className="start-steps">
          {START_HERE.map(s => (
            <li key={s.to}>
              <Link to={s.to} className="start-step-title">{s.title}</Link>
              <p>{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <ul className="tool-grid">
        {TOOLS.map(t => (
          <li key={t.to}>
            <Link to={t.to} className="tool-card">
              <span className="tile-icon"><t.icon size={20} aria-hidden="true" /></span>
              <span className="guide-card-title">{t.title}</span>
              <span className="guide-card-summary">{t.summary}</span>
            </Link>
          </li>
        ))}
        {COMPANY_GUIDES.length > 0 && (
          <li>
            <Link to="/companies" className="tool-card">
              <span className="tile-icon"><Building2 size={20} aria-hidden="true" /></span>
              <span className="guide-card-title">Company hiring guides</span>
              <span className="guide-card-summary">How {COMPANY_GUIDES.slice(0, 3).map(c => c.name).join(", ")} and other large employers hire freshers.</span>
            </Link>
          </li>
        )}
      </ul>

      {LONG_GUIDES.length > 0 && (
        <>
          <h2 className="h3 list-heading">In-depth guides</h2>
          <ul className="guide-grid">
            {LONG_GUIDES.map(g => (
              <li key={g.slug}>
                <Link to={`/career-guide/${g.slug}`} className="guide-card">
                  <span className="guide-card-title">{g.title}</span>
                  <span className="guide-card-summary">{g.description}</span>
                  <span className="guide-card-meta">{g.minutes} min read{g.draft ? " · Draft" : ""}</span>
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}

      <h2 className="h3 list-heading">{LONG_GUIDES.length ? "Quick guides" : "All guides"}</h2>
      <ul className="guide-grid">
        {shortGuides.map(item => (
          <li key={item.slug}>
            <Link to={`/career-guide/${item.slug}`} className="guide-card">
              <span className="guide-card-title">{item.title}</span>
              <span className="guide-card-summary">{item.summary}</span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
