import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import api from "../api/client";
import AiAvatar from "./AiAvatar";

function CloseIcon(){
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 3l10 10M13 3 3 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  );
}

function AskAIIcon(){
  return (
    <svg className="ask-ai-trigger-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3.5 13.4 9l5.1 1.5-5.1 1.5L12 17.5l-1.4-5.5-5.1-1.5L10.6 9 12 3.5Z" fill="currentColor" />
      <path d="m19 15 .6 2.4L22 18l-2.4.6L19 21l-.6-2.4L16 18l2.4-.6L19 15Z" fill="currentColor" opacity=".72" />
    </svg>
  );
}

function TypingDots(){
  return (
    <span className="ai-typing-dots" aria-hidden="true">
      {[0, 0.2, 0.4].map(delay => (
        <motion.span
          key={delay}
          animate={{ opacity: [0.25, 1, 0.25] }}
          transition={{ repeat: Infinity, duration: 1, delay, ease: "easeInOut" }}
        />
      ))}
    </span>
  );
}

const ASSISTANT_NAME = "Ask AI";
const GREETING = "Hi! I'm Ask AI, here to help — ask me anything about jobkhojoAI: jobs, internships, saved jobs, roadmaps, or anything else on the site.";

export default function AskAI(){
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: "assistant", text: GREETING }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const listRef = useRef(null);

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, loading, open]);

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
      const res = await api.post("/ai/chat", { message: text, history });
      setMessages(m => [...m, { role: "assistant", text: res.data.reply }]);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="ask-ai-widget">
      {open && (
        <div className="ask-ai-panel" role="dialog" aria-label={`${ASSISTANT_NAME} — chat`}>
          <div className="ask-ai-header">
            <AiAvatar size={30} />
            <span>{ASSISTANT_NAME}</span>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close chat">
              <CloseIcon />
            </button>
          </div>
          <div className="ask-ai-messages" ref={listRef}>
            {messages.map((m, i) => (
              m.role === "user" ? (
                <div key={i} className="ask-ai-bubble ask-ai-bubble-user">{m.text}</div>
              ) : (
                <div key={i} className="ask-ai-row">
                  <AiAvatar size={26} />
                  <div className="ask-ai-bubble ask-ai-bubble-assistant">{m.text}</div>
                </div>
              )
            ))}
            {loading && (
              <div className="ask-ai-row">
                <AiAvatar size={26} thinking />
                <div className="ask-ai-bubble ask-ai-bubble-assistant"><TypingDots /></div>
              </div>
            )}
            {error && <p className="ask-ai-error" role="alert">{error}</p>}
          </div>
          <form className="ask-ai-input-row" onSubmit={sendMessage}>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask about jobs, roadmaps, saved jobs…"
              aria-label="Ask a question"
              maxLength={500}
            />
            <button type="submit" className="btn btn-primary" disabled={loading || !input.trim()}>Send</button>
          </form>
        </div>
      )}
      <button type="button" className="ask-ai-trigger" onClick={() => setOpen(o => !o)} aria-expanded={open}>
        <AskAIIcon />
        {ASSISTANT_NAME}
      </button>
    </div>
  );
}
