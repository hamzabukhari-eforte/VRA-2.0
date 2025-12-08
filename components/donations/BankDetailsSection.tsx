interface BankDetailsSectionProps {
  text?: string;
  text2?: string;
  buttonText?: string;
  onButtonClick?: () => void;
}

export default function BankDetailsSection({
  text = "Donations: Bank details VRA:\nING Bank - IBAN: NL95 INGB 0006066048 t.a. Treasurer VRA in Amsterdam.",
  text2 = "If you have any questions about donations contact generalmanager@vra.nl",
}: BankDetailsSectionProps) {
  return (
    <section className="flex flex-col items-center gap-2.5 w-full">
      <div className="flex flex-col items-center gap-8 md:gap-12 lg:gap-16 xl:gap-20 w-full">
        <div className="flex flex-col items-center gap-6 md:gap-8 lg:gap-10 w-full px-4">
          <div className="w-full max-w-[658px] text-center text-foreground dark:text-white text-base md:text-lg lg:text-xl xl:text-[28px] font-normal leading-relaxed whitespace-pre-line wrap-break-word">
            {text}
          </div>
          <div className="w-full max-w-[658px] text-center text-foreground dark:text-white text-base md:text-lg lg:text-xl xl:text-[28px] font-normal leading-relaxed whitespace-pre-line wrap-break-word">
            {text2}
          </div>
        </div>
      </div>
    </section>
  );
}

