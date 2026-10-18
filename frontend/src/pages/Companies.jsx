import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import SEO from "../components/SEO";
import CompanyAvatar from "../components/CompanyAvatar";
import { COMPANY_GUIDES } from "../lib/content";

export default function Companies(){
  return (
    <main className="container doc-page doc-page-wide">
      <SEO
        title="How Top Companies Hire Freshers in India: Hiring Guides | JobKhojo"
        description="Eligibility, selection rounds, test patterns and preparation tips for fresher hiring at TCS, Infosys, Wipro, Accenture, Cognizant and other large employers in India."
        path="/companies"
      />
      <header className="doc-head">
        <p className="eyebrow">Company hiring guides</p>
        <h1>How big employers hire freshers</h1>
        <p className="lead">
          Mass hiring at India's large IT and services companies follows a set pattern: an online test, one or two
          interviews, then onboarding. The details differ by company. Each guide explains who can apply, what every
          round tests, how to prepare and where to apply, along with that company's open roles on JobKhojo.
        </p>
      </header>
      {COMPANY_GUIDES.length > 0 ? (
        <ul className="path-index">
          {COMPANY_GUIDES.map(c => (
            <li key={c.slug}>
              <Link to={`/companies/${c.slug}`} className="path-index-card">
                <span className="company-index-title"><CompanyAvatar name={c.name} size={36} /> <span className="path-index-title">{c.name}</span></span>
                <span className="path-index-desc">{c.description}</span>
                <span className="path-index-meta">{c.minutes} min read{c.draft ? " · Draft" : ""} <ArrowRight size={14} aria-hidden="true" /></span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="muted">The first guides are being written. In the meantime, <Link to="/jobs">browse current jobs</Link>.</p>
      )}
    </main>
  );
}
