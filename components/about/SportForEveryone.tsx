import Image from "next/image";

export default function SportForEveryone() {
  return (
    <section className="w-full grid grid-cols-2 gap-12 items-center">
      <div className="relative w-full h-[400px]">
        <Image
          src="/assets/350-1413.webp"
          alt="Sport for everyone"
          fill
          className="rounded-lg object-cover"
        />
      </div>
      <div className="flex flex-col gap-4">
        <h2 className="text-foreground dark:text-white text-[32px] font-medium ">
          Sport for everyone
        </h2>
        <p className="text-foreground/70 dark:text-white/70 text-base font-normal  leading-relaxed">
          VRA is for everyone, whether you are a recreational player or a
          professional athlete. We offer a wide range of sports and
          activities for all ages and skill levels. Our goal is to make
          sports accessible to everyone and to promote a healthy lifestyle.
        </p>
      </div>
    </section>
  );
}

