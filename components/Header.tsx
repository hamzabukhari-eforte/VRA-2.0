import Link from "next/link";
import Image from "next/image";
import ThemeToggleButton from "./ThemeToggleButton";
import MenuButton from "./MenuButton";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-3 h-[72px] sm:h-[84px] md:h-[100px]">
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/0 backdrop-blur-[6px]" />

      <div className="relative h-full flex items-center justify-between px-4 sm:px-6 md:px-10 lg:px-[42px]">
        {/* Left side - Menu and Navigation */}
        <div className="flex items-center gap-[21px]">
          <MenuButton />

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-4 lg:gap-6 p-2">
            <Link
              href="/membership"
              className="text-white text-sm md:text-base lg:text-xl font-normal"
            >
              Membership
            </Link>

            <Link
              href="/indoor-net-booking"
              className="text-white text-sm md:text-base lg:text-xl font-normal"
            >
              Indoor Net Booking
            </Link>

            <Link
              href="/facility"
              className="text-white text-sm md:text-base lg:text-xl font-normal"
            >
              Facilities
            </Link>

            <Link
              href="/"
              className="text-white text-sm md:text-base lg:text-xl font-normal"
            >
              Cricket Nest
            </Link>
          </nav>
        </div>

        {/* Center - Logo */}
        <div className="hidden sm:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <Image
            src="/assets/542-28725.svg"
            alt="VRA"
            width={114}
            height={40}
            className="w-[96px] h-8 sm:w-[114.24px] sm:h-10"
          />
        </div>

        {/* Right side - Language selector and Login */}
        <div className="flex items-center gap-3 sm:gap-4 md:gap-6 p-2.5">
          <ThemeToggleButton />

          {/* Language Selector */}
          <div className="w-[49px] h-[22px] relative">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-xl font-normal pr-10">
              NL
            </div>

            <Image
              src="/assets/I350-1078;45-50.svg"
              alt=""
              width={1}
              height={14}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-3.5 rounded-[10px]"
            />

            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white/50 text-xs font-normal pl-8">
              EN
            </div>
          </div>

          {/* Login Button */}
          <Link
            href="/login"
            className="px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 bg-gradient-to-b from-[#141414] to-black rounded-lg border border-white/10 flex items-center justify-center gap-2.5"
          >
            <span className="text-white text-sm sm:text-base md:text-xl font-normal">
              Login
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
