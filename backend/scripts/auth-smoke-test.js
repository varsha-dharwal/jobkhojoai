import "dotenv/config";
import mongoose from "mongoose";
import User from "../models/User.js";

const apiBase = process.env.AUTH_TEST_API_URL || `http://localhost:${process.env.PORT || 5000}/api`;
const unique = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
const email = `auth-smoke-${unique}@example.invalid`;
const password = `Smoke-${unique}-P4ss`;

async function post(path, body) {
  return fetch(`${apiBase}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

let failure;
try {
  const created = await post("/users/register", { name: "Temporary auth check", email, password });
  if (created.status !== 201) throw new Error(`Temporary registration returned HTTP ${created.status}.`);

  const validLogin = await post("/users/login", { email, password });
  const loginPayload = await validLogin.json();
  if (validLogin.status !== 200 || !loginPayload.token) throw new Error(`Valid credentials returned HTTP ${validLogin.status}.`);

  const invalidLogin = await post("/users/login", { email, password: `${password}-wrong` });
  if (invalidLogin.status !== 401) throw new Error(`Invalid credentials returned HTTP ${invalidLogin.status}, expected 401.`);

  console.log("Auth API smoke check passed: temporary registration 201, valid login 200, invalid password 401.");
} catch (error) {
  failure = error;
} finally {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
    await User.deleteOne({ email });
    await mongoose.disconnect();
  } catch (cleanupError) {
    failure ||= new Error("Could not clean up the temporary auth test account.");
    console.error("Auth smoke test cleanup failed:", cleanupError.message);
  }
}

if (failure) {
  console.error(failure.message);
  process.exitCode = 1;
}
