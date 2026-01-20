import { X } from "lucide-react";
import Link from "next/link";

export default function SideBar({
  isMenuOpen,
  setIsMenuOpen,
}: {
  isMenuOpen: boolean;
  setIsMenuOpen: (isMenuOpen: boolean) => void;
}) {
  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-5 ${isMenuOpen ? "block" : "hidden"} `}
        onClick={() => setIsMenuOpen(false)}
      />

      {/* Menu Drawer */}
      <aside
        className={`fixed top-0 left-0 h-full z-6 transition-transform duration-300 ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        } w-full max-w-xs sm:max-w-sm md:max-w-md lg:w-fit rounded-r-xl overflow-y-auto backdrop-blur-lg border border-white/30 shadow-lg sidebar-gradient`}
      >
        <div className="pr-6 sm:pr-8 pl-4 pt-4 sm:pt-6 w-full flex flex-col gap-8 sm:gap-10">
          {/* Close button and top nav */}
          <div className="flex items-center gap-4 sm:gap-6">
            <button
              onClick={() => setIsMenuOpen(false)}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-colors border border-[#202020]"
              aria-label="Close menu"
            >
              <X className="w-6 h-6 text-[#202020]" />
            </button>

            <div className="flex flex-wrap gap-4 sm:gap-6 text-[#202020] text-base sm:text-lg">
              <Link href="/membership" className="hover:underline">
                Membership
              </Link>

              <Link href="#cricket-nest" className="hover:underline">
                Cricket Nest
              </Link>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex flex-col gap-2 w-full max-w-[10rem] mx-auto">
            <Link
              href="/about"
              className="block text-[#202020] text-xl sm:text-2xl font-semibold pb-3 border-b-[1.5px] border-[#202020] hover:pl-4 transition-all"
            >
              About Us
            </Link>

            <Link
              href="/facility"
              className="block text-[#202020] text-xl sm:text-2xl font-semibold py-3 border-b-[1.5px] border-[#202020] hover:pl-4 transition-all"
            >
              Facilities
            </Link>

            <Link
              href="/indoor-net-booking"
              className="block text-[#202020] text-xl sm:text-2xl font-semibold py-3 border-b-[1.5px] border-[#202020] hover:pl-4 transition-all"
            >
              Indoor Net Booking
            </Link>

            <Link
              href="/vra-cricket"
              className="block text-[#202020] text-xl sm:text-2xl font-semibold py-3 border-b-[1.5px] border-[#202020] hover:pl-4 transition-all"
            >
              VRA Cricket
            </Link>

            <Link
              href="/sponsors"
              className="block text-[#202020] text-xl sm:text-2xl font-semibold py-3 border-b-[1.5px] border-[#202020] hover:pl-4 transition-all"
            >
              Sponsors
            </Link>

            <Link
              href="https://www.gray-nicolls.co.uk/collections/vra-cricket-netherlands?filter.v.price.gte=&filter.v.price.lte=&sort_by=best-selling&filter.p.tag=clubtag_Match+Wear&view=club-grid"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-[#202020] text-xl sm:text-2xl font-semibold py-3 border-b-[1.5px] border-[#202020] hover:pl-4 transition-all underline"
            >
              Shop
            </Link>

            <Link
              href="/donations"
              className="block text-[#202020] text-xl sm:text-2xl font-semibold py-3 border-b-[1.5px] border-[#202020] hover:pl-4 transition-all"
            >
              Donations
            </Link>

            <Link
              href="/contact"
              className="block text-[#202020] text-xl sm:text-2xl font-semibold py-3 border-b-[1.5px] border-[#202020] hover:pl-4 transition-all"
            >
              Contact Us
            </Link>
          </nav>
        </div>
      </aside>

      <style jsx>{`
        .sidebar-gradient {
          background-color: #20202040;
          animation: sidebarColorCycle 14s ease-in-out infinite;
        }

        @keyframes sidebarColorCycle {
          0%,
          100% {
            background-color: #20202040;
          }
          25% {
            background-color: #db324240;
          }
          50% {
            background-color: #f3c62840;
          }
          75% {
            background-color: #233f8440;
          }
        }
      `}</style>
    </>
  );
}
