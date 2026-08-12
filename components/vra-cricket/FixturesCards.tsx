"use client";

import { useEffect, useMemo, useState } from "react";
import FixtureCard from "./FixtureCard";

interface Fixture {
  division: string;
  divisionColor: "blue" | "red" | "purple" | "green";
  team1: string;
  team2: string;
  date: string;
  time: string;
  venue: string;
  // Optional extra fields when coming from the API
  year?: string;
  className?: string; // "class" is reserved, so we use className
  status?: "upcoming" | "result" | "draw";
  /** KNCB `leader_text` shown in the card label */
  labelText?: string | null;
  winnerSide?: "home" | "away" | "draw" | null;
  /** Formatted score from Innings, e.g. "172/3" */
  team1Score?: string | null;
  team2Score?: string | null;
}

interface FixturesCardsProps {
  fixtures?: Fixture[];
  years?: string[]; // optional override for year options
  classes?: string[]; // filter options from API
  // Optional: restrict grades shown in the Class dropdown by grade_id.
  // Pass an empty array to disable filtering and show all grades.
  allowedGradeIds?: number[];
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

interface MatchInnings {
  runs?: number;
  wickets?: number;
  overs_bowled?: number | null;
  close_type_abbrev?: string | null;
  innings_number?: number;
  innings_order?: number;
}

interface MatchTeam {
  is_home?: boolean;
  team_name?: string;
  club_name?: string;
  match_score_text?: string | null;
  /** 2 = won, 1 = lost (KNCB sample) */
  result_flag?: number | null;
  Innings?: MatchInnings[] | null;
}

interface MatchResponse {
  date1: string | null;
  home_name: string;
  away_name: string;
  venue_name: string | null;
  grade_name: string;
  /** Result summary from KNCB / ResultsVault (e.g. "VRA won by 6 wickets") */
  leader_text?: string | null;
  score_text?: string | null;
  winner?: string | null;
  winner_name?: string | null;
  winning_team?: string | null;
  winning_team_name?: string | null;
  MatchTeams?: MatchTeam[] | null;
}

// Default list of grade_ids to show in the Class dropdown.
// To skip this filter and show all grades, either:
// - pass allowedGradeIds={[]} from the parent, or
// - override with your own list.
const DEFAULT_ALLOWED_GRADE_IDS = [
  71374, 71375, 71378, 82134, 73940, 73941, 73942, 82351, 75993,
];

function parseResultsVaultDate(dateStr: string | null): Date | null {
  if (!dateStr) return null;

  const match = /\/Date\((\d+)([+-]\d+)?\)\//.exec(dateStr);
  if (!match) return null;

  const ms = Number(match[1]);
  if (Number.isNaN(ms)) return null;

  return new Date(ms);
}

function formatMatchDateTime(dateStr: string | null): { date: string; time: string } {
  const date = parseResultsVaultDate(dateStr);
  if (!date) {
    return { date: "", time: "" };
  }

  const formattedDate = date.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const formattedTime = date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return { date: formattedDate, time: formattedTime };
}

function getDivisionColor(gradeName: string): Fixture["divisionColor"] {
  const name = gradeName.toLowerCase();

  if (name.includes("top")) return "blue";
  if (name.includes("hoofd")) return "red";
  if (name.includes("women") || name.includes("dames") || name.includes("vrouw")) return "green";

  return "purple";
}

function firstNonEmpty(...values: unknown[]): string | null {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return null;
}

function namesMatch(a: string, b: string): boolean {
  const left = a.trim().toLowerCase();
  const right = b.trim().toLowerCase();
  if (!left || !right) return false;
  return left === right || left.startsWith(right) || right.startsWith(left);
}

function resolveWinnerSide(
  home: string,
  away: string,
  resultText: string | null,
  explicitWinner: string | null,
): "home" | "away" | "draw" | null {
  if (explicitWinner) {
    if (namesMatch(explicitWinner, home)) return "home";
    if (namesMatch(explicitWinner, away)) return "away";
  }

  if (!resultText) return null;

  const text = resultText.toLowerCase();
  if (/\b(draw|tie|tied|abandoned|no result|\bnr\b)\b/.test(text)) {
    return "draw";
  }

  if (text.includes("won")) {
    if (text.startsWith(home.trim().toLowerCase()) || text.includes(`${home.trim().toLowerCase()} won`)) {
      return "home";
    }
    if (text.startsWith(away.trim().toLowerCase()) || text.includes(`${away.trim().toLowerCase()} won`)) {
      return "away";
    }
  }

  return null;
}

function formatInningsScore(team?: MatchTeam | null): string | null {
  const inningsList = team?.Innings;
  if (!inningsList || inningsList.length === 0) return null;

  // Prefer batting order; fall back to first innings entry
  const innings = [...inningsList].sort(
    (a, b) => (a.innings_order ?? a.innings_number ?? 0) - (b.innings_order ?? b.innings_number ?? 0),
  )[0];

  if (typeof innings.runs !== "number") return null;

  const wickets = typeof innings.wickets === "number" ? String(innings.wickets) : "-";
  const overs =
    typeof innings.overs_bowled === "number"
      ? ` (${innings.overs_bowled})`
      : "";

  return `${innings.runs}/${wickets}${overs}`;
}

function getTeamScores(match: MatchResponse): {
  team1Score: string | null;
  team2Score: string | null;
  winnerFromFlags: "home" | "away" | "draw" | null;
} {
  const teams = match.MatchTeams ?? [];
  const home = teams.find((t) => t.is_home) ?? teams[0];
  const away =
    teams.find((t) => t.is_home === false) ??
    teams.find((t) => t !== home) ??
    teams[1];

  let winnerFromFlags: "home" | "away" | "draw" | null = null;
  if (home?.result_flag === 2) winnerFromFlags = "home";
  else if (away?.result_flag === 2) winnerFromFlags = "away";

  return {
    team1Score: formatInningsScore(home),
    team2Score: formatInningsScore(away),
    winnerFromFlags,
  };
}

function getMatchOutcome(match: MatchResponse): Pick<
  Fixture,
  "status" | "labelText" | "winnerSide" | "team1Score" | "team2Score"
> {
  const leaderText = firstNonEmpty(match.leader_text);
  const { team1Score, team2Score, winnerFromFlags } = getTeamScores(match);

  // No leader_text => still to be played
  if (!leaderText) {
    return {
      status: "upcoming",
      labelText: null,
      winnerSide: null,
      team1Score: null,
      team2Score: null,
    };
  }

  const explicitWinner = firstNonEmpty(
    match.winner_name,
    match.winning_team_name,
    match.winning_team,
    match.winner,
  );

  const winnerSide =
    winnerFromFlags ??
    resolveWinnerSide(
      match.home_name,
      match.away_name,
      leaderText,
      explicitWinner,
    );

  if (winnerSide === "draw") {
    return {
      status: "draw",
      labelText: leaderText,
      winnerSide,
      team1Score,
      team2Score,
    };
  }

  return {
    status: "result",
    labelText: leaderText,
    winnerSide,
    team1Score,
    team2Score,
  };
}

export default function FixturesCards({
  fixtures = [
    {
      division: "Division 1",
      divisionColor: "blue",
      team1: "VRA 1",
      team2: "ACC",
      date: "Saturday, 15 May",
      time: "14:00",
      venue: "VRA Ground 1",
      year: "2021",
      className: "Division 1",
      status: "upcoming",
    },
    {
      division: "Division 2",
      divisionColor: "red",
      team1: "VRA 2",
      team2: "HCC",
      date: "Saturday, 15 May",
      time: "14:00",
      venue: "VRA Ground 2",
      year: "2021",
      className: "Division 2",
      status: "upcoming",
    },
    {
      division: "Youth League",
      divisionColor: "purple",
      team1: "VRA U19",
      team2: "Quick",
      date: "Sunday, 16 May",
      time: "10:00",
      venue: "VRA Ground 3",
      year: "2021",
      className: "Youth League",
      status: "upcoming",
    },
    {
      division: "Women's League",
      divisionColor: "green",
      team1: "VRA W1",
      team2: "Excelsior",
      date: "Sunday, 16 May",
      time: "14:00",
      venue: "VRA Ground 1",
      year: "2021",
      className: "Women's League",
      status: "result",
      labelText: "VRA W1 won by 4 wickets",
      winnerSide: "home",
      team1Score: "145/6 (20)",
      team2Score: "140/8 (19.2)",
    },
  ],
  years,
  classes,
  allowedGradeIds,
}: FixturesCardsProps) {
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [seasons, setSeasons] = useState<SeasonResponse[]>([]);
  const [grades, setGrades] = useState<GradeResponse[]>([]);
  const [matches, setMatches] = useState<MatchResponse[]>([]);
  const [isLoadingSeasons, setIsLoadingSeasons] = useState<boolean>(false);
  const [isLoadingGrades, setIsLoadingGrades] = useState<boolean>(false);
  const [isLoadingMatches, setIsLoadingMatches] = useState<boolean>(false);

  // Fetch seasons from /api/seasons on mount
  useEffect(() => {
    const fetchSeasons = async () => {
      setIsLoadingSeasons(true);
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
      } finally {
        setIsLoadingSeasons(false);
      }
    };

    fetchSeasons();
  }, []);

  // Year options: prefer explicit prop, then seasons API, then derive from fixtures
  const yearOptions = useMemo(() => {
    if (years && years.length > 0) {
      return [...years].sort();
    }

    // While seasons are being fetched, avoid falling back to fixture-based years.
    if (isLoadingSeasons) {
      return [];
    }

    if (seasons.length > 0) {
      const fromSeasons = Array.from(
        new Set(seasons.map((s) => s.season_text.trim())),
      );

      return fromSeasons.sort((a, b) => Number(b) - Number(a));
    }

    const fromFixtures = Array.from(
      new Set(
        fixtures.map((f) => f.year).filter((y): y is string => Boolean(y)),
      ),
    );

    return fromFixtures.sort((a, b) => Number(b) - Number(a));
  }, [fixtures, years, seasons, isLoadingSeasons]);

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
      setIsLoadingGrades(true);
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

        // Set default class to the first allowed grade (so matches load on page load)
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
      } finally {
        setIsLoadingGrades(false);
      }
    };

    fetchGrades();
  }, [effectiveYear, seasons, allowedGradeIds]);

  const classOptions = useMemo(() => {
    if (classes && classes.length > 0) {
      return [...classes].sort();
    }

    // While grades are being fetched, avoid falling back to fixture-based classes.
    if (isLoadingGrades) {
      return [];
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

    const fromFixtures = Array.from(
      new Set(fixtures.map((f) => f.className ?? f.division).filter(Boolean)),
    );

    return fromFixtures.sort();
  }, [fixtures, classes, grades, allowedGradeIds, isLoadingGrades]);

  // Use the first class option as the effective default if none is selected yet.
  const effectiveClass = selectedClass || classOptions[0] || "";

  // Fetch matches whenever both effective year and class are selected
  useEffect(() => {
    if (!effectiveYear || !effectiveClass || seasons.length === 0 || grades.length === 0) {
      setIsLoadingMatches(false);
      return;
    }

    const seasonForYear = seasons.find(
      (s) => s.season_text.trim() === effectiveYear,
    );

    const gradeForClass = grades.find(
      (g) => g.grade_name === effectiveClass,
    );

    if (!seasonForYear || !gradeForClass) {
      setIsLoadingMatches(false);
      return;
    }

    const fetchMatches = async () => {
      setIsLoadingMatches(true);
      try {
        const res = await fetch(
          `/api/matches?seasonid=${seasonForYear.season_id}&gradeid=${gradeForClass.grade_id}`,
        );
        if (!res.ok) {
          console.error("Failed to fetch matches", res.status, res.statusText);
          setMatches([]);
          return;
        }

        const data: MatchResponse[] = await res.json();
        setMatches(data);
      } catch (error) {
        console.error("Failed to fetch matches", error);
        setMatches([]);
      } finally {
        setIsLoadingMatches(false);
      }
    };

    fetchMatches();
  }, [effectiveYear, effectiveClass, seasons, grades]);

  const fixturesFromMatches: Fixture[] = useMemo(
    () =>
      matches.map((match) => {
        const { date, time } = formatMatchDateTime(match.date1);
        const outcome = getMatchOutcome(match);

        return {
          division: match.grade_name,
          divisionColor: getDivisionColor(match.grade_name),
          team1: match.home_name,
          team2: match.away_name,
          date,
          time,
          venue: match.venue_name || "",
          ...outcome,
        };
      }),
    [matches],
  );

  return (
    <section className="w-full">
      <div className="mb-4 md:mb-6 flex flex-col gap-3 md:flex-row md:items-bottom md:justify-between">
        <h2 className="text-foreground dark:text-white text-3xl md:text-4xl lg:text-[48px] font-light mb-6 md:mb-8">
          Fixtures
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
              disabled={isLoadingSeasons && (!years || years.length === 0)}
            >
              {isLoadingSeasons && (!years || years.length === 0) ? (
                <option value="">Loading years...</option>
              ) : yearOptions.length > 0 ? (
                yearOptions.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))
              ) : (
                <option value="">No years available</option>
              )}
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
              disabled={isLoadingGrades && (!classes || classes.length === 0)}
            >
              {isLoadingGrades && (!classes || classes.length === 0) ? (
                <option value="">Loading classes...</option>
              ) : classOptions.length > 0 ? (
                classOptions.map((cls) => (
                  <option key={cls} value={cls}>
                    {cls}
                  </option>
                ))
              ) : (
                <option value="">No classes available</option>
              )}
            </select>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {isLoadingMatches ? (
          <div className="col-span-1 sm:col-span-2 lg:col-span-3 xl:col-span-4 text-center text-foreground/60 dark:text-white/60 text-xs md:text-sm py-6">
            Loading fixtures for the selected year and class...
          </div>
        ) : fixturesFromMatches.length > 0 ? (
          fixturesFromMatches.map((fixture, index) => (
            <FixtureCard
              key={index}
              divisionColor={fixture.divisionColor}
              team1={fixture.team1}
              team2={fixture.team2}
              date={fixture.date}
              time={fixture.time}
              venue={fixture.venue}
              status={fixture.status}
              labelText={fixture.labelText}
              winnerSide={fixture.winnerSide}
              team1Score={fixture.team1Score}
              team2Score={fixture.team2Score}
            />
          ))
        ) : (
          <div className="col-span-1 sm:col-span-2 lg:col-span-3 xl:col-span-4 text-center text-foreground/60 dark:text-white/60 text-xs md:text-sm py-6">
            No fixtures available for the selected year and class.
          </div>
        )}
      </div>
    </section>
  );
}
