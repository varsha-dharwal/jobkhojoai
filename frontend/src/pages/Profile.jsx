import { useCallback, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../api/client";
import AuthModal from "../components/resume-builder/AuthModal";
import SEO from "../components/SEO";
import { clearUserSession, getUserToken, onUserAuthChange } from "../utils/userAuth";

const EMPTY_PROFILE = {
  name: "", email: "", phone: "", location: "", profileVisible: true, profileSummary: "", currentSalary: "",
  workExperience: [], educationHistory: [], resumeDraft: null, resumeFile: null,
  preferences: {
    readyToWork: true, desiredTitles: [], jobTypes: [], workSchedules: [], minimumPay: "", payPeriod: "year",
    relocationLocations: [], remotePreference: "any", countries: ["India"], languages: ["English"], notInterested: [],
  },
};

const TABS = [
  { id: "profile", label: "Profile", icon: "♙" },
  { id: "preferences", label: "Preferences", icon: "☷" },
  { id: "resume", label: "Resume", icon: "▤" },
];
const JOB_TYPES = ["Full-time", "Part-time", "Internship", "Contract", "Temporary"];
const WORK_SCHEDULES = ["Day shift", "Night shift", "Flexible", "Weekend"];
const COUNTRY_OPTIONS = ["India", "United States", "United Kingdom", "Canada", "Australia", "United Arab Emirates"];
const LANGUAGE_OPTIONS = ["English", "Hindi", "Punjabi", "Bengali", "Tamil", "Telugu", "Marathi", "Gujarati", "Urdu"];

function splitCommaList(value) {
  return [...new Set(value.split(",").map((item) => item.trim()).filter(Boolean))];
}

function Toggle({ checked, onChange, label }) {
  return (
    <label className="profile-toggle-row">
      <span>{label}</span>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      <span className="profile-toggle" aria-hidden="true" />
    </label>
  );
}

function SectionHeading({ icon, title, onAdd }) {
  return (
    <div className="profile-section-heading">
      <h2><span aria-hidden="true">{icon}</span>{title}</h2>
      {onAdd && <button type="button" className="profile-icon-button" aria-label={`Add ${title}`} onClick={onAdd}>+</button>}
    </div>
  );
}

function EntryFields({ item, fields, onChange, onRemove }) {
  return (
    <article className="profile-entry-card">
      <div className="profile-entry-heading">
        <strong>{item.title || item.degree || "New entry"}</strong>
        <button type="button" className="profile-icon-button is-danger" aria-label="Remove entry" onClick={onRemove}>×</button>
      </div>
      {fields.map(([key, label, placeholder]) => key === "description" ? (
        <label key={key} className="profile-field profile-field-full">{label}
          <textarea rows="3" value={item[key] || ""} placeholder={placeholder} onChange={(event) => onChange(key, event.target.value)} />
        </label>
      ) : (
        <label key={key} className="profile-field">{label}
          <input value={item[key] || ""} placeholder={placeholder} onChange={(event) => onChange(key, event.target.value)} />
        </label>
      ))}
      {Object.hasOwn(item, "current") && <Toggle checked={item.current} label="I currently work here" onChange={(value) => onChange("current", value)} />}
    </article>
  );
}

function ProfileTab({ profile, setProfile }) {
  const setField = (field, value) => setProfile((current) => ({ ...current, [field]: value }));
  const updateEntries = (field, index, key, value) => setProfile((current) => ({
    ...current,
    [field]: current[field].map((item, itemIndex) => itemIndex === index ? { ...item, [key]: value } : item),
  }));
  const removeEntry = (field, index) => setProfile((current) => ({ ...current, [field]: current[field].filter((_, itemIndex) => itemIndex !== index) }));
  const resume = profile.resumeDraft || {};
  const skills = Object.values(resume.skills || {}).flat().filter(Boolean);
  const certifications = (resume.certifications || []).map((item) => item.name).filter(Boolean);

  return (
    <div className="profile-tab-content">
      <section className="profile-contact-card">
        <div className="profile-contact-top">
          <div className="profile-avatar" aria-hidden="true">{profile.name?.trim()?.[0]?.toUpperCase() || "P"}</div>
          <div className="profile-contact-main">
            <h2>{profile.name || "Your profile"}</h2>
            <p>{profile.email}</p>
          </div>
          <span className="profile-completion">Profile</span>
        </div>
        <div className="profile-fields-grid">
          <label className="profile-field">Full name
            <input value={profile.name} maxLength={100} onChange={(event) => setField("name", event.target.value)} />
          </label>
          <label className="profile-field">Phone number
            <input type="tel" value={profile.phone || ""} placeholder="Add your phone number" onChange={(event) => setField("phone", event.target.value)} />
          </label>
          <label className="profile-field profile-field-full">Location
            <input value={profile.location || ""} placeholder="City, country" onChange={(event) => setField("location", event.target.value)} />
          </label>
        </div>
        <Toggle checked={profile.profileVisible} label="Employers can find you" onChange={(value) => setField("profileVisible", value)} />
      </section>

      <section className="profile-section">
        <SectionHeading icon="▤" title="Summary" />
        <label className="profile-field profile-field-full">
          <textarea rows="4" maxLength={2000} value={profile.profileSummary || resume.summary || ""} placeholder="Share a short overview of your experience, strengths, and goals." onChange={(event) => setField("profileSummary", event.target.value)} />
          <span className="profile-character-count">{(profile.profileSummary || resume.summary || "").length}/2000</span>
        </label>
      </section>

      <section className="profile-section">
        <SectionHeading icon="₹" title="Current salary" />
        <div className="profile-salary-field"><span>₹</span><input type="number" min="0" value={profile.currentSalary ?? ""} placeholder="Add your current monthly salary" onChange={(event) => setField("currentSalary", event.target.value)} /><span>/ month</span></div>
        <p className="profile-note">Salary details are only used to improve your job recommendations.</p>
      </section>

      <section className="profile-section">
        <SectionHeading icon="▣" title="Work experience" onAdd={() => setProfile((current) => ({ ...current, workExperience: [...current.workExperience, { title: "", company: "", location: "", employmentType: "", startDate: "", endDate: "", description: "", current: false }] }))} />
        {profile.workExperience.length ? profile.workExperience.map((item, index) => (
          <EntryFields key={item._id || index} item={item} fields={[["title", "Job title", "Frontend Developer"], ["company", "Company", "Company name"], ["location", "Location", "City, country"], ["employmentType", "Job type", "Full-time"], ["startDate", "From", "Month / year"], ["endDate", "To", "Month / year"], ["description", "Description", "Add a few details about your work"]]} onChange={(key, value) => updateEntries("workExperience", index, key, value)} onRemove={() => removeEntry("workExperience", index)} />
        )) : <p className="profile-empty-inline">Add your experience to help employers understand your background.</p>}
      </section>

      <section className="profile-section">
        <SectionHeading icon="◇" title="Education" onAdd={() => setProfile((current) => ({ ...current, educationHistory: [...current.educationHistory, { degree: "", school: "", location: "", startDate: "", endDate: "", description: "" }] }))} />
        {profile.educationHistory.length ? profile.educationHistory.map((item, index) => (
          <EntryFields key={item._id || index} item={item} fields={[["degree", "Degree", "B.Tech Computer Science"], ["school", "School", "College or university"], ["location", "Location", "City, country"], ["startDate", "From", "Year"], ["endDate", "To", "Year"], ["description", "Details", "Optional details"]]} onChange={(key, value) => updateEntries("educationHistory", index, key, value)} onRemove={() => removeEntry("educationHistory", index)} />
        )) : <p className="profile-empty-inline">Add your education history.</p>}
      </section>

      <section className="profile-section">
        <SectionHeading icon="✦" title="Skills" />
        {skills.length ? <div className="profile-chip-list">{skills.map((skill, index) => <span key={`${skill}-${index}`}>{skill}</span>)}</div> : <p className="profile-empty-inline">Add skills in the <Link to="/career-guide/resume-builder">Resume Builder</Link> to improve job matches.</p>}
        <Link className="profile-inline-link" to="/career-guide/resume-builder">Edit resume skills <span aria-hidden="true">→</span></Link>
      </section>

      {certifications.length > 0 && <section className="profile-section"><SectionHeading icon="♧" title="Certifications and licenses" /><div className="profile-chip-list">{certifications.map((item, index) => <span key={`${item}-${index}`}>{item}</span>)}</div></section>}
    </div>
  );
}

function PreferencesTab({ profile, setProfile }) {
  const preferences = profile.preferences || EMPTY_PROFILE.preferences;
  const setPreference = (key, value) => setProfile((current) => ({ ...current, preferences: { ...current.preferences, [key]: value } }));
  const toggleListValue = (key, value) => {
    const values = preferences[key] || [];
    setPreference(key, values.includes(value) ? values.filter((item) => item !== value) : [...values, value]);
  };
  const listField = (key, label, placeholder) => (
    <label className="profile-field profile-field-full">{label}
      <input value={(preferences[key] || []).join(", ")} placeholder={placeholder} onChange={(event) => setPreference(key, splitCommaList(event.target.value))} />
      <small>Separate multiple values with commas.</small>
    </label>
  );

  return (
    <div className="profile-tab-content">
      <section className="profile-preference-banner">
        <div><strong>Ready to work</strong><p>Let employers know you’re open to new opportunities.</p></div>
        <Toggle checked={preferences.readyToWork !== false} label="Available now" onChange={(value) => setPreference("readyToWork", value)} />
      </section>
      <p className="profile-note profile-preference-intro">Sharing preferences helps us show more relevant jobs and employers.</p>

      <section className="profile-section" id="country-language">
        <SectionHeading icon="◎" title="Country and languages" />
        <div className="profile-fields-grid">
          <div className="profile-field profile-field-full"><span className="profile-field-label">Countries you’re interested in</span><div className="profile-option-chips">{COUNTRY_OPTIONS.map((country) => <button type="button" key={country} className={(preferences.countries || []).includes(country) ? "is-selected" : ""} onClick={() => toggleListValue("countries", country)}>{country}</button>)}</div>{listField("countries", "Other countries", "Add country names")}</div>
          <div className="profile-field profile-field-full"><span className="profile-field-label">Languages</span><div className="profile-option-chips">{LANGUAGE_OPTIONS.map((language) => <button type="button" key={language} className={(preferences.languages || []).includes(language) ? "is-selected" : ""} onClick={() => toggleListValue("languages", language)}>{language}</button>)}</div>{listField("languages", "Other languages", "Add languages")}</div>
        </div>
      </section>

      <section className="profile-section">
        <SectionHeading icon="⌕" title="Interested in" />
        {listField("desiredTitles", "Desired job titles", "Frontend Developer, UI Designer")}
        <div className="profile-preference-row"><span className="profile-field-label">Job types</span><div className="profile-option-chips">{JOB_TYPES.map((type) => <button type="button" key={type} className={(preferences.jobTypes || []).includes(type) ? "is-selected" : ""} onClick={() => toggleListValue("jobTypes", type)}>{type}</button>)}</div></div>
        <label className="profile-field">Work schedule
          <select multiple value={preferences.workSchedules || []} onChange={(event) => setPreference("workSchedules", Array.from(event.target.selectedOptions, (option) => option.value))}>{WORK_SCHEDULES.map((item) => <option key={item}>{item}</option>)}</select>
          <small>Use Ctrl or Command to select more than one.</small>
        </label>
        <div className="profile-fields-grid">
          <label className="profile-field">Minimum pay
            <input type="number" min="0" value={preferences.minimumPay ?? ""} placeholder="No minimum" onChange={(event) => setPreference("minimumPay", event.target.value)} />
          </label>
          <label className="profile-field">Pay period
            <select value={preferences.payPeriod || "year"} onChange={(event) => setPreference("payPeriod", event.target.value)}><option value="year">Per year</option><option value="month">Per month</option><option value="hour">Per hour</option></select>
          </label>
        </div>
        <label className="profile-field">Work location
          <select value={preferences.remotePreference || "any"} onChange={(event) => setPreference("remotePreference", event.target.value)}><option value="any">Any location</option><option value="remote">Remote</option><option value="on-site">On-site or hybrid</option></select>
        </label>
        {listField("relocationLocations", "Open to relocating to", "Mohali, Delhi, Bengaluru")}
      </section>

      <section className="profile-section">
        <SectionHeading icon="⊘" title="Not interested in" />
        {listField("notInterested", "Job titles or industries to hide", "Add terms separated by commas")}
      </section>
    </div>
  );
}

function ResumeTab({ resumeFile, onUpload, onRemove, uploading, error }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [downloadError, setDownloadError] = useState("");

  async function downloadResume() {
    setDownloadError("");
    try {
      const { data } = await api.get("/users/me/resume-file", { responseType: "blob" });
      const url = URL.createObjectURL(data);
      const link = document.createElement("a");
      link.href = url;
      link.download = resumeFile.fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch {
      setDownloadError("We couldn’t download this resume. Please try again.");
    }
  }

  return (
    <div className="profile-tab-content">
      <div className="profile-resume-intro"><div><h2>Your resume</h2><p>Upload a PDF resume to keep it with your profile. Maximum file size: 4 MB.</p></div>
        <label className={`btn btn-primary profile-upload-button${uploading ? " is-disabled" : ""}`}>
          {uploading ? "Uploading…" : resumeFile ? "Replace resume" : "Upload resume"}
          <input type="file" accept="application/pdf,.pdf" disabled={uploading} onChange={onUpload} />
        </label>
      </div>
      {error && <p className="profile-error" role="alert">{error}</p>}
      {downloadError && <p className="profile-error" role="alert">{downloadError}</p>}
      {resumeFile ? (
        <article className="profile-resume-file">
          <div className="profile-pdf-icon" aria-hidden="true"><span>PDF</span></div>
          <div className="profile-resume-file-copy"><strong>{resumeFile.fileName}</strong><span>Added {new Date(resumeFile.uploadedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} · {(resumeFile.size / (1024 * 1024)).toFixed(1)} MB</span></div>
          <div className="profile-resume-menu-wrap">
            <button type="button" className="profile-more-button" aria-label="Resume options" aria-expanded={menuOpen} onClick={() => setMenuOpen((value) => !value)}>•••</button>
            {menuOpen && <div className="profile-action-menu" role="menu"><button type="button" role="menuitem" onClick={() => { downloadResume(); setMenuOpen(false); }}>Download resume</button><button type="button" role="menuitem" className="is-danger" onClick={() => { onRemove(); setMenuOpen(false); }}>Remove resume</button></div>}
          </div>
        </article>
      ) : (
        <div className="profile-resume-empty"><div className="profile-pdf-icon" aria-hidden="true"><span>PDF</span></div><strong>No resume uploaded yet</strong><p>Choose a PDF file to add it to your profile.</p></div>
      )}
    </div>
  );
}

export default function Profile() {
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedTab = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(TABS.some((tab) => tab.id === requestedTab) ? requestedTab : "profile");
  const [profile, setProfile] = useState(EMPTY_PROFILE);
  const [signedIn, setSignedIn] = useState(Boolean(getUserToken()));
  const [loading, setLoading] = useState(Boolean(getUserToken()));
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showAuth, setShowAuth] = useState(false);

  const loadProfile = useCallback(async () => {
    if (!getUserToken()) {
      setSignedIn(false);
      setLoading(false);
      return;
    }
    setSignedIn(true);
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/users/me/profile");
      setProfile({ ...EMPTY_PROFILE, ...data.profile, preferences: { ...EMPTY_PROFILE.preferences, ...(data.profile.preferences || {}) } });
    } catch (err) {
      setError(err.response?.data?.message || "We couldn’t load your profile. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
    return onUserAuthChange(loadProfile);
  }, [loadProfile]);

  useEffect(() => {
    if (TABS.some((tab) => tab.id === requestedTab)) setActiveTab(requestedTab);
  }, [requestedTab]);

  useEffect(() => {
    if (activeTab === "preferences" && window.location.hash === "#country-language") {
      requestAnimationFrame(() => document.getElementById("country-language")?.scrollIntoView({ behavior: "smooth", block: "start" }));
    }
  }, [activeTab]);

  function selectTab(tab) {
    setActiveTab(tab);
    setMessage("");
    setSearchParams(tab === "profile" ? {} : { tab }, { replace: true });
  }

  async function saveProfile(event) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");
    try {
      const { data } = await api.put("/users/me/profile", profile);
      setProfile((current) => ({ ...current, ...data.profile, preferences: { ...current.preferences, ...data.profile.preferences } }));
      setMessage("Your changes have been saved.");
    } catch (err) {
      setError(err.response?.data?.message || "We couldn’t save your profile. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function uploadResume(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setError("");
    setMessage("");
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setError("Please choose a PDF file.");
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      setError("Your PDF must be smaller than 4 MB.");
      return;
    }
    setUploading(true);
    try {
      const dataUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error("Could not read this file."));
        reader.readAsDataURL(file);
      });
      const { data } = await api.post("/users/me/resume-file", { fileName: file.name, data: dataUrl });
      setProfile((current) => ({ ...current, resumeFile: data.resumeFile }));
      setMessage("Your resume has been uploaded.");
    } catch (err) {
      setError(err.response?.data?.message || "We couldn’t upload this resume. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  async function removeResume() {
    if (!window.confirm("Remove this resume from your profile?")) return;
    setError("");
    try {
      await api.delete("/users/me/resume-file");
      setProfile((current) => ({ ...current, resumeFile: null }));
      setMessage("Your resume has been removed.");
    } catch (err) {
      setError(err.response?.data?.message || "We couldn’t remove your resume. Please try again.");
    }
  }

  const salaryLabel = profile.preferences.minimumPay ? Number(profile.preferences.minimumPay).toLocaleString("en-IN") : "";

  return (
    <main className="container profile-page">
      <SEO title="Your Profile | jobkhojoAI" description="Manage your job profile, preferences, and resume." path="/profile" noindex />
      {!signedIn ? (
        <section className="profile-auth-card card"><div className="profile-avatar">P</div><h1>Sign in to manage your profile</h1><p>Your profile, preferences, and resume are saved securely to your account.</p><button type="button" className="btn btn-primary" onClick={() => setShowAuth(true)}>Sign in</button></section>
      ) : (
        <>
          <header className="profile-page-header"><div><p className="profile-eyebrow">YOUR ACCOUNT</p><h1>Profile</h1><p>Manage how employers see you and the opportunities you’re looking for.</p></div><button type="button" className="btn btn-ghost profile-signout" onClick={() => { clearUserSession(); setSignedIn(false); }}>Sign out</button></header>
          <nav className="profile-tabs" role="tablist" aria-label="Profile sections">
            {TABS.map((tab) => <button type="button" role="tab" aria-selected={activeTab === tab.id} className={activeTab === tab.id ? "is-active" : ""} key={tab.id} onClick={() => selectTab(tab.id)}><span aria-hidden="true">{tab.icon}</span>{tab.label}</button>)}
          </nav>
          {error && <p className="profile-error" role="alert">{error}</p>}
          {message && <p className="profile-success" role="status">{message}</p>}
          {loading ? <p className="profile-loading" role="status">Loading your profile…</p> : (
            <form onSubmit={saveProfile}>
              {activeTab === "profile" && <ProfileTab profile={profile} setProfile={setProfile} />}
              {activeTab === "preferences" && <PreferencesTab profile={profile} setProfile={setProfile} />}
              {activeTab === "resume" && <ResumeTab resumeFile={profile.resumeFile} onUpload={uploadResume} onRemove={removeResume} uploading={uploading} error={error} />}
              {activeTab !== "resume" && <div className="profile-save-bar"><span>{salaryLabel ? `Minimum pay preference: ₹${salaryLabel} / ${profile.preferences.payPeriod}` : "Your changes are saved when you select Save changes."}</span><button type="submit" className="btn btn-primary" disabled={saving}>{saving ? "Saving…" : "Save changes"}</button></div>}
            </form>
          )}
        </>
      )}
      {showAuth && <AuthModal context="your profile" onClose={() => setShowAuth(false)} onSuccess={async () => { setShowAuth(false); await loadProfile(); }} />}
    </main>
  );
}
