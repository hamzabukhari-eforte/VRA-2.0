import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getPresignedUrl, uploadToStorage } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  const items = await prisma.sponsor.findMany({
    orderBy: { order: "asc" },
  });
  const withUrls = await Promise.all(
    items.map(async (item) => ({
      id: item.id,
      name: item.name,
      websiteUrl: item.websiteUrl,
      order: item.order,
      logoUrl: item.logoPath ? await getPresignedUrl(item.logoPath) : null,
    }))
  );
  return NextResponse.json(withUrls);
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const name = (formData.get("name") as string)?.trim();
  const websiteUrl = (formData.get("websiteUrl") as string)?.trim() || null;
  const orderStr = formData.get("order") as string | null;
  const file = formData.get("file") as File | null;
  if (!name) {
    return NextResponse.json({ error: "Name required" }, { status: 400 });
  }
  let logoPath: string | null = null;
  if (file && file.size > 0) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = file.name.split(".").pop() || "png";
    const path = `homepage/sponsors/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const uploaded = await uploadToStorage(path, buffer, file.type);
    if (uploaded) logoPath = uploaded;
  }
  const order = orderStr != null ? parseInt(orderStr, 10) : 0;
  const created = await prisma.sponsor.create({
    data: { name, websiteUrl, logoPath, order: isNaN(order) ? 0 : order },
  });
  return NextResponse.json(created);
}
