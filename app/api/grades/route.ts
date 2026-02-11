import { NextRequest, NextResponse } from "next/server";
import { ApiHeaderFetcher, getFromCache, setCache } from "@/lib/api-utils";

export const maxDuration = 30; // Allow up to 30s for Puppeteer cold starts

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const seasonId = searchParams.get("seasonId");

  if (!seasonId) {
    return NextResponse.json(
      { error: "Missing seasonId parameter" },
      { status: 400 }
    );
  }

  const cacheKey = `grades_${seasonId}`;

  // Check cache first
  const cachedData = getFromCache(cacheKey);
  if (cachedData) {
    console.log(`Serving grades for season ${seasonId} from cache`);
    return NextResponse.json(cachedData);
  }

  const url = `https://api.resultsvault.co.uk/rv/134453/grades/?apiid=1002&seasonId=${seasonId}`;

  try {
    console.log(`Fetching grades for season ${seasonId} from API...`);
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
        { status: response.status }
      );
    }

    const data = await response.json();

    // Cache the successful response
    setCache(cacheKey, data);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Grades fetch error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch grades after retries",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
