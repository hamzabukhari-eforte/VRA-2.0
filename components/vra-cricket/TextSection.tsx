interface TextSectionProps {
  title: string;
  description: string;
  titleSize?: "small" | "medium" | "large";
}

export default function TextSection({
  title,
  description,
  titleSize = "large",
}: TextSectionProps) {
  const titleClasses = {
    small: "text-2xl md:text-3xl",
    medium: "text-3xl md:text-4xl",
    large: "text-3xl md:text-4xl lg:text-[48px]",
  };

  return (
    <section className="w-full">
      <h2
        className={`text-foreground dark:text-white ${titleClasses[titleSize]} font-light mb-4 md:mb-6`}
      >
        {title}
      </h2>
      <p className="text-foreground/70 dark:text-white/70 text-base md:text-lg font-normal leading-relaxed max-w-[800px]">
        {description}
      </p>
    </section>
  );
}

