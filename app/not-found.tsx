"use client";

import FuzzyText from "@/components/ui/FuzzyText/FuzzyText";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950 text-white">
      <div className="relative w-full h-[150px] flex items-center justify-center">
        <FuzzyText fontSize={"6rem"} fontWeight={900} color="#fff">
          Error 404
        </FuzzyText>
      </div>
    </div>
  );
}
