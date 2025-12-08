import Image from "next/image";
import Container from "@/components/Container";

interface TestimonialSectionProps {
  badgeSrc?: string;
  badgeAlt?: string;
  quote: string;
  profileImageSrc: string;
  profileImageAlt: string;
  name: string;
  designation: string;
}

export default function TestimonialSection({
  badgeSrc = "/assets/I350-976;4179-8862.svg",
  badgeAlt = "Webflow",
  quote,
  profileImageSrc,
  profileImageAlt,
  name,
  designation,
}: TestimonialSectionProps) {
  return (
    <Container className="px-4">
      <section className="flex flex-col items-center gap-6 py-10">
        {badgeSrc && (
          <Image
            src={badgeSrc}
            alt={badgeAlt}
            width={200}
            height={32}
            className="h-8 invert dark:invert-0"
          />
        )}

        <div className="w-full max-w-[658px] text-center text-foreground text-sm sm:text-base md:text-lg font-normal px-2 sm:px-4">
          &quot;{quote}&quot;
        </div>

        <div className="flex flex-col items-center gap-2">
          <Image
            src={profileImageSrc}
            alt={profileImageAlt}
            width={64}
            height={64}
            className="w-16 h-16 rounded-full object-cover"
          />

          <div className="text-foreground text-sm font-medium">{name}</div>

          <div className="text-foreground/50 text-xs font-normal">
            {designation}
          </div>
        </div>
      </section>
    </Container>
  );
}
