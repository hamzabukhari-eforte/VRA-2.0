import { Body, Controller, Post, Res } from "@nestjs/common";
import type { Response } from "express";
import { prisma } from "@vra/db";
import { MembershipService } from "../../common/membership/membership.service";

/**
 * Ported from apps/web/app/api/submissions/{contact,donation,membership,net-booking,termination}/route.ts
 */
@Controller("submissions")
export class SubmissionsController {
  constructor(private readonly membershipService: MembershipService) {}

  @Post("contact")
  async contact(@Body() body: any, @Res({ passthrough: true }) res: Response) {
    try {
      await prisma.contactSubmission.create({ data: { payload: body } });
      return { ok: true };
    } catch (e) {
      console.error(e);
      res.status(500);
      return { error: "Failed to submit" };
    }
  }

  @Post("donation")
  async donation(@Body() body: any, @Res({ passthrough: true }) res: Response) {
    try {
      await prisma.donationSubmission.create({ data: { payload: body } });
      return { ok: true };
    } catch (e) {
      console.error(e);
      res.status(500);
      return { error: "Failed to submit" };
    }
  }

  @Post("membership")
  async membership(@Body() body: any, @Res({ passthrough: true }) res: Response) {
    try {
      const normalized = this.membershipService.normalizeMembershipSubmission(body);

      if (!normalized.applicantName || !normalized.applicantEmail) {
        res.status(400);
        return { error: "Applicant name and email are required." };
      }

      const submission = await prisma.membershipSubmission.create({
        data: { payload: body, ...normalized },
      });

      await this.membershipService.sendSubmissionEmails({
        applicantName: normalized.applicantName,
        applicantEmail: normalized.applicantEmail,
        applicantPhone: normalized.applicantPhone,
        membershipType: normalized.membershipType,
        createdAt: submission.createdAt,
      });

      return { ok: true };
    } catch (e) {
      console.error(e);
      res.status(500);
      return { error: "Failed to submit" };
    }
  }

  @Post("net-booking")
  async netBooking(@Body() body: any, @Res({ passthrough: true }) res: Response) {
    try {
      await prisma.indoorNetBookingSubmission.create({ data: { payload: body } });
      return { ok: true };
    } catch (e) {
      console.error(e);
      res.status(500);
      return { error: "Failed to submit" };
    }
  }

  @Post("termination")
  async termination(@Body() body: any, @Res({ passthrough: true }) res: Response) {
    try {
      await prisma.membershipTerminationSubmission.create({ data: { payload: body } });
      return { ok: true };
    } catch (e) {
      console.error(e);
      res.status(500);
      return { error: "Failed to submit" };
    }
  }
}
