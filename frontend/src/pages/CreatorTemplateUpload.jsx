import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router";
import { CheckCircle2, FileText, Maximize2, Upload, X } from "lucide-react";
import SEO from "../components/SEO";
import CreatorStudioLayout from "../components/resume-marketplace/CreatorStudioLayout";
import PdfPreview from "../components/resume-marketplace/PdfPreview";
import { calculateCommission, COMMISSION_OPTIONS, formatRupees, readCreatorSubmissions, saveCreatorSubmission } from "../data/creatorSubmissions";
import { loadPdfFromBrowserStorage, savePdfToBrowserStorage } from "../data/creatorPdfSession";
import { getUserProfile, onUserAuthChange, verifyUserSession } from "../utils/userAuth";
import { readCreatorProfile } from "../data/creatorProfile";

const CATEGORIES = ["ATS-Friendly", "Freshers", "Tech / Developer", "Experienced Professionals", "Creative / Two-Column", "Minimal"];
const SUITABLE_FOR = ["Freshers", "Experienced Professionals", "IT & Software", "Design & Creative", "General Applications"];
const RIGHTS_TEXT = "I confirm that this is my original design or that I have the necessary rights to distribute and sell it. I have removed personal and confidential information belonging to other individuals.";
const MAX_BYTES = 10 * 1024 * 1024;
function validateFields(fields, file, previewStatus, previewFailure, accepted, editingExisting = false) {
  const name = fields.name.trim();
  const description = fields.description.trim();
  const descriptionWordCount = description ? description.split(/\s+/).length : 0;
  const errors = {};
  if (!file && !editingExisting) errors.file = "Select a valid PDF template before continuing.";
  else if (file && previewFailure === "renderer") errors.file = "The PDF preview renderer failed to load. Restart the Vite server with --force, reload this page and retry.";
  else if (file && previewStatus === "error") errors.file = "The PDF could not be parsed or rendered. Check the preview message or choose another PDF.";
  if (name.length < 3 || name.length > 80) errors.name = "Enter a template name between 3 and 80 characters.";
  if (!CATEGORIES.includes(fields.category)) errors.category = "Choose a category.";
  if (descriptionWordCount < 100 || descriptionWordCount > 500) errors.description = "Description must be between 100 and 500 words.";
  if (!COMMISSION_OPTIONS.includes(Number(fields.price))) errors.price = "Choose one of the available prices.";
  if (!accepted) errors.rights = "Confirm that you have the rights to distribute this design.";
  return errors;
}

function PreviewModal({ onClose, file }) {
  return <div className="creator-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section className="creator-modal creator-pdf-modal" role="dialog" aria-modal="true" aria-labelledby="pdf-modal-title">
      <header><div><p className="eyebrow">PDF document</p><h2 id="pdf-modal-title">{file.name}</h2></div><button className="icon-button" type="button" aria-label="Close enlarged preview" onClick={onClose}><X size={20} /></button></header>
      <PdfPreview file={file} enlarged />
      <footer><button className="btn btn-secondary" type="button" onClick={onClose}>Close preview</button></footer>
    </section>
  </div>;
}

function ConfirmationModal({ fields, file, commission, onBack, onConfirm, busy, isEditing }) {
  return <div className="creator-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onBack(); }}>
    <section className="creator-modal" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
      <header><div><p className="eyebrow">{isEditing ? "Save changes" : "Final review"}</p><h2 id="confirm-title">{isEditing ? "Update template listing" : "Preview submission"}</h2></div><button className="icon-button" type="button" aria-label="Close confirmation" onClick={onBack}><X size={20} /></button></header>
      <div className="creator-confirm-content"><p>{isEditing ? "Review the updated listing before saving." : "Check the listing information before saving this submission."}</p>
        <dl className="creator-confirm-list"><dt>PDF</dt><dd>{file.name}</dd><dt>Template</dt><dd>{fields.name.trim()}</dd><dt>Category</dt><dd>{fields.category}</dd><dt>Description</dt><dd>{fields.description.trim()}</dd><dt>Best suited for</dt><dd>{fields.suitableFor || "Not specified"}</dd><dt>Price</dt><dd>{formatRupees(commission.pricePaise)}</dd><dt>Creator earnings (60%)</dt><dd>{formatRupees(commission.creatorPaise)}</dd><dt>JobKhojo share (40%)</dt><dd>{formatRupees(commission.platformPaise)}</dd><dt>Rights declaration</dt><dd>Confirmed</dd></dl>
        <p className="creator-local-note">{isEditing ? "Listing updates will be saved in this browser. The existing PDF remains unchanged unless you choose a replacement." : "The listing and PDF file will be saved in this browser. The PDF is not uploaded to a server."}</p>
      </div>
      <footer><button className="btn btn-secondary" type="button" onClick={onBack} disabled={busy}>Back to edit</button><button className="btn btn-primary" type="button" onClick={onConfirm} disabled={busy}>{busy ? "Saving…" : isEditing ? "Save Changes" : "Confirm submission"}</button></footer>
    </section>
  </div>;
}

function CreatorTemplateUploadContent() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("edit");
  const pickerRef = useRef(null);
  const submittingRef = useRef(false);
  const [fields, setFields] = useState({ name: "", category: "", description: "", suitableFor: "", price: "129" });
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState("");
  const [dragging, setDragging] = useState(false);
  const [previewStatus, setPreviewStatus] = useState("empty");
  const [previewFailure, setPreviewFailure] = useState("");
  const [pageCount, setPageCount] = useState(null);
  const [rightsAccepted, setRightsAccepted] = useState(false);
  const [attempted, setAttempted] = useState(false);
  const [modal, setModal] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);
  const [editingRecord, setEditingRecord] = useState(null);
  const [editingLoaded, setEditingLoaded] = useState(!editId);
  const [pdfStorageError, setPdfStorageError] = useState("");
  const commission = useMemo(() => calculateCommission(fields.price), [fields.price]);
  const fieldErrors = attempted ? validateFields(fields, file, previewStatus, previewFailure, rightsAccepted, Boolean(editingRecord)) : {};
  const handlePdfPageCount = useCallback((count, failure) => {
    setPageCount(count);
    setPreviewFailure(failure || "");
    setPreviewStatus(count ? "ready" : failure ? "error" : "loading");
  }, []);

  useEffect(() => {
    let active = true;
    if (!editId) {
      setEditingRecord(null);
      setEditingLoaded(true);
      return () => { active = false; };
    }
    setEditingLoaded(false);
    const record = readCreatorSubmissions().find((item) => item.id === editId) || null;
    setEditingRecord(record);
    if (record) {
      setFile(null);
      setPageCount(null);
      setFields({ name: record.name || "", category: record.category || "", description: record.description || "", suitableFor: record.suitableFor || "", price: String(record.price || "129") });
      setRightsAccepted(true);
      setPreviewStatus("empty");
      setAttempted(false);
      setFileError("");
      setPdfStorageError("");
      loadPdfFromBrowserStorage(record.pdfId || record.id).then((storedFile) => {
        if (active && storedFile) {
          setFile(storedFile);
          setPreviewStatus("loading");
        }
      }).catch((error) => {
        if (active) setPdfStorageError(error.message);
      });
    }
    setEditingLoaded(true);
    return () => { active = false; };
  }, [editId]);

  const changeField = (key, value) => setFields((current) => ({ ...current, [key]: value }));
  const inspectFile = async (candidate) => {
    setFileError("");
    setPdfStorageError("");
    if (!candidate) return;
    if (candidate.type && candidate.type !== "application/pdf" && candidate.type !== "application/x-pdf") { setFileError("This file is not identified as a PDF. Choose a PDF document."); return; }
    if (candidate.size === 0) { setFileError("This file is empty. Choose a readable PDF."); return; }
    if (candidate.size > MAX_BYTES) { setFileError("PDF files must be 10 MB or smaller."); return; }
    const signature = new TextDecoder().decode(new Uint8Array(await candidate.slice(0, 1024).arrayBuffer()));
    if (!signature.includes("%PDF-")) { setFileError("The file does not contain a PDF signature. Choose a valid PDF document."); return; }
    setFile(candidate);
    setPageCount(null);
    setPreviewFailure("");
    setPreviewStatus("loading");
    if (editingRecord) {
      const pdfId = editingRecord.pdfId || editingRecord.id;
      try {
        await savePdfToBrowserStorage(pdfId, candidate);
        const updatedRecord = { ...editingRecord, pdfId, filename: candidate.name, fileSize: candidate.size };
        saveCreatorSubmission(updatedRecord);
        setEditingRecord(updatedRecord);
      } catch (error) {
        setPdfStorageError(`${error.message} The PDF is selected, but could not be saved persistently. Retry storage or choose another file.`);
      }
    }
  };

  const handleSubmitReview = (event) => {
    event.preventDefault();
    setAttempted(true);
    if ((file && previewStatus !== "ready") || Object.keys(validateFields(fields, file, previewStatus, previewFailure, rightsAccepted, Boolean(editingRecord))).length) return;
    setModal("confirm");
  };

  const confirmSubmission = async () => {
    if (submittingRef.current || busy || !commission || (!file && !editingRecord)) return;
    submittingRef.current = true;
    setBusy(true);
    const id = editingRecord?.id || `tpl_${globalThis.crypto?.randomUUID?.() || `${Date.now()}_${Math.random().toString(36).slice(2, 10)}`}`;
    const submittedAt = editingRecord?.submittedAt || new Date().toISOString();
    try {
      const pdfId = editingRecord?.pdfId || id;
      if (file) await savePdfToBrowserStorage(pdfId, file);
      const profile = readCreatorProfile().profile || getUserProfile() || {};
      const record = {
        ...editingRecord, id, pdfId, submittedAt, status: editingRecord?.status || "Pending Review", name: fields.name.trim(), category: fields.category,
        description: fields.description.trim(), suitableFor: fields.suitableFor || null,
        creatorName: editingRecord?.creatorName || profile.displayName || profile.name || "",
        creatorEmail: editingRecord?.creatorEmail || profile.email || "",
        rightsDeclaration: RIGHTS_TEXT,
        price: commission.price, pricePaise: commission.pricePaise,
        creatorShare: commission.creatorShare, creatorSharePaise: commission.creatorPaise,
        platformShare: commission.platformShare, platformSharePaise: commission.platformPaise,
        filename: file?.name || editingRecord?.filename, fileSize: file?.size ?? editingRecord?.fileSize,
      };
      const saved = saveCreatorSubmission(record);
      setResult({ record, saved: saved.saved });
      setModal("");
    } catch (error) {
      setModal("");
      setFileError(`${error.message} Select the PDF again and retry.`);
    } finally {
      setBusy(false);
      submittingRef.current = false;
    }
  };

  const closeModal = () => setModal("");

  if (editId && editingLoaded && !editingRecord) {
    return <CreatorStudioLayout active="templates" title="Template not found" subtitle="This listing is not saved in the current browser."><section className="creator-panel"><p>The requested template could not be found.</p><Link className="btn btn-secondary" to="/creator/dashboard?view=templates">Back to My Templates</Link></section></CreatorStudioLayout>;
  }

  return <>
    <SEO title={`${editingRecord ? "Edit" : "Upload"} Resume Template | JobKhojo Creator Studio`} description="Submit an original resume template for review." path="/creator/templates/new" noindex />
    <CreatorStudioLayout active="upload" title={editingRecord ? "Edit Resume Template" : "Upload a Resume Template"} subtitle={editingRecord ? "Update listing details or choose a replacement PDF." : "Share your original resume design with job seekers and earn from successful sales."}>
      {result ? <section className="creator-panel creator-submit-success" role="status"><CheckCircle2 size={42} aria-hidden="true" /><h2>{editingRecord ? "Template updated" : "Submission recorded"}</h2><p><strong>{result.record.name}</strong> is {editingRecord ? "updated" : <>marked <strong>Pending Review</strong></>}.</p><p>{result.saved ? "Listing details and PDF file were saved in browser storage." : "The PDF file was saved, but listing details could not be persisted and are available only for this session."}{file ? " The PDF file is stored in this browser for future previews; it was not uploaded to a server." : editingRecord ? " The existing PDF reference was preserved; replace the file if it cannot be retrieved." : " The PDF stays in browser storage and is not uploaded to a server."}</p><div className="creator-success-actions"><button className="btn btn-primary" type="button" onClick={() => navigate("/creator/dashboard?view=templates")}>Go to My Templates</button><button className="btn btn-secondary" type="button" onClick={() => navigate("/creator/dashboard")}>Back to Dashboard</button></div></section> : <>
        <nav className="creator-breadcrumb" aria-label="Breadcrumb"><Link to="/creator/dashboard">Creator Studio</Link><span aria-hidden="true">›</span><Link to="/creator/dashboard?view=templates">My Templates</Link><span aria-hidden="true">›</span><span aria-current="page">{editingRecord ? "Edit Template" : "Upload New Template"}</span></nav>
        <div className="creator-upload-toolbar"><Link className="btn btn-secondary" to="/creator/dashboard">← Back to Dashboard</Link><span>PDF only · Up to 10 MB</span></div>
        <form className="creator-upload-grid creator-functional-upload" onSubmit={handleSubmitReview} noValidate>
          <div className="creator-upload-left">
            <section className="creator-panel" aria-labelledby="pdf-upload-title"><div className="creator-panel-heading"><div><h2 id="pdf-upload-title">Resume PDF{!editingRecord && <> <span className="required" aria-hidden="true">*</span></>}</h2><p>{editingRecord ? "Save listing edits without reselecting the PDF, or choose a replacement." : "The PDF is stored in this browser for later previews; it is not uploaded to a server."}</p></div></div>
              <div className={`creator-dropzone${dragging ? " is-dragging" : ""}`} onDragOver={(event) => { event.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={(event) => { event.preventDefault(); setDragging(false); inspectFile(event.dataTransfer.files?.[0]); }}>
                <input ref={pickerRef} className="sr-only" type="file" accept="application/pdf,.pdf" aria-label="Choose a resume template PDF" aria-required={!editingRecord} required={!editingRecord} onChange={(event) => { inspectFile(event.target.files?.[0]); event.target.value = ""; }} />
                <Upload size={27} aria-hidden="true" /><strong>Drag and drop a PDF here</strong><span>or</span><button type="button" className="btn btn-secondary" onClick={() => pickerRef.current?.click()}>{file || editingRecord ? "Replace PDF" : "Choose PDF"}</button><small>Maximum file size: 10 MB</small>
              </div>
              {fileError && <p className="creator-error-text" role="alert">{fileError}</p>}{pdfStorageError && <p className="creator-error-text" role="alert">{pdfStorageError} Use Replace PDF to select it again.</p>}
              {file ? <div className="creator-file-row"><FileText size={20} aria-hidden="true" /><div><strong>{file.name}</strong><span>{(file.size / (1024 * 1024)).toFixed(2)} MB{pageCount ? ` · ${pageCount} pages` : ""}</span></div><button type="button" className="creator-text-button" onClick={() => { setFile(null); setPageCount(null); setPreviewFailure(""); setPreviewStatus("empty"); setFileError(""); }}>Remove</button></div> : editingRecord ? <div className="creator-file-row"><FileText size={20} aria-hidden="true" /><div><strong>{editingRecord.filename || "Existing PDF"}</strong><span>This older listing has no PDF file saved in browser storage. Select the PDF again to restore its preview.</span></div><button type="button" className="btn btn-secondary" onClick={() => pickerRef.current?.click()}>Replace PDF</button></div> : null}
              {fieldErrors.file && <p className="creator-error-text" role="alert">{fieldErrors.file}</p>}
            </section>
            <section className="creator-panel" aria-labelledby="listing-details-title"><div className="creator-panel-heading"><div><h2 id="listing-details-title">Listing details</h2><p>Tell buyers what makes this template useful.</p></div></div>
              <div className="creator-form-fields">
                <label htmlFor="template-name">Template Name <span className="required" aria-hidden="true">*</span></label><input id="template-name" required aria-required="true" value={fields.name} maxLength={80} onChange={(e) => changeField("name", e.target.value)} placeholder="e.g. Clean Product Designer" aria-invalid={Boolean(fieldErrors.name)} aria-describedby={fieldErrors.name ? "template-name-error" : undefined} />{fieldErrors.name && <p id="template-name-error" className="creator-error-text" role="alert">{fieldErrors.name}</p>}
                <label htmlFor="template-category">Category <span className="required" aria-hidden="true">*</span></label><select id="template-category" required aria-required="true" value={fields.category} onChange={(e) => changeField("category", e.target.value)} aria-invalid={Boolean(fieldErrors.category)}><option value="">Choose a category</option>{CATEGORIES.map((category) => <option key={category}>{category}</option>)}</select>{fieldErrors.category && <p className="creator-error-text" role="alert">{fieldErrors.category}</p>}
                <label htmlFor="template-description">Description <span className="required" aria-hidden="true">*</span></label><textarea id="template-description" required aria-required="true" rows="7" value={fields.description} onChange={(e) => changeField("description", e.target.value)} placeholder="Describe the layout, style and job seekers who may benefit." aria-invalid={Boolean(fieldErrors.description)} /><div className="creator-character-count">{fields.description.trim() ? fields.description.trim().split(/\s+/).length : 0} / 500 words (100 minimum)</div>{fieldErrors.description && <p className="creator-error-text" role="alert">{fieldErrors.description}</p>}
                <label htmlFor="template-suitable">Best Suited For <span className="optional">Optional</span></label><select id="template-suitable" value={fields.suitableFor} onChange={(e) => changeField("suitableFor", e.target.value)}><option value="">Select an audience (optional)</option>{SUITABLE_FOR.map((audience) => <option key={audience}>{audience}</option>)}</select>
              </div>
            </section>
            <section className="creator-panel" aria-labelledby="pricing-title"><div className="creator-panel-heading"><div><h2 id="pricing-title">Pricing and earnings</h2><p>Illustrative gross amounts before payment fees, taxes, refunds and other costs.</p></div></div>
              <label htmlFor="template-price">Template price <span className="required" aria-hidden="true">*</span></label><select id="template-price" required aria-required="true" value={fields.price} onChange={(e) => changeField("price", e.target.value)} aria-invalid={Boolean(fieldErrors.price)}>{COMMISSION_OPTIONS.map((price) => <option key={price} value={price}>₹{price}</option>)}</select>
              {commission && <div className="creator-commission-grid"><div><span>Creator Earnings (60%)</span><strong>{formatRupees(commission.creatorPaise)}</strong></div><div><span>JobKhojo Platform Share (40%)</span><strong>{formatRupees(commission.platformPaise)}</strong></div></div>}{fieldErrors.price && <p className="creator-error-text">{fieldErrors.price}</p>}
            </section>
            <section className="creator-panel"><label className="creator-rights-check"><input type="checkbox" required aria-required="true" checked={rightsAccepted} onChange={(e) => setRightsAccepted(e.target.checked)} /><span>{RIGHTS_TEXT} <span className="required" aria-hidden="true">*</span></span></label>{fieldErrors.rights && <p className="creator-error-text" role="alert">{fieldErrors.rights}</p>}</section>
            <div className="creator-submit-actions"><button className="btn btn-primary btn-lg" type="submit" disabled={busy || Boolean(file && previewStatus === "loading")}>{editingRecord ? "Save Changes" : "Preview Submission"}</button><small>{editingRecord ? "Edits keep the current review status." : "We will show a final review before saving this record in your browser."}</small></div>
          </div>
          <aside className="creator-upload-right">
            <section className="creator-panel creator-live-summary"><div className="creator-panel-heading"><div><h2>Submission summary</h2><p>Updates as you fill out the form.</p></div></div>
              <dl><dt>PDF filename</dt><dd>{file?.name || editingRecord?.filename || "Not selected"}</dd><dt>Template name</dt><dd>{fields.name.trim() || "Not entered"}</dd><dt>Category</dt><dd>{fields.category || "Not selected"}</dd><dt>Price</dt><dd>{commission ? formatRupees(commission.pricePaise) : "Invalid price"}</dd><dt>Creator share (60%)</dt><dd>{commission ? formatRupees(commission.creatorPaise) : "—"}</dd><dt>JobKhojo share (40%)</dt><dd>{commission ? formatRupees(commission.platformPaise) : "—"}</dd><dt>Preview status</dt><dd>{editingRecord && !file ? "PDF unavailable" : previewStatus === "ready" ? `Ready${pageCount ? ` · ${pageCount} pages` : ""}` : previewStatus === "loading" ? "Rendering…" : previewStatus === "error" ? "Preview error" : "Waiting for PDF"}</dd><dt>Rights declaration</dt><dd>{rightsAccepted ? "Confirmed" : "Not confirmed"}</dd></dl>
              <p className="creator-gross-note">Gross illustrative amounts before payment fees, taxes, refunds and other costs.</p>
            </section>
            <section className="creator-panel creator-pdf-panel"><div className="creator-panel-heading"><div><h2>PDF preview</h2><p>{pageCount ? `${pageCount} page${pageCount === 1 ? "" : "s"} detected` : "First page preview"}</p></div>{file && previewStatus === "ready" && <button type="button" className="icon-button" aria-label="Enlarge PDF preview" onClick={() => setModal("pdf")}><Maximize2 size={18} /></button>}</div>
              {!file ? <div className="creator-empty-preview"><FileText size={30} aria-hidden="true" /><span>{editingRecord ? "Select Replace PDF above to restore this file and preview it. Listing edits can still be saved." : "Your PDF preview will appear here."}</span></div> : <PdfPreview file={file} onPageCount={handlePdfPageCount} />}
              {file && previewStatus === "error" && <p className="creator-error-text">No preview is available for this file.</p>}
            </section>
          </aside>
        </form>
      </>}
    </CreatorStudioLayout>
    {modal === "pdf" && file && <PreviewModal file={file} onClose={closeModal} />}
    {modal === "confirm" && commission && (file || editingRecord) && <ConfirmationModal fields={fields} file={file || { name: editingRecord.filename || "Existing PDF" }} commission={commission} onBack={closeModal} onConfirm={confirmSubmission} busy={busy} isEditing={Boolean(editingRecord)} />}
  </>;
}

export default function CreatorTemplateUpload() {
  const [authReady, setAuthReady] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
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
  if (!authReady) return <main className="container guide-page"><p role="status">Checking your Creator Studio session…</p></main>;
  if (!authenticated) return <Navigate to="/creator/dashboard" replace />;
  return <CreatorTemplateUploadContent />;
}
