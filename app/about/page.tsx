import HeroBanner from "@/components/about/HeroBanner";
import ImageTextSection from "@/components/about/ImageTextSection";
import SportForEveryone from "@/components/about/SportForEveryone";
import StadiumDescription from "@/components/about/StadiumDescription";
import OurBoard from "@/components/about/OurBoard";
import OurValues from "@/components/about/OurValues";
import History from "@/components/about/History";
import BePartOfUs from "@/components/about/BePartOfUs";

export default function AboutPage() {
  return (
    <div className="min-h-screen dark:bg-[#202020] bg-background text-foreground dark:text-white overflow-x-hidden">
      {/* Hero Section */}
      <HeroBanner
        imageSrc="/assets/350-1370.webp"
        imageAlt="Team"
        heading="About us"
        overlayOpacity={40}
        showWhatsApp={true}
      />

      {/* Main Content */}
      <main className="w-full max-w-[1280px] mx-auto flex flex-col items-start gap-[100px] pt-[79px] px-8">
        <ImageTextSection
          imageLeft={false}
          sectionTitle="Our Mission"
          mainHeading="Sport for everyone"
          buttons={["Accessibility", "Fitness", "Growth", "Resources"]}
          description="Lorem ipsum dolor sit amet consectetur. Mauris nulla vel sit nibh. Mauris nulla vel sit nibh. Mauris nulla vel sit nibh. Mauris nulla vel sit nibh."
          imageSrc="/assets/350-1412.webp"
          imageAlt="Mission"
        />
     
        <ImageTextSection
          imageLeft={true}
          sectionTitle="Our Vision"
          mainHeading="Facilitating Ease"
          buttons={["Comercial", "Durable", "Fast Charging", "Business Use"]}
          description="Lorem ipsum dolor sit amet consectetur. Aenean tincidunt malesuada nec massa est imperdiet. Gravida arcu sed magnis urna natoque."
          imageSrc="/assets/350-1419.webp"
          imageAlt="Facilitating Ease"
        />
        <StadiumDescription />
        <OurBoard />
        <OurValues />
        <History />
        <ImageTextSection
          imageLeft={false}
          sectionTitle="Volunteer for us"
          mainHeading=""
          buttons={["Culture", "Experience", "Work", "opportunity"]}
          description="Lorem ipsum dolor sit amet consectetur. Aenean tincidunt malesuada nec massa est imperdiet. Gravida arcu sed magnis urna natoque. Velit aliquam et varius lorem adipiscing quam et id vitae. Massa accumsan fringilla eros eleifend sit sem."
          imageSrc="/assets/350-1879.webp"
          imageAlt="Volunteers"
        />
        <BePartOfUs />
      </main>
    </div>
  );
}
