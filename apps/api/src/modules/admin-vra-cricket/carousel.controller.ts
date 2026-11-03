import { Body, Controller, Delete, Get, Param, Patch, Post, Res, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import type { Response } from "express";
import { prisma } from "@vra/db";
import { StorageService } from "../../common/storage/storage.service";
import { MEMORY_MULTER_OPTIONS } from "../../common/upload/multer.config";

/** Ported from apps/web/app/api/admin/vra-cricket/carousel/route.ts and carousel/[id]/route.ts */
@Controller("admin/vra-cricket/carousel")
export class AdminVraCricketCarouselController {
  constructor(private readonly storageService: StorageService) {}

  @Get()
  async list() {
    const items = await prisma.facilityCarouselImage.findMany({ orderBy: { order: "asc" } });
    return Promise.all(
      items.map(async (item) => ({
        id: item.id,
        order: item.order,
        imageUrl: await this.storageService.getPresignedUrl(item.storagePath),
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
    const path = `vra-cricket/carousel/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const uploaded = await this.storageService.uploadToStorage(path, file.buffer, file.mimetype);
    if (!uploaded) {
      res.status(500);
      return { error: "Upload failed" };
    }
    const order = orderStr != null ? parseInt(orderStr, 10) : 0;
    return prisma.facilityCarouselImage.create({ data: { storagePath: uploaded, order: isNaN(order) ? 0 : order } });
  }

  @Patch(":id")
  async patch(@Param("id") id: string, @Body() body: any, @Res({ passthrough: true }) res: Response) {
    const order = typeof body?.order === "number" ? body.order : undefined;
    if (order === undefined) {
      res.status(400);
      return { error: "order required" };
    }
    await prisma.facilityCarouselImage.update({ where: { id }, data: { order } });
    return { ok: true };
  }

  @Delete(":id")
  async remove(@Param("id") id: string, @Res({ passthrough: true }) res: Response) {
    const item = await prisma.facilityCarouselImage.findUnique({ where: { id } });
    if (!item) {
      res.status(404);
      return { error: "Not found" };
    }
    await this.storageService.deleteFromStorage(item.storagePath);
    await prisma.facilityCarouselImage.delete({ where: { id } });
    return { ok: true };
  }
}
