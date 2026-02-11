"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/sections", label: "Section images" },
  { href: "/admin/homepage", label: "Homepage" },
  { href: "/admin/about", label: "About" },
  { href: "/admin/vra-cricket", label: "VRA Cricket" },
  { href: "/admin/submissions", label: "Submissions" },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <Link
            href="/admin"
            className="text-lg font-semibold text-zinc-900"
          >
            VRA Admin
          </Link>
          <nav className="flex items-center gap-1">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? "bg-zinc-200 text-zinc-900"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-zinc-500 hover:text-zinc-900"
          >
            View site →
          </Link>
        </div>
      </div>
    </header>
  );
}
