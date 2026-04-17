import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import {
  createMemberSession,
  getMemberCookieName,
  getMemberCookieOptions,
  verifyPassword,
} from "@/lib/member-auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const member = await prisma.memberAccount.findUnique({ where: { email } });
    if (!member || !verifyPassword(password, member.passwordHash)) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    const sessionToken = await createMemberSession(member.id);
    await prisma.memberAccount.update({
      where: { id: member.id },
      data: { lastLoginAt: new Date() },
    });

    const cookieStore = await cookies();
    cookieStore.set(
      getMemberCookieName(),
      sessionToken,
      getMemberCookieOptions()
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to sign in." },
      { status: 500 }
    );
  }
}
