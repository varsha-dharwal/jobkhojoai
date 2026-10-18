import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true },
    organization: { type: String, trim: true },
    logoUrl: { type: String },
    category: { type: String, enum: ["Full-time", "Part-time", "Internship"] },
    remote: { type: Boolean, default: false },
    location: { type: String, default: "Across India" },
    salaryMin: { type: String },
    salaryMax: { type: String },
    vacancies: { type: String },
    experience: { type: String },
    education: { type: String },
    skills: { type: String },
    startDate: { type: Date },
    lastDate: { type: Date },
    applyLink: { type: String },
    roleDescription: { type: String },
    responsibilities: { type: String },
    requirements: { type: String },
    aboutCompany: { type: String },
    // JobKhojo's own write-up (who should apply, selection process, how to prepare).
    // Job pages are only indexed by search engines once this is filled in.
    editorNote: { type: String, default: "" },
    slug: { type: String, required: true, unique: true },
    status: { type: String, enum: ["active", "expired"], default: "active" },
    expiryReminderFor: { type: Date, default: null },
  },
  { timestamps: true }
);

jobSchema.index({ title: "text", organization: "text", skills: "text" });

export default mongoose.model("Job", jobSchema);
