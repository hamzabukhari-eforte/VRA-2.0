import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getPresignedUrl } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const items = await prisma.homepageGalleryImage.findMany({
      orderBy: { order: "asc" },
    });

    const slots: (string | null)[] = Array(6).fill(null);

    for (const item of items) {
      if (!item.storagePath) continue;
      const idx = item.order ?? 0;
      if (idx < 0 || idx >= slots.length) continue;
      const url = await getPresignedUrl(item.storagePath);
      if (url) {
        slots[idx] = url;
      }
    }

    return NextResponse.json({ images: slots });
  } catch (e) {
    console.error("GET /api/homepage/gallery:", e);
    return NextResponse.json({ images: [null, null, null, null, null, null] });
  }
}
