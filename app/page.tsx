"use client";

import { useState } from "react";
import Aurora from "@/app/components/ui/Aurora/Aurora";
import Navbar from "@/app/components/Navbar";
import GradientText from "./components/ui/GradientText/GradientText";
import Orb from "./components/ui/Orb/Orb";

import ClickSpark from "./components/ui/ClickSpark/ClickSpark";

<ClickSpark
  sparkColor="#fff"
  sparkSize={10}
  sparkRadius={15}
  sparkCount={8}
  duration={400}
/>;
export default function Home() {
  const [url, setUrl] = useState("");
  const [message, setMessage] = useState("");

  const handleDownload = async () => {
    setMessage("Extracting...");
    const res = await fetch("/api/download_youtube", {
      method: "POST",
      body: JSON.stringify({ url }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    if (data.success) {
      setMessage("Download complete!");
    } else {
      setMessage("Error downloading video.");
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden font-sans text-white">
      <Navbar />

      {/* Aurora Background */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <Aurora
          colorStops={["#e392fe", "#00c7fc", "#ff6251"]}
          amplitude={0.75}
        />
      </div>

      {/* Main Content */}
      <div className="relative flex flex-col items-center justify-center min-h-screen text-center p-6">
        <GradientText
          colors={["#e392fe", "#00c7fc", "#e392fe", "#00c7fc", "#e392fe"]}
          animationSpeed={5}
          showBorder={false}
          className="text-6xl font-extrabold"
        >
          TubeXtract
        </GradientText>

        {/* Orb Positioned Between Title and Input */}
        <div className="relative w-full flex justify-center mt-6 mb-6">
          <Orb />
        </div>

        <div className="flex flex-col items-center w-full max-w-lg">
          <input
            type="text"
            placeholder="Enter YouTube URL"
            className="w-full p-4 text-white text-xl rounded-lg 
             bg-white/10 backdrop-blur-lg 
             border border-white/20 focus:outline-none"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />

          {/* Wrapper for Extract Button */}
          <div className="relative mt-8 w-full flex justify-center">
            {/* Extract Button */}
            <button
              className="relative px-10 py-4 text-xl font-bold bg-gray-700 rounded-lg hover:bg-gray-600 transition duration-300"
              onClick={handleDownload}
            >
              Extract
            </button>
          </div>
        </div>

        <p className="mt-6 text-xl font-medium">{message}</p>
      </div>
    </div>
  );
}
