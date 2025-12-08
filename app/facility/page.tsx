import HeroBanner from "@/components/about/HeroBanner";
import ImageTextSection from "@/components/about/ImageTextSection";
import FacilityImageCarousel from "@/components/facility/FacilityImageCarousel";
import NetsSection from "@/components/facility/NetsSection";
import PavilionSection from "@/components/facility/PavilionSection";
import ChangingRoomsSection from "@/components/facility/ChangingRoomsSection";
import CafeteriaSection from "@/components/facility/CafeteriaSection";
import FacilitySquareCarousel from "@/components/facility/FacilitySquareCarousel";
import FacilityFor from "@/components/facility/FacilityFor";
import CollaborationSection from "@/components/shared/CollaborationSection";
import TestimonialSection from "@/components/shared/TestimonialSection";

export default function FacilityPage() {
  return (
    <div className="min-h-screen dark:bg-[#202020] bg-background text-foreground overflow-x-hidden">
      {/* Hero Section */}
      <HeroBanner
        imageSrc="/assets/350-1370.webp"
        imageAlt="Facility"
        heading="Facility"
        overlayOpacity={40}
        showWhatsApp={false}
      />

      {/* Main Content */}
      <main className="w-full max-w-[1280px] mx-auto flex flex-col items-start gap-[80px] pt-[79px] px-8 pb-20">
      <CollaborationSection />

        <ImageTextSection
          imageLeft={false}
          sectionTitle="Ground 1"
          mainHeading="Sport Events"
          buttons={["Accessibility", "Fitness", "Growth"]}
          description="Lorem ipsum dolor sit amet consectetur. Aenean tincidunt malesuada nec massa est imperdiet. Gravida arcu sed magnis urna natoque. Velit aliquam et varius lorem adipiscing quam et id vitae. Massa accumsan fringilla eros eleifend sit sem."
          imageSrc="/assets/350-1412.webp"
          imageAlt="Ground 1"
        />

        <FacilityImageCarousel
          images={[
            {
              src: "/assets/350-1412.webp",
              alt: "Ground 1 - Cricket ground",
              width: 1200, // Replace with actual image width
              height: 800, // Replace with actual image height
            },
            {
              src: "/assets/350-1413.webp",
              alt: "Ground 1 - Practice nets",
              width: 800, // Replace with actual image width
              height: 1200, // Replace with actual image height
            },
            {
              src: "/assets/350-826.webp",
              alt: "Ground 1 - Stadium view",
              width: 1000, // Replace with actual image width
              height: 800, // Replace with actual image height
            },
          ]}
        />

        <ImageTextSection
          imageLeft={false}
          sectionTitle="Ground 2"
          mainHeading="Sport Events"
          buttons={["Accessibility", "Fitness", "Growth"]}
          description="Lorem ipsum dolor sit amet consectetur. Aenean tincidunt malesuada nec massa est imperdiet. Gravida arcu sed magnis urna natoque. Velit aliquam et varius lorem adipiscing quam et id vitae. Massa accumsan fringilla eros eleifend sit sem."
          imageSrc="/assets/350-1412.webp"
          imageAlt="Ground 2"
        />

        <ImageTextSection
          imageLeft={true}
          sectionTitle="Ground 3"
          mainHeading="Sport Events"
          buttons={["Accessibility", "Fitness", "Growth"]}
          description="Lorem ipsum dolor sit amet consectetur. Aenean tincidunt malesuada nec massa est imperdiet. Gravida arcu sed magnis urna natoque. Velit aliquam et varius lorem adipiscing quam et id vitae. Massa accumsan fringilla eros eleifend sit sem."
          imageSrc="/assets/350-1412.webp"
          imageAlt="Ground 3"
        />

        <NetsSection
          headingLeft={true}
          heading="Outdoor Nets"
          buttons={["Accessibility", "Fitness", "Growth"]}
          description="Lorem ipsum dolor sit amet consectetur. Aenean tincidunt malesuada nec massa est imperdiet. Gravida arcu sed magnis urna natoque. Velit aliquam et varius lorem adipiscing quam et id vitae. Massa accumsan fringilla eros eleifend sit sem."
          imageSrc="/assets/350-1412.webp"
          imageAlt="Outdoor Nets"
        />

        <NetsSection
          headingLeft={false}
          heading="Indoor Nets"
          buttons={["Accessibility", "Fitness", "Growth"]}
          description="Lorem ipsum dolor sit amet consectetur. Aenean tincidunt malesuada nec massa est imperdiet. Gravida arcu sed magnis urna natoque. Velit aliquam et varius lorem adipiscing quam et id vitae. Massa accumsan fringilla eros eleifend sit sem."
          imageSrc="/assets/350-1412.webp"
          imageAlt="Indoor Nets"
        />

        <PavilionSection
          title="Pavilion"
          subtitle="Sport Events"
          buttons={["Accessibility", "Fitness", "Growth"]}
          description="Lorem ipsum dolor sit amet consectetur. Aenean tincidunt malesuada nec massa est imperdiet. Gravida arcu sed magnis urna natoque. Velit aliquam et varius lorem adipiscing quam et id vitae. Massa accumsan fringilla eros eleifend sit sem."
          imageSrc="/assets/350-1412.webp"
          imageAlt="Pavilion"
        />

        <ChangingRoomsSection
          title="Changing rooms"
          subtitle="Sport Events"
          buttons={["Accessibility", "Fitness", "Growth"]}
          description="Lorem ipsum dolor sit amet consectetur. Aenean tincidunt malesuada nec massa est imperdiet. Gravida arcu sed magnis urna natoque. Velit aliquam et varius lorem adipiscing quam et id vitae. Massa accumsan fringilla eros eleifend sit sem."
          images={[
            {
              src: "/assets/350-1412.webp",
              alt: "Changing Rooms 1",
            },
            {
              src: "/assets/350-1413.webp",
              alt: "Changing Rooms 2",
            },
            {
              src: "/assets/350-1419.webp",
              alt: "Changing Rooms 3",
            },
          ]}
        />

        <CafeteriaSection
          title="Cafeteria"
          subtitle="Sport Events"
          buttons={["Accessibility", "Fitness", "Growth"]}
          description="Lorem ipsum dolor sit amet consectetur. Aenean tincidunt malesuada nec massa est imperdiet. Gravida arcu sed magnis urna natoque. Velit aliquam et varius lorem adipiscing quam et id vitae. Massa accumsan fringilla eros eleifend sit sem."
          imageSrc="/assets/350-1412.webp"
          imageAlt="Cafeteria"
        />

        <FacilitySquareCarousel
          heading="Our Facility"
          images={[
            {
              src: "/assets/350-1412.webp",
              alt: "Facility 1",
            },
            {
              src: "/assets/350-1413.webp",
              alt: "Facility 2",
            },
            {
              src: "/assets/350-1419.webp",
              alt: "Facility 3",
            },
            {
              src: "/assets/350-826.webp",
              alt: "Facility 4",
            },
            {
              src: "/assets/350-1879.webp",
              alt: "Facility 5",
            },
          ]}
        />


        <FacilityFor
          title="Facility for"
          items={[
            {
              subtitle: "Sport Events",
              buttons: ["Accessibility", "Fitness", "Growth", "Resources"],
              description:
                "Lorem ipsum dolor sit amet consectetur. Aenean tincidunt malesuada nec massa est imperdiet. Gravida arcu sed magnis urna natoque. Velit aliquam et varius lorem adipiscing quam et id vitae. Massa accumsan fringilla eros eleifend sit sem.",
              imageSrc: "/assets/350-1412.webp",
              imageAlt: "Sport Events",
              imageLeft: false,
            },
            {
              subtitle: "Sport Clinics",
              buttons: ["Comercial", "Durable", "Fast Charging", "Business Use"],
              description:
                "Lorem ipsum dolor sit amet consectetur. Aenean tincidunt malesuada nec massa est imperdiet. Gravida arcu sed magnis urna natoque. Velit aliquam et varius lorem adipiscing quam et id vitae. Massa accumsan fringilla eros eleifend sit sem.",
              imageSrc: "/assets/350-1413.webp",
              imageAlt: "Sport Clinics",
              imageLeft: true,
            },
            {
              subtitle: "Culture",
              buttons: ["Accessibility", "Fitness", "Growth", "Resources"],
              description:
                "Lorem ipsum dolor sit amet consectetur. Aenean tincidunt malesuada nec massa est imperdiet. Gravida arcu sed magnis urna natoque. Velit aliquam et varius lorem adipiscing quam et id vitae. Massa accumsan fringilla eros eleifend sit sem.",
              imageSrc: "/assets/350-1412.webp",
              imageAlt: "Culture",
              imageLeft: false,
            },
          ]}
        />

        <CollaborationSection />

        <TestimonialSection
          quote="The team at this cyber security company transformed our security posture. Their expertise and dedication to our protection were unmatched."
          profileImageSrc="/assets/350-983.webp"
          profileImageAlt="Profile"
          name="Name here"
          designation="Designation"
        />
      </main>
    </div>
  );
}
