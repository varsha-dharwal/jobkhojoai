import { calculateSaleCommission } from "./creatorSubmissions.js";

// Frontend demo contract only: there is no payment backend or transaction writer yet.
export const CREATOR_SALES_KEY = "jobkhojo.creatorSales.v1";
export const CREATOR_SALES_UPDATED_EVENT = "creator-sales-updated";
const RETAINED_STATUSES = new Set(["pending", "available", "paid_out"]);
const VALID_STATUSES = new Set([...RETAINED_STATUSES, "refunded", "reversed"]);

const normalizeEmail = (value) => typeof value === "string" ? value.trim().toLowerCase() : "";

function validSale(record, email) {
  if (!record || typeof record !== "object" || Array.isArray(record)) return null;
  const creatorEmail = normalizeEmail(record.creatorEmail || record.creator?.email);
  const status = typeof record.status === "string" ? record.status.trim().toLowerCase().replace(/[ -]/g, "_") : "";
  const amountPaise = record.saleAmountPaise;
  const id = typeof record.id === "string" ? record.id.trim() : "";
  const date = record.saleDate || record.createdAt;
  if (!id || !email || creatorEmail !== email || !VALID_STATUSES.has(status)) return null;
  if (!Number.isSafeInteger(amountPaise) || amountPaise <= 0) return null;
  const timestamp = typeof date === "string" || typeof date === "number" ? new Date(date).getTime() : NaN;
  if (!Number.isFinite(timestamp)) return null;
  const split = calculateSaleCommission(amountPaise);
  if (!split) return null;
  return {
    id,
    templateName: typeof record.templateName === "string" && record.templateName.trim()
      ? record.templateName.trim()
      : "Template details unavailable",
    timestamp,
    status,
    grossPaise: amountPaise,
    creatorPaise: split.creatorPaise,
    platformPaise: split.platformPaise,
  };
}

export function readCreatorSales(creatorEmail) {
  if (typeof window === "undefined") return { sales: [], available: false, error: "Sales are only available in this browser demo." };
  let raw;
  try {
    raw = window.localStorage.getItem(CREATOR_SALES_KEY);
  } catch {
    return { sales: [], available: false, error: "Browser storage is unavailable. Sales could not be loaded." };
  }
  if (!raw) return { sales: [], available: true, error: "" };
  let records;
  try {
    records = JSON.parse(raw);
  } catch {
    return { sales: [], available: false, error: "Saved sales data is malformed and could not be loaded." };
  }
  if (!Array.isArray(records)) return { sales: [], available: false, error: "Saved sales data has an unexpected format." };
  const email = normalizeEmail(creatorEmail);
  const seen = new Set();
  const sales = [];
  for (const record of records) {
    const sale = validSale(record, email);
    if (!sale || seen.has(sale.id)) continue;
    seen.add(sale.id);
    sales.push(sale);
  }
  sales.sort((a, b) => b.timestamp - a.timestamp);
  return { sales, available: true, error: "" };
}

export function summarizeCreatorSales(sales) {
  return sales.reduce((summary, sale) => {
    if (sale.status === "refunded" || sale.status === "reversed") return summary;
    summary.eligibleSales += 1;
    summary.grossPaise += sale.grossPaise;
    summary.platformPaise += sale.platformPaise;
    summary.totalCreatorPaise += sale.creatorPaise;
    if (sale.status === "pending") summary.pendingPaise += sale.creatorPaise;
    else if (sale.status === "available") summary.availablePaise += sale.creatorPaise;
    else if (sale.status === "paid_out") summary.paidOutPaise += sale.creatorPaise;
    return summary;
  }, { eligibleSales: 0, grossPaise: 0, totalCreatorPaise: 0, availablePaise: 0, pendingPaise: 0, paidOutPaise: 0, platformPaise: 0 });
}
