"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type SubTab = "counts" | "carousel";

interface CountsData {
  id: string;
  mens: number;
  womens: number;
  youth: number;
  zalmisXi: number;
}

interface CarouselItem {
  id: string;
  order: number;
  imageUrl: string;
}

export default function AdminVRACricketPage() {
  const [subTab, setSubTab] = useState<SubTab>("counts");
  const [counts, setCounts] = useState<CountsData | null>(null);
  const [carousel, setCarousel] = useState<CarouselItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ mens: 7, womens: 1, youth: 9, zalmisXi: 2 });

  const loadCounts = () =>
    fetch("/api/admin/vra-cricket/counts")
      .then((r) => r.json())
      .then((data) => {
        setCounts(data);
        setForm({
          mens: data.mens ?? 7,
          womens: data.womens ?? 1,
          youth: data.youth ?? 9,
          zalmisXi: data.zalmisXi ?? 2,
        });
      });
  const loadCarousel = () =>
    fetch("/api/admin/vra-cricket/carousel")
      .then((r) => r.json())
      .then(setCarousel);

  useEffect(() => {
    setLoading(true);
    Promise.all([loadCounts(), loadCarousel()]).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (subTab === "counts") loadCounts();
    if (subTab === "carousel") loadCarousel();
  }, [subTab]);

  const saveCounts = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await fetch("/api/admin/vra-cricket/counts", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    await loadCounts();
    setSaving(false);
  };

  const uploadCarousel = async (file: File) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("order", String(carousel.length));
    await fetch("/api/admin/vra-cricket/carousel", {
      method: "POST",
      body: formData,
    });
    await loadCarousel();
    setUploading(false);
  };

  const deleteCarousel = async (id: string) => {
    if (!confirm("Delete this image?")) return;
    await fetch(`/api/admin/vra-cricket/carousel/${id}`, { method: "DELETE" });
    await loadCarousel();
  };

  const moveCarousel = async (id: string, direction: "up" | "down") => {
    const idx = carousel.findIndex((i) => i.id === id);
    if (idx < 0) return;
    const newIdx = direction === "up" ? Math.max(0, idx - 1) : Math.min(carousel.length - 1, idx + 1);
    const swapped = carousel[newIdx];
    if (!swapped || swapped.id === id) return;
    const currentOrder = carousel[idx]!.order;
    const swappedOrder = swapped.order;
    await Promise.all([
      fetch(`/api/admin/vra-cricket/carousel/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: swappedOrder }),
      }),
      fetch(`/api/admin/vra-cricket/carousel/${swapped.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: currentOrder }),
      }),
    ]);
    await loadCarousel();
  };

  if (loading) {
    return (
      <div>
        <h1 className="text-3xl font-semibold text-zinc-900 mb-2">VRA Cricket</h1>
        <p className="text-zinc-600 mb-6 text-base">Loading…</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold text-zinc-900 mb-2">VRA Cricket</h1>
      <p className="text-zinc-600 mb-6 text-base">
        Team counts (Men&apos;s, Women&apos;s, Youth, Zalmis XI) and facility carousel. Section images (e.g. Culture) are in{" "}
        <Link href="/admin/sections" className="underline text-blue-600">Section images</Link>.
      </p>

      <div className="flex gap-1 border border-zinc-200 rounded-lg p-1 mb-6">
        <button
          onClick={() => setSubTab("counts")}
          className={`px-4 py-2 rounded text-base font-medium ${
            subTab === "counts"
              ? "bg-zinc-200 text-zinc-900"
              : "text-zinc-600 hover:bg-zinc-100"
          }`}
        >
          Team counts
        </button>
        <button
          onClick={() => setSubTab("carousel")}
          className={`px-4 py-2 rounded text-base font-medium ${
            subTab === "carousel"
              ? "bg-zinc-200 text-zinc-900"
              : "text-zinc-600 hover:bg-zinc-100"
          }`}
        >
          Facility carousel
        </button>
      </div>

      {subTab === "counts" && (
        <div>
          <h2 className="text-xl font-medium text-zinc-900 mb-2">Team counts</h2>
          <p className="text-zinc-600 mb-4 text-base">
            Numbers shown in the &quot;Teams in VRA&quot; section (Senior Men&apos;s, Women&apos;s, Youth, Zalmi XI&apos;s).
          </p>
          <form onSubmit={saveCounts} className="space-y-4 max-w-sm">
            <div>
              <label className="block font-medium text-zinc-700 mb-1">Men&apos;s teams</label>
              <input
                type="number"
                min={0}
                value={form.mens}
                onChange={(e) =>
                  setForm((f) => ({ ...f, mens: parseInt(e.target.value, 10) || 0 }))
                }
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-base"
              />
            </div>
            <div>
              <label className="block font-medium text-zinc-700 mb-1">Women&apos;s teams</label>
              <input
                type="number"
                min={0}
                value={form.womens}
                onChange={(e) =>
                  setForm((f) => ({ ...f, womens: parseInt(e.target.value, 10) || 0 }))
                }
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-base"
              />
            </div>
            <div>
              <label className="block font-medium text-zinc-700 mb-1">Youth teams</label>
              <input
                type="number"
                min={0}
                value={form.youth}
                onChange={(e) =>
                  setForm((f) => ({ ...f, youth: parseInt(e.target.value, 10) || 0 }))
                }
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-base"
              />
            </div>
            <div>
              <label className="block font-medium text-zinc-700 mb-1">Zalmi XI&apos;s</label>
              <input
                type="number"
                min={0}
                value={form.zalmisXi}
                onChange={(e) =>
                  setForm((f) => ({ ...f, zalmisXi: parseInt(e.target.value, 10) || 0 }))
                }
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-base"
              />
            </div>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white text-base font-medium disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save counts"}
            </button>
          </form>
        </div>
      )}

      {subTab === "carousel" && (
        <div>
          <h2 className="text-xl font-medium text-zinc-900 mb-2">Facility carousel</h2>
          <p className="text-zinc-600 mb-4 text-base">Upload images; use arrows to reorder. Delete to remove.</p>
          <label className="block mb-4">
            <span className="sr-only">Upload image</span>
            <input
              type="file"
              accept="image/*"
              disabled={uploading}
              className="block w-full text-base file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-500 file:text-white file:font-medium"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) uploadCarousel(f);
              }}
            />
          </label>
          {uploading && <p className="text-amber-600 mb-2">Uploading…</p>}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {carousel.map((item, index) => (
              <div key={item.id} className="rounded-lg border border-zinc-200 bg-white p-2">
                <div className="aspect-video bg-zinc-100 rounded overflow-hidden mb-2">
                  <img
                    src={item.imageUrl}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex items-center justify-between gap-1">
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => moveCarousel(item.id, "up")}
                      disabled={index === 0}
                      className="px-2 py-1 rounded border border-zinc-300 text-base disabled:opacity-50"
                      title="Move up"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => moveCarousel(item.id, "down")}
                      disabled={index === carousel.length - 1}
                      className="px-2 py-1 rounded border border-zinc-300 text-base disabled:opacity-50"
                      title="Move down"
                    >
                      ↓
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => deleteCarousel(item.id)}
                    className="px-2 py-1 rounded border border-red-200 text-red-700 text-base hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
