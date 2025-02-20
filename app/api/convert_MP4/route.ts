import { NextRequest, NextResponse } from "next/server";
import ffmpeg from "fluent-ffmpeg";
import ffmpegStatic from "ffmpeg-static";
import path from "path";
import { tmpdir } from "os";

ffmpeg.setFfmpegPath(ffmpegStatic as string);

export async function POST(req: NextRequest) {
  try {
    const { filePath }: { filePath: string } = await req.json();
    if (!filePath || !filePath.endsWith(".mp4")) {
      return NextResponse.json({ error: "Invalid file path" }, { status: 400 });
    }

    const outputFilePath = path.join(
      tmpdir(),
      path.basename(filePath, ".mp4") + ".mp3",
    );

    // Convert MP4 to MP3 using ffmpeg
    await new Promise<void>((resolve, reject) => {
      ffmpeg(filePath)
        .toFormat("mp3")
        .on("end", () => resolve()) // ✅ Explicitly calling resolve() without parameters
        .on("error", (err) => {
          console.error("FFmpeg error:", err);
          reject(err);
        })
        .save(outputFilePath);
    });

    return NextResponse.json({ success: true, outputFilePath });
  } catch (error) {
    console.error("Conversion Error:", error);
    return NextResponse.json({ error: "Conversion failed" }, { status: 500 });
  }
}
