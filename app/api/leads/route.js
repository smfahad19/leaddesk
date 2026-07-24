import connectDB from "../../../lib/db";
import Lead from "../../../models/Lead";
import { verifyToken } from "../../../lib/auth";

export async function POST(req) {
  try {
    await connectDB();
    const { name, email, budget, message } = await req.json();

    if (!name || !email || !budget || !message) {
      return Response.json({ success: false, message: "All fields are required" }, { status: 400 });
    }

    const lead = await Lead.create({ name, email, budget, message });
    return Response.json({ success: true, lead }, { status: 201 });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
    verifyToken(token);

    await connectDB();
    const leads = await Lead.find().sort({ createdAt: -1 });
    return Response.json({ success: true, leads });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}