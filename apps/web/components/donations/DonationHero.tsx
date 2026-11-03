import HeroBanner from "@/components/about/HeroBanner";

interface DonationHeroProps {
  imageSrc: string;
  imageAlt: string;
  heading: string;
  tagline: string;
  overlayOpacity?: number;
}

export default function DonationHero({
  imageSrc,
  imageAlt,
  heading,
  tagline,
  overlayOpacity = 40,
}: DonationHeroProps) {
  return (
    <div className="relative w-full">
      <HeroBanner
        imageSrc={imageSrc}
        imageAlt={imageAlt}
        heading={heading}
        overlayOpacity={overlayOpacity}
        showWhatsApp={false}
      />

      {/* Tagline - Bottom Right, hidden on mobile and tablet */}
      <div className="hidden lg:block absolute right-6 xl:right-28 bottom-12 lg:bottom-16 xl:bottom-20">
        <p className="text-white text-xl sm:text-2xl font-light">
          {tagline}
        </p>
      </div>
    </div>
  );
}

