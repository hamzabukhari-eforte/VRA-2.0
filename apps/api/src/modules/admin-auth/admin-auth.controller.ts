import { Body, Controller, Post, Res } from "@nestjs/common";
import type { Response } from "express";
import { AdminAuthService } from "../../common/admin-auth/admin-auth.service";

/** Ported from apps/web/app/api/admin/auth/{login,logout}/route.ts */
@Controller("admin/auth")
export class AdminAuthController {
  constructor(private readonly adminAuthService: AdminAuthService) {}

  @Post("login")
  async login(@Body() body: any, @Res({ passthrough: true }) res: Response) {
    const email = typeof body?.email === "string" ? body.email.trim() : "";
    const password = typeof body?.password === "string" ? body.password : "";

    const expectedEmail = process.env.ADMIN_EMAIL;
    const expectedPassword = process.env.ADMIN_PASSWORD;

    if (!expectedEmail || !expectedPassword) {
      res.status(503);
      return { error: "Admin login not configured" };
    }

    if (email !== expectedEmail || password !== expectedPassword) {
      res.status(401);
      return { error: "Invalid email or password" };
    }

    const token = this.adminAuthService.getAdminToken();
    if (!token) {
      res.status(500);
      return { error: "Admin token not available" };
    }

    res.cookie(this.adminAuthService.getCookieName(), token, this.adminAuthService.getCookieOptions());
    return { ok: true };
  }

  @Post("logout")
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie(this.adminAuthService.getCookieName(), { path: "/" });
    return { ok: true };
  }
}
