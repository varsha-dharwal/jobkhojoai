import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import {
  CREATOR_PROFILE_UPDATED_EVENT,
  EMPTY_CREATOR_PROFILE,
  removeCreatorProfile,
  readCreatorProfile,
  saveCreatorProfile,
} from "../../data/creatorProfile";
import { clearUserSession } from "../../utils/userAuth";

const FIELD_LABELS = {
  displayName: "Creator display name",
  email: "Email address",
  bio: "Short creator bio",
  specializations: "Skills or specializations",
  portfolioUrl: "Portfolio URL",
  linkedinUrl: "LinkedIn URL",
};

function validate(profile) {
  const errors = {};
  const displayName = profile.displayName.trim();
  const email = profile.email.trim();
  if (!displayName) errors.displayName = "Enter your creator display name.";
  if (!email) errors.email = "Enter your email address.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Enter a valid email address.";

  for (const field of ["portfolioUrl", "linkedinUrl"]) {
    const value = profile[field].trim();
    if (!value) continue;
    try {
      const parsed = new URL(value);
      if (!/^(https?):$/.test(parsed.protocol) || !parsed.hostname) throw new Error("invalid URL");
    } catch {
      errors[field] = "Enter a valid URL beginning with https:// or http://.";
    }
  }
  if (profile.bio.length > 500) errors.bio = "Keep your bio to 500 characters or fewer.";
  if (profile.specializations.length > 240) errors.specializations = "Keep skills or specializations to 240 characters or fewer.";
  return errors;
}

function displayValue(value) {
  return value?.trim() || "Not provided";
}

function safeWebUrl(value) {
  try {
    const url = new URL(value);
    return /^(https?):$/.test(url.protocol) ? url.href : "";
  } catch {
    return "";
  }
}

function ProfileDetails({ profile }) {
  const portfolioUrl = safeWebUrl(profile.portfolioUrl);
  const linkedinUrl = safeWebUrl(profile.linkedinUrl);
  return <dl className="creator-profile-details">
    <div><dt>{FIELD_LABELS.displayName}</dt><dd>{displayValue(profile.displayName)}</dd></div>
    <div><dt>{FIELD_LABELS.email}</dt><dd>{displayValue(profile.email)}</dd></div>
    <div><dt>{FIELD_LABELS.bio}</dt><dd className="creator-profile-long-value">{displayValue(profile.bio)}</dd></div>
    <div><dt>{FIELD_LABELS.specializations}</dt><dd className="creator-profile-long-value">{displayValue(profile.specializations)}</dd></div>
    <div><dt>{FIELD_LABELS.portfolioUrl}</dt><dd>{portfolioUrl ? <a href={portfolioUrl} target="_blank" rel="noreferrer">{profile.portfolioUrl}</a> : displayValue(profile.portfolioUrl)}</dd></div>
    <div><dt>{FIELD_LABELS.linkedinUrl}</dt><dd>{linkedinUrl ? <a href={linkedinUrl} target="_blank" rel="noreferrer">{profile.linkedinUrl}</a> : displayValue(profile.linkedinUrl)}</dd></div>
  </dl>;
}

export default function CreatorProfile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [draft, setDraft] = useState(EMPTY_CREATOR_PROFILE);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);
  const [storageAvailable, setStorageAvailable] = useState(true);
  const savingRef = useRef(false);

  useEffect(() => {
    function load() {
      const result = readCreatorProfile();
      setProfile(result.profile);
      setDraft(result.profile || EMPTY_CREATOR_PROFILE);
      setStorageAvailable(result.available);
      setLoading(false);
    }
    load();
    window.addEventListener("storage", load);
    window.addEventListener(CREATOR_PROFILE_UPDATED_EVENT, load);
    return () => {
      window.removeEventListener("storage", load);
      window.removeEventListener(CREATOR_PROFILE_UPDATED_EVENT, load);
    };
  }, []);

  function startEditing() {
    setDraft(profile || EMPTY_CREATOR_PROFILE);
    setErrors({});
    setMessage(null);
    setEditing(true);
  }

  function cancelEditing() {
    setDraft(profile || EMPTY_CREATOR_PROFILE);
    setErrors({});
    setMessage(null);
    setEditing(false);
  }

  function handleRemoveProfile() {
    const confirmed = window.confirm("Remove the saved creator profile details from this browser? Your JobKhojo account will remain active.");
    if (!confirmed) return;
    if (!removeCreatorProfile()) {
      setMessage({ type: "error", text: "Could not remove the profile details from this browser." });
      return;
    }
    setProfile(null);
    setDraft(EMPTY_CREATOR_PROFILE);
    setEditing(false);
    setMessage({ type: "success", text: "Saved creator profile details were removed from this browser. Your account is still active." });
  }

  function handleLogout() {
    clearUserSession();
    navigate("/creator/dashboard", { replace: true });
  }

  function changeField(field, value) {
    setDraft((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setMessage(null);
  }

  function submit(event) {
    event.preventDefault();
    if (savingRef.current) return;
    const form = event.currentTarget;
    const next = Object.fromEntries(Object.keys(EMPTY_CREATOR_PROFILE).map((field) => [field, draft[field].trim()]));
    const nextErrors = validate(next);
    setErrors(nextErrors);
    setMessage(null);
    if (Object.keys(nextErrors).length) {
      setMessage({ type: "error", text: "Please correct the highlighted fields and try again." });
      requestAnimationFrame(() => form.querySelector('[aria-invalid="true"]')?.focus());
      return;
    }

    savingRef.current = true;
    setSaving(true);
    const result = saveCreatorProfile(next);
    savingRef.current = false;
    setSaving(false);
    if (!result.ok) {
      setStorageAvailable(false);
      setMessage({ type: "error", text: "Your changes could not be saved in this browser. Check browser storage settings and try again." });
      return;
    }
    setProfile(result.profile);
    setDraft(result.profile);
    setStorageAvailable(true);
    setEditing(false);
    setMessage({ type: "success", text: "Profile changes saved in this browser." });
  }

  if (loading) return <section className="creator-panel creator-profile-panel"><p className="eyebrow">Creator Studio</p><p role="status">Loading your profile…</p></section>;

  return <section className="creator-panel creator-profile-panel" aria-labelledby="creator-profile-heading">
    <div className="creator-panel-heading creator-profile-heading">
      <div><p className="eyebrow">Creator Studio</p><h2 id="creator-profile-heading">Profile information</h2><p>Manage the creator details shown in your studio.</p></div>
      {!editing && <button className="btn btn-primary" type="button" onClick={startEditing}>Edit Profile</button>}
    </div>

    {!storageAvailable && <p className="creator-profile-notice" role="alert">Browser storage is unavailable. Your saved profile could not be loaded.</p>}
    {message && <p className={`creator-profile-message ${message.type}`} role={message.type === "error" ? "alert" : "status"}>{message.text}</p>}
    <p className="creator-profile-local-note">Profile details are saved in this browser and are not connected to a verified account. Profile photo upload is not supported by the current Creator Studio storage.</p>

    {editing ? <form className="creator-profile-form creator-form-fields" onSubmit={submit} noValidate>
      <label htmlFor="creator-display-name">{FIELD_LABELS.displayName} <span className="required" aria-hidden="true">*</span></label>
      <input id="creator-display-name" name="displayName" autoComplete="name" value={draft.displayName} maxLength={80} required aria-required="true" aria-invalid={Boolean(errors.displayName)} aria-describedby={errors.displayName ? "creator-display-name-error" : undefined} onChange={(event) => changeField("displayName", event.target.value)} />
      {errors.displayName && <p id="creator-display-name-error" className="creator-error-text">{errors.displayName}</p>}

      <label htmlFor="creator-email">{FIELD_LABELS.email} <span className="required" aria-hidden="true">*</span></label>
      <input id="creator-email" name="email" type="email" autoComplete="email" value={draft.email} maxLength={254} required aria-required="true" aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "creator-email-error" : undefined} onChange={(event) => changeField("email", event.target.value)} />
      {errors.email && <p id="creator-email-error" className="creator-error-text">{errors.email}</p>}

      <label htmlFor="creator-bio">{FIELD_LABELS.bio}</label>
      <textarea id="creator-bio" name="bio" rows="4" maxLength={500} value={draft.bio} aria-invalid={Boolean(errors.bio)} aria-describedby={errors.bio ? "creator-bio-error" : undefined} onChange={(event) => changeField("bio", event.target.value)} />
      {errors.bio && <p id="creator-bio-error" className="creator-error-text">{errors.bio}</p>}
      <small className="creator-profile-hint">{draft.bio.length}/500 characters</small>

      <label htmlFor="creator-specializations">{FIELD_LABELS.specializations}</label>
      <input id="creator-specializations" name="specializations" value={draft.specializations} maxLength={240} placeholder="e.g. ATS resumes, product design, data analytics" aria-invalid={Boolean(errors.specializations)} aria-describedby={errors.specializations ? "creator-specializations-error" : "creator-specializations-hint"} onChange={(event) => changeField("specializations", event.target.value)} />
      {errors.specializations && <p id="creator-specializations-error" className="creator-error-text">{errors.specializations}</p>}
      <small id="creator-specializations-hint" className="creator-profile-hint">Separate skills with commas.</small>

      <label htmlFor="creator-portfolio">{FIELD_LABELS.portfolioUrl}</label>
      <input id="creator-portfolio" name="portfolioUrl" type="url" autoComplete="url" value={draft.portfolioUrl} placeholder="https://example.com" aria-invalid={Boolean(errors.portfolioUrl)} aria-describedby={errors.portfolioUrl ? "creator-portfolio-error" : undefined} onChange={(event) => changeField("portfolioUrl", event.target.value)} />
      {errors.portfolioUrl && <p id="creator-portfolio-error" className="creator-error-text">{errors.portfolioUrl}</p>}

      <label htmlFor="creator-linkedin">{FIELD_LABELS.linkedinUrl}</label>
      <input id="creator-linkedin" name="linkedinUrl" type="url" autoComplete="url" value={draft.linkedinUrl} placeholder="https://www.linkedin.com/in/your-name" aria-invalid={Boolean(errors.linkedinUrl)} aria-describedby={errors.linkedinUrl ? "creator-linkedin-error" : undefined} onChange={(event) => changeField("linkedinUrl", event.target.value)} />
      {errors.linkedinUrl && <p id="creator-linkedin-error" className="creator-error-text">{errors.linkedinUrl}</p>}

      <div className="creator-profile-actions">
        <button className="btn btn-primary" type="submit" disabled={saving}>{saving ? "Saving…" : "Save Changes"}</button>
        <button className="btn btn-secondary" type="button" onClick={cancelEditing} disabled={saving}>Cancel</button>
      </div>
    </form> : profile ? <ProfileDetails profile={profile} /> : <div className="creator-profile-empty"><h3>Your creator profile is not set up yet</h3><p>Add a display name and email address to get started. You can add the rest of your details whenever you like.</p></div>}
    <div className="creator-profile-account-actions">
      {profile && <button className="creator-remove-profile" type="button" onClick={handleRemoveProfile}>Remove Profile</button>}
      <button className="btn btn-secondary" type="button" onClick={handleLogout}>Log Out</button>
    </div>
  </section>;
}
