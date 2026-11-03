import { Body, Controller, Get, Patch, Req, Res } from "@nestjs/common";
import type { Request, Response } from "express";
import { prisma, Prisma } from "@vra/db";
import { MemberAuthService } from "../../common/member-auth/member-auth.service";
import {
  applyProfilePatch,
  buildMemberProfileSnapshot,
  getMemberProfileSnapshot,
  validateMemberProfilePatch,
} from "../../common/member-profile/member-profile.util";

function payloadRecord(payload: unknown): Record<string, unknown> {
  if (typeof payload !== "object" || payload === null || Array.isArray(payload)) return {};
  return payload as Record<string, unknown>;
}

/** Ported from apps/web/app/api/member/profile/route.ts */
@Controller("member/profile")
export class MemberProfileController {
  constructor(private readonly memberAuthService: MemberAuthService) {}

  @Get()
  async get(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const member = await this.memberAuthService.getAuthenticatedMember(req);
    if (!member) {
      res.status(401);
      return { error: "Unauthorized" };
    }

    const snapshot = await getMemberProfileSnapshot(member.id);
    if (!snapshot) {
      res.status(404);
      return { error: "Not found" };
    }

    return snapshot;
  }

  @Patch()
  async patch(@Req() req: Request, @Body() body: unknown, @Res({ passthrough: true }) res: Response) {
    const member = await this.memberAuthService.getAuthenticatedMember(req);
    if (!member) {
      res.status(401);
      return { error: "Unauthorized" };
    }

    const parsed = validateMemberProfilePatch(body);
    if (parsed.success === false) {
      res.status(400);
      return { error: "Validation failed", details: parsed.error.flatten() };
    }

    const account = await prisma.memberAccount.findUnique({
      where: { id: member.id },
      include: { membershipSubmission: true },
    });
    if (!account) {
      res.status(404);
      return { error: "Not found" };
    }

    const sub = account.membershipSubmission;
    const payload = payloadRecord(sub.payload);
    const membershipType =
      (typeof sub.membershipType === "string" && sub.membershipType) ||
      (typeof payload.membershipType === "string" ? payload.membershipType : "");
    const allowGuardian = membershipType === "junior";

    const nextOverrides = applyProfilePatch(account.profileOverrides, parsed.data, { allowGuardian });

    const updateData: Prisma.MemberAccountUpdateInput = {
      profileOverrides: nextOverrides as Prisma.InputJsonValue,
    };

    if (parsed.data.displayName !== undefined) {
      updateData.name = parsed.data.displayName.trim();
    }

    const updated = await prisma.memberAccount.update({
      where: { id: member.id },
      data: updateData,
      include: { membershipSubmission: true },
    });

    return buildMemberProfileSnapshot(updated);
  }
}
