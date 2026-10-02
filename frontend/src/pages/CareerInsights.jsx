import { Link } from "react-router";
import { FileText, MessagesSquare } from "lucide-react";
import SEO from "../components/SEO";
import { CAREER_GUIDE_ARTICLES } from "../data/careerGuides";

const TOOLS = [
  { to: "/career-guide/interview-tips", icon: MessagesSquare, title: "Interview preparation guide", summary: "HR, technical, coding and behavioural rounds — with a 7-day prep plan and interview-day checklist." },
  { to: "/career-guide/resume-builder", icon: FileText, title: "Free resume builder", summary: "Build a clean, ATS-friendly fresher resume step by step and download it as a PDF." },
];

export default function CareerInsights(){
  return (
    <main className="container doc-page doc-page-wide">
      <SEO
        title="Career Guides for Freshers & Early-Career Tech Jobs | JobKhojo"
        description="Practical guides on resumes, internships, interviews, portfolios, salaries and spotting fake job offers — written for freshers and early-career candidates in India."
        path="/career-insights"
      />
      <header className="doc-head">
        <p className="eyebrow">Career guides</p>
        <h1>Practical advice for your job search</h1>
        <p className="lead">Resumes, internships, interviews, portfolios and staying safe from fake offers — written for freshers and early-career candidates.</p>
      </header>

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
      </ul>

      <h2 className="h3 list-heading">All guides</h2>
      <ul className="guide-grid">
        {CAREER_GUIDE_ARTICLES.map(item => (
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
