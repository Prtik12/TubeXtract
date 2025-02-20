import { NextRequest, NextResponse } from "next/server";
import ytdl from "ytdl-core";
import { createWriteStream } from "fs";
import path from "path";
import { tmpdir } from "os";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json(); // Parse the body first
    console.log("Request body:", body); // Log the entire request body

    const { url } = body;
    console.log("URL from body:", url); // Log the url

    if (!url) {
      console.error("No URL provided");
      return NextResponse.json({ error: "No URL provided" }, { status: 400 });
    }

    if (!ytdl.validateURL(url)) {
      console.error("Invalid YouTube URL");
      return NextResponse.json(
        { error: "Invalid YouTube URL" },
        { status: 400 },
      );
    }

    const videoInfo = await ytdl.getInfo(url);
    console.log("Video Info:", videoInfo);
    const filePath = path.join(tmpdir(), `${videoInfo.videoDetails.title}.mp4`);

    await new Promise<void>((resolve, reject) => {
      ytdl(url, { quality: "highest" })
        .pipe(createWriteStream(filePath))
        .on("finish", resolve)
        .on("error", reject);
    });

    return NextResponse.json({ success: true, filePath });
  } catch (error) {
    console.error("Error occurred:", error);
    return NextResponse.json({ error: "Download failed" }, { status: 500 });
  }
}
