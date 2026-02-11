import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { deleteFromStorage } from "@/lib/supabase";

export const dynamic = "force-dynamic";

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
  await prisma.facilityCarouselImage.update({
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
  const item = await prisma.facilityCarouselImage.findUnique({ where: { id } });
  if (!item) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  await deleteFromStorage(item.storagePath);
  await prisma.facilityCarouselImage.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
