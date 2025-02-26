"use client";

import { useState } from "react";
import Image from "next/image";
import Aurora from "@/components/ui/Aurora/Aurora";
import Navbar from "@/components/Navbar";
import GradientText from "@/components/ui/GradientText/GradientText";
import Orb from "@/components/ui/Orb/Orb";
import ClickSpark from "@/components/ui/ClickSpark/ClickSpark";
import { VanishingInput } from "@/components/Vanishing-Input";
import HyperspeedLoader from "@/components/Loader";

interface VideoResponse {
  error?: string;
  videoUrl?: string;
  title?: string;
  thumbnail?: string;
}

export default function Home() {
  const [url, setUrl] = useState("");
  const [message, setMessage] = useState("");
  const [videoData, setVideoData] = useState<VideoResponse | null>(null);

  const handleDownload = async () => {
    if (!url.trim()) {
      setMessage("Please enter a valid URL.");
      return;
    }

    setMessage("Extracting...");
    setVideoData(null);

    try {
      const res = await fetch("/api/snapvideo", {
        method: "POST",
        body: JSON.stringify({ url: url.trim() }),
        headers: { "Content-Type": "application/json" },
      });

      const data: VideoResponse = await res.json();

      if (!res.ok || data.error) {
        setMessage("Error: " + (data.error || "Unknown error occurred"));
        return;
      }

      setMessage("Ready to download!");
      setVideoData(data);
    } catch {
      setMessage("Failed to extract video. Try again.");
    }
  };

  return (
    <ClickSpark
      sparkColor="#fff"
      sparkSize={10}
      sparkRadius={15}
      sparkCount={8}
      duration={400}
    >
      {/* Loader */}
      <HyperspeedLoader />

      <div className="relative min-h-screen w-full overflow-hidden font-sans text-white">
        <Navbar />

        <div className="absolute inset-0 -z-10 pointer-events-none">
          <Aurora
            colorStops={["#e392fe", "#00c7fc", "#ff6251"]}
            amplitude={0.75}
          />
        </div>

        <div className="relative flex flex-col items-center justify-center min-h-screen text-center pt-20 px-4 sm:px-6">
          <GradientText
            colors={["#e392fe", "#00c7fc", "#e392fe", "#00c7fc", "#e392fe"]}
            animationSpeed={5}
            showBorder={false}
            className="text-5xl sm:text-6xl font-extrabold"
          >
            TubeXtract
          </GradientText>

          <div className="relative w-full flex justify-center mt-6 mb-6">
            <Orb />
          </div>

          <div className="w-full max-w-lg px-4 sm:px-6 flex items-center justify-center">
            <VanishingInput
              placeholders={[
                "Enter the URL",
                "Paste the link here",
                "Get the highest quality available",
                "Get your video instantly",
              ]}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-0 py-3 sm:py-4 bg-white/10 backdrop-blur-md text-white text-base sm:text-lg rounded-lg border border-white/20 cursor-pointer flex items-center justify-center hover:bg-white/20 transition duration-300 text-center placeholder:text-center"
              required
            />
          </div>

          <div className="relative mt-8 w-full flex justify-center">
            <button
              className="relative px-8 sm:px-10 py-3 text-lg sm:text-xl font-bold bg-gray-800 rounded-lg hover:bg-gray-700 hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 transition-all duration-300 ease-in-out"
              onClick={handleDownload}
            >
              Extract
            </button>
          </div>

          <p className="mt-6 text-lg sm:text-xl font-medium">{message}</p>

          {videoData && videoData.videoUrl && (
            <div className="mt-6 w-full max-w-lg flex flex-col items-center pb-12">
              {videoData.thumbnail && (
                <Image
                  src={videoData.thumbnail}
                  alt={videoData.title || "Video thumbnail"}
                  width={480}
                  height={270}
                  className="rounded-lg"
                  priority
                />
              )}

              <h3 className="mt-4 text-xl sm:text-2xl font-semibold">
                {videoData.title || "Video Title"}
              </h3>

              <a
                href={`/api/proxy?url=${encodeURIComponent(videoData.videoUrl)}&title=${encodeURIComponent(videoData.title || "video")}`}
                download
                className="mt-4 px-6 py-3 bg-gray-800 backdrop-blur-lg border-t border-gray-700 text-white rounded-lg hover:bg-gray-700 hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 transition-all duration-300 ease-in-out pb-4"
              >
                Download
              </a>
            </div>
          )}
        </div>
      </div>
    </ClickSpark>
  );
}
