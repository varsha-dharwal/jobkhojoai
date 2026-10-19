import ProtectedRoute from "../../components/ProtectedRoute";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import api from "../../api/client";

const TOPIC_LABELS = {
  general: "General question",
  "job-report": "Report a job",
  correction: "Correction",
  partnership: "Employers & partnerships",
};

function AdminMessagesPage(){
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  function load(){
    setLoading(true);
    api.get("/contact")
      .then(res => setMessages(res.data))
      .catch(() => setError("Couldn't load messages. The server may be waking up, so refresh in a few seconds."))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function toggleHandled(msg){
    await api.patch(`/contact/${msg._id}`, { handled: !msg.handled });
    load();
  }

  async function remove(msg){
    if (!confirm("Delete this message permanently?")) return;
    await api.delete(`/contact/${msg._id}`);
    load();
  }

  const waiting = messages.filter(m => !m.handled).length;

  return (
    <main className="container" style={{paddingTop:32, paddingBottom:60, maxWidth:860}}>
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8, gap:12, flexWrap:"wrap"}}>
        <h1 style={{fontSize:22}}>Messages</h1>
        <Link to="/admin/jobs" className="btn btn-ghost">← Manage Jobs</Link>
      </div>
      <p style={{fontSize:14, color:"var(--color-text-secondary)", margin:"0 0 20px"}}>
        Sent through the contact form on jobkhojoai.com/contact. {!loading && `${waiting} waiting for a reply.`} Reply from your own email to the sender's address.
      </p>

      {loading && <p style={{color:"var(--color-text-tertiary)"}}>Loading…</p>}
      {error && <p style={{color:"var(--color-danger)"}}>{error}</p>}
      {!loading && !error && messages.length === 0 && <p style={{color:"var(--color-text-tertiary)"}}>No messages yet.</p>}

      {messages.map(msg => (
        <article key={msg._id} className="card" style={{padding:16, marginBottom:10, opacity: msg.handled ? 0.65 : 1}}>
          <div style={{display:"flex", justifyContent:"space-between", gap:12, flexWrap:"wrap", marginBottom:8}}>
            <div>
              <strong>{msg.name}</strong> · <a href={`mailto:${msg.email}`}>{msg.email}</a>
              <div style={{fontSize:13, color:"var(--color-text-tertiary)"}}>
                {TOPIC_LABELS[msg.topic] || msg.topic} · {new Date(msg.createdAt).toLocaleString("en-IN")}
                {msg.pageUrl && <> · about <a href={msg.pageUrl} target="_blank" rel="noopener noreferrer">{msg.pageUrl.replace(/^https?:\/\/[^/]+/, "")}</a></>}
              </div>
            </div>
            <div style={{display:"flex", gap:8, flexWrap:"wrap"}}>
              <button className="btn btn-ghost btn-sm" onClick={() => toggleHandled(msg)}>{msg.handled ? "Mark as open" : "Mark as done"}</button>
              <button className="btn btn-danger btn-sm" onClick={() => remove(msg)}>Delete</button>
            </div>
          </div>
          <p style={{margin:0, whiteSpace:"pre-wrap"}}>{msg.message}</p>
        </article>
      ))}
    </main>
  );
}

export default function AdminMessages(){
  return <ProtectedRoute><AdminMessagesPage /></ProtectedRoute>;
}
