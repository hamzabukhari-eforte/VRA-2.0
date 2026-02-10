import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { uploadToStorage, getPresignedUrl, deleteFromStorage } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const slug = (await params).slug;
  const section = await prisma.sharedSection.findUnique({
    where: { slug },
  });
  if (!section?.imagePath) {
    return NextResponse.json({ imageUrl: null });
  }
  const imageUrl = await getPresignedUrl(section.imagePath);
  return NextResponse.json({ imageUrl });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const slug = (await params).slug;
  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ error: "No file" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = file.name.split(".").pop() || "jpg";
  const path = `sections/${slug}.${ext}`;

  const uploaded = await uploadToStorage(path, buffer, file.type);
  if (!uploaded) {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }

  await prisma.sharedSection.upsert({
    where: { slug },
    create: { slug, imagePath: uploaded },
    update: { imagePath: uploaded },
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const slug = (await params).slug;
  const section = await prisma.sharedSection.findUnique({
    where: { slug },
  });

  if (!section) {
    // Nothing to delete; frontend will fallback to static image
    return NextResponse.json({ ok: true });
  }

  if (section.imagePath) {
    await deleteFromStorage(section.imagePath);
  }

  await prisma.sharedSection.update({
    where: { slug },
    data: { imagePath: null },
  });

  return NextResponse.json({ ok: true });
}
