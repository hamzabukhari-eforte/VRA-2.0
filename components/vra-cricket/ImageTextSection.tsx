import Image from "next/image";

interface ImageTextSectionProps {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  iconSrc?: string;
  tags?: string[];
  imageLeft?: boolean;
}

export default function ImageTextSection({
  title,
  description,
  imageSrc,
  imageAlt,
  iconSrc,
  tags,
  imageLeft = false,
}: ImageTextSectionProps) {
  const imageSection = (
    <div className="relative w-full h-[300px] md:h-[400px]">
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        className="rounded-lg object-cover"
      />
    </div>
  );

  const textSection = (
    <div className="flex flex-col gap-4 md:gap-6">
      <h2 className="text-foreground dark:text-white text-2xl md:text-3xl lg:text-[32px] font-medium">
        {title}
      </h2>
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-2 md:gap-3">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="px-3 md:px-4 py-1.5 md:py-2 rounded-md border border-foreground/20 dark:border-white/20 text-foreground dark:text-white text-sm md:text-base font-normal"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      <p className="text-foreground/70 dark:text-white/70 text-sm md:text-base font-normal leading-relaxed">
        {description}
      </p>
      {iconSrc && !tags && (
        <Image
          src={iconSrc}
          alt="Icon"
          width={64}
          height={64}
          className="w-12 h-12 md:w-16 md:h-16"
        />
      )}
    </div>
  );

  return (
    <section className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
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

