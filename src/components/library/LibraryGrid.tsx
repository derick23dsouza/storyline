"use client";

import Image from "next/image";
import { useTransition } from "react";
import { toast } from "react-hot-toast";

type CollectionItem = {
  id: string;
  progress: number;
  status: string;
  book: {
    id: string;
    title: string;
    author: string | null;
    cover: string | null;
  };
};

export default function LibraryGrid({
  collections,
}: {
  collections: CollectionItem[];
}) {
  const [isPending, startTransition] = useTransition();

  async function handleUpdateProgress(id: string, progress: number) {
    startTransition(async () => {
      const res = await fetch("/api/collections/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, progress }),
      });
      if (res.ok) toast.success("Progress updated");
      else toast.error("Failed to update progress");
    });
  }

  async function handleRemove(id: string) {
    startTransition(async () => {
      const res = await fetch(`/api/collections/${id}`, {
        method: "DELETE",
      });
      if (res.ok) toast.success("Removed from library");
      else toast.error("Failed to remove");
    });
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
      {collections.map((item) => (
        <div
          key={item.id}
          className="rounded-2xl overflow-hidden bg-zinc-900/60 border border-zinc-800 hover:border-lime-300/40 transition-all"
        >
          <div className="relative aspect-[3/4]">
            <Image
              src={
                item.book.cover ||
                `https://www.gutenberg.org/cache/epub/${item.book.id}/pg${item.book.id}.cover.medium.jpg`
              }
              alt={item.book.title}
              fill
              unoptimized
              className="object-cover"
            />
          </div>

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
            <div className="flex justify-between mt-4 gap-2">
              <button
                onClick={() =>
                  handleUpdateProgress(item.id, 100)
                }
                disabled={isPending}
                className="flex-1 text-xs bg-lime-300 text-black py-1.5 rounded hover:bg-lime-400 transition"
              >
                Mark Complete
              </button>
              <a
                href={`/book/${item.book.id}`}
                className="flex-1 text-xs bg-blue-950 text-lime-300 py-1.5 rounded border border-lime-300/30 hover:bg-blue-900 transition text-center"
              >
                View
              </a>
              <button
                onClick={() => handleRemove(item.id)}
                disabled={isPending}
                className="flex-1 text-xs bg-zinc-800 text-zinc-400 py-1.5 rounded hover:text-red-400 transition"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
