import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { spawn } from "child_process";
import { randomUUID } from "crypto";

export async function POST(req: NextRequest) {
  try {

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      console.error("No file uploaded");
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Ensure directory exists
    const tempDir = path.join(process.cwd(), "temp");
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    // Generate unique filenames
    const inputFilePath = path.join(tempDir, `${randomUUID()}.mp4`);
    const outputFilePath = path.join(tempDir, `${randomUUID()}.mp3`);

    // Save file
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(inputFilePath, fileBuffer);

    // Ensure file exists
    if (!fs.existsSync(inputFilePath)) {
      return NextResponse.json({ error: "Failed to save input file" }, { status: 500 });
    }

    // Check if FFmpeg is installed
    const ffmpegPath = "ffmpeg"; // Adjust if needed
    const ffmpeg = spawn(ffmpegPath, ["-i", inputFilePath, "-b:a", "192k", "-y", outputFilePath]);

    return new Promise<NextResponse>((resolve) => {
      ffmpeg.on("close", (code) => {
        if (code !== 0) {
          return resolve(
            NextResponse.json({ error: `FFmpeg exited with code ${code}` }, { status: 500 })
          );
        }

        // Read the converted file
        const mp3Data = fs.readFileSync(outputFilePath);
        fs.unlinkSync(inputFilePath);
        fs.unlinkSync(outputFilePath);

        resolve(
          new NextResponse(mp3Data, {
            headers: {
              "Content-Type": "audio/mpeg",
              "Content-Disposition": `attachment; filename="converted.mp3"`,
            },
          })
        );
      });

      ffmpeg.on("error", (err: Error) => {
        resolve(
          NextResponse.json({ error: `FFmpeg error: ${err.message}` }, { status: 500 })
        );
      });
    });
  } catch (error: unknown) {
    console.error("Unexpected error:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "An unknown error occurred" }, { status: 500 });
  }
}
