"use client";

import { useState } from "react";
import HomePageHeroSectionMask from "./HomePageHeroSectionMask";

export default function MenuButton() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [heroMaskReplayId, setHeroMaskReplayId] = useState(0);

  return (
    <>
      <HomePageHeroSectionMask
        replayId={heroMaskReplayId}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
      />

      <button
        onClick={() => {
          setHeroMaskReplayId((id) => id + 1);
          setIsMenuOpen(true);
        }}
        className="w-[42px] h-[42px] relative hover:opacity-80 transition-opacity"
      >
        <div className="w-[42px] h-[42px] rounded-full border border-white" />

        <div className="absolute left-[18px] top-[8.5px] flex flex-col gap-[2.43px]">
          <div className="w-[6.38px] h-[6.38px] bg-white rounded-full" />
          <div className="w-[6.38px] h-[6.38px] bg-white rounded-full" />
          <div className="w-[6.38px] h-[6.38px] bg-white rounded-full" />
        </div>
      </button>
    </>
  );
}
