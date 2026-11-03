import { Injectable } from "@nestjs/common";
import { createHmac, timingSafeEqual } from "crypto";
import type { Request } from "express";

export const ADMIN_COOKIE_NAME = "admin_session";
const SALT = "vra-admin-secret";

/**
 * Ported from apps/web/lib/admin-auth.ts.
 * Uses @Req() cookies (via cookie-parser) instead of next/headers `cookies()`.
 */
@Injectable()
export class AdminAuthService {
  private getExpectedToken(): string | null {
    const email = process.env.ADMIN_EMAIL?.trim();
    const password = process.env.ADMIN_PASSWORD;
    if (!email || !password) return null;
    return createHmac("sha256", SALT).update(`${email}:${password}`).digest("hex");
  }

  getAdminToken(): string | null {
    return this.getExpectedToken() ?? null;
  }

  verifyAdminToken(cookieValue: string | undefined): boolean {
    const expected = this.getExpectedToken();
    if (!expected || !cookieValue) return false;
    if (cookieValue.length !== expected.length) return false;
    try {
      return timingSafeEqual(Buffer.from(cookieValue, "utf8"), Buffer.from(expected, "utf8"));
    } catch {
      return false;
    }
  }

  isAdminAuthenticated(req: Request): boolean {
    if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
      return true; // no auth configured = allow access
    }
    const value = (req.cookies as Record<string, string> | undefined)?.[ADMIN_COOKIE_NAME];
    return this.verifyAdminToken(value);
  }

  getCookieName(): string {
    return ADMIN_COOKIE_NAME;
  }

  /** NOTE: maxAge is in milliseconds for express's res.cookie (Next.js cookies() API uses seconds). */
  getCookieOptions() {
    return {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
      maxAge: 60 * 60 * 24 * 1000, // 24 hours
    };
  }
}
