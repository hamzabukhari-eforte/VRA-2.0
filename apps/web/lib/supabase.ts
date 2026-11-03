import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase =
  supabaseUrl && supabaseServiceKey
    ? createClient(supabaseUrl, supabaseServiceKey)
    : null;

const BUCKET = process.env.BUCKET_NAME ?? "vra";

/**
 * Get a presigned (signed) URL for a private storage path.
 * Expires in 1 hour by default.
 */
export async function getPresignedUrl(
  path: string,
  expiresIn = 3600
): Promise<string | null> {
  if (!supabase) return null;
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(path, expiresIn);
  if (error || !data?.signedUrl) return null;
  return data.signedUrl;
}

/**
 * Upload a file to Supabase Storage. Returns the storage path (no leading slash).
 */
export async function uploadToStorage(
  path: string,
  file: Buffer | Blob,
  contentType?: string
): Promise<string | null> {
  if (!supabase) return null;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    contentType: contentType ?? "image/jpeg",
    upsert: true,
  });
  if (error) return null;
  return path;
}

/**
 * Delete a file from storage by path.
 */
export async function deleteFromStorage(path: string): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase.storage.from(BUCKET).remove([path]);
  return !error;
}
