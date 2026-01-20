"use client";

import Container from "./Container";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import gsap from "gsap";
import SideBar from "./SideBar";

const DEFAULT_VIEWPORT_WIDTH = 1440;

type MaskConfig = {
  maskWidth: number;
  maskHeight: number;
  maskOffset: string;
  webkitMaskOffset: string;
  emblemTop: string;
  emblemScale: number;
};

const getMaskConfig = (width: number): MaskConfig => {
  if (width >= 1024) {
    return {
      maskWidth: 800,
      maskHeight: 284,
      maskOffset: "17vh",
      webkitMaskOffset: "18vh",
      emblemTop: "25vh",
      emblemScale: 1,
    };
  }

  if (width >= 768) {
    return {
      maskWidth: 680,
      maskHeight: 245,
      maskOffset: "19vh",
      webkitMaskOffset: "19.5vh",
      emblemTop: "25vh",
      emblemScale: 0.82,
    };
  }

  if (width >= 640) {
    return {
      maskWidth: 620,
      maskHeight: 225,
      maskOffset: "19.75vh",
      webkitMaskOffset: "20vh",
      emblemTop: "25vh",
      emblemScale: 0.78,
    };
  }

  if (width >= 480) {
    return {
      maskWidth: 520,
      maskHeight: 200,
      maskOffset: "20.5vh",
      webkitMaskOffset: "20.5vh",
      emblemTop: "25vh",
      emblemScale: 0.74,
    };
  }

  if (width >= 375) {
    return {
      maskWidth: 450,
      maskHeight: 180,
      maskOffset: "21vh",
      webkitMaskOffset: "21vh",
      emblemTop: "25vh",
      emblemScale: 0.7,
    };
  }

  return {
    maskWidth: 400,
    maskHeight: 165,
    maskOffset: "21.5vh",
    webkitMaskOffset: "21.5vh",
    emblemTop: "25vh",
    emblemScale: 0.66,
  };
};

export default function HomePageHeroSectionMask({
  replayId = 0,
  isMenuOpen,
  setIsMenuOpen,
}: {
  replayId: number;
  isMenuOpen: boolean;
  setIsMenuOpen: (isMenuOpen: boolean) => void;
}) {
  // Controls whether the overlay intercepts pointer events.
  const [isActive, setIsActive] = useState(true);
  const { theme, toggleTheme, mounted } = useTheme();

  // In a .jsx file we can't use TypeScript generics; plain refs are fine.
  const sectionRef = useRef(null);
  const maskRef = useRef(null);
  const headerRef = useRef(null);
  const contentRef = useRef(null);
  const emblemRef = useRef(null);
  const [viewportWidth, setViewportWidth] = useState<number | null>(null);
  const [hasMeasured, setHasMeasured] = useState(false);
  const maskConfig = useMemo(
    () => getMaskConfig(viewportWidth ?? DEFAULT_VIEWPORT_WIDTH),
    [viewportWidth]
  );
  const maskSizeValue = `${maskConfig.maskWidth}px ${maskConfig.maskHeight}px, 100% 100%`;
  const maskPositionValue = `center ${maskConfig.maskOffset}, center`;
  const webkitMaskPositionValue = `center ${maskConfig.webkitMaskOffset}, center`;

  // Hold references to the GSAP timeline so we can reuse it when the header
  // button asks to replay the overlay.
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const hasStartedRef = useRef(false);
  const initialScrollYRef = useRef(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const updateViewport = () => {
      setViewportWidth(window.innerWidth);
      setHasMeasured(true);
    };

    updateViewport();
    window.addEventListener("resize", updateViewport);

    return () => {
      window.removeEventListener("resize", updateViewport);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (
      !sectionRef.current ||
      !maskRef.current ||
      !headerRef.current ||
      !contentRef.current ||
      !emblemRef.current
    )
      return;

    const ctx = gsap.context(() => {
      hasStartedRef.current = false;
      initialScrollYRef.current = window.scrollY;
      // Time-based animation (not scrubbed) that we can trigger on scroll.
      const tl = gsap.timeline({
        paused: true,
      });

      timelineRef.current = tl;

      // Intro animation: only build the D emblem pieces one by one on load.
      gsap.fromTo(
        ".emblem-piece",
        { opacity: 0, y: 12 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.15,
          ease: "power2.out",
          duration: 0.4,
        }
      );

      tl.to(maskRef.current, {
        // grow the logo mask so the transparent area expands
        WebkitMaskSize: "2200px 780px, 100% 100%",
        maskSize: "2200px 780px, 100% 100%",
        ease: "none",
        duration: 0.6,
      })
        // Emblem gently fades out in place
        .to(
          emblemRef.current,
          {
            opacity: 0,
            filter: "blur(2px)",
            ease: "power2.out",
            duration: 0.6,
          },
          0 // start with mask growth
        )
        // Header blasts upward & fades
        .to(
          headerRef.current,
          {
            opacity: 0,
            y: -40, // move header upwards
            scale: 1.05,
            filter: "blur(4px)",
            ease: "power2.out",
            duration: 0.6,
          },
          0 // start at the same time as the mask growth
        )
        // Content moves downward & fades
        .to(
          contentRef.current,
          {
            opacity: 0,
            y: 40, // move content downwards
            scale: 1.05,
            filter: "blur(4px)",
            ease: "power2.out",
            duration: 0.6,
          },
          0 // also start with mask growth for a 360° blast feel
        )
        .to(
          maskRef.current,
          {
            // fade the mask overlay out so the underlying hero is fully visible
            opacity: 0,
            ease: "none",
            duration: 0.4,
          },
          0.2 // start fading a bit after the expansion begins
        );

      // Once the animation finishes, stop the overlay from blocking the page
      // but keep it mounted so we can reverse the animation later.
      tl.eventCallback("onComplete", () => {
        setIsActive(false);
      });

      // When the timeline fully reverses (overlay comes back in), re-arm the
      // scroll trigger logic so the user can hide it again by scrolling.
      tl.eventCallback("onReverseComplete", () => {
        hasStartedRef.current = false;
        initialScrollYRef.current = window.scrollY;
      });
    }, sectionRef);

    return () => {
      ctx.revert();
      timelineRef.current = null;
    };
  }, []);

  // When the parent bumps replayId via props (from the header button), reverse
  // the GSAP timeline so the overlay reappears with the opposite animation.
  useEffect(() => {
    if (!timelineRef.current) return;
    if (!replayId) return;

    // Reactivate overlay interactions and play the animation in reverse in
    // the next animation frame to avoid cascading render warnings.
    const frameId = requestAnimationFrame(() => {
      if (!timelineRef.current) return;
      setIsActive(true);
      timelineRef.current.reverse();
    });

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [replayId]);

  // When the overlay is active and has not yet started its hide animation,
  // watch for the first user scroll (up or down) of more than a few pixels
  // and then play the timeline. While the menu is open, disable this trigger.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!timelineRef.current) return;

    // Reset starting scroll position whenever we (re)activate the overlay.
    hasStartedRef.current = false;
    initialScrollYRef.current = window.scrollY;

    if (!isActive) return;
    if (isMenuOpen) return;

    const handleScroll = () => {
      if (!timelineRef.current) return;
      if (hasStartedRef.current) return;

      const currentY = window.scrollY;
      if (Math.abs(currentY - initialScrollYRef.current) > 5) {
        hasStartedRef.current = true;
        timelineRef.current.play();
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isActive, isMenuOpen]);

  return (
    <>
      {/* Fixed full-screen overlay so it stays visible while the page scrolls */}
      <div
        ref={sectionRef}
        className="fixed inset-0 w-full h-[100vh] z-4"
        style={{ pointerEvents: isActive ? "auto" : "none" }}
      >
        {/* Background layer with logo cutout - logo area is transparent */}
        <div
          ref={maskRef}
          className="absolute inset-0 bg-[#EFEBDA] backdrop-blur-lg border border-white/20"
          style={{
            transition:
              "mask-size 0.6s ease, -webkit-mask-size 0.6s ease, mask-position 0.6s ease, -webkit-mask-position 0.6s ease",
            maskImage: `url('/assets/542-28725.svg'), linear-gradient(white, white)`,
            WebkitMaskImage: `url('/assets/542-28725.svg'), linear-gradient(white, white)`,
            maskSize: maskSizeValue,
            WebkitMaskSize: maskSizeValue,
            maskRepeat: "no-repeat, no-repeat",
            WebkitMaskRepeat: "no-repeat, no-repeat",
            maskPosition: maskPositionValue,
            WebkitMaskPosition: webkitMaskPositionValue,
            maskComposite: "exclude",
            WebkitMaskComposite: "xor",
          }}
        />

        {/* D-shaped colored logo pieces inside the R cutout */}
        <div
          ref={emblemRef}
          className="pointer-events-none absolute left-1/2 -translate-x-1/2 z-10"
          style={{
            top: maskConfig.emblemTop,
            opacity: hasMeasured ? 1 : 0,
            transition: "top 0.6s ease, opacity 0.3s ease",
          }}
        >
          <div
            className="relative w-[100px] h-[90px]"
            style={{
              transition: "transform 0.6s ease",
              transform: `scale(${maskConfig.emblemScale})`,
              transformOrigin: "center top",
            }}
          >
            {/* Red D */}
            <Image
              src="/assets/r-d-red.svg"
              alt="R D red"
              width={90}
              height={80}
              className="emblem-piece absolute left-0 top-0 object-contain opacity-0 translate-y-3"
            />

            {/* Black base D */}
            <Image
              src="/assets/r-d-black.svg"
              alt="R D black"
              width={75}
              height={65}
              className="emblem-piece absolute left-2 top-2 object-contain opacity-0 translate-y-3"
            />

            {/* Yellow D */}
            <Image
              src="/assets/r-d-yellow.svg"
              alt="R D yellow"
              width={55}
              height={27}
              className="emblem-piece absolute left-4 top-4 object-contain opacity-0 translate-y-3"
            />

            {/* Blue D */}
            <Image
              src="/assets/r-d-blue.svg"
              alt="R D blue"
              width={45}
              height={13}
              className="emblem-piece absolute left-5 top-6 object-contain opacity-0 translate-y-3"
            />
          </div>
        </div>

        <header ref={headerRef} className="h-[72px] sm:h-[84px] md:h-[100px]">
          <div className="relative h-full flex items-center justify-between px-4 sm:px-6 md:px-10 lg:px-[42px]">
            {/* Left side - Menu and Navigation */}
            <div className="flex items-center gap-[21px]">
              {/* Menu Icon */}
              <button
                onClick={() => setIsMenuOpen(true)}
                className="w-[42px] h-[42px] relative hover:opacity-80 transition-opacity"
              >
                <div className="w-[42px] h-[42px] rounded-full border border-[#202020]" />

                <div className="absolute left-[18px] top-[8.5px] flex flex-col gap-[2.43px]">
                  <div className="w-[6.38px] h-[6.38px] bg-[#202020] rounded-full" />
                  <div className="w-[6.38px] h-[6.38px] bg-[#202020] rounded-full" />
                  <div className="w-[6.38px] h-[6.38px] bg-[#202020] rounded-full" />
                </div>
              </button>

              {/* Navigation Links */}
              <nav
                className={`hidden md:flex items-center gap-4 lg:gap-6 p-2.5 transition-opacity transition-transform duration-300 ${
                  isMenuOpen
                    ? "opacity-0 translate-y-2 pointer-events-none"
                    : "opacity-100 translate-y-0"
                }`}
              >
                <Link
                  href="/membership"
                  className="text-[#202020] text-sm md:text-base lg:text-xl font-normal"
                >
                  Membership
                </Link>

                <Link
                  href="/indoor-net-booking"
                  className="text-[#202020] text-sm md:text-base lg:text-xl font-normal"
                >
                  Indoor Net Booking
                </Link>

                <Link
                  href="/facility"
                  className="text-[#202020] text-sm md:text-base lg:text-xl font-normal"
                >
                  Facilities
                </Link>

                <Link
                  href="/"
                  className="text-[#202020] text-sm md:text-base lg:text-xl font-normal"
                >
                  Cricket Nest
                </Link>
              </nav>
            </div>

            {/* Right side - Language selector and Login */}
            <div className="flex items-center gap-3 sm:gap-4 md:gap-6 p-2.5">
              {/* Sun/Moon Icon */}
              <button
                onClick={() => toggleTheme?.()}
                disabled={!toggleTheme}
                className="w-[41px] h-[41px] relative cursor-pointer hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Image
                  src="/assets/I350-1077;45-164.svg"
                  alt="Sun"
                  width={41}
                  height={41}
                  className={`w-full h-full absolute inset-0 transition-opacity duration-300 ${
                    !mounted || theme === "dark" ? "opacity-100" : "opacity-0"
                  }`}
                  style={{
                    filter: "brightness(0) saturate(100%) invert(19%)",
                  }}
                />

                <Image
                  src="/assets/moon.svg"
                  alt="Moon"
                  width={41}
                  height={41}
                  className={`w-full h-full absolute inset-0 transition-opacity duration-300 ${
                    mounted && theme === "light" ? "opacity-100" : "opacity-0"
                  }`}
                  style={{
                    filter: "brightness(0) saturate(100%) invert(19%)",
                  }}
                />
              </button>

              {/* Language Selector */}
              <div className="w-[49px] h-[22px] relative">
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[#202020] text-xl font-normal pr-10">
                  NL
                </div>

                <Image
                  src="/assets/I350-1078;45-50.svg"
                  alt=""
                  width={1}
                  height={14}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-3.5 rounded-[10px]"
                />

                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[#202020]/50 text-xs font-normal pl-8">
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

        <section ref={contentRef} className="relative w-full bg-[#EFEBDA]">
          <div className="absolute inset-0 top-[calc(52vh-72px)] sm:top-[calc(58vh-84px)] md:top-[calc(65vh-100px)]">
            <Container className="px-4 sm:px-8 md:px-16 lg:px-24">
              <div className="flex flex-col gap-6">
                <h1 className="text-[#202020] text-3xl sm:text-4xl md:text-5xl lg:text-6xl opacity-100">
                  The Home to Dutch Cricket
                </h1>

                <div className="px-4 sm:px-8 flex flex-col md:flex-row gap-6 md:gap-12 justify-between items-start md:items-end">
                  <div>
                    <p className="text-[#202020] text-base sm:text-lg md:text-xl font-normal">
                      <span className="text-4xl sm:text-[49px] font-normal leading-none tracking-normal">
                        498
                      </span>{" "}
                      The venue of the highest ever ODI total
                    </p>
                  </div>

                  <div className="flex items-center md:items-end gap-3">
                    <p className="text-base sm:text-lg md:text-xl font-normal text-[#202020]">
                      <span className="text-4xl sm:text-[49px] font-normal leading-none tracking-normal">
                        150+
                      </span>{" "}
                      international games and counting
                    </p>
                  </div>

                  <div className="flex items-center md:items-end gap-3">
                    <p className="text-base sm:text-lg md:text-xl font-normal text-[#202020]">
                      Proud to support{" "}
                      <span className="text-4xl sm:text-[49px] font-normal leading-none tracking-normal">
                        21
                      </span>{" "}
                      teams across all levels
                    </p>
                  </div>
                </div>
              </div>
            </Container>
          </div>
        </section>
      </div>

      <SideBar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
    </>
  );
}
