import { useCallback, useEffect, useRef, useState } from "react";
import JobCard from "./JobCard";

function ArrowIcon({ flip }){
  return (
    <svg viewBox="0 0 24 24" fill="none" width="18" height="18" aria-hidden="true" style={flip ? { transform: "scaleX(-1)" } : undefined}>
      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function JobSlider({ jobs }){
  const trackRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateArrows = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    updateArrows();
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, [jobs, updateArrows]);

  function scrollByPage(direction){
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.9, behavior: "smooth" });
  }

  if (!jobs.length) return null;

  return (
    <div className="job-slider">
      <button
        type="button"
        className="job-slider-arrow job-slider-arrow-left"
        onClick={() => scrollByPage(-1)}
        disabled={!canScrollLeft}
        aria-label="Scroll to previous jobs"
      >
        <ArrowIcon flip />
      </button>

      <div className="job-slider-track" ref={trackRef} role="region" aria-label="Job listings">
        {jobs.map((job, i) => (
          <div className="job-slider-item" key={job._id}>
            <JobCard job={job} index={i} />
          </div>
        ))}
      </div>

      <button
        type="button"
        className="job-slider-arrow job-slider-arrow-right"
        onClick={() => scrollByPage(1)}
        disabled={!canScrollRight}
        aria-label="Scroll to next jobs"
      >
        <ArrowIcon />
      </button>
    </div>
  );
}
