import Image from "next/image";

interface ImageTextSectionProps {
  imageLeft?: boolean;
  sectionTitle: string;
  mainHeading: string;
  buttons: string[];
  description: string;
  imageSrc: string;
  imageAlt: string;
}

export default function ImageTextSection({
  imageLeft = false,
  sectionTitle,
  mainHeading,
  buttons,
  description,
  imageSrc,
  imageAlt,
}: ImageTextSectionProps) {
  const imageSection = (
    <div className="relative w-full h-[400px]">
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        className="rounded-lg object-cover object-top"
      />
    </div>
  );

  const textSection = (
    <div className="flex flex-col justify-between h-full gap-6">
      <h3 className="text-foreground dark:text-white text-2xl md:text-3xl font-medium  uppercase tracking-wide">
        {sectionTitle}
      </h3>
      <div className="flex flex-col gap-8">
        <h2 className="text-foreground dark:text-white text-3xl md:text-4xl font-normal ">
          {mainHeading && mainHeading}
        </h2>
        <div className="flex flex-wrap gap-3">
          {buttons.map((button, index) => (
            <button
              key={index}
              className="px-4 py-2 border border-foreground/20 dark:border-white rounded-lg text-foreground dark:text-white text-sm font-normal hover:bg-foreground/10 dark:hover:bg-white/10 transition-colors"
            >
              {button}
            </button>
          ))}
        </div>
        <p className="text-foreground/70 dark:text-white/70 text-sm md:text-base font-normal  leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );

  return (
    <section className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
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

