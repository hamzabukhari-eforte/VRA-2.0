import { Injectable } from "@nestjs/common";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

/** Ported from apps/web/lib/supabase.ts. */
@Injectable()
export class StorageService {
  private readonly supabase: SupabaseClient | null;
  private readonly bucket: string;

  constructor() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
    const supabaseServiceKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

    this.supabase =
      supabaseUrl && supabaseServiceKey ? createClient(supabaseUrl, supabaseServiceKey) : null;
    this.bucket = process.env.BUCKET_NAME ?? "vra";
  }

  /**
   * Get a presigned (signed) URL for a private storage path.
   * Expires in 1 hour by default.
   */
  async getPresignedUrl(path: string, expiresIn = 3600): Promise<string | null> {
    if (!this.supabase) return null;
    const { data, error } = await this.supabase.storage
      .from(this.bucket)
      .createSignedUrl(path, expiresIn);
    if (error || !data?.signedUrl) return null;
    return data.signedUrl;
  }

  /** Upload a file to Supabase Storage. Returns the storage path (no leading slash). */
  async uploadToStorage(path: string, file: Buffer, contentType?: string): Promise<string | null> {
    if (!this.supabase) return null;
    const { error } = await this.supabase.storage.from(this.bucket).upload(path, file, {
      contentType: contentType ?? "image/jpeg",
      upsert: true,
    });
    if (error) return null;
    return path;
  }

  /** Delete a file from storage by path. */
  async deleteFromStorage(path: string): Promise<boolean> {
    if (!this.supabase) return false;
    const { error } = await this.supabase.storage.from(this.bucket).remove([path]);
    return !error;
  }
}
