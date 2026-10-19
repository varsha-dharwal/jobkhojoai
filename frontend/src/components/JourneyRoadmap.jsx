import { slugify } from "../utils/slugify";

// Vertical, numbered career path: each step lists the topics to learn in that stage.
// All content comes straight from the steps prop (data/roadmaps.js). A step may also
// carry `guide: { why, time, project, resources: [{ label, url }] }` — the written
// explanation shown under the stage title.

function StepGuide({ guide }){
  if (!guide) return null;
  return (
    <div className="path-step-guide">
      {guide.why && <p>{guide.why}</p>}
      <dl>
        {guide.time && <div><dt>Time needed</dt><dd>{guide.time}</dd></div>}
        {guide.project && <div><dt>Build this</dt><dd>{guide.project}</dd></div>}
        {guide.resources?.length > 0 && (
          <div>
            <dt>Free resources</dt>
            <dd>{guide.resources.map((r, i) => (
              <span key={r.url}>{i > 0 && " · "}<a href={r.url} target="_blank" rel="noopener noreferrer">{r.label}</a></span>
            ))}</dd>
          </div>
        )}
      </dl>
    </div>
  );
}
export default function JourneyRoadmap({ steps }){
  return (
    <ol className="path-steps">
      {steps.map((step, i) => (
        <li key={step.title} id={slugify(step.title)} className="path-step">
          <span className="path-step-num" aria-hidden="true">{i + 1}</span>
          <div className="path-step-body">
            <h3>{step.title}</h3>
            {step.description && <p className="path-step-desc">{step.description}</p>}
            <StepGuide guide={step.guide} />
            {step.topics?.map(group => (
              <div key={group.subject} className="path-step-topics">
                {step.topics.length > 1 && <p className="path-step-subject">{group.subject}</p>}
                <ul className="chip-list">
                  {group.items.map(item => <li key={item} className="chip chip-quiet">{item}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </li>
      ))}
    </ol>
  );
}
