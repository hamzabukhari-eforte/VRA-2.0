"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { toast } from "sonner";
import {
  adminPayloadToFormState,
  type SharedSectionRowPayload,
} from "@/lib/shared-section-payload";

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

type SectionFormState = {
  sectionTitle: string;
  mainHeading: string;
  description: string;
  tags: string;
  imagePreview: string | null;
};

const emptyForm = (): SectionFormState => ({
  sectionTitle: "",
  mainHeading: "",
  description: "",
  tags: "",
  imagePreview: null,
});

export default function AdminSectionsPage() {
  const [uploading, setUploading] = useState<string | null>(null);
  const [saving, setSaving] = useState<string | null>(null);
  const [forms, setForms] = useState<Record<string, SectionFormState>>({});
  const [confirmSlug, setConfirmSlug] = useState<string | null>(null);
  const loadGeneration = useRef(0);

  useEffect(() => {
    const gen = ++loadGeneration.current;
    (async () => {
      try {
        const res = await fetch("/api/admin/sections", {
          cache: "no-store",
          credentials: "include",
        });
        if (gen !== loadGeneration.current) return;
        if (!res.ok) {
          toast.error("Could not load saved sections.");
          return;
        }
        const body = (await res.json()) as unknown;
        if (gen !== loadGeneration.current) return;

        if (
          body &&
          typeof body === "object" &&
          "error" in body &&
          !("sections" in body)
        ) {
          toast.error("Could not load saved sections.");
          return;
        }

        let rows: SharedSectionRowPayload[] = [];
        if (
          body &&
          typeof body === "object" &&
          !Array.isArray(body) &&
          "sections" in body &&
          Array.isArray((body as { sections: unknown }).sections)
        ) {
          rows = (body as { sections: SharedSectionRowPayload[] }).sections;
        } else if (
          body &&
          typeof body === "object" &&
          !Array.isArray(body) &&
          !("error" in (body as object))
        ) {
          // Legacy slug-keyed map (older deploys)
          rows = Object.entries(
            body as Record<string, Omit<SharedSectionRowPayload, "slug">>
          ).map(([slug, d]) => ({ slug, ...d }));
        }

        const bySlug = new Map(
          rows.map((r) => [r.slug?.trim() ?? "", r] as const)
        );

        if (gen !== loadGeneration.current) return;
        setForms((prev) => {
          const next = { ...prev };
          for (const { slug } of SECTION_SLUGS) {
            const d = bySlug.get(slug);
            next[slug] = d
              ? adminPayloadToFormState(d)
              : (next[slug] ?? emptyForm());
          }
          return next;
        });
      } catch {
        if (gen === loadGeneration.current) {
          toast.error("Could not load saved sections.");
        }
      }
    })();
  }, []);

  const upload = async (slug: string, file: File) => {
    setUploading(slug);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch(`/api/admin/sections/${slug}`, {
        method: "PUT",
        body: form,
        credentials: "include",
      });
      if (!res.ok) throw new Error("Upload failed");
      const reader = new FileReader();
      reader.onload = () =>
        setForms((p) => ({
          ...p,
          [slug]: {
            ...(p[slug] ?? emptyForm()),
            imagePreview: reader.result as string,
          },
        }));
      reader.readAsDataURL(file);
      toast.success(`Image saved for "${getLabelForSlug(slug)}".`);
    } catch (e) {
      console.error(e);
      toast.error(`Failed to upload image for "${getLabelForSlug(slug)}".`);
    } finally {
      setUploading(null);
    }
  };

  const saveText = async (slug: string) => {
    const f = forms[slug] ?? emptyForm();
    setSaving(slug);
    try {
      const tagsTrimmed = f.tags.trim();
      const tagsPayload =
        tagsTrimmed === ""
          ? null
          : tagsTrimmed.split(",").map((t) => t.trim()).filter(Boolean);

      const res = await fetch(`/api/admin/sections/${slug}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sectionTitle: f.sectionTitle.trim() === "" ? null : f.sectionTitle,
          mainHeading: f.mainHeading.trim() === "" ? null : f.mainHeading,
          description: f.description.trim() === "" ? null : f.description,
          tags: tagsPayload,
        }),
      });
      if (!res.ok) throw new Error("Save failed");
      toast.success(`Text saved for "${getLabelForSlug(slug)}".`);
    } catch (e) {
      console.error(e);
      toast.error(`Failed to save text for "${getLabelForSlug(slug)}".`);
    } finally {
      setSaving(null);
    }
  };

  const updateField = (
    slug: string,
    field: keyof SectionFormState,
    value: string
  ) => {
    setForms((p) => ({
      ...p,
      [slug]: { ...(p[slug] ?? emptyForm()), [field]: value },
    }));
  };

  const doRemove = async (slug: string) => {
    setUploading(slug);
    try {
      const res = await fetch(`/api/admin/sections/${slug}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Delete failed");
      setForms((p) => ({
        ...p,
        [slug]: { ...(p[slug] ?? emptyForm()), imagePreview: null },
      }));
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

  return (
    <div>
      <h1 className="text-3xl font-semibold text-zinc-900 mb-2">
        Shared sections
      </h1>
      <p className="text-zinc-600 mb-6 text-base">
        One record per section key: image on the left, optional text overrides on
        the right (title, heading, tags, description). The same content is used
        everywhere that key appears. Empty text fields keep the site&apos;s
        built-in defaults.
      </p>
      <div className="grid grid-cols-1 gap-6">
        {SECTION_SLUGS.map(({ slug, label }) => {
          const f = forms[slug] ?? emptyForm();
          return (
            <div
              key={slug}
              className="rounded-lg border border-zinc-200 bg-white p-4 md:p-5 grid grid-cols-1 md:grid-cols-2 md:gap-6 gap-4"
            >
              <div className="flex flex-col gap-3 min-w-0">
                <div>
                  <p className="font-medium text-zinc-900 text-base">{label}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">Slug: {slug}</p>
                </div>
                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Image
                </p>
                <div className="relative aspect-video bg-zinc-100 rounded overflow-hidden shrink-0">
                  {f.imagePreview ? (
                    <>
                      <Image
                        src={f.imagePreview}
                        alt=""
                        fill
                        unoptimized
                        sizes="(min-width: 768px) 40vw, 100vw"
                        className="object-cover"
                      />
                      <div className="absolute top-2 right-2 flex gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            document
                              .getElementById(`section-file-${slug}`)
                              ?.click()
                          }
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
                      onClick={() =>
                        document.getElementById(`section-file-${slug}`)?.click()
                      }
                      disabled={!!uploading}
                      className="w-full h-full flex items-center justify-center text-zinc-500 text-sm hover:bg-zinc-200/60 transition-colors min-h-[160px]"
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
                    const file = e.target.files?.[0];
                    if (file) upload(slug, file);
                    e.target.value = "";
                  }}
                />
                {uploading === slug && (
                  <p className="text-sm text-amber-600">
                    {f.imagePreview ? "Updating image…" : "Uploading image…"}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-3 min-w-0 border-t md:border-t-0 md:border-l border-zinc-200 pt-4 md:pt-0 md:pl-6">
                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Text &amp; tags
                </p>
                <p className="text-xs text-zinc-500 -mt-2">
                  Edit below, then click Save text.
                </p>

                <label className="block text-sm">
                  <span className="text-zinc-700 font-medium">
                    Section title (optional)
                  </span>
                  <input
                    type="text"
                    value={f.sectionTitle}
                    onChange={(e) =>
                      updateField(slug, "sectionTitle", e.target.value)
                    }
                    className="mt-1 w-full border border-zinc-300 rounded px-3 py-2 text-sm"
                    placeholder="Leave empty for default"
                  />
                </label>

                <label className="block text-sm">
                  <span className="text-zinc-700 font-medium">Heading</span>
                  <input
                    type="text"
                    value={f.mainHeading}
                    onChange={(e) =>
                      updateField(slug, "mainHeading", e.target.value)
                    }
                    className="mt-1 w-full border border-zinc-300 rounded px-3 py-2 text-sm"
                    placeholder="Leave empty for default"
                  />
                </label>

                <label className="block text-sm">
                  <span className="text-zinc-700 font-medium">
                    Tags (comma-separated)
                  </span>
                  <input
                    type="text"
                    value={f.tags}
                    onChange={(e) => updateField(slug, "tags", e.target.value)}
                    className="mt-1 w-full border border-zinc-300 rounded px-3 py-2 text-sm"
                    placeholder="Leave empty for default"
                  />
                </label>

                <label className="block text-sm">
                  <span className="text-zinc-700 font-medium">Description</span>
                  <textarea
                    value={f.description}
                    onChange={(e) =>
                      updateField(slug, "description", e.target.value)
                    }
                    rows={5}
                    className="mt-1 w-full border border-zinc-300 rounded px-3 py-2 text-sm"
                    placeholder="Leave empty for default"
                  />
                </label>

                <button
                  type="button"
                  onClick={() => saveText(slug)}
                  disabled={!!saving}
                  className="self-start px-4 py-2 rounded-lg bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-800 disabled:opacity-50"
                >
                  {saving === slug ? "Saving…" : "Save text"}
                </button>
              </div>
            </div>
          );
        })}
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
              . The live site will fall back to the original static image. Text
              overrides are not removed.
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
