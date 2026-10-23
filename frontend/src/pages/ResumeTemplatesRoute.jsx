import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import { Search, X } from "lucide-react";
import SEO from "../components/SEO";
import PdfPreview from "../components/resume-marketplace/PdfPreview";
import MarketplaceTemplatePreview from "../components/resume-builder/MarketplaceTemplatePreview";
import { DEMO_RESUME } from "../data/demoResume";
import { FREE_BUYER_TEMPLATES, getApprovedCreatorTemplates } from "../data/buyerTemplates";
import { loadPdfFromBrowserStorage } from "../data/creatorPdfSession";

const CATEGORIES = ["All", "ATS-Friendly", "Fresher", "Professional", "Tech", "Non-Tech"];
const categoryText = (template) => `${template.category || ""} ${template.suitableFor || ""}`.toLowerCase();

function matchesCategory(template, selected) {
  if (selected === "All") return true;
  const value = categoryText(template);
  if (selected === "ATS-Friendly") return value.includes("ats");
  if (selected === "Fresher") return value.includes("fresher") || value.includes("entry-level") || value.includes("student");
  if (selected === "Professional") return value.includes("professional") || value.includes("experienced");
  if (selected === "Tech") return /tech|developer|software|it &|it\b/.test(value);
  return /non-tech|general|design|creative|business|marketing|finance/.test(value);
}

function FreePreview({ template }) {
  return <MarketplaceTemplatePreview templateId={template.id} resume={{ ...DEMO_RESUME, templateId: template.id }} />;
}

function PreviewDialog({ template, file, onClose }) {
  const isCreator = template.source === "creator";
  useEffect(() => {
    const closeOnEscape = (event) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);
  return <div className="buyer-preview-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section className="buyer-preview-dialog" role="dialog" aria-modal="true" aria-labelledby="buyer-preview-title">
      <header><div><p className="eyebrow">{isCreator ? "Creator template preview" : "Free template preview"}</p><h2 id="buyer-preview-title">{template.name}</h2><p>{template.creatorName ? `By ${template.creatorName} · ` : ""}{template.category} · {isCreator ? `₹${template.price}` : "Free"}</p></div><button type="button" className="icon-button" aria-label="Close preview" onClick={onClose}><X size={20} /></button></header>
      <div className="buyer-preview-document">
        {isCreator ? file ? <PdfPreview file={file} enlarged /> : <p className="buyer-preview-message" role="status">The creator's uploaded PDF is not available in this browser.</p> : <FreePreview template={template} />}
      </div>
      <footer><button type="button" className="btn btn-secondary" onClick={onClose}>Close preview</button></footer>
    </section>
  </div>;
}

function TemplateCard({ template, previewFile, previewError, onPreview, onUse }) {
  const creator = template.source === "creator";
  return <article className="buyer-template-card">
    <div className="buyer-template-art" aria-label={`${template.name} template preview`}>
      {creator
        ? previewFile ? <PdfPreview file={previewFile} /> : <div className="buyer-template-placeholder">{previewError || "Loading creator PDF preview…"}</div>
        : <div className={`buyer-template-mini buyer-template-mini-${template.layout}`}><FreePreview template={template} /></div>}
    </div>
    <div className="buyer-template-info">
      <div className="buyer-template-badges"><span className={creator ? "buyer-price-badge premium" : "buyer-price-badge free"}>{creator ? `PREMIUM · ₹${template.price}` : "FREE"}</span>{creator && <span className="buyer-preview-only-badge">PREVIEW ONLY</span>}</div>
      <h2>{template.name}</h2>
      <p className="buyer-template-description">{template.description || "Preview the creator's uploaded resume design."}</p>
      <p className="buyer-template-meta">{template.category}{creator ? ` · By ${template.creatorName || "JobKhojo creator"}` : " · JobKhojo"}</p>
      <div className="buyer-template-actions">
        <button className="btn btn-secondary" type="button" onClick={() => onPreview(template)}>Preview</button>
        {creator
          ? <button className="btn btn-secondary" type="button" disabled>Editing unavailable</button>
          : <button className="btn btn-primary" type="button" onClick={() => onUse(template)}>Use Free Template</button>}
      </div>
    </div>
  </article>;
}

export default function ResumeTemplatesRoute() {
  const navigate = useNavigate();
  const [category, setCategory] = useState("All");
  const [price, setPrice] = useState("All prices");
  const [query, setQuery] = useState("");
  const [creatorTemplates, setCreatorTemplates] = useState([]);
  const [creatorFiles, setCreatorFiles] = useState({});
  const [creatorErrors, setCreatorErrors] = useState({});
  const [preview, setPreview] = useState(null);

  const refreshCreators = useCallback(() => setCreatorTemplates(getApprovedCreatorTemplates()), []);
  useEffect(() => {
    refreshCreators();
    window.addEventListener("storage", refreshCreators);
    window.addEventListener("creator-submissions-updated", refreshCreators);
    return () => {
      window.removeEventListener("storage", refreshCreators);
      window.removeEventListener("creator-submissions-updated", refreshCreators);
    };
  }, [refreshCreators]);

  useEffect(() => {
    let active = true;
    setCreatorFiles({});
    setCreatorErrors({});
    Promise.all(creatorTemplates.map(async (template) => {
      try {
        const file = await loadPdfFromBrowserStorage(template.pdfId || template.id);
        if (!active) return;
        if (file) setCreatorFiles((current) => ({ ...current, [template.id]: file }));
        else setCreatorErrors((current) => ({ ...current, [template.id]: "PDF unavailable" }));
      } catch {
        if (active) setCreatorErrors((current) => ({ ...current, [template.id]: "PDF unavailable" }));
      }
    }));
    return () => { active = false; };
  }, [creatorTemplates]);

  const templates = useMemo(() => [
    ...FREE_BUYER_TEMPLATES.map((template) => ({ ...template, source: "free", price: 0 })),
    ...creatorTemplates,
  ], [creatorTemplates]);
  const shown = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return templates.filter((template) => {
      const isFree = template.source === "free";
      const text = `${template.name} ${template.description || ""} ${template.category} ${template.suitableFor || ""} ${template.creatorName || ""}`.toLowerCase();
      return (!needle || text.includes(needle)) && matchesCategory(template, category) &&
        (price === "All prices" || (price === "Free" ? isFree : !isFree));
    });
  }, [templates, query, category, price]);

  const resetFilters = () => { setQuery(""); setCategory("All"); setPrice("All prices"); };
  const openPreview = (template) => setPreview({ template, file: creatorFiles[template.id] || null });
  const useFreeTemplate = (template) => navigate(`/career-guide/resume-builder?template=${encodeURIComponent(template.id)}`);

  return <main className="container guide-page buyer-template-page">
    <SEO title="Choose Your Resume Template | JobKhojo" description="Explore free and premium resume designs for your next career move." path="/resume-templates" noindex />
    <div className="buyer-marketplace-return"><Link to="/resume-marketplace">Back to Resume Marketplace</Link></div>
    <header className="buyer-template-heading"><p className="eyebrow">Resume Marketplace</p><h1>Choose Your Resume Template</h1><p>Explore free and premium resume designs for your next career move.</p></header>
    <section className="buyer-template-filters" aria-label="Filter resume templates">
      <label className="buyer-template-search"><Search size={19} aria-hidden="true" /><span className="sr-only">Search templates and categories</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search templates, styles, categories" /></label>
      <div className="buyer-category-filters" aria-label="Template categories">{CATEGORIES.map((item) => <button key={item} type="button" className={category === item ? "active" : ""} aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>)}</div>
      <div className="buyer-template-filter-row"><label>Price<select value={price} onChange={(event) => setPrice(event.target.value)}><option>All prices</option><option>Free</option><option>Premium</option></select></label><button type="button" className="buyer-reset-filters" onClick={resetFilters}>Reset filters</button></div>
    </section>
    {shown.length ? <section className="buyer-template-grid" aria-label="Available resume templates">{shown.map((template) => <TemplateCard key={`${template.source}-${template.id}`} template={template} previewFile={creatorFiles[template.id]} previewError={creatorErrors[template.id]} onPreview={openPreview} onUse={useFreeTemplate} />)}</section> : <section className="buyer-template-empty"><h2>No templates found</h2><p>Try another search or reset the filters.</p><button className="btn btn-secondary" type="button" onClick={resetFilters}>Reset filters</button></section>}
    {preview && <PreviewDialog template={preview.template} file={preview.file} onClose={() => setPreview(null)} />}
  </main>;
}
