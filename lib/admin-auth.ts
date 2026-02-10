import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

const COOKIE_NAME = "admin_session";
const SALT = "vra-admin-secret";

function getExpectedToken(): string | null {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) return null;
  return createHmac("sha256", SALT).update(`${email}:${password}`).digest("hex");
}

export function getAdminToken(): string | null {
  const token = getExpectedToken();
  return token ?? null;
}

export function verifyAdminToken(cookieValue: string | undefined): boolean {
  const expected = getExpectedToken();
  if (!expected || !cookieValue) return false;
  if (cookieValue.length !== expected.length) return false;
  try {
    return timingSafeEqual(Buffer.from(cookieValue, "utf8"), Buffer.from(expected, "utf8"));
  } catch {
    return false;
  }
}

export async function isAdminAuthenticated(): Promise<boolean> {
  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
    return true; // no auth configured = allow access
  }
  const cookieStore = await cookies();
  const value = cookieStore.get(COOKIE_NAME)?.value;
  return verifyAdminToken(value);
}

export function getCookieName(): string {
  return COOKIE_NAME;
}

export function getCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24, // 24 hours
  };
}
