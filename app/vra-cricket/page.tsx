import HeroBanner from "@/components/about/HeroBanner";
import TeamsInVRA from "@/components/vra-cricket/TeamsInVRA";
import ImageTextSectionAbout from "@/components/about/ImageTextSection";
import ImageTextSection from "@/components/vra-cricket/ImageTextSection";
import FixturesCards from "@/components/vra-cricket/FixturesCards";
import StandingsTable from "@/components/vra-cricket/StandingsTable";
import TopPlayers from "@/components/vra-cricket/TopPlayers";
import JoinVRAToday from "@/components/vra-cricket/JoinVRAToday";
import FacilityGrid from "@/components/vra-cricket/FacilityGrid";
import QuoteSection from "@/components/vra-cricket/QuoteSection";
import CollaborationSection from "@/components/shared/CollaborationSection";

export default function VRACricketPage() {
  return (
    <div className="min-h-screen dark:bg-[#202020] bg-background text-foreground dark:text-white overflow-x-hidden">
      {/* Hero Section */}
      <HeroBanner
        imageSrc="/assets/497-4123.webp"
        imageAlt="VRA Cricket"
        heading="VRA Cricket"
        overlayOpacity={40}
        showWhatsApp={false}
      />

      {/* Main Content */}
      <main className="w-full max-w-[1280px] mx-auto flex flex-col items-start gap-8 md:gap-12 lg:gap-16 xl:gap-20 pt-6 md:pt-10 lg:pt-14 xl:pt-20 px-4 md:px-6 lg:px-8 pb-8 md:pb-12 lg:pb-16 xl:pb-20">
        {/* Teams in VRA Section */}
        <TeamsInVRA />

        {/* Over Seas Cricket Talent Section */}
        <ImageTextSectionAbout
          imageLeft={false}
          sectionTitle="Over Seas Cricket Talent"
          mainHeading=""
          buttons={["Accessibility", "Opportunity", "Growth", "Resources"]}
          description="Lorem ipsum dolor sit amet consectetur. Aenean tincidunt malesuada nec massa est imperdiet. Gravida arcu sed magnis urna natoque. Velit aliquam et varius lorem adipiscing quam et id vitae. Massa accumsan fringilla eros eleifend sit sem."
          imageSrc="/assets/497-4310.webp"
          imageAlt="Team"
        />

        {/* Stem Clinics Section */}
        <ImageTextSectionAbout
          imageLeft={true}
          sectionTitle="Sport Clinics"
          mainHeading=""
          buttons={["Comercial", "Durable", "Fast Charging", "Business Use"]}
          description="Lorem ipsum dolor sit amet consectetur. Aenean tincidunt malesuada nec massa est imperdiet. Gravida arcu sed magnis urna natoque. Velit aliquam et varius lorem adipiscing quam et id vitae. Massa accumsan fringilla eros eleifend sit sem."
          imageSrc="/assets/497-4312.webp"
          imageAlt="Sport Clinics"
        />

        {/* Culture Section */}
        <ImageTextSectionAbout
          imageLeft={false}
          sectionTitle="Culture"
          mainHeading=""
          buttons={["Accessibility", "Fitness", "Growth", "Resources"]}
          description="Lorem ipsum dolor sit amet consectetur. Aenean tincidunt malesuada nec massa est imperdiet. Gravida arcu sed magnis urna natoque. Velit aliquam et varius lorem adipiscing quam et id vitae. Massa accumsan fringilla eros eleifend sit sem."
          imageSrc="/assets/497-4310.webp"
          imageAlt="Culture"
        />

        {/* Fixtures Building Section */}
        <ImageTextSectionAbout
          imageLeft={true}
          sectionTitle="Fixtures"
          mainHeading="Sport Events"
          buttons={["Accessibility", "Fitness", "Growth"]}
          description="Lorem ipsum dolor sit amet consectetur. Aenean tincidunt malesuada nec massa est imperdiet. Gravida arcu sed magnis urna natoque. Velit aliquam et varius lorem adipiscing quam et id vitae. Massa accumsan fringilla eros eleifend sit sem."
          imageSrc="/assets/497-4367.webp"
          imageAlt="Fixtures"
        />

        {/* Fixtures Cards Section */}
        <FixturesCards />

        {/* Standings Section */}
        <StandingsTable />

        {/* Top Batsmen and Bowlers Section */}
        <section className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          <TopPlayers
            title="Top Batsmen"
            players={[
              { rank: 1, name: "J. Smith", stat: "542 runs" },
              { rank: 2, name: "P. van der Berg", stat: "498 runs" },
              { rank: 3, name: "M. Ahmed", stat: "467 runs" },
            ]}
          />
          <TopPlayers
            title="Top Bowlers"
            players={[
              { rank: 1, name: "R. Patel", stat: "32 wickets" },
              { rank: 2, name: "T. de Vries", stat: "28 wickets" },
              { rank: 3, name: "K. Johnson", stat: "25 wickets" },
            ]}
          />
        </section>

        {/* Join VRA Today Section */}
        <JoinVRAToday />

        {/* VRA Club Rules Section */}
        <ImageTextSectionAbout
          sectionTitle="VRA Club Rules"
          mainHeading=""
          description="Lorem ipsum dolor sit amet consectetur. Aenean tincidunt malesuada nec massa est imperdiet. Gravida arcu sed magnis urna natoque. Velit aliquam et varius lorem adipiscing quam et id vitae. Massa accumsan fringilla eros eleifend sit sem."
          imageSrc="/assets/497-4444.svg"
          imageAlt="VRA Club Rules"
          buttons={["Transparency", "Togetherness", "Collaboration", "Growth"]}
          imageLeft={true}
        />

        {/* Our Facility Section */}
        <FacilityGrid />


        <CollaborationSection />


       
      </main>
    </div>
  );
}
