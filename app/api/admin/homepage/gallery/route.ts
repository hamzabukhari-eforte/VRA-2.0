import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getPresignedUrl, uploadToStorage } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  const items = await prisma.homepageGalleryImage.findMany({
    orderBy: { order: "asc" },
  });
  const withUrls = await Promise.all(
    items.map(async (item) => ({
      id: item.id,
      order: item.order,
      imageUrl: item.storagePath ? await getPresignedUrl(item.storagePath) : null,
    }))
  );
  return NextResponse.json(withUrls);
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const orderStr = formData.get("order") as string | null;
  if (!file) {
    return NextResponse.json({ error: "No file" }, { status: 400 });
  }
  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = file.name.split(".").pop() || "jpg";
  const path = `homepage/gallery/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const uploaded = await uploadToStorage(path, buffer, file.type);
  if (!uploaded) {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
  const order = orderStr != null ? parseInt(orderStr, 10) : 0;
  const created = await prisma.homepageGalleryImage.create({
    data: { storagePath: uploaded, order: isNaN(order) ? 0 : order },
  });
  return NextResponse.json(created);
}
