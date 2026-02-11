"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { toast } from "sonner";

const SECTION_SLUGS = [
  { slug: "overseas_cricket_talent", label: "Overseas Cricket Talent" },
  { slug: "sports_clinics", label: "Sports Clinics" },
  { slug: "cultural_events", label: "Cultural Events" },
  { slug: "sports_events", label: "Sports Events" },
  { slug: "mission", label: "About – Mission" },
  { slug: "vision", label: "About – Vision" },
  { slug: "volunteer", label: "About – Volunteer for Us" },
  { slug: "ground_1", label: "Facility – Ground 1" },
  { slug: "ground_2", label: "Facility – Ground 2" },
  { slug: "ground_3", label: "Facility – Ground 3" },
  { slug: "outdoor_nets", label: "Facility – Outdoor Nets" },
  { slug: "indoor_nets", label: "Facility – Indoor Nets" },
  { slug: "pavilion", label: "Facility – Pavilion" },
  { slug: "culture", label: "VRA Cricket – Culture" },
];

const getLabelForSlug = (slug: string) =>
  SECTION_SLUGS.find((s) => s.slug === slug)?.label ?? slug;

export default function AdminSectionsPage() {
  const [uploading, setUploading] = useState<string | null>(null);
  const [previews, setPreviews] = useState<Record<string, string | null>>({});
  const [confirmSlug, setConfirmSlug] = useState<string | null>(null);

  const upload = async (slug: string, file: File) => {
    setUploading(slug);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch(`/api/admin/sections/${slug}`, {
        method: "PUT",
        body: form,
      });
      if (!res.ok) throw new Error("Upload failed");
      const reader = new FileReader();
      reader.onload = () => setPreviews((p) => ({ ...p, [slug]: reader.result as string }));
      reader.readAsDataURL(file);
      toast.success(`Image saved for "${getLabelForSlug(slug)}".`);
    } catch (e) {
      console.error(e);
      toast.error(`Failed to upload image for "${getLabelForSlug(slug)}".`);
    } finally {
      setUploading(null);
    }
  };

  const doRemove = async (slug: string) => {
    setUploading(slug);
    try {
      const res = await fetch(`/api/admin/sections/${slug}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      setPreviews((p) => ({ ...p, [slug]: null }));
      toast.success(
        `Image removed for "${getLabelForSlug(
          slug,
        )}". The site will fall back to the original image.`,
      );
    } catch (e) {
      console.error(e);
      toast.error(`Failed to delete image for "${getLabelForSlug(slug)}".`);
    } finally {
      setUploading(null);
    }
  };

  useEffect(() => {
    SECTION_SLUGS.forEach(({ slug }) => {
      fetch(`/api/cms/section/${slug}`)
        .then((r) => r.json())
        .then((d) => d.imageUrl && setPreviews((p) => ({ ...p, [slug]: d.imageUrl })))
        .catch(() => {});
    });
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-semibold text-zinc-900 mb-2">
        Section images
      </h1>
      <p className="text-zinc-600 mb-6 text-base">
        One image per section. Same image is used everywhere that section appears. Fallback: existing frontend image.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {SECTION_SLUGS.map(({ slug, label }) => (
          <div
            key={slug}
            className="rounded-lg border border-zinc-200 bg-white p-4"
          >
            <p className="font-medium text-zinc-900 text-base mb-2">
              {label}
            </p>
            <div className="relative aspect-video bg-zinc-100 rounded mb-3 overflow-hidden">
              {previews[slug] ? (
                <>
                  <Image
                    src={previews[slug]!}
                    alt=""
                    fill
                    unoptimized
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() => document.getElementById(`section-file-${slug}`)?.click()}
                      className="px-2 py-1 rounded bg-white/90 text-xs font-medium text-zinc-800 shadow-sm border border-zinc-200"
                      disabled={!!uploading}
                    >
                      Change
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmSlug(slug)}
                      className="px-2 py-1 rounded bg-white/90 text-xs font-medium text-red-700 shadow-sm border border-red-200"
                      disabled={!!uploading}
                    >
                      Delete
                    </button>
                  </div>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => document.getElementById(`section-file-${slug}`)?.click()}
                  disabled={!!uploading}
                  className="w-full h-full flex items-center justify-center text-zinc-500 text-sm hover:bg-zinc-200/60 transition-colors"
                >
                  Click to upload
                </button>
              )}
            </div>
            <input
              id={`section-file-${slug}`}
              type="file"
              accept="image/*"
              className="hidden"
              disabled={!!uploading}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) upload(slug, f);
                e.target.value = "";
              }}
            />
            {uploading === slug && (
              <p className="text-sm text-amber-600 mt-1">
                {previews[slug] ? "Updating image…" : "Uploading image…"}
              </p>
            )}
          </div>
        ))}
      </div>

      {confirmSlug && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-xl bg-white shadow-lg p-6 space-y-4">
            <h2 className="text-lg font-semibold text-zinc-900">
              Remove section image
            </h2>
            <p className="text-sm text-zinc-600">
              This will remove the uploaded image for{" "}
              <span className="font-medium">
                “{getLabelForSlug(confirmSlug)}”
              </span>
              . The live site will fall back to the original static image.
            </p>
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setConfirmSlug(null)}
                className="px-4 py-2 rounded-lg border border-zinc-300 bg-white text-sm font-medium text-zinc-700 hover:bg-zinc-50"
                disabled={!!uploading}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  const slug = confirmSlug;
                  setConfirmSlug(null);
                  if (slug) {
                    await doRemove(slug);
                  }
                }}
                className="px-4 py-2 rounded-lg bg-red-600 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                disabled={!!uploading}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
