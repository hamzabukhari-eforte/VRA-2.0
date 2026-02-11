import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const ids = Array.isArray(body.ids) ? (body.ids as string[]) : [];
    if (ids.length === 0) {
      return NextResponse.json({ ok: true });
    }
    await Promise.all(
      ids.map((id, index) =>
        prisma.boardMember.update({
          where: { id },
          data: { order: index },
        })
      )
    );
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("PUT /api/admin/about/board/reorder:", e);
    return NextResponse.json({ error: "Reorder failed" }, { status: 500 });
  }
}
