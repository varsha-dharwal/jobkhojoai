import { useState } from "react";

const SUGGESTIONS = {
  languages: ["JavaScript", "Python", "Java", "TypeScript", "C++", "C", "SQL"],
  frameworks: ["React", "Next.js", "Node.js", "Express", "Angular", "Vue"],
  tools: ["Git", "GitHub", "VS Code", "Postman", "Docker", "MySQL", "MongoDB"],
  platforms: ["Figma", "Jupyter Notebook", "Power BI", "Tableau", "IntelliJ IDEA", "Excel"],
  softSkills: ["Communication", "Teamwork", "Problem Solving", "Time Management", "Leadership"],
};

const LABELS = {
  languages: "Programming Languages",
  frameworks: "Frameworks / Libraries",
  tools: "Developer Tools",
  platforms: "Platforms",
  softSkills: "Soft Skills",
};

function CategoryPicker({ category, selected, onChange }) {
  const [custom, setCustom] = useState("");
  const suggestions = SUGGESTIONS[category];

  function toggle(skill) {
    onChange(selected.includes(skill) ? selected.filter((s) => s !== skill) : [...selected, skill]);
  }

  function addCustom(e) {
    e.preventDefault();
    const value = custom.trim();
    if (!value || selected.includes(value)) return;
    onChange([...selected, value]);
    setCustom("");
  }

  return (
    <div className="skills-category">
      <h4>{LABELS[category]}</h4>
      <div className="skill-chip-row">
        {Array.from(new Set([...suggestions, ...selected.filter((s) => !suggestions.includes(s))])).map((skill) => (
          <button
            type="button"
            key={skill}
            className={`skill-chip${selected.includes(skill) ? " selected" : ""}`}
            onClick={() => toggle(skill)}
          >
            {skill}{selected.includes(skill) ? " ×" : ""}
          </button>
        ))}
      </div>
      <form className="skill-custom-form" onSubmit={addCustom}>
        <input
          type="text"
          placeholder="+ Add Custom Skill"
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
        />
        <button type="submit" className="btn btn-ghost">Add</button>
      </form>
    </div>
  );
}

export default function SkillsPicker({ skills, onChange }) {
  return (
    <div className="skills-picker">
      {Object.keys(LABELS).map((category) => (
        <CategoryPicker
          key={category}
          category={category}
          selected={skills[category] || []}
          onChange={(next) => onChange(category, next)}
        />
      ))}
    </div>
  );
}
