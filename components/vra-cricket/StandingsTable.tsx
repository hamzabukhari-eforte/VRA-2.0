interface TeamStanding {
  position: number;
  team: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  points: number;
  form: ("W" | "D" | "L")[];
}

interface StandingsTableProps {
  title?: string;
  standings?: TeamStanding[];
}

export default function StandingsTable({
  title = "Division 1 - League Table",
  standings = [
    {
      position: 1,
      team: "VRA 1",
      played: 12,
      won: 10,
      drawn: 1,
      lost: 1,
      points: 42,
      form: ["W", "W", "W", "W", "W"],
    },
    {
      position: 2,
      team: "ACC",
      played: 12,
      won: 9,
      drawn: 2,
      lost: 1,
      points: 38,
      form: ["W", "D", "W", "W", "W"],
    },
    {
      position: 3,
      team: "Quick",
      played: 12,
      won: 8,
      drawn: 1,
      lost: 3,
      points: 33,
      form: ["L", "W", "W", "L", "W"],
    },
    {
      position: 4,
      team: "HCC",
      played: 12,
      won: 6,
      drawn: 3,
      lost: 3,
      points: 27,
      form: ["D", "W", "L", "D", "W"],
    },
  ],
}: StandingsTableProps) {
  const getFormColor = (result: "W" | "D" | "L") => {
    if (result === "W") return "bg-green-500";
    if (result === "D") return "bg-gray-500";
    return "bg-red-500";
  };

  return (
    <section className="w-full">
      <h2 className="text-foreground dark:text-white text-3xl md:text-4xl lg:text-[48px] font-light mb-6 md:mb-8">
        Standings
      </h2>

      <div className="bg-[#2a2a2a] dark:bg-[#2a2a2a] rounded-lg overflow-hidden">
        <div className="p-4 md:p-6">
          <h3 className="text-foreground dark:text-white text-lg md:text-xl font-medium mb-4">
            {title}
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-2 md:px-4 text-foreground/50 dark:text-white/50 text-xs md:text-sm font-normal">
                    Pos
                  </th>
                  <th className="text-left py-3 px-2 md:px-4 text-foreground/50 dark:text-white/50 text-xs md:text-sm font-normal">
                    Team
                  </th>
                  <th className="text-center py-3 px-2 md:px-4 text-foreground/50 dark:text-white/50 text-xs md:text-sm font-normal">
                    P
                  </th>
                  <th className="text-center py-3 px-2 md:px-4 text-foreground/50 dark:text-white/50 text-xs md:text-sm font-normal">
                    W
                  </th>
                  <th className="text-center py-3 px-2 md:px-4 text-foreground/50 dark:text-white/50 text-xs md:text-sm font-normal">
                    D
                  </th>
                  <th className="text-center py-3 px-2 md:px-4 text-foreground/50 dark:text-white/50 text-xs md:text-sm font-normal">
                    L
                  </th>
                  <th className="text-center py-3 px-2 md:px-4 text-foreground/50 dark:text-white/50 text-xs md:text-sm font-normal">
                    Pts
                  </th>
                  <th className="text-center py-3 px-2 md:px-4 text-foreground/50 dark:text-white/50 text-xs md:text-sm font-normal">
                    Form
                  </th>
                </tr>
              </thead>
              <tbody>
                {standings.map((standing) => (
                  <tr
                    key={standing.position}
                    className="border-b border-white/5 hover:bg-white/5"
                  >
                    <td className="py-3 px-2 md:px-4 text-foreground dark:text-white text-xs md:text-sm font-normal">
                      {standing.position}
                    </td>
                    <td className="py-3 px-2 md:px-4 text-foreground dark:text-white text-xs md:text-sm font-medium">
                      {standing.team}
                    </td>
                    <td className="text-center py-3 px-2 md:px-4 text-foreground dark:text-white text-xs md:text-sm font-normal">
                      {standing.played}
                    </td>
                    <td className="text-center py-3 px-2 md:px-4 text-foreground dark:text-white text-xs md:text-sm font-normal">
                      {standing.won}
                    </td>
                    <td className="text-center py-3 px-2 md:px-4 text-foreground dark:text-white text-xs md:text-sm font-normal">
                      {standing.drawn}
                    </td>
                    <td className="text-center py-3 px-2 md:px-4 text-foreground dark:text-white text-xs md:text-sm font-normal">
                      {standing.lost}
                    </td>
                    <td className="text-center py-3 px-2 md:px-4 text-foreground dark:text-white text-xs md:text-sm font-bold">
                      {standing.points}
                    </td>
                    <td className="text-center py-3 px-2 md:px-4">
                      <div className="flex gap-1 justify-center">
                        {standing.form.map((result, idx) => (
                          <div
                            key={idx}
                            className={`w-4 h-4 md:w-5 md:h-5 ${getFormColor(
                              result
                            )} rounded-sm flex items-center justify-center text-white text-[10px] md:text-xs`}
                          >
                            {result}
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

