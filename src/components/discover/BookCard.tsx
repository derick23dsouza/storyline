"use client";

import { GutendexResult } from "@/app/data/gutendexType";
import Image from "next/image";
import { useState, useEffect, startTransition } from "react";
import { toast } from "react-hot-toast";



interface Props {
  book: GutendexResult;
  onAdded?: () => void;
  openAuthModal?: () => void;
  isAdded?: boolean
}

export default function BookCard({ book, onAdded, openAuthModal, isAdded }: Props) {
  const [loading, setLoading] = useState(false);
  
  const [added, setAdded] = useState(false);

  if(isAdded)setAdded(true);

  const cover =
    book.formats["image/jpeg"] ||
    book.formats["image/jpg"] ||
    `https://www.gutenberg.org/cache/epub/${book.id}/pg${book.id}.cover.medium.jpg`;
    const authors = book.authors?.map((a) => a.name).join(", ");
  

  
  

  async function handleAdd() {
    setLoading(true);
    try {
      const res = await fetch("/api/collections", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          id: String(book.id),
          title: book.title,
          author: authors,
          cover,
          category: book.languages?.[0] ?? "Unknown",
        }),
      });

      const json = await res.json();

      if (res.status === 401) {
        openAuthModal?.();
        return;
      }

      if (!res.ok) throw new Error(json?.error || "Failed to add");

      setAdded(true);
      startTransition(() => onAdded?.());
      toast.success("Added to library");
    } catch (err) {
      console.error(err);
      toast.error((err as Error).message || "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl overflow-hidden bg-zinc-800/40 border border-zinc-700 hover:border-lime-300/60 transition-all group">
      <div className="relative aspect-[3/4] bg-zinc-900">
        <Image
          src={cover}
          alt={book.title}
          fill
          unoptimized
          className="object-cover group-hover:scale-105 transition-transform"
        />
      </div>

      <div className="p-4">
        <h3 className="text-lg font-medium truncate">{book.title}</h3>
        <p className="text-sm text-zinc-400 truncate">{authors?authors:"Unkown Author"}</p>

        <div className="flex items-center justify-between mt-2">
          <p className="text-xs text-lime-300">{book.languages?.join(", ")}</p>
          <p className="text-xs text-zinc-400">
            {book.download_count} downloads
          </p>
        </div>

        <div className="mt-3">
          <button
            onClick={handleAdd}
            disabled={loading || added}
            className={`w-full text-sm py-2 rounded-md font-medium transition-all ${
               added
                ? "bg-lime-300/30 text-lime-200 cursor-default"
                : loading
                ? "bg-lime-200/40 text-black cursor-not-allowed"
                : "bg-lime-300 text-black hover:bg-lime-400"
            }`}
          >
            { added
              ? "✓ Added"
              : loading
              ? "Adding..."
              : "Add to Library"}
          </button>
        </div>
      </div>
    </div>
  );
}
