import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const videoUrl = searchParams.get("url");
    const title = searchParams.get("title") || "video"; 

    if (!videoUrl) {
      return NextResponse.json({ error: "Missing video URL" }, { status: 400 });
    }

    const response = await fetch(videoUrl);

    return new Response(response.body, {
      headers: {
        "Content-Type": response.headers.get("Content-Type") || "video/mp4",
        "Access-Control-Allow-Origin": "*",
        "Content-Disposition": `attachment; filename="${title.replace(/\s+/g, "_")}.mp4"`, // 
      },
    });
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json({ error: "Failed to fetch video" }, { status: 500 });
  }
}
