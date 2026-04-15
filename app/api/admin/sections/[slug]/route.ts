import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { uploadToStorage, getPresignedUrl, deleteFromStorage } from "@/lib/supabase";
import { normalizeSectionTags } from "@/lib/shared-section-payload";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const noStore = {
  "Cache-Control": "no-store, must-revalidate",
} as const;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const slug = (await params).slug;
  if (!slug) {
    return NextResponse.json(
      { error: "Missing slug" },
      { status: 400, headers: noStore }
    );
  }
  try {
    const section = await prisma.sharedSection.findUnique({
      where: { slug },
    });
    if (!section) {
      return NextResponse.json(
        {
          imageUrl: null,
          sectionTitle: null,
          mainHeading: null,
          description: null,
          tags: null,
        },
        { headers: noStore }
      );
    }
    const imageUrl = section.imagePath
      ? await getPresignedUrl(section.imagePath)
      : null;
    return NextResponse.json(
      {
        imageUrl,
        sectionTitle: section.sectionTitle,
        mainHeading: section.mainHeading,
        description: section.description,
        tags: normalizeSectionTags(section.tags),
      },
      { headers: noStore }
    );
  } catch (e) {
    console.error(`[GET /api/admin/sections/${slug}]`, e);
    return NextResponse.json(
      { error: "Failed to load section" },
      { status: 500, headers: noStore }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const slug = (await params).slug;
  if (!slug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const b = body as Record<string, unknown>;
  const patch: {
    sectionTitle?: string | null;
    mainHeading?: string | null;
    description?: string | null;
    tags?: string[] | null;
  } = {};

  if ("sectionTitle" in b) {
    const v = b.sectionTitle;
    if (v !== null && typeof v !== "string") {
      return NextResponse.json(
        { error: "sectionTitle must be string or null" },
        { status: 400 }
      );
    }
    patch.sectionTitle = v;
  }

  if ("mainHeading" in b) {
    const v = b.mainHeading;
    if (v !== null && typeof v !== "string") {
      return NextResponse.json(
        { error: "mainHeading must be string or null" },
        { status: 400 }
      );
    }
    patch.mainHeading = v;
  }

  if ("description" in b) {
    const v = b.description;
    if (v !== null && typeof v !== "string") {
      return NextResponse.json(
        { error: "description must be string or null" },
        { status: 400 }
      );
    }
    patch.description = v;
  }

  if ("tags" in b) {
    const v = b.tags;
    if (v !== null && !Array.isArray(v)) {
      return NextResponse.json(
        { error: "tags must be string array or null" },
        { status: 400 }
      );
    }
    if (v !== null && !v.every((item) => typeof item === "string")) {
      return NextResponse.json(
        { error: "tags must contain only strings" },
        { status: 400 }
      );
    }
    patch.tags = v as string[] | null;
  }

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  const updateInput: Prisma.SharedSectionUpdateInput = {};
  if (patch.sectionTitle !== undefined) {
    updateInput.sectionTitle = patch.sectionTitle;
  }
  if (patch.mainHeading !== undefined) {
    updateInput.mainHeading = patch.mainHeading;
  }
  if (patch.description !== undefined) {
    updateInput.description = patch.description;
  }
  if (patch.tags !== undefined) {
    updateInput.tags =
      patch.tags === null ? Prisma.DbNull : patch.tags;
  }

  await prisma.sharedSection.upsert({
    where: { slug },
    create: {
      slug,
      imagePath: null,
      sectionTitle:
        patch.sectionTitle !== undefined ? patch.sectionTitle : null,
      mainHeading:
        patch.mainHeading !== undefined ? patch.mainHeading : null,
      description:
        patch.description !== undefined ? patch.description : null,
      tags:
        patch.tags !== undefined
          ? patch.tags === null
            ? Prisma.DbNull
            : patch.tags
          : Prisma.DbNull,
    },
    update: updateInput,
  });

  return NextResponse.json({ ok: true });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const slug = (await params).slug;
  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ error: "No file" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = file.name.split(".").pop() || "jpg";
  const path = `sections/${slug}.${ext}`;

  const uploaded = await uploadToStorage(path, buffer, file.type);
  if (!uploaded) {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }

  await prisma.sharedSection.upsert({
    where: { slug },
    create: { slug, imagePath: uploaded },
    update: { imagePath: uploaded },
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const slug = (await params).slug;
  const section = await prisma.sharedSection.findUnique({
    where: { slug },
  });

  if (!section) {
    // Nothing to delete; frontend will fallback to static image
    return NextResponse.json({ ok: true });
  }

  if (section.imagePath) {
    await deleteFromStorage(section.imagePath);
  }

  await prisma.sharedSection.update({
    where: { slug },
    data: { imagePath: null },
  });

  return NextResponse.json({ ok: true });
}
