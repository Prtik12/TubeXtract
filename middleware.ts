import { NextRequest, NextResponse } from "next/server";
import { LRUCache } from "lru-cache";

const rateLimitCache = new LRUCache<string, number>({
  max: 500,
  ttl: 60 * 1000,
});

const RATE_LIMIT = 10;

export async function middleware(req: NextRequest) {
  const forwardedFor = req.headers.get("x-forwarded-for");
  const ip = forwardedFor ? forwardedFor.split(",")[0] : "unknown";

  if (ip === "unknown") {
    return NextResponse.next();
  }

  const current = rateLimitCache.get(ip) || 0;

  if (current >= RATE_LIMIT) {
    return new NextResponse(
      JSON.stringify({ error: "Too many requests, slow down!" }),
      { status: 429, headers: { "Content-Type": "application/json" } },
    );
  }

  rateLimitCache.set(ip, current + 1);

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
