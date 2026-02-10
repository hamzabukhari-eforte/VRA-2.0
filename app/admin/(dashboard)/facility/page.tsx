"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const FACILITY_SLUGS = [
  { slug: "ground_1", label: "Ground 1" },
  { slug: "ground_2", label: "Ground 2" },
  { slug: "ground_3", label: "Ground 3" },
  { slug: "outdoor_nets", label: "Outdoor Nets" },
  { slug: "indoor_nets", label: "Indoor Nets" },
  { slug: "pavilion", label: "Pavilion" },
];

export default function AdminFacilityPage() {
  const [uploading, setUploading] = useState<string | null>(null);
  const [previews, setPreviews] = useState<Record<string, string | null>>({});

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
      reader.onload = () =>
        setPreviews((p) => ({ ...p, [slug]: reader.result as string }));
      reader.readAsDataURL(file);
    } catch (e) {
      console.error(e);
    } finally {
      setUploading(null);
    }
  };

  useEffect(() => {
    FACILITY_SLUGS.forEach(({ slug }) => {
      fetch(`/api/cms/section/${slug}`)
        .then((r) => r.json())
        .then((d) => d.imageUrl && setPreviews((p) => ({ ...p, [slug]: d.imageUrl })))
        .catch(() => {});
    });
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-semibold text-zinc-900 mb-2">Facility</h1>
      <p className="text-zinc-600 mb-6 text-base">
        Ground and facility section images. Same images are used on the Facility page. You can also manage these in{" "}
        <Link href="/admin/sections" className="underline text-blue-600">Section images</Link> (all section keys).
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {FACILITY_SLUGS.map(({ slug, label }) => (
          <div
            key={slug}
            className="rounded-lg border border-zinc-200 bg-white p-4"
          >
            <p className="font-medium text-zinc-900 text-base mb-2">{label}</p>
            <div className="aspect-video bg-zinc-100 rounded mb-3 overflow-hidden">
              {previews[slug] ? (
                <img
                  src={previews[slug]!}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-400 text-sm">
                  No image
                </div>
              )}
            </div>
            <label className="block">
              <span className="sr-only">Upload</span>
              <input
                type="file"
                accept="image/*"
                className="block w-full text-base text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-500 file:text-white file:font-medium file:text-base"
                disabled={!!uploading}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) upload(slug, f);
                }}
              />
            </label>
            {uploading === slug && (
              <p className="text-sm text-amber-600 mt-1">Uploading…</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
