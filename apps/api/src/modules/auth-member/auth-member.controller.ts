import { Body, Controller, Get, Post, Req, Res } from "@nestjs/common";
import type { Request, Response } from "express";
import { prisma } from "@vra/db";
import { MemberAuthService } from "../../common/member-auth/member-auth.service";

/**
 * Ported from apps/web/app/api/auth/member/{login,logout,me,password}/route.ts
 */
@Controller("auth/member")
export class AuthMemberController {
  constructor(private readonly memberAuthService: MemberAuthService) {}

  @Post("login")
  async login(@Body() body: any, @Res({ passthrough: true }) res: Response) {
    try {
      const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
      const password = typeof body?.password === "string" ? body.password : "";

      if (!email || !password) {
        res.status(400);
        return { error: "Email and password are required." };
      }

      const member = await prisma.memberAccount.findUnique({ where: { email } });
      if (!member || !this.memberAuthService.verifyPassword(password, member.passwordHash)) {
        res.status(401);
        return { error: "Invalid email or password." };
      }

      const sessionToken = await this.memberAuthService.createMemberSession(member.id);
      await prisma.memberAccount.update({ where: { id: member.id }, data: { lastLoginAt: new Date() } });

      res.cookie(
        this.memberAuthService.getMemberCookieName(),
        sessionToken,
        this.memberAuthService.getMemberCookieOptions(),
      );

      return { ok: true };
    } catch (error) {
      console.error(error);
      res.status(500);
      return { error: "Failed to sign in." };
    }
  }

  @Post("logout")
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    await this.memberAuthService.clearMemberSession(req);
    res.clearCookie(this.memberAuthService.getMemberCookieName(), { path: "/" });
    return { ok: true };
  }

  @Get("me")
  async me(@Req() req: Request) {
    const member = await this.memberAuthService.getAuthenticatedMember(req);
    if (!member) {
      return { user: null };
    }
    return { user: { id: member.id, name: member.name, email: member.email } };
  }

  @Post("password")
  async password(@Req() req: Request, @Body() body: any, @Res({ passthrough: true }) res: Response) {
    const member = await this.memberAuthService.getAuthenticatedMember(req);
    if (!member) {
      res.status(401);
      return { error: "Unauthorized" };
    }

    const currentPassword = typeof body?.currentPassword === "string" ? body.currentPassword : "";
    const newPassword = typeof body?.newPassword === "string" ? body.newPassword : "";

    if (!currentPassword) {
      res.status(400);
      return { error: "Current password is required." };
    }
    if (newPassword.length < 8) {
      res.status(400);
      return { error: "New password must be at least 8 characters." };
    }
    if (newPassword.length > 128) {
      res.status(400);
      return { error: "New password is too long." };
    }

    if (currentPassword === newPassword) {
      res.status(400);
      return { error: "New password must be different from the current password." };
    }

    const account = await prisma.memberAccount.findUnique({ where: { id: member.id } });
    if (!account) {
      res.status(404);
      return { error: "Member account not found." };
    }

    if (!this.memberAuthService.verifyPassword(currentPassword, account.passwordHash)) {
      res.status(400);
      return { error: "Current password is incorrect." };
    }

    await prisma.memberAccount.update({
      where: { id: account.id },
      data: { passwordHash: this.memberAuthService.hashPassword(newPassword) },
    });

    return { ok: true };
  }
}
