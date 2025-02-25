"use client";

import Link from "next/link";
import { useState, useCallback } from "react";
import { Menu, X, Github, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = useCallback(() => setIsOpen((prev) => !prev), []);

  return (
    <nav className="fixed top-0 left-0 w-full bg-transparent backdrop-blur-md z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="text-white text-2xl font-extrabold">
            TubeXtract
          </Link>

          {/* GitHub & Twitter (Hidden on Mobile) */}
          <div className="hidden md:flex space-x-4">
            <StyledButton href="https://github.com/Prtik12/TubeXtract">
              <Github size={20} className="w-5 h-5" />
              <span>GitHub</span>
            </StyledButton>
            <StyledButton href="https://x.com/iPratikkk___">
              <Twitter size={20} className="w-5 h-5" />
              <span>Twitter</span>
            </StyledButton>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-white focus:outline-none transition duration-300 hover:text-gray-400"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu with Smooth Animation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute top-16 left-0 w-full backdrop-blur-lg text-white md:hidden flex flex-col items-end px-3 py-3 space-y-6"
          >
            {/* GitHub & Twitter Buttons (For Mobile) */}
            <div className="flex space-x-4">
              <StyledButton href="https://github.com/Prtik12">
                <Github size={20} className="w-5 h-5" />
                <span>GitHub</span>
              </StyledButton>
              <StyledButton href="https://x.com/iPratikkk___">
                <Twitter size={20} className="w-5 h-5" />
                <span>Twitter</span>
              </StyledButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

// 🔹 Reusable Styled Button Component
function StyledButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Button
      asChild
      className="flex items-center space-x-2 border border-gray-700 bg-transparent text-white px-4 py-2 rounded-lg transition-all duration-300 shadow-md hover:bg-gray-700 hover:border-gray-600 hover:text-white"
    >
      <Link href={href} target="_blank">
        {children}
      </Link>
    </Button>
  );
}
