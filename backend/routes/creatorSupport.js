import { randomUUID } from "node:crypto";
import express from "express";
import CreatorSupportTicket, { CREATOR_SUPPORT_CATEGORIES } from "../models/CreatorSupportTicket.js";
import User from "../models/User.js";
import { requireUser } from "../middleware/auth.js";
import { sendEmail } from "../services/emailDelivery.js";

const router = express.Router();
const CATEGORY_SET = new Set(CREATOR_SUPPORT_CATEGORIES);

function ticketDto(ticket) {
  return {
    ticketId: ticket.ticketId,
    subject: ticket.subject,
    category: ticket.category,
    description: ticket.description,
    relatedTemplateId: ticket.relatedTemplateId || "",
    status: ticket.status,
    notificationStatus: ticket.notificationStatus,
    notificationSentAt: ticket.notificationSentAt,
    createdAt: ticket.createdAt,
    updatedAt: ticket.updatedAt,
    responses: (ticket.responses || []).map((response) => ({ body: response.body, createdAt: response.createdAt })),
  };
}

function validateTicketInput(body = {}) {
  const subject = typeof body.subject === "string" ? body.subject.trim() : "";
  const category = typeof body.category === "string" ? body.category.trim() : "";
  const description = typeof body.description === "string" ? body.description.trim() : "";
  const relatedTemplateId = typeof body.relatedTemplateId === "string" ? body.relatedTemplateId.trim() : "";
  if (subject.length < 5 || subject.length > 120) return { error: "Subject must be between 5 and 120 characters." };
  if (!CATEGORY_SET.has(category)) return { error: "Select a valid support category." };
  if (description.length < 20 || description.length > 2000) return { error: "Description must be between 20 and 2000 characters." };
  if (relatedTemplateId.length > 120) return { error: "Related template ID must be 120 characters or fewer." };
  return { value: { subject, category, description, relatedTemplateId } };
}

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
}

const CATEGORY_LABELS = {
  "account-profile": "Account & Profile",
  "template-upload-preview": "Template Upload or PDF Preview",
  "template-review": "Template Review",
  "earnings-sales": "Earnings & Sales",
  payouts: "Payouts",
  "technical-issue": "Technical Issue",
  other: "Other",
};

async function deliverTicketNotification(ticketId, creatorId, creatorOverride = null) {
  let ticket = await CreatorSupportTicket.findOne({ ticketId, creator: creatorId });
  if (!ticket) return { sent: false, ticket: null, error: "Support request not found." };
  if (ticket.notificationStatus === "sent") return { sent: true, ticket };

  ticket = await CreatorSupportTicket.findOneAndUpdate(
    { _id: ticket._id, notificationStatus: { $in: ["pending", "failed"] } },
    { $set: { notificationStatus: "sending" } },
    { new: true },
  );
  if (!ticket) {
    const current = await CreatorSupportTicket.findOne({ ticketId, creator: creatorId });
    if (current?.notificationStatus === "sent") return { sent: true, ticket: current };
    return { sent: false, ticket: current, error: "This notification is already being sent. Please wait a moment." };
  }

  try {
    const creator = creatorOverride || await User.findById(creatorId).select("name email");
    if (!creator) throw new Error("The creator account could not be verified.");
    const to = process.env.SUPPORT_EMAIL || "hello@jobkhojoai.com";
    const safeSubject = ticket.subject.replace(/[\r\n]+/g, " ");
    const category = CATEGORY_LABELS[ticket.category] || ticket.category;
    const submittedAt = new Date(ticket.createdAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
    const templateLine = ticket.relatedTemplateId ? `Related template ID: ${ticket.relatedTemplateId}` : "No related template ID provided.";
    const text = [
      "A creator submitted a support request on JobKhojo.",
      `Ticket ID: ${ticket.ticketId}`,
      `Creator: ${creator.name} <${creator.email}>`,
      `Category: ${category}`,
      `Subject: ${safeSubject}`,
      `Submitted: ${submittedAt} IST`,
      templateLine,
      "",
      "Description:",
      ticket.description,
    ].join("\n");
    const html = `<div style="font-family:Arial,sans-serif;color:#0f172a;max-width:680px;margin:auto"><h2 style="color:#2563eb">New Creator Studio support request</h2><p><strong>Ticket ID:</strong> ${escapeHtml(ticket.ticketId)}</p><p><strong>Creator:</strong> ${escapeHtml(creator.name)} &lt;${escapeHtml(creator.email)}&gt;</p><p><strong>Category:</strong> ${escapeHtml(category)}</p><p><strong>Subject:</strong> ${escapeHtml(safeSubject)}</p><p><strong>Submitted:</strong> ${escapeHtml(submittedAt)} IST</p><p><strong>${escapeHtml(templateLine)}</strong></p><h3>Description</h3><p style="white-space:pre-wrap">${escapeHtml(ticket.description)}</p></div>`;
    await sendEmail({ to, subject: `[Creator Support] ${safeSubject}`, html, text });
  } catch (error) {
    console.error("Creator support notification failed:", error.message);
    ticket.notificationStatus = "failed";
    await ticket.save().catch((saveError) => console.error("Could not record support notification failure:", saveError.message));
    return { sent: false, ticket, error: "Email could not be sent. Check the Resend configuration and retry." };
  }
  ticket.notificationStatus = "sent";
  ticket.notificationSentAt = new Date();
  await ticket.save().catch((saveError) => console.error("Could not update sent support notification status:", saveError.message));
  return { sent: true, ticket };
}

router.use(requireUser);

router.get("/", async (req, res) => {
  try {
    const tickets = await CreatorSupportTicket.find({ creator: req.userId }).sort({ createdAt: -1 }).limit(200).lean();
    res.json(tickets.map(ticketDto));
  } catch (error) {
    console.error("Creator support ticket list failed:", error.message);
    res.status(500).json({ message: "Support requests could not be loaded. Please try again." });
  }
});

router.post("/", async (req, res) => {
  const validated = validateTicketInput(req.body);
  if (validated.error) return res.status(400).json({ message: validated.error });

  try {
    const creator = await User.findById(req.userId).select("name email");
    if (!creator) return res.status(401).json({ message: "Your account could not be verified. Sign in again." });
    const ticket = await CreatorSupportTicket.create({
      ticketId: `JKH-${randomUUID()}`,
      creator: req.userId,
      ...validated.value,
      status: "Open",
      notificationStatus: "pending",
      responses: [],
    });
    const notification = await deliverTicketNotification(ticket.ticketId, req.userId, creator);
    if (!notification.sent) {
      return res.status(503).json({
        message: `Ticket ${ticket.ticketId} was saved, but its notification email to ${process.env.SUPPORT_EMAIL || "hello@jobkhojoai.com"} could not be delivered. You can retry from ticket details.`,
        ticketSaved: true,
        notificationSent: false,
        ticket: ticketDto(notification.ticket || ticket),
      });
    }
    res.status(201).json({ ...ticketDto(notification.ticket), notificationSent: true });
  } catch (error) {
    console.error("Creator support ticket creation failed:", error.message);
    res.status(500).json({ message: "Your support request could not be saved. Please try again." });
  }
});

router.post("/:ticketId/retry-email", async (req, res) => {
  try {
    const notification = await deliverTicketNotification(req.params.ticketId, req.userId);
    if (!notification.ticket) return res.status(404).json({ message: "Support request not found." });
    if (!notification.sent) {
      const statusCode = notification.ticket.notificationStatus === "sending" ? 409 : 503;
      return res.status(statusCode).json({ message: notification.error || "Email could not be sent. Please retry." });
    }
    res.json({ ...ticketDto(notification.ticket), notificationSent: true });
  } catch (error) {
    console.error("Creator support notification retry failed:", error.message);
    res.status(500).json({ message: "The support notification could not be retried. Please try again." });
  }
});

router.get("/:ticketId", async (req, res) => {
  try {
    const ticket = await CreatorSupportTicket.findOne({ ticketId: req.params.ticketId, creator: req.userId }).lean();
    if (!ticket) return res.status(404).json({ message: "Support request not found." });
    res.json(ticketDto(ticket));
  } catch (error) {
    console.error("Creator support ticket detail failed:", error.message);
    res.status(500).json({ message: "Support request could not be loaded. Please try again." });
  }
});

export { validateTicketInput };
export default router;
