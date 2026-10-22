import "dotenv/config";
import mongoose from "mongoose";
import User from "../models/User.js";
import CreatorSupportTicket from "../models/CreatorSupportTicket.js";

const apiBase = process.env.AUTH_TEST_API_URL || `http://localhost:${process.env.PORT || 5000}/api`;
const unique = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
const accounts = [
  { name: "Temporary support check A", email: `support-smoke-a-${unique}@example.invalid`, password: `Smoke-${unique}-A4` },
  { name: "Temporary support check B", email: `support-smoke-b-${unique}@example.invalid`, password: `Smoke-${unique}-B4` },
];
let ticketId = "";
let failure;

async function api(path, { method = "GET", body, token } = {}) {
  const response = await fetch(`${apiBase}${path}`, {
    method,
    headers: {
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
    signal: AbortSignal.timeout(15000),
  });
  return { response, data: await response.json().catch(() => ({})) };
}

try {
  const tokens = [];
  for (const account of accounts) {
    const registered = await api("/users/register", { method: "POST", body: account });
    if (registered.response.status !== 201 || !registered.data.token) throw new Error(`Temporary account registration returned HTTP ${registered.response.status}.`);
    tokens.push(registered.data.token);
  }

  const invalid = await api("/creator-support", { method: "POST", token: tokens[0], body: { subject: "Bad", category: "invalid", description: "short" } });
  if (invalid.response.status !== 400) throw new Error(`Invalid ticket returned HTTP ${invalid.response.status}, expected 400.`);

  const created = await api("/creator-support", {
    method: "POST",
    token: tokens[0],
    body: {
      subject: "Support endpoint verification",
      category: "technical-issue",
      description: "Temporary smoke test ticket; this record should be deleted immediately.",
    },
  });
  if (created.response.status !== 201 || !created.data.ticketId || created.data.status !== "Open") throw new Error(`Valid ticket creation returned HTTP ${created.response.status}.`);
  ticketId = created.data.ticketId;

  const ownList = await api("/creator-support", { token: tokens[0] });
  if (ownList.response.status !== 200 || !ownList.data.some((ticket) => ticket.ticketId === ticketId)) throw new Error("Creator could not read their own support ticket.");
  const ownDetail = await api(`/creator-support/${encodeURIComponent(ticketId)}`, { token: tokens[0] });
  if (ownDetail.response.status !== 200 || ownDetail.data.description !== created.data.description) throw new Error("Creator could not read the correct ticket details.");
  const otherList = await api("/creator-support", { token: tokens[1] });
  if (otherList.response.status !== 200 || otherList.data.some((ticket) => ticket.ticketId === ticketId)) throw new Error("Another creator could see this ticket.");
  const otherDetail = await api(`/creator-support/${encodeURIComponent(ticketId)}`, { token: tokens[1] });
  if (otherDetail.response.status !== 404) throw new Error(`Cross-account ticket read returned HTTP ${otherDetail.response.status}, expected 404.`);

  console.log("Creator support API smoke check passed: validation, create, own history/detail, and cross-account isolation.");
} catch (error) {
  failure = error;
} finally {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
    if (ticketId) await CreatorSupportTicket.deleteOne({ ticketId });
    await User.deleteMany({ email: { $in: accounts.map(({ email }) => email) } });
    await mongoose.disconnect();
  } catch (cleanupError) {
    failure ||= new Error("Could not clean up temporary creator support smoke test records.");
    console.error("Creator support smoke test cleanup failed:", cleanupError.message);
  }
}

if (failure) {
  console.error(failure.message);
  process.exitCode = 1;
}
