
"use client";

import {  Undo2 } from "lucide-react";

export default function BackButton({ fallback = "/discover" }) {
  return (
    <button
      onClick={() => {
        if (typeof window !== "undefined" && window.history.length > 1) {
          window.history.back();
        } else {
          window.location.href = fallback;
        }
      }}
      className="inline-flex items-center gap-2 text-zinc-400 hover:text-lime-300 transition-all text-lg"
    >
      <Undo2 size={24} />
      Back
    </button>
  );
}
