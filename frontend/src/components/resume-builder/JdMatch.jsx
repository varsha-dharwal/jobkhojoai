import { useState } from "react";
import { matchJobDescription } from "../../utils/jdMatch";

function flattenSkills(skills) {
  return Object.values(skills || {}).flat();
}

export default function JdMatch({ resume }) {
  const [jdText, setJdText] = useState("");
  const [result, setResult] = useState(null);

  function check() {
    if (!jdText.trim()) return;
    setResult(matchJobDescription(flattenSkills(resume.skills), jdText));
  }

  return (
    <div className="card resume-jd-match">
      <h3>🎯 Check Against Job Description</h3>
      <textarea
        rows={5}
        placeholder="Paste the job description here…"
        value={jdText}
        onChange={(e) => setJdText(e.target.value)}
      />
      <button type="button" className="btn btn-ghost" onClick={check} disabled={!jdText.trim()} style={{ marginTop: 8 }}>
        Check Match
      </button>

      {result && (
        <div style={{ marginTop: 20 }}>
          <h4>Job Alignment</h4>
          {result.strongMatches.length > 0 && (
            <>
              <p style={{ fontWeight: 600, marginBottom: 6 }}>Strong matches</p>
              <ul className="guide-check-list" style={{ marginBottom: 16 }}>
                {result.strongMatches.map((s) => <li key={s}>{s}</li>)}
              </ul>
            </>
          )}
          {result.notOnResume.length > 0 && (
            <>
              <p style={{ fontWeight: 600, marginBottom: 6 }}>Requirements not found on resume</p>
              <ul className="resume-jd-missing">
                {result.notOnResume.map((s) => <li key={s}>○ {s}</li>)}
              </ul>
            </>
          )}
          <p className="guide-prose" style={{ marginTop: 16, fontSize: 13 }}>
            Only add a missing skill if you genuinely have that skill or experience — don't blindly stuff keywords.
          </p>
        </div>
      )}
    </div>
  );
}
