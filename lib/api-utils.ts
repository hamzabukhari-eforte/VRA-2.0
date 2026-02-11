import chromium from "@sparticuz/chromium";
import puppeteer, { Browser, Page } from "puppeteer-core";

// Shared utilities for API routes with retry logic and caching

// Simple in-memory cache
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Retry configuration
const RETRY_CONFIG = {
  maxRetries: 3,
  baseDelay: 1000, // 1 second
  maxDelay: 10000, // 10 seconds
};

// Exponential backoff retry function
export async function fetchWithRetry(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  let lastError: Error;

  for (let attempt = 0; attempt <= RETRY_CONFIG.maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        return response;
      }

      // Don't retry on 4xx errors (except 429 - rate limit)
      if (
        response.status >= 400 &&
        response.status < 500 &&
        response.status !== 429
      ) {
        return response;
      }

      lastError = new Error(`HTTP ${response.status}: ${response.statusText}`);
    } catch (error) {
      lastError = error as Error;
    }

    // If this was the last attempt, throw the error
    if (attempt === RETRY_CONFIG.maxRetries) {
      throw lastError;
    }

    // Calculate delay with exponential backoff
    const delay = Math.min(
      RETRY_CONFIG.baseDelay * Math.pow(2, attempt),
      RETRY_CONFIG.maxDelay
    );

    console.log(`Attempt ${attempt + 1} failed, retrying in ${delay}ms...`);
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  // This should never be reached, but TypeScript needs it
  throw new Error("Unexpected end of retry loop");
}

// Cache helper functions
export function getFromCache(key: string) {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  cache.delete(key);
  return null;
}

export function setCache(key: string, data: unknown) {
  cache.set(key, {
    data,
    timestamp: Date.now(),
    expiry: Date.now() + CACHE_TTL,
  });
}

// Clear expired cache entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of cache.entries()) {
    if (now - value.timestamp > CACHE_TTL) {
      cache.delete(key);
    }
  }
}, 60000); // Check every minute

// Cache management functions
export function getCacheStatus() {
  return {
    size: cache.size,
    entries: Array.from(cache.keys()),
    ttl: CACHE_TTL / 1000, // in seconds
  };
}

export function clearCache() {
  const clearedCount = cache.size;
  cache.clear();
  return clearedCount;
}
export class ApiHeaderFetcher {
  private static instance: ApiHeaderFetcher;
  private browser: Browser | null = null;
  private page: Page | null = null;
  private cachedHeader: string | null = null;
  private lastFetched: number | null = null;
  private cacheTTL: number = 60 * 60 * 1000; // Cache for 1 hour

  private constructor() {}

  public static getInstance(): ApiHeaderFetcher {
    if (!ApiHeaderFetcher.instance) {
      ApiHeaderFetcher.instance = new ApiHeaderFetcher();
    }
    return ApiHeaderFetcher.instance;
  }

  private async initializeBrowser(): Promise<void> {
    if (!this.browser) {
      const isProd =
        process.env.VERCEL === "1" || process.env.NODE_ENV === "production";

      this.browser = await puppeteer.launch({
        args: isProd
          ? chromium.args
          : [
              "--no-sandbox",
              "--disable-setuid-sandbox",
              "--disable-dev-shm-usage",
              "--disable-gpu",
            ],
        // In production on Vercel, use the serverless Chromium binary.
        // In local dev, rely on an installed Chrome via the "chrome" channel.
        executablePath: isProd ? await chromium.executablePath() : undefined,
        channel: isProd ? undefined : "chrome",
        headless: isProd ? chromium.headless : true,
      });
      this.page = await this.browser.newPage();
      await this.page.setRequestInterception(true);

      this.page.on("request", (request) => {
        const url = request.url();
        if (url.startsWith("https://api.resultsvault.co.uk")) {
          const headers = request.headers();
          if (headers["x-ias-api-request"]) {
            this.cachedHeader = headers["x-ias-api-request"];
            this.lastFetched = Date.now();
            console.log(`Captured x-ias-api-request: ${this.cachedHeader}`);
          }
        }
        request.continue();
      });
    }
  }

  public async getXIasApiRequestHeader(): Promise<string | null> {
    if (
      this.cachedHeader &&
      this.lastFetched &&
      Date.now() - this.lastFetched < this.cacheTTL
    ) {
      return this.cachedHeader;
    }

    try {
      await this.initializeBrowser();
      if (!this.page) throw new Error("Page not initialized");

      await this.page.goto("https://matchcentre.kncb.nl/ladders/", {
        waitUntil: "networkidle0",
        timeout: 15000,
      });

      await new Promise((resolve) => setTimeout(resolve, 1000));
      return this.cachedHeader;
    } catch (error) {
      console.error("Error fetching header:", error);
      return null;
    }
  }

  public async cleanup(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.page = null;
      this.cachedHeader = null;
      this.lastFetched = null;
    }
  }
}
