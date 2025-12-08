interface QuoteSectionProps {
  quote?: string;
}

export default function QuoteSection({
  quote = '"There is nothing in the cricket calendar to match the atmosphere at the VRA ground"',
}: QuoteSectionProps) {
  return (
    <section className="w-full py-8 md:py-12">
      <p className="text-foreground/70 dark:text-white/70 text-lg md:text-xl lg:text-2xl font-light text-center italic max-w-[900px] mx-auto leading-relaxed px-4">
        {quote}
      </p>
    </section>
  );
}

