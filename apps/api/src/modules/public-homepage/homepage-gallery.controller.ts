import { Controller, Get } from "@nestjs/common";
import { prisma } from "@vra/db";
import { StorageService } from "../../common/storage/storage.service";

/** Ported from apps/web/app/api/homepage/gallery/route.ts */
@Controller("homepage/gallery")
export class HomepageGalleryController {
  constructor(private readonly storageService: StorageService) {}

  @Get()
  async get() {
    try {
      const items = await prisma.homepageGalleryImage.findMany({ orderBy: { order: "asc" } });

      const slots: (string | null)[] = Array(6).fill(null);

      for (const item of items) {
        if (!item.storagePath) continue;
        const idx = item.order ?? 0;
        if (idx < 0 || idx >= slots.length) continue;
        const url = await this.storageService.getPresignedUrl(item.storagePath);
        if (url) {
          slots[idx] = url;
        }
      }

      return { images: slots };
    } catch (e) {
      console.error("GET /api/homepage/gallery:", e);
      return { images: [null, null, null, null, null, null] };
    }
  }
}
