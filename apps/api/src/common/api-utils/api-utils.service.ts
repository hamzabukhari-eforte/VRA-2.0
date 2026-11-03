import { Injectable, OnModuleDestroy } from "@nestjs/common";
import puppeteer, { Browser, Page } from "puppeteer-core";
import chromium from "@sparticuz/chromium";

/**
 * Ported from apps/web/lib/api-utils.ts.
 *
 * The original `ApiHeaderFetcher` was a manual singleton (`getInstance()`);
 * since Nest providers are singletons by default within a module context,
 * this is now a plain injectable service with identical behavior.
 */

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const RETRY_CONFIG = {
  maxRetries: 3,
  baseDelay: 1000,
  maxDelay: 10000,
};

type CacheEntry = { data: unknown; timestamp: number; expiry: number };

@Injectable()
export class ApiUtilsService implements OnModuleDestroy {
  private readonly cache = new Map<string, CacheEntry>();
  private readonly cacheCleanupInterval: NodeJS.Timeout;

  private browser: Browser | null = null;
  private page: Page | null = null;
  private cachedHeader: string | null = null;
  private lastFetched: number | null = null;
  private readonly headerCacheTTL = 60 * 60 * 1000; // 1 hour

  constructor() {
    this.cacheCleanupInterval = setInterval(() => {
      const now = Date.now();
      for (const [key, value] of this.cache.entries()) {
        if (now - value.timestamp > CACHE_TTL) {
          this.cache.delete(key);
        }
      }
    }, 60000);
  }

  onModuleDestroy() {
    clearInterval(this.cacheCleanupInterval);
  }

  async fetchWithRetry(url: string, options: RequestInit = {}): Promise<Response> {
    let lastError: Error | undefined;

    for (let attempt = 0; attempt <= RETRY_CONFIG.maxRetries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const response = await fetch(url, { ...options, signal: controller.signal });
        clearTimeout(timeoutId);

        if (response.ok) {
          return response;
        }

        if (response.status >= 400 && response.status < 500 && response.status !== 429) {
          return response;
        }

        lastError = new Error(`HTTP ${response.status}: ${response.statusText}`);
      } catch (error) {
        lastError = error as Error;
      }

      if (attempt === RETRY_CONFIG.maxRetries) {
        throw lastError;
      }

      const delay = Math.min(RETRY_CONFIG.baseDelay * Math.pow(2, attempt), RETRY_CONFIG.maxDelay);
      // eslint-disable-next-line no-console
      console.log(`Attempt ${attempt + 1} failed, retrying in ${delay}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }

    throw new Error("Unexpected end of retry loop");
  }

  getFromCache(key: string): unknown {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data;
    }
    this.cache.delete(key);
    return null;
  }

  setCache(key: string, data: unknown): void {
    this.cache.set(key, { data, timestamp: Date.now(), expiry: Date.now() + CACHE_TTL });
  }

  getCacheStatus() {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.keys()),
      ttl: CACHE_TTL / 1000,
    };
  }

  clearCache(): number {
    const clearedCount = this.cache.size;
    this.cache.clear();
    return clearedCount;
  }

  private async initializeBrowser(): Promise<void> {
    if (!this.browser) {
      const isVercel = !!process.env.VERCEL || !!process.env.AWS_LAMBDA_FUNCTION_NAME;

      this.browser = await puppeteer.launch({
        args: isVercel
          ? chromium.args
          : ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage", "--disable-gpu"],
        defaultViewport: { width: 1920, height: 1080 },
        executablePath: isVercel
          ? await chromium.executablePath()
          : process.platform === "win32"
            ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
            : process.platform === "darwin"
              ? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
              : "/usr/bin/google-chrome",
        headless: true,
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
            // eslint-disable-next-line no-console
            console.log(`Captured x-ias-api-request: ${this.cachedHeader}`);
          }
        }
        request.continue();
      });
    }
  }

  async getXIasApiRequestHeader(): Promise<string | null> {
    if (
      this.cachedHeader &&
      this.lastFetched &&
      Date.now() - this.lastFetched < this.headerCacheTTL
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
      // eslint-disable-next-line no-console
      console.error("Error fetching header:", error);
      return null;
    }
  }

  async cleanup(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.page = null;
      this.cachedHeader = null;
      this.lastFetched = null;
    }
  }
}
