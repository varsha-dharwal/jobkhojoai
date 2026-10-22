import { useCallback, useEffect, useState } from "react";
import { Banknote, Clock3, Files, ShoppingBag } from "lucide-react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router";
import SEO from "../components/SEO";
import CreatorStudioLayout from "../components/resume-marketplace/CreatorStudioLayout";
import CreatorStatCard from "../components/resume-marketplace/CreatorStatCard";
import CreatorTemplateTable from "../components/resume-marketplace/CreatorTemplateTable";
import PdfPreview from "../components/resume-marketplace/PdfPreview";
import EarningsView from "../components/resume-marketplace/EarningsView";
import CreatorPayouts from "../components/resume-marketplace/CreatorPayouts";
import CreatorHelp from "../components/resume-marketplace/CreatorHelp";
import CreatorProfile from "../components/resume-marketplace/CreatorProfile";
import CreatorAuthModal from "../components/resume-marketplace/CreatorAuthModal";
import { formatRupees, readCreatorSubmissions } from "../data/creatorSubmissions";
import { CREATOR_SALES_UPDATED_EVENT, readCreatorSales, summarizeCreatorSales } from "../data/creatorEarnings";
import { calculatePayoutBalances, CREATOR_PAYOUTS_UPDATED_EVENT, readCreatorPayoutRequests } from "../data/creatorPayouts";
import { loadPdfFromBrowserStorage } from "../data/creatorPdfSession";
import { EMPTY_CREATOR_PROFILE, readCreatorProfile, saveCreatorProfile } from "../data/creatorProfile";
import { getUserProfile, onUserAuthChange, verifyUserSession } from "../utils/userAuth";

const VIEW_TITLES = {
  dashboard: ["Creator Dashboard", "Manage template submissions and review recorded sales."],
  templates: ["My Templates", "Review your locally saved submissions and their current status."],
  earnings: ["Earnings", "Review creator earnings calculated from available sales records."],
  payouts: ["Payouts", "Review your payout balance and submit a request stored in this browser."],
  profile: ["Creator Profile", "Manage the creator details used across your local Creator Studio."],
  help: ["Help & Support", "Find answers, report an issue, and track your support requests."],
};

function SubmissionPreview({ template, onClose }) {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    setFile(null);
    setError("");
    loadPdfFromBrowserStorage(template.pdfId || template.id).then((storedFile) => {
      if (!active) return;
      if (storedFile) setFile(storedFile);
      else setError("Saved PDF is missing from browser storage. Replace it to preview this template.");
    }).catch((loadError) => {
      if (active) setError(loadError.message);
    });
    return () => { active = false; };
  }, [template.id, template.pdfId]);
  return <div className="creator-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><section className="creator-modal creator-pdf-modal" role="dialog" aria-modal="true" aria-labelledby="submission-preview-title"><header><div><p className="eyebrow">PDF preview</p><h2 id="submission-preview-title">{template.name}</h2></div><button className="icon-button" type="button" aria-label="Close preview" onClick={onClose}>×</button></header>{file ? <PdfPreview file={file} enlarged /> : <p className="creator-pdf-message" role={error ? "alert" : "status"}>{error || "Loading saved PDF…"}<Link className="creator-text-button" to={`/creator/templates/new?edit=${encodeURIComponent(template.id)}`}>Replace PDF</Link></p>}<footer><button className="btn btn-secondary" type="button" onClick={onClose}>Close preview</button></footer></section></div>;
}
function DashboardOverview({ templates, pendingCount, onPreview, earningsSummary }) {
  return <>
    <div className="creator-stats-grid">
      <CreatorStatCard icon={Files} label="My Templates" value={templates.length} tone="blue" />
      <CreatorStatCard icon={ShoppingBag} label="Eligible Sales" value={earningsSummary.eligibleSales} tone="violet" />
      <CreatorStatCard icon={Banknote} label="Creator Earnings" value={formatRupees(earningsSummary.totalCreatorPaise)} tone="green" />
      <CreatorStatCard icon={Clock3} label="Pending Review" value={pendingCount} tone="amber" />
    </div>
    <div className="creator-dashboard-columns"><section className="creator-panel creator-template-panel"><div className="creator-panel-heading"><div><h2>Recent Templates</h2><p>Local submissions · uploads are not counted as sales</p></div><Link className="creator-text-button" to="/creator/dashboard?view=templates">View all →</Link></div><CreatorTemplateTable templates={templates.slice(0, 3)} onPreview={onPreview} /></section>
      <section className="creator-panel creator-mini-earnings"><div className="creator-panel-heading"><div><h2>Creator earnings</h2><p>Based on available sales records</p></div></div><strong className="creator-mini-total">{formatRupees(earningsSummary.totalCreatorPaise)}</strong><p>{earningsSummary.eligibleSales} eligible sale{earningsSummary.eligibleSales === 1 ? "" : "s"} · 60% creator share</p><p className="creator-mini-recent">Available balance: {formatRupees(earningsSummary.availablePaise)}</p><Link className="btn btn-secondary" to="/creator/dashboard?view=earnings">View Earnings →</Link></section>
    </div>
    <section className="creator-panel creator-checklist"><div><p className="eyebrow">Your next steps</p><h2>Getting Started</h2><p>Submission records are stored in this browser.</p></div><div className="creator-checklist-actions"><Link className="btn btn-primary" to="/creator/templates/new">Upload New Template</Link><Link className="btn btn-secondary" to="/resume-marketplace">Visit Resume Marketplace</Link></div></section>
  </>;
}

export default function CreatorDashboard() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [templates, setTemplates] = useState([]);
  const [earningsSummary, setEarningsSummary] = useState({ eligibleSales: 0, totalCreatorPaise: 0, availablePaise: 0, pendingPaise: 0, paidOutPaise: 0, platformPaise: 0, grossPaise: 0 });
  const [preview, setPreview] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const view = searchParams.get("view") || "dashboard";
  const currentView = ["dashboard", "templates", "earnings", "payouts", "profile", "help"].includes(view) ? view : "dashboard";
  const [title, subtitle] = VIEW_TITLES[currentView];
  useEffect(() => {
    let active = true;
    const refreshAuth = async () => {
      const valid = await verifyUserSession();
      if (active) { setAuthenticated(valid); setAuthReady(true); }
    };
    refreshAuth();
    window.addEventListener("storage", refreshAuth);
    const unsubscribe = onUserAuthChange(refreshAuth);
    return () => { active = false; window.removeEventListener("storage", refreshAuth); unsubscribe(); };
  }, []);
  useEffect(() => {
    const refreshEarnings = () => {
      const accountProfile = getUserProfile();
      const creatorProfile = readCreatorProfile().profile;
      const email = accountProfile?.email || creatorProfile?.email || "";
      const result = readCreatorSales(email);
      const payoutResult = readCreatorPayoutRequests(email);
      const summary = summarizeCreatorSales(result.sales);
      const payoutBalances = calculatePayoutBalances(result.sales, payoutResult.requests);
      setEarningsSummary({ ...summary, availablePaise: payoutResult.available ? payoutBalances.availableForPayoutPaise : 0, paidOutPaise: payoutBalances.totalPaidOutPaise });
    };
    refreshEarnings();
    window.addEventListener("storage", refreshEarnings);
    window.addEventListener(CREATOR_SALES_UPDATED_EVENT, refreshEarnings);
    window.addEventListener(CREATOR_PAYOUTS_UPDATED_EVENT, refreshEarnings);
    window.addEventListener("userauth-changed", refreshEarnings);
    window.addEventListener("creator-profile-updated", refreshEarnings);
    return () => {
      window.removeEventListener("storage", refreshEarnings);
      window.removeEventListener(CREATOR_SALES_UPDATED_EVENT, refreshEarnings);
      window.removeEventListener(CREATOR_PAYOUTS_UPDATED_EVENT, refreshEarnings);
      window.removeEventListener("userauth-changed", refreshEarnings);
      window.removeEventListener("creator-profile-updated", refreshEarnings);
    };
  }, []);

  const handleAuthSuccess = useCallback((identity) => {
    if (!readCreatorProfile().profile) {
      saveCreatorProfile({ ...EMPTY_CREATOR_PROFILE, displayName: identity.name || "", email: identity.email || "" });
    }
    setAuthenticated(true);
    setAuthOpen(false);
    navigate("/creator/dashboard?view=profile");
  }, [navigate]);
  useEffect(() => {
    let active = true;
    const update = async () => {
      const records = readCreatorSubmissions();
      const hydrated = await Promise.all(records.map(async (item) => {
        try {
          const pdf = await loadPdfFromBrowserStorage(item.pdfId || item.id);
          return { ...item, pdfAvailable: Boolean(pdf), pdfLoadError: "" };
        } catch (error) {
          return { ...item, pdfAvailable: false, pdfLoadError: error.message };
        }
      }));
      if (active) setTemplates(hydrated);
    };
    update();
    window.addEventListener("storage", update);
    window.addEventListener("creator-submissions-updated", update);
    return () => { active = false; window.removeEventListener("storage", update); window.removeEventListener("creator-submissions-updated", update); };
  }, []);
  const pendingCount = templates.filter((item) => item.status === "Pending Review").length;

  if (!authReady) return <main className="creator-studio-page"><div className="creator-main"><p role="status">Checking your Creator Studio session…</p></div></main>;
  if (!authenticated && currentView !== "dashboard") return <Navigate to="/creator/dashboard" replace />;

  const headerAction = authenticated ? <div className="creator-header-actions"><Link className="btn btn-secondary" to="/creator/dashboard?view=profile">Sign Up</Link><Link className="btn btn-primary" to="/creator/templates/new">Upload New Template</Link></div> : <div className="creator-header-actions"><button className="btn btn-secondary" type="button" onClick={() => setAuthOpen(true)}>Sign Up</button><button className="btn btn-primary" type="button" disabled title="Create an account to unlock template uploads">Upload New Template</button></div>;

  return <>
    <SEO title={`${title} | JobKhojo`} description="Manage resume template submissions in the JobKhojo Creator Studio." path="/creator/dashboard" noindex />
    <CreatorStudioLayout active={currentView} title={title} subtitle={subtitle} action={headerAction} authenticated={authenticated}>
      {currentView === "dashboard" && <DashboardOverview templates={templates} pendingCount={pendingCount} onPreview={setPreview} earningsSummary={earningsSummary} />}
      {currentView === "templates" && <section className="creator-panel"><div className="creator-panel-heading"><div><h2>My Templates</h2><p>Listing details and PDF files are saved in this browser.</p></div></div><CreatorTemplateTable templates={templates} onPreview={setPreview} /></section>}
      {currentView === "earnings" && <EarningsView />}
      {currentView === "payouts" && <CreatorPayouts />}
      {currentView === "profile" && <CreatorProfile />}
      {currentView === "help" && <CreatorHelp />}
    </CreatorStudioLayout>
    {preview && <SubmissionPreview template={preview} onClose={() => setPreview(null)} />}
    {authOpen && <CreatorAuthModal onClose={() => setAuthOpen(false)} onSuccess={handleAuthSuccess} />}
  </>;
}
