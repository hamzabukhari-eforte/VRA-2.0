import Image from "next/image";

interface VRAClubRulesProps {
  imageSrc?: string;
  imageAlt?: string;
}

export default function VRAClubRules({
  imageSrc = "/assets/497-4444.svg",
  imageAlt = "Project Connect",
}: VRAClubRulesProps) {
  return (
    <section className="w-full">
      <h2 className="text-foreground dark:text-white text-3xl md:text-4xl lg:text-[48px] font-light mb-6 md:mb-8">
        VRA Club Rules
      </h2>
      <div className="flex items-center justify-center">
        <Image
          src={imageSrc}
          alt={imageAlt}
          width={300}
          height={300}
          className="w-[200px] md:w-[250px] lg:w-[300px] h-auto"
        />
      </div>
    </section>
  );
}

