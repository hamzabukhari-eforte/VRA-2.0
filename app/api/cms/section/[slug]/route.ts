import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getPresignedUrl } from "@/lib/supabase";
import { normalizeSectionTags } from "@/lib/shared-section-payload";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const slug = (await params).slug;
  if (!slug) return NextResponse.json({ error: "Missing slug" }, { status: 400 });

  const section = await prisma.sharedSection.findUnique({
    where: { slug },
  });

  if (!section) {
    return NextResponse.json({
      imageUrl: null,
      sectionTitle: null,
      mainHeading: null,
      description: null,
      tags: null,
    });
  }

  const imageUrl = section.imagePath
    ? await getPresignedUrl(section.imagePath)
    : null;

  return NextResponse.json({
    imageUrl,
    sectionTitle: section.sectionTitle,
    mainHeading: section.mainHeading,
    description: section.description,
    tags: normalizeSectionTags(section.tags),
  });
}
