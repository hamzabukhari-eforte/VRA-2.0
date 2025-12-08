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
    <div className="flex flex-col justify-between h-full gap-6 md:gap-8 lg:gap-8">
      {/* Date Display */}
      <div className="flex flex-col items-center gap-2">
        <div className="text-foreground dark:text-white text-[32px] md:text-[36px] lg:text-[44px]font-light ">
          {date}
        </div>
        <div className="text-foreground/70 dark:text-white/70 text-lg md:text-xl lg:text-2xl xl:text-3xl font-normal ">
          {duration}
        </div>
      </div>

      {/* Lane Illustration */}
      <div className="flex flex-col items-center gap-4 py-4 md:py-6 lg:py-8 flex-1 justify-center relative">
        {/* Light mode - dark image */}
        <Image
          src="/assets/net-booking/net-booking-svg-dark.png"
          alt={laneImageAlt}
          width={300}
          height={200}
          className="w-full max-w-[250px] md:max-w-[280px] lg:max-w-[300px] block dark:hidden"
        />
        {/* Dark mode - regular image */}
        <Image
          src={laneImageSrc}
          alt={laneImageAlt}
          width={300}
          height={200}
          className="w-full max-w-[250px] md:max-w-[280px] lg:max-w-[300px] hidden dark:block"
        />
      </div>

      {/* Price Display */}
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-baseline gap-1">
          <span className="text-foreground dark:text-white text-[64px] md:text-[80px] lg:text-[96px] xl:text-[120px] font-light ">
            {price}
          </span>
          <span className="text-foreground dark:text-white text-[28px] md:text-[36px] lg:text-[40px] xl:text-[48px] font-light ">
            {priceUnit}
          </span>
        </div>
      </div>
    </div>
  );
}

