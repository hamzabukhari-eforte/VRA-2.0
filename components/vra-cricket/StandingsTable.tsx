"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

interface TeamStanding {
  position: number;
  team: string;
  played: number;
  won: number;
  drawn: number; // T (ties) in the reference table
  lost: number;
  points: number;
  nr?: number; // Number of NR matches
  nrr?: number; // Net run rate
  entityId?: number; // ResultsVault entity ID for logo
  form?: ("W" | "D" | "L")[];
  // Optional metadata for static/prop-based standings so they can still be filtered
  year?: string;
  className?: string;
}

interface SeasonResponse {
  season_id: number;
  season_text: string;
  start_date: string;
}

interface GradeResponse {
  grade_id: number;
  grade_name: string;
}

interface LadderColumn {
  col_id: string;
  heading: string;
}

interface LadderDataItem {
  id: string;
  val: string;
}

interface LadderTeam {
  LadderData: LadderDataItem[];
  rank: number;
  team_name: string;
  entity_id?: number;
}

interface LadderPool {
  LadderTeams: LadderTeam[];
}

interface LadderApiResponse {
  LadderColumns: LadderColumn[];
  LadderPools: LadderPool[];
  grade_name: string;
}

// Default list of grade_ids to show in the Class dropdown.
// To skip this filter and show all grades, either:
// - pass allowedGradeIds={[]} from the parent, or
// - override with your own list.
const DEFAULT_ALLOWED_GRADE_IDS = [
  71374, 71375, 71378, 82134, 73940, 73941, 73942, 82351, 75993,
];

interface StandingsTableProps {
  title?: string;
  standings?: TeamStanding[];
  years?: string[]; // optional override for year options
  classes?: string[]; // filter options from API or props
  // Optional: restrict grades shown in the Class dropdown by grade_id.
  // Pass an empty array to disable filtering and show all grades.
  allowedGradeIds?: number[];
}

export default function StandingsTable({
  title,
  standings = [
    {
      position: 1,
      team: "VRA 1",
      played: 12,
      won: 10,
      drawn: 1,
      lost: 1,
      points: 42,
      nr: 0,
      nrr: 0,
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
      nr: 0,
      nrr: 0,
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
      nr: 0,
      nrr: 0,
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
      nr: 0,
      nrr: 0,
      form: ["D", "W", "L", "D", "W"],
    },
  ],
  years,
  classes,
  allowedGradeIds,
}: StandingsTableProps) {
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [seasons, setSeasons] = useState<SeasonResponse[]>([]);
  const [grades, setGrades] = useState<GradeResponse[]>([]);
  const [ladderStandings, setLadderStandings] = useState<TeamStanding[]>([]);
  const [isLoadingLadder, setIsLoadingLadder] = useState<boolean>(false);

  // Fetch seasons from /api/seasons on mount
  useEffect(() => {
    const fetchSeasons = async () => {
      try {
        const res = await fetch("/api/seasons");
        if (!res.ok) {
          console.error("Failed to fetch seasons", res.status, res.statusText);
          return;
        }
        const data: SeasonResponse[] = await res.json();
        setSeasons(data);
      } catch (error) {
        console.error("Failed to fetch seasons", error);
      }
    };

    fetchSeasons();
  }, []);

  // Year options: prefer explicit prop, then seasons API, then derive from standings
  const yearOptions = useMemo(() => {
    if (years && years.length > 0) {
      return [...years].sort();
    }

    if (seasons.length > 0) {
      const fromSeasons = Array.from(
        new Set(seasons.map((s) => s.season_text.trim())),
      );

      return fromSeasons.sort((a, b) => Number(b) - Number(a));
    }

    const fromStandings = Array.from(
      new Set(
        standings
          .map((s) => s.year)
          .filter((y): y is string => Boolean(y)),
      ),
    );

    return fromStandings.sort((a, b) => Number(b) - Number(a));
  }, [standings, years, seasons]);

  // Use the first (latest) year as the effective default if none is selected yet.
  const effectiveYear = selectedYear || yearOptions[0] || "";

  // Fetch grades whenever the effective year changes (and we can resolve a seasonId)
  useEffect(() => {
    if (!effectiveYear || seasons.length === 0) {
      return;
    }

    const seasonForYear = seasons.find(
      (s) => s.season_text.trim() === effectiveYear,
    );

    if (!seasonForYear) return;

    const fetchGrades = async () => {
      try {
        const res = await fetch(
          `/api/grades?seasonId=${seasonForYear.season_id}`,
        );
        if (!res.ok) {
          console.error("Failed to fetch grades", res.status, res.statusText);
          return;
        }
        const data: GradeResponse[] = await res.json();
        setGrades(data);

        // Set default class to the first allowed grade (so ladders load on page load)
        const idsToUse =
          allowedGradeIds !== undefined
            ? allowedGradeIds
            : DEFAULT_ALLOWED_GRADE_IDS;

        const filteredGrades =
          idsToUse.length > 0
            ? data.filter((g) => idsToUse.includes(g.grade_id))
            : data;

        const firstGradeName = filteredGrades[0]?.grade_name ?? "";
        setSelectedClass(firstGradeName);
      } catch (error) {
        console.error("Failed to fetch grades", error);
      }
    };

    fetchGrades();
  }, [effectiveYear, seasons, allowedGradeIds]);

  const classOptions = useMemo(() => {
    if (classes && classes.length > 0) {
      return [...classes].sort();
    }

    if (grades.length > 0) {
      const idsToUse =
        allowedGradeIds !== undefined
          ? allowedGradeIds
          : DEFAULT_ALLOWED_GRADE_IDS;

      const filteredGrades =
        idsToUse.length > 0
          ? grades.filter((g) => idsToUse.includes(g.grade_id))
          : grades;

      // Preserve the order from the grades API
      return filteredGrades.map((g) => g.grade_name).filter(Boolean);
    }

    const fromStandings = Array.from(
      new Set(
        standings
          .map((s) => s.className)
          .filter((cls): cls is string => Boolean(cls)),
      ),
    );

    return fromStandings.sort();
  }, [standings, classes, grades, allowedGradeIds]);

  // Use the first class option as the effective default if none is selected yet.
  const effectiveClass = selectedClass || classOptions[0] || "";

  // Fetch ladder whenever both effective year and class are selected
  useEffect(() => {
    if (!effectiveYear || !effectiveClass || seasons.length === 0 || grades.length === 0) {
      setIsLoadingLadder(false);
      setLadderStandings([]);
      return;
    }

    const seasonForYear = seasons.find(
      (s) => s.season_text.trim() === effectiveYear,
    );

    const gradeForClass = grades.find(
      (g) => g.grade_name === effectiveClass,
    );

    if (!seasonForYear || !gradeForClass) {
      setIsLoadingLadder(false);
      setLadderStandings([]);
      return;
    }

    const fetchLadder = async () => {
      setIsLoadingLadder(true);
      try {
        const res = await fetch(
          `/api/ladders?seasonid=${seasonForYear.season_id}&gradeid=${gradeForClass.grade_id}`,
        );
        if (!res.ok) {
          console.error("Failed to fetch ladder", res.status, res.statusText);
          setLadderStandings([]);
          return;
        }

        const json: LadderApiResponse[] | LadderApiResponse = await res.json();
        const ladderArray = Array.isArray(json) ? json : [json];
        const first = ladderArray[0];

        if (!first) {
          setLadderStandings([]);
          return;
        }

        const columns = first.LadderColumns ?? [];
        const pools = first.LadderPools ?? [];
        const teams = pools[0]?.LadderTeams ?? [];

        const findColId = (heading: string) =>
          columns.find((c) => c.heading === heading)?.col_id;

        const colPlayedId = findColId("P");
        const colWonId = findColId("W");
        const colTiedId = findColId("T");
        const colLostId = findColId("L");
        const colPointsId = findColId("Pts");
        const colNrId = findColId("NR");
        const colNrrId = findColId("NRR");

        const getValue = (team: LadderTeam, colId: string | undefined) => {
          if (!colId) return "0";
          const entry = team.LadderData.find((d) => d.id === colId);
          return entry?.val ?? "0";
        };

        const mapped: TeamStanding[] = teams.map((team) => {
          const played = Number(getValue(team, colPlayedId)) || 0;
          const won = Number(getValue(team, colWonId)) || 0;
          const drawn = Number(getValue(team, colTiedId)) || 0;
          const lost = Number(getValue(team, colLostId)) || 0;
          const points = Number.parseFloat(getValue(team, colPointsId)) || 0;
          const nr = Number(getValue(team, colNrId)) || 0;
          const nrrRaw = Number.parseFloat(getValue(team, colNrrId));
          const nrr = Number.isNaN(nrrRaw) ? undefined : nrrRaw;

          return {
            position: team.rank ?? 0,
            team: team.team_name ?? "Unknown",
            played,
            won,
            drawn,
            lost,
            points,
            nr,
            nrr,
            entityId: team.entity_id,
          };
        });

        // Ensure sorted by position (ascending)
        setLadderStandings(
          mapped.slice().sort((a, b) => a.position - b.position),
        );
      } catch (error) {
        console.error("Failed to fetch ladder", error);
        setLadderStandings([]);
      } finally {
        setIsLoadingLadder(false);
      }
    };

    fetchLadder();
  }, [effectiveYear, effectiveClass, seasons, grades]);

  const tableTitle =
    title ??
    (effectiveClass
      ? `${effectiveClass} - League Table`
      : "Division 1 - League Table");

  return (
    <section className="w-full">
      <div className="mb-4 md:mb-6 flex flex-col gap-3 md:flex-row md:items-bottom md:justify-between">
        <h2 className="text-foreground dark:text-white text-3xl md:text-4xl lg:text-[48px] font-light mb-6 md:mb-8">
          Standings
        </h2>
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs md:text-sm text-foreground/60 dark:text-white/60">
              Year
            </label>
            <select
              className="bg-[#1f1f1f] dark:bg-[#1f1f1f] border border-white/10 rounded-md px-3 py-2 text-xs md:text-sm text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/60"
              value={effectiveYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              {yearOptions.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs md:text-sm text-foreground/60 dark:text-white/60">
              Class
            </label>
            <select
              className="bg-[#1f1f1f] dark:bg-[#1f1f1f] border border-white/10 rounded-md px-3 py-2 text-xs md:text-sm text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/60"
              value={effectiveClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              {classOptions.map((cls) => (
                <option key={cls} value={cls}>
                  {cls}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-[#2a2a2a] dark:bg-[#2a2a2a] rounded-lg overflow-hidden">
        <div className="p-4 md:p-6">
          <h3 className="text-foreground dark:text-white text-lg md:text-xl font-medium mb-4">
            {tableTitle}
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
                    T
                  </th>
                  <th className="text-center py-3 px-2 md:px-4 text-foreground/50 dark:text-white/50 text-xs md:text-sm font-normal">
                    L
                  </th>
                  <th className="text-center py-3 px-2 md:px-4 text-foreground/50 dark:text-white/50 text-xs md:text-sm font-normal">
                    NR
                  </th>
                  <th className="text-center py-3 px-2 md:px-4 text-foreground/50 dark:text-white/50 text-xs md:text-sm font-normal">
                    Pts
                  </th>
                  <th className="text-center py-3 px-2 md:px-4 text-foreground/50 dark:text-white/50 text-xs md:text-sm font-normal">
                    NRR
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoadingLadder ? (
                  <tr>
                    <td
                      className="py-4 px-4 text-center text-foreground/60 dark:text-white/60 text-xs md:text-sm"
                      colSpan={9}
                    >
                      Loading ladder for the selected year and class...
                    </td>
                  </tr>
                ) : ladderStandings.length > 0 ? (
                  ladderStandings.map((standing) => (
                    <tr
                      key={standing.position}
                      className="border-b border-white/5 hover:bg-white/5"
                    >
                      <td className="py-3 px-2 md:px-4 text-foreground dark:text-white text-xs md:text-sm font-normal">
                        {standing.position}
                      </td>
                      <td className="py-3 px-2 md:px-4 text-foreground dark:text-white text-xs md:text-sm font-medium">
                        <div className="flex items-center gap-2">
                          {standing.entityId ? (
                            // Logo URL as provided by ResultsVault, using team name as text
                            // Example: https://api.resultsvault.co.uk/logo.ashx?txt=VRA&width=90&mode=2&entityid=134466
                            <Image
                              src={`https://api.resultsvault.co.uk/logo.ashx?txt=${encodeURIComponent(
                                standing.team,
                              )}&width=40&mode=2&entityid=${standing.entityId}`}
                              alt={standing.team}
                              width={32}
                              height={32}
                              className="h-6 w-6 md:h-8 md:w-8 object-contain rounded-sm bg-white/5"
                            />
                          ) : null}
                          <span>{standing.team}</span>
                        </div>
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
                      <td className="text-center py-3 px-2 md:px-4 text-foreground dark:text-white text-xs md:text-sm font-normal">
                        {standing.nr ?? 0}
                      </td>
                      <td className="text-center py-3 px-2 md:px-4 text-foreground dark:text-white text-xs md:text-sm font-bold">
                        {standing.points}
                      </td>
                      <td className="text-center py-3 px-2 md:px-4 text-foreground dark:text-white text-xs md:text-sm font-normal">
                        {typeof standing.nrr === "number"
                          ? standing.nrr.toFixed(2)
                          : "-"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      className="py-4 px-4 text-center text-foreground/60 dark:text-white/60 text-xs md:text-sm"
                      colSpan={9}
                    >
                      No ladder data available for the selected year and class.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

