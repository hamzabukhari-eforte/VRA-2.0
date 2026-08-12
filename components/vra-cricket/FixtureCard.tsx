interface FixtureCardProps {
  divisionColor: "blue" | "red" | "purple" | "green";
  team1: string;
  team2: string;
  date: string;
  time: string;
  venue: string;
  status?: "upcoming" | "result" | "draw";
  /** KNCB `leader_text` — shown in the top-left label */
  labelText?: string | null;
  winnerSide?: "home" | "away" | "draw" | null;
  /** e.g. "172/3" from Innings runs/wickets */
  team1Score?: string | null;
  team2Score?: string | null;
}

export default function FixtureCard({
  divisionColor,
  team1,
  team2,
  date,
  time,
  venue,
  status = "upcoming",
  labelText = null,
  winnerSide = null,
  team1Score = null,
  team2Score = null,
}: FixtureCardProps) {
  const colorClasses = {
    blue: "bg-blue-500",
    red: "bg-red-500",
    purple: "bg-purple-500",
    green: "bg-green-500",
  };

  const isUpcoming = status === "upcoming";
  const homeWon = winnerSide === "home";
  const awayWon = winnerSide === "away";
  const hasScores = Boolean(team1Score || team2Score);

  const teamClass = (won: boolean, lost: boolean) => {
    if (isUpcoming || (!won && !lost && status !== "draw")) {
      return "text-foreground dark:text-white font-medium";
    }
    if (won) return "text-foreground dark:text-white font-semibold";
    if (lost || status === "draw") {
      return "text-foreground/45 dark:text-white/45 font-medium";
    }
    return "text-foreground dark:text-white font-medium";
  };

  const scoreClass = (won: boolean, lost: boolean) => {
    if (isUpcoming) return "text-foreground/50 dark:text-white/50";
    if (won) return "text-foreground/80 dark:text-white/80";
    if (lost || status === "draw") return "text-foreground/40 dark:text-white/40";
    return "text-foreground/50 dark:text-white/50";
  };

  return (
    <div className="bg-[#2a2a2a] dark:bg-[#2a2a2a] rounded-lg p-4 md:p-6 flex flex-col gap-3 md:gap-4">
      <div className="flex items-center gap-2 min-w-0">
        <div className={`w-2 h-2 shrink-0 ${colorClasses[divisionColor]} rounded-full`} />
        {isUpcoming ? (
          <span className="shrink-0 rounded-full px-2 py-0.5 text-[10px] md:text-xs font-medium uppercase tracking-wide bg-[#4A90E2]/10 text-[#7eb3f0]">
            Upcoming
          </span>
        ) : labelText ? (
          <span className="text-foreground/70 dark:text-white/70 text-xs md:text-sm font-normal truncate">
            {labelText}
          </span>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span className={`text-sm md:text-base ${teamClass(homeWon, awayWon)}`}>
              {team1}
            </span>
            {hasScores ? (
              <span className={`text-xs md:text-sm tabular-nums ${scoreClass(homeWon, awayWon)}`}>
                {team1Score || "—"}
              </span>
            ) : null}
          </div>

          <span className="pt-0.5 text-foreground/40 dark:text-white/40 text-sm md:text-base font-medium shrink-0">
            vs
          </span>

          <div className="flex min-w-0 flex-1 flex-col items-end gap-0.5 text-right">
            <span className={`text-sm md:text-base ${teamClass(awayWon, homeWon)}`}>
              {team2}
            </span>
            {hasScores ? (
              <span className={`text-xs md:text-sm tabular-nums ${scoreClass(awayWon, homeWon)}`}>
                {team2Score || "—"}
              </span>
            ) : null}
          </div>
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
