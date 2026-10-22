import { useCallback, useEffect, useMemo, useState } from "react";
import { Eye, RefreshCw, Search, X } from "lucide-react";
import ProtectedRoute from "../../components/ProtectedRoute";
import PdfPreview from "../../components/resume-marketplace/PdfPreview";
import { calculateSaleCommission, formatRupees, readCreatorSubmissions, reviewCreatorSubmission, CREATOR_SUBMISSIONS_UPDATED_EVENT } from "../../data/creatorSubmissions";
import { loadPdfFromBrowserStorage } from "../../data/creatorPdfSession";

const REJECTION_REASONS = [
  "Low-quality or unreadable PDF",
  "Incomplete template",
  "Copyright or ownership concern",
  "Personal or sensitive information detected",
  "Incorrect category or description",
  "Other",
];
const STATUS_OPTIONS = ["All statuses", "Pending Review", "Approved", "Rejected"];
const dateLabel = (value) => value && !Number.isNaN(Date.parse(value)) ? new Date(value).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "Not available";

function validRecords(records) {
  return records.filter((record) => record && typeof record === "object" && typeof record.id === "string" && typeof record.name === "string");
}

function Status({ value }) {
  const tone = value === "Approved" ? "approved" : value === "Rejected" ? "rejected" : "pending";
  return <span className={`creator-status creator-status-${tone}`}>{value || "Pending Review"}</span>;
}

function ReviewDialog({ template, mode, busy, onCancel, onConfirm }) {
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const rejecting = mode === "reject";
  return <div className="creator-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget && !busy) onCancel(); }}>
    <section className="creator-modal admin-review-dialog" role="dialog" aria-modal="true" aria-labelledby="review-dialog-title">
      <header><div><p className="eyebrow">{rejecting ? "Reject submission" : "Approve submission"}</p><h2 id="review-dialog-title">{rejecting ? "Record a rejection reason" : "Approve this template?"}</h2></div><button className="icon-button" type="button" aria-label="Close dialog" disabled={busy} onClick={onCancel}><X size={19} /></button></header>
      <div className="admin-dialog-content"><p><strong>{template.name}</strong> by {template.creatorName || template.creatorId || "Creator not identified"}.</p>
        {rejecting ? <>
          <label htmlFor="reject-reason">Reason <span aria-hidden="true">*</span></label>
          <select id="reject-reason" autoFocus required value={reason} onChange={(event) => setReason(event.target.value)}><option value="">Choose a reason</option>{REJECTION_REASONS.map((item) => <option key={item}>{item}</option>)}</select>
          <label htmlFor="reject-details">Additional explanation <span className="optional">Optional</span></label>
          <textarea id="reject-details" rows="4" maxLength={2000} value={details} onChange={(event) => setDetails(event.target.value)} placeholder="Give the creator useful, specific feedback." />
        </> : <p>This changes the shared local template record to Approved. Submission is not a sale.</p>}
      </div>
      <footer><button className="btn btn-secondary" type="button" onClick={onCancel} disabled={busy}>Cancel</button><button className={rejecting ? "btn btn-danger" : "btn btn-primary"} type="button" disabled={busy || (rejecting && !reason)} onClick={() => onConfirm({ reason, details })}>{busy ? "Saving…" : rejecting ? "Reject template" : "Approve template"}</button></footer>
    </section>
  </div>;
}

function TemplateDetails({ template, onClose, onReview }) {
  const [file, setFile] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(true);
  const [pdfError, setPdfError] = useState("");
  const loadPdf = useCallback(async () => {
    setPdfLoading(true);
    setPdfError("");
    setFile(null);
    try {
      const loaded = await loadPdfFromBrowserStorage(template.pdfId || template.id);
      if (!loaded) setPdfError("This PDF is not available in this browser's IndexedDB storage.");
      else setFile(loaded);
    } catch (error) {
      setPdfError(error.message || "The saved PDF could not be read.");
    } finally { setPdfLoading(false); }
  }, [template.id, template.pdfId]);
  useEffect(() => { loadPdf(); }, [loadPdf]);
  const commission = Number.isSafeInteger(template.pricePaise) ? calculateSaleCommission(template.pricePaise) : calculateSaleCommission(Math.round(Number(template.price) * 100));
  const status = template.status || "Pending Review";
  const eligible = status === "Pending Review" || status === "Rejected";
  const rights = template.rightsDeclaration || template.rightsText || "Creator confirmed the ownership and privacy declaration at submission; declaration text was not stored in this record.";
  return <div className="creator-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section className="creator-modal admin-template-details" role="dialog" aria-modal="true" aria-labelledby="template-details-title">
      <header><div><p className="eyebrow">Submitted template</p><h2 id="template-details-title">{template.name}</h2></div><button className="icon-button" type="button" aria-label="Close template details" onClick={onClose}><X size={20} /></button></header>
      <div className="admin-details-body">
        <section><h3>Submission details</h3><dl className="admin-details-list"><dt>Description</dt><dd>{template.description || "No description stored."}</dd><dt>Creator</dt><dd>{template.creatorName || template.creatorId || "Creator information unavailable"}{template.creatorEmail ? ` · ${template.creatorEmail}` : ""}</dd><dt>Category</dt><dd>{template.category || "Not specified"}</dd><dt>Target audience</dt><dd>{template.suitableFor || "Not specified"}</dd><dt>Selling price</dt><dd>{commission ? formatRupees(commission.pricePaise) : "Price unavailable"}</dd><dt>Creator share (60%)</dt><dd>{commission ? formatRupees(commission.creatorPaise) : "—"}</dd><dt>JobKhojo share (40%)</dt><dd>{commission ? formatRupees(commission.platformPaise) : "—"}</dd><dt>Submitted</dt><dd>{dateLabel(template.submittedAt)}</dd><dt>Status</dt><dd><Status value={status} /></dd><dt>Ownership and privacy declaration</dt><dd>{rights}</dd></dl></section>
        {(template.reviewReason || template.reviewNotes || template.reviewedAt) && <section><h3>Previous review</h3><p><Status value={status} /> {template.reviewedAt ? `Reviewed ${dateLabel(template.reviewedAt)}` : ""}{template.reviewer ? ` by ${template.reviewer}` : ""}</p>{template.reviewReason && <p><strong>Reason:</strong> {template.reviewReason}</p>}{template.reviewNotes && <p><strong>Notes:</strong> {template.reviewNotes}</p>}</section>}
        <section><h3>PDF preview</h3>{pdfLoading ? <p role="status">Loading PDF from this browser…</p> : file ? <PdfPreview file={file} enlarged /> : <div className="admin-pdf-unavailable" role="alert"><p>{pdfError}</p><button className="btn btn-secondary" type="button" onClick={loadPdf}>Retry PDF load</button></div>}</section>
        <p className="admin-demo-note">Local development demo: listing records use this browser's localStorage and PDFs use this browser's IndexedDB. They are not uploaded or synchronized.</p>
      </div>
      <footer className="admin-detail-actions"><button className="btn btn-secondary" type="button" onClick={onClose}>Close details</button>{eligible && <><button className="btn btn-danger" type="button" onClick={() => onReview("reject", template)}>Reject</button><button className="btn btn-primary" type="button" onClick={() => onReview("approve", template)}>Approve</button></>}</footer>
    </section>
  </div>;
}

function AdminResumeTemplatesPage() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [categoryFilter, setCategoryFilter] = useState("All categories");
  const [selected, setSelected] = useState(null);
  const [review, setReview] = useState(null);
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState("");

  const refresh = useCallback(() => {
    setLoading(true);
    setError("");
    try { setRecords(validRecords(readCreatorSubmissions())); }
    catch { setError("Could not read template submissions from this browser."); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => {
    refresh();
    window.addEventListener("storage", refresh);
    window.addEventListener(CREATOR_SUBMISSIONS_UPDATED_EVENT, refresh);
    return () => { window.removeEventListener("storage", refresh); window.removeEventListener(CREATOR_SUBMISSIONS_UPDATED_EVENT, refresh); };
  }, [refresh]);

  const stats = useMemo(() => ({ total: records.length, pending: records.filter((item) => (item.status || "Pending Review") === "Pending Review").length, approved: records.filter((item) => item.status === "Approved").length, rejected: records.filter((item) => item.status === "Rejected").length }), [records]);
  const categories = useMemo(() => [...new Set(records.map((item) => item.category).filter(Boolean))].sort(), [records]);
  const shown = useMemo(() => {
    const term = query.trim().toLowerCase();
    return records.filter((item) => {
      const matchesText = !term || `${item.name} ${item.creatorName || ""} ${item.creatorId || ""} ${item.creatorEmail || ""}`.toLowerCase().includes(term);
      return matchesText && (statusFilter === "All statuses" || (item.status || "Pending Review") === statusFilter) && (categoryFilter === "All categories" || item.category === categoryFilter);
    }).sort((a, b) => Date.parse(b.submittedAt || 0) - Date.parse(a.submittedAt || 0));
  }, [records, query, statusFilter, categoryFilter]);

  const openReview = (mode, template) => setReview({ mode, template });
  const submitReview = ({ reason = "", details = "" }) => {
    if (!review || busy) return;
    setBusy(true);
    const result = reviewCreatorSubmission(review.template.id, { status: review.mode === "approve" ? "Approved" : "Rejected", reason, details });
    setBusy(false);
    if (!result.saved) { setFeedback(result.error || "Could not save the review."); refresh(); return; }
    setFeedback(`${result.record.name} marked ${result.record.status}.`);
    setSelected(null);
    setReview(null);
    refresh();
  };

  return <main className="admin-review-page">
    <div className="admin-review-header"><div><p className="eyebrow">JobKhojo Admin · Local demo</p><h1>Resume Template Review</h1><p>Review creator submissions saved in this browser.</p></div><button className="btn btn-secondary" type="button" onClick={refresh} disabled={loading}><RefreshCw size={16} aria-hidden="true" /> Refresh</button></div>
    <div className="admin-demo-banner" role="note"><strong>Local development demo.</strong> Templates are shared with Creator Studio through this browser's localStorage; PDFs use IndexedDB. Review actions are client-side and are not protected by server authorization or synchronized to other users/devices.</div>
    <div className="admin-review-stats" aria-label="Template review statistics"><article><span>Total Submitted</span><strong>{stats.total}</strong></article><article><span>Pending Review</span><strong>{stats.pending}</strong></article><article><span>Approved</span><strong>{stats.approved}</strong></article><article><span>Rejected</span><strong>{stats.rejected}</strong></article></div>
    <section className="admin-review-list creator-panel" aria-labelledby="admin-submissions-heading"><div className="creator-panel-heading"><div><h2 id="admin-submissions-heading">Submitted templates</h2><p>{shown.length} of {records.length} records</p></div></div>
      <div className="admin-review-filters"><label className="admin-search"><span className="sr-only">Search by template or creator</span><Search size={17} aria-hidden="true" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search template or creator" /></label><label><span className="sr-only">Filter by review status</span><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>{STATUS_OPTIONS.map((option) => <option key={option}>{option}</option>)}</select></label><label><span className="sr-only">Filter by category</span><select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}><option>All categories</option>{categories.map((category) => <option key={category}>{category}</option>)}</select></label></div>
      {feedback && <p className="admin-review-feedback" role="status">{feedback}</p>}{error && <p className="creator-error-text" role="alert">{error}</p>}
      {loading ? <p className="admin-review-empty" role="status">Loading submissions…</p> : records.length === 0 ? <div className="admin-review-empty"><h3>No submissions yet</h3><p>Templates submitted through Creator Studio will appear here when saved in this browser.</p></div> : shown.length === 0 ? <p className="admin-review-empty">No submissions match these filters.</p> : <div className="creator-template-table-wrap"><table className="creator-template-table admin-template-table"><thead><tr><th>Template</th><th>Creator</th><th>Category</th><th>Price</th><th>Creator 60%</th><th>JobKhojo 40%</th><th>Submitted</th><th>Status</th><th>Review</th></tr></thead><tbody>{shown.map((item) => { const commission = Number.isSafeInteger(item.pricePaise) ? calculateSaleCommission(item.pricePaise) : calculateSaleCommission(Math.round(Number(item.price) * 100)); return <tr key={item.id}><td data-label="Template" className="creator-template-name">{item.name}</td><td data-label="Creator">{item.creatorName || item.creatorId || item.creatorEmail || "Unavailable"}</td><td data-label="Category">{item.category || "—"}</td><td data-label="Price">{commission ? formatRupees(commission.pricePaise) : "—"}</td><td data-label="Creator 60%">{commission ? formatRupees(commission.creatorPaise) : "—"}</td><td data-label="JobKhojo 40%">{commission ? formatRupees(commission.platformPaise) : "—"}</td><td data-label="Submitted">{dateLabel(item.submittedAt)}</td><td data-label="Status"><Status value={item.status || "Pending Review"} /></td><td data-label="Review"><button className="admin-view-button" type="button" onClick={() => setSelected(item)}><Eye size={15} aria-hidden="true" /> Details</button></td></tr>; })}</tbody></table></div>}
    </section>
    {selected && <TemplateDetails template={selected} onClose={() => setSelected(null)} onReview={openReview} />}
    {review && <ReviewDialog key={`${review.template.id}-${review.mode}`} template={review.template} mode={review.mode} busy={busy} onCancel={() => setReview(null)} onConfirm={submitReview} />}
  </main>;
}

export default function AdminResumeTemplates() {
  return <ProtectedRoute><AdminResumeTemplatesPage /></ProtectedRoute>;
}
