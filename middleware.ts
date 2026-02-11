import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const COOKIE_NAME = "admin_session";
const SALT = "vra-admin-secret";

async function hmacSha256Hex(secret: string, data: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(data)
  );
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) {
    out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return out === 0;
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  // Require auth for all other /admin routes: redirect to login if no valid session
  const email = process.env.ADMIN_EMAIL?.trim();
  const password = process.env.ADMIN_PASSWORD;
  const hasAuthConfigured = Boolean(email && password);

  if (hasAuthConfigured) {
    const cookieValue = request.cookies.get(COOKIE_NAME)?.value;
    const expectedToken = await hmacSha256Hex(SALT, `${email}:${password}`);

    if (!cookieValue || !timingSafeEqual(cookieValue, expectedToken)) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  } else {
    // Auth not configured: still send to login page (it will show "not configured")
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
