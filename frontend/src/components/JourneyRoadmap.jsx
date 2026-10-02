import { slugify } from "../utils/slugify";

// Vertical, numbered career path: each step lists the topics to learn in that stage.
// All content comes straight from the steps prop (data/roadmaps.js).
export default function JourneyRoadmap({ steps }){
  return (
    <ol className="path-steps">
      {steps.map((step, i) => (
        <li key={step.title} id={slugify(step.title)} className="path-step">
          <span className="path-step-num" aria-hidden="true">{i + 1}</span>
          <div className="path-step-body">
            <h3>{step.title}</h3>
            {step.description && <p className="path-step-desc">{step.description}</p>}
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
