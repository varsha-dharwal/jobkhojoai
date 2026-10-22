import { useEffect, useRef, useState } from "react";
import { BellRing, X } from "lucide-react";
import { API_BASE } from "../lib/api";
import { GOOGLE_CLIENT_ID } from "../lib/googleIdentity";

export default function JobAlertModal({ onClose, onApply }){
  const [step, setStep] = useState("prompt");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
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
            const response = await fetch(`${API_BASE}/alerts/google`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ credential }),
            });
            const data = await response.json().catch(() => ({}));
            if (!response.ok) throw new Error(data.message || "Google sign-in could not be completed. Please try again.");
            onApply();
          } catch (err) {
            setError(err.message);
            setBusy(false);
          }
        },
      });
      window.google.accounts.id.renderButton(googleButton.current, {
        theme: "outline", size: "large", shape: "rectangular", width: Math.min(320, googleButton.current.clientWidth || 320), text: "continue_with",
      });
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
  }, [step, onApply]);

  return (
    <div className="modal-overlay alert-modal-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget && !busy) onClose(); }}>
      <section className="alert-modal" role="dialog" aria-modal="true" aria-labelledby="alert-title">
        <button type="button" className="alert-modal-close" aria-label="Close" onClick={onClose} disabled={busy}><X size={19} /></button>
        <BellRing className="alert-modal-icon" size={34} aria-hidden="true" />
        <h2 id="alert-title">{step === "prompt" ? "Want the latest job updates?" : "Continue with Google"}</h2>
        {step === "prompt" && <>
          <p className="alert-modal-copy">Get a daily email with the latest jobs. Subscribe with your Google account and unsubscribe anytime.</p>
          <div className="alert-modal-actions">
            <button className="btn btn-primary" type="button" onClick={() => setStep("methods")}>Yes, subscribe</button>
            <button className="btn btn-secondary" type="button" onClick={onApply}>No thanks, continue to apply</button>
          </div>
        </>}
        {step === "methods" && <>
          <p className="alert-modal-copy">Sign in with Google to verify your email and receive daily updates about new jobs.</p>
          <div className="alert-google-button" ref={googleButton} />
          {error && <p className="alert-error" role="alert">{error}</p>}
          <button type="button" className="alert-back-button" onClick={onApply} disabled={busy}>Maybe later, continue to apply</button>
        </>}
      </section>
    </div>
  );
}
