"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

type SubTab = "gallery" | "crowd" | "teams" | "sponsors";

interface GalleryItem {
  id: string;
  order: number;
  imageUrl: string | null;
}

interface CrowdData {
  id: string | null;
  title: string | null;
  description: string | null;
  imageUrl: string | null;
}

interface TeamItem {
  id: string;
  name: string;
  order: number;
  imageUrl: string | null;
}

interface SponsorItem {
  id: string;
  name: string;
  websiteUrl: string | null;
  order: number;
  logoUrl: string | null;
}

const SUB_TABS: { id: SubTab; label: string }[] = [
  { id: "gallery", label: "Photo gallery" },
  { id: "crowd", label: "Image + text section" },
  { id: "teams", label: "VRA Teams" },
  { id: "sponsors", label: "Sponsors" },
];

export default function AdminHomepagePage() {
  const [subTab, setSubTab] = useState<SubTab>("gallery");
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [crowd, setCrowd] = useState<CrowdData | null>(null);
  const [teams, setTeams] = useState<TeamItem[]>([]);
  const [sponsors, setSponsors] = useState<SponsorItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);
  const [crowdSaving, setCrowdSaving] = useState(false);
  const [crowdForm, setCrowdForm] = useState({ title: "", description: "" });
  const [teamForm, setTeamForm] = useState({ name: "", order: "" });
  const [teamFormFile, setTeamFormFile] = useState<File | null>(null);
  const [sponsorForm, setSponsorForm] = useState({ name: "", websiteUrl: "", order: "" });
  const [sponsorFormFile, setSponsorFormFile] = useState<File | null>(null);
  const [editingTeam, setEditingTeam] = useState<string | null>(null);
  const [editingSponsor, setEditingSponsor] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<
    { type: "gallery" | "team" | "sponsor"; id: string } | null
  >(null);

  const loadGallery = () =>
    fetch("/api/admin/homepage/gallery")
      .then((r) => r.json())
      .then(setGallery);
  const loadCrowd = () =>
    fetch("/api/admin/homepage/crowd")
      .then((r) => r.json())
      .then((data) => {
        setCrowd(data);
        setCrowdForm({ title: data.title ?? "", description: data.description ?? "" });
      });
  const loadTeams = () =>
    fetch("/api/admin/homepage/teams")
      .then((r) => r.json())
      .then(setTeams);
  const loadSponsors = () =>
    fetch("/api/admin/homepage/sponsors")
      .then((r) => r.json())
      .then(setSponsors);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      loadGallery(),
      loadCrowd(),
      loadTeams(),
      loadSponsors(),
    ]).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (subTab === "gallery") loadGallery();
    if (subTab === "crowd") loadCrowd();
    if (subTab === "teams") loadTeams();
    if (subTab === "sponsors") loadSponsors();
  }, [subTab]);

  const uploadGalleryToSlot = async (slotIndex: number, file: File, existingId?: string) => {
    setUploading(`gallery-${slotIndex}`);
    if (existingId) {
      const form = new FormData();
      form.append("file", file);
      await fetch(`/api/admin/homepage/gallery/${existingId}`, { method: "PUT", body: form });
    } else {
      const form = new FormData();
      form.append("file", file);
      form.append("order", String(slotIndex));
      await fetch("/api/admin/homepage/gallery", { method: "POST", body: form });
    }
    await loadGallery();
    setUploading(null);
  };

  const deleteGallerySlot = async (id: string) => {
    await fetch(`/api/admin/homepage/gallery/${id}`, { method: "DELETE" });
    await loadGallery();
  };

  const saveCrowd = async (e: React.FormEvent) => {
    e.preventDefault();
    setCrowdSaving(true);
    const form = new FormData();
    form.append("description", crowdForm.description);
    await fetch("/api/admin/homepage/crowd", { method: "PUT", body: form });
    await loadCrowd();
    setCrowdSaving(false);
  };

  const uploadCrowdImage = async (file: File) => {
    setCrowdSaving(true);
    const form = new FormData();
    form.append("description", crowdForm.description);
    form.append("file", file);
    await fetch("/api/admin/homepage/crowd", { method: "PUT", body: form });
    await loadCrowd();
    setCrowdSaving(false);
  };

  const addTeam = async (e: React.FormEvent, file?: File) => {
    e.preventDefault();
    if (!teamForm.name.trim()) return;
    setUploading("team");
    const form = new FormData();
    form.append("name", teamForm.name.trim());
    form.append("order", teamForm.order || "0");
    if (file) form.append("file", file);
    await fetch("/api/admin/homepage/teams", { method: "POST", body: form });
    await loadTeams();
    setTeamForm({ name: "", order: "" });
    setUploading(null);
  };

  const updateTeam = async (id: string, name: string, file?: File) => {
    const form = new FormData();
    form.append("name", name);
    if (file) form.append("file", file);
    await fetch(`/api/admin/homepage/teams/${id}`, { method: "PUT", body: form });
    await loadTeams();
    setEditingTeam(null);
  };

  const deleteTeam = async (id: string) => {
    await fetch(`/api/admin/homepage/teams/${id}`, { method: "DELETE" });
    await loadTeams();
  };

  const addSponsor = async (e: React.FormEvent, file?: File) => {
    e.preventDefault();
    if (!sponsorForm.name.trim()) return;
    setUploading("sponsor");
    const form = new FormData();
    form.append("name", sponsorForm.name.trim());
    form.append("websiteUrl", sponsorForm.websiteUrl.trim());
    form.append("order", sponsorForm.order || "0");
    if (file) form.append("file", file);
    await fetch("/api/admin/homepage/sponsors", { method: "POST", body: form });
    await loadSponsors();
    setSponsorForm({ name: "", websiteUrl: "", order: "" });
    setSponsorFormFile(null);
    setUploading(null);
  };

  const updateSponsor = async (id: string, name: string, websiteUrl: string, file?: File) => {
    const form = new FormData();
    form.append("name", name);
    form.append("websiteUrl", websiteUrl);
    if (file) form.append("file", file);
    await fetch(`/api/admin/homepage/sponsors/${id}`, { method: "PUT", body: form });
    await loadSponsors();
    setEditingSponsor(null);
  };

  const deleteSponsor = async (id: string) => {
    await fetch(`/api/admin/homepage/sponsors/${id}`, { method: "DELETE" });
    await loadSponsors();
  };

  if (loading) {
    return (
      <div>
        <h1 className="text-3xl font-semibold text-zinc-900 mb-2">Homepage</h1>
        <p className="text-zinc-600 mb-6 text-base">Loading…</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold text-zinc-900 mb-2">Homepage</h1>
      <p className="text-zinc-600 mb-6 text-base">
        Manage photo gallery, crowd section, VRA Teams, and sponsors. Section images (shared blocks) are in{" "}
        <Link href="/admin/sections" className="underline text-blue-600">Section images</Link>.
      </p>

      <div className="flex gap-1 border border-zinc-200 rounded-lg p-1 mb-6">
        {SUB_TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setSubTab(t.id)}
            className={`px-4 py-2 rounded text-base font-medium ${
              subTab === t.id
                ? "bg-zinc-200 text-zinc-900"
                : "text-zinc-600 hover:bg-zinc-100"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {subTab === "gallery" && (
        <HomepageGalleryAdmin
          items={gallery}
          uploadingKey={uploading}
          onUploadSlot={uploadGalleryToSlot}
          onDeleteSlot={(id) => setConfirmDelete({ type: "gallery", id })}
        />
      )}

      {subTab === "crowd" && (
        <div>
          <h2 className="text-xl font-medium text-zinc-900 mb-2">Image + text section</h2>
          <p className="text-zinc-600 mb-4 text-base">
            One large image with a single line of text underneath on the homepage.
          </p>
          <form onSubmit={saveCrowd} className="space-y-4 max-w-xl">
            <div>
              <label className="block font-medium text-zinc-700 mb-1">Text under the image</label>
              <textarea
                value={crowdForm.description}
                onChange={(e) => setCrowdForm((f) => ({ ...f, description: e.target.value }))}
                rows={3}
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-base"
              />
            </div>
            <div>
              <label className="block font-medium text-zinc-700 mb-1">Image</label>
              {crowd?.imageUrl && (
                <div className="mb-2">
                  <img src={crowd.imageUrl} alt="Crowd" className="max-h-40 rounded object-cover" />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                className="block w-full text-base file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-500 file:text-white"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) uploadCrowdImage(f);
                }}
              />
            </div>
            <button
              type="submit"
              disabled={crowdSaving}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white text-base font-medium disabled:opacity-50"
            >
              {crowdSaving ? "Saving…" : "Save text"}
            </button>
          </form>
        </div>
      )}

      {subTab === "teams" && (
        <div>
          <h2 className="text-xl font-medium text-zinc-900 mb-2">VRA Teams</h2>
          <p className="text-zinc-600 mb-4 text-base">Add teams with name and optional image. Edit or delete below.</p>
          <form onSubmit={(e) => addTeam(e, teamFormFile ?? undefined)} className="flex flex-wrap gap-3 mb-6">
            <input
              type="text"
              placeholder="Team name"
              value={teamForm.name}
              onChange={(e) => setTeamForm((f) => ({ ...f, name: e.target.value }))}
              className="rounded-lg border border-zinc-300 px-3 py-2 text-base w-48"
            />
            <input
              type="number"
              placeholder="Order"
              value={teamForm.order}
              onChange={(e) => setTeamForm((f) => ({ ...f, order: e.target.value }))}
              className="rounded-lg border border-zinc-300 px-3 py-2 text-base w-24"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setTeamFormFile(e.target.files?.[0] ?? null)}
              className="text-base max-w-[180px]"
            />
            <button
              type="submit"
              disabled={!!uploading}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white text-base font-medium disabled:opacity-50"
            >
              Add team
            </button>
          </form>
          <div className="space-y-3">
            {teams.map((team) => (
              <div
                key={team.id}
                className="flex items-center gap-4 rounded-lg border border-zinc-200 bg-white p-4"
              >
                {team.imageUrl && (
                  <img src={team.imageUrl} alt="" className="w-16 h-16 rounded object-cover shrink-0" />
                )}
                {editingTeam === team.id ? (
                  <TeamEditRow
                    team={team}
                    onSave={(name, file) => updateTeam(team.id, name, file)}
                    onCancel={() => setEditingTeam(null)}
                  />
                ) : (
                  <>
                    <span className="font-medium text-zinc-900 flex-1">{team.name}</span>
                    <button
                      type="button"
                      onClick={() => setEditingTeam(team.id)}
                      className="px-3 py-1.5 rounded border border-zinc-300 text-base"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDelete({ type: "team", id: team.id })}
                      className="px-3 py-1.5 rounded border border-red-200 text-red-700 text-base"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {subTab === "sponsors" && (
        <div>
          <h2 className="text-xl font-medium text-zinc-900 mb-2">Our Sponsors</h2>
          <p className="text-zinc-600 mb-4 text-base">Add sponsors with name, optional logo and website.</p>
          <form onSubmit={(e) => addSponsor(e, sponsorFormFile ?? undefined)} className="flex flex-wrap gap-3 mb-6">
            <input
              type="text"
              placeholder="Sponsor name"
              value={sponsorForm.name}
              onChange={(e) => setSponsorForm((f) => ({ ...f, name: e.target.value }))}
              className="rounded-lg border border-zinc-300 px-3 py-2 text-base w-48"
            />
            <input
              type="url"
              placeholder="Website URL"
              value={sponsorForm.websiteUrl}
              onChange={(e) => setSponsorForm((f) => ({ ...f, websiteUrl: e.target.value }))}
              className="rounded-lg border border-zinc-300 px-3 py-2 text-base w-56"
            />
            <input
              type="number"
              placeholder="Order"
              value={sponsorForm.order}
              onChange={(e) => setSponsorForm((f) => ({ ...f, order: e.target.value }))}
              className="rounded-lg border border-zinc-300 px-3 py-2 text-base w-24"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setSponsorFormFile(e.target.files?.[0] ?? null)}
              className="text-base max-w-[180px]"
            />
            <button
              type="submit"
              disabled={!!uploading}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white text-base font-medium disabled:opacity-50"
            >
              Add sponsor
            </button>
          </form>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {sponsors.map((sponsor) => (
              <div
                key={sponsor.id}
                className="rounded-lg border border-zinc-200 bg-white p-4 flex items-center gap-4"
              >
                {sponsor.logoUrl && (
                  <img src={sponsor.logoUrl} alt="" className="w-16 h-16 rounded object-contain shrink-0" />
                )}
                {editingSponsor === sponsor.id ? (
                  <SponsorEditRow
                    sponsor={sponsor}
                    onSave={(name, websiteUrl, file) => updateSponsor(sponsor.id, name, websiteUrl, file)}
                    onCancel={() => setEditingSponsor(null)}
                  />
                ) : (
                  <>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-zinc-900">{sponsor.name}</p>
                      {sponsor.websiteUrl && (
                        <a href={sponsor.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-base truncate block">
                          {sponsor.websiteUrl}
                        </a>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => setEditingSponsor(sponsor.id)}
                      className="px-3 py-1.5 rounded border border-zinc-300 text-base shrink-0"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDelete({ type: "sponsor", id: sponsor.id })}
                      className="px-3 py-1.5 rounded border border-red-200 text-red-700 text-base shrink-0"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {confirmDelete && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-xl bg-white shadow-lg p-6 space-y-4">
            <h2 className="text-lg font-semibold text-zinc-900">
              {confirmDelete.type === "gallery"
                ? "Remove gallery image"
                : confirmDelete.type === "team"
                ? "Remove team"
                : "Remove sponsor"}
            </h2>
            <p className="text-sm text-zinc-600">
              {confirmDelete.type === "gallery" &&
                "This will remove the image from this slot. The homepage will fall back to the default collage image if no CMS image is set."}
              {confirmDelete.type === "team" &&
                "This will remove the team from the admin list. It does not yet change any hardcoded homepage copy."}
              {confirmDelete.type === "sponsor" &&
                "This will remove the sponsor from the admin list."}
            </p>
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 rounded-lg border border-zinc-300 bg-white text-sm font-medium text-zinc-700 hover:bg-zinc-50"
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 rounded-lg bg-red-600 text-sm font-medium text-white hover:bg-red-700"
                onClick={async () => {
                  const payload = confirmDelete;
                  setConfirmDelete(null);
                  if (!payload) return;
                  if (payload.type === "gallery") {
                    await deleteGallerySlot(payload.id);
                  } else if (payload.type === "team") {
                    await deleteTeam(payload.id);
                  } else {
                    await deleteSponsor(payload.id);
                  }
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

function HomepageGalleryAdmin({
  items,
  uploadingKey,
  onUploadSlot,
  onDeleteSlot,
}: {
  items: GalleryItem[];
  uploadingKey: string | null;
  onUploadSlot: (slotIndex: number, file: File, existingId?: string) => Promise<void>;
  onDeleteSlot: (id: string) => Promise<void>;
}) {
  const ordered = [...items].sort((a, b) => a.order - b.order);
  const slots: (GalleryItem | null)[] = new Array(6).fill(null);
  const extras: GalleryItem[] = [];

  ordered.forEach((item) => {
    const idx = item.order ?? 0;
    if (idx >= 0 && idx < slots.length && !slots[idx]) {
      slots[idx] = item;
    } else {
      extras.push(item);
    }
  });

  const renderSlot = (slotIndex: number, heightClass: string) => {
    const item = slots[slotIndex];
    const uploading = uploadingKey === `gallery-${slotIndex}`;
    const inputId = `homepage-gallery-slot-${slotIndex}`;

    return (
      <div className={`relative w-full ${heightClass}`} key={slotIndex}>
        <div className="relative w-full h-full rounded-lg overflow-hidden bg-zinc-100 border border-zinc-200 flex items-center justify-center">
          {item?.imageUrl ? (
            <>
              <Image
                src={item.imageUrl}
                alt={`Homepage gallery image ${slotIndex + 1}`}
                fill
                unoptimized
                sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
                className="object-cover"
              />
              <div className="absolute top-2 right-2 flex gap-2">
                <button
                  type="button"
                  disabled={uploading}
                  onClick={() => document.getElementById(inputId)?.click()}
                  className="px-2 py-1 rounded bg-white/90 text-xs font-medium text-zinc-800 shadow-sm border border-zinc-200"
                >
                  Change
                </button>
                <button
                  type="button"
                  disabled={uploading}
                  onClick={() => onDeleteSlot(item.id)}
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
              onClick={() => document.getElementById(inputId)?.click()}
              className="w-full h-full flex flex-col items-center justify-center gap-1 text-zinc-500 text-sm hover:bg-zinc-200/60 transition-colors"
            >
              <span className="font-medium">Click to upload</span>
              <span className="text-xs text-zinc-400">Slot {slotIndex + 1}</span>
            </button>
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
            if (f) onUploadSlot(slotIndex, f, item?.id);
            e.target.value = "";
          }}
        />
        {uploading && (
          <p className="mt-1 text-xs text-amber-600">
            {item ? "Updating image…" : "Uploading image…"}
          </p>
        )}
      </div>
    );
  };

  return (
    <div>
      <h2 className="text-xl font-medium text-zinc-900 mb-2">Photo gallery</h2>
      <p className="text-zinc-600 mb-4 text-base">
        Same collage layout as the homepage. Each slot maps directly to a tile on the live site.
      </p>
      <section className="relative w-full flex flex-col md:flex-row justify-between gap-4">
        <div className="flex flex-col gap-4 w-full md:w-[400px]">
          {renderSlot(0, "h-[338px]")}
          {renderSlot(1, "h-[462px]")}
        </div>
        <div className="flex flex-col gap-4 w-full md:w-[400px]">
          {renderSlot(2, "h-[528px]")}
          {renderSlot(3, "h-[272px]")}
        </div>
        <div className="flex flex-col gap-4 w-full md:w-[400px]">
          {renderSlot(4, "h-[400px]")}
          {renderSlot(5, "h-[400px]")}
        </div>
      </section>
      {extras.length > 0 && (
        <div className="mt-6">
          <p className="text-sm text-zinc-500 mb-2">
            Extra images (not used in the 6-tile collage):
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {extras.map((item) => (
              <div key={item.id} className="rounded-lg border border-zinc-200 bg-white p-2">
                <div className="relative aspect-video bg-zinc-100 rounded overflow-hidden mb-2">
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt=""
                      fill
                      unoptimized
                      sizes="200px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-400 text-sm">
                      No image
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => onDeleteSlot(item.id)}
                  className="w-full py-1.5 rounded border border-red-200 text-red-700 text-sm hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


function TeamEditRow({
  team,
  onSave,
  onCancel,
}: {
  team: TeamItem;
  onSave: (name: string, file?: File) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(team.name);
  const [file, setFile] = useState<File | null>(null);
  return (
    <>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="rounded border border-zinc-300 px-2 py-1.5 text-base flex-1"
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        className="text-base max-w-[140px]"
      />
      <button type="button" onClick={() => onSave(name, file ?? undefined)} className="px-3 py-1.5 rounded bg-blue-600 text-white text-base">
        Save
      </button>
      <button type="button" onClick={onCancel} className="px-3 py-1.5 rounded border border-zinc-300 text-base">
        Cancel
      </button>
    </>
  );
}

function SponsorEditRow({
  sponsor,
  onSave,
  onCancel,
}: {
  sponsor: SponsorItem;
  onSave: (name: string, websiteUrl: string, file?: File) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(sponsor.name);
  const [websiteUrl, setWebsiteUrl] = useState(sponsor.websiteUrl ?? "");
  const [file, setFile] = useState<File | null>(null);
  return (
    <div className="flex-1 flex flex-wrap items-center gap-2">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
        className="rounded border border-zinc-300 px-2 py-1.5 text-base w-40"
      />
      <input
        type="url"
        value={websiteUrl}
        onChange={(e) => setWebsiteUrl(e.target.value)}
        placeholder="Website"
        className="rounded border border-zinc-300 px-2 py-1.5 text-base w-48"
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        className="text-base max-w-[140px]"
      />
      <button type="button" onClick={() => onSave(name, websiteUrl, file ?? undefined)} className="px-3 py-1.5 rounded bg-blue-600 text-white text-base">
        Save
      </button>
      <button type="button" onClick={onCancel} className="px-3 py-1.5 rounded border border-zinc-300 text-base">
        Cancel
      </button>
    </div>
  );
}
