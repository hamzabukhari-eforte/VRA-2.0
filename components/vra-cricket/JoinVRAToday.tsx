interface JoinVRATodayProps {
  title?: string;
  description?: string;
  buttonText?: string;
  onButtonClick?: () => void;
}

export default function JoinVRAToday({
  title = "Join VRA Today",
  description = "Become part of the VRA cricket family. Whether you're a player, volunteer, or supporter, there's a place for you here.",
  buttonText = "Become a Member",
  onButtonClick,
}: JoinVRATodayProps) {
  return (
    <section className="w-full flex flex-col items-center gap-4 md:gap-6 py-8 md:py-12 px-4 md:px-8 lg:px-12">
      <h2 className="text-foreground dark:text-white text-3xl md:text-4xl lg:text-[48px] font-light text-center">
        {title}
      </h2>
      <p className="text-foreground/70 dark:text-white/70 text-base md:text-lg font-normal text-center max-w-[600px]">
        {description}
      </p>
      <button
        onClick={onButtonClick}
        className="px-6 md:px-8 py-3 md:py-4 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center gap-2.5 transition-colors"
      >
        <span className="text-white text-base md:text-lg lg:text-xl font-medium font-['Roboto']">
          {buttonText}
        </span>
      </button>
    </section>
  );
}

