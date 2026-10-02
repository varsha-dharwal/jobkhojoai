import { useEffect, useState } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { isJobSaved, onSavedJobsChange, toggleSavedJob } from "../utils/savedJobs";
import { toListJob } from "../lib/api";

// Saved state lives in localStorage, so it's read after mount — the pre-rendered HTML
// always shows the unsaved state.
export default function SaveJobButton({ job, compact = false }){
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(isJobSaved(job._id));
    return onSavedJobsChange(() => setSaved(isJobSaved(job._id)));
  }, [job._id]);

  const label = saved ? "Saved" : "Save";
  return (
    <button
      type="button"
      className={compact ? "icon-button save-button" : "btn btn-secondary"}
      aria-pressed={saved}
      aria-label={compact ? `${saved ? "Remove" : "Save"} ${job.title} at ${job.organization}` : undefined}
      onClick={() => setSaved(toggleSavedJob(toListJob(job)))}
      data-saved={saved || undefined}
    >
      {saved ? <BookmarkCheck size={compact ? 18 : 16} aria-hidden="true" /> : <Bookmark size={compact ? 18 : 16} aria-hidden="true" />}
      {!compact && <span>{label}</span>}
    </button>
  );
}
