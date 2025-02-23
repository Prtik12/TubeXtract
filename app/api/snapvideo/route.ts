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

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const apiKey = process.env.RAPIDAPI_KEY;
    const apiHost = process.env.RAPIDAPI_HOST;

    if (!apiKey || !apiHost) {
      return NextResponse.json(
        { error: "Missing API credentials" },
        { status: 500 }
      );
    }

    const response = await fetch("https://snap-video3.p.rapidapi.com/download", {
      method: "POST",
      headers: {
        "x-rapidapi-key": apiKey,
        "x-rapidapi-host": apiHost,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ url }),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch video details: ${response.statusText}`);
    }

    const data: ApiResponse = await response.json();

    if (!data.medias || data.medias.length === 0) {
      return NextResponse.json({ error: "No media found" }, { status: 404 });
    }

    const videoMedia = data.medias
      .filter(
        (media) =>
          media.videoAvailable &&
          media.audioAvailable &&
          media.extension === "mp4"
      )
      .sort((a, b) => {
        const qualityA = parseInt(a.quality?.replace("p", "") ?? "0", 10);
        const qualityB = parseInt(b.quality?.replace("p", "") ?? "0", 10);
        return qualityB - qualityA; 
      })[0];

    if (!videoMedia) {
      return NextResponse.json(
        { error: "No suitable video format found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      title: data.title,
      thumbnail: data.thumbnail,
      videoUrl: videoMedia.url,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to process request", details: (error as Error).message },
      { status: 500 }
    );
  }
}
