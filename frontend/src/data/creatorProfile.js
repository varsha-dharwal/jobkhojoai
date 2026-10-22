export const CREATOR_PROFILE_KEY = "jobkhojo.creatorProfile.v1";
export const CREATOR_PROFILE_UPDATED_EVENT = "creator-profile-updated";

export const EMPTY_CREATOR_PROFILE = Object.freeze({
  displayName: "",
  email: "",
  bio: "",
  specializations: "",
  portfolioUrl: "",
  linkedinUrl: "",
});

function normalizeProfile(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return Object.fromEntries(Object.keys(EMPTY_CREATOR_PROFILE).map((key) => [
    key,
    typeof value[key] === "string" ? value[key] : "",
  ]));
}

export function readCreatorProfile() {
  if (typeof window === "undefined") return { profile: null, available: false };
  try {
    const value = window.localStorage.getItem(CREATOR_PROFILE_KEY);
    return {
      profile: value ? normalizeProfile(JSON.parse(value)) : null,
      available: true,
    };
  } catch {
    return { profile: null, available: false };
  }
}

export function saveCreatorProfile(profile) {
  if (typeof window === "undefined") return { ok: false };
  try {
    const normalized = normalizeProfile(profile);
    if (!normalized) return { ok: false };
    window.localStorage.setItem(CREATOR_PROFILE_KEY, JSON.stringify(normalized));
    window.dispatchEvent(new Event(CREATOR_PROFILE_UPDATED_EVENT));
    return { ok: true, profile: normalized };
  } catch {
    return { ok: false };
  }
}

export function removeCreatorProfile() {
  if (typeof window === "undefined") return false;
  try {
    window.localStorage.removeItem(CREATOR_PROFILE_KEY);
    window.dispatchEvent(new Event(CREATOR_PROFILE_UPDATED_EVENT));
    return true;
  } catch {
    return false;
  }
}
