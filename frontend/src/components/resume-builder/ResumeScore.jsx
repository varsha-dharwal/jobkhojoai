import { useEffect, useState } from "react";
import api from "../../api/client";
import JdMatch from "./JdMatch";

function readinessLabel(total) {
  if (total >= 85) return "Strong";
  if (total >= 65) return "Good — a few improvements recommended";
  return "Needs work";
}

const SEVERITY_ORDER = { important: 0, recommended: 1, passed: 2 };
const SEVERITY_LABEL = { important: "🔴 Important", recommended: "🟡 Recommended", passed: "🟢 Passed" };

export default function ResumeScore({ resume, onEditStep, onDownload }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    api.post("/resume-ai/resume-score", { resume })
      .then((res) => { if (!cancelled) setData(res.data); })
      .catch((err) => { if (!cancelled) setError(err.response?.data?.message || "Could not check your resume right now."); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <div className="card resume-step-card"><p>Checking your resume…</p></div>;
  if (error) return <div className="card resume-step-card"><p role="alert" style={{ color: "var(--color-danger)" }}>{error}</p></div>;
  if (!data) return null;

  const grouped = [...data.feedback].sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]);
  const isReady = data.total >= 85;

  return (
    <div>
      <div className="card resume-step-card resume-score-summary">
        {isReady ? <h2>🎉 Your Resume is Ready</h2> : <h2>Resume Readiness Score</h2>}
        <p className="resume-score-total">{data.total}/100</p>
        <p className="guide-prose">{readinessLabel(data.total)}</p>
      </div>

      <div className="card resume-step-card">
        <h3>Score Breakdown</h3>
        <div className="guide-table-wrap">
          <table className="guide-table">
            <thead><tr><th>Check</th><th>Score</th></tr></thead>
            <tbody>
              {data.categories.map((c) => (
                <tr key={c.name}><td>{c.name}</td><td>{c.score}/{c.max}</td></tr>
              ))}
              <tr><td>Total</td><td>{data.total}/100</td></tr>
            </tbody>
          </table>
        </div>
        <p className="guide-prose" style={{ marginTop: 16, fontSize: 13 }}>
          The score evaluates resume structure, completeness, readability and content quality. It does not
          guarantee selection by an employer or ATS.
        </p>
      </div>

      <div className="card resume-step-card">
        <h3>Feedback</h3>
        {grouped.map((item, i) => (
          <div key={i} className={`resume-feedback-item resume-feedback-${item.severity}`}>
            <span className="resume-feedback-severity">{SEVERITY_LABEL[item.severity]}</span>
            <p>{item.severity === "passed" ? `✓ ${item.message}` : item.message}</p>
            {item.severity !== "passed" && (
              <button type="button" className="btn-ghost-link" onClick={() => onEditStep(item.section)}>
                Fix this
              </button>
            )}
          </div>
        ))}
      </div>

      <JdMatch resume={resume} />

      {isReady && (
        <div className="guide-cta" style={{ marginTop: 24 }}>
          <h2>🎉 Your Resume is Ready</h2>
          <p>Resume Readiness {data.total}/100 — {readinessLabel(data.total)}</p>
          <button type="button" className="btn btn-primary" onClick={onDownload}>Download PDF — FREE</button>
        </div>
      )}
      {!isReady && (
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <button type="button" className="btn btn-primary" onClick={onDownload}>Download PDF — FREE</button>
        </div>
      )}
    </div>
  );
}
