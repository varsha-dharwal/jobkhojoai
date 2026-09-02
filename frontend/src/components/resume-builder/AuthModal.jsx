import { useState } from "react";
import api from "../../api/client";
import { setUserSession } from "../../utils/userAuth";

export default function AuthModal({ onClose, onSuccess }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function set(name, value) {
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const path = mode === "login" ? "/users/login" : "/users/register";
      const res = await api.post(path, form);
      setUserSession(res.data.token, { name: res.data.name, email: res.data.email });
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="card resume-auth-modal" onClick={(e) => e.stopPropagation()}>
        <h3>{mode === "login" ? "Sign in to save your progress" : "Create an account to save your progress"}</h3>
        <form onSubmit={submit}>
          {mode === "register" && (
            <div style={{ marginBottom: 16 }}>
              <label>Name</label>
              <input type="text" value={form.name} onChange={(e) => set("name", e.target.value)} required />
            </div>
          )}
          <div style={{ marginBottom: 16 }}>
            <label>Email</label>
            <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} required />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label>Password</label>
            <input type="password" value={form.password} onChange={(e) => set("password", e.target.value)} required minLength={6} />
          </div>
          {error && <p role="alert" style={{ color: "var(--color-danger)", fontSize: 13, marginBottom: 12 }}>{error}</p>}
          <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: "100%" }}>
            {loading ? "Please wait…" : mode === "login" ? "Sign In" : "Create Account"}
          </button>
        </form>
        <button
          type="button"
          className="btn-ghost-link"
          style={{ marginTop: 12 }}
          onClick={() => setMode(mode === "login" ? "register" : "login")}
        >
          {mode === "login" ? "New here? Create an account" : "Already have an account? Sign in"}
        </button>
        <button type="button" className="btn-ghost-link" style={{ marginTop: 4 }} onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}
