import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/client";

export default function AdminLogin(){
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e){
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("jobkhojoai_token", res.data.token);
      navigate("/admin/jobs");
    } catch {
      setError("Incorrect email or password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container" style={{paddingTop:60, maxWidth:360}}>
      <h1 style={{fontSize:22, marginBottom:20}}>Admin Login</h1>
      <form onSubmit={handleSubmit} style={{display:"flex", flexDirection:"column", gap:16}}>
        <div>
          <label>Email</label>
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Password</label>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
        </div>
        {error && <p style={{color:"var(--color-danger)", fontSize:13}}>{error}</p>}
        <button className="btn btn-primary" disabled={loading}>{loading ? "Logging in…" : "Login"}</button>
      </form>
    </main>
  );
}
