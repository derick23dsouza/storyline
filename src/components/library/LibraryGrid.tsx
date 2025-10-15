"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-hot-toast";

export type CollectionItem = {
  id: string;
  progress: number;
  status: string;
  lastPage?: number | null;
  totalPages?: number | null;
  book: {
    id: string;
    title: string;
    author: string | null;
    cover: string | null;
    category?: string | null;
  };
};

export default function LibraryGrid({
  collections: initialCollections,
}: {
  collections: CollectionItem[];
}) {
  const [collections, setCollections] = useState(initialCollections);
  const [loadingId, setLoadingId] = useState<string | null>(null); 
  

  async function handleUpdateProgress(id: string, lastPage:number, progress: number) {
    setLoadingId(id);
    try {
      const res = await fetch("/api/collections/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId:id, lastPage, progress }),
      });

      if (res.ok) {
        setCollections((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, progress } : item
          )
        );
        toast.success("Progress updated");
        
      } else {
        toast.error("Failed to update progress");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoadingId(null);
    }
  }

  async function handleRemove(id: string) {
  setLoadingId(id);
  try {
    const res = await fetch(`/api/collections/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setCollections((prev) => prev.filter((item) => item.book.id !== id));
      toast.success("Removed from library");
    } else {
      toast.error("Failed to remove");
    }
  } catch {
    toast.error("Something went wrong");
  } finally {
    setLoadingId(null);
  }
}


  if (collections.length === 0) {
    return (
      <div className="text-center text-zinc-500 mt-12">
        No books in your library yet.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
      {collections.map((item) => {
        const isLoading = loadingId === item.book.id;


        return (
          <div
            key={item.id}
            className="rounded-2xl overflow-hidden bg-zinc-900/60 border border-zinc-800 hover:border-lime-300/40  transition-all group"
          >
            {/* Cover */}
            <div className="relative aspect-[3/4]">
              <Image
                src={
                  item.book.cover ||
                  `https://www.gutenberg.org/cache/epub/${item.book.id}/pg${item.book.id}.cover.medium.jpg`
                }
                alt={item.book.title}
                fill
                unoptimized
                className="object-cover group-hover:scale-105 transition-transform"
              />
            </div>

            {/* Info */}
            <div className="p-4">
              <h3 className="text-lg font-medium truncate">
                {item.book.title}
              </h3>
              <p className="text-sm text-zinc-400 truncate">
                {item.book.author || "Unknown Author"}
              </p>

              {/* Progress Bar */}
              <div className="mt-3">
                <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-lime-300 h-2 transition-all"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
                <p className="text-xs mt-1 text-zinc-500">
                  {Math.round(item.progress)}%
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col justify-between mt-4 gap-2">
                <button
                  onClick={() => handleUpdateProgress(item.book.id, item.lastPage??1, 100)}
                  disabled={isLoading}
                  className="flex-1 text-sm py-2 bg-lime-300 text-black font-medium  rounded-md hover:bg-lime-500 transition disabled:opacity-50"
                >
                  {isLoading ? "Updating...": item.progress==100? "Completed":"Mark as Completed"}
                </button>

                <Link
                  href={`/book/${item.book.id}`}
                  className="flex-1 text-sm py-2 font-medium rounded-md bg-zinc-900 border border-zinc-700 text-zinc-300 hover:text-lime-300 hover:border-lime-300 transition text-center"
                >
                  View Book
                </Link>

                <button
                  onClick={() => handleRemove(item.book.id)}
                  disabled={isLoading}
                  className="flex-1 text-sm py-2 bg-zinc-800 text-zinc-400 font-medium rounded-md hover:text-red-400 transition disabled:opacity-50"
                >
                  {isLoading ? "Removing..." : "Remove"}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
