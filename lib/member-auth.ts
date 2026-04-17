import { cookies } from "next/headers";
import { randomBytes, scryptSync, timingSafeEqual, createHash } from "crypto";
import { prisma } from "@/lib/db";

const MEMBER_COOKIE_NAME = "member_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 30;

function getPasswordSalt(): string {
  return process.env.MEMBER_PASSWORD_SALT || "vra-member-password-salt";
}

function getSessionSalt(): string {
  return process.env.MEMBER_SESSION_SALT || "vra-member-session-salt";
}

export function hashPassword(password: string): string {
  const salt = getPasswordSalt();
  return scryptSync(password, salt, 64).toString("hex");
}

export function verifyPassword(password: string, passwordHash: string): boolean {
  const derived = Buffer.from(hashPassword(password), "hex");
  const existing = Buffer.from(passwordHash, "hex");
  if (derived.length !== existing.length) return false;
  return timingSafeEqual(derived, existing);
}

export function generateTemporaryPassword(length = 12): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%";
  const bytes = randomBytes(length);
  return Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join("");
}

function hashSessionToken(token: string): string {
  return createHash("sha256")
    .update(`${getSessionSalt()}:${token}`)
    .digest("hex");
}

export async function createMemberSession(memberAccountId: string): Promise<string> {
  const rawToken = randomBytes(32).toString("hex");
  await prisma.memberSession.create({
    data: {
      memberAccountId,
      tokenHash: hashSessionToken(rawToken),
      expiresAt: new Date(Date.now() + SESSION_TTL_MS),
    },
  });
  return rawToken;
}

export function getMemberCookieName(): string {
  return MEMBER_COOKIE_NAME;
}

export function getMemberCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  };
}

export async function getAuthenticatedMember() {
  const cookieStore = await cookies();
  const token = cookieStore.get(MEMBER_COOKIE_NAME)?.value;
  if (!token) return null;

  const session = await prisma.memberSession.findUnique({
    where: { tokenHash: hashSessionToken(token) },
    include: { memberAccount: true },
  });

  if (!session) return null;
  if (session.expiresAt.getTime() <= Date.now()) {
    await prisma.memberSession.delete({ where: { id: session.id } }).catch(() => null);
    return null;
  }

  return session.memberAccount;
}

export async function clearMemberSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(MEMBER_COOKIE_NAME)?.value;
  if (token) {
    await prisma.memberSession
      .deleteMany({
        where: { tokenHash: hashSessionToken(token) },
      })
      .catch(() => null);
  }
  cookieStore.delete(MEMBER_COOKIE_NAME);
}
