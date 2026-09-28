import api from "../api/client";
import { getUserToken } from "./userAuth";
import { cacheSavedJobs } from "./savedJobs";

const KEY = "jobkhojoai_applications";
const CHANGE_EVENT = "myjobs-changed";

function read(){
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
}

export function getApplications(){
  return read();
}

function write(applications){
  localStorage.setItem(KEY, JSON.stringify(applications));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

// The browser copy keeps guest history and gives signed-in users an instant view;
// MongoDB remains the source of truth whenever a user session is available.
export async function syncMyJobs(){
  if (!getUserToken()) return { savedJobs: [], applications: read(), synced: false };
  const { data } = await api.get("/users/me/jobs");
  cacheSavedJobs(data.savedJobs || []);
  write(data.applications || []);
  return { ...data, synced: true };
}

export async function migrateGuestJobsToAccount(savedJobs, applications){
  if (!getUserToken()) return;
  await Promise.all([
    ...(savedJobs || []).map(job => api.put(`/users/me/jobs/${job._id}/save`)),
    ...(applications || []).filter(item => item.job?._id).map(item => api.post(`/users/me/jobs/${item.job._id}/apply`, { source: item.source || "jobkhojoAI", trackActivity: false })),
  ]);
  const synced = await syncMyJobs();
  const byJobId = new Map(synced.applications.map(item => [item.job?._id, item]));
  await Promise.all((applications || []).filter(item => item.status && item.status !== "applied").map(item => {
    const savedApplication = byJobId.get(item.job?._id);
    return savedApplication?._id
      ? api.patch(`/users/me/jobs/applications/${savedApplication._id}/status`, { status: item.status })
      : Promise.resolve();
  }));
  return syncMyJobs();
}

export async function recordApplication(job){
  const applications = read();
  const existing = applications.find(item => item.job?._id === job._id);
  const source = (job.applyLink || "").toLowerCase().includes("indeed") ? "Indeed" : "jobkhojoAI";
  const application = existing
    ? { ...existing, job, updatedAt: new Date().toISOString() }
    : { _id: `${job._id}-${Date.now()}`, job, status: "applied", source, appliedAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  const next = existing ? applications.map(item => item._id === existing._id ? application : item) : [application, ...applications];
  write(next);
  if (getUserToken() && job._id) {
    try {
      await api.post(`/users/me/jobs/${job._id}/apply`, { source });
      await syncMyJobs();
    } catch {
      // Keep the application on this device if the API is temporarily offline.
    }
  }
  return application;
}

export async function updateApplicationStatus(applicationId, status){
  const next = read().map(item => item._id === applicationId ? { ...item, status, updatedAt: new Date().toISOString() } : item);
  write(next);
  if (getUserToken()) {
    try {
      await api.patch(`/users/me/jobs/applications/${applicationId}/status`, { status });
    } catch {
      // Keep the optimistic local state available if the API is temporarily offline.
    }
  }
}

export function onMyJobsChange(callback){
  window.addEventListener(CHANGE_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(CHANGE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}
