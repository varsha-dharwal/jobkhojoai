import { useState } from "react";
import { Link } from "react-router";
import { ArrowRight, Mail, MessageCircle } from "lucide-react";
import Logo from "./Logo";
import { CONTACT_EMAIL, INSTAGRAM_HANDLE, INSTAGRAM_URL, WHATSAPP_URL } from "../lib/site";
import { API_BASE } from "../lib/api";

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

function WhatsAppIcon(){
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20.4 11.5a8.4 8.4 0 0 1-12.4 7.4L4 20l1.1-3.8a8.4 8.4 0 1 1 15.3-4.7Z" />
      <path d="M8.7 8.4c.2-.5.5-.5.8-.5h.4c.2 0 .4.1.5.4l.7 1.7c.1.2.1.4-.1.6l-.5.6c-.2.2-.2.4 0 .6.4.7 1 1.3 1.7 1.7.2.1.4.1.6-.1l.6-.7c.2-.2.4-.2.6-.1l1.6.8c.2.1.4.2.4.4 0 .3-.1.9-.5 1.2-.4.4-1 .6-1.6.5-.7-.1-1.6-.5-2.7-1.2-1.3-.9-2.2-2-2.6-2.9-.4-.8-.4-1.5-.2-2.1.2-.4.4-.7.7-.9Z" />
    </svg>
  );
}

export default function SiteFooter(){
  const [email, setEmail] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState(null);

  async function submitSuggestion(event){
    event.preventDefault();
    if (sending) return;
    setSending(true);
    setFeedback(null);
    try {
      const formData = new FormData(event.currentTarget);
      const response = await fetch(`${API_BASE}/suggestions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, suggestion, website: formData.get("website") }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.message || "We couldn't send your suggestion. Please try again.");
      setEmail("");
      setSuggestion("");
      setFeedback({ type: "success", text: "Thanks! Your suggestion has been sent to our team." });
    } catch (error) {
      setFeedback({ type: "error", text: error.message || "We couldn't send your suggestion. Please try again." });
    } finally {
      setSending(false);
    }
  }

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="site-footer-grid">
          <div className="site-footer-brand">
            <Logo size={30} inverse />
            <p>Jobs, internships and career guidance for freshers and early-career professionals in India.</p>
            <div className="site-footer-social">
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label={`JobKhojo on Instagram (${INSTAGRAM_HANDLE})`}><InstagramIcon /></a>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" aria-label="Follow JobKhojo on WhatsApp"><WhatsAppIcon /></a>
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
          <section className="footer-suggestion" aria-labelledby="footer-suggestion-title">
            <h2 id="footer-suggestion-title">Suggest a <span>Job Post</span></h2>
            <p>Found an opportunity we should share? Send it to us.</p>
            <form onSubmit={submitSuggestion}>
              <label className="footer-suggestion-field">
                <Mail size={16} aria-hidden="true" />
                <span className="sr-only">Your email address</span>
                <input
                  type="email" name="email" autoComplete="email" required maxLength={254}
                  placeholder="Your email address" value={email}
                  onChange={event => setEmail(event.target.value)}
                />
              </label>
              <label className="footer-suggestion-field footer-suggestion-message">
                <MessageCircle size={16} aria-hidden="true" />
                <span className="sr-only">Job details or your suggestion</span>
                <textarea
                  name="suggestion" required minLength={10} maxLength={5000}
                  placeholder="Job details or your suggestion..." value={suggestion}
                  onChange={event => setSuggestion(event.target.value)}
                />
              </label>
              <label className="footer-suggestion-trap" aria-hidden="true">
                Leave this field empty
                <input name="website" type="text" tabIndex={-1} autoComplete="off" />
              </label>
              <button className="footer-suggestion-submit" type="submit" disabled={sending}>
                {sending ? "Sending..." : "Send Suggestion"}
                <ArrowRight size={16} aria-hidden="true" />
              </button>
              {feedback && <p className={`footer-suggestion-status is-${feedback.type}`} role="status">{feedback.text}</p>}
            </form>
          </section>
        </div>
        <div className="site-footer-bottom">
          <span>© {new Date().getFullYear()} JobKhojo. All rights reserved.</span>
          <span>JobKhojo never charges candidates. Always apply through the employer's official process.</span>
        </div>
      </div>
      <nav className="site-social-dock" aria-label="Follow JobKhojo">
        <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label={`JobKhojo on Instagram (${INSTAGRAM_HANDLE})`}><InstagramIcon /></a>
        <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" aria-label="Follow JobKhojo on WhatsApp"><WhatsAppIcon /></a>
        <a href={`mailto:${CONTACT_EMAIL}`} aria-label={`Email ${CONTACT_EMAIL}`}><Mail size={18} aria-hidden="true" /></a>
      </nav>
    </footer>
  );
}
