interface FixtureCardProps {
  division: string;
  divisionColor: "blue" | "red" | "purple" | "green";
  team1: string;
  team2: string;
  date: string;
  time: string;
  venue: string;
}

export default function FixtureCard({
  division,
  divisionColor,
  team1,
  team2,
  date,
  time,
  venue,
}: FixtureCardProps) {
  const colorClasses = {
    blue: "bg-blue-500",
    red: "bg-red-500",
    purple: "bg-purple-500",
    green: "bg-green-500",
  };

  return (
    <div className="bg-[#2a2a2a] dark:bg-[#2a2a2a] rounded-lg p-4 md:p-6 flex flex-col gap-3 md:gap-4">
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 ${colorClasses[divisionColor]} rounded-full`} />
        <span className="text-foreground/50 dark:text-white/50 text-xs md:text-sm font-normal">
          {division}
        </span>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-foreground dark:text-white text-sm md:text-base font-medium">
            {team1}
          </span>
          <span className="text-foreground dark:text-white text-sm md:text-base font-medium">
            vs
          </span>
          <span className="text-foreground dark:text-white text-sm md:text-base font-medium">
            {team2}
          </span>
        </div>
        <div className="text-foreground/50 dark:text-white/50 text-xs md:text-sm font-normal">
          {date}
        </div>
        <div className="text-foreground/50 dark:text-white/50 text-xs md:text-sm font-normal">
          {time}
        </div>
        <div className="text-foreground/50 dark:text-white/50 text-xs md:text-sm font-normal">
          {venue}
        </div>
      </div>
    </div>
  );
}

