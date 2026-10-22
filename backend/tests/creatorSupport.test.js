import assert from "node:assert/strict";
import test from "node:test";
import { CREATOR_SUPPORT_CATEGORIES } from "../models/CreatorSupportTicket.js";
import { validateTicketInput } from "../routes/creatorSupport.js";
import { sendEmail } from "../services/emailDelivery.js";

test("support request validation trims valid data and keeps optional template IDs", () => {
  const result = validateTicketInput({
    subject: "  Preview issue  ",
    category: "technical-issue",
    description: "  My saved PDF preview is blank after I reopen the template.  ",
    relatedTemplateId: "  template-123  ",
  });
  assert.deepEqual(result, { value: {
    subject: "Preview issue",
    category: "technical-issue",
    description: "My saved PDF preview is blank after I reopen the template.",
    relatedTemplateId: "template-123",
  } });
});

test("support request validation rejects missing, short, oversized, and unknown fields", () => {
  assert.match(validateTicketInput({}).error, /Subject/);
  assert.match(validateTicketInput({ subject: "Help me", category: "unknown", description: "This description is long enough." }).error, /category/);
  assert.match(validateTicketInput({ subject: "Help me", category: "other", description: "too short" }).error, /Description/);
  assert.match(validateTicketInput({ subject: "x".repeat(121), category: "other", description: "This description is long enough." }).error, /Subject/);
  assert.match(validateTicketInput({ subject: "Help me", category: "other", description: "x".repeat(2001) }).error, /Description/);
  assert.equal(validateTicketInput({ subject: "Help me", category: "other", description: "This description is long enough.", relatedTemplateId: "x".repeat(121) }).error, "Related template ID must be 120 characters or fewer.");
});

test("all configured categories are accepted", () => {
  for (const category of CREATOR_SUPPORT_CATEGORIES) {
    assert.equal(validateTicketInput({ subject: "A valid subject", category, description: "This description is long enough." }).error, undefined);
  }
});

test("email delivery calls Resend with the configured sender and support recipient", async () => {
  const originalFetch = globalThis.fetch;
  const originalApiKey = process.env.RESEND_API_KEY;
  const originalSender = process.env.MAIL_FROM;
  process.env.RESEND_API_KEY = "test-only-key";
  process.env.MAIL_FROM = "hello@jobkhojoai.com";
  let captured;
  globalThis.fetch = async (url, options) => {
    captured = { url, options, payload: JSON.parse(options.body) };
    return { ok: true };
  };
  try {
    await sendEmail({ to: "hello@jobkhojoai.com", subject: "[Creator Support] Test", html: "<p>Test</p>", text: "Test" });
    assert.equal(captured.url, "https://api.resend.com/emails");
    assert.equal(captured.payload.from, "hello@jobkhojoai.com");
    assert.deepEqual(captured.payload.to, ["hello@jobkhojoai.com"]);
    assert.equal(captured.payload.subject, "[Creator Support] Test");
    assert.equal(captured.options.headers.Authorization, "Bearer test-only-key");
  } finally {
    globalThis.fetch = originalFetch;
    if (originalApiKey === undefined) delete process.env.RESEND_API_KEY;
    else process.env.RESEND_API_KEY = originalApiKey;
    if (originalSender === undefined) delete process.env.MAIL_FROM;
    else process.env.MAIL_FROM = originalSender;
  }
});

test("email delivery reports provider failures without claiming success", async () => {
  const originalFetch = globalThis.fetch;
  const originalApiKey = process.env.RESEND_API_KEY;
  process.env.RESEND_API_KEY = "test-only-key";
  globalThis.fetch = async () => ({ ok: false, status: 503 });
  try {
    await assert.rejects(sendEmail({ to: "hello@jobkhojoai.com", subject: "Test", html: "", text: "" }), /could not deliver/);
  } finally {
    globalThis.fetch = originalFetch;
    if (originalApiKey === undefined) delete process.env.RESEND_API_KEY;
    else process.env.RESEND_API_KEY = originalApiKey;
  }
});
