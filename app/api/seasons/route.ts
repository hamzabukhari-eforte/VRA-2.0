import { NextResponse } from "next/server";
import { ApiHeaderFetcher, getFromCache, setCache } from "@/lib/api-utils";

export async function GET() {
  const cacheKey = "seasons";

  // Check cache first
  const cachedData = getFromCache(cacheKey);
  if (cachedData) {
    console.log("Serving seasons from cache");
    return NextResponse.json(cachedData);
  }

  const url = "https://api.resultsvault.co.uk/rv/134453/seasons/?apiid=1002";

  try {
    console.log("Fetching seasons from API...");
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
    console.error("Seasons fetch error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch seasons after retries",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
