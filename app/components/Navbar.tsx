"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Github, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full bg-transparent backdrop-blur-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="text-white text-xl font-bold">
            TubeXtract
          </Link>

          {/* Centered Navigation Links */}
          <div className="hidden md:flex flex-1 justify-center space-x-8">
            <NavLink href="/youtube-downloader">YouTube Downloader</NavLink>
            <NavLink href="/mp4-to-mp3">MP4 to MP3</NavLink>
          </div>

          {/* GitHub & Twitter Buttons */}
          <div className="hidden md:flex space-x-4">
            <StyledButton href="https://github.com/Prtik12">
              <Github size={20} className="w-5 h-5" />
              <span>GitHub</span>
            </StyledButton>
            <StyledButton href="https://x.com/iPratikkk___">
              <Twitter size={20} className="w-5 h-5" />
              <span>Twitter</span>
            </StyledButton>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex justify-end flex-1">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white focus:outline-none transition duration-300 hover:text-gray-400"
            >
              {isOpen ? (
                <X size={28} className="w-7 h-7" />
              ) : (
                <Menu size={28} className="w-7 h-7" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-gray-900/80 border-t border-gray-700 flex flex-col items-center">
          <NavLink href="/youtube-downloader" onClick={() => setIsOpen(false)}>
            YouTube Downloader
          </NavLink>
          <NavLink href="/mp4-to-mp3" onClick={() => setIsOpen(false)}>
            MP4 to MP3
          </NavLink>

          {/* Mobile GitHub & Twitter Buttons */}
          <div className="flex space-x-4 mt-4">
            <StyledButton href="https://github.com/Prtik12">
              <Github size={20} className="w-5 h-5" />
              <span>GitHub</span>
            </StyledButton>
            <StyledButton href="https://x.com/iPratikkk___">
              <Twitter size={20} className="w-5 h-5" />
              <span>Twitter</span>
            </StyledButton>
          </div>
        </div>
      )}
    </nav>
  );
}

// 🔹 Reusable Styled Button Component
function StyledButton({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Button
      asChild
      className="flex items-center space-x-2 border border-gray-700 bg-transparent 
      text-white px-4 py-2 rounded-lg transition-all duration-300 shadow-md 
      hover:bg-gray-700 hover:border-gray-600 hover:text-white"
    >
      <Link href={href} target="_blank">
        {children}
      </Link>
    </Button>
  );
}

// 🔹 Reusable Link Component
function NavLink({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block px-4 py-2 text-white transition duration-300 hover:text-gray-400"
    >
      {children}
    </Link>
  );
}
