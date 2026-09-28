import mongoose from "mongoose";

const userActivitySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  type: { type: String, enum: ["visit", "apply"], required: true, index: true },
  isReturn: { type: Boolean, default: false },
  job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", default: null },
}, { timestamps: true });

userActivitySchema.index({ createdAt: -1, type: 1 });

export default mongoose.model("UserActivity", userActivitySchema);
