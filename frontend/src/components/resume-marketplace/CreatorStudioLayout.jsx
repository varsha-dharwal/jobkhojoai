import { useEffect, useState } from "react";
import { Bell, Menu, Settings } from "lucide-react";
import { Link } from "react-router";
import CreatorSidebar from "./CreatorSidebar";
import { CREATOR_PROFILE_UPDATED_EVENT, readCreatorProfile } from "../../data/creatorProfile";
import { getUserProfile, onUserAuthChange } from "../../utils/userAuth";

export default function CreatorStudioLayout({ active, title, subtitle, action, children, authenticated = true }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [creatorProfile, setCreatorProfile] = useState(null);
  useEffect(() => {
    const updateProfile = () => setCreatorProfile(readCreatorProfile().profile || getUserProfile());
    updateProfile();
    window.addEventListener("storage", updateProfile);
    window.addEventListener(CREATOR_PROFILE_UPDATED_EVENT, updateProfile);
    const unsubscribeAuth = onUserAuthChange(updateProfile);
    return () => {
      window.removeEventListener("storage", updateProfile);
      window.removeEventListener(CREATOR_PROFILE_UPDATED_EVENT, updateProfile);
      unsubscribeAuth();
    };
  }, []);
  useEffect(() => {
    if (!mobileNavOpen) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setMobileNavOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [mobileNavOpen]);

  const displayName = creatorProfile?.displayName?.trim() || creatorProfile?.name?.trim() || "";
  const initials = displayName.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "—";
  const creatorName = displayName || "Profile not set";
  const creatorEmail = creatorProfile?.email?.trim() || "Creator account";

  return <main className="creator-studio-page">
    <CreatorSidebar active={active} open={mobileNavOpen} onNavigate={() => setMobileNavOpen(false)} authenticated={authenticated} />
    {mobileNavOpen && <button className="creator-drawer-backdrop" type="button" aria-label="Close navigation" onClick={() => setMobileNavOpen(false)} />}
    <div className="creator-main">
      <header className="creator-page-heading"><div><p className="eyebrow">Creator Studio</p><h1>{title}</h1><p>{subtitle}</p></div><div className="creator-header-right"><Link className="creator-admin-header-link" to="/admin/resume-templates" title="Admin navigation only; this link does not authorize review actions"><Settings size={17} aria-hidden="true" /><span>Admin Dashboard</span></Link>{action}</div></header>
      <div className="creator-main-toolbar"><button type="button" className="creator-menu-toggle" aria-label={mobileNavOpen ? "Close Creator Studio navigation" : "Open Creator Studio navigation"} aria-controls="creator-sidebar" aria-expanded={mobileNavOpen} onClick={() => setMobileNavOpen((open) => !open)}><Menu size={19} aria-hidden="true" /> Menu</button><div className="creator-profile"><button type="button" aria-label="Notifications" title="Notifications are currently unavailable"><Bell size={18} aria-hidden="true" /><i /></button><span className="creator-avatar" aria-hidden="true">{initials}</span><span><strong>{creatorName}</strong><small>{creatorEmail}</small></span></div></div>
      {children}
      <footer className="creator-studio-footer">JobKhojo Creator Studio · Submissions and PDFs are stored in this browser and are not uploaded to a server.</footer>
    </div>
  </main>;
}
