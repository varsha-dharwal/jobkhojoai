import mongoose from "mongoose";

const CATEGORIES = [
  "account-profile",
  "template-upload-preview",
  "template-review",
  "earnings-sales",
  "payouts",
  "technical-issue",
  "other",
];

const responseSchema = new mongoose.Schema({
  body: { type: String, trim: true, required: true, maxlength: 2000 },
  authorType: { type: String, enum: ["support"], default: "support" },
  createdAt: { type: Date, default: Date.now },
}, { _id: false });

const creatorSupportTicketSchema = new mongoose.Schema({
  ticketId: { type: String, required: true, unique: true, maxlength: 48 },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  subject: { type: String, trim: true, required: true, minlength: 5, maxlength: 120 },
  category: { type: String, enum: CATEGORIES, required: true },
  description: { type: String, trim: true, required: true, minlength: 20, maxlength: 2000 },
  relatedTemplateId: { type: String, trim: true, default: "", maxlength: 120 },
  status: { type: String, enum: ["Open", "In Progress", "Resolved"], default: "Open" },
  notificationStatus: { type: String, enum: ["pending", "sending", "sent", "failed"], default: "pending" },
  notificationSentAt: { type: Date, default: null },
  responses: { type: [responseSchema], default: [] },
}, { timestamps: true });

creatorSupportTicketSchema.index({ creator: 1, createdAt: -1 });

export { CATEGORIES as CREATOR_SUPPORT_CATEGORIES };
export default mongoose.model("CreatorSupportTicket", creatorSupportTicketSchema);
