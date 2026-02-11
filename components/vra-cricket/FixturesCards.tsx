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

interface MatchResponse {
  date1: string | null;
  home_name: string;
  away_name: string;
  venue_name: string | null;
  grade_name: string;
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
  const [isLoadingMatches, setIsLoadingMatches] = useState<boolean>(false);

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

  // Year options: prefer explicit prop, then seasons API, then derive from fixtures
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

    const fromFixtures = Array.from(
      new Set(
        fixtures.map((f) => f.year).filter((y): y is string => Boolean(y)),
      ),
    );

    return fromFixtures.sort((a, b) => Number(b) - Number(a));
  }, [fixtures, years, seasons]);

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

    const fromFixtures = Array.from(
      new Set(fixtures.map((f) => f.className ?? f.division).filter(Boolean)),
    );

    return fromFixtures.sort();
  }, [fixtures, classes, grades, allowedGradeIds]);

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

        return {
          division: match.grade_name,
          divisionColor: getDivisionColor(match.grade_name),
          team1: match.home_name,
          team2: match.away_name,
          date,
          time,
          venue: match.venue_name || "",
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

      <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {isLoadingMatches ? (
          <div className="col-span-1 sm:col-span-2 lg:col-span-3 xl:col-span-4 text-center text-foreground/60 dark:text-white/60 text-xs md:text-sm py-6">
            Loading fixtures for the selected year and class...
          </div>
        ) : fixturesFromMatches.length > 0 ? (
          fixturesFromMatches.map((fixture, index) => (
            <FixtureCard key={index} {...fixture} />
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
