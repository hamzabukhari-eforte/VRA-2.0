import Image from "next/image";

interface FacilityForItem {
  subtitle: string;
  buttons: string[];
  description: string;
  imageSrc: string;
  imageAlt: string;
  imageLeft?: boolean;
}

interface FacilityForProps {
  title: string;
  items: FacilityForItem[];
}

export default function FacilityFor({ title, items }: FacilityForProps) {
  return (
    <section className="w-full flex flex-col gap-12 md:gap-16">
      {/* Items */}
      {items.map((item, index) => (
        <div
          key={index}
          className={`w-full grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 ${
            index < items.length - 1 ? "" : ""
          }`}
        >
          {item.imageLeft ? (
            <>
              {/* Image on left */}
              <div className="relative w-full h-[400px] md:h-[500px]">
                <Image
                  src={item.imageSrc}
                  alt={item.imageAlt}
                  fill
                  className="rounded-lg object-cover object-top"
                />
              </div>
              {/* Content on right - title at top for first, content at bottom */}
              <div className={`flex flex-col min-h-[400px] md:min-h-[500px] ${
                index === 0 ? 'justify-between' : 'justify-end'
              }`}>
                {/* Title at top (only for first item) */}
                {index === 0 && (
                  <h2 className="text-foreground dark:text-white text-3xl md:text-4xl lg:text-5xl font-normal">
                    {title}
                  </h2>
                )}
                {/* Content at bottom */}
                <div className="flex flex-col gap-6">
                  <h3 className="text-foreground dark:text-white text-3xl md:text-4xl lg:text-5xl font-normal">
                    {item.subtitle}
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {item.buttons.map((button, btnIndex) => (
                      <button
                        key={btnIndex}
                        className="px-4 py-2 border border-foreground/20 dark:border-white rounded-lg text-foreground dark:text-white text-sm font-normal hover:bg-foreground/10 dark:hover:bg-white/10 transition-colors"
                      >
                        {button}
                      </button>
                    ))}
                  </div>
                  <p className="text-foreground/70 dark:text-white/70 text-sm md:text-base font-normal leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Content on left - title at top for first, content at bottom */}
              <div className={`flex flex-col min-h-[400px] md:min-h-[500px] ${
                index === 0 ? 'justify-between' : 'justify-end'
              }`}>
                {/* Title at top (only for first item) */}
                {index === 0 && (
                  <h2 className="text-foreground dark:text-white text-3xl md:text-4xl lg:text-5xl font-normal">
                    {title}
                  </h2>
                )}
                {/* Content at bottom */}
                <div className="flex flex-col gap-6">
                  <h3 className="text-foreground dark:text-white text-3xl md:text-4xl lg:text-5xl font-normal">
                    {item.subtitle}
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {item.buttons.map((button, btnIndex) => (
                      <button
                        key={btnIndex}
                        className="px-4 py-2 border border-foreground/20 dark:border-white rounded-lg text-foreground dark:text-white text-sm font-normal hover:bg-foreground/10 dark:hover:bg-white/10 transition-colors"
                      >
                        {button}
                      </button>
                    ))}
                  </div>
                  <p className="text-foreground/70 dark:text-white/70 text-sm md:text-base font-normal leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
              {/* Image on right */}
              <div className="relative w-full h-[400px] md:h-[500px]">
                <Image
                  src={item.imageSrc}
                  alt={item.imageAlt}
                  fill
                  className="rounded-lg object-cover object-top"
                />
              </div>
            </>
          )}
        </div>
      ))}
    </section>
  );
}

