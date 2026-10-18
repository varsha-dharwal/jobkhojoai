import { JOB_ARTICLE_AUTHOR } from "../lib/site";

// People credited on guides, roadmaps and job notes. Shown in bylines and on /about.
// Varsha's name and bio come from lib/site.js, the same details her job pages use.
export const AUTHORS = {
  varsha: {
    id: "varsha",
    name: JOB_ARTICLE_AUTHOR.name,
    role: "Editor, JobKhojo",
    bio: JOB_ARTICLE_AUTHOR.description,
    photo: "/images/varsha-dharwal-96.webp",
  },
};

export const DEFAULT_AUTHOR = AUTHORS.varsha;

export function authorFor(id){
  return AUTHORS[id] || DEFAULT_AUTHOR;
}

// schema.org author for Article structured data.
export function authorSchema(id){
  const a = authorFor(id);
  return { "@type": "Person", name: a.name, url: "https://jobkhojoai.com/about#who-runs-jobkhojo" };
}
