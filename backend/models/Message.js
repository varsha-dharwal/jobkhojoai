import mongoose from "mongoose";

// Messages sent through the website's contact form, read in the admin panel.
const messageSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: true, maxlength: 100 },
    email: { type: String, trim: true, lowercase: true, required: true, maxlength: 200 },
    topic: { type: String, trim: true, default: "general", maxlength: 40 },
    pageUrl: { type: String, trim: true, default: "", maxlength: 500 },
    message: { type: String, trim: true, required: true, maxlength: 5000 },
    handled: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Message", messageSchema);
