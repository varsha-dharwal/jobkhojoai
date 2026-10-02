import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLoaderData, useSearchParams } from "react-router";
import { Search, MapPin, SlidersHorizontal, X, SearchX } from "lucide-react";
import SEO from "../components/SEO";
import JobCard from "../components/JobCard";
import { fetchAllJobs, toListJob } from "../lib/api";
import { jobMatches } from "../lib/jobs";
import { EMPTY_FILTERS, FILTER_GROUPS, readFilters } from "../lib/jobFilters";
import { useHydrated } from "../lib/useHydrated";

const PAGE_SIZE = 20;

export async function loader(){
  const jobs = await fetchAllJobs();
  return { jobs: jobs.map(toListJob), builtAt: new Date().toISOString() };
}

function headingFor(f){
  const kind = f.type.length === 1 && f.type[0] === "internship" ? "Internships" : "Jobs";
  const what = f.q ? `${f.q.charAt(0).toUpperCase()}${f.q.slice(1)} ` : "";
  const where = f.location ? (/^remote$/i.test(f.location) ? " (remote)" : ` in ${f.location.replace(/\b\w/g, c => c.toUpperCase())}`) : "";
  if (!what && !where) return kind === "Internships" ? "Internships" : "Jobs and internships";
  return `${what}${what ? kind.toLowerCase() : kind}${where}`;
}

export default function Jobs(){
  const { jobs: builtJobs } = useLoaderData();
  const [params, setParams] = useSearchParams();
  const hydrated = useHydrated();
  const [jobs, setJobs] = useState(builtJobs);
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [sheetOpen, setSheetOpen] = useState(false);
  const sheetRef = useRef(null);

  // Until hydration the page must match the static HTML, which has no query applied.
  const filters = hydrated ? readFilters(params) : EMPTY_FILTERS;
  const [qDraft, setQDraft] = useState(filters.q);
  const [locDraft, setLocDraft] = useState(filters.location);

  useEffect(() => {
    document.documentElement.classList.remove("pending-query");
  }, []);

  useEffect(() => {
    setQDraft(filters.q);
    setLocDraft(filters.location);
    setVisible(PAGE_SIZE);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params, hydrated]);

  // Quietly pick up jobs posted (or closed) since the last build. If the backend is
  // asleep this simply times out and the pre-rendered list stays.
  useEffect(() => {
    let cancelled = false;
    fetchAllJobs()
      .then(fresh => { if (!cancelled && fresh.length) setJobs(fresh.map(toListJob)); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const dialog = sheetRef.current;
    if (!dialog) return;
    if (sheetOpen && !dialog.open) dialog.showModal();
    if (!sheetOpen && dialog.open) dialog.close();
  }, [sheetOpen]);

  const results = useMemo(() => {
    const now = Date.now();
    return jobs.filter(job => jobMatches(job, filters, now));
  }, [jobs, filters.q, filters.location, filters.type.join(), filters.mode.join(), filters.exp.join(), filters.posted, filters.region]); // eslint-disable-line react-hooks/exhaustive-deps

  function update(patch, { replace = false } = {}){
    const next = new URLSearchParams(params);
    for (const [key, value] of Object.entries(patch)) {
      const v = Array.isArray(value) ? value.join(",") : value;
      if (v) next.set(key, v); else next.delete(key);
    }
    setParams(next, { replace, preventScrollReset: true });
  }

  function toggle(key, value){
    const current = filters[key];
    update({ [key]: current.includes(value) ? current.filter(v => v !== value) : [...current, value] });
  }

  function submitSearch(e){
    e.preventDefault();
    update({ q: qDraft.trim(), location: locDraft.trim() });
  }

  function clearAll(){
    setParams(new URLSearchParams(), { preventScrollReset: true });
  }

  const activeChips = [
    ...(filters.q ? [{ key: "q", label: `“${filters.q}”`, clear: () => update({ q: "" }) }] : []),
    ...(filters.location ? [{ key: "location", label: filters.location, clear: () => update({ location: "" }) }] : []),
    ...FILTER_GROUPS.flatMap(g => {
      const values = g.multi ? filters[g.key] : (filters[g.key] ? [filters[g.key]] : []);
      return values.map(v => ({
        key: `${g.key}-${v}`,
        label: g.options.find(o => o.value === v)?.label || v,
        clear: () => (g.multi ? toggle(g.key, v) : update({ [g.key]: "" })),
      }));
    }),
  ];
  const filterCount = activeChips.filter(c => c.key !== "q" && c.key !== "location").length;

  const filterPanel = (
    <div className="filter-groups">
      {FILTER_GROUPS.map(group => (
        <fieldset key={group.key} className="filter-group">
          <legend>{group.label}</legend>
          {group.options.map(opt => {
            const checked = group.multi ? filters[group.key].includes(opt.value) : filters[group.key] === opt.value;
            return (
              <label key={opt.value || "any"} className="check">
                <input
                  type={group.multi ? "checkbox" : "radio"}
                  name={`${group.key}${group.multi ? `-${opt.value}` : ""}`}
                  checked={checked}
                  onChange={() => (group.multi ? toggle(group.key, opt.value) : update({ [group.key]: opt.value }))}
                />
                <span>{opt.label}</span>
              </label>
            );
          })}
        </fieldset>
      ))}
    </div>
  );

  const heading = headingFor(filters);
  const shown = results.slice(0, visible);

  return (
    <main className="container jobs-page">
      <SEO
        title={hydrated && (filters.q || filters.location) ? `${heading} | JobKhojo` : "Jobs and Internships in India for Freshers & Early-Career | JobKhojo"}
        description="Browse current jobs and internships in software, IT, design, data and support roles. Filter by experience, work mode, job type and date posted."
        path="/jobs"
      />

      <header className="page-head">
        <h1>{heading}</h1>
        <form className="search-panel search-panel-compact" role="search" aria-label="Search jobs" onSubmit={submitSearch}>
          <label className="search-field">
            <Search size={18} aria-hidden="true" />
            <span className="sr-only">Job title, skill or company</span>
            <input type="search" name="q" placeholder="Job title, skill or company" value={qDraft} onChange={e => setQDraft(e.target.value)} autoComplete="off" />
          </label>
          <label className="search-field">
            <MapPin size={18} aria-hidden="true" />
            <span className="sr-only">Location</span>
            <input type="text" name="location" placeholder="City, or “remote”" value={locDraft} onChange={e => setLocDraft(e.target.value)} autoComplete="off" />
          </label>
          <button type="submit" className="btn btn-primary">Search</button>
        </form>
      </header>

      <div className="jobs-layout">
        <aside className="jobs-filters" aria-label="Filters">
          <div className="jobs-filters-head">
            <h2>Filters</h2>
            {activeChips.length > 0 && <button type="button" className="text-button" onClick={clearAll}>Clear all</button>}
          </div>
          {filterPanel}
        </aside>

        <section className="jobs-results" aria-labelledby="results-count">
          <div className="results-bar">
            <p id="results-count" className="results-count" aria-live="polite">
              <strong>{results.length}</strong> {results.length === 1 ? "job" : "jobs"} · newest first
            </p>
            <button type="button" className="btn btn-secondary btn-sm filters-toggle" onClick={() => setSheetOpen(true)}>
              <SlidersHorizontal size={16} aria-hidden="true" /> Filters{filterCount ? ` (${filterCount})` : ""}
            </button>
          </div>

          {activeChips.length > 0 && (
            <ul className="active-chips" aria-label="Active filters">
              {activeChips.map(chip => (
                <li key={chip.key}>
                  <button type="button" className="chip chip-removable" onClick={chip.clear} aria-label={`Remove filter ${chip.label}`}>
                    {chip.label} <X size={14} aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>
          )}

          {results.length === 0 ? (
            <div className="empty-state">
              <SearchX size={28} aria-hidden="true" />
              <h2>No jobs match these filters</h2>
              <p>Try a broader search, a nearby city, or remove a filter or two.</p>
              <button type="button" className="btn btn-secondary" onClick={clearAll}>Clear all filters</button>
            </div>
          ) : (
            <>
              <div className="job-list">
                {shown.map(job => <JobCard key={job._id} job={job} headingLevel={2} />)}
              </div>
              {results.length > visible && (
                <div className="load-more">
                  <button type="button" className="btn btn-secondary" onClick={() => setVisible(v => v + PAGE_SIZE)}>
                    Show more jobs ({results.length - visible} more)
                  </button>
                </div>
              )}
            </>
          )}

          <p className="jobs-footnote">
            Jobs are collected from company career pages and public job boards. Always confirm details on the original posting.{" "}
            <Link to="/job-verification-policy">How we review listings</Link>
          </p>
        </section>
      </div>

      <dialog ref={sheetRef} className="filter-sheet" onClose={() => setSheetOpen(false)} aria-labelledby="sheet-title">
        <div className="filter-sheet-head">
          <h2 id="sheet-title">Filters</h2>
          <button type="button" className="icon-button" onClick={() => setSheetOpen(false)} aria-label="Close filters">
            <X size={20} aria-hidden="true" />
          </button>
        </div>
        <div className="filter-sheet-body">{filterPanel}</div>
        <div className="filter-sheet-foot">
          <button type="button" className="btn btn-secondary" onClick={clearAll}>Clear all</button>
          <button type="button" className="btn btn-primary" onClick={() => setSheetOpen(false)}>
            Show {results.length} {results.length === 1 ? "job" : "jobs"}
          </button>
        </div>
      </dialog>
    </main>
  );
}

