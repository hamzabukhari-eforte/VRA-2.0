"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Image,
  Home,
  Users,
  Building2,
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
  { href: "/admin/facility", label: "Facility", icon: Building2 },
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
    <aside className="fixed left-0 top-0 z-20 flex h-full w-56 flex-col border-r border-zinc-200 bg-white">
      <div className="flex h-16 items-center border-b border-zinc-200 px-4">
        <Link
          href="/admin"
          className="text-xl font-semibold tracking-tight text-zinc-900"
        >
          VRA Admin
        </Link>
      </div>
      <nav className="flex-1 space-y-0.5 overflow-y-auto p-2">
        {nav.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium transition-colors ${
                isActive
                  ? "bg-zinc-200 text-zinc-900"
                  : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
              }`}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-zinc-200 p-2">
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
        >
          <ExternalLink className="h-5 w-5 shrink-0" />
          View site
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-base font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          Log out
        </button>
      </div>
    </aside>
  );
}
