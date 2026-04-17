import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getAuthenticatedMember } from "@/lib/member-auth";
import {
  applyProfilePatch,
  buildMemberProfileSnapshot,
  getMemberProfileSnapshot,
  memberProfilePatchSchema,
} from "@/lib/member-profile";

export const dynamic = "force-dynamic";

function payloadRecord(payload: unknown): Record<string, unknown> {
  if (typeof payload !== "object" || payload === null || Array.isArray(payload)) return {};
  return payload as Record<string, unknown>;
}

export async function GET() {
  const member = await getAuthenticatedMember();
  if (!member) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const snapshot = await getMemberProfileSnapshot(member.id);
  if (!snapshot) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(snapshot);
}

export async function PATCH(request: Request) {
  const member = await getAuthenticatedMember();
  if (!member) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = memberProfilePatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const account = await prisma.memberAccount.findUnique({
    where: { id: member.id },
    include: { membershipSubmission: true },
  });
  if (!account) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const sub = account.membershipSubmission;
  const payload = payloadRecord(sub.payload);
  const membershipType =
    (typeof sub.membershipType === "string" && sub.membershipType) ||
    (typeof payload.membershipType === "string" ? payload.membershipType : "");
  const allowGuardian = membershipType === "junior";

  const nextOverrides = applyProfilePatch(account.profileOverrides, parsed.data, {
    allowGuardian,
  });

  const updateData: Prisma.MemberAccountUpdateInput = {
    profileOverrides: nextOverrides as Prisma.InputJsonValue,
  };

  if (parsed.data.displayName !== undefined) {
    updateData.name = parsed.data.displayName.trim();
  }

  const updated = await prisma.memberAccount.update({
    where: { id: member.id },
    data: updateData,
    include: { membershipSubmission: true },
  });

  return NextResponse.json(buildMemberProfileSnapshot(updated));
}
