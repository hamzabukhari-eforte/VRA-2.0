"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Upload, X, ImageIcon } from "lucide-react";

interface BoardItem {
  id: string;
  order: number;
  imageUrl: string | null;
}

const BOARD_SLOT_HEIGHTS = [
  "h-[280px]",
  "h-[280px]",
  "h-[360px]",
  "h-[200px]",
  "h-[280px]",
  "h-[280px]",
] as const;

function BoardSlot({
  slotIndex,
  item,
  heightClass,
  uploading,
  onUpload,
  onRequestDelete,
}: {
  slotIndex: number;
  item: BoardItem | null;
  heightClass: string;
  uploading: boolean;
  onUpload: (slotIndex: number, file: File, existingId?: string) => Promise<void>;
  onRequestDelete: (id: string) => void;
}) {
  const inputId = `board-slot-${slotIndex}`;
  const hasImage = !!item?.imageUrl;

  return (
    <div className="p-2 break-inside-avoid mb-2">
      <div
        className={`relative w-full ${heightClass} rounded-lg overflow-hidden bg-zinc-100 border border-zinc-200 flex items-center justify-center`}
      >
        {hasImage ? (
          <>
            <Image
              src={item!.imageUrl!}
              alt={`Board member ${slotIndex + 1}`}
              fill
              unoptimized
              sizes="(min-width: 1024px) 320px, (min-width: 640px) 50vw, 100vw"
              className="object-cover"
            />
            <div className="absolute top-2 right-2 flex gap-2">
              <button
                type="button"
                disabled={uploading}
                onClick={() => {
                  const el = document.getElementById(inputId) as HTMLInputElement | null;
                  el?.click();
                }}
                className="px-2 py-1 rounded bg-white/90 text-xs font-medium text-zinc-800 shadow-sm border border-zinc-200"
              >
                Change
              </button>
              <button
                type="button"
                disabled={uploading}
                onClick={() => item && onRequestDelete(item.id)}
                className="px-2 py-1 rounded bg-white/90 text-xs font-medium text-red-700 shadow-sm border border-red-200"
              >
                Delete
              </button>
            </div>
          </>
        ) : (
          <button
            type="button"
            disabled={uploading}
            onClick={() => {
              const el = document.getElementById(inputId) as HTMLInputElement | null;
              el?.click();
            }}
            className="w-full h-full flex flex-col items-center justify-center gap-2 text-zinc-500 hover:bg-zinc-200/60 transition-colors text-sm"
          >
            <Upload className="w-6 h-6" />
            <span className="font-medium">Click to add image</span>
            <span className="text-xs text-zinc-400">Slot {slotIndex + 1}</span>
          </button>
        )}

        {!hasImage && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <ImageIcon className="w-10 h-10 text-zinc-300" />
          </div>
        )}
      </div>

      <input
        id={inputId}
        type="file"
        accept="image/*"
        className="hidden"
        disabled={uploading}
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) {
            void onUpload(slotIndex, f, item?.id);
          }
          e.target.value = "";
        }}
      />

      {uploading && (
        <p className="mt-1 text-xs text-amber-600">
          {hasImage ? "Updating image…" : "Uploading image…"}
        </p>
      )}
    </div>
  );
}

export default function AdminAboutPage() {
  const [items, setItems] = useState<BoardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const load = async () => {
    const r = await fetch("/api/admin/about/board");
    const text = await r.text();
    if (!text) {
      setItems([]);
      return;
    }
    try {
      const parsed = JSON.parse(text) as BoardItem[];
      setItems(parsed);
    } catch {
      setItems([]);
    }
  };

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, []);

  const uploadToSlot = async (slotIndex: number, file: File, existingId?: string) => {
    setUploadingKey(`slot-${slotIndex}`);
    try {
      const form = new FormData();
      form.append("file", file);
      if (existingId) {
        await fetch(`/api/admin/about/board/${existingId}`, { method: "PUT", body: form });
      } else {
        form.append("order", String(slotIndex));
        await fetch("/api/admin/about/board", { method: "POST", body: form });
      }
      await load();
    } finally {
      setUploadingKey(null);
    }
  };

  const deleteItem = async (id: string) => {
    await fetch(`/api/admin/about/board/${id}`, { method: "DELETE" });
    await load();
  };

  if (loading) {
    return (
      <div>
        <h1 className="text-3xl font-semibold text-zinc-900 mb-2">About</h1>
        <p className="text-zinc-600 mb-6 text-base">Loading…</p>
      </div>
    );
  }

  const ordered = [...items].sort((a, b) => a.order - b.order);
  const slots: (BoardItem | null)[] = new Array(6).fill(null);
  ordered.forEach((item) => {
    const idx = item.order ?? 0;
    if (idx >= 0 && idx < slots.length && !slots[idx]) {
      slots[idx] = item;
    }
  });

  return (
    <div>
      <h1 className="text-3xl font-semibold text-zinc-900 mb-2">About</h1>
      <p className="text-zinc-600 mb-6 text-base">
        Mission, Vision, Volunteer images are in{" "}
        <Link href="/admin/sections" className="underline text-blue-600">
          Section images
        </Link>
        . Our Board images: fixed 6-slot grid that matches the About page layout.
      </p>

      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="text-xl font-medium text-zinc-900 mb-1">Our Board</h2>
          <p className="text-zinc-600 text-base">
            Same grid as the public About page. Click a card to upload, or use Change/Delete to
            update images.
          </p>
        </div>
    
      </div>

      {/* Same grid as web Our Board: columns layout with 6 slots */}
      <div className="columns-1 sm:columns-2 md:columns-3 gap-2 md:gap-2 w-full max-w-[900px]">
        {slots.map((item, index) => (
          <BoardSlot
            key={index}
            slotIndex={index}
            item={item}
            heightClass={BOARD_SLOT_HEIGHTS[index] ?? "h-[280px]"}
            uploading={uploadingKey === `slot-${index}`}
            onUpload={uploadToSlot}
            onRequestDelete={(id) => setConfirmDeleteId(id)}
          />
        ))}
      </div>

      {confirmDeleteId && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-xl bg-white shadow-lg p-6 space-y-4">
            <h2 className="text-lg font-semibold text-zinc-900">Remove board image</h2>
            <p className="text-sm text-zinc-600">
              This will remove the selected image from the Our Board grid on the About page.
            </p>
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setConfirmDeleteId(null)}
                className="px-4 py-2 rounded-lg border border-zinc-300 bg-white text-sm font-medium text-zinc-700 hover:bg-zinc-50"
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 rounded-lg bg-red-600 text-sm font-medium text-white hover:bg-red-700"
                onClick={async () => {
                  const id = confirmDeleteId;
                  setConfirmDeleteId(null);
                  if (!id) return;
                  await deleteItem(id);
                }}
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