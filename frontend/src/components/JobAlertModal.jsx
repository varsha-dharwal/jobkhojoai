import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, BellRing, X } from "lucide-react";
import { API_BASE } from "../lib/api";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export default function JobAlertModal({ job, onClose }){
  const [step, setStep] = useState("prompt");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const googleButton = useRef(null);

  useEffect(() => {
    function onKeyDown(event){ if (event.key === "Escape" && !busy) onClose(); }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [busy, onClose]);

  useEffect(() => {
    if (step !== "methods" || !GOOGLE_CLIENT_ID || !googleButton.current) return;
    let cancelled = false;
    const init = () => {
      if (cancelled || !window.google?.accounts?.id || !googleButton.current) return;
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: async ({ credential }) => {
          setBusy(true); setError("");
          try {
            await request("/alerts/google", { credential });
            window.location.assign(job.applyLink);
          } catch (err) { setError(err.message); setBusy(false); }
        },
      });
      window.google.accounts.id.renderButton(googleButton.current, { theme: "outline", size: "large", shape: "rectangular", width: 320, text: "continue_with" });
    };
    if (window.google?.accounts?.id) init();
    else {
      let script = document.querySelector('script[data-google-identity="true"]');
      if (!script) {
        script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true; script.defer = true; script.dataset.googleIdentity = "true";
        document.head.appendChild(script);
      }
      script.addEventListener("load", init);
      return () => { cancelled = true; script.removeEventListener("load", init); };
    }
    return () => { cancelled = true; };
  }, [step, job.applyLink]);

  async function request(path, body){
    const response = await fetch(`${API_BASE}${path}`, {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || "Something went wrong. Please try again.");
    return data;
  }

  async function sendCode(event){
    event.preventDefault(); setBusy(true); setError("");
    try {
      await request("/alerts/send-code", { email });
      setStep("verify"); setMessage(`We sent a 6-digit code to ${email.trim()}.`);
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }

  async function verifyCode(event){
    event.preventDefault(); setBusy(true); setError("");
    try {
      await request("/alerts/verify", { email, code: otp });
      window.location.assign(job.applyLink);
    } catch (err) { setError(err.message); setBusy(false); }
  }

  function decline(){ window.location.assign(job.applyLink); }

  return (
    <div className="modal-overlay alert-modal-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget && !busy) onClose(); }}>
      <section className="alert-modal" role="dialog" aria-modal="true" aria-labelledby="alert-title">
        <button type="button" className="alert-modal-close" aria-label="Close" onClick={onClose} disabled={busy}><X size={19} /></button>
        <BellRing className="alert-modal-icon" size={34} />
        <h2 id="alert-title">{step === "prompt" ? "Want the latest job updates?" : step === "verify" ? "Check your email" : "Get job updates by email"}</h2>
        {step === "prompt" && <>
          <p className="alert-modal-copy">Subscribe to receive a daily email with new job openings. You can unsubscribe anytime.</p>
          <div className="alert-modal-actions">
            <button className="btn btn-primary" type="button" onClick={() => setStep("methods")}>Yes, subscribe</button>
          </div>
        </>}
        {step === "methods" && <>
          <p className="alert-modal-copy">Choose an option. We’ll use the verified email you sign in with for your daily job digest.</p>
          {GOOGLE_CLIENT_ID ? <div className="alert-google-button" ref={googleButton} /> : <>
            <button type="button" className="btn btn-secondary alert-google-unavailable" disabled>Continue with Google</button>
            <p className="alert-config-note">Google sign-in needs an OAuth client ID. Set <code>VITE_GOOGLE_CLIENT_ID</code> in the frontend and the same value as <code>GOOGLE_CLIENT_ID</code> in the backend.</p>
          </>}
        </>}
        {step === "verify" && <>
          <p className="alert-modal-copy">{message}</p>
          <form className="alert-email-form" onSubmit={verifyCode}>
            <label htmlFor="alert-otp">6-digit verification code</label>
            <input id="alert-otp" type="text" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} placeholder="123456" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))} onPaste={(e) => { const code = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6); if (code) { e.preventDefault(); setOtp(code); } }} required />
            <button type="submit" className="btn btn-primary" disabled={busy || otp.length !== 6}>{busy ? "Verifying…" : "Verify & continue to apply"}</button>
          </form>
          <button type="button" className="alert-text-button" disabled={busy} onClick={() => { setStep("methods"); setOtp(""); }}>Change email or sign-in method</button>
        </>}
        {error && <p className="alert-error" role="alert">{error}</p>}
        {step !== "prompt" && <button type="button" className="alert-back-button" onClick={() => setStep("prompt")} disabled={busy}>Maybe later</button>}
      </section>
    </div>
  );
}
