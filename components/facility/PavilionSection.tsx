import Image from "next/image";

interface PavilionSectionProps {
  title: string;
  subtitle: string;
  buttons: string[];
  description: string;
  imageSrc: string;
  imageAlt: string;
}

export default function PavilionSection({
  title,
  subtitle,
  buttons,
  description,
  imageSrc,
  imageAlt,
}: PavilionSectionProps) {
  return (
    <section className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
      {/* Left column: Title at top, content at bottom */}
      <div className="flex flex-col justify-between h-full min-h-[600px] gap-6">
        {/* Title at the top */}
        <h2 className="text-foreground dark:text-white text-3xl md:text-4xl lg:text-5xl font-normal">
          {title}
        </h2>

        {/* Content at the bottom */}
        <div className="flex flex-col gap-6">
          {/* Subtitle */}
          <h3 className="text-foreground dark:text-white text-3xl md:text-4xl lg:text-5xl font-normal">
            {subtitle}
          </h3>
          
          {/* Buttons */}
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
          
          {/* Description */}
          <p className="text-foreground/70 dark:text-white/70 text-sm md:text-base font-normal leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      {/* Right column: Larger image */}
      <div className="relative w-full h-[400px] md:h-[600px]">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="rounded-lg object-cover object-top"
        />
      </div>
    </section>
  );
}

