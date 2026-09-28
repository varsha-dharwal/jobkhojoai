import { useState } from "react";
import api from "../../api/client";
import { setUserSession } from "../../utils/userAuth";
import { getApplications } from "../../utils/myJobs";
import { getSavedJobs } from "../../utils/savedJobs";

export default function AuthModal({ onClose, onSuccess, context = "progress", defaultMode = "login" }) {
  const [mode, setMode] = useState(defaultMode);
  const [phase, setPhase] = useState("form");
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [pendingEmail, setPendingEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function set(name, value) {
    setForm(current => ({ ...current, [name]: value }));
  }

  async function requestCode(e) {
    e?.preventDefault();
    setLoading(true);
    setError("");
    try {
      const email = (phase === "verify" ? pendingEmail : form.email).trim().toLowerCase();
      const path = mode === "register" ? "/users/signup/request-code" : "/users/login/request-code";
      await api.post(path, mode === "register" ? { ...form, email } : { email });
      setPendingEmail(email);
      setPhase("verify");
      setCode("");
    } catch (err) {
      setError(err.response?.data?.message || "We could not send your code. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function verifyCode(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const path = mode === "register" ? "/users/signup/verify-code" : "/users/login/verify-code";
      const { data } = await api.post(path, { email: pendingEmail, code });
      const guestJobs = { savedJobs: getSavedJobs(), applications: getApplications() };
      setUserSession(data.token, { name: data.name, email: data.email, phone: data.phone });
      onSuccess?.({ mode, guestJobs, welcomeEmailSent: data.welcomeEmailSent });
    } catch (err) {
      setError(err.response?.data?.message || "We could not verify that code. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const title = phase === "verify"
    ? "Check your email"
    : mode === "login"
      ? context === "apply for this job" ? "Sign in to apply for this job" : `Sign in to save your ${context}`
      : `Create an account to ${context === "apply for this job" ? context : `save your ${context}`}`;

  return (
    <div className="modal-overlay" role="presentation" onMouseDown={e => e.target === e.currentTarget && onClose()}>
      <section className="card resume-auth-modal auth-email-modal" role="dialog" aria-modal="true" aria-labelledby="auth-modal-title">
        <div className="auth-modal-header">
          <h3 id="auth-modal-title">{title}</h3>
          <button type="button" className="auth-modal-close" aria-label="Close sign in dialog" onClick={onClose}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>
          </button>
        </div>
        {phase === "form" ? (
          <form onSubmit={requestCode}>
            {mode === "register" && (
              <div style={{ marginBottom: 16 }}>
                <label htmlFor="auth-name">Full name</label>
                <input id="auth-name" type="text" autoComplete="name" value={form.name} onChange={e => set("name", e.target.value)} required maxLength={100} />
              </div>
            )}
            <div style={{ marginBottom: 16 }}>
              <label htmlFor="auth-email">Email address</label>
              <input id="auth-email" type="email" autoComplete="email" value={form.email} onChange={e => set("email", e.target.value)} required />
            </div>
            {mode === "register" && (
              <div style={{ marginBottom: 16 }}>
                <label htmlFor="auth-phone">Phone number</label>
                <input id="auth-phone" type="tel" autoComplete="tel" inputMode="tel" placeholder="+91 98765 43210" value={form.phone} onChange={e => set("phone", e.target.value)} required />
              </div>
            )}
            {error && <p role="alert" style={{ color: "var(--color-danger)", fontSize: 13, marginBottom: 12 }}>{error}</p>}
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: "100%" }}>
              {loading ? "Sending code…" : "Continue with email"}
            </button>
          </form>
        ) : (
          <form onSubmit={verifyCode}>
            <p className="auth-email-hint">We sent a 6-digit verification code to <strong>{pendingEmail}</strong>. The code expires in 10 minutes.</p>
            <label htmlFor="auth-code">Verification code</label>
            <input id="auth-code" type="text" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} value={code} onChange={e => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))} required />
            {error && <p role="alert" style={{ color: "var(--color-danger)", fontSize: 13, margin: "12px 0" }}>{error}</p>}
            <button type="submit" className="btn btn-primary" disabled={loading || code.length !== 6} style={{ width: "100%", marginTop: 16 }}>
              {loading ? "Verifying…" : "Verify email and continue"}
            </button>
            <div className="auth-email-actions">
              <button type="button" className="btn-ghost-link" disabled={loading} onClick={() => { setPhase("form"); setError(""); }}>Change details</button>
              <button type="button" className="btn-ghost-link" disabled={loading} onClick={requestCode}>Resend code</button>
            </div>
          </form>
        )}
        {phase === "form" && (
          <div className="auth-modal-footer">
            <span>{mode === "login" ? "New to JobKhojoAI?" : "Already have an account?"}</span>
            <button type="button" className="btn-ghost-link" onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}>
              {mode === "login" ? "Create account" : "Sign in"}
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
