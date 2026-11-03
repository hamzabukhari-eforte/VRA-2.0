/** One row from GET /api/admin/sections (batch) or legacy slug-keyed map entry. */
export type SharedSectionRowPayload = {
  slug: string;
  imageUrl?: string | null;
  sectionTitle?: string | null;
  mainHeading?: string | null;
  description?: string | null;
  tags?: unknown;
};

/** Coerce Prisma Json / API values into string[] | null for section tag pills. */
export function normalizeSectionTags(raw: unknown): string[] | null {
  if (raw == null) return null;
  if (!Array.isArray(raw)) return null;
  if (!raw.every((x): x is string => typeof x === "string")) return null;
  return raw;
}

export function tagsToCommaSeparated(
  tags: string[] | null | undefined
): string {
  if (tags == null || tags.length === 0) return "";
  return tags.join(", ");
}

/** Map API / batch payload into controlled form state for admin SharedSection editors. */
export function adminPayloadToFormState(d: {
  imageUrl?: string | null;
  sectionTitle?: string | null;
  mainHeading?: string | null;
  description?: string | null;
  tags?: unknown;
}): {
  sectionTitle: string;
  mainHeading: string;
  description: string;
  tags: string;
  imagePreview: string | null;
} {
  return {
    sectionTitle: d.sectionTitle != null ? String(d.sectionTitle) : "",
    mainHeading: d.mainHeading != null ? String(d.mainHeading) : "",
    description: d.description != null ? String(d.description) : "",
    tags: tagsToCommaSeparated(normalizeSectionTags(d.tags)),
    imagePreview: d.imageUrl ?? null,
  };
}
