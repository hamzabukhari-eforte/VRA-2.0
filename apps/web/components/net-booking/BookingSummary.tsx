import Image from "next/image";

interface BookingSummaryProps {
  date: string;
  duration: string;
  price: number;
  priceUnit: string;
  laneImageSrc: string;
  laneImageAlt: string;
}

export default function BookingSummary({
  date,
  duration,
  price,
  priceUnit,
  laneImageSrc,
  laneImageAlt,
}: BookingSummaryProps) {
  return (
    <div className="flex w-full flex-col items-center gap-8 md:gap-10 lg:gap-12">
      {/* Date Display */}
      <div className="flex flex-col items-center gap-2 shrink-0">
        <div className="text-foreground dark:text-white text-[32px] md:text-[36px] lg:text-[40px] font-light text-center leading-tight">
          {date}
        </div>
        <div className="text-foreground/70 dark:text-white/70 text-base md:text-lg lg:text-xl font-normal text-center max-w-[28ch]">
          {duration}
        </div>
      </div>

      {/* Lane Illustration */}
      <div className="flex flex-col items-center justify-center relative shrink-0 py-4 md:py-6">
        <Image
          src="/assets/net-booking/net-booking-svg-dark.png"
          alt={laneImageAlt}
          width={800}
          height={620}
          className="w-full max-w-[500px] md:max-w-[680px] lg:max-w-[800px] block dark:hidden"
        />
        <Image
          src={laneImageSrc}
          alt={laneImageAlt}
          width={800}
          height={620}
          className="w-full max-w-[500px] md:max-w-[680px] lg:max-w-[800px] hidden dark:block"
        />
      </div>

      {/* Price Display */}
      <div className="flex flex-col items-center gap-1 shrink-0">
        <div className="flex items-baseline gap-1">
          <span className="text-foreground dark:text-white text-[56px] md:text-[64px] lg:text-[72px] font-light leading-none">
            {price}
          </span>
          <span className="text-foreground dark:text-white text-[24px] md:text-[28px] lg:text-[32px] font-light">
            {priceUnit}
          </span>
        </div>
      </div>
    </div>
  );
}
