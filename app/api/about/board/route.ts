import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getPresignedUrl } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const items = await prisma.boardMember.findMany({
      orderBy: { order: "asc" },
    });

    const slots: (string | null)[] = Array(6).fill(null);

    for (const item of items) {
      if (!item.imagePath) continue;
      const idx = item.order ?? 0;
      if (idx < 0 || idx >= slots.length) continue;
      if (slots[idx] != null) continue;
      const url = await getPresignedUrl(item.imagePath);
      if (url) {
        slots[idx] = url;
      }
    }

    return NextResponse.json({ images: slots });
  } catch (e) {
    console.error("GET /api/about/board:", e);
    return NextResponse.json({ images: [null, null, null, null, null, null] });
  }
}

