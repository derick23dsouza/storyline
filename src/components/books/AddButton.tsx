"use client";

import { useSession } from "@/lib/auth-client";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";

import { toast } from "react-hot-toast";

type AddButtonProps = {
  book: any;
};

export default function AddButton({ book }: AddButtonProps) {
  const { data: session } = useSession();
  const [added, setAdded] = useState(false);
  const [isPending, startTransition] = useTransition();

  // 🧩 Check if already in library (client-side)
  useEffect(() => {
    if (!session?.user) return;
    const checkLibrary = async () => {
      const res = await fetch(`/api/collections/check?bookId=${book.id}`);

      if (res.ok) {
        const data = await res.json();
        setAdded(data.exists);
      }
    };
    checkLibrary();
  }, [session, book.id]);

  async function handleAdd() {
    if (!session?.user) {
      toast.error("You must be logged in to add books.");
      return;
    }

    startTransition(async () => {
      const res = await fetch("/api/collections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: book.id,
          title: book.title,
          author: book.authors?.[0]?.name || "Unknown Author",
          cover:
            book.formats["image/jpeg"] ||
            book.formats["image/jpg"] ||
            `https://www.gutenberg.org/cache/epub/${book.id}/pg${book.id}.cover.medium.jpg`,
          category: book.subjects?.[0] || "General",
        }),
      });

      if (res.ok) {
        setAdded(true);
        toast.success("Added to your library!");
      } else {
        toast.error("Failed to add book");
      }
    });
  }
  if (!session)return(<Link href={`${process.env.NEXT_PUBLIC_API_URL}/login`} className="px-4 py-2 rounded-md transition-all bg-lime-300 text-black hover:bg-lime-400">
  
    

    
    Login and Add to library

  
  </Link>)

  return (
    <button
      onClick={handleAdd}
      disabled={isPending || added}
      className={`px-4 py-2 rounded-md transition-all ${
        added
          ? "bg-zinc-800 border border-zinc-700 text-zinc-400 cursor-not-allowed"
          : "bg-lime-300 text-black hover:bg-lime-400"
      }`}
    >
      {isPending ? "Adding..." : added ? "In Library" : "Add to Library"}
    </button>
  );
}
