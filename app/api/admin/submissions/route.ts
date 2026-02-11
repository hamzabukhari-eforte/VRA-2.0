import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

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
