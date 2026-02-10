import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { deleteFromStorage, uploadToStorage } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id;
  const item = await prisma.homepageGalleryImage.findUnique({ where: { id } });
  if (!item) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  await deleteFromStorage(item.storagePath);
  await prisma.homepageGalleryImage.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id;
  const body = await request.json();
  const order = typeof body.order === "number" ? body.order : undefined;
  if (order === undefined) {
    return NextResponse.json({ error: "order required" }, { status: 400 });
  }
  await prisma.homepageGalleryImage.update({
    where: { id },
    data: { order },
  });
  return NextResponse.json({ ok: true });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id;
  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) {
    return NextResponse.json({ error: "No file" }, { status: 400 });
  }

  const existing = await prisma.homepageGalleryImage.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (existing.storagePath) {
    await deleteFromStorage(existing.storagePath);
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = file.name.split(".").pop() || "jpg";
  const path = `homepage/gallery/${id}.${ext}`;
  const uploaded = await uploadToStorage(path, buffer, file.type);
  if (!uploaded) {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }

  await prisma.homepageGalleryImage.update({
    where: { id },
    data: { storagePath: uploaded },
  });

  return NextResponse.json({ ok: true });
}

