import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
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

/** Ported from apps/web/app/api/admin/homepage/sponsors/route.ts and sponsors/[id]/route.ts */
@Controller("admin/homepage/sponsors")
export class AdminHomepageSponsorsController {
  constructor(private readonly storageService: StorageService) {}

  @Get()
  async list() {
    const items = await prisma.sponsor.findMany({ orderBy: { order: "asc" } });
    return Promise.all(
      items.map(async (item) => ({
        id: item.id,
        name: item.name,
        websiteUrl: item.websiteUrl,
        order: item.order,
        logoUrl: item.logoPath ? await this.storageService.getPresignedUrl(item.logoPath) : null,
      })),
    );
  }

  @Post()
  @UseInterceptors(FileInterceptor("file", MEMORY_MULTER_OPTIONS))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body("name") nameRaw: string | undefined,
    @Body("websiteUrl") websiteUrlRaw: string | undefined,
    @Body("order") orderStr: string | undefined,
    @Res({ passthrough: true }) res: Response,
  ) {
    const name = nameRaw?.trim();
    const websiteUrl = websiteUrlRaw?.trim() || null;
    if (!name) {
      res.status(400);
      return { error: "Name required" };
    }
    let logoPath: string | null = null;
    if (file && file.size > 0) {
      const ext = file.originalname?.split(".").pop() || "png";
      const path = `homepage/sponsors/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const uploaded = await this.storageService.uploadToStorage(path, file.buffer, file.mimetype);
      if (uploaded) logoPath = uploaded;
    }
    const order = orderStr != null ? parseInt(orderStr, 10) : 0;
    return prisma.sponsor.create({ data: { name, websiteUrl, logoPath, order: isNaN(order) ? 0 : order } });
  }

  @Put(":id")
  @UseInterceptors(FileInterceptor("file", MEMORY_MULTER_OPTIONS))
  async update(
    @Param("id") id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body("name") nameRaw: string | undefined,
    @Body("websiteUrl") websiteUrlRaw: string | undefined,
    @Body("order") orderStr: string | undefined,
    @Res({ passthrough: true }) res: Response,
  ) {
    const name = nameRaw?.trim();
    const websiteUrl = websiteUrlRaw?.trim();
    const existing = await prisma.sponsor.findUnique({ where: { id } });
    if (!existing) {
      res.status(404);
      return { error: "Not found" };
    }

    const data: { name?: string; websiteUrl?: string | null; order?: number; logoPath?: string | null } = {};
    if (name !== undefined) data.name = name;
    if (websiteUrl !== undefined) data.websiteUrl = websiteUrl || null;
    if (orderStr != null) {
      const order = parseInt(orderStr, 10);
      if (!isNaN(order)) data.order = order;
    }
    if (file && file.size > 0) {
      if (existing.logoPath) await this.storageService.deleteFromStorage(existing.logoPath);
      const ext = file.originalname?.split(".").pop() || "png";
      const path = `homepage/sponsors/${id}.${ext}`;
      const uploaded = await this.storageService.uploadToStorage(path, file.buffer, file.mimetype);
      if (uploaded) data.logoPath = uploaded;
    }

    await prisma.sponsor.update({ where: { id }, data });
    return { ok: true };
  }

  @Delete(":id")
  async remove(@Param("id") id: string, @Res({ passthrough: true }) res: Response) {
    const item = await prisma.sponsor.findUnique({ where: { id } });
    if (!item) {
      res.status(404);
      return { error: "Not found" };
    }
    if (item.logoPath) await this.storageService.deleteFromStorage(item.logoPath);
    await prisma.sponsor.delete({ where: { id } });
    return { ok: true };
  }
}
