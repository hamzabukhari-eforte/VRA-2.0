"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloatingButton from "@/components/WhatsAppFloatingButton";

export default function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  // Admin panel is always light mode
  useEffect(() => {
    if (!isAdmin) return;
    const root = document.documentElement;
    root.classList.remove("dark");
    return () => {
      const stored = localStorage.getItem("theme");
      if (stored === "dark") root.classList.add("dark");
      else root.classList.remove("dark");
    };
  }, [isAdmin]);

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <div className="bg-background text-foreground">
      <Header />
      {children}
      <Footer />
      <WhatsAppFloatingButton />
    </div>
  );
}

