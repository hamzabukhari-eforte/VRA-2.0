"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface CMSImageProps {
  sectionKey: string;
  fallbackSrc: string;
  alt: string;
  fill?: boolean;
  className?: string;
  sizes?: string;
}

/**
 * Renders image from CMS (presigned URL) when available, otherwise fallback.
 * Used by ImageTextSection and other components that support admin-managed images.
 */
export default function CMSImage({
  sectionKey,
  fallbackSrc,
  alt,
  fill = true,
  className = "rounded-lg object-cover object-top",
  sizes,
}: CMSImageProps) {
  const [src, setSrc] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/cms/section/${encodeURIComponent(sectionKey)}`)
      .then(async (r) => {
        // Safely handle non-OK or non-JSON/empty responses
        if (!r.ok) return null;
        const text = await r.text();
        if (!text) return null;
        try {
          return JSON.parse(text);
        } catch {
          return null;
        }
      })
      .then((d) => {
        if (!cancelled && d && typeof d === "object" && "imageUrl" in d && d.imageUrl) {
          setSrc((d as { imageUrl: string }).imageUrl);
        }
      })
      .catch(() => {
        // Ignore fetch/parse errors and fall back to default image
      })
      .finally(() => {
        if (!cancelled) setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, [sectionKey]);

  const resolvedSrc = loaded && src ? src : fallbackSrc;
  const isExternal = resolvedSrc.startsWith("http");

  if (fill) {
    return (
      <div className="relative w-full h-[400px]">
        {isExternal ? (
          <img
            src={resolvedSrc}
            alt={alt}
            className={className}
            style={{ objectFit: "cover", objectPosition: "top", width: "100%", height: "100%" }}
          />
        ) : (
          <Image
            src={resolvedSrc}
            alt={alt}
            fill
            className={className}
            sizes={sizes ?? "50vw"}
          />
        )}
      </div>
    );
  }

  if (isExternal) {
    return (
      <img src={resolvedSrc} alt={alt} className={className} />
    );
  }
  return (
    <Image
      src={resolvedSrc}
      alt={alt}
      width={800}
      height={400}
      className={className}
    />
  );
}
