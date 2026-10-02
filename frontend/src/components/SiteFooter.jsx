import { Link } from "react-router";
import { Mail } from "lucide-react";
import Logo from "./Logo";
import { CONTACT_EMAIL, INSTAGRAM_HANDLE, INSTAGRAM_URL } from "../lib/site";

const COLUMNS = [
  {
    title: "Find jobs",
    links: [
      { to: "/jobs", label: "All jobs" },
      { to: "/jobs?type=internship", label: "Internships" },
      { to: "/jobs?mode=remote", label: "Remote jobs" },
      { to: "/jobs?exp=fresher", label: "Jobs for freshers" },
      { to: "/saved-jobs", label: "Saved jobs" },
    ],
  },
  {
    title: "Learn & grow",
    links: [
      { to: "/career-paths", label: "Career paths" },
      { to: "/career-insights", label: "Career guides" },
      { to: "/career-guide/resume-builder", label: "Resume builder" },
      { to: "/career-guide/interview-tips", label: "Interview preparation" },
    ],
  },
  {
    title: "Company",
    links: [
      { to: "/about", label: "About JobKhojo" },
      { to: "/contact", label: "Contact" },
      { to: "/job-verification-policy", label: "How we review jobs" },
      { to: "/editorial-policy", label: "Editorial policy" },
      { to: "/content-correction-policy", label: "Corrections" },
    ],
  },
  {
    title: "Legal",
    links: [
      { to: "/privacy-policy", label: "Privacy policy" },
      { to: "/terms", label: "Terms of use" },
      { to: "/disclaimer", label: "Disclaimer" },
    ],
  },
];

// Lucide no longer ships brand icons, so the Instagram glyph is drawn here.
function InstagramIcon(){
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
    </svg>
  );
}

export default function SiteFooter(){
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="site-footer-grid">
          <div className="site-footer-brand">
            <Logo size={30} inverse />
            <p>Jobs, internships and career guidance for freshers and early-career professionals in India.</p>
            <div className="site-footer-social">
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label={`JobKhojo on Instagram (${INSTAGRAM_HANDLE})`}><InstagramIcon /></a>
              <a href={`mailto:${CONTACT_EMAIL}`} aria-label={`Email ${CONTACT_EMAIL}`}><Mail size={18} aria-hidden="true" /></a>
            </div>
          </div>
          {COLUMNS.map(col => (
            <div key={col.title}>
              <h2 className="site-footer-title">{col.title}</h2>
              <ul className="site-footer-links">
                {col.links.map(l => <li key={l.to}><Link to={l.to}>{l.label}</Link></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="site-footer-bottom">
          <span>© {new Date().getFullYear()} JobKhojo. All rights reserved.</span>
          <span>JobKhojo never charges candidates. Always apply through the employer's official process.</span>
        </div>
      </div>
    </footer>
  );
}
