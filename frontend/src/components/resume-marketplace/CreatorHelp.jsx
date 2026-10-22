import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Search, Send, TicketCheck } from "lucide-react";
import { API_BASE } from "../../lib/api";
import { getUserToken } from "../../utils/userAuth";

const FAQ_CATEGORIES = [
  "Account & Profile",
  "Uploading Resume Templates",
  "Template Review & Approval",
  "Pricing & Commission",
  "Earnings & Sales",
  "Payout Requests",
  "Technical Issues",
];

const ISSUE_CATEGORIES = [
  ["account-profile", "Account & Profile"],
  ["template-upload-preview", "Template Upload or PDF Preview"],
  ["template-review", "Template Review"],
  ["earnings-sales", "Earnings & Sales"],
  ["payouts", "Payouts"],
  ["technical-issue", "Technical Issue"],
  ["other", "Other"],
];

const CATEGORY_LABELS = Object.fromEntries(ISSUE_CATEGORIES);
const STATUSES = ["Open", "In Progress", "Resolved"];
const DATE_FORMAT = new Intl.DateTimeFormat(undefined, { year: "numeric", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });

const FAQS = [
  { category: "Account & Profile", question: "How do I update my creator profile?", answer: "Open Profile in Creator Studio, choose Edit Profile, update your details, and save. Profile fields are stored in this browser; your sign-in identity is managed separately." },
  { category: "Uploading Resume Templates", question: "How do I upload a resume template?", answer: "Choose Upload New Template, complete the listing details, select a supported PDF, review the preview and pricing split, then submit. The submission and PDF are saved in this browser." },
  { category: "Uploading Resume Templates", question: "Which template formats are supported?", answer: "The current Creator Studio upload flow accepts PDF files for template previews. Other document formats and server-side file uploads are not supported." },
  { category: "Template Review & Approval", question: "How can I check my template review status?", answer: "Open My Templates to see the status stored with each submission. Review updates are stored in this browser and are not synchronized to a shared service." },
  { category: "Pricing & Commission", question: "How is the 60/40 commission calculated?", answer: "For eligible sale records, 60% of the gross sale is allocated to the creator and 40% to JobKhojo. Amounts are calculated in paise. Uploading or listing a template does not create a sale." },
  { category: "Earnings & Sales", question: "Why is my earnings balance zero?", answer: "Earnings are based on eligible sales records, not template uploads or listed prices. If no eligible sales are recorded for your signed-in creator, available earnings show zero." },
  { category: "Payout Requests", question: "How do I submit a payout request?", answer: "Open Payouts and request an amount within the available balance. Requests are saved in browser storage and reserve that balance. No payment is sent, and the project has no payout provider configured." },
  { category: "Technical Issues", question: "Will a support request email JobKhojo?", answer: "After a support ticket is saved, the backend sends a notification to hello@jobkhojoai.com when Resend is configured. If delivery fails, the ticket remains saved and you can retry the email from ticket details. No reply or status-change email is currently sent." },
  { category: "Payout Requests", question: "Can I add bank or UPI details or receive a transfer?", answer: "No. The project does not have a payout provider or secure payout-details backend. Do not enter bank or UPI information here. Real creator payouts are deferred until buyer-side payments are integrated." },
  { category: "Technical Issues", question: "What should I do if a PDF preview fails?", answer: "Check that the selected file is a readable PDF and try selecting it again from Upload New Template. Preview files are stored locally in this browser; clearing site storage or using another browser can make them unavailable." },
];

function formatDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Date unavailable" : DATE_FORMAT.format(date);
}

async function supportRequest(path, options = {}) {
  const token = getUserToken();
  if (!token) throw new Error("Sign in to access your support requests.");
  const response = await fetch(`${API_BASE}/creator-support${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, ...options.headers },
    signal: AbortSignal.timeout(20_000),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.message || "The support service could not complete the request.");
    error.ticketSaved = Boolean(data.ticketSaved);
    error.ticket = data.ticket || null;
    throw error;
  }
  return data;
}

function TicketDialog({ ticket, onClose, onRetryEmail, retrying, retryError }) {
  const dialogRef = useRef(null);
  useEffect(() => {
    const previousFocus = document.activeElement;
    const closeOnEscape = (event) => { if (event.key === "Escape") onClose(); };
    document.addEventListener("keydown", closeOnEscape);
    dialogRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      previousFocus?.focus?.();
    };
  }, [onClose]);

  if (!ticket) return null;
  return <div className="creator-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section ref={dialogRef} tabIndex={-1} className="creator-modal creator-support-dialog" role="dialog" aria-modal="true" aria-labelledby="creator-support-dialog-title">
      <header><div><p className="eyebrow">{ticket.ticketId}</p><h2 id="creator-support-dialog-title">{ticket.subject}</h2></div><button className="icon-button" type="button" aria-label="Close ticket details" onClick={onClose}>×</button></header>
      <div className="creator-support-dialog-content">
        <dl className="creator-support-ticket-meta"><div><dt>Status</dt><dd><span className={`creator-support-status status-${ticket.status.toLowerCase().replaceAll(" ", "-")}`}>{ticket.status}</span></dd></div><div><dt>Category</dt><dd>{CATEGORY_LABELS[ticket.category] || ticket.category}</dd></div><div><dt>Created</dt><dd>{formatDate(ticket.createdAt)}</dd></div><div><dt>Last updated</dt><dd>{formatDate(ticket.updatedAt)}</dd></div>{ticket.relatedTemplateId && <div><dt>Related template ID</dt><dd>{ticket.relatedTemplateId}</dd></div>}</dl>
        <section><h3>Your message</h3><p className="creator-support-description">{ticket.description}</p></section>
        {ticket.notificationStatus === "failed" && <div className="creator-support-message error" role="status"><p>The ticket is saved, but its email notification was not delivered.</p><button className="btn btn-secondary" type="button" onClick={() => onRetryEmail(ticket.ticketId)} disabled={retrying}>{retrying ? "Retrying email…" : "Retry email to hello@jobkhojoai.com"}</button>{retryError && <p role="alert">{retryError}</p>}</div>}
        <section><h3>Support responses</h3>{ticket.responses?.length ? <ol className="creator-support-responses">{ticket.responses.map((response, index) => <li key={`${response.createdAt}-${index}`}><p>{response.body}</p><time dateTime={response.createdAt}>{formatDate(response.createdAt)}</time></li>)}</ol> : <p className="creator-support-no-response">No response yet. Ticket status and replies do not send additional emails yet.</p>}</section>
      </div>
      <footer><button className="btn btn-secondary" type="button" onClick={onClose}>Close</button></footer>
    </section>
  </div>;
}

export default function CreatorHelp() {
  const [tab, setTab] = useState("help-center");
  const [faqQuery, setFaqQuery] = useState("");
  const [faqCategory, setFaqCategory] = useState("all");
  const [ticketQuery, setTicketQuery] = useState("");
  const [ticketStatus, setTicketStatus] = useState("all");
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [form, setForm] = useState({ subject: "", category: "technical-issue", description: "", relatedTemplateId: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [notificationWarning, setNotificationWarning] = useState("");
  const [retryingTicketId, setRetryingTicketId] = useState("");
  const [retryError, setRetryError] = useState("");
  const submitRef = useRef(false);
  const closeTicket = useCallback(() => setSelectedTicket(null), []);

  const refreshTickets = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      const records = await supportRequest("");
      setTickets(Array.isArray(records) ? records : []);
    } catch (error) {
      setLoadError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refreshTickets(); }, [refreshTickets]);

  const filteredFaqs = useMemo(() => {
    const query = faqQuery.trim().toLowerCase();
    return FAQS.filter((item) => (faqCategory === "all" || item.category === faqCategory) && (!query || `${item.question} ${item.answer} ${item.category}`.toLowerCase().includes(query)));
  }, [faqQuery, faqCategory]);

  const filteredTickets = useMemo(() => {
    const query = ticketQuery.trim().toLowerCase();
    return tickets.filter((ticket) => (ticketStatus === "all" || ticket.status === ticketStatus) && (!query || `${ticket.ticketId} ${ticket.subject}`.toLowerCase().includes(query)));
  }, [tickets, ticketQuery, ticketStatus]);

  function updateForm(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
    setSubmitError("");
    setConfirmation("");
    setNotificationWarning("");
  }

  async function submitTicket(event) {
    event.preventDefault();
    if (submitRef.current) return;
    const nextErrors = {};
    const subject = form.subject.trim();
    const description = form.description.trim();
    if (subject.length < 5 || subject.length > 120) nextErrors.subject = "Subject must be between 5 and 120 characters.";
    if (!ISSUE_CATEGORIES.some(([value]) => value === form.category)) nextErrors.category = "Choose a support category.";
    if (description.length < 20 || description.length > 2000) nextErrors.description = "Description must be between 20 and 2000 characters.";
    if (form.relatedTemplateId.trim().length > 120) nextErrors.relatedTemplateId = "Template ID must be 120 characters or fewer.";
    setErrors(nextErrors);
    setSubmitError("");
    setConfirmation("");
    setNotificationWarning("");
    if (Object.keys(nextErrors).length) {
      const firstInvalid = ["subject", "category", "description", "relatedTemplateId"].find((key) => nextErrors[key]);
      const fieldIds = { subject: "creator-support-subject", category: "creator-support-category", description: "creator-support-description", relatedTemplateId: "creator-support-template-id" };
      document.getElementById(fieldIds[firstInvalid])?.focus();
      return;
    }

    submitRef.current = true;
    setSubmitting(true);
    try {
      const ticket = await supportRequest("", { method: "POST", body: JSON.stringify({ ...form, subject, description, relatedTemplateId: form.relatedTemplateId.trim() }) });
      setTickets((current) => [ticket, ...current.filter((item) => item.ticketId !== ticket.ticketId)]);
      setConfirmation(`Support request ${ticket.ticketId} was saved and its notification email was sent to hello@jobkhojoai.com.`);
      setForm({ subject: "", category: "technical-issue", description: "", relatedTemplateId: "" });
      setTab("my-tickets");
      setSelectedTicket(ticket);
    } catch (error) {
      if (error.ticketSaved && error.ticket) {
        setTickets((current) => [error.ticket, ...current.filter((item) => item.ticketId !== error.ticket.ticketId)]);
        setNotificationWarning(error.message);
        setForm({ subject: "", category: "technical-issue", description: "", relatedTemplateId: "" });
        setTab("my-tickets");
        setSelectedTicket(error.ticket);
      } else {
        setSubmitError(error.message || "Your request could not be saved. Please try again.");
      }
    } finally {
      submitRef.current = false;
      setSubmitting(false);
    }
  }

  async function retryEmail(ticketId) {
    if (retryingTicketId) return;
    setRetryingTicketId(ticketId);
    setRetryError("");
    try {
      const ticket = await supportRequest(`/${encodeURIComponent(ticketId)}/retry-email`, { method: "POST" });
      setTickets((current) => [ticket, ...current.filter((item) => item.ticketId !== ticket.ticketId)]);
      setSelectedTicket(ticket);
      setNotificationWarning("");
      setConfirmation(`Email notification for ${ticket.ticketId} was delivered to hello@jobkhojoai.com.`);
    } catch (error) {
      setRetryError(error.message || "Email retry failed. Please try again.");
    } finally {
      setRetryingTicketId("");
    }
  }

  return <div className="creator-help-page">
    <section className="creator-panel creator-help-intro"><div><p className="eyebrow">Creator Studio · Support</p><h2>Help &amp; Support</h2><p>Find answers, report an issue, and track your support requests.</p></div><span className="creator-demo-pill">Authenticated support</span></section>

    <div className="creator-help-tabs" role="tablist" aria-label="Help and support sections">
      {[ ["help-center", "Help Center"], ["contact-support", "Contact Support"], ["my-tickets", "My Support Tickets"] ].map(([id, label]) => <button key={id} type="button" role="tab" id={`creator-help-tab-${id}`} aria-selected={tab === id} aria-controls={`creator-help-panel-${id}`} className={tab === id ? "is-active" : ""} onClick={() => setTab(id)}>{label}{id === "my-tickets" && tickets.length > 0 ? <span className="creator-help-count">{tickets.length}</span> : null}</button>)}
    </div>
    {confirmation && <p className="creator-support-message success" role="status">{confirmation}</p>}
    {notificationWarning && <p className="creator-support-message error" role="alert">{notificationWarning}</p>}

    {tab === "help-center" && <section className="creator-panel" role="tabpanel" id="creator-help-panel-help-center" aria-labelledby="creator-help-tab-help-center">
      <div className="creator-panel-heading"><div><h2>Frequently Asked Questions</h2><p>Answers reflect features currently available in Creator Studio.</p></div></div>
      <div className="creator-help-filters"><label className="creator-help-search"><span>Search FAQs</span><span className="creator-help-search-input"><Search size={17} aria-hidden="true" /><input type="search" value={faqQuery} onChange={(event) => setFaqQuery(event.target.value)} placeholder="Search questions or answers" /></span></label><label><span>Category</span><select value={faqCategory} onChange={(event) => setFaqCategory(event.target.value)}><option value="all">All categories</option>{FAQ_CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}</select></label></div>
      {filteredFaqs.length ? <div className="creator-help-faq-list">{filteredFaqs.map((item) => <details key={item.question} className="creator-help-faq"><summary><span>{item.question}</span><small>{item.category}</small></summary><p>{item.answer}</p></details>)}</div> : <div className="creator-help-empty"><strong>No FAQs found</strong><p>Try a different search or category.</p><button className="btn btn-secondary" type="button" onClick={() => { setFaqQuery(""); setFaqCategory("all"); }}>Clear filters</button></div>}
    </section>}

    {tab === "contact-support" && <section className="creator-panel" role="tabpanel" id="creator-help-panel-contact-support" aria-labelledby="creator-help-tab-contact-support">
      <div className="creator-panel-heading"><div><h2>Contact Support</h2><p>Submitting a request saves a ticket and emails a notification to hello@jobkhojoai.com when Resend is available. Attachments are not supported.</p></div></div>
      <form className="creator-support-form" onSubmit={submitTicket} noValidate>
        <label htmlFor="creator-support-subject">Subject <span className="required">Required · 5–120 characters</span><input id="creator-support-subject" name="subject" value={form.subject} onChange={updateForm} placeholder="e.g. My PDF preview is not opening" minLength={5} maxLength={120} required aria-invalid={Boolean(errors.subject)} aria-describedby={errors.subject ? "creator-support-subject-error" : "creator-support-subject-hint"} /></label>
        <small id="creator-support-subject-hint" className="creator-support-hint">Briefly summarize the issue.</small>
        {errors.subject && <p id="creator-support-subject-error" className="creator-error-text" role="alert">{errors.subject}</p>}
        <label htmlFor="creator-support-category">Issue category <span className="required">Required</span><select id="creator-support-category" name="category" value={form.category} onChange={updateForm} required aria-invalid={Boolean(errors.category)} aria-describedby={errors.category ? "creator-support-category-error" : undefined}>{ISSUE_CATEGORIES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
        {errors.category && <p id="creator-support-category-error" className="creator-error-text" role="alert">{errors.category}</p>}
        <label htmlFor="creator-support-description">Describe the issue <span className="required">Required · 20–2,000 characters</span><textarea id="creator-support-description" name="description" rows={7} value={form.description} onChange={updateForm} placeholder="Tell us what happened and what you expected to happen. Please do not paste the full instructions or unrelated personal information." minLength={20} maxLength={2000} required aria-invalid={Boolean(errors.description)} aria-describedby={errors.description ? "creator-support-description-error creator-support-description-count" : "creator-support-description-count"} /></label>
        <small id="creator-support-description-count" className="creator-support-hint">{form.description.length}/2000 characters · at least 20 required</small>
        {errors.description && <p id="creator-support-description-error" className="creator-error-text" role="alert">{errors.description}</p>}
        <label htmlFor="creator-support-template-id">Related template ID <span className="optional">Optional</span><input id="creator-support-template-id" name="relatedTemplateId" value={form.relatedTemplateId} onChange={updateForm} maxLength={120} aria-invalid={Boolean(errors.relatedTemplateId)} /></label>
        {errors.relatedTemplateId && <p className="creator-error-text" role="alert">{errors.relatedTemplateId}</p>}
        {submitError && <p className="creator-support-message error" role="alert">{submitError}</p>}
        <div className="creator-support-submit"><button className="btn btn-primary" type="submit" disabled={submitting}><Send size={16} aria-hidden="true" />{submitting ? "Submitting request…" : "Submit Support Request"}</button><small>Requests are linked to your signed-in account and stored on the JobKhojo backend. No attachment is accepted.</small></div>
      </form>
    </section>}

    {tab === "my-tickets" && <section className="creator-panel" role="tabpanel" id="creator-help-panel-my-tickets" aria-labelledby="creator-help-tab-my-tickets">
      <div className="creator-panel-heading"><div><h2>My Support Tickets</h2><p>Your requests are loaded from the account-scoped support API.</p></div><button type="button" className="btn btn-secondary" onClick={refreshTickets} disabled={loading}>{loading ? "Refreshing…" : "Refresh"}</button></div>
      <div className="creator-help-filters creator-ticket-filters"><label><span>Search tickets</span><input type="search" value={ticketQuery} onChange={(event) => setTicketQuery(event.target.value)} placeholder="Ticket ID or subject" /></label><label><span>Status</span><select value={ticketStatus} onChange={(event) => setTicketStatus(event.target.value)}><option value="all">All statuses</option>{STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}</select></label></div>
      {loading ? <p className="creator-help-empty" role="status">Loading your support requests…</p> : loadError ? <div className="creator-help-empty" role="alert"><strong>Could not load tickets</strong><p>{loadError}</p><button className="btn btn-secondary" type="button" onClick={refreshTickets}>Try again</button></div> : tickets.length === 0 ? <div className="creator-help-empty"><TicketCheck size={28} aria-hidden="true" /><strong>No support tickets yet</strong><p>When you submit a support request, it will appear here.</p><button className="btn btn-primary" type="button" onClick={() => setTab("contact-support")}>Create a support request</button></div> : filteredTickets.length === 0 ? <div className="creator-help-empty"><strong>No tickets match those filters</strong><p>Change your search or status filter.</p></div> : <div className="creator-ticket-list">{filteredTickets.map((ticket) => <article className="creator-ticket-card" key={ticket.ticketId}><div><p className="creator-ticket-id">{ticket.ticketId}</p><h3>{ticket.subject}</h3><p className="creator-ticket-meta">{CATEGORY_LABELS[ticket.category] || ticket.category} · Created {formatDate(ticket.createdAt)}</p><p className="creator-ticket-response-preview">{ticket.responses?.length ? `Latest response: ${ticket.responses[ticket.responses.length - 1].body}` : "No response yet"}</p></div><span className={`creator-support-status status-${ticket.status.toLowerCase().replaceAll(" ", "-")}`}>{ticket.status}</span><button type="button" className="creator-text-button" onClick={() => setSelectedTicket(ticket)}>View details</button></article>)}</div>}
      <p className="creator-support-footnote">New tickets email hello@jobkhojoai.com when delivery is configured. Status updates and replies do not send additional emails.</p>
    </section>}

    {selectedTicket && <TicketDialog ticket={selectedTicket} onClose={closeTicket} onRetryEmail={retryEmail} retrying={retryingTicketId === selectedTicket.ticketId} retryError={retryError} />}
  </div>;
}
