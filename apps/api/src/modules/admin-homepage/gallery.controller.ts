import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Res,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import type { Response } from "express";
import { prisma } from "@vra/db";
import { StorageService } from "../../common/storage/storage.service";
import { MEMORY_MULTER_OPTIONS } from "../../common/upload/multer.config";

/** Ported from apps/web/app/api/admin/homepage/gallery/route.ts and gallery/[id]/route.ts */
@Controller("admin/homepage/gallery")
export class AdminHomepageGalleryController {
  constructor(private readonly storageService: StorageService) {}

  @Get()
  async list() {
    const items = await prisma.homepageGalleryImage.findMany({ orderBy: { order: "asc" } });
    return Promise.all(
      items.map(async (item) => ({
        id: item.id,
        order: item.order,
        imageUrl: item.storagePath ? await this.storageService.getPresignedUrl(item.storagePath) : null,
      })),
    );
  }

  @Post()
  @UseInterceptors(FileInterceptor("file", MEMORY_MULTER_OPTIONS))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body("order") orderStr: string | undefined,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (!file) {
      res.status(400);
      return { error: "No file" };
    }
    const ext = file.originalname?.split(".").pop() || "jpg";
    const path = `homepage/gallery/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const uploaded = await this.storageService.uploadToStorage(path, file.buffer, file.mimetype);
    if (!uploaded) {
      res.status(500);
      return { error: "Upload failed" };
    }
    const order = orderStr != null ? parseInt(orderStr, 10) : 0;
    return prisma.homepageGalleryImage.create({ data: { storagePath: uploaded, order: isNaN(order) ? 0 : order } });
  }

  @Delete(":id")
  async remove(@Param("id") id: string, @Res({ passthrough: true }) res: Response) {
    const item = await prisma.homepageGalleryImage.findUnique({ where: { id } });
    if (!item) {
      res.status(404);
      return { error: "Not found" };
    }
    await this.storageService.deleteFromStorage(item.storagePath);
    await prisma.homepageGalleryImage.delete({ where: { id } });
    return { ok: true };
  }

  @Patch(":id")
  async patch(@Param("id") id: string, @Body() body: any, @Res({ passthrough: true }) res: Response) {
    const order = typeof body?.order === "number" ? body.order : undefined;
    if (order === undefined) {
      res.status(400);
      return { error: "order required" };
    }
    await prisma.homepageGalleryImage.update({ where: { id }, data: { order } });
    return { ok: true };
  }

  @Put(":id")
  @UseInterceptors(FileInterceptor("file", MEMORY_MULTER_OPTIONS))
  async replace(
    @Param("id") id: string,
    @UploadedFile() file: Express.Multer.File,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (!file || file.size === 0) {
      res.status(400);
      return { error: "No file" };
    }

    const existing = await prisma.homepageGalleryImage.findUnique({ where: { id } });
    if (!existing) {
      res.status(404);
      return { error: "Not found" };
    }

    if (existing.storagePath) {
      await this.storageService.deleteFromStorage(existing.storagePath);
    }

    const ext = file.originalname?.split(".").pop() || "jpg";
    const path = `homepage/gallery/${id}.${ext}`;
    const uploaded = await this.storageService.uploadToStorage(path, file.buffer, file.mimetype);
    if (!uploaded) {
      res.status(500);
      return { error: "Upload failed" };
    }

    await prisma.homepageGalleryImage.update({ where: { id }, data: { storagePath: uploaded } });
    return { ok: true };
  }
}
