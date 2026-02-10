import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getCookieName } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete(getCookieName());
  return NextResponse.json({ ok: true });
}
