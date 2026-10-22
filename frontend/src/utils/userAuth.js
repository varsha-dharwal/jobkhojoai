import { API_BASE } from "../lib/api";

const TOKEN_KEY = "jobkhojoai_user_token";
const PROFILE_KEY = "jobkhojoai_user_profile";
const CHANGE_EVENT = "userauth-changed";

// Guarded so pages that read these during render can be pre-rendered at build time.
const hasStorage = () => typeof window !== "undefined" && typeof window.localStorage !== "undefined";

export function getUserToken(){
  return hasStorage() ? localStorage.getItem(TOKEN_KEY) : null;
}

export function getUserProfile(){
  if (!hasStorage()) return null;
  try {
    return JSON.parse(localStorage.getItem(PROFILE_KEY));
  } catch {
    return null;
  }
}

export function isLoggedIn(){
  return Boolean(getUserToken());
}

export async function verifyUserSession(){
  const token = getUserToken();
  if (!token) return false;
  try {
    const response = await fetch(`${API_BASE}/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) {
      if ([401, 403, 404].includes(response.status)) clearUserSession();
      return false;
    }
    const profile = await response.json();
    localStorage.setItem(PROFILE_KEY, JSON.stringify({ name: profile.name, email: profile.email }));
    window.dispatchEvent(new Event(CHANGE_EVENT));
    return true;
  } catch {
    return false;
  }
}

export function setUserSession(token, profile){
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function clearUserSession(){
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(PROFILE_KEY);
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function onUserAuthChange(callback){
  window.addEventListener(CHANGE_EVENT, callback);
  return () => window.removeEventListener(CHANGE_EVENT, callback);
}
