import { Controller, Get, Query, Res } from "@nestjs/common";
import type { Response } from "express";
import { ApiUtilsService } from "../../common/api-utils/api-utils.service";

/**
 * Ported from apps/web/app/api/{seasons,grades,ladders,matches}/route.ts
 *
 * These proxy to the external resultsvault.co.uk match centre API, using a
 * puppeteer-driven header fetcher (ApiUtilsService) to obtain the required
 * `x-ias-api-request` header, with a 5-minute in-memory response cache.
 */

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

@Controller()
export class CricketProxyController {
  constructor(private readonly apiUtilsService: ApiUtilsService) {}

  private async getAuthHeaders(): Promise<HeadersInit> {
    return {
      "x-ias-api-request": (await this.apiUtilsService.getXIasApiRequestHeader()) || "",
    };
  }

  @Get("seasons")
  async seasons(@Res({ passthrough: true }) res: Response) {
    const cacheKey = "seasons";

    const cachedData = this.apiUtilsService.getFromCache(cacheKey);
    if (cachedData) {
      console.log("Serving seasons from cache");
      return cachedData;
    }

    const url = "https://api.resultsvault.co.uk/rv/134453/seasons/?apiid=1002";

    try {
      console.log("Fetching seasons from API...");
      const response = await fetch(url, { headers: await this.getAuthHeaders() });

      if (!response.ok) {
        res.status(response.status);
        return { error: `API returned ${response.status}: ${response.statusText}` };
      }

      const data = await response.json();
      this.apiUtilsService.setCache(cacheKey, data);
      return data;
    } catch (error) {
      console.error("Seasons fetch error:", error);
      res.status(500);
      return {
        error: "Failed to fetch seasons after retries",
        details: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  @Get("grades")
  async grades(@Query("seasonId") seasonId: string | undefined, @Res({ passthrough: true }) res: Response) {
    if (!seasonId) {
      res.status(400);
      return { error: "Missing seasonId parameter" };
    }

    const cacheKey = `grades_${seasonId}`;

    const cachedData = this.apiUtilsService.getFromCache(cacheKey);
    if (cachedData) {
      console.log(`Serving grades for season ${seasonId} from cache`);
      return cachedData;
    }

    const url = `https://api.resultsvault.co.uk/rv/134453/grades/?apiid=1002&seasonId=${seasonId}`;

    try {
      console.log(`Fetching grades for season ${seasonId} from API...`);
      const response = await fetch(url, { headers: await this.getAuthHeaders() });

      if (!response.ok) {
        res.status(response.status);
        return { error: `API returned ${response.status}: ${response.statusText}` };
      }

      const data = await response.json();
      this.apiUtilsService.setCache(cacheKey, data);
      return data;
    } catch (error) {
      console.error("Grades fetch error:", error);
      res.status(500);
      return {
        error: "Failed to fetch grades after retries",
        details: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  @Get("ladders")
  async ladders(
    @Query("gradeid") gradeid: string | undefined,
    @Query("seasonid") seasonid: string | undefined,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (!gradeid || !seasonid) {
      res.status(400);
      return { error: "Missing required parameters: gradeid and seasonid" };
    }

    const cacheKey = `ladders_${gradeid}_${seasonid}`;

    const cachedData = this.apiUtilsService.getFromCache(cacheKey);
    if (cachedData) {
      console.log(`Serving ladder for grade ${gradeid}, season ${seasonid} from cache`);
      return cachedData;
    }

    const url = `https://api.resultsvault.co.uk/rv/134453/ladders/v2/?apiid=1002&gradeid=${gradeid}&seasonid=${seasonid}&sportid=1`;

    try {
      console.log(`Fetching ladder for grade ${gradeid}, season ${seasonid} from API...`);
      const response = await fetch(url, { headers: await this.getAuthHeaders() });

      if (!response.ok) {
        res.status(response.status);
        return { error: `API returned ${response.status}: ${response.statusText}` };
      }

      const data = await response.json();
      this.apiUtilsService.setCache(cacheKey, data);
      return data;
    } catch (error) {
      console.error("Ladder fetch error:", error);
      res.status(500);
      return {
        error: "Failed to fetch ladder after retries",
        details: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  private async resolveVraEntityId(seasonid: string, gradeid: string, headers: HeadersInit): Promise<number> {
    const gradeUrl = `https://api.resultsvault.co.uk/rv/${ASSOCIATION_ID}/grades/${gradeid}/?apiid=1002&seasonid=${seasonid}`;

    try {
      const response = await fetch(gradeUrl, { headers });
      if (!response.ok) {
        console.warn(`Grade detail fetch failed (${response.status}); using VRA entity fallback`);
        return VRA_ENTITY_ID_FALLBACK;
      }

      const grade = (await response.json()) as GradeDetail;
      const vra = grade.teams?.find((team) => team.team_name?.trim().toUpperCase() === VRA_TEAM_NAME);

      if (vra?.entity_id) {
        return vra.entity_id;
      }

      console.warn(`VRA not found in grade ${gradeid} teams; using entity fallback`);
      return VRA_ENTITY_ID_FALLBACK;
    } catch (error) {
      console.warn("Failed to resolve VRA entity from grade detail:", error);
      return VRA_ENTITY_ID_FALLBACK;
    }
  }

  private isVraMatch(match: MatchRecord, vraEntityId: number): boolean {
    const entityIds = [match.home_entity_id, match.away_entity_id, match.home_club_id, match.away_club_id].filter(
      (id): id is number => typeof id === "number",
    );

    if (entityIds.includes(vraEntityId)) {
      return true;
    }

    const names = [match.home_name, match.away_name]
      .filter((name): name is string => Boolean(name))
      .map((name) => name.trim().toUpperCase());

    return names.some((name) => name === VRA_TEAM_NAME || name.startsWith(`${VRA_TEAM_NAME} `));
  }

  @Get("matches")
  async matches(
    @Query("seasonid") seasonid: string | undefined,
    @Query("gradeid") gradeid: string | undefined,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (!seasonid || !gradeid) {
      res.status(400);
      return { error: "Missing required parameters: seasonid and gradeid" };
    }

    try {
      const headers = await this.getAuthHeaders();
      const vraEntityId = await this.resolveVraEntityId(seasonid, gradeid, headers);

      const cacheKey = `matches_${seasonid}_${gradeid}_${vraEntityId}`;
      const cachedData = this.apiUtilsService.getFromCache(cacheKey);
      if (cachedData) {
        console.log(`Serving VRA matches for season ${seasonid}, grade ${gradeid}, entity ${vraEntityId} from cache`);
        return cachedData;
      }

      // entityid scopes fixtures to the selected club (Matchcentre "Select club")
      const url =
        `https://api.resultsvault.co.uk/rv/${ASSOCIATION_ID}/matches/` +
        `?apiid=1002&seasonid=${seasonid}&gradeid=${gradeid}` +
        `&entityid=${vraEntityId}&action=ors&maxrecs=1000&strmflg=1`;

      console.log(`Fetching VRA matches for season ${seasonid}, grade ${gradeid}, entity ${vraEntityId}...`);

      const response = await fetch(url, { headers });

      if (!response.ok) {
        res.status(response.status);
        return { error: `API returned ${response.status}: ${response.statusText}` };
      }

      const data = await response.json();
      const matches: MatchRecord[] = Array.isArray(data) ? data : [];

      // Ensure only VRA fixtures even if the upstream param is ignored
      const vraMatches = matches.filter((match) => this.isVraMatch(match, vraEntityId));

      this.apiUtilsService.setCache(cacheKey, vraMatches);

      return vraMatches;
    } catch (error) {
      console.error("Matches fetch error:", error);
      res.status(500);
      return {
        error: "Failed to fetch matches after retries",
        details: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
}
