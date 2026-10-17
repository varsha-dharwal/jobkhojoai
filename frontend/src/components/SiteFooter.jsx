import { useState } from "react";
import { Link } from "react-router";
import { ArrowRight, BellRing, CheckCircle2, Mail, ShieldCheck } from "lucide-react";
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
  const [code, setCode] = useState("");
  const [step, setStep] = useState("email");
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState(null);

  async function request(path, body){
    const response = await fetch(`${API_BASE}${path}`, {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.message || "We couldn't complete your subscription. Please try again.");
    return result;
  }

  async function sendVerificationCode(event){
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setFeedback(null);
    try {
      await request("/alerts/send-code", { email });
      setStep("verify");
      setFeedback({ type: "info", text: `We sent a 6-digit verification code to ${email.trim()}.` });
    } catch (error) {
      setFeedback({ type: "error", text: error.message || "We couldn't send your verification code. Please try again." });
    } finally {
      setBusy(false);
    }
  }

  async function verifyAndSubscribe(event){
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setFeedback(null);
    try {
      await request("/alerts/verify", { email, code });
      setStep("done");
      setFeedback({ type: "success", text: "You're subscribed! Daily job updates will arrive in your inbox." });
    } catch (error) {
      setFeedback({ type: "error", text: error.message || "We couldn't verify your email. Please try again." });
    } finally {
      setBusy(false);
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
          <section className="footer-newsletter" aria-labelledby="footer-newsletter-title">
            <div className="footer-newsletter-heading">
              <span className="footer-newsletter-icon"><BellRing size={20} aria-hidden="true" /></span>
              <div>
                <h2 id="footer-newsletter-title">Get the latest <span>job updates</span></h2>
                <p>Fresh opportunities, sent straight to your inbox every day.</p>
              </div>
            </div>
            {step === "done" ? (
              <div className="footer-newsletter-complete"><CheckCircle2 size={21} aria-hidden="true" /><span>You're subscribed with <strong>{email}</strong></span></div>
            ) : (
              <form className="footer-newsletter-form" onSubmit={step === "email" ? sendVerificationCode : verifyAndSubscribe}>
                <label className="footer-newsletter-field">
                  <Mail size={18} aria-hidden="true" />
                  <span className="sr-only">Your email address</span>
                  <input
                    type="email" name="email" autoComplete="email" required maxLength={254}
                    placeholder="Your email address" value={email} readOnly={step === "verify"}
                    onChange={event => setEmail(event.target.value)}
                  />
                </label>
                {step === "verify" && <label className="footer-newsletter-field">
                  <ShieldCheck size={18} aria-hidden="true" />
                  <span className="sr-only">6-digit verification code</span>
                  <input
                    type="text" name="code" inputMode="numeric" autoComplete="one-time-code"
                    pattern="[0-9]{6}" maxLength={6} placeholder="Enter the 6-digit code"
                    value={code} onChange={event => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))} required
                  />
                </label>}
                <button className="footer-newsletter-submit" type="submit" disabled={busy || (step === "verify" && code.length !== 6)}>
                  {busy ? "Please wait..." : step === "email" ? "Get job alerts" : "Verify & subscribe"}
                  {!busy && <ArrowRight size={18} aria-hidden="true" />}
                </button>
              </form>
            )}
            {feedback && <p className={`footer-newsletter-status is-${feedback.type}`} role={feedback.type === "error" ? "alert" : "status"}>{feedback.text}</p>}
            {step === "email" && <p className="footer-newsletter-privacy">Free daily updates. Unsubscribe anytime.</p>}
            {step === "verify" && <button className="footer-newsletter-change" type="button" onClick={() => { setStep("email"); setCode(""); setFeedback(null); }}>Use a different email</button>}
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
