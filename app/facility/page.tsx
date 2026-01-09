import ImageTextSection from "@/components/about/ImageTextSection";
import CollaborationSection from "@/components/shared/CollaborationSection";

export default function FacilityPage() {
  return (
    <div className="min-h-screen dark:bg-[#202020] bg-background text-foreground overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative h-screen w-full">
        <video
          src="/assets/facility/Facility Video.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover object-top"
        />
        {/* Black Overlay */}
        <div
          className="absolute inset-0 bg-black"
          style={{ opacity: 0.4 }}
        />
        {/* Hero Content Overlay */}
        <div className="absolute inset-0 flex items-end justify-start px-6 sm:px-12 md:px-16 lg:px-[108px] pb-8 md:pb-12">
          <h1 className="text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-9xl font-light">
            Facility
          </h1>
        </div>
      </section>

      {/* Main Content */}
      <main className="w-full max-w-[1280px] mx-auto flex flex-col items-start gap-[80px] pt-[79px] px-8 pb-20">
      <CollaborationSection />

        <ImageTextSection
          imageLeft={false}
          sectionTitle=""
          mainHeading="Ground 1"
          buttons={[]}
          description="Our premier international-standard ground features a meticulously prepared square, lush outfield, and professional playing conditions. Designed to host top-level domestic and international matches, Ground 1 offers excellent sightlines, broadcast-ready infrastructure, and an exceptional experience for players, officials, and spectators alike."
          imageSrc="/assets/facility/Ground 1.jpg"
          imageAlt="Ground 1"
        />

        <ImageTextSection
          imageLeft={true}
          sectionTitle=""
          mainHeading="Ground 2"
          buttons={[]}
          description="Ground 2 provides high-quality playing conditions ideal for league matches, training games, and tournaments. With a well-maintained pitch and outfield, it supports competitive cricket at all levels while offering a comfortable and accessible environment for teams and match officials."
          imageSrc="/assets/facility/Ground 1_1.jpg"
          imageAlt="Ground 2"
        />

        <ImageTextSection
          imageLeft={false}
          sectionTitle=""
          mainHeading="Ground 3"
          buttons={[]}
          description="Ground 3 is a versatile facility suited for development matches, junior cricket, and practice games. Maintained to club standards, it offers consistent pitch conditions and ample space, making it perfect for nurturing talent and supporting the club's growing cricketing community."
          imageSrc="/assets/facility/Ground 1_2.jpg"
          imageAlt="Ground 3"
        />

        <ImageTextSection
          imageLeft={true}
          sectionTitle=""
          mainHeading="Outdoor Nets"
          buttons={[]}
          description="Our outdoor net facilities allow players to train in natural conditions across multiple practice lanes. Ideal for batting, bowling, and fielding drills, the nets are designed to support structured coaching sessions and individual practice throughout the cricket season."
          imageSrc="/assets/facility/Outdoor Nets.jpg"
          imageAlt="Outdoor Nets"
        />

        <ImageTextSection
          imageLeft={false}
          sectionTitle=""
          mainHeading="Indoor Nets"
          buttons={[]}
          description="The indoor nets provide year-round training in a controlled environment, regardless of weather. Equipped with quality surfaces, lighting and even a bowling machine, they are perfect for focused skill development, coaching programs, and high-intensity practice sessions during the off-season."
          imageSrc="/assets/facility/Indoor Nets.jpg"
          imageAlt="Indoor Nets"
        />

        <ImageTextSection
          imageLeft={true}
          sectionTitle=""
          mainHeading="Pavilion"
          buttons={[]}
          description="The pavilion is the social and operational heart of the club. Offering seating, viewing areas, and event space, it serves players, members, and guests alike, creating a welcoming atmosphere on match days, training evenings, and club events."
          imageSrc="/assets/facility/Pavilion.jpg"
          imageAlt="Pavilion"
        />

        <ImageTextSection
          imageLeft={false}
          sectionTitle=""
          mainHeading="Changing rooms"
          buttons={[]}
          description="Spacious and well-equipped changing rooms provide comfort and convenience for players and officials. Featuring secure storage, showers, and modern amenities, they ensure teams can prepare and recover in a professional and relaxed environment before and after matches."
          imageSrc="/assets/facility/Square Room.png"
          imageAlt="Changing Rooms"
        />

        <ImageTextSection
          imageLeft={true}
          sectionTitle=""
          mainHeading="Cafeteria"
          buttons={[]}
          description="The cafeteria offers a relaxed space to enjoy refreshments, snacks, and light meals. Overlooking the grounds, it is a popular spot for players, families, and spectators to unwind, socialize, and enjoy the vibrant atmosphere of match days."
          imageSrc="/assets/facility/Cafeteria.png"
          imageAlt="Cafeteria"
        />

        <ImageTextSection
          imageLeft={false}
          sectionTitle=""
          mainHeading="Kitchen"
          buttons={[]}
          description="Our fully equipped kitchen supports match catering, events, and club functions. Designed for efficiency and hygiene, it enables the preparation of meals and refreshments, ensuring quality service for players, officials, members, and visiting teams."
          imageSrc="/assets/facility/Kitchen.png"
          imageAlt="Kitchen"
        />

        <ImageTextSection
          imageLeft={true}
          sectionTitle=""
          mainHeading="Bar"
          buttons={[]}
          description="The club bar is a welcoming social hub for members and guests. Offering a range of beverages in a friendly setting, it's the perfect place to celebrate victories, discuss the day's play, and strengthen the club's sense of community."
          imageSrc="/assets/facility/Bar.png"
          imageAlt="Bar"
        />

        <ImageTextSection
          imageLeft={false}
          sectionTitle=""
          mainHeading="Sports Events"
          buttons={["Tournaments", "Competition", "Matchday", "Excellence"]}
          description="VRA Cricket Club offers world-class facilities ideal for hosting professional and amateur sports events. With international-standard grounds, modern infrastructure, and excellent spectator amenities, the venue supports tournaments, leagues, exhibitions, and multi-sport events in a well-managed, scenic environment."
          imageSrc="/assets/facility/Ground 1_3.jpg"
          imageAlt="Sport Events"
        />

        <ImageTextSection
          imageLeft={true}
          sectionTitle=""
          mainHeading="Sports Clinics"
          buttons={["Training", "Development", "Coaching", "Teamwork"]}
          description="Our facilities provide an inspiring setting for sports clinics with schools, academies, and corporate groups. Featuring indoor and outdoor training areas, expert coaching spaces, and support amenities, VRA is perfect for skill development, team building, leadership programs, and structured sports education."
          imageSrc="/assets/facility/Indoor Nets.jpg"
          imageAlt="Sport Clinics"
        />

        <ImageTextSection
          imageLeft={false}
          sectionTitle=""
          mainHeading="Cultural Events"
          buttons={["Community", "Celebrations", "Festivals", "Gatherings"]}
          description="Beyond sport, VRA Cricket Club is a versatile venue for cultural and community events. The grounds and pavilion can host festivals, performances, celebrations, and corporate gatherings, offering ample space, catering facilities, and a welcoming atmosphere that brings people together."
          imageSrc="/assets/facility/Pavilion.jpg"
          imageAlt="Cultural Events"
        />

        <CollaborationSection />
      </main>
    </div>
  );
}
