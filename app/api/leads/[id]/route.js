import connectDB from "../../../../lib/db";
import Lead from "../../../../models/Lead";
import { verifyToken } from "../../../../lib/auth";

export async function PATCH(req, { params }) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
    verifyToken(token);

    await connectDB();
    const { status } = await req.json();
    const { id } = await params;

    const lead = await Lead.findByIdAndUpdate(id, { status }, { new: true });
    return Response.json({ success: true, lead });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}