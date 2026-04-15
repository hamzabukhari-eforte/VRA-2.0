"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  adminPayloadToFormState,
  type SharedSectionRowPayload,
} from "@/lib/shared-section-payload";

type SectionDef =
  | { slug: string; label: string; kind: "hero" }
  | { slug: string; label: string; kind: "full" };

const FACILITY_SECTIONS: SectionDef[] = [
  { slug: "facility_hero", label: "Page hero (title)", kind: "hero" },
  { slug: "ground_1", label: "Ground 1", kind: "full" },
  { slug: "ground_2", label: "Ground 2", kind: "full" },
  { slug: "ground_3", label: "Ground 3", kind: "full" },
  { slug: "outdoor_nets", label: "Outdoor Nets", kind: "full" },
  { slug: "indoor_nets", label: "Indoor Nets", kind: "full" },
  { slug: "pavilion", label: "Pavilion", kind: "full" },
  { slug: "changing_rooms", label: "Changing rooms", kind: "full" },
  { slug: "cafeteria", label: "Cafeteria", kind: "full" },
  { slug: "kitchen", label: "Kitchen", kind: "full" },
  { slug: "bar", label: "Bar", kind: "full" },
  { slug: "sports_events", label: "Sports Events", kind: "full" },
  { slug: "sports_clinics", label: "Sports Clinics", kind: "full" },
  { slug: "cultural_events", label: "Cultural Events", kind: "full" },
];

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

export default function AdminFacilityPage() {
  const [uploading, setUploading] = useState<string | null>(null);
  const [saving, setSaving] = useState<string | null>(null);
  const [forms, setForms] = useState<Record<string, SectionFormState>>({});
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
          for (const { slug } of FACILITY_SECTIONS) {
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
      toast.success(`Image saved for "${slug}".`);
    } catch (e) {
      console.error(e);
      toast.error(`Failed to upload image for "${slug}".`);
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
      toast.success(`Text saved for "${slug}".`);
    } catch (e) {
      console.error(e);
      toast.error(`Failed to save text for "${slug}".`);
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

  return (
    <div>
      <h1 className="text-3xl font-semibold text-zinc-900 mb-2">Facility</h1>
      <p className="text-zinc-600 mb-6 text-base">
        Section images, headings, body text, and tag pills for the Facility page.
        Empty fields fall back to the defaults in code. You can also manage images
        for shared keys in{" "}
        <Link href="/admin/sections" className="underline text-blue-600">
          Shared sections
        </Link>
        .
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {FACILITY_SECTIONS.map(({ slug, label, kind }) => {
          const f = forms[slug] ?? emptyForm();
          return (
            <div
              key={slug}
              className="rounded-lg border border-zinc-200 bg-white p-4 flex flex-col gap-3"
            >
              <p className="font-medium text-zinc-900 text-base">{label}</p>
              <p className="text-xs text-zinc-500">Slug: {slug}</p>

              {kind === "full" && (
                <>
                  <div className="aspect-video bg-zinc-100 rounded overflow-hidden">
                    {f.imagePreview ? (
                      <img
                        src={f.imagePreview}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-400 text-sm">
                        No CMS image (site uses static asset)
                      </div>
                    )}
                  </div>
                  <label className="block">
                    <span className="sr-only">Upload image</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="block w-full text-sm text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-500 file:text-white file:font-medium"
                      disabled={!!uploading}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) upload(slug, file);
                      }}
                    />
                  </label>
                  {uploading === slug && (
                    <p className="text-sm text-amber-600">Uploading…</p>
                  )}
                </>
              )}

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
                <span className="text-zinc-700 font-medium">
                  {kind === "hero" ? "Hero title" : "Heading"}
                </span>
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

              {kind === "full" && (
                <>
                  <label className="block text-sm">
                    <span className="text-zinc-700 font-medium">
                      Tags (comma-separated)
                    </span>
                    <input
                      type="text"
                      value={f.tags}
                      onChange={(e) =>
                        updateField(slug, "tags", e.target.value)
                      }
                      className="mt-1 w-full border border-zinc-300 rounded px-3 py-2 text-sm"
                      placeholder="Leave empty for default"
                    />
                  </label>

                  <label className="block text-sm">
                    <span className="text-zinc-700 font-medium">
                      Description
                    </span>
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
                </>
              )}

              <button
                type="button"
                onClick={() => saveText(slug)}
                disabled={!!saving}
                className="self-start px-4 py-2 rounded-lg bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-800 disabled:opacity-50"
              >
                {saving === slug ? "Saving…" : "Save text"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
