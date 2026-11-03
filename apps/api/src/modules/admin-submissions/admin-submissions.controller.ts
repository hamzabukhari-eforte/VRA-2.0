import { Body, Controller, Get, Patch, Req, Res } from "@nestjs/common";
import type { Request, Response } from "express";
import { prisma, MembershipSubmissionStatus } from "@vra/db";
import { AdminAuthService } from "../../common/admin-auth/admin-auth.service";
import { MembershipService } from "../../common/membership/membership.service";

const TABLES = {
  contact: prisma.contactSubmission,
  membership: prisma.membershipSubmission,
  termination: prisma.membershipTerminationSubmission,
  donation: prisma.donationSubmission,
  "net-booking": prisma.indoorNetBookingSubmission,
} as const;

type SubmissionType = keyof typeof TABLES;

/** Ported from apps/web/app/api/admin/submissions/route.ts */
@Controller("admin/submissions")
export class AdminSubmissionsController {
  constructor(
    private readonly adminAuthService: AdminAuthService,
    private readonly membershipService: MembershipService,
  ) {}

  @Get()
  async list(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const authed = this.adminAuthService.isAdminAuthenticated(req);
    if (!authed) {
      res.status(401);
      return { error: "Unauthorized" };
    }

    const type = (req.query.type as SubmissionType | undefined) ?? undefined;
    const page = Math.max(1, parseInt((req.query.page as string) ?? "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt((req.query.limit as string) ?? "20", 10)));
    const from = req.query.from as string | undefined; // date filter YYYY-MM-DD
    const to = req.query.to as string | undefined;

    if (!type || !TABLES[type]) {
      res.status(400);
      return { error: "Invalid type. Use: contact, membership, termination, donation, net-booking" };
    }

    const table = TABLES[type];
    const skip = (page - 1) * limit;

    const where: { createdAt?: { gte?: Date; lte?: Date } } = {};
    if (from) where.createdAt = { ...where.createdAt, gte: new Date(from) };
    if (to) where.createdAt = { ...where.createdAt, lte: new Date(to) };

    const [items, total] = await Promise.all([
      (table as unknown as { findMany: (args: unknown) => Promise<unknown[]> }).findMany({
        where: Object.keys(where).length ? where : undefined,
        orderBy: { createdAt: "desc" as const },
        skip,
        take: limit,
      }),
      (table as unknown as { count: (args: unknown) => Promise<number> }).count({
        where: Object.keys(where).length ? where : undefined,
      }),
    ]);

    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  @Patch()
  async patch(@Req() req: Request, @Body() body: any, @Res({ passthrough: true }) res: Response) {
    const authed = this.adminAuthService.isAdminAuthenticated(req);
    if (!authed) {
      res.status(401);
      return { error: "Unauthorized" };
    }

    try {
      const type = body?.type as SubmissionType | undefined;
      const submissionId = typeof body?.submissionId === "string" ? body.submissionId : "";
      const status = typeof body?.status === "string" ? body.status.toUpperCase() : "";

      if (type !== "membership") {
        res.status(400);
        return { error: "Only membership submissions are editable." };
      }

      if (!submissionId) {
        res.status(400);
        return { error: "Submission id is required." };
      }

      if (status === MembershipSubmissionStatus.PAID) {
        const result = await this.membershipService.provisionMemberFromSubmission(submissionId);
        return { ok: true, item: result.submission };
      }

      if (status === MembershipSubmissionStatus.SUBMITTED) {
        const item = await prisma.membershipSubmission.update({
          where: { id: submissionId },
          data: { status: MembershipSubmissionStatus.SUBMITTED, paidAt: null },
        });
        return { ok: true, item };
      }

      res.status(400);
      return { error: "Invalid membership status." };
    } catch (error) {
      console.error(error);
      res.status(500);
      return { error: "Failed to update membership submission." };
    }
  }
}
