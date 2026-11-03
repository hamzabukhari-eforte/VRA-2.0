import { Controller, Get, Param, Res } from "@nestjs/common";
import type { Response } from "express";
import { prisma } from "@vra/db";
import { StorageService } from "../../common/storage/storage.service";
import { normalizeSectionTags } from "../../common/shared-section-payload.util";

/** Ported from apps/web/app/api/cms/section/[slug]/route.ts */
@Controller("cms/section")
export class CmsSectionController {
  constructor(private readonly storageService: StorageService) {}

  @Get(":slug")
  async get(@Param("slug") slug: string, @Res({ passthrough: true }) res: Response) {
    if (!slug) {
      res.status(400);
      return { error: "Missing slug" };
    }

    const section = await prisma.sharedSection.findUnique({ where: { slug } });

    if (!section) {
      return { imageUrl: null, sectionTitle: null, mainHeading: null, description: null, tags: null };
    }

    const imageUrl = section.imagePath ? await this.storageService.getPresignedUrl(section.imagePath) : null;

    return {
      imageUrl,
      sectionTitle: section.sectionTitle,
      mainHeading: section.mainHeading,
      description: section.description,
      tags: normalizeSectionTags(section.tags),
    };
  }
}
