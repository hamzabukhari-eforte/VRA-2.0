import Container from "./Container";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import { FaLinkedin, FaInstagram, FaYoutube } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="w-full">
      <div className="bg-white px-6 py-12 md:px-12 lg:px-16">
        <Container>
          <div className="flex flex-col lg:flex-row justify-between gap-10 lg:gap-0">
            {/* Logo */}
            <div className="flex items-center lg:items-start justify-center lg:justify-start w-full lg:w-1/5">
              <Image
                width={192}
                height={60}
                src="/assets/footer-logo.png"
                alt="VRA Cricket Amsterdam"
              />
            </div>

            {/* Links */}
            <div className="w-full lg:w-2/5 flex flex-col sm:flex-row justify-center gap-8 sm:gap-12">
              <div className="text-center sm:text-left">
                <h3 className="mb-6 text-lg font-semibold text-[#767676]">
                  Quick Links
                </h3>

                <ul className="space-y-4">
                  <li>
                    <Link
                      href="/"
                      className="text-[#767676] hover:text-[#202020]"
                    >
                      Home
                    </Link>
                  </li>

                  <li>
                    <Link
                      href="/about"
                      className="text-[#767676] hover:text-[#202020]"
                    >
                      About Us
                    </Link>
                  </li>

                  <li>
                    <Link
                      href="/vra-cricket"
                      className="text-[#767676] hover:text-[#202020]"
                    >
                      VRA Cricket
                    </Link>
                  </li>

                  <li>
                    <Link
                      href="/facility"
                      className="text-[#767676] hover:text-[#202020]"
                    >
                      Facility
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="text-center sm:text-left">
                <h3 className="mb-6 text-lg font-semibold text-[#767676]">
                  Services
                </h3>

                <ul className="space-y-4">
                  <li>
                    <Link
                      href="/membership"
                      className="text-[#767676] hover:text-[#202020]"
                    >
                      Membership
                    </Link>
                  </li>

                  <li>
                    <Link
                      href="/net-booking"
                      className="text-[#767676] hover:text-[#202020]"
                    >
                      Net Booking
                    </Link>
                  </li>

                  <li>
                    <Link
                      href="/donations"
                      className="text-[#767676] hover:text-[#202020]"
                    >
                      Donations
                    </Link>
                  </li>

                  <li>
                    <Link
                      href="/contact"
                      className="text-[#767676] hover:text-[#202020]"
                    >
                      Contact Us
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Contact Us */}
            <div className="w-full lg:w-2/5">
              <h3 className="mb-6 text-2xl font-semibold text-[#202020] leading-tight">
                Have something that we can collaborate on at our facility?
              </h3>



<div className="flex justify-center">

  <Link href="/contact">
                <Button
                  variant="outline"
                  className="border-[#767676] text-[#767676] hover:bg-[#767676] hover:text-white"
                >
                  Contact Us
                </Button>
              </Link>
  </div>              

            </div>
          </div>
        </Container>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3">
        <div className="h-48 bg-[#db3242]" />
        <div className="flex h-48 flex-col items-center justify-center bg-[#f3c628]">
          <h4 className="mb-6 text-xl font-semibold text-[#202020]">
            Follow Us on
          </h4>

          <div className="flex items-center gap-6">
            <Link
              href="https://www.linkedin.com/company/vra-cricket/"
              className="text-[#202020] transition-transform hover:scale-110"
            >
              <FaLinkedin size={32} />
              <span className="sr-only">LinkedIn</span>
            </Link>

            <Link
              href="https://www.instagram.com/vra_cricket_amsterdam?igsh=NnVqcXl6eXJpcm9o&utm_source=qr"
              className="text-[#202020] transition-transform hover:scale-110"
            >
              <FaInstagram size={32} />
              <span className="sr-only">Instagram</span>
            </Link>

            <Link
              href="https://www.youtube.com/@VRACricketLive"
              className="text-[#202020] transition-transform hover:scale-110"
            >
              <FaYoutube size={32} />
              <span className="sr-only">YouTube</span>
            </Link>
          </div>
        </div>

        <div className="h-48 bg-[#233f84]" />
      </div>
    </footer>
  );
}
