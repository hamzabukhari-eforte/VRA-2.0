"use client";

import Image from "next/image";
import Container from "@/components/Container";
import { ChevronDown } from "lucide-react";
import TestimonialSection from "@/components/shared/TestimonialSection";
import { useState, useEffect } from "react";

const vraTeams = [
  {
    id: "men_1_2",
    label: "VRA Men 1 & 2",
    heading: "VRA Men 1 & 2",
    imageSrc: "/assets/teams/VRA_Men_1&2.jpg",
    imageAlt: "VRA Men 1 & 2 team photo",
  },
  {
    id: "men_3_4",
    label: "VRA Men 3 & 4",
    heading: "VRA Men 3 & 4",
    imageSrc: "/assets/teams/VRA_Men_3&4.jpg",
    imageAlt: "VRA Men 3 & 4 team photo",
  },
  {
    id: "men_5_6",
    label: "VRA Men 5 & 6",
    heading: "VRA Men 5 & 6",
    imageSrc: "/assets/teams/VRA_Men_5&6.jpg",
    imageAlt: "VRA Men 5 & 6 team photo",
  },
  {
    id: "men_7",
    label: "VRA Men 7",
    heading: "VRA Men 7",
    imageSrc: "/assets/teams/VRA_Men_7.jpg",
    imageAlt: "VRA Men 7 team photo",
  },
  {
    id: "women_1",
    label: "VRA Women 1st XI",
    heading: "VRA Women 1st XI",
    imageSrc: "/assets/teams/VRA Women 1st XI.jpg",
    imageAlt: "VRA Women 1st XI team photo",
  },
  {
    id: "zami_2025",
    label: "VRA Zami 2025",
    heading: "VRA Zami 2025",
    imageSrc: "/assets/teams/VRA Zami 2025.jpg",
    imageAlt: "VRA Zami 2025 team photo",
  },
  {
    id: "u9",
    label: "VRA U9",
    heading: "VRA U9",
    imageSrc: "/assets/teams/VRA U9_s.jpg",
    imageAlt: "VRA U9 team photo",
  },
  {
    id: "u11",
    label: "VRA U11",
    heading: "VRA U11",
    imageSrc: "/assets/teams/VRA U11_s.jpg",
    imageAlt: "VRA U11 team photo",
  },
  {
    id: "u13",
    label: "VRA U13",
    heading: "VRA U13",
    imageSrc: "/assets/teams/VRA U13_s.jpg",
    imageAlt: "VRA U13 team photo",
  },
  {
    id: "u15",
    label: "VRA U15",
    heading: "VRA U15",
    imageSrc: "/assets/teams/VRA U15_s.jpg",
    imageAlt: "VRA U15 team photo",
  },
  {
    id: "u17",
    label: "VRA U17",
    heading: "VRA U17",
    imageSrc: "/assets/teams/VRA U17_s.jpg",
    imageAlt: "VRA U17 team photo",
  },
  {
    id: "club_photo_2025",
    label: "VRA Club Photo 2025",
    heading: "VRA Club Photo 2025",
    imageSrc: "/assets/teams/VRA_Teamphoto2025_23.jpg",
    imageAlt: "VRA Club team photo 2025",
  },
] as const;

const DEFAULT_GALLERY_IMAGES = [
  "/assets/home/home-collage/1.jpg",
  "/assets/home/home-collage/2.jpg",
  "/assets/home/home-collage/3.jpg",
  "/assets/home/home-collage/4.jpg",
  "/assets/home/home-collage/5.jpg",
  "/assets/home/home-collage/6.jpg",
] as const;

export default function LandingPage() {
  const [selectedTeamId, setSelectedTeamId] = useState<(typeof vraTeams)[number]["id"]>(
    vraTeams[0].id
  );
  const selectedTeam = vraTeams.find((team) => team.id === selectedTeamId) ?? vraTeams[0];
  const [galleryImages, setGalleryImages] =
    useState<string[]>(() => [...DEFAULT_GALLERY_IMAGES]);
  const [crowdBanner, setCrowdBanner] = useState<{
    imageUrl: string | null;
    text: string | null;
  } | null>(null);

  useEffect(() => {
    fetch("/api/homepage/gallery")
      .then((r) => r.json())
      .then((data) => {
        const images: unknown = data?.images;
        if (!Array.isArray(images)) return;
        setGalleryImages(
          DEFAULT_GALLERY_IMAGES.map((fallback, index) => {
            const url = images[index];
            return typeof url === "string" && url ? url : fallback;
          }),
        );
      })
      .catch(() => {
        // silently keep defaults
      });
  }, []);

  useEffect(() => {
    fetch("/api/admin/homepage/crowd")
      .then((r) => r.json())
      .then((data) => {
        if (!data) return;
        const imageUrl =
          typeof data.imageUrl === "string" && data.imageUrl
            ? data.imageUrl
            : "/assets/home/home-img.jpg";
        const text =
          typeof data.description === "string" && data.description.trim()
            ? data.description.trim()
            : "Join us for an exciting summer of international cricket in 2026.";
        setCrowdBanner({ imageUrl, text });
      })
      .catch(() => {
        // keep defaults via null; JSX will fall back
      });
  }, []);

  return (
    <>
      <section className="relative h-[100vh] w-full">
        <div className="absolute inset-0 [background:linear-gradient(to_bottom,transparent_0%,transparent_50%,var(--background)_100%)]"></div>

        <video
          src="/assets/hero-section-video.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover z-1"
        />

        <div className="absolute inset-0 top-[52vh] sm:top-[58vh] md:top-[65vh] z-2">
          <Container className="px-4 sm:px-8 md:px-16 lg:px-24">
            <div className="flex flex-col gap-6">
              <h1 className="text-foreground text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light opacity-100">
                The Home to Dutch Cricket
              </h1>

              <div className="px-4 sm:px-8 flex flex-col md:flex-row gap-6 md:gap-12 justify-between items-start md:items-end">
                <div>
                  <p className="text-base sm:text-lg md:text-xl font-normal">
                    <span className="text-4xl sm:text-[49px] font-normal leading-none tracking-normal">
                      498
                    </span>{" "}
                    The venue of the highest ever ODI total

                  </p>
                </div>

                <div className="flex items-center md:items-end gap-3">
                

                  <p className="text-base sm:text-lg md:text-xl font-normal">
                  <span className="text-4xl sm:text-[49px] font-normal leading-none tracking-normal">
                      150+
                    </span>{" "}
                  international games and counting
                  </p>
                </div>

                <div className="flex items-center md:items-end gap-3">
                 

                  <p className="text-base sm:text-lg md:text-xl font-normal">
                 
                  Proud to support <span className="text-4xl sm:text-[49px] font-normal leading-none tracking-normal">
                      21
                    </span>{" "} teams across all levels
                  </p>
                </div>
              </div>
            </div>
          </Container>
        </div>

        {/* Bottom Fade - Smooth blend to next section */}
        <div className="absolute bottom-0 left-0 right-0 h-[300px] bg-linear-to-b from-transparent via-transparent to-background pointer-events-none" />

      </section>

      {/* Main Content */}
      <main className="flex flex-col items-center gap-20 py-20">
        {/* Photo Gallery Grid */}
        <Container className="px-4">
          <section className="relative w-full flex flex-col md:flex-row justify-between gap-4">
            {/* Top Fade */}
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-background to-transparent pointer-events-none z-1" />

            {/* Bottom Fade */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none z-1" />

            <div className="flex flex-col gap-4">
              <div className="w-full md:w-[400px] h-[338px] relative rounded-lg overflow-hidden">
                <Image
                  src={galleryImages[0]}
                  alt=""
                  fill
                  unoptimized
                  className="rounded-lg object-cover"
                />
              </div>

              <div className="w-full md:w-[400px] h-[462px] relative rounded-lg overflow-hidden">
                <Image
                  src={galleryImages[1]}
                  alt=""
                  fill
                  unoptimized
                  className="rounded-lg object-cover"
                />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="w-full md:w-[400px] h-[528px] relative rounded-lg overflow-hidden">
                <Image
                  src={galleryImages[2]}
                  alt=""
                  fill
                  unoptimized
                  className="rounded-lg object-cover"
                />
              </div>

              <div className="w-full md:w-[400px] h-[272px] relative rounded-lg overflow-hidden">
                <Image
                  src={galleryImages[3]}
                  alt=""
                  fill
                  unoptimized
                  className="rounded-lg object-cover"
                />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="w-full md:w-[400px] h-[400px] relative rounded-lg overflow-hidden">
                <Image
                  src={galleryImages[4]}
                  alt=""
                  fill
                  unoptimized
                  className="rounded-lg object-cover"
                />
              </div>

              <div className="w-full md:w-[400px] h-[400px] relative rounded-lg overflow-hidden">
                <Image
                  src={galleryImages[5]}
                  alt=""
                  fill
                  unoptimized
                  className="rounded-lg object-cover"
                />
              </div>
            </div>
          </section>
        </Container>

        {/* Homepage banner (formerly crowd section) */}
        <Container className="px-4">
          <section className="flex flex-col items-center gap-20">
            <div className="w-full md:w-screen h-[650px] relative rounded-lg overflow-hidden">
              <Image
                src={crowdBanner?.imageUrl ?? "/assets/home/home-img.jpg"}
                alt="Homepage banner"
                width={1280}
                height={483}
                className="rounded-lg object-cover"
                unoptimized
              />
            </div>
            <div className="w-full max-w-2xl flex flex-col items-center gap-9">
              <div className="text-center text-[#767676] text-lg sm:text-2xl md:text-3xl font-normal">
                {crowdBanner?.text ??
                  "Join us for an exciting summer of international cricket in 2026."}
              </div>
            </div>
          </section>
        </Container>

        {/* Cricket For Section */}
        <Container className="px-4">
          <section className="w-full flex flex-col items-center gap-12">
            <div className="flex flex-col items-start gap-2">
              <h2 className="text-foreground dark:text-[#f2f0ef] text-3xl font-medium">
                Cricket for
              </h2>
            </div>

            <div className="w-full flex flex-col md:flex-row justify-between items-stretch gap-6">
              {/* International Games Card */}
              <div className="relative w-full md:w-auto max-w-[398px] mx-auto">
                <Image
                  src="/assets/350-836.webp"
                  alt="International Games"
                  width={398}
                  height={360}
                  className="rounded-lg object-cover"
                />

                <div className="absolute left-0 top-0 w-full h-full [background:linear-gradient(to_bottom,transparent_0%,transparent_50%,var(--background)_100%)]"></div>

                <div className="absolute left-3 right-3 bottom-4 flex flex-col items-start gap-2">
                  <h3 className="text-[#202020] dark:text-[#f2f0ef] text-[32px] font-medium drop-shadow-lg">
                    International Games
                  </h3>

                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-[40px] border border-black/20 dark:border-[#4e4e4e]/0">
                      <span className="text-black/80 dark:text-white/50 text-xs font-normal">
                        ODI
                      </span>
                    </div>

                    <div className="p-2.5 rounded-[40px] border border-black/20 dark:border-[#4e4e4e]/0">
                      <span className="text-black/80 dark:text-white/50 text-xs font-normal">
                        T20I
                      </span>
                    </div>

                    <div className="p-2.5 rounded-[40px] border border-black/20 dark:border-[#4e4e4e]/0">
                      <span className="text-black/80 dark:text-white/50 text-xs font-normal">
                        Womens
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Club Sports Card */}
              <div className="relative w-full md:w-auto max-w-[397px] mx-auto">
                <Image
                  src="/assets/350-855.webp"
                  alt="Club sports"
                  width={397}
                  height={360}
                  className="rounded-lg object-cover"
                />

                <div className="absolute left-0 top-0 w-full h-full [background:linear-gradient(to_bottom,transparent_0%,transparent_50%,var(--background)_100%)]"></div>

                <div className="absolute left-3 right-3 bottom-4 flex flex-col items-start gap-2">
                  <h3 className="text-[#202020] dark:text-[#f2f0ef] text-[32px] font-medium drop-shadow-lg">
                    Club sports
                  </h3>

                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-[40px] border border-black/30 dark:border-[#4e4e4e]">
                      <span className="text-black dark:text-white text-xs font-normal">
                        Seniors
                      </span>
                    </div>

                    <div className="p-2.5 rounded-[40px] border border-black/30 dark:border-[#4e4e4e]">
                      <span className="text-black dark:text-white text-xs font-normal">
                        Women&apos;s
                      </span>
                    </div>

                    <div className="p-2.5 rounded-[40px] border border-black/30 dark:border-[#4e4e4e]">
                      <span className="text-black dark:text-white text-xs font-normal">
                        Zami
                      </span>
                    </div>

                    <div className="p-2.5 rounded-[40px] border border-black/30 dark:border-[#4e4e4e]">
                      <span className="text-black dark:text-white text-xs font-normal">
                        Youth
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Card */}
              <div className="relative w-full md:w-auto max-w-[397px] mx-auto">
                <Image
                  src="/assets/350-874.webp"
                  alt="Social"
                  width={397}
                  height={360}
                  className="rounded-lg object-cover"
                />

                <div className="absolute left-0 top-0 w-full h-full [background:linear-gradient(to_bottom,transparent_0%,transparent_50%,var(--background)_100%)]"></div>

                <div className="absolute left-3 right-3 bottom-4 flex flex-col items-start gap-2">
                  <h3 className="text-[#202020] dark:text-[#f2f0ef] text-[32px] font-medium drop-shadow-lg">
                    Social
                  </h3>

                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-[40px] border border-black/30 dark:border-[#4e4e4e]">
                      <span className="text-black dark:text-white text-xs font-normal">
                        Events
                      </span>
                    </div>

                    <div className="p-2.5 rounded-[40px] border border-black/30 dark:border-[#4e4e4e]">
                      <span className="text-black dark:text-white text-xs font-normal">
                        Networking
                      </span>
                    </div>

                    <div className="p-2.5 rounded-[40px] border border-black/30 dark:border-[#4e4e4e]">
                      <span className="text-black dark:text-white text-xs font-normal">
                        Mentorship
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </Container>

        {/* VRA Teams Section */}
        <Container className="px-4">
          <section className="py-10 bg-background rounded-lg flex flex-col gap-2.5">
            <div>
              <div className="w-full h-[62px] flex items-center justify-between mb-[41px]">
                <h2 className="text-foreground text-3xl sm:text-4xl md:text-[51px] font-normal">
                  {selectedTeam.heading}
                </h2>

                <div className="flex items-center gap-2">
                  <div className="relative">
                    <select
                      value={selectedTeamId}
                      onChange={(e) =>
                        setSelectedTeamId(e.target.value as (typeof vraTeams)[number]["id"])
                      }
                      className="pl-4 pr-10 py-[8.5px] rounded-[40px] border border-foreground/20 bg-background text-foreground text-base font-bold appearance-none cursor-pointer"
                    >
                      {vraTeams.map((team) => (
                        <option key={team.id} value={team.id}>
                          {team.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground" />
                  </div>
                </div>
              </div>

              <Image
                src={selectedTeam.imageSrc}
                alt={selectedTeam.imageAlt}
                width={1108}
                height={643}
                className="w-full mx-auto rounded-lg object-cover"
              />
            </div>
          </section>
        </Container>

        {/* Statistics Cards Section */}
        {/* <Container className="px-4">
          <section className="w-full flex flex-col lg:flex-row justify-between items-stretch gap-6">
            <div className="flex flex-col justify-center items-start gap-6 w-full">
              <div className="w-full sm:max-w-[400px] h-[338px] bg-[#ff8164] rounded-lg border border-[#202020] p-6 flex flex-col">
                <div className="flex items-center gap-3 mb-8">
                  <div className="px-4 py-2 rounded-lg border border-[#202020] bg-transparent text-[#202020] text-sm">
                    Lorem ipsum dolor sit
                  </div>

                  <button className="w-9 h-9 rounded-full border border-[#202020] flex items-center justify-center bg-transparent hover:bg-[#202020]/10 transition-colors">
                    <ChevronUp className="w-4 h-4 text-[#202020]" />
                  </button>
                </div>

                <div className="flex-1 flex items-center justify-center relative">
                  <svg
                    className="absolute inset-0 w-full h-full"
                    viewBox="0 0 200 200"
                  >
                    <circle
                      cx="100"
                      cy="100"
                      r="90"
                      fill="none"
                      stroke="#202020"
                      strokeWidth="2"
                      className="opacity-30"
                    />

                    <circle
                      cx="100"
                      cy="100"
                      r="90"
                      fill="none"
                      stroke="#202020"
                      strokeWidth="4"
                      strokeDasharray={`${2 * Math.PI * 90 * 0.75} ${
                        2 * Math.PI * 90 * 0.25
                      }`}
                      strokeDashoffset={2 * Math.PI * 90 * 0.5}
                      strokeLinecap="round"
                      transform="rotate(-175 100 100)"
                    />
                  </svg>

                  <div className="relative flex items-center justify-center">
                    <span className="text-[56px] sm:text-[72px] md:text-[80px] font-thin leading-none tracking-normal text-center text-[#202020]">
                      99
                    </span>

                    <span className="absolute top-0 right-0 text-3xl font-light leading-none tracking-normal text-center text-[#202020] -mt-2 -mr-2">
                      *
                    </span>
                  </div>
                </div>
              </div>

              <div className="w-full sm:max-w-[400px] h-[462px] bg-[#e59ca3] rounded-lg relative p-6 flex flex-col justify-between">
                <div className="flex items-center gap-3 mb-8">
                  <div className="px-4 py-2 rounded-lg border border-[#202020] bg-transparent text-[#202020] text-sm">
                    Lorem ipsum dolor sit
                  </div>

                  <button className="w-9 h-9 rounded-full border border-[#202020] flex items-center justify-center bg-transparent hover:bg-[#202020]/10 transition-colors">
                    <ChevronUp className="w-4 h-4 text-[#202020]" />
                  </button>
                </div>

                <div className="text-base font-light leading-none tracking-normal text-[#202020]/50">
                  &ldquo;Lorem ipsum dolor sitLorem ipsum dolor sitLorem ipsum
                  dolor sitLorem ipsum dolor sitLorem ipsum dolor sitLorem ipsum
                  dolor sitLorem ipsum dolor sitLorem ipsum dolor sitLorem ipsum
                  dolor sit, Lorem ipsum dolor sitLorem ipsum dolor sitL
                  sit&rdquo;
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center items-start gap-6 w-full">
              <Image
                src="/assets/team-photo.jpg"
                alt="Team"
                width={400}
                height={528}
                className="w-full sm:max-w-[400px] h-auto md:h-[528px] rounded-lg object-cover"
              />

              <div className="w-full sm:max-w-[400px] h-[272px] bg-[#f4d35e] rounded-lg relative flex flex-col justify-between">
                <div className="flex items-center gap-3 p-6">
                  <div className="px-4 py-2 rounded-lg border border-[#202020] bg-transparent text-[#202020] text-sm">
                    Lorem ipsum dolor sit
                  </div>

                  <button className="w-9 h-9 rounded-full border border-[#202020] flex items-center justify-center bg-transparent hover:bg-[#202020]/10 transition-colors">
                    <ChevronUp className="w-4 h-4 text-[#202020]" />
                  </button>
                </div>

                <div className="w-full flex items-baseline justify-center gap-4 sm:gap-8 md:gap-12">
                  <div className="text-[72px] sm:text-[88px] md:text-[100px] font-thin text-[#202020]">
                    4x
                  </div>

                  <Image
                    src="/assets/350-932.svg"
                    alt="Chart"
                    width={190}
                    height={100}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center items-start gap-6 w-full">
              <div className="w-full sm:max-w-[400px] h-[400px] bg-[#5f7aa8] rounded-lg relative p-6 flex flex-col justify-between">
                <div className="flex items-center gap-3">
                  <div className="px-4 py-2 rounded-lg border border-[#202020] bg-transparent text-[#202020] text-sm">
                    Lorem ipsum dolor sit
                  </div>

                  <button className="w-9 h-9 rounded-full border border-[#202020] flex items-center justify-center bg-transparent hover:bg-[#202020]/10 transition-colors">
                    <ChevronUp className="w-4 h-4 text-[#202020]" />
                  </button>
                </div>

                <div className="text-[96px] sm:text-[140px] md:text-[180px] font-thin leading-none tracking-normal text-[#202020]">
                  99%
                </div>
              </div>

              <div className="w-full sm:max-w-[400px] h-[400px] bg-[#b8c5d6] rounded-lg relative p-6 flex flex-col justify-between">
                <div className="flex items-center gap-3">
                  <div className="px-4 py-2 rounded-lg border border-[#202020] bg-transparent text-[#202020] text-sm">
                    Lorem ipsum dolor sit
                  </div>

                  <button className="w-9 h-9 rounded-full border border-[#202020] flex items-center justify-center bg-transparent hover:bg-[#202020]/10 transition-colors">
                    <ChevronUp className="w-4 h-4 text-[#202020]" />
                  </button>
                </div>

                <div className="w-full h-12 border-b-2 border-[#202020] flex">
                  <div className="w-1/2 h-full bg-[#202020]"></div>
                  <div className="w-1/2 h-full"></div>
                </div>

                <div className="text-[96px] sm:text-[140px] md:text-[180px] font-thin leading-none tracking-normal text-[#202020]">
                  99%
                </div>
              </div>
            </div>
          </section>
        </Container> */}

        {/* Our Sponsors Section */}
        <Container>
          <section className="w-full flex flex-col items-center gap-6 py-10">
            <h2 className="text-foreground text-[49px] font-medium leading-[123%] tracking-normal text-center">
              Our Sponsors
            </h2>

            <div className="flex flex-wrap items-center justify-center gap-6 sm:justify-between w-full">
              <Image
                src="/assets/350-958.webp"
                alt="Sponsor"
                width={200}
                height={200}
                className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all"
              />

              <Image
                src="/assets/350-959.webp"
                alt="Sponsor"
                width={200}
                height={200}
                className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all"
              />

              <Image
                src="/assets/350-960.webp"
                alt="Sponsor"
                width={200}
                height={200}
                className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all"
              />

              <Image
                src="/assets/350-961.webp"
                alt="Sponsor"
                width={200}
                height={200}
                className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all"
              />

              <Image
                src="/assets/350-962.webp"
                alt="Sponsor"
                width={200}
                height={200}
                className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all"
              />

              <Image
                src="/assets/350-963.webp"
                alt="Sponsor"
                width={200}
                height={200}
                className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all"
              />
            </div>
          </section>
        </Container>

        {/* Testimonial Section */}
        <TestimonialSection
          quote="The team at this cyber security company transformed our security posture. Their expertise and dedication to our protection were unmatched."
          profileImageSrc="/assets/350-983.webp"
          profileImageAlt="Profile"
          name="Name here"
          designation="Designation"
        />

        {/* Map Section */}
        <Container className="px-4">
          <section className="w-full h-90 overflow-hidden relative">
            <div className="absolute inset-0 scale-133 origin-right">
              <Image
                src="/assets/landing-page-map.png"
                alt="Map"
                fill
                className="w-full h-full object-cover object-center"
              />
            </div>
          </section>
        </Container>
      </main>
    </>
  );
}
