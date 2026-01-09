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
          mainHeading=""
          buttons={["Diversity", "Community", "Growth", "Sustainability"]}
          description="VRA Cricket Club is dedicated to delivering a premier cricket experience by fostering talent at all levels, promoting diversity, and maintaining the highest standards of sport and service. We aim to build a thriving community where excellence is standard, membership is sought after, and financial success ensures our growth and sustainability."
          imageSrc="/assets/350-1412.webp"
          imageAlt="Mission"
        />
     
        <ImageTextSection
          imageLeft={true}
          sectionTitle="Our Vision"
          mainHeading=""
          buttons={["Quality", "Excellence", "Passion", "Performance"]}
          description="To be the leading cricket club in the Netherlands, recognized for excellence in sport and community. We strive to create a top-tier, multicultural environment that attracts top talent and passionate members, offering exceptional service, quality facilities, and financial sustainability for both the short and long term."
          imageSrc="/assets/350-1419.webp"
          imageAlt="Vision"
        />
        <StadiumDescription />
        <OurBoard />
        <OurValues />
        <History />
        <ImageTextSection
          imageLeft={false}
          sectionTitle="Volunteer for Us"
          mainHeading=""
          buttons={["Community", "Purpose", "Family", "Impact"]}
          description="Volunteer with VRA Cricket Club and be part of something special. Contribute your skills, meet passionate people, and help build a vibrant, inclusive cricket community. Whether on match days, events, or behind the scenes, your time makes a real impact on players, members, and the future of the club."
          imageSrc="/assets/350-1879.webp"
          imageAlt="Volunteers"
        />
        <BePartOfUs />
      </main>
    </div>
  );
}
