import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../api/client";
import { getUserProfile, isLoggedIn, onUserAuthChange } from "../utils/userAuth";

const VISIT_GAP_MS = 30 * 60 * 1000;

function trackVisitIfDue(){
  if (!isLoggedIn()) return;
  const email = getUserProfile()?.email;
  if (!email) return;
  const storageKey = `jobkhojoai_last_visit_${email.toLowerCase()}`;
  const now = Date.now();
  let previous = 0;
  try { previous = Number(sessionStorage.getItem(storageKey)) || 0; } catch { /* storage may be disabled */ }
  if (now - previous < VISIT_GAP_MS) return;

  try { sessionStorage.setItem(storageKey, String(now)); } catch { /* still track this request */ }
  api.post("/users/me/visit").catch(() => {
    try {
      if (sessionStorage.getItem(storageKey) === String(now)) sessionStorage.removeItem(storageKey);
    } catch { /* storage may be disabled */ }
  });
}

export default function UserActivityTracker(){
  const location = useLocation();
  const [authRevision, setAuthRevision] = useState(0);

  useEffect(() => onUserAuthChange(() => setAuthRevision(value => value + 1)), []);

  useEffect(() => {
    trackVisitIfDue();
  }, [location.pathname, location.search, authRevision]);

  useEffect(() => {
    const onVisible = () => { if (document.visibilityState === "visible") trackVisitIfDue(); };
    window.addEventListener("focus", onVisible);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.removeEventListener("focus", onVisible);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  return null;
}
