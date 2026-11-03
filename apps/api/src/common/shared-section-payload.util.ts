/**
 * Ported from apps/web/lib/shared-section-payload.ts (backend-relevant parts only;
 * `adminPayloadToFormState`/`tagsToCommaSeparated` are frontend-only form helpers
 * and are not needed by the API).
 */

/** Coerce Prisma Json / API values into string[] | null for section tag pills. */
export function normalizeSectionTags(raw: unknown): string[] | null {
  if (raw == null) return null;
  if (!Array.isArray(raw)) return null;
  if (!raw.every((x): x is string => typeof x === "string")) return null;
  return raw;
}
