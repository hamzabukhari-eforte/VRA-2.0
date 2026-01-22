import HeroBanner from "@/components/about/HeroBanner";
import TeamsInVRA from "@/components/vra-cricket/TeamsInVRA";
import ImageTextSectionAbout from "@/components/about/ImageTextSection";
import FixturesCards from "@/components/vra-cricket/FixturesCards";
import StandingsTable from "@/components/vra-cricket/StandingsTable";
import TopPlayers from "@/components/vra-cricket/TopPlayers";
import JoinVRAToday from "@/components/vra-cricket/JoinVRAToday";
import FacilityImageCarousel from "@/components/facility/FacilityImageCarousel";
import CollaborationSection from "@/components/shared/CollaborationSection";

export default function VRACricketPage() {
  return (
    <div className="min-h-screen dark:bg-[#202020] bg-background text-foreground dark:text-white overflow-x-hidden">
      {/* Hero Section */}
      <HeroBanner
        imageSrc="/assets/vra-cricket/vra-cricket-banner.jpg"
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
          buttons={["International", "Talent", "Excellence", "Opportunity"]}
          description="VRA Cricket Club attracts top overseas cricket talent each season, providing a platform to compete, grow, and make a lasting impact. Our multicultural, high-performance environment combines quality facilities with strong support, enabling international players to showcase their skills while contributing to the club&apos;s continued success."
          imageSrc="/assets/vra-cricket/overseas-talent.jpg"
          imageAlt="Over Seas Cricket Talent"
        />

        {/* Stem Clinics Section */}
        <ImageTextSectionAbout
          imageLeft={true}
          sectionTitle=""
          mainHeading="Sports Clinics"
          buttons={["Training", "Development", "Coaching", "Teamwork"]}
          description="Our facilities provide an inspiring setting for sports clinics with schools, academies, and corporate groups. Featuring indoor and outdoor training areas, expert coaching spaces, and support amenities, VRA is perfect for skill development, team building, leadership programs, and structured sports education."
          imageSrc="/assets/facility/clinics.jpg"
          imageAlt="Sport Clinics"
        />

        {/* Culture Section */}
        <ImageTextSectionAbout
          imageLeft={false}
          sectionTitle=""
          mainHeading="Cultural Events"
          buttons={["Community", "Celebrations", "Festivals", "Gatherings"]}
          description="Beyond sport, VRA Cricket Club is a versatile venue for cultural and community events. The grounds and pavilion can host festivals, performances, celebrations, and corporate gatherings, offering ample space, catering facilities, and a welcoming atmosphere that brings people together."
          imageSrc="/assets/facility/cultural-events.jpg"
          imageAlt="Cultural Events"
        />

        {/* Sport Events Section */}
        <ImageTextSectionAbout
          imageLeft={true}
          sectionTitle=""
          mainHeading="Sports Events"
          buttons={["Tournaments", "Competition", "Matchday", "Excellence"]}
          description="VRA Cricket Club offers world-class facilities ideal for hosting professional and amateur sports events. With international-standard grounds, modern infrastructure, and excellent spectator amenities, the venue supports tournaments, leagues, exhibitions, and multi-sport events in a well-managed, scenic environment."
          imageSrc="/assets/facility/sports-events.jpg"
          imageAlt="Sport Events"
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

        {/* Our Facility Section */}
        <section className="w-full">
          <h2 className="text-foreground dark:text-white text-3xl md:text-4xl lg:text-[48px] font-light mb-6 md:mb-8">
            Our Facility
          </h2>
          <FacilityImageCarousel
            images={[
              { src: "/assets/facility/Ground 1.jpg", alt: "Ground 1", width: 1920, height: 1080 },
              { src: "/assets/facility/Ground 1_1.jpg", alt: "Ground 2", width: 1920, height: 1080 },
              { src: "/assets/facility/Ground 1_2.jpg", alt: "Ground 3", width: 1920, height: 1080 },
              { src: "/assets/facility/Outdoor Nets.jpg", alt: "Outdoor Nets", width: 1920, height: 1080 },
              { src: "/assets/facility/Indoor Nets.jpg", alt: "Indoor Nets", width: 1920, height: 1080 },
              { src: "/assets/facility/Pavilion.jpg", alt: "Pavilion", width: 1920, height: 1080 },
              { src: "/assets/facility/clinics.jpg", alt: "Sports Clinics", width: 1920, height: 1080 },
              { src: "/assets/facility/sports-events.jpg", alt: "Sports Events", width: 1920, height: 1080 },
              { src: "/assets/facility/cultural-events.jpg", alt: "Cultural Events", width: 1920, height: 1080 },
            ]}
          />
        </section>


        <CollaborationSection />


       
      </main>
    </div>
  );
}
