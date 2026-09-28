import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/client";

const RANGES = [
  { value: "24h", label: "Last 24 hours" },
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
];

const SUMMARY_CARDS = [
  { key: "users", label: "Users active", detail: "Unique signed-in users" },
  { key: "newUsers", label: "New sign-ups", detail: "Accounts created" },
  { key: "returnUsers", label: "Returning users", detail: "Existing users who visited" },
  { key: "appliedUsers", label: "Users who applied", detail: "Unique users · apply clicks" },
];

function csvCell(value){
  let text = String(value ?? "");
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
}

function exportCsv(data){
  const summaryRows = [
    ["JobKhojoAI Today Update", RANGES.find(range => range.value === data.range)?.label || data.range],
    ["Time zone", "Asia/Kolkata"],
    ["Users active", data.summary.users],
    ["New sign-ups", data.summary.newUsers],
    ["Returning users", data.summary.returnUsers],
    ["Users who applied", data.summary.appliedUsers],
    ["Apply clicks", data.summary.applications],
    [],
    ["Daily Summary"],
    ["Date", "Users active", "New sign-ups", "Returning users", "Users who applied", "Apply clicks"],
    ...data.daily.map(day => [day.date, day.users, day.newUsers, day.returnUsers, day.appliedUsers, day.applications]),
    [],
    ["User Activity"],
    ["Date", "Name", "Email", "Phone number", "New User", "Return User", "Applied job by user", "Apply clicks"],
    ...data.rows.map(row => [
      row.date, row.name, row.email, row.phone, row.newUser ? "Yes" : "No", row.returnUser ? "Yes" : "No",
      row.appliedJobs.join(" | "), row.applicationCount,
    ]),
  ];
  const csv = `\uFEFF${summaryRows.map(row => row.map(csvCell).join(",")).join("\r\n")}`;
  const blobUrl = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = `JobKhojoAI-TodayUpdate-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
}

export default function AdminTodayUpdate(){
  const [range, setRange] = useState("24h");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/admin/analytics/today", { params: { range } });
      setData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load user activity. Try again.");
    } finally {
      setLoading(false);
    }
  }, [range]);

  useEffect(() => {
    load();
    const interval = window.setInterval(() => {
      if (document.visibilityState === "visible") load();
    }, 30_000);
    return () => window.clearInterval(interval);
  }, [load]);

  return (
    <main className="container admin-today-page">
      <div className="admin-today-header">
        <div>
          <p className="admin-today-eyebrow">ADMIN ANALYTICS</p>
          <h1>Today Update</h1>
          <p className="admin-today-subtitle">Sign-ups, returning users, and application activity from your database.</p>
        </div>
        <div className="admin-today-controls">
          <Link className="btn btn-ghost" to="/admin/jobs">Manage Jobs</Link>
          <select aria-label="Activity date range" value={range} onChange={event => setRange(event.target.value)}>
            {RANGES.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
          <button type="button" className="btn btn-ghost" onClick={load} disabled={loading}>{loading ? "Refreshing…" : "Refresh"}</button>
          <button type="button" className="btn btn-primary" onClick={() => data && exportCsv(data)} disabled={!data || loading}>Export Excel (CSV)</button>
        </div>
      </div>

      {data && <p className="admin-today-generated">Showing {RANGES.find(option => option.value === range)?.label.toLowerCase()} · Times in India Standard Time · Updated {new Date(data.generatedAt).toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit" })}</p>}
      {error && <div className="admin-today-error" role="alert">{error}</div>}

      <section className="admin-today-cards" aria-label="Activity summary">
        {SUMMARY_CARDS.map(card => (
          <article className="card admin-today-card" key={card.key}>
            <span>{card.label}</span>
            <strong>{loading && !data ? "—" : data?.summary?.[card.key] ?? 0}</strong>
            <small>{card.key === "appliedUsers" && data ? `${data.summary.applications} apply clicks` : card.detail}</small>
          </article>
        ))}
      </section>

      <section className="admin-today-section">
        <div className="admin-today-section-heading"><div><h2>Daily summary</h2><p>Unique user counts grouped by date.</p></div></div>
        <div className="admin-today-table-wrap">
          <table className="admin-today-table">
            <thead><tr><th>Date</th><th>Users active</th><th>New sign-ups</th><th>Returning users</th><th>Users who applied</th><th>Apply clicks</th></tr></thead>
            <tbody>
              {data?.daily.map(day => <tr key={day.date}><td>{day.date}</td><td>{day.users}</td><td>{day.newUsers}</td><td>{day.returnUsers}</td><td>{day.appliedUsers}</td><td>{day.applications}</td></tr>)}
              {!loading && data?.daily.length === 0 && <tr><td className="admin-today-empty" colSpan="6">No user activity in this period yet.</td></tr>}
              {loading && !data && <tr><td className="admin-today-empty" colSpan="6">Loading activity…</td></tr>}
            </tbody>
          </table>
        </div>
      </section>

      <section className="admin-today-section">
        <div className="admin-today-section-heading"><div><h2>User activity</h2><p>One row per user per date. Apply clicks are recorded after sign-in.</p></div><span>{data?.rows.length || 0} rows</span></div>
        <div className="admin-today-table-wrap">
          <table className="admin-today-table admin-today-users-table">
            <thead><tr><th>Date</th><th>Name</th><th>Email</th><th>Phone number</th><th>New User</th><th>Return User</th><th>Applied job by user</th><th>Apply clicks</th></tr></thead>
            <tbody>
              {data?.rows.map((row, index) => <tr key={`${row.email}-${row.date}-${index}`}>
                <td>{row.date}</td><td>{row.name || "—"}</td><td>{row.email || "—"}</td><td>{row.phone || "—"}</td>
                <td><span className={`admin-user-flag ${row.newUser ? "is-yes" : ""}`}>{row.newUser ? "Yes" : "—"}</span></td>
                <td><span className={`admin-user-flag ${row.returnUser ? "is-return" : ""}`}>{row.returnUser ? "Yes" : "—"}</span></td>
                <td>{row.appliedJobs.length ? row.appliedJobs.join(", ") : "—"}</td><td>{row.applicationCount || 0}</td>
              </tr>)}
              {!loading && data?.rows.length === 0 && <tr><td className="admin-today-empty" colSpan="8">No sign-ups or user activity in this period yet.</td></tr>}
              {loading && !data && <tr><td className="admin-today-empty" colSpan="8">Loading user activity…</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
      <p className="admin-today-note">These metrics cover signed-in accounts only. “New User” means account created in the selected period; “Return User” means an existing account visited during the period. Visit and apply activity starts collecting after this update is deployed, so older visits and clicks cannot be reconstructed. Applications count Apply Now clicks, not employer-confirmed submissions.</p>
    </main>
  );
}
