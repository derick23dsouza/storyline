"use client";

import Link from "next/link";
import { useState } from "react";
import { FaInstagram, FaGithub, FaLinkedin } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";
import { BookOpen } from "lucide-react";

export default function Footer() {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("derickpdsouza@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <footer className="w-full bg-zinc-800/60 backdrop-blur-sm text-zinc-300 border-t border-zinc-400">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Left: Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-white hover:text-lime-300 transition-colors"
        >
          <BookOpen className="w-5 h-5 text-lime-300" />
          <span className="font-bold text-xl">Storyline</span>
        </Link>

        {/* Center: Developer Credit */}
        <div className="text-sm text-center">
          Developed by{" "}
          <span className="text-lime-300 font-medium">@derick23dsouza</span>
        </div>

        {/* Right: Social Links */}
        <div className="flex items-center gap-4 text-2xl">
          <Link
            href="https://www.instagram.com/derick23dsouza/"
            aria-label="Instagram"
            className="hover:text-lime-300 transition-colors"
          >
            <FaInstagram />
          </Link>
          <Link
            href="https://github.com/derick23dsouza"
            aria-label="GitHub"
            className="hover:text-lime-300 transition-colors"
          >
            <FaGithub />
          </Link>
          <Link
            href="https://www.linkedin.com/in/derick-dsouza-625224193/"
            aria-label="LinkedIn"
            className="hover:text-lime-300 transition-colors"
          >
            <FaLinkedin />
          </Link>
          <button
            onClick={handleCopyEmail}
            aria-label="Copy email"
            className="hover:text-lime-300 transition-colors relative"
          >
            <HiOutlineMail />
            {copied && (
              <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs bg-zinc-800 text-lime-300 px-2 py-0.5 rounded">
                Copied!
              </span>
            )}
          </button>
        </div>
      </div>
    </footer>
  );
}
