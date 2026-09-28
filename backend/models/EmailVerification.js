import mongoose from "mongoose";

const emailVerificationSchema = new mongoose.Schema({
  email: { type: String, required: true },
  purpose: { type: String, enum: ["signup", "login"], required: true },
  codeHash: { type: String, required: true },
  name: { type: String, default: "" },
  phone: { type: String, default: "" },
  attempts: { type: Number, default: 0 },
  sentAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true, expires: 0 },
}, { timestamps: true });

emailVerificationSchema.index({ email: 1, purpose: 1 }, { unique: true });

export default mongoose.model("EmailVerification", emailVerificationSchema);
