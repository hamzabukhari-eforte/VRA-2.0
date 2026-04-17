import { MembershipSubmissionStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { sendMail } from "@/lib/mail";
import {
  getMembershipAdminRecipient,
  renderAdminNewMembershipEmail,
  renderMembershipPaymentInstructionsEmail,
  renderMembershipWelcomeEmail,
} from "@/lib/membership-email-templates";
import { generateTemporaryPassword, hashPassword } from "@/lib/member-auth";

type MembershipPayload = Record<string, unknown>;

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export function normalizeMembershipSubmission(payload: MembershipPayload) {
  return {
    applicantName: asString(payload.name),
    applicantEmail: asString(payload.email).toLowerCase(),
    applicantPhone: asString(payload.phone),
    membershipType: asString(payload.membershipType),
  };
}

function formatMembershipType(type: string) {
  if (!type) return "Not specified";
  switch (type) {
    case "senior":
      return "Senior";
    case "junior":
      return "Junior";
    case "nonPlaying":
      return "Non-playing";
    default:
      return type;
  }
}

export async function sendSubmissionEmails(input: {
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  membershipType: string;
  createdAt: Date;
}) {
  const membershipTypeLabel = formatMembershipType(input.membershipType);
  const submittedAt = input.createdAt.toLocaleString();
  const recipient = getMembershipAdminRecipient();

  const adminEmail = renderAdminNewMembershipEmail({
    name: input.applicantName,
    email: input.applicantEmail,
    phone: input.applicantPhone,
    membershipType: membershipTypeLabel,
    submittedAt,
  });

  const memberEmail = renderMembershipPaymentInstructionsEmail({
    name: input.applicantName,
    email: input.applicantEmail,
    phone: input.applicantPhone,
    membershipType: membershipTypeLabel,
    submittedAt,
  });

  if (recipient) {
    await sendMail({ to: recipient, ...adminEmail });
  }

  if (input.applicantEmail) {
    await sendMail({ to: input.applicantEmail, ...memberEmail });
  }
}

function getMemberLoginUrl() {
  const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  return `${base.replace(/\/$/, "")}/login`;
}

export async function provisionMemberFromSubmission(submissionId: string) {
  const submission = await prisma.membershipSubmission.findUnique({
    where: { id: submissionId },
    include: { memberAccount: true },
  });

  if (!submission) {
    throw new Error("Membership submission not found.");
  }

  const email = submission.applicantEmail?.trim().toLowerCase();
  const name = submission.applicantName?.trim();

  if (!email || !name) {
    throw new Error("Membership submission is missing applicant email or name.");
  }

  if (submission.status === MembershipSubmissionStatus.PAID && submission.credentialsSentAt) {
    return { submission, created: false, resent: false };
  }

  const password = generateTemporaryPassword();
  const passwordHash = hashPassword(password);

  const memberAccount = await prisma.$transaction(async (tx) => {
    const existing = await tx.memberAccount.findFirst({
      where: {
        OR: [{ membershipSubmissionId: submission.id }, { email }],
      },
    });

    if (existing) {
      return tx.memberAccount.update({
        where: { id: existing.id },
        data: {
          membershipSubmissionId: submission.id,
          email,
          name,
          passwordHash,
        },
      });
    }

    return tx.memberAccount.create({
      data: {
        membershipSubmissionId: submission.id,
        email,
        name,
        passwordHash,
      },
    });
  });

  const welcomeEmail = renderMembershipWelcomeEmail({
    name,
    email,
    password,
    loginUrl: getMemberLoginUrl(),
  });

  await sendMail({ to: email, ...welcomeEmail });

  const updatedSubmission = await prisma.membershipSubmission.update({
    where: { id: submission.id },
    data: {
      status: MembershipSubmissionStatus.PAID,
      paidAt: submission.paidAt ?? new Date(),
      credentialsSentAt: new Date(),
    },
  });

  return { submission: updatedSubmission, memberAccount, created: true, resent: Boolean(submission.memberAccount) };
}
