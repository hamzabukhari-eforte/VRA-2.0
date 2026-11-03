import { memoryStorage } from "multer";
import type { StorageEngine } from "multer";

/**
 * Shared multer options: keep uploaded files in memory (Buffer) so they can be
 * forwarded directly to Supabase Storage, mirroring the Next.js route.ts files
 * which read `File#arrayBuffer()` from `request.formData()`.
 */
export const MEMORY_MULTER_OPTIONS: { storage: StorageEngine } = {
  storage: memoryStorage(),
};
