import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getPresignedUrl, uploadToStorage } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  const row = await prisma.crowdSection.findFirst({
    orderBy: { updatedAt: "desc" },
  });
  if (!row) {
    return NextResponse.json({
      id: null,
      title: null,
      description: null,
      imageUrl: null,
    });
  }
  const imageUrl = row.imagePath ? await getPresignedUrl(row.imagePath) : null;
  return NextResponse.json({
    id: row.id,
    title: row.title,
    description: row.description,
    imageUrl,
  });
}

export async function PUT(request: Request) {
  const formData = await request.formData();
  const title = (formData.get("title") as string) ?? undefined;
  const description = (formData.get("description") as string) ?? undefined;
  const file = formData.get("file") as File | null;

  let imagePath: string | undefined;
  if (file && file.size > 0) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = file.name.split(".").pop() || "jpg";
    const path = `homepage/crowd/crowd.${ext}`;
    const uploaded = await uploadToStorage(path, buffer, file.type);
    if (uploaded) imagePath = uploaded;
  }

  const row = await prisma.crowdSection.findFirst({
    orderBy: { updatedAt: "desc" },
  });

  const data: { title?: string; description?: string; imagePath?: string } = {};
  if (title !== undefined) data.title = title;
  if (description !== undefined) data.description = description;
  if (imagePath !== undefined) data.imagePath = imagePath;

  if (row) {
    await prisma.crowdSection.update({
      where: { id: row.id },
      data,
    });
  } else {
    await prisma.crowdSection.create({
      data: { ...data, title: data.title ?? null, description: data.description ?? null, imagePath: data.imagePath ?? null },
    });
  }
  return NextResponse.json({ ok: true });
}
