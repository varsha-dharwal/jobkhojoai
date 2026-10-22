import { Eye, Pencil } from "lucide-react";
import { Link } from "react-router";
import { formatRupees } from "../../data/creatorSubmissions";

function StatusBadge({ status }) {
  return <span className={`creator-status creator-status-${status === "Approved" ? "approved" : status === "Rejected" ? "rejected" : "pending"}`}>{status}</span>;
}

export default function CreatorTemplateTable({ templates, onPreview }) {
  if (!templates.length) return <div className="creator-templates-empty"><h3>No submissions yet</h3><p>Upload a resume template PDF to create your first listing.</p><a className="btn btn-primary" href="/creator/templates/new">Upload New Template</a></div>;
  return <div className="creator-template-table-wrap"><table className="creator-template-table">
    <thead><tr><th scope="col">Preview</th><th scope="col">Template Name</th><th scope="col">Category</th><th scope="col">Price</th><th scope="col">Creator share</th><th scope="col">JobKhojo share</th><th scope="col">Submitted</th><th scope="col">Status</th><th scope="col">Actions</th></tr></thead>
    <tbody>{templates.map((template) => <tr key={template.id}>
      <td data-label="Preview"><button className="creator-thumbnail" type="button" onClick={() => onPreview(template)} disabled={!template.pdfAvailable} aria-label={template.pdfAvailable ? `Preview ${template.name}` : `PDF unavailable for ${template.name}`}><span /><span /><span /><span /></button></td>
      <td data-label="Template Name" className="creator-template-name">{template.name}</td>
      <td data-label="Category">{template.category}</td>
      <td data-label="Price">₹{template.price}</td>
      <td data-label="Creator share">{formatRupees(template.creatorSharePaise)}</td>
      <td data-label="JobKhojo share">{formatRupees(template.platformSharePaise)}</td>
      <td data-label="Submitted">{new Date(template.submittedAt).toLocaleDateString()}</td>
      <td data-label="Status"><StatusBadge status={template.status} />{template.status === "Rejected" && (template.reviewReason || template.reviewNotes) && <p className="creator-rejection-note"><strong>Review feedback:</strong> {[template.reviewReason, template.reviewNotes].filter(Boolean).join(" — ")}</p>}</td>
      <td data-label="Actions"><div className="creator-row-actions">{template.pdfAvailable ? <button type="button" onClick={() => onPreview(template)}><Eye size={15} aria-hidden="true" /> Preview</button> : <span className="creator-muted-action" title="Saved PDF could not be retrieved. Edit the template to replace its PDF.">PDF unavailable</span>}<Link to={`/creator/templates/new?edit=${encodeURIComponent(template.id)}`}><Pencil size={15} aria-hidden="true" /> Edit</Link></div></td>
    </tr>)}</tbody>
  </table></div>;
}
