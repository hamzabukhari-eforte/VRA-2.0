"use client";

import { useState, useEffect } from "react";

type SubmissionType = "contact" | "membership" | "termination" | "donation" | "net-booking";

const TYPES: { value: SubmissionType; label: string }[] = [
  { value: "contact", label: "Contact" },
  { value: "membership", label: "Membership" },
  { value: "termination", label: "Membership termination" },
  { value: "donation", label: "Donation" },
  { value: "net-booking", label: "Indoor net booking" },
];

interface SubmissionRow {
  id: string;
  payload: Record<string, unknown>;
  createdAt: string;
}

function flattenPayload(p: Record<string, unknown>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(p)) {
    if (v === null || v === undefined) out[k] = "";
    else if (typeof v === "object") out[k] = JSON.stringify(v);
    else out[k] = String(v);
  }
  return out;
}

function toCSV(items: SubmissionRow[]): string {
  if (items.length === 0) return "";
  const allKeys = new Set<string>();
  items.forEach((i) => Object.keys(flattenPayload(i.payload)).forEach((k) => allKeys.add(k)));
  const keys = ["id", "createdAt", ...Array.from(allKeys)];
  const rows = items.map((row) => {
    const flat = flattenPayload(row.payload);
    return keys.map((k) => (k === "id" ? row.id : k === "createdAt" ? row.createdAt : flat[k] ?? "")).map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",");
  });
  return [keys.join(","), ...rows].join("\n");
}

export default function AdminSubmissionsPage() {
  const [type, setType] = useState<SubmissionType>("contact");
  const [data, setData] = useState<{ items: SubmissionRow[]; total: number; page: number; totalPages: number } | null>(null);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("type", type);
    params.set("page", "1");
    params.set("limit", "20");
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    fetch(`/api/admin/submissions?${params}`)
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData(null));
  }, [type, from, to]);

  const loadPage = (page: number) => {
    const params = new URLSearchParams();
    params.set("type", type);
    params.set("page", String(page));
    params.set("limit", "20");
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    fetch(`/api/admin/submissions?${params}`)
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData(null));
  };

  const exportCSV = () => {
    if (!data?.items.length) return;
    const csv = toCSV(data.items);
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `submissions-${type}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const items = data?.items ?? [];
  const payloadKeys = items.length ? Object.keys(flattenPayload(items[0].payload)) : [];

  return (
    <div>
      <h1 className="text-3xl font-semibold text-zinc-900 mb-2">
        Form submissions
      </h1>
      <p className="text-zinc-600 mb-6 text-base">
        Read-only list. Filter by date and export to CSV.
      </p>

      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="flex gap-1 border border-zinc-200 rounded-lg p-1">
          {TYPES.map((t) => (
            <button
              key={t.value}
              onClick={() => setType(t.value)}
              className={`px-3 py-2 rounded text-base font-medium ${
                type === t.value
                  ? "bg-zinc-200 text-zinc-900"
                  : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="rounded border border-zinc-300 bg-white px-2 py-1.5 text-base"
          />
          <span className="text-zinc-500">–</span>
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="rounded border border-zinc-300 bg-white px-2 py-1.5 text-base"
          />
        </div>
        <button
          onClick={exportCSV}
          disabled={!items.length}
          className="px-4 py-2 rounded-lg bg-zinc-200 text-zinc-900 text-base font-medium disabled:opacity-50"
        >
          Export CSV
        </button>
      </div>

      <div className="rounded-lg border border-zinc-200 bg-white overflow-x-auto">
        {items.length === 0 ? (
          <p className="p-8 text-center text-zinc-500 text-base">No submissions.</p>
        ) : (
          <table className="w-full text-base">
            <thead>
              <tr className="border-b border-zinc-200">
                <th className="text-left p-3 font-medium text-zinc-900">Date</th>
                {payloadKeys.map((k) => (
                  <th key={k} className="text-left p-3 font-medium text-zinc-900 capitalize">
                    {k.replace(/([A-Z])/g, " $1").trim()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((row) => {
                const flat = flattenPayload(row.payload);
                return (
                  <tr key={row.id} className="border-b border-zinc-100">
                    <td className="p-3 text-zinc-600 whitespace-nowrap">
                      {new Date(row.createdAt).toLocaleString()}
                    </td>
                    {payloadKeys.map((k) => (
                      <td key={k} className="p-3 text-zinc-900 max-w-xs truncate">
                        {flat[k] ?? "—"}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-base text-zinc-500">
            Page {data.page} of {data.totalPages} ({data.total} total)
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => loadPage(data.page - 1)}
              disabled={data.page <= 1}
              className="px-3 py-2 rounded border border-zinc-300 disabled:opacity-50 text-base"
            >
              Previous
            </button>
            <button
              onClick={() => loadPage(data.page + 1)}
              disabled={data.page >= data.totalPages}
              className="px-3 py-2 rounded border border-zinc-300 disabled:opacity-50 text-base"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
