import { useEffect, useRef, useState } from "react";
import { MessageCircle, Sparkles, X, Send } from "lucide-react";
import { API_BASE } from "../lib/api";

const GREETING = "Hi! Ask me about jobs on JobKhojo, internships, career paths or job-search advice. I can make mistakes, so double-check important details.";

// A small, optional helper — kept visually quiet so it never competes with search or
// apply actions. Answers come from the backend's Gemini integration.
export default function AskAI(){
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: "assistant", text: GREETING }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const listRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, loading, open]);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = e => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  async function sendMessage(e){
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;
    const history = messages.slice(1);
    setMessages(m => [...m, { role: "user", text }]);
    setInput("");
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history }),
        signal: AbortSignal.timeout(45000),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.reply) throw Object.assign(new Error(), { userMessage: data.message });
      setMessages(m => [...m, { role: "assistant", text: data.reply }]);
    } catch (err) {
      setError(err.userMessage || "The assistant is unavailable right now. Please try again in a minute.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="ask-widget">
      {open && (
        <div className="ask-panel" role="dialog" aria-label="Ask JobKhojo">
          <div className="ask-panel-head">
            <span className="ask-panel-title"><Sparkles size={16} aria-hidden="true" /> Ask JobKhojo <span className="badge-ai">AI</span></span>
            <button type="button" className="icon-button" onClick={() => setOpen(false)} aria-label="Close assistant">
              <X size={18} aria-hidden="true" />
            </button>
          </div>
          <div className="ask-messages" ref={listRef} aria-live="polite">
            {messages.map((m, i) => (
              <p key={i} className={`ask-bubble ask-bubble-${m.role}`}>{m.text}</p>
            ))}
            {loading && <p className="ask-bubble ask-bubble-assistant ask-typing">Thinking…</p>}
            {error && <p className="ask-error" role="alert">{error}</p>}
          </div>
          <form className="ask-input" onSubmit={sendMessage}>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="e.g. Any remote React jobs?"
              aria-label="Your question"
              maxLength={500}
            />
            <button type="submit" className="btn btn-primary btn-icon" disabled={loading || !input.trim()} aria-label="Send">
              <Send size={16} aria-hidden="true" />
            </button>
          </form>
        </div>
      )}
      <button type="button" className="ask-trigger" onClick={() => setOpen(o => !o)} aria-expanded={open} aria-label="Ask JobKhojo assistant">
        <MessageCircle size={18} aria-hidden="true" />
        <span className="ask-trigger-label">Ask</span>
      </button>
    </div>
  );
}
