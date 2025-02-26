import { NextResponse } from "next/server";

interface Media {
  type?: string;
  url: string;
  quality?: string;
  extension?: string;
  videoAvailable?: boolean;
  audioAvailable?: boolean;
}

interface ApiResponse {
  title: string;
  thumbnail: string;
  medias?: Media[];
}

export async function OPTIONS() {
  return NextResponse.json(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Extract only the base YouTube URL (remove extra query params)
    const cleanedUrl = url.split("?")[0];
    console.log("Requesting video details for:", cleanedUrl);

    const apiKey = process.env.RAPIDAPI_KEY;
    const apiHost = process.env.RAPIDAPI_HOST;

    if (!apiKey || !apiHost) {
      return NextResponse.json(
        { error: "Missing API credentials" },
        { status: 500 },
      );
    }

    // Fetch video details from API
    const response = await fetch(
      "https://snap-video3.p.rapidapi.com/download",
      {
        method: "POST",
        headers: {
          "x-rapidapi-key": apiKey,
          "x-rapidapi-host": apiHost,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ url: cleanedUrl }),
      },
    );

    const data: ApiResponse = await response.json();
    console.log("Raw API Response:", JSON.stringify(data, null, 2));

    if (!response.ok) {
      return NextResponse.json(
        { error: `API request failed: ${response.statusText}` },
        { status: response.status },
      );
    }

    if (
      !data.medias ||
      !Array.isArray(data.medias) ||
      data.medias.length === 0
    ) {
      return NextResponse.json(
        { error: "No media found in API response" },
        { status: 404 },
      );
    }

    // Find the best quality MP4 video with both audio & video
    const videoMedia = data.medias
      .filter(
        (media) =>
          media.videoAvailable &&
          media.audioAvailable &&
          media.extension === "mp4",
      )
      .sort((a, b) => {
        const qualityA = parseInt(a.quality?.replace("p", "") ?? "0", 10);
        const qualityB = parseInt(b.quality?.replace("p", "") ?? "0", 10);
        return qualityB - qualityA; // Sort from highest to lowest quality
      })[0];

    if (!videoMedia) {
      return NextResponse.json(
        { error: "No suitable video format found" },
        { status: 404 },
      );
    }

    // Return video download link
    return NextResponse.json({
      title: data.title,
      thumbnail: data.thumbnail,
      videoUrl: videoMedia.url,
    });
  } catch (error: unknown) {
    console.error("API Error:", error);

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid JSON response from API" },
        { status: 502 },
      );
    }

    return NextResponse.json(
      { error: "Failed to process request", details: (error as Error).message },
      { status: 500 },
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const videoUrl = searchParams.get("url");
    const title = searchParams.get("title") || "video";

    if (!videoUrl) {
      return NextResponse.json({ error: "Missing video URL" }, { status: 400 });
    }

    // Basic URL validation
    if (!/^https?:\/\//.test(videoUrl)) {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    console.log("Fetching video from:", videoUrl);

    const response = await fetch(videoUrl, { method: "GET" });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch video: ${response.statusText}` },
        { status: response.status },
      );
    }

    const sanitizedFilename = title
      .replace(/[^\w\s-]/gi, "")
      .replace(/\s+/g, "_");

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
    return NextResponse.json(
      { error: "Failed to fetch video" },
      { status: 500 },
    );
  }
}
