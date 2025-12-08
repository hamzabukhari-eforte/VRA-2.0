import Image from "next/image";

interface FacilityWithSubtitleProps {
  title: string;
  subtitle: string;
  description: string | string[];
  imageSrc: string;
  imageAlt: string;
  imageLeft?: boolean;
}

export default function FacilityWithSubtitle({
  title,
  subtitle,
  description,
  imageSrc,
  imageAlt,
  imageLeft = false,
}: FacilityWithSubtitleProps) {
  const descriptions = Array.isArray(description) ? description : [description];

  return (
    <section className="w-full">
      <h2 className="text-white text-[48px] font-light mb-8">{title}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {imageLeft ? (
          <>
            <div className="relative w-full h-[400px]">
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                className="rounded-lg object-cover"
              />
            </div>
            <div className="flex flex-col gap-4">
              <h3 className="text-white text-[24px] font-medium">
                {subtitle}
              </h3>
              {descriptions.map((desc, index) => (
                <p
                  key={index}
                  className="text-white/70 text-base font-normal leading-relaxed"
                >
                  {desc}
                </p>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col gap-4">
              <h3 className="text-white text-[24px] font-medium">
                {subtitle}
              </h3>
              {descriptions.map((desc, index) => (
                <p
                  key={index}
                  className="text-white/70 text-base font-normal leading-relaxed"
                >
                  {desc}
                </p>
              ))}
            </div>
            <div className="relative w-full h-[400px]">
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                className="rounded-lg object-cover"
              />
            </div>
          </>
        )}
      </div>
    </section>
  );
}

