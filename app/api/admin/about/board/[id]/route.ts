import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { deleteFromStorage, uploadToStorage } from "@/lib/supabase";

export const dynamic = "force-dynamic";

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

  const existing = await prisma.boardMember.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (existing.imagePath) {
    await deleteFromStorage(existing.imagePath);
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = file.name.split(".").pop() || "jpg";
  const path = `about/board/${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}.${ext}`;
  const uploaded = await uploadToStorage(path, buffer, file.type);
  if (!uploaded) {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }

  await prisma.boardMember.update({
    where: { id },
    data: { imagePath: uploaded },
  });

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
  await prisma.boardMember.update({
    where: { id },
    data: { order },
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id;
  const item = await prisma.boardMember.findUnique({ where: { id } });
  if (!item) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (item.imagePath) await deleteFromStorage(item.imagePath);
  await prisma.boardMember.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
