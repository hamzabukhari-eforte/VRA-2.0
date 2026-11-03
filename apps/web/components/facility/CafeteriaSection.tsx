import Image from "next/image";

interface CafeteriaSectionProps {
  title: string;
  subtitle: string;
  buttons: string[];
  description: string;
  imageSrc: string;
  imageAlt: string;
}

export default function CafeteriaSection({
  title,
  subtitle,
  buttons,
  description,
  imageSrc,
  imageAlt,
}: CafeteriaSectionProps) {
  return (
    <section className="w-full flex flex-col gap-8 md:gap-12">
      {/* Top row: Title on left, Image on right */}
      <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 items-start">
        {/* Title on the left */}
        <h2 className="text-foreground dark:text-white text-3xl md:text-4xl lg:text-5xl font-normal">
          {title}
        </h2>

        {/* Image on the right */}
        <div className="relative w-full h-[400px] md:h-[600px] md:col-start-2 md:col-span-2">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className="rounded-lg object-cover object-top"
          />
        </div>
      </div>

      {/* Content below image - centered */}
      <div className="w-full flex flex-col items-center gap-6">
        {/* Subtitle */}
        <h3 className="text-foreground dark:text-white text-3xl md:text-4xl lg:text-5xl font-normal text-center">
          {subtitle}
        </h3>
        
        {/* Buttons */}
        <div className="flex flex-wrap gap-3 justify-center">
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
        <p className="text-foreground/70 dark:text-white/70 text-sm md:text-base font-normal leading-relaxed text-center max-w-2xl">
          {description}
        </p>
      </div>
    </section>
  );
}

