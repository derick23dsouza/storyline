"use client";

import { useState } from "react";
import Link from "next/link";

import { BookOpen, Menu, X } from "lucide-react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navigation = [
    { name: "Discover Books", href: "/discover" },
    { name: "Community", href: "/community" },
    { name: "Dashboard", href: "/dashboard" },
    { name: "Insights", href: "/insights" },
  ];

  return (
    <header className="fixed top-0 left-0 w-full bg-black/60 backdrop-blur-sm text-white z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <BookOpen />
          <span className="font-bold text-xl">Storyline</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-6 items-center">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="hover:text-blue-400 transition"
            >
              {item.name}
            </Link>
          ))}

          <div className="flex gap-3">
            <Link
              href="/login"
              className="px-4 py-2 border border-amber-500 text-amber-500 rounded-full hover:bg-white/10 transition"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 bg-blue-950 rounded-full hover:bg-blue-800 transition"
            >
              Sign Up
            </Link>
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(true)}
          className="md:hidden text-gray-200 hover:text-white transition"
          aria-label="Open menu"
        >
          <Menu size={28} />
        </button>
      </div>

      {/* Mobile Modal */}
      {menuOpen && (
        <div className="fixed h-[100vh] inset-0 z-50 flex flex-col items-center py-30 bg-black/95 text-white">
          <button
            onClick={() => setMenuOpen(false)}
            className="absolute top-6 right-6 text-gray-300 hover:text-white transition"
            aria-label="Close menu"
          >
            <X size={32} />
          </button>

          <ul className="flex flex-col gap-8 text-lg font-medium text-center">
            {navigation.map((item) => (
              <li key={item.name}>
                <Link href={item.href} onClick={() => setMenuOpen(false)}>
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex flex-col gap-4 mt-10 w-40">
            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="px-4 py-2 border border-white/20 rounded-full hover:bg-white/10 transition text-center"
            >
              Login
            </Link>
            <Link
              href="/signup"
              onClick={() => setMenuOpen(false)}
              className="px-4 py-2 bg-blue-950 rounded-full hover:bg-blue-800 transition text-center"
            >
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
