"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export function VanishingInput({
  placeholders,
  onChange,
  onSubmit,
  required,
  className,
  type = "text",
  name = "input",
}: {
  placeholders: string[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit?: React.FormEventHandler<HTMLFormElement>;
  required?: boolean;
  className?: string;
  type?: string;
  name?: string;
}) {
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrentPlaceholder((prev) => (prev + 1) % placeholders.length);
    }, 3000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [placeholders.length]);

  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && onSubmit) {
      e.preventDefault();
      onSubmit(
        new Event("submit") as unknown as React.FormEvent<HTMLFormElement>,
      );
    }
  };

  return (
    <form
      className={cn(
        "sm:w-96 relative max-w-xl mx-auto bg-zinc-800 h-12 rounded-full overflow-hidden shadow transition duration-200",
        className,
      )}
      onSubmit={onSubmit}
    >
      <input
        title="input"
        placeholder=""
        ref={inputRef}
        value={value}
        type={type}
        name={name}
        required={required}
        className={cn(
          "w-full relative text-sm sm:text-base z-50 border-none dark:text-white bg-transparent text-white h-full rounded-full focus:outline-none focus:ring-0 pl-4 sm:pl-10 pr-20",
        )}
        onKeyDown={handleKeyDown}
        onChange={(e) => {
          setValue(e.target.value);
          onChange?.(e);
        }}
      />

      <div className="absolute inset-0 flex items-center rounded-full pointer-events-none">
        <AnimatePresence mode="wait">
          {!value && (
            <motion.p
              initial={{ y: 5, opacity: 0 }}
              key={`current-placeholder-${currentPlaceholder}`}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -15, opacity: 0 }}
              transition={{ duration: 0.3, ease: "linear" }}
              className="dark:text-zinc-500 text-sm sm:text-base font-normal text-neutral-500 pl-4 sm:pl-12 text-left w-[calc(100%-2rem)] truncate"
            >
              {placeholders[currentPlaceholder]}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </form>
  );
}
