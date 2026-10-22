import { Link } from "react-router";
import { Banknote, CircleHelp, FilePlus2, Files, LayoutDashboard, Settings, Store, UserRound, Wallet } from "lucide-react";
import Logo from "../Logo";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "templates", label: "My Templates", icon: Files },
  { id: "upload", label: "Upload New Template", icon: FilePlus2 },
  { id: "earnings", label: "Earnings", icon: Banknote },
  { id: "payouts", label: "Payouts", icon: Wallet },
  { id: "profile", label: "Profile", icon: UserRound },
  { id: "help", label: "Help", icon: CircleHelp },
];

export default function CreatorSidebar({ active, onNavigate, open = false, authenticated = true }) {
  return (
    <aside id="creator-sidebar" className={`creator-sidebar${open ? " is-open" : ""}`} aria-label="Creator Studio navigation">
      <Link to="/" className="creator-sidebar-logo" aria-label="JobKhojo home" onClick={onNavigate}><Logo size={32} /></Link>
      <p className="creator-sidebar-label">Creator Studio</p>
      <nav className="creator-side-nav" aria-label="Creator Studio">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => authenticated || id === "dashboard" ? <Link
          key={id}
          to={id === "upload" ? "/creator/templates/new" : id === "templates" ? "/creator/templates" : id === "dashboard" ? "/creator/dashboard" : `/creator/dashboard?view=${id}`}
          onClick={onNavigate}
          className={`creator-side-link${active === id ? " active" : ""}`}
          aria-current={active === id ? "page" : undefined}
        ><Icon size={18} aria-hidden="true" /><span>{label}</span></Link> : <button
          key={id}
          type="button"
          className="creator-side-link is-locked"
          disabled
          title="Sign in to unlock this Creator Studio section"
        ><Icon size={18} aria-hidden="true" /><span>{label}</span></button>)}
      </nav>
      <div className="creator-side-admin" aria-label="Admin navigation">
        <Link to="/admin/resume-templates" onClick={onNavigate} className="creator-side-link creator-admin-side-link" title="Admin navigation only; this link does not authorize review actions"><Settings size={18} aria-hidden="true" /><span>Admin Dashboard</span></Link>
      </div>
      <div className="creator-side-footer">
        <Link to="/resume-marketplace" onClick={onNavigate}><Store size={17} aria-hidden="true" /> Back to Marketplace</Link>
        <Link to="/" onClick={onNavigate}>← Back to JobKhojo</Link>
      </div>
    </aside>
  );
}
