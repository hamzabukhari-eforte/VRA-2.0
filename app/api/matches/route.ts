import { NextRequest, NextResponse } from "next/server";
import { ApiHeaderFetcher, getFromCache, setCache } from "@/lib/api-utils";

export const maxDuration = 30; // Allow up to 30s for Puppeteer cold starts

const ASSOCIATION_ID = 134453;
const VRA_TEAM_NAME = "VRA";
/** Fallback if grade detail is unavailable */
const VRA_ENTITY_ID_FALLBACK = 134466;

type GradeTeam = {
  entity_id: number;
  team_name: string;
  team_number?: number;
};

type GradeDetail = {
  teams?: GradeTeam[];
};

type MatchRecord = {
  home_name?: string;
  away_name?: string;
  home_entity_id?: number;
  away_entity_id?: number;
  home_club_id?: number;
  away_club_id?: number;
  [key: string]: unknown;
};

async function getAuthHeaders(): Promise<HeadersInit> {
  return {
    "x-ias-api-request":
      (await ApiHeaderFetcher.getInstance().getXIasApiRequestHeader()) || "",
  };
}

async function resolveVraEntityId(
  seasonid: string,
  gradeid: string,
  headers: HeadersInit,
): Promise<number> {
  const gradeUrl = `https://api.resultsvault.co.uk/rv/${ASSOCIATION_ID}/grades/${gradeid}/?apiid=1002&seasonid=${seasonid}`;

  try {
    const response = await fetch(gradeUrl, { headers });
    if (!response.ok) {
      console.warn(
        `Grade detail fetch failed (${response.status}); using VRA entity fallback`,
      );
      return VRA_ENTITY_ID_FALLBACK;
    }

    const grade = (await response.json()) as GradeDetail;
    const vra = grade.teams?.find(
      (team) => team.team_name?.trim().toUpperCase() === VRA_TEAM_NAME,
    );

    if (vra?.entity_id) {
      return vra.entity_id;
    }

    console.warn(
      `VRA not found in grade ${gradeid} teams; using entity fallback`,
    );
    return VRA_ENTITY_ID_FALLBACK;
  } catch (error) {
    console.warn("Failed to resolve VRA entity from grade detail:", error);
    return VRA_ENTITY_ID_FALLBACK;
  }
}

function isVraMatch(match: MatchRecord, vraEntityId: number): boolean {
  const entityIds = [
    match.home_entity_id,
    match.away_entity_id,
    match.home_club_id,
    match.away_club_id,
  ].filter((id): id is number => typeof id === "number");

  if (entityIds.includes(vraEntityId)) {
    return true;
  }

  const names = [match.home_name, match.away_name]
    .filter((name): name is string => Boolean(name))
    .map((name) => name.trim().toUpperCase());

  // Exact club short name from grades API, e.g. "VRA"
  return names.some(
    (name) => name === VRA_TEAM_NAME || name.startsWith(`${VRA_TEAM_NAME} `),
  );
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const seasonid = searchParams.get("seasonid");
  const gradeid = searchParams.get("gradeid");

  if (!seasonid || !gradeid) {
    return NextResponse.json(
      {
        error: "Missing required parameters: seasonid and gradeid",
      },
      { status: 400 },
    );
  }

  try {
    const headers = await getAuthHeaders();
    const vraEntityId = await resolveVraEntityId(seasonid, gradeid, headers);

    const cacheKey = `matches_${seasonid}_${gradeid}_${vraEntityId}`;
    const cachedData = getFromCache(cacheKey);
    if (cachedData) {
      console.log(
        `Serving VRA matches for season ${seasonid}, grade ${gradeid}, entity ${vraEntityId} from cache`,
      );
      return NextResponse.json(cachedData);
    }

    // entityid scopes fixtures to the selected club (Matchcentre "Select club")
    const url =
      `https://api.resultsvault.co.uk/rv/${ASSOCIATION_ID}/matches/` +
      `?apiid=1002&seasonid=${seasonid}&gradeid=${gradeid}` +
      `&entityid=${vraEntityId}&action=ors&maxrecs=1000&strmflg=1`;

    console.log(
      `Fetching VRA matches for season ${seasonid}, grade ${gradeid}, entity ${vraEntityId}...`,
    );

    const response = await fetch(url, { headers });

    if (!response.ok) {
      return NextResponse.json(
        {
          error: `API returned ${response.status}: ${response.statusText}`,
        },
        { status: response.status },
      );
    }

    const data = await response.json();
    const matches: MatchRecord[] = Array.isArray(data) ? data : [];

    // Ensure only VRA fixtures even if the upstream param is ignored
    const vraMatches = matches.filter((match) =>
      isVraMatch(match, vraEntityId),
    );

    setCache(cacheKey, vraMatches);

    return NextResponse.json(vraMatches);
  } catch (error) {
    console.error("Matches fetch error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch matches after retries",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
