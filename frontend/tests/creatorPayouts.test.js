import assert from "node:assert/strict";
import test from "node:test";
import {
  allocatePayoutAmount,
  calculatePayoutBalances,
  CREATOR_PAYOUTS_KEY,
  parsePayoutAmount,
  readCreatorPayoutRequests,
  requestDemoPayout,
} from "../src/data/creatorPayouts.js";
import { CREATOR_SALES_KEY } from "../src/data/creatorEarnings.js";

const sale = (id, creatorPaise, status = "available", timestamp = 1) => ({ id, creatorPaise, status, timestamp });
const request = (requestId, amountPaise, status, allocations, createdAt = "2026-10-21T00:00:00.000Z") => ({
  requestId,
  creatorEmail: "creator@example.com",
  amountPaise,
  method: "local_demo",
  status,
  createdAt,
  updatedAt: createdAt,
  allocations,
  adminNote: "",
});

test("payout amounts accept whole rupees or one/two decimal places only", () => {
  assert.equal(parsePayoutAmount("500"), 50000);
  assert.equal(parsePayoutAmount("12.3"), 1230);
  assert.equal(parsePayoutAmount("12.34"), 1234);
  for (const invalid of ["", "0", "-1", "1.234", "1,000", "1e3", ".50"]) {
    assert.equal(parsePayoutAmount(invalid), null, invalid);
  }
});

test("allocations use eligible available earnings and reject over-balance requests", () => {
  const sales = [sale("newer", 5000, "available", 2), sale("older", 7740, "available", 1), sale("pending", 9000, "pending", 0)];
  assert.deepEqual(allocatePayoutAmount(sales, [], 8000), [
    { saleId: "older", amountPaise: 7740 },
    { saleId: "newer", amountPaise: 260 },
  ]);
  assert.equal(allocatePayoutAmount(sales, [], 12741), null);
  assert.equal(allocatePayoutAmount(sales, [], 0), null);
});

test("pending and approved requests reserve funds, rejected requests release them, paid requests count as paid", () => {
  const sales = [sale("sale-a", 10000)];
  const held = request("held", 4000, "pending", [{ saleId: "sale-a", amountPaise: 4000 }]);
  const approved = request("approved", 2000, "approved", [{ saleId: "sale-a", amountPaise: 2000 }], "2026-10-22T00:00:00.000Z");
  const rejected = request("rejected", 1000, "rejected", [{ saleId: "sale-a", amountPaise: 1000 }]);
  const paid = request("paid", 1500, "paid", [{ saleId: "sale-a", amountPaise: 1500 }]);
  assert.deepEqual(calculatePayoutBalances(sales, [held, approved]), {
    availableForPayoutPaise: 4000,
    pendingPayoutPaise: 6000,
    totalPaidOutPaise: 0,
    rejectedPayoutPaise: 0,
  });
  assert.deepEqual(calculatePayoutBalances(sales, [rejected, paid]), {
    availableForPayoutPaise: 8500,
    pendingPayoutPaise: 0,
    totalPaidOutPaise: 1500,
    rejectedPayoutPaise: 1000,
  });
});

test("payout history is filtered to the creator and malformed allocations are skipped", () => {
  const good = request("mine", 1000, "pending", [{ saleId: "sale-a", amountPaise: 1000 }]);
  const other = { ...request("theirs", 2000, "pending", [{ saleId: "sale-b", amountPaise: 2000 }]), creatorEmail: "other@example.com" };
  const malformed = request("bad", 1000, "pending", [{ saleId: "sale-a", amountPaise: 500 }]);
  globalThis.window = { localStorage: { getItem: () => JSON.stringify([good, other, malformed]) } };
  const result = readCreatorPayoutRequests("CREATOR@example.com");
  assert.equal(result.available, true);
  assert.equal(result.error, "");
  assert.deepEqual(result.requests.map((item) => item.requestId), ["mine"]);
});

test("submitting a payout persists its pending request and reserves the same earnings after rereading storage", async () => {
  const values = new Map([[CREATOR_SALES_KEY, JSON.stringify([{
    id: "sale-a",
    creatorEmail: "creator@example.com",
    saleAmountPaise: 16667,
    saleDate: "2026-10-21T00:00:00.000Z",
    templateName: "Resume template",
    status: "available",
  }])]]);
  globalThis.window = {
    localStorage: {
      getItem: (key) => values.get(key) ?? null,
      setItem: (key, value) => values.set(key, value),
    },
    dispatchEvent: () => true,
    crypto: { randomUUID: () => "request-123" },
  };
  const result = await requestDemoPayout("creator@example.com", 5000);
  assert.equal(result.ok, true);
  assert.equal(result.request.status, "pending");
  assert.equal(values.has(CREATOR_PAYOUTS_KEY), true);
  const refreshed = readCreatorPayoutRequests("creator@example.com");
  assert.equal(refreshed.requests[0].requestId, "payout-request-123");
  assert.deepEqual(calculatePayoutBalances([{ id: "sale-a", creatorPaise: 10000, status: "available", timestamp: 1 }], refreshed.requests), {
    availableForPayoutPaise: 5000,
    pendingPayoutPaise: 5000,
    totalPaidOutPaise: 0,
    rejectedPayoutPaise: 0,
  });
});
