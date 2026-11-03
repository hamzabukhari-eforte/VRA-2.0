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
  UploadedFiles,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import type { Response } from "express";
import { prisma } from "@vra/db";
import { StorageService } from "../../common/storage/storage.service";
import { MEMORY_MULTER_OPTIONS } from "../../common/upload/multer.config";

/**
 * Ported from apps/web/app/api/admin/about/board/route.ts, board/[id]/route.ts and
 * board/reorder/route.ts.
 *
 * NOTE on route ordering: `reorder` (PUT /admin/about/board/reorder) is declared
 * BEFORE the dynamic `:id` PUT handler below. Nest/Express registers routes in
 * controller method declaration order, so the static "reorder" path is matched
 * first and never confused with `PUT /admin/about/board/:id` where id="reorder".
 */
@Controller("admin/about/board")
export class AdminAboutBoardController {
  constructor(private readonly storageService: StorageService) {}

  @Get()
  async list() {
    try {
      const items = await prisma.boardMember.findMany({ orderBy: { order: "asc" } });
      return await Promise.all(
        items.map(async (item) => ({
          id: item.id,
          order: item.order,
          imageUrl: item.imagePath ? await this.storageService.getPresignedUrl(item.imagePath) : null,
        })),
      );
    } catch (e) {
      console.error("GET /api/admin/about/board:", e);
      return [];
    }
  }

  @Post()
  @UseInterceptors(FileInterceptor("file", MEMORY_MULTER_OPTIONS))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body("order") orderStr: string | undefined,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (!file || file.size === 0) {
      res.status(400);
      return { error: "No file" };
    }
    const ext = file.originalname?.split(".").pop() || "jpg";
    const path = `about/board/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const uploaded = await this.storageService.uploadToStorage(path, file.buffer, file.mimetype);
    if (!uploaded) {
      res.status(500);
      return { error: "Upload failed" };
    }
    const order = orderStr != null ? parseInt(orderStr, 10) : 0;
    return prisma.boardMember.create({ data: { imagePath: uploaded, order: isNaN(order) ? 0 : order } });
  }

  /** Batch upload: PUT /admin/about/board with multiple "file" fields. */
  @Put()
  @UseInterceptors(FilesInterceptor("file", undefined, MEMORY_MULTER_OPTIONS))
  async batchUpload(@UploadedFiles() files: Express.Multer.File[], @Res({ passthrough: true }) res: Response) {
    try {
      const validFiles = (files ?? []).filter((f) => f && f.size > 0);
      if (validFiles.length === 0) {
        res.status(400);
        return { error: "No files" };
      }

      const maxOrder = await prisma.boardMember
        .aggregate({ _max: { order: true } })
        .then((r) => (r._max.order ?? -1) + 1);

      const created: { id: string; order: number }[] = [];
      for (let i = 0; i < validFiles.length; i++) {
        const file = validFiles[i]!;
        const ext = file.originalname?.split(".").pop() || "jpg";
        const path = `about/board/${Date.now()}-${i}-${Math.random().toString(36).slice(2)}.${ext}`;
        const uploaded = await this.storageService.uploadToStorage(path, file.buffer, file.mimetype);
        if (!uploaded) continue;
        const row = await prisma.boardMember.create({ data: { imagePath: uploaded, order: maxOrder + i } });
        created.push({ id: row.id, order: row.order });
      }
      return created;
    } catch (e) {
      console.error("PUT /api/admin/about/board (batch):", e);
      res.status(500);
      return { error: "Upload failed" };
    }
  }

  @Put("reorder")
  async reorder(@Body() body: any, @Res({ passthrough: true }) res: Response) {
    try {
      const ids = Array.isArray(body?.ids) ? (body.ids as string[]) : [];
      if (ids.length === 0) {
        return { ok: true };
      }
      await Promise.all(
        ids.map((id, index) => prisma.boardMember.update({ where: { id }, data: { order: index } })),
      );
      return { ok: true };
    } catch (e) {
      console.error("PUT /api/admin/about/board/reorder:", e);
      res.status(500);
      return { error: "Reorder failed" };
    }
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

    const existing = await prisma.boardMember.findUnique({ where: { id } });
    if (!existing) {
      res.status(404);
      return { error: "Not found" };
    }

    if (existing.imagePath) {
      await this.storageService.deleteFromStorage(existing.imagePath);
    }

    const ext = file.originalname?.split(".").pop() || "jpg";
    const path = `about/board/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const uploaded = await this.storageService.uploadToStorage(path, file.buffer, file.mimetype);
    if (!uploaded) {
      res.status(500);
      return { error: "Upload failed" };
    }

    await prisma.boardMember.update({ where: { id }, data: { imagePath: uploaded } });
    return { ok: true };
  }

  @Patch(":id")
  async patchOrder(@Param("id") id: string, @Body() body: any, @Res({ passthrough: true }) res: Response) {
    const order = typeof body?.order === "number" ? body.order : undefined;
    if (order === undefined) {
      res.status(400);
      return { error: "order required" };
    }
    await prisma.boardMember.update({ where: { id }, data: { order } });
    return { ok: true };
  }

  @Delete(":id")
  async remove(@Param("id") id: string, @Res({ passthrough: true }) res: Response) {
    const item = await prisma.boardMember.findUnique({ where: { id } });
    if (!item) {
      res.status(404);
      return { error: "Not found" };
    }
    if (item.imagePath) await this.storageService.deleteFromStorage(item.imagePath);
    await prisma.boardMember.delete({ where: { id } });
    return { ok: true };
  }
}
