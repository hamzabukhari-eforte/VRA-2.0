import { NextRequest, NextResponse } from "next/server";
import { ApiHeaderFetcher, getFromCache, setCache } from "@/lib/api-utils";

export const maxDuration = 30; // Allow up to 30s for Puppeteer cold starts

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const gradeid = searchParams.get("gradeid");
  const seasonid = searchParams.get("seasonid");

  if (!gradeid || !seasonid) {
    return NextResponse.json(
      {
        error: "Missing required parameters: gradeid and seasonid",
      },
      { status: 400 }
    );
  }

  const cacheKey = `ladders_${gradeid}_${seasonid}`;

  // Check cache first
  const cachedData = getFromCache(cacheKey);
  if (cachedData) {
    console.log(
      `Serving ladder for grade ${gradeid}, season ${seasonid} from cache`
    );
    return NextResponse.json(cachedData);
  }

  const url = `https://api.resultsvault.co.uk/rv/134453/ladders/v2/?apiid=1002&gradeid=${gradeid}&seasonid=${seasonid}&sportid=1`;

  try {
    console.log(
      `Fetching ladder for grade ${gradeid}, season ${seasonid} from API...`
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
        { status: response.status }
      );
    }

    const data = await response.json();

    // Cache the successful response
    setCache(cacheKey, data);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Ladder fetch error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch ladder after retries",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
