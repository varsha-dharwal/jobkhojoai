import mongoose from "mongoose";

const savedJobSchema = new mongoose.Schema(
  {
    job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    savedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const applicationSchema = new mongoose.Schema(
  {
    job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    status: { type: String, enum: ["applied", "viewed", "interview", "archived"], default: "applied" },
    source: { type: String, trim: true, default: "jobkhojoAI" },
    appliedAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const workExperienceSchema = new mongoose.Schema({
  title: { type: String, trim: true, default: "" },
  company: { type: String, trim: true, default: "" },
  location: { type: String, trim: true, default: "" },
  employmentType: { type: String, trim: true, default: "" },
  startDate: { type: String, trim: true, default: "" },
  endDate: { type: String, trim: true, default: "" },
  description: { type: String, trim: true, default: "" },
  current: { type: Boolean, default: false },
}, { _id: true });

const educationHistorySchema = new mongoose.Schema({
  degree: { type: String, trim: true, default: "" },
  school: { type: String, trim: true, default: "" },
  location: { type: String, trim: true, default: "" },
  startDate: { type: String, trim: true, default: "" },
  endDate: { type: String, trim: true, default: "" },
  description: { type: String, trim: true, default: "" },
}, { _id: true });

const preferenceSchema = new mongoose.Schema({
  readyToWork: { type: Boolean, default: true },
  desiredTitles: { type: [String], default: [] },
  jobTypes: { type: [String], default: [] },
  workSchedules: { type: [String], default: [] },
  minimumPay: { type: Number, default: null },
  payPeriod: { type: String, enum: ["year", "month", "hour"], default: "year" },
  relocationLocations: { type: [String], default: [] },
  remotePreference: { type: String, enum: ["any", "remote", "on-site"], default: "any" },
  countries: { type: [String], default: ["India"] },
  languages: { type: [String], default: ["English"] },
  notInterested: { type: [String], default: [] },
}, { _id: false });

const resumeFileSchema = new mongoose.Schema({
  fileName: { type: String, trim: true, required: true },
  mimeType: { type: String, default: "application/pdf" },
  size: { type: Number, required: true },
  data: { type: String, select: false, required: true },
  uploadedAt: { type: Date, default: Date.now },
}, { _id: false });

const userSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: true },
    email: { type: String, trim: true, lowercase: true, required: true, unique: true },
    phone: { type: String, trim: true, default: "" },
    location: { type: String, trim: true, default: "" },
    profileVisible: { type: Boolean, default: true },
    profileSummary: { type: String, trim: true, default: "" },
    currentSalary: { type: Number, default: null },
    workExperience: { type: [workExperienceSchema], default: [] },
    educationHistory: { type: [educationHistorySchema], default: [] },
    preferences: { type: preferenceSchema, default: () => ({}) },
    resumeFile: { type: resumeFileSchema, default: null },
    emailVerified: { type: Boolean, default: false },
    welcomeEmailSent: { type: Boolean, default: false },
    passwordHash: { type: String, required: false },
    resumeDraft: { type: Object, default: null },
    savedJobs: { type: [savedJobSchema], default: [] },
    applications: { type: [applicationSchema], default: [] },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
