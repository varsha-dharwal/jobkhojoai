import { useState } from "react";
import { FileUp, FileText } from "lucide-react";

export default function UploadTemplatePlaceholder() {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("99");
  return <section className="creator-panel creator-upload-panel" aria-labelledby="upload-template-title">
    <div className="creator-panel-heading"><div><p className="eyebrow">Creator Studio</p><h2 id="upload-template-title">Upload New Template</h2><p>Prepare your listing details. Upload and review submission will be enabled in a later step.</p></div></div>
    <div className="creator-demo-banner" role="status">Template uploads and review submissions are not available on this screen.</div>
    <div className="creator-upload-grid">
      <form className="creator-upload-form" onSubmit={(event) => event.preventDefault()}>
        <label>Template name<input type="text" value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Clean Product Designer" maxLength={80} /></label>
        <label>Category<select value={category} onChange={(event) => setCategory(event.target.value)}><option value="">Select a category</option><option>ATS-Friendly</option><option>Professional</option><option>Creative</option><option>Tech</option></select></label>
        <label>Description<textarea rows="4" value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Describe who this template is for" maxLength={400} /></label>
        <label>Sample price<select value={price} onChange={(event) => setPrice(event.target.value)}><option value="99">₹99</option><option value="129">₹129</option><option value="149">₹149</option></select></label>
        <button type="button" className="btn btn-secondary" disabled><FileUp size={17} aria-hidden="true" /> Choose PDF template</button>
        <p className="creator-field-hint">PDF upload is unavailable on this screen. Files are not accepted or stored here.</p>
        <button type="submit" className="btn btn-primary" disabled>Submit for Review</button>
      </form>
      <div className="creator-upload-preview"><p className="creator-preview-label">Listing preview</p><div className="creator-upload-sheet"><FileText size={32} aria-hidden="true" /><strong>{name || "Your template name"}</strong><span>{category || "Choose a category"} · ₹{price}</span><p>{description || "Your description will appear here."}</p><span>PDF preview is unavailable on this screen.</span></div></div>
    </div>
  </section>;
}
