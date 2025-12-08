import Container from "./Container";
import Image from "next/image";
import Link from "next/link";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { FaLinkedin, FaInstagram, FaFacebook, FaTwitter } from "react-icons/fa";

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
                      href="/about"
                      className="text-[#767676] hover:text-[#202020]"
                    >
                      About Us
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

                  <li>
                    <Link
                      href="/support"
                      className="text-[#767676] hover:text-[#202020]"
                    >
                      Support
                    </Link>
                  </li>

                  <li>
                    <Link
                      href="/blog"
                      className="text-[#767676] hover:text-[#202020]"
                    >
                      Blog
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="text-center sm:text-left">
                <h3 className="mb-6 text-lg font-semibold text-[#767676]">
                  Resources
                </h3>

                <ul className="space-y-4">
                  <li>
                    <Link
                      href="/faq"
                      className="text-[#767676] hover:text-[#202020]"
                    >
                      FAQ
                    </Link>
                  </li>

                  <li>
                    <Link
                      href="/documentation"
                      className="text-[#767676] hover:text-[#202020]"
                    >
                      Documentation
                    </Link>
                  </li>

                  <li>
                    <Link
                      href="/case-studies"
                      className="text-[#767676] hover:text-[#202020]"
                    >
                      Case Studies
                    </Link>
                  </li>

                  <li>
                    <Link
                      href="/webinars"
                      className="text-[#767676] hover:text-[#202020]"
                    >
                      Webinars
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Newsletter */}
            <div className="w-full lg:w-2/5">
              <h3 className="mb-4 text-2xl font-semibold text-[#202020] leading-tight">
                We&apos;d love to hear from you, let&apos;s have a conversation
                about what we do and how we can help you
              </h3>

              <p className="mb-6 text-sm text-[#767676]">
                Join our newsletter for the latest updates and insights.
              </p>

              <form className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                  <div className="w-full sm:w-3/4">
                    <Input
                      type="email"
                      placeholder="Your Email Here"
                      className="border-[#c9c9c9] !bg-white placeholder:text-[#989898]"
                    />
                  </div>

                  <div className="w-full sm:w-1/4">
                    <Button
                      type="submit"
                      variant="outline"
                      className="w-full border-[#767676] text-[#767676] hover:bg-[#767676] hover:text-white"
                    >
                      Subscribe
                    </Button>
                  </div>
                </div>
              </form>

              <p className="mt-4 text-xs text-[#767676]">
                By subscribing, you agree to our Privacy Policy and receive
                updates.
              </p>
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
              href="#"
              className="text-[#202020] transition-transform hover:scale-110"
            >
              <FaLinkedin size={32} />
              <span className="sr-only">LinkedIn</span>
            </Link>

            <Link
              href="#"
              className="text-[#202020] transition-transform hover:scale-110"
            >
              <FaInstagram size={32} />
              <span className="sr-only">Instagram</span>
            </Link>

            <Link
              href="#"
              className="text-[#202020] transition-transform hover:scale-110"
            >
              <FaFacebook size={32} />
              <span className="sr-only">Facebook</span>
            </Link>

            <Link
              href="#"
              className="text-[#202020] transition-transform hover:scale-110"
            >
              <FaTwitter size={32} />
              <span className="sr-only">Twitter</span>
            </Link>
          </div>
        </div>

        <div className="h-48 bg-[#233f84]" />
      </div>
    </footer>
  );
}
