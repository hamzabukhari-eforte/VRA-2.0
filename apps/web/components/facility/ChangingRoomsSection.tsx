import Image from "next/image";

interface ChangingRoomsSectionProps {
  title: string;
  subtitle: string;
  buttons: string[];
  description: string;
  images: {
    src: string;
    alt: string;
  }[];
}

export default function ChangingRoomsSection({
  title,
  subtitle,
  buttons,
  description,
  images,
}: ChangingRoomsSectionProps) {
  return (
    <section className="w-full flex flex-col gap-8 md:gap-12">
      {/* Title at the top */}
      <h2 className="text-foreground dark:text-white text-3xl md:text-4xl lg:text-5xl font-normal">
        {title}
      </h2>

      {/* Images and content layout */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* Image 1: Top-right */}
        <div className="relative w-full h-[400px] md:h-[600px] md:col-start-2">
          <Image
            src={images[0]?.src || ""}
            alt={images[0]?.alt || ""}
            fill
            className="rounded-lg object-cover"
          />
        </div>

        {/* Image 2: Middle-left */}
        <div className="relative w-full h-[400px] md:h-[600px] md:col-start-1 md:row-start-2">
          <Image
            src={images[1]?.src || ""}
            alt={images[1]?.alt || ""}
            fill
            className="rounded-lg object-cover"
          />
        </div>

        {/* Content on the left of Image 3 */}
        <div className="flex flex-col gap-6 justify-center md:col-start-1 md:row-start-3">
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

        {/* Image 3 on the right */}
        <div className="relative w-full h-[400px] md:h-[600px] md:col-start-2 md:row-start-3">
          <Image
            src={images[2]?.src || ""}
            alt={images[2]?.alt || ""}
            fill
            className="rounded-lg object-cover"
          />
        </div>
      </div>
    </section>
  );
}

