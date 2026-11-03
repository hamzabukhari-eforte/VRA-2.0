interface CollaborationSectionProps {
  text?: string;
  buttonText?: string;
  onButtonClick?: () => void;
}

export default function CollaborationSection({
  text = "Have something that we can collaborate on at our facility?",
  buttonText = "Contact Us",
  onButtonClick,
}: CollaborationSectionProps) {
  return (
    <section className="w-full flex flex-col items-center justify-center gap-8 md:gap-12 py-12 md:py-16">
      {/* Text */}
      <p className="text-foreground dark:text-white text-2xl md:text-3xl font-normal text-center max-w-4xl px-4">
        &quot;{text}&quot;
      </p>

      {/* Button */}
      <button
        onClick={onButtonClick}
        className="px-8 py-3 bg-gray-200 dark:bg-[#2a2a2a] hover:bg-gray-300 dark:hover:bg-[#353535] rounded-lg text-foreground dark:text-white text-base md:text-lg font-normal transition-colors"
      >
        {buttonText}
      </button>
    </section>
  );
}

