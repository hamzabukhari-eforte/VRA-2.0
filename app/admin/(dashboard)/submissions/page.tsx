"use client";

import { useState, useEffect } from "react";
import { Filter, Search, Download, Inbox } from "lucide-react";

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
  const [query, setQuery] = useState("");
  const [pageSize, setPageSize] = useState(25);

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("type", type);
    params.set("page", "1");
    params.set("limit", String(pageSize));
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    fetch(`/api/admin/submissions?${params}`)
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData(null));
  }, [type, from, to, pageSize]);

  const loadPage = (page: number) => {
    if (!data) return;
    const safePage = Math.max(1, Math.min(page, data.totalPages));
    const params = new URLSearchParams();
    params.set("type", type);
    params.set("page", String(safePage));
    params.set("limit", String(pageSize));
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

  const filteredItems = query.trim()
    ? items.filter((row) => {
        const flat = flattenPayload(row.payload);
        const haystack =
          `${row.id} ${row.createdAt} ${Object.values(flat).join(" ")}`.toLowerCase();
        return haystack.includes(query.toLowerCase());
      })
    : items;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-zinc-900 mb-2">Form submissions</h1>
        <p className="text-zinc-600 text-base">
          Read-only list of all site forms. Filter by type, date, and search within results,
          then export to CSV.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-2">
        <div className="flex gap-1 border border-zinc-200 rounded-full p-1 bg-white shadow-sm">
          {TYPES.map((t) => (
            <button
              key={t.value}
              onClick={() => setType(t.value)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                type === t.value
                  ? "bg-zinc-900 text-white shadow-sm"
                  : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 bg-white rounded-xl border border-zinc-200 px-3 py-2 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-2 text-xs font-medium text-zinc-600">
              <Filter className="h-4 w-4 text-zinc-400" />
              Date
            </span>
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="rounded-lg border border-zinc-300 bg-white px-2 py-1 text-xs"
            />
            <span className="text-zinc-400 text-xs">–</span>
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="rounded-lg border border-zinc-300 bg-white px-2 py-1 text-xs"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white rounded-xl border border-zinc-200 px-3 py-2 shadow-sm flex-1 min-w-[200px]">
          <Search className="h-4 w-4 text-zinc-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search within results…"
            className="w-full border-0 bg-transparent text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-0"
          />
        </div>

        <button
          onClick={exportCSV}
          disabled={!items.length}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 text-white text-sm font-medium disabled:opacity-40 shadow-sm"
        >
          <Download className="h-4 w-4" />
          <span>Export CSV</span>
        </button>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm overflow-x-auto">
        {filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-10">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100">
              <Inbox className="h-5 w-5 text-zinc-400" />
            </div>
            <p className="text-sm font-medium text-zinc-700">
              {items.length === 0
                ? "No submissions for this form yet."
                : "No submissions match the current filters."}
            </p>
            <p className="text-xs text-zinc-500">
              Try adjusting the date range or clearing the search.
            </p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50/60">
                <th className="text-left px-4 py-3 font-medium text-zinc-900">
                  Date
                </th>
                {payloadKeys.map((k) => (
                  <th
                    key={k}
                    className="text-left px-4 py-3 font-medium text-zinc-900 capitalize"
                  >
                    {k.replace(/([A-Z])/g, " $1").trim()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((row, idx) => {
                const flat = flattenPayload(row.payload);
                const isOdd = idx % 2 === 1;
                return (
                  <tr
                    key={row.id}
                    className={`border-b border-zinc-100 ${
                      isOdd ? "bg-zinc-50/40" : "bg-white"
                    }`}
                  >
                    <td className="px-4 py-3 text-zinc-600 whitespace-nowrap align-top">
                      {new Date(row.createdAt).toLocaleString()}
                    </td>
                    {payloadKeys.map((k) => (
                      <td
                        key={k}
                        className="px-4 py-3 text-zinc-900 align-top max-w-xs"
                      >
                        <span className="block truncate">{flat[k] ?? "—"}</span>
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
        <div className="flex items-center justify-between mt-2 gap-4 flex-wrap">
          <p className="text-sm text-zinc-500">
            Page {data.page} of {data.totalPages} · {data.total} total submissions
          </p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <span>Rows per page</span>
              <div className="inline-flex gap-1 rounded-full border border-zinc-200 bg-white px-1 py-0.5">
                {[10, 25, 50, 100].map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setPageSize(size)}
                    className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${
                      pageSize === size
                        ? "bg-zinc-900 text-white"
                        : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => loadPage((data?.page ?? 1) - 1)}
                disabled={!data || data.page <= 1}
                className="px-3 py-1.5 rounded-full border border-zinc-300 bg-white text-sm text-zinc-700 disabled:opacity-40"
              >
                Previous
              </button>
              <button
                onClick={() => loadPage((data?.page ?? 1) + 1)}
                disabled={!data || data.page >= data.totalPages}
                className="px-3 py-1.5 rounded-full border border-zinc-300 bg-white text-sm text-zinc-700 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
