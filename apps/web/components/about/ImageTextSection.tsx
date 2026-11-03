"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type CmsSectionPayload = {
  imageUrl: string | null;
  sectionTitle: string | null;
  mainHeading: string | null;
  description: string | null;
  tags: unknown;
};

function parseCmsTags(value: unknown): string[] | null {
  if (value == null) return null;
  if (!Array.isArray(value)) return null;
  if (!value.every((x) => typeof x === "string")) return null;
  return value;
}

interface ImageTextSectionProps {
  imageLeft?: boolean;
  sectionTitle: string;
  mainHeading: string;
  buttons: string[];
  description: string;
  imageSrc: string;
  imageAlt: string;
  /** When set, image and optional text load from CMS (admin); fallbacks below apply when a field is unset in CMS. */
  sectionKey?: string;
}

export default function ImageTextSection({
  imageLeft = false,
  sectionTitle,
  mainHeading,
  buttons,
  description,
  imageSrc,
  imageAlt,
  sectionKey,
}: ImageTextSectionProps) {
  const [cms, setCms] = useState<CmsSectionPayload | null>(null);
  const [loaded, setLoaded] = useState(!sectionKey);

  useEffect(() => {
    if (!sectionKey) return;

    let cancelled = false;
    setLoaded(false);

    fetch(`/api/cms/section/${encodeURIComponent(sectionKey)}`)
      .then(async (r) => {
        if (!r.ok) return null;
        const text = await r.text();
        if (!text) return null;
        try {
          return JSON.parse(text) as CmsSectionPayload;
        } catch {
          return null;
        }
      })
      .then((d) => {
        if (!cancelled && d && typeof d === "object") setCms(d);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoaded(true);
      });

    return () => {
      cancelled = true;
    };
  }, [sectionKey]);

  const resolvedSectionTitle =
    cms?.sectionTitle != null ? cms.sectionTitle : sectionTitle;
  const resolvedMainHeading =
    cms?.mainHeading != null ? cms.mainHeading : mainHeading;
  const resolvedDescription =
    cms?.description != null ? cms.description : description;
  const parsedTags = parseCmsTags(cms?.tags);
  const resolvedTags = parsedTags !== null ? parsedTags : buttons;

  const resolvedSrc =
    sectionKey && loaded && cms?.imageUrl ? cms.imageUrl : imageSrc;
  const isExternal = resolvedSrc.startsWith("http");

  const imageSection = (
    <div className="relative w-full h-[400px]">
      {isExternal ? (
        <img
          src={resolvedSrc}
          alt={imageAlt}
          className="rounded-lg object-cover object-top"
          style={{
            objectFit: "cover",
            objectPosition: "top",
            width: "100%",
            height: "100%",
          }}
        />
      ) : (
        <Image
          src={resolvedSrc}
          alt={imageAlt}
          fill
          className="rounded-lg object-cover object-top"
          sizes="50vw"
        />
      )}
    </div>
  );

  const textSection = (
    <div className="flex flex-col justify-between h-full gap-6">
      <h3 className="text-foreground dark:text-white text-2xl md:text-3xl font-medium  uppercase tracking-wide">
        {resolvedSectionTitle}
      </h3>
      <div className="flex flex-col gap-8">
        <h2 className="text-foreground dark:text-white text-3xl md:text-4xl font-normal ">
          {resolvedMainHeading && resolvedMainHeading}
        </h2>
        <div className="flex flex-wrap gap-3">
          {resolvedTags.map((button, index) => (
            <button
              key={index}
              className="px-4 py-2 border border-foreground/20 dark:border-white rounded-lg text-foreground dark:text-white text-sm font-normal hover:bg-foreground/10 dark:hover:bg-white/10 transition-colors"
            >
              {button}
            </button>
          ))}
        </div>
        <p className="text-foreground/70 dark:text-white/70 text-sm md:text-base font-normal  leading-relaxed">
          {resolvedDescription}
        </p>
      </div>
    </div>
  );

  return (
    <section className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
      {imageLeft ? (
        <>
          {imageSection}
          {textSection}
        </>
      ) : (
        <>
          {textSection}
          {imageSection}
        </>
      )}
    </section>
  );
}
