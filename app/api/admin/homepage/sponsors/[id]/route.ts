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
  const name = (formData.get("name") as string)?.trim();
  const websiteUrl = (formData.get("websiteUrl") as string)?.trim();
  const orderStr = formData.get("order") as string | null;
  const file = formData.get("file") as File | null;

  const existing = await prisma.sponsor.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const data: { name?: string; websiteUrl?: string | null; order?: number; logoPath?: string | null } = {};
  if (name !== undefined) data.name = name;
  if (websiteUrl !== undefined) data.websiteUrl = websiteUrl || null;
  if (orderStr != null) {
    const order = parseInt(orderStr, 10);
    if (!isNaN(order)) data.order = order;
  }
  if (file && file.size > 0) {
    if (existing.logoPath) await deleteFromStorage(existing.logoPath);
    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = file.name.split(".").pop() || "png";
    const path = `homepage/sponsors/${id}.${ext}`;
    const uploaded = await uploadToStorage(path, buffer, file.type);
    if (uploaded) data.logoPath = uploaded;
  }

  await prisma.sponsor.update({
    where: { id },
    data,
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id;
  const item = await prisma.sponsor.findUnique({ where: { id } });
  if (!item) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (item.logoPath) await deleteFromStorage(item.logoPath);
  await prisma.sponsor.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
