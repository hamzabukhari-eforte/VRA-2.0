import Image from "next/image";

interface HeroBannerProps {
  imageSrc: string;
  imageAlt: string;
  heading: string;
  overlayOpacity?: number;
  showWhatsApp?: boolean;
  whatsAppIconSrc?: string;
}

export default function HeroBanner({
  imageSrc,
  imageAlt,
  heading,
  overlayOpacity = 40,
  showWhatsApp = false,
  whatsAppIconSrc = "/assets/542-28735.svg",
}: HeroBannerProps) {
  return (
    <section className="relative h-screen w-full">
      <Image
        src={imageSrc}
        alt={imageAlt}
        width={1000}
        height={1000}
        className="w-full h-screen object-cover object-top"
      />

      {/* Black Overlay */}
      <div
        className="absolute inset-0 bg-black"
        style={{ opacity: overlayOpacity / 100 }}
      />

      {/* Hero Content Overlay */}
      <div className="absolute inset-0 flex items-end justify-start px-6 sm:px-12 md:px-16 lg:px-[108px] pb-8 md:pb-12">
        <h1 className="text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-9xl font-light">
          {heading}
        </h1>
      </div>
    </section>
  );
}
