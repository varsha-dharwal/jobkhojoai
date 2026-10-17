import mongoose from "mongoose";

const schema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  name: { type: String, default: "" },
  verified: { type: Boolean, default: false },
  subscribed: { type: Boolean, default: false },
  codeHash: { type: String, default: "" },
  codeExpiresAt: { type: Date, default: null },
  codeSentAt: { type: Date, default: null },
  codeAttempts: { type: Number, default: 0 },
  unsubscribeToken: { type: String, required: true, unique: true },
  consentedAt: { type: Date, default: null },
}, { timestamps: true });

export default mongoose.model("JobAlertSubscriber", schema);
