"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface BoardMember {
  imageSrc: string;
  alt: string;
  height?: string;
}

const DEFAULT_BOARD_MEMBERS: BoardMember[] = [
  {
    imageSrc: "/assets/350-1420.webp",
    alt: "Board member",
  },
  {
    imageSrc: "/assets/350-1432.webp",
    alt: "Board member",
  },
  {
    imageSrc: "/assets/350-1431.webp",
    alt: "Board member",
    height: "h-[360px]",
  },
  {
    imageSrc: "/assets/350-1470.webp",
    alt: "Board member",
    height: "h-[200px]",
  },
  {
    imageSrc: "/assets/350-1468.webp",
    alt: "Board member",
  },
  {
    imageSrc: "/assets/350-1709.webp",
    alt: "Board member",
  },
];

export default function OurBoard() {
  const [members, setMembers] = useState<BoardMember[]>(DEFAULT_BOARD_MEMBERS);

  useEffect(() => {
    fetch("/api/about/board")
      .then((r) => r.json())
      .then((data) => {
        const images: unknown = data?.images;
        if (!Array.isArray(images)) return;
        setMembers(
          DEFAULT_BOARD_MEMBERS.map((member, index) => {
            const url = images[index];
            return typeof url === "string" && url
              ? { ...member, imageSrc: url }
              : member;
          }),
        );
      })
      .catch(() => {
        // keep defaults on error
      });
  }, []);

  return (
    <section className="w-full flex flex-col items-center gap-12">
      <h2 className="text-foreground dark:text-white text-[32px] font-medium">
        Our Board
      </h2>

      <div className="columns-1 sm:columns-2 md:columns-3 gap-2 md:gap-2 w-full max-w-[900px]">
        {members.map((member, index) => (
          <div key={index} className="p-2 break-inside-avoid mb-2">
            <div
              className={`relative w-full ${member.height || "h-[280px]"}`}
            >
              <Image
                src={member.imageSrc}
                alt={member.alt}
                fill
                unoptimized
                className="rounded-lg object-cover"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

