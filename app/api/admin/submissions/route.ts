import { NextResponse } from "next/server";
import { MembershipSubmissionStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { provisionMemberFromSubmission } from "@/lib/membership";

export const dynamic = "force-dynamic";

const TABLES = {
  contact: prisma.contactSubmission,
  membership: prisma.membershipSubmission,
  termination: prisma.membershipTerminationSubmission,
  donation: prisma.donationSubmission,
  "net-booking": prisma.indoorNetBookingSubmission,
} as const;

export type SubmissionType = keyof typeof TABLES;

export async function GET(request: Request) {
  const authed = await isAdminAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") as SubmissionType | null;
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "20", 10)));
  const from = searchParams.get("from"); // date filter YYYY-MM-DD
  const to = searchParams.get("to");

  if (!type || !TABLES[type]) {
    return NextResponse.json(
      { error: "Invalid type. Use: contact, membership, termination, donation, net-booking" },
      { status: 400 }
    );
  }

  const table = TABLES[type];
  const skip = (page - 1) * limit;

  const where: { createdAt?: { gte?: Date; lte?: Date } } = {};
  if (from) where.createdAt = { ...where.createdAt, gte: new Date(from) };
  if (to) where.createdAt = { ...where.createdAt, lte: new Date(to) };

  const [items, total] = await Promise.all([
    (table as { findMany: (args: unknown) => Promise<unknown[]> }).findMany({
      where: Object.keys(where).length ? where : undefined,
      orderBy: { createdAt: "desc" as const },
      skip,
      take: limit,
    }),
    (table as { count: (args: unknown) => Promise<number> }).count({
      where: Object.keys(where).length ? where : undefined,
    }),
  ]);

  return NextResponse.json({
    items,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  });
}

export async function PATCH(request: Request) {
  const authed = await isAdminAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const type = body?.type as SubmissionType | undefined;
    const submissionId =
      typeof body?.submissionId === "string" ? body.submissionId : "";
    const status =
      typeof body?.status === "string" ? body.status.toUpperCase() : "";

    if (type !== "membership") {
      return NextResponse.json(
        { error: "Only membership submissions are editable." },
        { status: 400 }
      );
    }

    if (!submissionId) {
      return NextResponse.json(
        { error: "Submission id is required." },
        { status: 400 }
      );
    }

    if (status === MembershipSubmissionStatus.PAID) {
      const result = await provisionMemberFromSubmission(submissionId);
      return NextResponse.json({ ok: true, item: result.submission });
    }

    if (status === MembershipSubmissionStatus.SUBMITTED) {
      const item = await prisma.membershipSubmission.update({
        where: { id: submissionId },
        data: {
          status: MembershipSubmissionStatus.SUBMITTED,
          paidAt: null,
        },
      });

      return NextResponse.json({ ok: true, item });
    }

    return NextResponse.json({ error: "Invalid membership status." }, { status: 400 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update membership submission." },
      { status: 500 }
    );
  }
}
