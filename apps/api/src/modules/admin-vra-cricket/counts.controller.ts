import { Body, Controller, Get, Put } from "@nestjs/common";
import { prisma } from "@vra/db";

/** Ported from apps/web/app/api/admin/vra-cricket/counts/route.ts */
@Controller("admin/vra-cricket/counts")
export class AdminVraCricketCountsController {
  @Get()
  async get() {
    let row = await prisma.teamCount.findFirst({ orderBy: { updatedAt: "desc" } });
    if (!row) {
      row = await prisma.teamCount.create({ data: { mens: 7, womens: 1, youth: 9, zalmisXi: 2 } });
    }
    return { id: row.id, mens: row.mens, womens: row.womens, youth: row.youth, zalmisXi: row.zalmisXi };
  }

  @Put()
  async put(@Body() body: any) {
    const mens = typeof body?.mens === "number" ? body.mens : undefined;
    const womens = typeof body?.womens === "number" ? body.womens : undefined;
    const youth = typeof body?.youth === "number" ? body.youth : undefined;
    const zalmisXi = typeof body?.zalmisXi === "number" ? body.zalmisXi : undefined;

    let row = await prisma.teamCount.findFirst({ orderBy: { updatedAt: "desc" } });
    if (!row) {
      row = await prisma.teamCount.create({
        data: { mens: mens ?? 7, womens: womens ?? 1, youth: youth ?? 9, zalmisXi: zalmisXi ?? 2 },
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
    return { ok: true };
  }
}
