"use client";

import Image from "next/image";
import { useState, useEffect, startTransition } from "react";
import { toast } from "react-hot-toast";

type GutendexBook = {
  id: number;
  title: string;
  authors: { name: string }[];
  languages: string[];
  download_count: number;
  formats: Record<string, string>;
};

interface Props {
  book: GutendexBook;
  onAdded?: () => void;
  openAuthModal?: () => void;
}

export default function BookCard({ book, onAdded, openAuthModal }: Props) {
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [added, setAdded] = useState(false);

  const cover =
    book.formats["image/jpeg"] ||
    book.formats["image/jpg"] ||
    `https://www.gutenberg.org/cache/epub/${book.id}/pg${book.id}.cover.medium.jpg`;

  const authors = book.authors.map((a) => a.name).join(", ");

  //  Check if this book already exists in user's collection
  useEffect(() => {
    async function checkBook() {
      try {
        const res = await fetch(`/api/collections/check?bookId=${book.id}`);
        const json = await res.json();
        setAdded(json.exists);
      } catch (err) {
        console.error(err);
      } finally {
        setChecking(false);
      }
    }
    checkBook();
  }, [book.id]);

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
          <p className="text-xs text-lime-300">{book.languages.join(", ")}</p>
          <p className="text-xs text-zinc-400">
            {book.download_count} downloads
          </p>
        </div>

        <div className="mt-3">
          <button
            onClick={handleAdd}
            disabled={loading || added || checking}
            className={`w-full text-sm py-2 rounded-md font-medium transition-all ${
              checking
                ? "bg-zinc-700/60 text-zinc-400 cursor-wait"
                : added
                ? "bg-lime-300/30 text-lime-200 cursor-default"
                : loading
                ? "bg-lime-200/40 text-black cursor-not-allowed"
                : "bg-lime-300 text-black hover:bg-lime-400"
            }`}
          >
            {checking
              ? "Checking..."
              : added
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
