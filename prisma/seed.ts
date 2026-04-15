import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/** Facility page copy as of the static `app/facility/page.tsx` defaults (text, headings, tags only). */
const facilitySectionSeed = [
  {
    slug: "facility_hero",
    sectionTitle: null,
    mainHeading: "Facility",
    description: null,
    tags: null,
  },
  {
    slug: "ground_1",
    sectionTitle: null,
    mainHeading: "Ground 1",
    description:
      "Our premier international-standard ground features a meticulously prepared square, lush outfield, and professional playing conditions. Designed to host top-level domestic and international matches, Ground 1 offers excellent sightlines, broadcast-ready infrastructure, and an exceptional experience for players, officials, and spectators alike.",
    tags: null,
  },
  {
    slug: "ground_2",
    sectionTitle: null,
    mainHeading: "Ground 2",
    description:
      "Ground 2 provides high-quality playing conditions ideal for league matches, training games, and tournaments. With a well-maintained pitch and outfield, it supports competitive cricket at all levels while offering a comfortable and accessible environment for teams and match officials.",
    tags: null,
  },
  {
    slug: "ground_3",
    sectionTitle: null,
    mainHeading: "Ground 3",
    description:
      "Ground 3 is a versatile facility suited for development matches, junior cricket, and practice games. Maintained to club standards, it offers consistent pitch conditions and ample space, making it perfect for nurturing talent and supporting the club's growing cricketing community.",
    tags: null,
  },
  {
    slug: "outdoor_nets",
    sectionTitle: null,
    mainHeading: "Outdoor Nets",
    description:
      "Our outdoor net facilities allow players to train in natural conditions across multiple practice lanes. Ideal for batting, bowling, and fielding drills, the nets are designed to support structured coaching sessions and individual practice throughout the cricket season.",
    tags: null,
  },
  {
    slug: "indoor_nets",
    sectionTitle: null,
    mainHeading: "Indoor Nets",
    description:
      "The indoor nets provide year-round training in a controlled environment, regardless of weather. Equipped with quality surfaces, lighting and even a bowling machine, they are perfect for focused skill development, coaching programs, and high-intensity practice sessions during the off-season.",
    tags: null,
  },
  {
    slug: "pavilion",
    sectionTitle: null,
    mainHeading: "Pavilion",
    description:
      "The pavilion is the social and operational heart of the club. Offering seating, viewing areas, and event space, it serves players, members, and guests alike, creating a welcoming atmosphere on match days, training evenings, and club events.",
    tags: null,
  },
  {
    slug: "changing_rooms",
    sectionTitle: null,
    mainHeading: "Changing rooms",
    description:
      "Spacious and well-equipped changing rooms provide comfort and convenience for players and officials. Featuring secure storage, showers, and modern amenities, they ensure teams can prepare and recover in a professional and relaxed environment before and after matches.",
    tags: null,
  },
  {
    slug: "cafeteria",
    sectionTitle: null,
    mainHeading: "Cafeteria",
    description:
      "The cafeteria offers a relaxed space to enjoy refreshments, snacks, and light meals. Overlooking the grounds, it is a popular spot for players, families, and spectators to unwind, socialize, and enjoy the vibrant atmosphere of match days.",
    tags: null,
  },
  {
    slug: "kitchen",
    sectionTitle: null,
    mainHeading: "Kitchen",
    description:
      "Our fully equipped kitchen supports match catering, events, and club functions. Designed for efficiency and hygiene, it enables the preparation of meals and refreshments, ensuring quality service for players, officials, members, and visiting teams.",
    tags: null,
  },
  {
    slug: "bar",
    sectionTitle: null,
    mainHeading: "Bar",
    description:
      "The club bar is a welcoming social hub for members and guests. Offering a range of beverages in a friendly setting, it's the perfect place to celebrate victories, discuss the day's play, and strengthen the club's sense of community.",
    tags: null,
  },
  {
    slug: "sports_events",
    sectionTitle: null,
    mainHeading: "Sports Events",
    description:
      "VRA Cricket Club offers world-class facilities ideal for hosting professional and amateur sports events. With international-standard grounds, modern infrastructure, and excellent spectator amenities, the venue supports tournaments, leagues, exhibitions, and multi-sport events in a well-managed, scenic environment.",
    tags: ["Tournaments", "Competition", "Matchday", "Excellence"],
  },
  {
    slug: "sports_clinics",
    sectionTitle: null,
    mainHeading: "Sports Clinics",
    description:
      "Our facilities provide an inspiring setting for sports clinics with schools, academies, and corporate groups. Featuring indoor and outdoor training areas, expert coaching spaces, and support amenities, VRA is perfect for skill development, team building, leadership programs, and structured sports education.",
    tags: ["Training", "Development", "Coaching", "Teamwork"],
  },
  {
    slug: "cultural_events",
    sectionTitle: null,
    mainHeading: "Cultural Events",
    description:
      "Beyond sport, VRA Cricket Club is a versatile venue for cultural and community events. The grounds and pavilion can host festivals, performances, celebrations, and corporate gatherings, offering ample space, catering facilities, and a welcoming atmosphere that brings people together.",
    tags: ["Community", "Celebrations", "Festivals", "Gatherings"],
  },
];

async function main() {
  for (const row of facilitySectionSeed) {
    await prisma.sharedSection.upsert({
      where: { slug: row.slug },
      create: {
        slug: row.slug,
        imagePath: null,
        sectionTitle: row.sectionTitle,
        mainHeading: row.mainHeading,
        description: row.description,
        tags:
          row.tags == null ? Prisma.DbNull : (row.tags as Prisma.InputJsonValue),
      },
      update: {
        sectionTitle: row.sectionTitle,
        mainHeading: row.mainHeading,
        description: row.description,
        tags:
          row.tags == null ? Prisma.DbNull : (row.tags as Prisma.InputJsonValue),
      },
    });
  }
}

main()
  .then(() => {
    console.log("Facility section text seed complete.");
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
