import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getPresignedUrl, uploadToStorage } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const items = await prisma.boardMember.findMany({
      orderBy: { order: "asc" },
    });
    const withUrls = await Promise.all(
      items.map(async (item) => ({
        id: item.id,
        order: item.order,
        imageUrl: item.imagePath ? await getPresignedUrl(item.imagePath) : null,
      }))
    );
    return NextResponse.json(withUrls);
  } catch (e) {
    console.error("GET /api/admin/about/board:", e);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const orderStr = formData.get("order") as string | null;
  if (!file || file.size === 0) {
    return NextResponse.json({ error: "No file" }, { status: 400 });
  }
  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = file.name.split(".").pop() || "jpg";
  const path = `about/board/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const uploaded = await uploadToStorage(path, buffer, file.type);
  if (!uploaded) {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
  const order = orderStr != null ? parseInt(orderStr, 10) : 0;
  const created = await prisma.boardMember.create({
    data: { imagePath: uploaded, order: isNaN(order) ? 0 : order },
  });
  return NextResponse.json(created);
}

export async function PUT(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("file") as File[];
    const validFiles = files.filter((f) => f && typeof f === "object" && f.size > 0);
    if (validFiles.length === 0) {
      return NextResponse.json({ error: "No files" }, { status: 400 });
    }
    const maxOrder = await prisma.boardMember
      .aggregate({ _max: { order: true } })
      .then((r) => (r._max.order ?? -1) + 1);
    const created: { id: string; order: number }[] = [];
    for (let i = 0; i < validFiles.length; i++) {
      const file = validFiles[i]!;
      const buffer = Buffer.from(await file.arrayBuffer());
      const ext = file.name.split(".").pop() || "jpg";
      const path = `about/board/${Date.now()}-${i}-${Math.random().toString(36).slice(2)}.${ext}`;
      const uploaded = await uploadToStorage(path, buffer, file.type);
      if (!uploaded) continue;
      const row = await prisma.boardMember.create({
        data: { imagePath: uploaded, order: maxOrder + i },
      });
      created.push({ id: row.id, order: row.order });
    }
    return NextResponse.json(created);
  } catch (e) {
    console.error("PUT /api/admin/about/board (batch):", e);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
