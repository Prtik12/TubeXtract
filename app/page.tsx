"use client";

import { useState } from "react";
import Aurora from "@/components/ui/Aurora/Aurora";
import Navbar from "@/components/Navbar";
import GradientText from "../components/ui/GradientText/GradientText";
import Orb from "../components/ui/Orb/Orb";
import ClickSpark from "../components/ui/ClickSpark/ClickSpark";
import { VanishingInput } from "@/components/Vanishing-Input"; 

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
    <ClickSpark
      sparkColor="#fff"
      sparkSize={10}
      sparkRadius={15}
      sparkCount={8}
      duration={400}
    >
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
        <div className="relative flex flex-col items-center justify-center min-h-screen text-center px-6">
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

{/* Input Section */}
<div className="w-full max-w-lg flex items-center justify-center">
  <VanishingInput
    placeholders={[
      "Enter YouTube Video URL",
      "Enter Instagram Video URL",
      "Enter Snapchat Video URL",
      "Enter Twitter Video URL",
    ]}
    onChange={(e) => setUrl(e.target.value)}
    className="w-full h-14 pl-2 rounded-lg bg-white/10 backdrop-blur-lg border border-white/20 focus:outline-none text-white placeholder:text-center"
    type="text"
    name="url"
  />
</div>


          {/* Extract Button */}
          <div className="relative mt-8 w-full flex justify-center">
            <button
              className="relative px-10 py-4 text-xl font-bold bg-gray-700 rounded-lg hover:bg-gray-600 transition duration-300"
              onClick={handleDownload}
            >
              Extract
            </button>
          </div>

          {/* Status Message */}
          <p className="mt-6 text-xl font-medium">{message}</p>
        </div>
      </div>
    </ClickSpark>
  );
}
