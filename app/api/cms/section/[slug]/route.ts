import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getPresignedUrl } from "@/lib/supabase";

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

  if (!section?.imagePath) {
    return NextResponse.json({ imageUrl: null });
  }

  const imageUrl = await getPresignedUrl(section.imagePath);
  return NextResponse.json({ imageUrl });
}
