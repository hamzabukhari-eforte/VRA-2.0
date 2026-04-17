"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type MemberUser = { id: string; name: string; email: string };

export default function HeaderUserMenu() {
  const router = useRouter();
  const [user, setUser] = useState<MemberUser | null | undefined>(undefined);

  const loadUser = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/member/me", { credentials: "include" });
      const data = await res.json().catch(() => ({}));
      setUser(data?.user ?? null);
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    void loadUser();
  }, [loadUser]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/member/logout", {
        method: "POST",
        credentials: "include",
      });
    } finally {
      setUser(null);
      router.refresh();
    }
  };

  if (user === undefined) {
    return (
      <div
        className="h-9 w-9 shrink-0 rounded-full border border-white/20 bg-white/10"
        aria-hidden
      />
    );
  }

  if (!user) {
    return (
      <Link
        href="/login"
        className="px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 bg-linear-to-b from-[#141414] to-black rounded-lg border border-white/10 flex items-center justify-center gap-2.5"
      >
        <span className="text-white text-sm sm:text-base md:text-xl font-normal">
          Login
        </span>
      </Link>
    );
  }

  const displayName = user.name.trim() || user.email;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-2 rounded-lg border border-white/15 bg-white/10 px-2 py-1.5 sm:px-3 sm:py-2 text-white hover:bg-white/15 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          aria-label="Account menu"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/20 ring-1 ring-white/25">
            <User className="h-4 w-4 text-white" aria-hidden />
          </span>
          <span className="hidden sm:inline max-w-[140px] md:max-w-[200px] truncate text-sm md:text-base font-normal">
            {displayName}
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="min-w-40 border-zinc-200 dark:border-gray-600"
      >
        <DropdownMenuItem
          asChild
          className="text-popover-foreground focus:bg-zinc-100 focus:text-zinc-900 data-highlighted:bg-zinc-100 data-highlighted:text-zinc-900 dark:focus:bg-zinc-800 dark:focus:text-zinc-50 dark:data-highlighted:bg-zinc-800 dark:data-highlighted:text-zinc-50"
        >
          <Link href="/profile">Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onSelect={() => void handleLogout()}>
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
