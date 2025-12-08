import Image from "next/image";

interface FacilityWithTextImageProps {
  title: string;
  textLeft?: boolean;
  description: string;
  mainImageSrc: string;
  mainImageAlt: string;
  secondaryImageSrc?: string;
  secondaryImageAlt?: string;
}

export default function FacilityWithTextImage({
  title,
  textLeft = false,
  description,
  mainImageSrc,
  mainImageAlt,
  secondaryImageSrc,
  secondaryImageAlt,
}: FacilityWithTextImageProps) {
  return (
    <section className="w-full">
      <h2 className="text-white text-[48px] font-light mb-8">{title}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {textLeft ? (
          <>
            <div className="relative w-full h-[300px]">
              <Image
                src={mainImageSrc}
                alt={mainImageAlt}
                fill
                className="rounded-lg object-cover"
              />
            </div>
            <div className="flex flex-col gap-4">
              <p className="text-white/70 text-base font-normal leading-relaxed">
                {description}
              </p>
              {secondaryImageSrc && (
                <div className="relative w-full h-[200px]">
                  <Image
                    src={secondaryImageSrc}
                    alt={secondaryImageAlt || mainImageAlt}
                    fill
                    className="rounded-lg object-cover"
                  />
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col gap-4">
              <p className="text-white/70 text-base font-normal leading-relaxed">
                {description}
              </p>
              {secondaryImageSrc && (
                <div className="relative w-full h-[200px]">
                  <Image
                    src={secondaryImageSrc}
                    alt={secondaryImageAlt || mainImageAlt}
                    fill
                    className="rounded-lg object-cover"
                  />
                </div>
              )}
            </div>
            <div className="relative w-full h-[300px]">
              <Image
                src={mainImageSrc}
                alt={mainImageAlt}
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

