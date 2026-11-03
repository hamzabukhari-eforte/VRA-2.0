import { Body, Controller, Get, Put, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { prisma } from "@vra/db";
import { StorageService } from "../../common/storage/storage.service";
import { MEMORY_MULTER_OPTIONS } from "../../common/upload/multer.config";

/** Ported from apps/web/app/api/admin/homepage/crowd/route.ts */
@Controller("admin/homepage/crowd")
export class AdminHomepageCrowdController {
  constructor(private readonly storageService: StorageService) {}

  @Get()
  async get() {
    const row = await prisma.crowdSection.findFirst({ orderBy: { updatedAt: "desc" } });
    if (!row) {
      return { id: null, title: null, description: null, imageUrl: null };
    }
    const imageUrl = row.imagePath ? await this.storageService.getPresignedUrl(row.imagePath) : null;
    return { id: row.id, title: row.title, description: row.description, imageUrl };
  }

  @Put()
  @UseInterceptors(FileInterceptor("file", MEMORY_MULTER_OPTIONS))
  async put(
    @UploadedFile() file: Express.Multer.File,
    @Body("title") title: string | undefined,
    @Body("description") description: string | undefined,
  ) {
    let imagePath: string | undefined;
    if (file && file.size > 0) {
      const ext = file.originalname?.split(".").pop() || "jpg";
      const path = `homepage/crowd/crowd.${ext}`;
      const uploaded = await this.storageService.uploadToStorage(path, file.buffer, file.mimetype);
      if (uploaded) imagePath = uploaded;
    }

    const row = await prisma.crowdSection.findFirst({ orderBy: { updatedAt: "desc" } });

    const data: { title?: string; description?: string; imagePath?: string } = {};
    if (title !== undefined) data.title = title;
    if (description !== undefined) data.description = description;
    if (imagePath !== undefined) data.imagePath = imagePath;

    if (row) {
      await prisma.crowdSection.update({ where: { id: row.id }, data });
    } else {
      await prisma.crowdSection.create({
        data: {
          ...data,
          title: data.title ?? null,
          description: data.description ?? null,
          imagePath: data.imagePath ?? null,
        },
      });
    }
    return { ok: true };
  }
}
