import mongoose from "mongoose";

export async function connectDB() {
  if (!process.env.MONGODB_URI) {
    console.error("MongoDB connection failed: MONGODB_URI is not configured.");
    process.exit(1);
  }
  try {
    await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
    console.log("MongoDB connected");
  } catch (err) {
    // Log server-side diagnostics, but never return connection details through an API response.
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  }
}
