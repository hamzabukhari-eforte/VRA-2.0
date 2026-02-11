import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  let row = await prisma.teamCount.findFirst({
    orderBy: { updatedAt: "desc" },
  });
  if (!row) {
    row = await prisma.teamCount.create({
      data: { mens: 7, womens: 1, youth: 9, zalmisXi: 2 },
    });
  }
  return NextResponse.json({
    id: row.id,
    mens: row.mens,
    womens: row.womens,
    youth: row.youth,
    zalmisXi: row.zalmisXi,
  });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const mens = typeof body.mens === "number" ? body.mens : undefined;
  const womens = typeof body.womens === "number" ? body.womens : undefined;
  const youth = typeof body.youth === "number" ? body.youth : undefined;
  const zalmisXi = typeof body.zalmisXi === "number" ? body.zalmisXi : undefined;

  let row = await prisma.teamCount.findFirst({
    orderBy: { updatedAt: "desc" },
  });
  if (!row) {
    row = await prisma.teamCount.create({
      data: {
        mens: mens ?? 7,
        womens: womens ?? 1,
        youth: youth ?? 9,
        zalmisXi: zalmisXi ?? 2,
      },
    });
  } else {
    await prisma.teamCount.update({
      where: { id: row.id },
      data: {
        ...(mens !== undefined && { mens }),
        ...(womens !== undefined && { womens }),
        ...(youth !== undefined && { youth }),
        ...(zalmisXi !== undefined && { zalmisXi }),
      },
    });
  }
  return NextResponse.json({ ok: true });
}
