import { signToken } from "../../../../lib/auth";

export async function POST(req) {
  const { email, password } = await req.json();

  if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
    return Response.json({ success: false, message: "Invalid credentials" }, { status: 401 });
  }

  const token = signToken({ email, role: "admin" });
  return Response.json({ success: true, token });
}