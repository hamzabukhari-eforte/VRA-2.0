"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Image,
  Home,
  Users,
  Trophy,
  FileText,
  ExternalLink,
  LogOut,
} from "lucide-react";

const nav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/sections", label: "Section images", icon: Image },
  { href: "/admin/homepage", label: "Homepage", icon: Home },
  { href: "/admin/about", label: "About", icon: Users },
  { href: "/admin/vra-cricket", label: "VRA Cricket", icon: Trophy },
  { href: "/admin/submissions", label: "Submissions", icon: FileText },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <aside className="fixed left-0 top-0 z-20 flex h-full w-60 flex-col border-r border-zinc-200 bg-gradient-to-b from-white to-zinc-50">
      <div className="flex h-16 items-center border-b border-zinc-200 px-5">
        <Link href="/admin" className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-900 text-sm font-semibold text-white">
            V
          </span>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold tracking-tight text-zinc-900">
              VRA Admin
            </span>
            <span className="text-xs text-zinc-500">Content & forms</span>
          </div>
        </Link>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        <div className="space-y-1">
          <p className="px-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
            Content
          </p>
          {nav.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-zinc-900 text-white shadow-sm"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                }`}
              >
                <Icon
                  className={`h-4 w-4 shrink-0 ${
                    isActive ? "text-white" : "text-zinc-500 group-hover:text-zinc-700"
                  }`}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
        <div className="space-y-1">
          <p className="px-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
            Data
          </p>
          {nav
            .slice(5)
            .map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-zinc-900 text-white shadow-sm"
                      : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 shrink-0 ${
                      isActive ? "text-white" : "text-zinc-500 group-hover:text-zinc-700"
                    }`}
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
        </div>
      </nav>
      <div className="border-t border-zinc-200 px-3 py-3 space-y-2">
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
        >
          <ExternalLink className="h-4 w-4 shrink-0" />
          <span>View site</span>
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
}
