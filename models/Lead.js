import mongoose from "mongoose";

const LeadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  budget: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ["New", "Contacted", "Closed"], default: "New" },
}, { timestamps: true });

export default mongoose.models.Lead || mongoose.model("Lead", LeadSchema);