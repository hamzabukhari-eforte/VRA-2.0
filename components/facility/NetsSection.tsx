import Image from "next/image";

interface NetsSectionProps {
  headingLeft: boolean;
  heading: string;
  buttons: string[];
  description: string;
  imageSrc: string;
  imageAlt: string;
}

export default function NetsSection({
  headingLeft,
  heading,
  buttons,
  description,
  imageSrc,
  imageAlt,
}: NetsSectionProps) {
  const headingSection = (isRightAligned: boolean = false) => (
    <div className={`flex flex-col ${isRightAligned ? 'md:text-right' : ''}`}>
      <h2 className="text-foreground dark:text-white text-3xl md:text-4xl lg:text-5xl font-normal">
        {heading}
      </h2>
    </div>
  );

  const detailsSection = (
    <div className="flex flex-col gap-6">
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
      <p className="text-foreground/70 dark:text-white/70 text-sm md:text-base font-normal leading-relaxed">
        {description}
      </p>
    </div>
  );

  return (
    <section className="w-full flex flex-col gap-8 md:gap-12">
      {/* Image row: Image (2 cols) + Empty (1 col) */}
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
        {headingLeft ? (
          <>
            {/* Image spans 2 columns */}
            <div className="relative w-full h-[400px] md:h-[500px] md:col-span-2">
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                className="rounded-lg object-cover object-top"
              />
            </div>
            {/* Empty column - 1 column */}
            <div className="hidden md:block md:col-span-1"></div>
          </>
        ) : (
          <>
            {/* Empty column - 1 column */}
            <div className="hidden md:block md:col-span-1"></div>
            {/* Image spans 2 columns */}
            <div className="relative w-full h-[400px] md:h-[500px] md:col-span-2">
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                className="rounded-lg object-cover object-top"
              />
            </div>
          </>
        )}
      </div>

      {/* Text row: Heading (2 cols) + Details (1 col) */}
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 items-start">
        {headingLeft ? (
          <>
            {/* Heading spans 2 columns */}
            <div className="md:col-span-2">
              {headingSection(false)}
            </div>
            {/* Details in 1 column */}
            <div className="md:col-span-1">
              {detailsSection}
            </div>
          </>
        ) : (
          <>
            {/* Details in 1 column */}
            <div className="md:col-span-1">
              {detailsSection}
            </div>
            {/* Heading spans 2 columns - rightmost */}
            <div className="md:col-span-2">
              {headingSection(true)}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

