import mongoose from "mongoose";

const jobReportSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true, index: true },
  reason: { type: String, enum: ["Job is closed or expired", "Incorrect job information", "Suspicious or unsafe listing"], required: true },
  details: { type: String, trim: true, maxlength: 1000, default: "" },
  status: { type: String, enum: ["open", "reviewed", "dismissed"], default: "open" },
}, { timestamps: true });

export default mongoose.model("JobReport", jobReportSchema);
