import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getPresignedUrl } from "@/lib/supabase";
import { normalizeSectionTags } from "@/lib/shared-section-payload";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const noStore = {
  "Cache-Control": "no-store, must-revalidate",
} as const;

/**
 * All SharedSection rows in one response (slug → payload).
 * Avoids many parallel GETs from the admin UI (connection limits / Strict Mode).
 */
export async function GET() {
  try {
    const sections = await prisma.sharedSection.findMany();
    const rows = await Promise.all(
      sections.map(async (section) => {
        const slug = section.slug?.trim() ?? "";
        const imageUrl = section.imagePath
          ? await getPresignedUrl(section.imagePath)
          : null;
        return {
          slug,
          imageUrl,
          sectionTitle: section.sectionTitle,
          mainHeading: section.mainHeading,
          description: section.description,
          tags: normalizeSectionTags(section.tags),
        };
      })
    );
    return NextResponse.json(
      { sections: rows },
      {
        headers: {
          ...noStore,
          "X-Section-Count": String(rows.length),
        },
      }
    );
  } catch (e) {
    console.error("[GET /api/admin/sections]", e);
    return NextResponse.json(
      { error: "Failed to load sections" },
      { status: 500, headers: noStore }
    );
  }
}
