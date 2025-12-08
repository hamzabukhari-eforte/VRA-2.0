import Image from "next/image";

interface FacilityImage {
  src: string;
  alt: string;
}

interface FacilityGridProps {
  title?: string;
  images?: FacilityImage[];
}

export default function FacilityGrid({
  title = "Our facility",
  images = [
    { src: "/assets/497-4479.webp", alt: "Facility 1" },
    { src: "/assets/497-4480.webp", alt: "Facility 2" },
  ],
}: FacilityGridProps) {
  return (
    <section className="w-full">
      <h2 className="text-foreground dark:text-white text-3xl md:text-4xl lg:text-[48px] font-light mb-6 md:mb-8">
        {title}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {images.map((image, index) => (
          <div key={index} className="relative w-full h-[300px] md:h-[400px]">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="rounded-lg object-cover"
            />
          </div>
        ))}
      </div>
    </section>
  );
}

