import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  getAdminToken,
  getCookieName,
  getCookieOptions,
  verifyAdminToken,
} from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await request.json();
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";

  const expectedEmail = process.env.ADMIN_EMAIL;
  const expectedPassword = process.env.ADMIN_PASSWORD;

  if (!expectedEmail || !expectedPassword) {
    return NextResponse.json(
      { error: "Admin login not configured" },
      { status: 503 }
    );
  }

  if (email !== expectedEmail || password !== expectedPassword) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  const token = getAdminToken();
  if (!token) {
    return NextResponse.json({ error: "Admin token not available" }, { status: 500 });
  }

  const cookieStore = await cookies();
  cookieStore.set(getCookieName(), token, getCookieOptions());

  return NextResponse.json({ ok: true });
}
