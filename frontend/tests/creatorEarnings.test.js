import assert from "node:assert/strict";
import test from "node:test";
import { CREATOR_SALES_KEY, readCreatorSales, summarizeCreatorSales } from "../src/data/creatorEarnings.js";
import { calculateSaleCommission } from "../src/data/creatorSubmissions.js";

function mockSalesStorage(value) {
  globalThis.window = { localStorage: { getItem: (key) => key === CREATOR_SALES_KEY ? value : null } };
}

const makeSale = (id, amountPaise, status = "available", creatorEmail = "owner@example.com") => ({
  id,
  creatorEmail,
  saleAmountPaise: amountPaise,
  saleDate: "2026-10-20T12:00:00.000Z",
  templateName: `Template ${id}`,
  status,
});

test("empty transaction store yields zero totals and no sales", () => {
  mockSalesStorage(null);
  const result = readCreatorSales("owner@example.com");
  assert.deepEqual(result.sales, []);
  assert.equal(summarizeCreatorSales(result.sales).totalCreatorPaise, 0);
});

test("a ₹129 transaction splits into ₹77.40 and ₹51.60", () => {
  const split = calculateSaleCommission(12900);
  assert.equal(split.creatorPaise, 7740);
  assert.equal(split.platformPaise, 5160);
});

test("multiple statuses reconcile, exclude refunds, filter owners, and deduplicate IDs", () => {
  const records = [
    makeSale("available", 12900),
    makeSale("pending", 9999, "pending"),
    makeSale("paid", 5000, "paid_out"),
    makeSale("refund", 7777, "refunded"),
    makeSale("reverse", 1000, "reversed"),
    makeSale("available", 12900),
    makeSale("other", 10000, "available", "other@example.com"),
  ];
  mockSalesStorage(JSON.stringify(records));
  const result = readCreatorSales("OWNER@example.com");
  assert.equal(result.sales.length, 5);
  const totals = summarizeCreatorSales(result.sales);
  assert.deepEqual({
    eligibleSales: totals.eligibleSales,
    grossPaise: totals.grossPaise,
    totalCreatorPaise: totals.totalCreatorPaise,
    availablePaise: totals.availablePaise,
    pendingPaise: totals.pendingPaise,
    paidOutPaise: totals.paidOutPaise,
    platformPaise: totals.platformPaise,
  }, {
    eligibleSales: 3,
    grossPaise: 27899,
    totalCreatorPaise: 16739,
    availablePaise: 7740,
    pendingPaise: 5999,
    paidOutPaise: 3000,
    platformPaise: 11160,
  });
});

test("malformed records and amounts are ignored safely", () => {
  mockSalesStorage(JSON.stringify([
    makeSale("bad-money", 12.5),
    { ...makeSale("bad-date", 100), saleDate: "not-a-date" },
    { ...makeSale("missing-id", 100), id: "" },
    null,
  ]));
  assert.deepEqual(readCreatorSales("owner@example.com").sales, []);
});
