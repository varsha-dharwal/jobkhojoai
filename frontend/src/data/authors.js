// People credited on guides, roadmaps and job notes. Shown in bylines and on /about.
export const AUTHORS = {
  varsha: {
    id: "varsha",
    name: "Varsha",
    role: "Editor, JobKhojo",
    bio: "Varsha runs JobKhojo: adding and checking job listings, and writing and editing the career guides. The focus is on what freshers and early-career candidates in India need to know before they apply.",
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
