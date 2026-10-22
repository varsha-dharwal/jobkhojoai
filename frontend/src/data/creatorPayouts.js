import { readCreatorSales } from "./creatorEarnings.js";

export const CREATOR_PAYOUTS_KEY = "jobkhojo.creatorPayoutRequests.v1";
export const CREATOR_PAYOUTS_UPDATED_EVENT = "creator-payouts-updated";
export const DEMO_PAYOUT_METHOD = "local_demo";

const PAYOUT_STATUSES = new Set(["pending", "approved", "rejected", "paid"]);
const RESERVED_STATUSES = new Set(["pending", "approved", "paid"]);
const normalizeEmail = (value) => typeof value === "string" ? value.trim().toLowerCase() : "";

function normalizeRequest(record, email) {
  if (!record || typeof record !== "object" || Array.isArray(record)) return null;
  const requestId = typeof record.requestId === "string" ? record.requestId.trim() : "";
  const creatorEmail = normalizeEmail(record.creatorEmail);
  const status = typeof record.status === "string" ? record.status.trim().toLowerCase() : "";
  const amountPaise = record.amountPaise;
  const createdAt = typeof record.createdAt === "string" ? new Date(record.createdAt).getTime() : NaN;
  if (!requestId || !email || creatorEmail !== email || !PAYOUT_STATUSES.has(status)) return null;
  if (!Number.isSafeInteger(amountPaise) || amountPaise <= 0 || !Number.isFinite(createdAt)) return null;
  if (record.method !== DEMO_PAYOUT_METHOD || !Array.isArray(record.allocations)) return null;
  const allocations = record.allocations.filter((allocation) =>
    allocation && typeof allocation.saleId === "string" && allocation.saleId &&
    Number.isSafeInteger(allocation.amountPaise) && allocation.amountPaise > 0,
  ).map(({ saleId, amountPaise: allocationPaise }) => ({ saleId, amountPaise: allocationPaise }));
  if (allocations.reduce((sum, allocation) => sum + allocation.amountPaise, 0) !== amountPaise) return null;
  return {
    requestId,
    creatorEmail,
    amountPaise,
    method: DEMO_PAYOUT_METHOD,
    status,
    createdAt,
    updatedAt: typeof record.updatedAt === "string" && Number.isFinite(new Date(record.updatedAt).getTime()) ? new Date(record.updatedAt).getTime() : createdAt,
    allocations,
    adminNote: typeof record.adminNote === "string" ? record.adminNote.slice(0, 500) : "",
  };
}

export function readCreatorPayoutRequests(creatorEmail) {
  if (typeof window === "undefined") return { requests: [], available: false, error: "Payout requests are only available in this browser demo." };
  let raw;
  try {
    raw = window.localStorage.getItem(CREATOR_PAYOUTS_KEY);
  } catch {
    return { requests: [], available: false, error: "Browser storage is unavailable. Payout request history could not be loaded." };
  }
  if (!raw) return { requests: [], available: true, error: "" };
  let records;
  try {
    records = JSON.parse(raw);
  } catch {
    return { requests: [], available: false, error: "Saved payout history is malformed and could not be loaded." };
  }
  if (!Array.isArray(records)) return { requests: [], available: false, error: "Saved payout history has an unexpected format." };
  const email = normalizeEmail(creatorEmail);
  const seen = new Set();
  const requests = [];
  for (const record of records) {
    const request = normalizeRequest(record, email);
    if (!request || seen.has(request.requestId)) continue;
    seen.add(request.requestId);
    requests.push(request);
  }
  requests.sort((a, b) => b.createdAt - a.createdAt);
  return { requests, available: true, error: "" };
}

function allocatePayoutFunds(sales, requests) {
  const availableSales = new Map(sales.filter((sale) => sale.status === "available").map((sale) => [sale.id, sale]));
  const reservedBySale = new Map();
  let pendingPayoutPaise = 0;
  let totalPaidOutPaise = sales.filter((sale) => sale.status === "paid_out").reduce((sum, sale) => sum + sale.creatorPaise, 0);
  let rejectedPayoutPaise = 0;
  const oldestFirst = [...requests].sort((a, b) => a.createdAt - b.createdAt);

  for (const request of oldestFirst) {
    if (request.status === "rejected") {
      rejectedPayoutPaise += request.amountPaise;
      continue;
    }
    if (!RESERVED_STATUSES.has(request.status)) continue;
    let acceptedPaise = 0;
    for (const allocation of request.allocations) {
      const sale = availableSales.get(allocation.saleId);
      if (!sale) continue;
      const reservedPaise = reservedBySale.get(sale.id) || 0;
      const accepted = Math.min(allocation.amountPaise, Math.max(0, sale.creatorPaise - reservedPaise));
      if (!accepted) continue;
      reservedBySale.set(sale.id, reservedPaise + accepted);
      acceptedPaise += accepted;
    }
    if (request.status === "paid") totalPaidOutPaise += acceptedPaise;
    else pendingPayoutPaise += acceptedPaise;
  }

  const availableForPayoutPaise = [...availableSales.values()].reduce((sum, sale) =>
    sum + Math.max(0, sale.creatorPaise - (reservedBySale.get(sale.id) || 0)), 0);
  return { availableForPayoutPaise, pendingPayoutPaise, totalPaidOutPaise, rejectedPayoutPaise, reservedBySale };
}

export function calculatePayoutBalances(sales, requests) {
  const balances = allocatePayoutFunds(sales, requests);
  return {
    availableForPayoutPaise: balances.availableForPayoutPaise,
    pendingPayoutPaise: balances.pendingPayoutPaise,
    totalPaidOutPaise: balances.totalPaidOutPaise,
    rejectedPayoutPaise: balances.rejectedPayoutPaise,
  };
}

export function allocatePayoutAmount(sales, requests, amountPaise) {
  if (!Number.isSafeInteger(amountPaise) || amountPaise <= 0) return null;
  const { availableForPayoutPaise, reservedBySale } = allocatePayoutFunds(sales, requests);
  if (amountPaise > availableForPayoutPaise) return null;
  let remainingPaise = amountPaise;
  const allocations = [];
  const oldestAvailableFirst = sales.filter((sale) => sale.status === "available").sort((a, b) => a.timestamp - b.timestamp);
  for (const sale of oldestAvailableFirst) {
    const remainingSalePaise = sale.creatorPaise - (reservedBySale.get(sale.id) || 0);
    const allocatedPaise = Math.min(remainingPaise, remainingSalePaise);
    if (allocatedPaise <= 0) continue;
    allocations.push({ saleId: sale.id, amountPaise: allocatedPaise });
    remainingPaise -= allocatedPaise;
    if (!remainingPaise) break;
  }
  return remainingPaise === 0 ? allocations : null;
}

export function saveCreatorPayoutRequest(request) {
  if (typeof window === "undefined") return { ok: false, error: "Payout requests are unavailable outside the browser demo." };
  try {
    const raw = window.localStorage.getItem(CREATOR_PAYOUTS_KEY);
    const allRecords = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(allRecords)) return { ok: false, error: "Saved payout history has an unexpected format." };
    const email = normalizeEmail(request.creatorEmail);
    const existingCurrent = allRecords.map((record) => normalizeRequest(record, email)).filter(Boolean);
    if (existingCurrent.some((item) => item.requestId === request.requestId)) return { ok: false, error: "This payout request was already submitted." };
    const otherCreators = allRecords.filter((record) => normalizeEmail(record?.creatorEmail) !== email);
    window.localStorage.setItem(CREATOR_PAYOUTS_KEY, JSON.stringify([request, ...otherCreators, ...existingCurrent]));
    window.dispatchEvent(new Event(CREATOR_PAYOUTS_UPDATED_EVENT));
    return { ok: true };
  } catch {
    return { ok: false, error: "Could not save the demo payout request in this browser." };
  }
}

function createRequestId() {
  const uuid = window.crypto?.randomUUID?.();
  return uuid ? `payout-${uuid}` : `payout-${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
}

function submitDemoPayout(creatorEmail, amountPaise) {
  const email = normalizeEmail(creatorEmail);
  if (!email) return { ok: false, error: "Sign in to submit a payout request." };
  if (!Number.isSafeInteger(amountPaise) || amountPaise <= 0) return { ok: false, error: "Enter a valid payout amount greater than zero." };
  const salesResult = readCreatorSales(email);
  if (!salesResult.available) return { ok: false, error: salesResult.error };
  const payoutResult = readCreatorPayoutRequests(email);
  if (!payoutResult.available) return { ok: false, error: payoutResult.error };
  const balances = calculatePayoutBalances(salesResult.sales, payoutResult.requests);
  if (amountPaise > balances.availableForPayoutPaise) return { ok: false, error: "The request amount exceeds your current available balance. Refresh the page and try again." };
  const allocations = allocatePayoutAmount(salesResult.sales, payoutResult.requests, amountPaise);
  if (!allocations) return { ok: false, error: "Available funds changed. Refresh the page and try again." };
  const createdAt = new Date().toISOString();
  const request = {
    requestId: createRequestId(),
    creatorEmail: email,
    amountPaise,
    method: DEMO_PAYOUT_METHOD,
    status: "pending",
    createdAt,
    updatedAt: createdAt,
    allocations,
    adminNote: "",
  };
  const saved = saveCreatorPayoutRequest(request);
  return saved.ok ? { ok: true, request } : saved;
}

export function requestDemoPayout(creatorEmail, amountPaise) {
  if (typeof navigator !== "undefined" && navigator.locks?.request) {
    return navigator.locks.request("jobkhojo-demo-payout-request", { mode: "exclusive" }, () => submitDemoPayout(creatorEmail, amountPaise));
  }
  return Promise.resolve(submitDemoPayout(creatorEmail, amountPaise));
}

export function parsePayoutAmount(value) {
  if (typeof value !== "string" || !/^\d+(?:\.\d{1,2})?$/.test(value.trim())) return null;
  const [rupees, paise = ""] = value.trim().split(".");
  const amountPaise = Number(rupees) * 100 + Number(paise.padEnd(2, "0"));
  return Number.isSafeInteger(amountPaise) && amountPaise > 0 ? amountPaise : null;
}
