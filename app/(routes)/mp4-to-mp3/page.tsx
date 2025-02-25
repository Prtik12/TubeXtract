"use client";

import { useState } from "react";
import Aurora from "@/components/ui/Aurora/Aurora";
import Navbar from "@/components/Navbar";
import GradientText from "@/components/ui/GradientText/GradientText";
import Orb from "@/components/ui/Orb/Orb";
import ClickSpark from "@/components/ui/ClickSpark/ClickSpark";

export default function Mp4ToMp3() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");

  const handleConvert = async () => {
    if (!file) {
      setMessage("Please select an MP4 file.");
      return;
    }

    setMessage("Converting...");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/convert_mp4_to_mp3", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Conversion failed.");
      }

      // Convert response to a blob
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      // Create a download link and trigger download
      const a = document.createElement("a");
      a.href = url;
      a.download = "converted.mp3";
      document.body.appendChild(a);
      a.click();
      a.remove();

      setMessage("Conversion complete! Your MP3 file is downloaded.");
    } catch (error) {
      setMessage(`Error: ${error instanceof Error ? error.message : "Unknown error"}`);
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
          <Aurora colorStops={["#e392fe", "#00c7fc", "#ff6251"]} amplitude={0.75} />
        </div>

        {/* Main Content */}
        <div className="relative flex flex-col items-center justify-center min-h-screen text-center pt-20 p-6">
          <GradientText
            colors={["#e392fe", "#00c7fc", "#e392fe", "#00c7fc", "#e392fe"]}
            animationSpeed={5}
            showBorder={false}
            className="text-6xl font-extrabold"
          >
            MP4 to MP3 Converter
          </GradientText>

          {/* Orb Positioned Between Title and Input */}
          <div className="relative w-full flex justify-center mt-6 mb-6">
            <Orb />
          </div>

          {/* Custom File Upload */}
          <div className="flex flex-col items-center w-full max-w-lg">
            <label
              htmlFor="file-upload"
              className="w-full px-6 py-4 bg-white/10 backdrop-blur-md text-white text-lg rounded-lg border border-white/20 cursor-pointer flex items-center justify-center hover:bg-white/20 transition duration-300"
            >
              {file ? file.name : "Choose MP4 File"}
            </label>
            <input
              id="file-upload"
              type="file"
              accept="video/mp4"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />

            {/* Convert Button */}
            <div className="relative mt-8 w-full flex justify-center">
              <button
                className="relative px-10 py-4 text-xl font-bold bg-gray-700 rounded-lg hover:bg-gray-600 transition duration-300"
                onClick={handleConvert}
              >
                Convert
              </button>
            </div>
          </div>

          <p className="mt-6 text-xl font-medium">{message}</p>
        </div>
      </div>
    </ClickSpark>
  );
}
