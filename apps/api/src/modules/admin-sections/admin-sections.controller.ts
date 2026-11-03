import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Put,
  Res,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import type { Response } from "express";
import { prisma, Prisma } from "@vra/db";
import { StorageService } from "../../common/storage/storage.service";
import { normalizeSectionTags } from "../../common/shared-section-payload.util";
import { MEMORY_MULTER_OPTIONS } from "../../common/upload/multer.config";

const noStore = { "Cache-Control": "no-store, must-revalidate" };

/** Ported from apps/web/app/api/admin/sections/route.ts and admin/sections/[slug]/route.ts */
@Controller("admin/sections")
export class AdminSectionsController {
  constructor(private readonly storageService: StorageService) {}

  @Get()
  async list(@Res({ passthrough: true }) res: Response) {
    try {
      const sections = await prisma.sharedSection.findMany();
      const rows = await Promise.all(
        sections.map(async (section) => {
          const slug = section.slug?.trim() ?? "";
          const imageUrl = section.imagePath
            ? await this.storageService.getPresignedUrl(section.imagePath)
            : null;
          return {
            slug,
            imageUrl,
            sectionTitle: section.sectionTitle,
            mainHeading: section.mainHeading,
            description: section.description,
            tags: normalizeSectionTags(section.tags),
          };
        }),
      );
      res.set({ ...noStore, "X-Section-Count": String(rows.length) });
      return { sections: rows };
    } catch (e) {
      console.error("[GET /api/admin/sections]", e);
      res.status(500).set(noStore);
      return { error: "Failed to load sections" };
    }
  }

  @Get(":slug")
  async getOne(@Param("slug") slug: string, @Res({ passthrough: true }) res: Response) {
    if (!slug) {
      res.status(400).set(noStore);
      return { error: "Missing slug" };
    }
    try {
      const section = await prisma.sharedSection.findUnique({ where: { slug } });
      res.set(noStore);
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
    } catch (e) {
      console.error(`[GET /api/admin/sections/${slug}]`, e);
      res.status(500).set(noStore);
      return { error: "Failed to load section" };
    }
  }

  @Patch(":slug")
  async patch(@Param("slug") slug: string, @Body() body: unknown, @Res({ passthrough: true }) res: Response) {
    if (!slug) {
      res.status(400);
      return { error: "Missing slug" };
    }

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      res.status(400);
      return { error: "Invalid body" };
    }

    const b = body as Record<string, unknown>;
    const patch: {
      sectionTitle?: string | null;
      mainHeading?: string | null;
      description?: string | null;
      tags?: string[] | null;
    } = {};

    if ("sectionTitle" in b) {
      const v = b.sectionTitle;
      if (v !== null && typeof v !== "string") {
        res.status(400);
        return { error: "sectionTitle must be string or null" };
      }
      patch.sectionTitle = v as string | null;
    }

    if ("mainHeading" in b) {
      const v = b.mainHeading;
      if (v !== null && typeof v !== "string") {
        res.status(400);
        return { error: "mainHeading must be string or null" };
      }
      patch.mainHeading = v as string | null;
    }

    if ("description" in b) {
      const v = b.description;
      if (v !== null && typeof v !== "string") {
        res.status(400);
        return { error: "description must be string or null" };
      }
      patch.description = v as string | null;
    }

    if ("tags" in b) {
      const v = b.tags;
      if (v !== null && !Array.isArray(v)) {
        res.status(400);
        return { error: "tags must be string array or null" };
      }
      if (v !== null && !(v as unknown[]).every((item) => typeof item === "string")) {
        res.status(400);
        return { error: "tags must contain only strings" };
      }
      patch.tags = v as string[] | null;
    }

    if (Object.keys(patch).length === 0) {
      res.status(400);
      return { error: "No fields to update" };
    }

    const updateInput: Prisma.SharedSectionUpdateInput = {};
    if (patch.sectionTitle !== undefined) updateInput.sectionTitle = patch.sectionTitle;
    if (patch.mainHeading !== undefined) updateInput.mainHeading = patch.mainHeading;
    if (patch.description !== undefined) updateInput.description = patch.description;
    if (patch.tags !== undefined) updateInput.tags = patch.tags === null ? Prisma.DbNull : patch.tags;

    await prisma.sharedSection.upsert({
      where: { slug },
      create: {
        slug,
        imagePath: null,
        sectionTitle: patch.sectionTitle !== undefined ? patch.sectionTitle : null,
        mainHeading: patch.mainHeading !== undefined ? patch.mainHeading : null,
        description: patch.description !== undefined ? patch.description : null,
        tags: patch.tags !== undefined ? (patch.tags === null ? Prisma.DbNull : patch.tags) : Prisma.DbNull,
      },
      update: updateInput,
    });

    return { ok: true };
  }

  @Put(":slug")
  @UseInterceptors(FileInterceptor("file", MEMORY_MULTER_OPTIONS))
  async put(
    @Param("slug") slug: string,
    @UploadedFile() file: Express.Multer.File,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (!file) {
      res.status(400);
      return { error: "No file" };
    }

    const ext = file.originalname?.split(".").pop() || "jpg";
    const path = `sections/${slug}.${ext}`;

    const uploaded = await this.storageService.uploadToStorage(path, file.buffer, file.mimetype);
    if (!uploaded) {
      res.status(500);
      return { error: "Upload failed" };
    }

    await prisma.sharedSection.upsert({
      where: { slug },
      create: { slug, imagePath: uploaded },
      update: { imagePath: uploaded },
    });

    return { ok: true };
  }

  @Delete(":slug")
  async remove(@Param("slug") slug: string) {
    const section = await prisma.sharedSection.findUnique({ where: { slug } });
    if (!section) {
      // Nothing to delete; frontend will fallback to static image
      return { ok: true };
    }

    if (section.imagePath) {
      await this.storageService.deleteFromStorage(section.imagePath);
    }

    await prisma.sharedSection.update({ where: { slug }, data: { imagePath: null } });
    return { ok: true };
  }
}
