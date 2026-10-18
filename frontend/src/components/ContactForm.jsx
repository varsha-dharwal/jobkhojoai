import { useState } from "react";
import { Send } from "lucide-react";
import { API_BASE } from "../lib/api";
import { CONTACT_EMAIL } from "../lib/site";

const TOPICS = [
  { value: "general", label: "A general question" },
  { value: "job-report", label: "Report a job (closed, wrong or suspicious)" },
  { value: "correction", label: "A correction to a guide or page" },
  { value: "partnership", label: "Employers and partnerships" },
];

// Messages are stored by the API and read in the admin panel (/admin/messages).
export default function ContactForm(){
  const [form, setForm] = useState({ name: "", email: "", topic: "general", pageUrl: "", message: "", website: "" });
  const [status, setStatus] = useState({ state: "idle", text: "" });

  function update(e){
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function submit(e){
    e.preventDefault();
    setStatus({ state: "sending", text: "" });
    try {
      const res = await fetch(`${API_BASE}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        signal: AbortSignal.timeout(40_000),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Something went wrong.");
      setStatus({ state: "sent", text: "Thanks, your message has been sent. We'll reply by email." });
      setForm(f => ({ ...f, pageUrl: "", message: "" }));
    } catch (err) {
      const text = err.name === "TimeoutError"
        ? `The server took too long to respond. Please try again, or email ${CONTACT_EMAIL}.`
        : `${err.message} You can also email ${CONTACT_EMAIL}.`;
      setStatus({ state: "error", text });
    }
  }

  const sending = status.state === "sending";

  return (
    <form className="contact-form panel" onSubmit={submit} noValidate={false}>
      <h2>Send us a message</h2>
      <div className="form-grid-2">
        <div className="field">
          <label htmlFor="cf-name">Your name</label>
          <input id="cf-name" name="name" value={form.name} onChange={update} required maxLength={100} autoComplete="name" />
        </div>
        <div className="field">
          <label htmlFor="cf-email">Email</label>
          <input id="cf-email" name="email" type="email" value={form.email} onChange={update} required maxLength={200} autoComplete="email" />
        </div>
      </div>
      <div className="field">
        <label htmlFor="cf-topic">What is it about?</label>
        <select id="cf-topic" name="topic" value={form.topic} onChange={update}>
          {TOPICS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
      </div>
      {(form.topic === "job-report" || form.topic === "correction") && (
        <div className="field">
          <label htmlFor="cf-page">Link to the job or page</label>
          <input id="cf-page" name="pageUrl" type="url" value={form.pageUrl} onChange={update} placeholder="https://jobkhojoai.com/jobs/…" maxLength={500} />
        </div>
      )}
      <div className="field">
        <label htmlFor="cf-message">Message</label>
        <textarea id="cf-message" name="message" rows={6} value={form.message} onChange={update} required minLength={10} maxLength={5000} />
      </div>
      {/* Hidden from people; bots that fill every field get ignored by the API. */}
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="cf-website">Leave this empty</label>
        <input id="cf-website" name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={update} />
      </div>
      <div className="contact-form-foot">
        <button type="submit" className="btn btn-primary" disabled={sending}>
          <Send size={16} aria-hidden="true" /> {sending ? "Sending…" : "Send message"}
        </button>
        <p className="muted">We use your email only to reply. See our <a href="/privacy-policy">privacy policy</a>.</p>
      </div>
      {status.text && (
        <p role="status" className={status.state === "error" ? "form-status form-status-error" : "form-status form-status-ok"}>{status.text}</p>
      )}
    </form>
  );
}
