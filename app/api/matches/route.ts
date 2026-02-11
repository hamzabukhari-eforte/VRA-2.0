import { NextRequest, NextResponse } from "next/server";
import { ApiHeaderFetcher, getFromCache, setCache } from "@/lib/api-utils";

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

  const cacheKey = `matches_${seasonid}_${gradeid}`;

  // Check cache first
  const cachedData = getFromCache(cacheKey);
  if (cachedData) {
    console.log(
      `Serving matches for season ${seasonid}, grade ${gradeid} from cache`,
    );
    return NextResponse.json(cachedData);
  }

  const url = `https://api.resultsvault.co.uk/rv/134453/matches/?apiid=1002&seasonid=${seasonid}&gradeid=${gradeid}&action=ors&maxrecs=1000&strmflg=1`;

  try {
    console.log(
      `Fetching matches for season ${seasonid}, grade ${gradeid} from API...`,
    );
    const response = await fetch(url, {
      headers: {
        "x-ias-api-request":
          (await ApiHeaderFetcher.getInstance().getXIasApiRequestHeader()) ||
          "",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          error: `API returned ${response.status}: ${response.statusText}`,
        },
        { status: response.status },
      );
    }

    const data = await response.json();

    // Cache the successful response
    setCache(cacheKey, data);

    return NextResponse.json(data);
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
