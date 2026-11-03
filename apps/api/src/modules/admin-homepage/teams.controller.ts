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

/** Ported from apps/web/app/api/admin/homepage/teams/route.ts and teams/[id]/route.ts */
@Controller("admin/homepage/teams")
export class AdminHomepageTeamsController {
  constructor(private readonly storageService: StorageService) {}

  @Get()
  async list() {
    const items = await prisma.team.findMany({ orderBy: { order: "asc" } });
    return Promise.all(
      items.map(async (item) => ({
        id: item.id,
        name: item.name,
        order: item.order,
        imageUrl: item.imagePath ? await this.storageService.getPresignedUrl(item.imagePath) : null,
      })),
    );
  }

  @Post()
  @UseInterceptors(FileInterceptor("file", MEMORY_MULTER_OPTIONS))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body("name") nameRaw: string | undefined,
    @Body("order") orderStr: string | undefined,
    @Res({ passthrough: true }) res: Response,
  ) {
    const name = nameRaw?.trim();
    if (!name) {
      res.status(400);
      return { error: "Name required" };
    }

    let imagePath: string | null = null;
    if (file && file.size > 0) {
      const ext = file.originalname?.split(".").pop() || "jpg";
      const path = `homepage/teams/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const uploaded = await this.storageService.uploadToStorage(path, file.buffer, file.mimetype);
      if (uploaded) imagePath = uploaded;
    }
    const order = orderStr != null ? parseInt(orderStr, 10) : 0;
    return prisma.team.create({ data: { name, imagePath, order: isNaN(order) ? 0 : order } });
  }

  @Put(":id")
  @UseInterceptors(FileInterceptor("file", MEMORY_MULTER_OPTIONS))
  async update(
    @Param("id") id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body("name") nameRaw: string | undefined,
    @Body("order") orderStr: string | undefined,
    @Res({ passthrough: true }) res: Response,
  ) {
    const name = nameRaw?.trim();
    const existing = await prisma.team.findUnique({ where: { id } });
    if (!existing) {
      res.status(404);
      return { error: "Not found" };
    }

    const data: { name?: string; order?: number; imagePath?: string | null } = {};
    if (name !== undefined) data.name = name;
    if (orderStr != null) {
      const order = parseInt(orderStr, 10);
      if (!isNaN(order)) data.order = order;
    }
    if (file && file.size > 0) {
      if (existing.imagePath) await this.storageService.deleteFromStorage(existing.imagePath);
      const ext = file.originalname?.split(".").pop() || "jpg";
      const path = `homepage/teams/${id}.${ext}`;
      const uploaded = await this.storageService.uploadToStorage(path, file.buffer, file.mimetype);
      if (uploaded) data.imagePath = uploaded;
    }

    await prisma.team.update({ where: { id }, data });
    return { ok: true };
  }

  @Delete(":id")
  async remove(@Param("id") id: string, @Res({ passthrough: true }) res: Response) {
    const item = await prisma.team.findUnique({ where: { id } });
    if (!item) {
      res.status(404);
      return { error: "Not found" };
    }
    if (item.imagePath) await this.storageService.deleteFromStorage(item.imagePath);
    await prisma.team.delete({ where: { id } });
    return { ok: true };
  }
}
