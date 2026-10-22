import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import api from "../../api/client";
import { GOOGLE_CLIENT_ID } from "../../lib/googleIdentity";
import { setUserSession } from "../../utils/userAuth";

function getAuthErrorMessage(authError, fallback) {
  if (authError.response?.data?.message) return authError.response.data.message;
  if (!authError.response) return "Creator sign-in service is unavailable. Check the backend and database connection, then try again.";
  return fallback;
}

export default function CreatorAuthModal({ onClose, onSuccess, initialMode = "register" }) {
  const [mode, setMode] = useState(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const googleButtonRef = useRef(null);
  const closeButtonRef = useRef(null);
  const dialogRef = useRef(null);

  useEffect(() => {
    closeButtonRef.current?.focus();
    function handleDialogKeys(event) {
      if (event.key === "Escape" && !busy) {
        onClose();
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = dialogRef.current?.querySelectorAll("button:not(:disabled), input:not(:disabled)");
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    window.addEventListener("keydown", handleDialogKeys);
    return () => window.removeEventListener("keydown", handleDialogKeys);
  }, [busy, onClose]);

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID || !googleButtonRef.current) return undefined;
    let cancelled = false;
    const initialize = () => {
      if (cancelled || !window.google?.accounts?.id || !googleButtonRef.current) return;
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: async ({ credential }) => {
          setBusy(true);
          setError("");
          try {
            const response = await api.post("/users/google-auth", { credential });
            setUserSession(response.data.token, { name: response.data.name, email: response.data.email });
            onSuccess({ name: response.data.name, email: response.data.email });
          } catch (authError) {
            setError(getAuthErrorMessage(authError, "Google sign-in could not be completed. Please try again."));
            setBusy(false);
          }
        },
      });
      window.google.accounts.id.renderButton(googleButtonRef.current, {
        theme: "outline", size: "large", shape: "rectangular", text: "continue_with", width: Math.min(360, googleButtonRef.current.clientWidth || 360),
      });
    };

    if (window.google?.accounts?.id) initialize();
    else {
      let script = document.querySelector('script[data-google-identity="true"]');
      if (!script) {
        script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        script.dataset.googleIdentity = "true";
        document.head.appendChild(script);
      }
      script.addEventListener("load", initialize);
      return () => {
        cancelled = true;
        script.removeEventListener("load", initialize);
      };
    }
    return () => { cancelled = true; };
  }, [onSuccess]);

  async function submit(event) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const response = await api.post(mode === "register" ? "/users/register" : "/users/login", {
        ...(mode === "register" ? { name: name.trim() } : {}),
        email: email.trim(),
        password,
      });
      setUserSession(response.data.token, { name: response.data.name, email: response.data.email });
      onSuccess({ name: response.data.name, email: response.data.email });
    } catch (authError) {
      setError(getAuthErrorMessage(authError, mode === "register" ? "Could not create your account. Please try again." : "Could not sign in. Check your email and password."));
      setBusy(false);
    }
  }

  function changeMode(nextMode) {
    setMode(nextMode);
    setError("");
  }

  return <div className="modal-overlay creator-auth-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget && !busy) onClose(); }}>
    <section ref={dialogRef} className="creator-auth-modal" role="dialog" aria-modal="true" aria-labelledby="creator-auth-title" aria-describedby="creator-auth-description">
      <button ref={closeButtonRef} className="creator-auth-close" type="button" aria-label="Close sign in dialog" onClick={onClose} disabled={busy}><X size={19} aria-hidden="true" /></button>
      <p className="eyebrow">JobKhojo Creator Studio</p>
      <h2 id="creator-auth-title">{mode === "register" ? "Create your account" : "Welcome back"}</h2>
      <p id="creator-auth-description" className="creator-auth-description">{mode === "register" ? "Sign up to access your Creator Studio and edit your profile." : "Sign in to continue to your Creator Studio profile."}</p>

      <div className="creator-auth-google-wrap"><div ref={googleButtonRef} className="creator-auth-google" />{busy && <span role="status">Signing in…</span>}</div>
      <div className="creator-auth-divider"><span>or use your email</span></div>

      <form className="creator-auth-form" onSubmit={submit}>
        {mode === "register" && <label htmlFor="creator-auth-name">Name<input id="creator-auth-name" name="name" autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} required maxLength={100} /></label>}
        <label htmlFor="creator-auth-email">Email address<input id="creator-auth-email" name="email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
        <label htmlFor="creator-auth-password">Password<input id="creator-auth-password" name="password" type="password" autoComplete={mode === "register" ? "new-password" : "current-password"} value={password} onChange={(event) => setPassword(event.target.value)} required minLength={6} /></label>
        {error && <p className="creator-auth-error" role="alert">{error}</p>}
        <button className="btn btn-primary" type="submit" disabled={busy}>{busy ? "Please wait…" : mode === "register" ? "Create Account" : "Sign In"}</button>
      </form>

      <p className="creator-auth-switch">{mode === "register" ? "Already have an account?" : "New to JobKhojo?"} <button type="button" className="creator-auth-switch-button" onClick={() => changeMode(mode === "register" ? "login" : "register")} disabled={busy}>{mode === "register" ? "Sign in" : "Create an account"}</button></p>
      <p className="creator-auth-note">Creator Studio sign-in uses your JobKhojo account. Your profile data is stored in this browser.</p>
    </section>
  </div>;
}
