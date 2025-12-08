interface Player {
  rank: number;
  name: string;
  stat: string;
}

interface TopPlayersProps {
  title: string;
  players?: Player[];
}

export default function TopPlayers({
  title,
  players = [],
}: TopPlayersProps) {
  return (
    <div className="bg-[#2a2a2a] dark:bg-[#2a2a2a] rounded-lg p-4 md:p-6">
      <h3 className="text-foreground dark:text-white text-lg md:text-xl font-medium mb-4 md:mb-6">
        {title}
      </h3>
      <div className="flex flex-col gap-3 md:gap-4">
        {players.map((player) => (
          <div
            key={player.rank}
            className="flex justify-between items-center pb-3 border-b border-white/10"
          >
            <div className="flex items-center gap-2 md:gap-3">
              <span className="text-foreground/50 dark:text-white/50 text-xs md:text-sm font-normal">
                {player.rank}
              </span>
              <span className="text-foreground dark:text-white text-sm md:text-base font-medium">
                {player.name}
              </span>
            </div>
            <span className="text-foreground dark:text-white text-sm md:text-base font-bold">
              {player.stat}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

