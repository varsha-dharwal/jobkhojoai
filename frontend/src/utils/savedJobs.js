import api from "../api/client";
import { getUserToken } from "./userAuth";

const KEY = "jobkhojoai_saved_jobs";
const CHANGE_EVENT = "savedjobs-changed";

export function getSavedJobs(){
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
}

export function isJobSaved(jobId){
  return getSavedJobs().some(j => j._id === jobId);
}

// Toggles a job in/out of the saved list (stores the full job so the Saved Jobs
// page can render it without another fetch) and returns the new saved state.
export function toggleSavedJob(job){
  const saved = getSavedJobs();
  const exists = saved.some(j => j._id === job._id);
  const next = exists ? saved.filter(j => j._id !== job._id) : [job, ...saved];
  localStorage.setItem(KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(CHANGE_EVENT));
  if (getUserToken() && job._id) {
    api.put(`/users/me/jobs/${job._id}/save`)
      .then(() => syncSavedJobs())
      .catch(() => {});
  }
  return !exists;
}

export async function syncSavedJobs(){
  if (!getUserToken()) return getSavedJobs();
  const { data } = await api.get("/users/me/jobs");
  const savedJobs = data.savedJobs || [];
  localStorage.setItem(KEY, JSON.stringify(savedJobs));
  window.dispatchEvent(new Event(CHANGE_EVENT));
  return savedJobs;
}

export function cacheSavedJobs(savedJobs){
  localStorage.setItem(KEY, JSON.stringify(savedJobs || []));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function onSavedJobsChange(callback){
  window.addEventListener(CHANGE_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(CHANGE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}
