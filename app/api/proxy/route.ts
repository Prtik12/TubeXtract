import { NextResponse } from "next/server";

export async function OPTIONS() {
  return NextResponse.json(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS, POST",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const videoUrl = searchParams.get("url");
    const title = searchParams.get("title") || "video";

    if (!videoUrl) {
      return NextResponse.json({ error: "Missing video URL" }, { status: 400 });
    }

    // Strict URL validation to prevent bad requests
    if (!/^https?:\/\/[^\s/$.?#].[^\s]*$/.test(videoUrl)) {
      return NextResponse.json({ error: "Invalid URL format" }, { status: 400 });
    }

    const response = await fetch(videoUrl, { method: "GET" });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch video: ${response.statusText}` },
        { status: response.status }
      );
    }

    const sanitizedFilename = title.replace(/[^\w\s-]/gi, "").replace(/\s+/g, "_");

    return new Response(response.body, {
      headers: {
        "Content-Type": response.headers.get("Content-Type") || "video/mp4",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Expose-Headers": "Content-Disposition",
        "Content-Disposition": `attachment; filename="${sanitizedFilename}.mp4"`,
      },
    });
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json({ error: "Failed to fetch video" }, { status: 500 });
  }
}
