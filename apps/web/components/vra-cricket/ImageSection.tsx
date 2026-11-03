import Image from "next/image";

interface ImageSectionProps {
  title?: string;
  imageSrc: string;
  imageAlt: string;
  height?: string;
}

export default function ImageSection({
  title,
  imageSrc,
  imageAlt,
  height = "h-[400px] md:h-[500px]",
}: ImageSectionProps) {
  return (
    <section className="w-full">
      {title && (
        <h2 className="text-foreground dark:text-white text-3xl md:text-4xl lg:text-[48px] font-light mb-6 md:mb-8">
          {title}
        </h2>
      )}
      <div className={`relative w-full ${height}`}>
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="rounded-lg object-cover"
        />
      </div>
    </section>
  );
}

