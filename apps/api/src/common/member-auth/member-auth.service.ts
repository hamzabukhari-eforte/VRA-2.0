import { Injectable } from "@nestjs/common";
import { randomBytes, scryptSync, timingSafeEqual, createHash } from "crypto";
import type { Request } from "express";
import { prisma } from "@vra/db";

export const MEMBER_COOKIE_NAME = "member_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 30;

/**
 * Ported from apps/web/lib/member-auth.ts.
 * Uses @Req() cookies (via cookie-parser) instead of next/headers `cookies()`.
 */
@Injectable()
export class MemberAuthService {
  private getPasswordSalt(): string {
    return process.env.MEMBER_PASSWORD_SALT || "vra-member-password-salt";
  }

  private getSessionSalt(): string {
    return process.env.MEMBER_SESSION_SALT || "vra-member-session-salt";
  }

  hashPassword(password: string): string {
    return scryptSync(password, this.getPasswordSalt(), 64).toString("hex");
  }

  verifyPassword(password: string, passwordHash: string): boolean {
    const derived = Buffer.from(this.hashPassword(password), "hex");
    const existing = Buffer.from(passwordHash, "hex");
    if (derived.length !== existing.length) return false;
    return timingSafeEqual(derived, existing);
  }

  generateTemporaryPassword(length = 12): string {
    const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%";
    const bytes = randomBytes(length);
    return Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join("");
  }

  private hashSessionToken(token: string): string {
    return createHash("sha256").update(`${this.getSessionSalt()}:${token}`).digest("hex");
  }

  async createMemberSession(memberAccountId: string): Promise<string> {
    const rawToken = randomBytes(32).toString("hex");
    await prisma.memberSession.create({
      data: {
        memberAccountId,
        tokenHash: this.hashSessionToken(rawToken),
        expiresAt: new Date(Date.now() + SESSION_TTL_MS),
      },
    });
    return rawToken;
  }

  getMemberCookieName(): string {
    return MEMBER_COOKIE_NAME;
  }

  /** NOTE: maxAge is in milliseconds for express's res.cookie (Next.js cookies() API uses seconds). */
  getMemberCookieOptions() {
    return {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
      maxAge: 60 * 60 * 24 * 30 * 1000, // 30 days
    };
  }

  getTokenFromRequest(req: Request): string | undefined {
    return (req.cookies as Record<string, string> | undefined)?.[MEMBER_COOKIE_NAME];
  }

  async getAuthenticatedMember(req: Request) {
    const token = this.getTokenFromRequest(req);
    if (!token) return null;

    const session = await prisma.memberSession.findUnique({
      where: { tokenHash: this.hashSessionToken(token) },
      include: { memberAccount: true },
    });

    if (!session) return null;
    if (session.expiresAt.getTime() <= Date.now()) {
      await prisma.memberSession.delete({ where: { id: session.id } }).catch(() => null);
      return null;
    }

    return session.memberAccount;
  }

  /** Deletes the DB session row for the request's cookie. Caller is responsible for clearing the cookie itself via res.clearCookie(). */
  async clearMemberSession(req: Request): Promise<void> {
    const token = this.getTokenFromRequest(req);
    if (token) {
      await prisma.memberSession
        .deleteMany({ where: { tokenHash: this.hashSessionToken(token) } })
        .catch(() => null);
    }
  }
}
