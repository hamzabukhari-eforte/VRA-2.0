import { MembershipSubmissionStatus, type MemberAccount, type MembershipSubmission } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/db";

export type EmergencyContact = {
  name: string;
  relationship: string;
  phone: string;
  alternatePhone: string;
};

export type GuardianInfo = {
  name: string;
  relationship: string;
  phone: string;
  email: string;
};

export type ProfileOverridesStored = {
  phone?: string;
  alternatePhone?: string;
  street?: string;
  houseNumber?: string;
  postalCode?: string;
  city?: string;
  emergencyContact?: Partial<EmergencyContact>;
  guardianInfo?: Partial<GuardianInfo>;
};

export type MemberProfileSnapshot = {
  memberId: string;
  accountEmail: string;
  displayName: string;
  submission: {
    id: string;
    status: MembershipSubmissionStatus;
    createdAt: string;
    paidAt: string | null;
    credentialsSentAt: string | null;
    membershipType: string;
  };
  profile: {
    legalName: string;
    email: string;
    phone: string;
    alternatePhone: string;
    street: string;
    houseNumber: string;
    postalCode: string;
    city: string;
    nationality: string;
    dob: string;
    gender: string;
    emergencyContact: EmergencyContact;
    guardianInfo: GuardianInfo | null;
  };
  showGuardian: boolean;
};

function asRecord(json: unknown): Record<string, unknown> {
  if (typeof json !== "object" || json === null || Array.isArray(json)) return {};
  return json as Record<string, unknown>;
}

function str(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

export function parseProfileOverrides(raw: unknown): ProfileOverridesStored {
  const o = asRecord(raw);
  const ecRaw = asRecord(o.emergencyContact);
  const gRaw = asRecord(o.guardianInfo);
  return {
    phone: str(o.phone) || undefined,
    alternatePhone: str(o.alternatePhone) || undefined,
    street: str(o.street) || undefined,
    houseNumber: str(o.houseNumber) || undefined,
    postalCode: str(o.postalCode) || undefined,
    city: str(o.city) || undefined,
    emergencyContact:
      Object.keys(ecRaw).length > 0
        ? {
            name: str(ecRaw.name) || undefined,
            relationship: str(ecRaw.relationship) || undefined,
            phone: str(ecRaw.phone) || undefined,
            alternatePhone: str(ecRaw.alternatePhone) || undefined,
          }
        : undefined,
    guardianInfo:
      Object.keys(gRaw).length > 0
        ? {
            name: str(gRaw.name) || undefined,
            relationship: str(gRaw.relationship) || undefined,
            phone: str(gRaw.phone) || undefined,
            email: str(gRaw.email) || undefined,
          }
        : undefined,
  };
}

function mergeEmergency(
  payload: Record<string, unknown>,
  ov: ProfileOverridesStored
): EmergencyContact {
  const fromOv = ov.emergencyContact ?? {};
  return {
    name: str(fromOv.name) || str(payload.emergencyContactName),
    relationship: str(fromOv.relationship) || str(payload.emergencyContactRelationship),
    phone: str(fromOv.phone) || str(payload.emergencyContactPhone),
    alternatePhone: str(fromOv.alternatePhone) || str(payload.emergencyContactAlternatePhone),
  };
}

function mergeGuardian(ov: ProfileOverridesStored): GuardianInfo {
  const g = ov.guardianInfo ?? {};
  return {
    name: str(g.name),
    relationship: str(g.relationship),
    phone: str(g.phone),
    email: str(g.email),
  };
}

export function buildMemberProfileSnapshot(
  account: MemberAccount & { membershipSubmission: MembershipSubmission }
): MemberProfileSnapshot {
  const submission = account.membershipSubmission;
  const payload = asRecord(submission.payload);
  const ov = parseProfileOverrides(account.profileOverrides);

  const membershipType =
    str(submission.membershipType) || str(payload.membershipType) || "";
  const legalName = str(payload.name) || str(submission.applicantName) || account.name;
  const emailFromApp = str(payload.email) || str(submission.applicantEmail);
  const email = (emailFromApp || account.email).toLowerCase();
  const phone =
    str(ov.phone) || str(payload.phone) || str(submission.applicantPhone) || "";

  const street = str(ov.street) || str(payload.street);
  const houseNumber = str(ov.houseNumber) || str(payload.houseNumber);
  const postalCode = str(ov.postalCode) || str(payload.postalCode);
  const city = str(ov.city) || str(payload.city);

  const emergencyContact = mergeEmergency(payload, ov);
  const guardianMerged = mergeGuardian(ov);
  const showGuardian = membershipType === "junior";

  return {
    memberId: account.id,
    accountEmail: account.email,
    displayName: account.name,
    submission: {
      id: submission.id,
      status: submission.status,
      createdAt: submission.createdAt.toISOString(),
      paidAt: submission.paidAt?.toISOString() ?? null,
      credentialsSentAt: submission.credentialsSentAt?.toISOString() ?? null,
      membershipType,
    },
    profile: {
      legalName,
      email,
      phone,
      alternatePhone: str(ov.alternatePhone),
      street,
      houseNumber,
      postalCode,
      city,
      nationality: str(payload.nationality),
      dob: str(payload.dob),
      gender: str(payload.gender),
      emergencyContact,
      guardianInfo: showGuardian ? guardianMerged : null,
    },
    showGuardian,
  };
}

export async function getMemberProfileSnapshot(
  memberAccountId: string
): Promise<MemberProfileSnapshot | null> {
  const account = await prisma.memberAccount.findUnique({
    where: { id: memberAccountId },
    include: { membershipSubmission: true },
  });
  if (!account) return null;
  return buildMemberProfileSnapshot(account);
}

const trimmed = z.string().trim();

export const memberProfilePatchSchema = z
  .object({
    displayName: trimmed.min(1).max(200).optional(),
    phone: trimmed.max(80).optional(),
    alternatePhone: trimmed.max(80).optional(),
    street: trimmed.max(200).optional(),
    houseNumber: trimmed.max(80).optional(),
    postalCode: trimmed.max(40).optional(),
    city: trimmed.max(120).optional(),
    emergencyContact: z
      .object({
        name: trimmed.max(200).optional(),
        relationship: trimmed.max(200).optional(),
        phone: trimmed.max(80).optional(),
        alternatePhone: trimmed.max(80).optional(),
      })
      .optional(),
    guardianInfo: z
      .object({
        name: trimmed.max(200).optional(),
        relationship: trimmed.max(200).optional(),
        phone: trimmed.max(80).optional(),
        email: trimmed.max(200).optional(),
      })
      .optional(),
  })
  .strict();

export type MemberProfilePatch = z.infer<typeof memberProfilePatchSchema>;

function emergencyIsEmpty(e: EmergencyContact): boolean {
  return !e.name && !e.relationship && !e.phone && !e.alternatePhone;
}

function guardianIsEmpty(g: GuardianInfo): boolean {
  return !g.name && !g.relationship && !g.phone && !g.email;
}

/** Merges a validated PATCH into stored profileOverrides and returns the next JSON value. */
export function applyProfilePatch(
  currentOverrides: unknown,
  patch: MemberProfilePatch,
  options: { allowGuardian: boolean }
): ProfileOverridesStored {
  const next: ProfileOverridesStored = { ...parseProfileOverrides(currentOverrides) };

  const setScalar = (key: keyof ProfileOverridesStored, val: string | undefined) => {
    if (val === undefined) return;
    const t = val.trim();
    if (!t) delete next[key];
    else next[key] = t;
  };

  setScalar("phone", patch.phone);
  setScalar("alternatePhone", patch.alternatePhone);
  setScalar("street", patch.street);
  setScalar("houseNumber", patch.houseNumber);
  setScalar("postalCode", patch.postalCode);
  setScalar("city", patch.city);

  if (patch.emergencyContact !== undefined) {
    const merged: EmergencyContact = {
      name: patch.emergencyContact.name ?? next.emergencyContact?.name ?? "",
      relationship: patch.emergencyContact.relationship ?? next.emergencyContact?.relationship ?? "",
      phone: patch.emergencyContact.phone ?? next.emergencyContact?.phone ?? "",
      alternatePhone:
        patch.emergencyContact.alternatePhone ?? next.emergencyContact?.alternatePhone ?? "",
    };
    if (emergencyIsEmpty(merged)) delete next.emergencyContact;
    else next.emergencyContact = merged;
  }

  if (options.allowGuardian && patch.guardianInfo !== undefined) {
    const merged: GuardianInfo = {
      name: patch.guardianInfo.name ?? next.guardianInfo?.name ?? "",
      relationship: patch.guardianInfo.relationship ?? next.guardianInfo?.relationship ?? "",
      phone: patch.guardianInfo.phone ?? next.guardianInfo?.phone ?? "",
      email: patch.guardianInfo.email ?? next.guardianInfo?.email ?? "",
    };
    if (guardianIsEmpty(merged)) delete next.guardianInfo;
    else next.guardianInfo = merged;
  }

  return next;
}

export function membershipTypeLabel(code: string): string {
  if (!code) return "Not specified";
  switch (code) {
    case "senior":
      return "Senior";
    case "junior":
      return "Junior";
    case "nonPlaying":
      return "Non-playing";
    default:
      return code;
  }
}

export function membershipCodeToTerminationLabel(code: string): string {
  switch (code) {
    case "senior":
      return "Senior (18+)";
    case "junior":
      return "Junior";
    case "nonPlaying":
      return "Non-playing member";
    default:
      return "";
  }
}

export function splitFullName(full: string): { firstName: string; lastName: string } {
  const t = full.trim();
  const i = t.indexOf(" ");
  if (i === -1) return { firstName: t, lastName: "" };
  return { firstName: t.slice(0, i), lastName: t.slice(i + 1).trim() };
}
