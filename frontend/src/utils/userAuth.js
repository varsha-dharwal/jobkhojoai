const TOKEN_KEY = "jobkhojoai_user_token";
const PROFILE_KEY = "jobkhojoai_user_profile";
const CHANGE_EVENT = "userauth-changed";

export function getUserToken(){
  return localStorage.getItem(TOKEN_KEY);
}

export function getUserProfile(){
  try {
    return JSON.parse(localStorage.getItem(PROFILE_KEY));
  } catch {
    return null;
  }
}

export function isLoggedIn(){
  return Boolean(getUserToken());
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
