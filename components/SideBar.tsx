"use client";

import { X, ExternalLink } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SideBar({
  isMenuOpen,
  setIsMenuOpen,
}: {
  isMenuOpen: boolean;
  setIsMenuOpen: (isMenuOpen: boolean) => void;
}) {
  const pathname = usePathname();
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
          <nav className="flex flex-col gap-2 w-full max-w-64 mx-auto">
            <Link
              href="/about"
              className={`flex items-center gap-2 text-xl sm:text-2xl font-semibold pb-3 border-b-[1.5px] border-[#202020] hover:pl-4 transition-all ${
                pathname === "/about"
                  ? "text-red-700 font-bold"
                  : "text-[#202020]"
              }`}
            >
              About Us
              {pathname === "/about" && (
                <span className="w-2 h-2 rounded-full bg-red-700 shrink-0 ml-2" />
              )}
            </Link>

            <Link
              href="/facility"
              className={`flex items-center gap-2 text-xl sm:text-2xl font-semibold py-3 border-b-[1.5px] border-[#202020] hover:pl-4 transition-all ${
                pathname === "/facility"
                  ? "text-red-700 font-bold"
                  : "text-[#202020]"
              }`}
            >
              Facilities
              {pathname === "/facility" && (
                <span className="w-2 h-2 rounded-full bg-red-700 shrink-0 ml-2" />
              )}
            </Link>

            <Link
              href="/indoor-net-booking"
              className={`flex items-center gap-2 text-xl sm:text-2xl font-semibold py-3 border-b-[1.5px] border-[#202020] hover:pl-4 transition-all ${
                pathname === "/indoor-net-booking"
                  ? "text-red-700 font-bold"
                  : "text-[#202020]"
              }`}
            >
              Indoor Net Booking
              {pathname === "/indoor-net-booking" && (
                <span className="w-2 h-2 rounded-full bg-red-700 shrink-0 ml-2" />
              )}
            </Link>

            <Link
              href="/vra-cricket"
              className={`flex items-center gap-2 text-xl sm:text-2xl font-semibold py-3 border-b-[1.5px] border-[#202020] hover:pl-4 transition-all ${
                pathname === "/vra-cricket"
                  ? "text-red-700 font-bold"
                  : "text-[#202020]"
              }`}
            >
              VRA Cricket
              {pathname === "/vra-cricket" && (
                <span className="w-2 h-2 rounded-full bg-red-700 shrink-0 ml-2" />
              )}
            </Link>

            <span
              className="block text-[#202020]/50 text-xl sm:text-2xl font-semibold py-3 border-b-[1.5px] border-[#202020] cursor-not-allowed opacity-50"
            >
              Sponsors
            </span>

            <Link
              href="https://www.gray-nicolls.co.uk/collections/vra-cricket-netherlands?filter.v.price.gte=&filter.v.price.lte=&sort_by=best-selling&filter.p.tag=clubtag_Match+Wear&view=club-grid"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[#202020] text-xl sm:text-2xl font-semibold py-3 border-b-[1.5px] border-[#202020] hover:pl-4 transition-all underline"
            >
              Shop
              <ExternalLink className="w-5 h-5 shrink-0" />
            </Link>

            <Link
              href="/donations"
              className={`flex items-center gap-2 text-xl sm:text-2xl font-semibold py-3 border-b-[1.5px] border-[#202020] hover:pl-4 transition-all ${
                pathname === "/donations"
                  ? "text-red-700 font-bold"
                  : "text-[#202020]"
              }`}
            >
              Donations
              {pathname === "/donations" && (
                <span className="w-2 h-2 rounded-full bg-red-700 shrink-0 ml-2" />
              )}
            </Link>

            <Link
              href="/contact"
              className={`flex items-center gap-2 text-xl sm:text-2xl font-semibold py-3 border-b-[1.5px] border-[#202020] hover:pl-4 transition-all ${
                pathname === "/contact"
                  ? "text-red-700 font-bold"
                  : "text-[#202020]"
              }`}
            >
              Contact Us
              {pathname === "/contact" && (
                <span className="w-2 h-2 rounded-full bg-red-700 shrink-0 ml-2" />
              )}
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
