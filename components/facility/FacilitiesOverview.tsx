import Image from "next/image";

interface FacilitiesOverviewProps {
  imageSrc: string;
  imageAlt: string;
  description: string;
}

export default function FacilitiesOverview({
  imageSrc,
  imageAlt,
  description,
}: FacilitiesOverviewProps) {
  return (
    <section className="w-full">
      <div className="relative w-full h-[400px] mb-8">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="rounded-lg object-cover"
        />
      </div>

      <div className="text-center max-w-[800px] mx-auto">
        <p className="text-white/70 text-lg font-normal leading-relaxed">
          {description}
        </p>
      </div>
    </section>
  );
}

