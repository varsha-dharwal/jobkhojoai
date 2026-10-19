// Minimal front matter reader for the Markdown guides in src/content. Plain
// `key: value` lines only — shared by the app and react-router.config.js (Node).
export function parseFrontmatter(raw){
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) return { data: {}, body: raw };
  const data = {};
  for (const line of match[1].split(/\r?\n/)) {
    const i = line.indexOf(":");
    if (i < 1) continue;
    data[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^["']|["']$/g, "");
  }
  return { data, body: raw.slice(match[0].length) };
}

export function isPublished(data){
  return data.status === "published";
}
