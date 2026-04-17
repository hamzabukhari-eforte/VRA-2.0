import { NextResponse } from "next/server";
import { getAuthenticatedMember } from "@/lib/member-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const member = await getAuthenticatedMember();
  if (!member) {
    return NextResponse.json({ user: null });
  }
  return NextResponse.json({
    user: {
      id: member.id,
      name: member.name,
      email: member.email,
    },
  });
}
