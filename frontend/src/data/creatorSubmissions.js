export const CREATOR_SUBMISSIONS_KEY = "jobkhojo.creatorSubmissions.v1";
export const CREATOR_SUBMISSIONS_UPDATED_EVENT = "creator-submissions-updated";
export const COMMISSION_OPTIONS = [99, 129, 149];
let volatileRecords = [];

/** Shared 60/40 gross split. Inputs and outputs are integer paise. */
export function calculateSaleCommission(amountPaise) {
  if (!Number.isSafeInteger(amountPaise) || amountPaise <= 0) return null;
  const creatorPaise = Math.floor(amountPaise * 60 / 100);
  return {
    pricePaise: amountPaise,
    creatorPaise,
    platformPaise: amountPaise - creatorPaise,
    price: amountPaise / 100,
    creatorShare: creatorPaise / 100,
    platformShare: (amountPaise - creatorPaise) / 100,
  };
}

/** All monetary values are computed as integer paise to avoid floating point drift. */
export function calculateCommission(priceRupees) {
  const pricePaise = Math.round(Number(priceRupees) * 100);
  if (!COMMISSION_OPTIONS.some((price) => price * 100 === pricePaise)) return null;
  return calculateSaleCommission(pricePaise);
}

export function formatRupees(paise) {
  return `₹${(paise / 100).toFixed(2)}`;
}

export function readCreatorSubmissions() {
  try {
    const value = window.localStorage.getItem(CREATOR_SUBMISSIONS_KEY);
    const records = value ? JSON.parse(value) : [];
    const stored = Array.isArray(records) ? records : [];
    return [...volatileRecords.filter((item) => !stored.some((saved) => saved.id === item.id)), ...stored];
  } catch {
    return volatileRecords;
  }
}

export function saveCreatorSubmission(record) {
  const records = readCreatorSubmissions();
  const next = [record, ...records.filter((item) => item.id !== record.id)];
  volatileRecords = next;
  try {
    window.localStorage.setItem(CREATOR_SUBMISSIONS_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(CREATOR_SUBMISSIONS_UPDATED_EVENT));
    return { saved: true, records: next };
  } catch {
    return { saved: false, records: [record, ...records] };
  }
}

/** Update the shared local demo record; review actions are not server-authorized. */
export function reviewCreatorSubmission(id, { status, reason = "", details = "", reviewer = "" }) {
  if (!id || !["Approved", "Rejected"].includes(status)) return { saved: false, error: "Invalid review action." };
  const records = readCreatorSubmissions();
  const existing = records.find((item) => item?.id === id);
  if (!existing) return { saved: false, error: "This submission is no longer available. Refresh the list." };
  if (existing.status !== "Pending Review" && existing.status !== "Rejected") {
    return { saved: false, error: "This template is not eligible for another review action." };
  }
  if (status === "Rejected" && !reason.trim()) return { saved: false, error: "Choose a rejection reason." };
  const reviewedAt = new Date().toISOString();
  const review = { status, reason: reason.trim(), details: details.trim(), reviewedAt, reviewer: reviewer || "" };
  const updated = {
    ...existing,
    status,
    reviewReason: review.reason,
    reviewNotes: review.details,
    reviewedAt,
    reviewer: review.reviewer,
    reviewHistory: [...(Array.isArray(existing.reviewHistory) ? existing.reviewHistory : []), review],
  };
  const next = records.map((item) => item?.id === id ? updated : item);
  try {
    window.localStorage.setItem(CREATOR_SUBMISSIONS_KEY, JSON.stringify(next));
    volatileRecords = next;
    window.dispatchEvent(new Event(CREATOR_SUBMISSIONS_UPDATED_EVENT));
    return { saved: true, record: updated };
  } catch {
    return { saved: false, error: "The review could not be saved in browser storage." };
  }
}
