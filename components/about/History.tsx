import Image from "next/image";

export default function History() {
  return (
    <section className="w-full flex flex-col items-center gap-12">
      <h2 className="text-foreground dark:text-white text-xl md:text-3xl font-medium ">
        History
      </h2>

      <div className="relative w-full h-[80vh]">
        <Image
          src="/assets/350-1709.webp"
          alt="History"
          fill
          className="rounded-lg object-cover"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
        <div className="flex flex-col gap-4">
          <p className="text-foreground dark:text-white text-sm md:text-lg font-normal leading-relaxed">
            VRA is one of the oldest and leading cricket clubs in the Netherlands.
            We have a beautiful NOC-NSF accommodation with international AAA status
            and have been the home of the Dutch Cricket Team for years. International
            matches are played annually on our main ground, featuring the Netherlands
            against major cricket nations like England, Australia, India, Pakistan,
            South Africa, and Sri Lanka. We also welcome touring teams from around
            the world.
          </p>
          <p className="text-foreground dark:text-white text-sm md:text-lg font-normal leading-relaxed">
            VRA, as an Amsterdam Sports Association, is represented at all levels
            of Dutch Cricket, including the Topklasse (1st team) in the highest
            regions, competitive teams on Sundays and Saturdays, the recreational
            Zami competition, the Topklasse Women&apos;s team, and various youth teams
            across all age categories. VRA also accommodates company teams.
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <p className="text-foreground dark:text-white text-sm md:text-lg font-normal leading-relaxed">
            VRA hosts company teams with players from all over the world. We are
            the host of the largest cricket event in the Netherlands, the famous
            India Day, and make a big impression on guests, players, and officials.
            Cricket at VRA promotes responsible sports at all levels, offering
            training with the best international coaches, and providing a rich
            club life on one of the most beautiful sports fields in the Netherlands.
          </p>
          <p className="text-foreground dark:text-white text-sm md:text-lg font-normal leading-relaxed">
            The club reflects the city of Amsterdam with a diverse mix of cricket
            families and a sizable expat community. The club&apos;s breadth ensures
            there&apos;s a team for everyone, matching their level and ambition. As a
            multicultural club, VRA anticipates a growing membership base with
            players from almost all continents, emphasizing that cricket connects
            people, especially at VRA in the Amsterdamse Bos.
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <p className="text-foreground dark:text-white text-sm md:text-lg font-normal leading-relaxed">
            For decades, people of various nationalities and backgrounds—including
            English, Scots, Welsh, Indians, Australians, Surinamese, New Zealanders,
            Pakistanis, Afghans, West Indians, South Africans, Zimbabweans, Sri
            Lankans, and native Dutch—have been playing together at VRA. We are
            proud of this special mix of cultures, while also ensuring that the
            balance and our unique &apos;club culture&apos; remain intact.
          </p>
        </div>
      </div>
    </section>
  );
}

