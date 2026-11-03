import Image from "next/image";

interface FacilitySectionProps {
  title: string;
  textLeft?: boolean;
  subtitle?: string;
  description: string;
  mainImageSrc?: string;
  mainImageAlt?: string;
  secondaryImages?: Array<{
    src: string;
    alt: string;
    height?: string;
  }>;
  fullWidthImage?: {
    src: string;
    alt: string;
    height?: string;
  };
}

export default function FacilitySection({
  title,
  textLeft = false,
  subtitle,
  description,
  mainImageSrc,
  mainImageAlt,
  secondaryImages,
  fullWidthImage,
}: FacilitySectionProps) {
  return (
    <section className="w-full">
      <h2 className="text-white text-[48px] font-light mb-8">{title}</h2>

      {/* Main content row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {textLeft ? (
          <>
            <div className="flex flex-col gap-4">
              {subtitle && (
                <h3 className="text-white text-[24px] font-medium">
                  {subtitle}
                </h3>
              )}
              <p className="text-white/70 text-base font-normal leading-relaxed">
                {description}
              </p>
            </div>
            {mainImageSrc && (
              <div className="relative w-full h-[300px]">
                <Image
                  src={mainImageSrc}
                  alt={mainImageAlt || title}
                  fill
                  className="rounded-lg object-cover"
                />
              </div>
            )}
          </>
        ) : (
          <>
            {mainImageSrc && (
              <div className="relative w-full h-[300px]">
                <Image
                  src={mainImageSrc}
                  alt={mainImageAlt || title}
                  fill
                  className="rounded-lg object-cover"
                />
              </div>
            )}
            <div className="flex flex-col gap-4">
              {subtitle && (
                <h3 className="text-white text-[24px] font-medium">
                  {subtitle}
                </h3>
              )}
              <p className="text-white/70 text-base font-normal leading-relaxed">
                {description}
              </p>
            </div>
          </>
        )}
      </div>

      {/* Secondary images grid */}
      {secondaryImages && secondaryImages.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {secondaryImages.map((image, index) => (
            <div
              key={index}
              className={`relative w-full ${image.height || "h-[250px]"}`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="rounded-lg object-cover"
              />
            </div>
          ))}
        </div>
      )}

      {/* Full width image */}
      {fullWidthImage && (
        <div
          className={`relative w-full ${fullWidthImage.height || "h-[250px]"}`}
        >
          <Image
            src={fullWidthImage.src}
            alt={fullWidthImage.alt}
            fill
            className="rounded-lg object-cover"
          />
        </div>
      )}
    </section>
  );
}

