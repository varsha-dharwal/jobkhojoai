// URL <-> filter state for the /jobs page. Params: q, location, type, mode, exp, posted, region.
import { EXPERIENCE_LEVELS } from "./jobs";

export const FILTER_GROUPS = [
  { key: "type", label: "Job type", multi: true, options: [
    { value: "full-time", label: "Full-time" },
    { value: "internship", label: "Internship" },
    { value: "part-time", label: "Part-time" },
  ] },
  { key: "mode", label: "Work mode", multi: true, options: [
    { value: "remote", label: "Remote" },
    { value: "onsite", label: "On-site" },
  ] },
  { key: "exp", label: "Experience", multi: true, options: EXPERIENCE_LEVELS },
  { key: "posted", label: "Date posted", multi: false, options: [
    { value: "", label: "Any time" },
    { value: "1", label: "Last 24 hours" },
    { value: "7", label: "Last 7 days" },
    { value: "30", label: "Last 30 days" },
  ] },
  { key: "region", label: "Country", multi: false, options: [
    { value: "", label: "Any" },
    { value: "india", label: "India" },
    { value: "usa", label: "USA" },
  ] },
];

export function readFilters(params){
  const list = key => (params.get(key) || "").split(",").map(s => s.trim().toLowerCase()).filter(Boolean);
  return {
    q: (params.get("q") || "").trim(),
    location: (params.get("location") || "").trim(),
    type: list("type"),
    mode: list("mode"),
    exp: list("exp"),
    posted: params.get("posted") || "",
    region: (params.get("region") || "").toLowerCase(),
  };
}

export const EMPTY_FILTERS = readFilters(new URLSearchParams());

// Maps the old homepage query format ("/?search=react&category=Internship#jobs")
// onto /jobs, so shared links and bookmarks keep working.
export function legacyJobsUrl(search, hash){
  const old = new URLSearchParams(search);
  const keys = ["search", "category", "remote", "company", "experience", "datePosted", "country"];
  if (!keys.some(k => old.has(k)) && hash !== "#jobs") return null;
  const next = new URLSearchParams();
  const q = [old.get("search"), old.get("company")].filter(Boolean).join(" ");
  if (q) next.set("q", q);
  if (old.get("category") && old.get("category") !== "All") next.set("type", old.get("category").toLowerCase());
  if (old.get("remote") === "true") next.set("mode", "remote");
  if (old.get("remote") === "false") next.set("mode", "onsite");
  if (old.get("experience")) next.set("exp", old.get("experience"));
  const posted = { "24h": "1", week: "7", month: "30" }[old.get("datePosted")];
  if (posted) next.set("posted", posted);
  if (old.get("country")) next.set("region", old.get("country").toLowerCase());
  const qs = next.toString();
  return `/jobs${qs ? `?${qs}` : ""}`;
}
