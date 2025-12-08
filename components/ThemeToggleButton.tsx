"use client";

import { useTheme } from "@/contexts/ThemeContext";
import Image from "next/image";

export default function ThemeToggleButton() {
  const { toggleTheme, mounted, theme } = useTheme();
  return (
    <button
      onClick={() => toggleTheme?.()}
      disabled={!toggleTheme}
      className="w-[41px] h-[41px] relative cursor-pointer hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Image
        src="/assets/I350-1077;45-164.svg"
        alt="Sun"
        width={41}
        height={41}
        className={`w-full h-full absolute inset-0 transition-opacity duration-300 ${
          !mounted || theme === "dark" ? "opacity-100" : "opacity-0"
        }`}
      />

      <Image
        src="/assets/moon.svg"
        alt="Moon"
        width={41}
        height={41}
        className={`w-full h-full absolute inset-0 transition-opacity duration-300 ${
          mounted && theme === "light" ? "opacity-100" : "opacity-0"
        }`}
      />
    </button>
  );
}
