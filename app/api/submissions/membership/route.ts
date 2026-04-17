import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { normalizeMembershipSubmission, sendSubmissionEmails } from "@/lib/membership";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const normalized = normalizeMembershipSubmission(body);

    if (!normalized.applicantName || !normalized.applicantEmail) {
      return NextResponse.json(
        { error: "Applicant name and email are required." },
        { status: 400 }
      );
    }

    const submission = await prisma.membershipSubmission.create({
      data: {
        payload: body,
        ...normalized,
      },
    });

    await sendSubmissionEmails({
      applicantName: normalized.applicantName,
      applicantEmail: normalized.applicantEmail,
      applicantPhone: normalized.applicantPhone,
      membershipType: normalized.membershipType,
      createdAt: submission.createdAt,
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to submit" }, { status: 500 });
  }
}
