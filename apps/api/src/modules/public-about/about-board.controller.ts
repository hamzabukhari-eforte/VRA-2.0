import { Controller, Get } from "@nestjs/common";
import { prisma } from "@vra/db";
import { StorageService } from "../../common/storage/storage.service";

/** Ported from apps/web/app/api/about/board/route.ts */
@Controller("about/board")
export class AboutBoardController {
  constructor(private readonly storageService: StorageService) {}

  @Get()
  async get() {
    try {
      const items = await prisma.boardMember.findMany({ orderBy: { order: "asc" } });

      const slots: (string | null)[] = Array(6).fill(null);

      for (const item of items) {
        if (!item.imagePath) continue;
        const idx = item.order ?? 0;
        if (idx < 0 || idx >= slots.length) continue;
        if (slots[idx] != null) continue;
        const url = await this.storageService.getPresignedUrl(item.imagePath);
        if (url) {
          slots[idx] = url;
        }
      }

      return { images: slots };
    } catch (e) {
      console.error("GET /api/about/board:", e);
      return { images: [null, null, null, null, null, null] };
    }
  }
}
