import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getPresignedUrl, uploadToStorage } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  const items = await prisma.team.findMany({
    orderBy: { order: "asc" },
  });
  const withUrls = await Promise.all(
    items.map(async (item) => ({
      id: item.id,
      name: item.name,
      order: item.order,
      imageUrl: item.imagePath ? await getPresignedUrl(item.imagePath) : null,
    }))
  );
  return NextResponse.json(withUrls);
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const name = (formData.get("name") as string)?.trim();
  const orderStr = formData.get("order") as string | null;
  const file = formData.get("file") as File | null;
  if (!name) {
    return NextResponse.json({ error: "Name required" }, { status: 400 });
  }
  let imagePath: string | null = null;
  if (file && file.size > 0) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = file.name.split(".").pop() || "jpg";
    const path = `homepage/teams/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const uploaded = await uploadToStorage(path, buffer, file.type);
    if (uploaded) imagePath = uploaded;
  }
  const order = orderStr != null ? parseInt(orderStr, 10) : 0;
  const created = await prisma.team.create({
    data: { name, imagePath, order: isNaN(order) ? 0 : order },
  });
  return NextResponse.json(created);
}
