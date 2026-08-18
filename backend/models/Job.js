import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true },
    organization: { type: String, trim: true },
    category: { type: String, enum: ["Full-time", "Internship"] },
    remote: { type: Boolean, default: false },
    location: { type: String, default: "Across India" },
    salaryMin: { type: String },
    salaryMax: { type: String },
    vacancies: { type: String },
    startDate: { type: Date },
    lastDate: { type: Date },
    applyLink: { type: String },
    roleDescription: { type: String },
    responsibilities: { type: String },
    requirements: { type: String },
    aboutCompany: { type: String },
    slug: { type: String, required: true, unique: true },
    status: { type: String, enum: ["active", "expired"], default: "active" },
  },
  { timestamps: true }
);

jobSchema.index({ title: "text", organization: "text" });

export default mongoose.model("Job", jobSchema);
