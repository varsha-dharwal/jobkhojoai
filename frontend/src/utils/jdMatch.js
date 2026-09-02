// A broad, static vocabulary of common tech skills/tools used to scan a pasted
// job description for requirements — deliberately not AI-driven: this is plain
// keyword matching, fast and free, and skill-matching doesn't need an LLM.
const SKILL_VOCABULARY = [
  "JavaScript", "TypeScript", "Python", "Java", "C++", "C", "Go", "Rust",
  "React", "Next.js", "Vue", "Angular", "Node.js", "Express", "Redux", "Tailwind", "Bootstrap",
  "MySQL", "MongoDB", "PostgreSQL", "Firebase", "Redis", "SQL", "NoSQL",
  "Git", "GitHub", "Docker", "Kubernetes", "AWS", "Azure", "GCP", "CI/CD", "Jenkins",
  "REST APIs", "GraphQL", "Jest", "Cypress", "Testing", "Responsive Design", "HTML", "CSS",
  "Machine Learning", "Data Analysis", "Pandas", "NumPy", "TensorFlow", "PyTorch",
  "Agile", "Scrum", "Linux", "Figma", "UI/UX",
];

function wordInText(word, text) {
  const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^|[^a-zA-Z0-9])${escaped}([^a-zA-Z0-9]|$)`, "i").test(text);
}

export function matchJobDescription(resumeSkills, jdText) {
  const skills = Array.from(new Set(resumeSkills.filter(Boolean)));
  const strongMatches = skills.filter((skill) => wordInText(skill, jdText));

  const mentionedInJd = SKILL_VOCABULARY.filter((skill) => wordInText(skill, jdText));
  const notOnResume = mentionedInJd.filter(
    (skill) => !skills.some((s) => s.toLowerCase() === skill.toLowerCase())
  );

  return { strongMatches, notOnResume };
}
