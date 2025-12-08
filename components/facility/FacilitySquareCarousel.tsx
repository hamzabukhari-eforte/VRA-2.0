"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";

interface CarouselImage {
  src: string;
  alt: string;
}

interface FacilitySquareCarouselProps {
  images: CarouselImage[];
  heading?: string;
}

export default function FacilitySquareCarousel({
  images,
  heading = "Our Facility",
}: FacilitySquareCarouselProps) {
  // Duplicate images multiple times for seamless infinite loop
  const duplicatedImages = [...images, ...images, ...images, ...images];
  const containerRef = useRef<HTMLDivElement>(null);
  const [singleSetWidth, setSingleSetWidth] = useState(0);

  useEffect(() => {
    const calculateWidth = () => {
      if (containerRef.current) {
        // Calculate the width of one complete set of images precisely
        const firstSetEnd = images.length;
        let width = 0;
        
        // Get all child elements
        const children = containerRef.current.children;
        for (let i = 0; i < firstSetEnd; i++) {
          const child = children[i] as HTMLElement;
          if (child) {
            const rect = child.getBoundingClientRect();
            width += rect.width;
            // Add gap (8px on mobile, 16px on desktop) - use computed gap
            if (i < firstSetEnd - 1) {
              const computedStyle = window.getComputedStyle(containerRef.current);
              const gap = computedStyle.gap || (window.innerWidth >= 768 ? '16px' : '8px');
              const gapValue = parseFloat(gap) || (window.innerWidth >= 768 ? 16 : 8);
              width += gapValue;
            }
          }
        }
        
        if (width > 0) {
          setSingleSetWidth(Math.round(width));
        }
      }
    };

    // Calculate after images are loaded
    const timeoutId = setTimeout(calculateWidth, 200);
    
    // Recalculate on window resize
    window.addEventListener('resize', calculateWidth);
    
    // Wait for images to load
    if (containerRef.current) {
      const imgElements = containerRef.current.querySelectorAll('img');
      let loadedCount = 0;
      const totalImages = imgElements.length;
      
      if (totalImages > 0) {
        imgElements.forEach((img) => {
          if (img.complete) {
            loadedCount++;
          } else {
            img.addEventListener('load', () => {
              loadedCount++;
              if (loadedCount === totalImages) {
                calculateWidth();
              }
            });
          }
        });
        
        if (loadedCount === totalImages) {
          calculateWidth();
        }
      }
    }
    
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', calculateWidth);
    };
  }, [images.length]);

  // Fixed square size
  const squareSize = 300; // 300x300px for square images

  return (
    <section className="w-full flex flex-col gap-8 md:gap-12">
      {/* Heading */}
      <h2 className="text-foreground dark:text-white text-3xl text-center">
        {heading}
      </h2>

      {/* Carousel */}
      <div className="w-full overflow-hidden">
        {singleSetWidth > 0 && (
          <style dangerouslySetInnerHTML={{
            __html: `
              @keyframes scroll {
                0% {
                  transform: translateX(0);
                }
                100% {
                  transform: translateX(-${singleSetWidth}px);
                }
              }
              .animate-scroll {
                animation: scroll ${Math.max(singleSetWidth / 30, 30)}s linear infinite;
                display: flex;
                width: fit-content;
                will-change: transform;
                backface-visibility: hidden;
                perspective: 1000px;
              }
              .animate-scroll:hover {
                animation-play-state: paused;
              }
            `
          }} />
        )}
        <div ref={containerRef} className="flex animate-scroll gap-2 md:gap-4">
          {duplicatedImages.map((image, index) => (
            <div
              key={index}
              className="shrink-0"
              style={{ 
                width: `${squareSize}px`,
                height: `${squareSize}px`
              }}
            >
              <div className="relative w-full h-full">
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={squareSize}
                  height={squareSize}
                  className="rounded-lg object-cover w-full h-full"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

