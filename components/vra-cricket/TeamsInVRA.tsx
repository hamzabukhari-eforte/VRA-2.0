interface Team {
  name: string;
  count: number;
  color: "red" | "yellow" | "blue" | "white";
}

interface TeamsInVRAProps {
  teams?: Team[];
  totalCount?: number;
  tags?: string[];
  description?: string;
}

export default function TeamsInVRA({
  teams = [
    { name: "Senior Men's", count: 7, color: "red" },
    { name: "Youth", count: 9, color: "yellow" },
    { name: "Women's", count: 1, color: "blue" },
    { name: "Zalmi XI's", count: 2, color: "white" },
  ],
  totalCount = 19,
  tags = ["Teams", "Community", "Development", "Performance"],
  description = "VRA Cricket Club proudly fields 19 teams across men's, women's, youth, and Zalmis cricket, offering opportunities for every age and ambition. From elite competition to grassroots development, our teams reflect excellence, diversity, and a shared passion for the game, united as one strong cricket community",
}: TeamsInVRAProps) {
  const colorClasses = {
    red: "text-red-500",
    yellow: "text-yellow-500",
    blue: "text-blue-500",
    white: "text-white",
  };

  return (
    <section className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
      <div className="flex flex-col gap-4 md:gap-10">
        <h2 className="text-foreground dark:text-white text-2xl md:text-4xl font-medium">
          Teams in VRA
        </h2>

        <div className="flex flex-col gap-3 md:gap-16">
          {teams.map((team, index) => (
            <div key={index} className="flex justify-between items-center">
              <span className="text-foreground/70 dark:text-white/70 text-base md:text-4xl font-light md:pl-20">
                {team.name}
              </span>
              <span
                className={`${colorClasses[team.color]} text-base md:text-5xl font-normal`}
              >
                {team.count}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col md:justify-between gap-4 md:gap-8 h-full">
        {/* Total teams count */}
        <div className="flex items-center justify-center md:justify-center md:items-center lg:justify-center flex-none md:flex-1">
          <div className="text-5xl md:text-8xl lg:text-9xl font-light text-foreground dark:text-white">
            {totalCount}
          </div>
        </div>

        {/* Tags and description */}
        <div className="flex flex-col gap-3 md:gap-6">
          <div className="flex flex-wrap gap-2 md:gap-3">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 md:px-4 py-1.5 md:py-2 rounded-md border border-foreground/20 dark:border-white/20 text-foreground dark:text-white text-sm md:text-base font-normal"
              >
                {tag}
              </span>
            ))}
          </div>

          <p className="text-foreground/70 dark:text-white/70 text-sm md:text-base font-normal leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}
