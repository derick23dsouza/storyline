"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import BookCard from "@/components/discover/BookCard";
import gutendexData from "@/app/data/gutendexData.json";
import { GutendexResponse, GutendexResult } from "@/app/data/gutendexType";

const BOOKS_PER_PAGE = 32;

export default function DiscoverClient({
  userCollections,
}: {
  userCollections: string[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Determine current page (default 1)
  const currentPage = Number(searchParams?.get("page") || 1);

  // State
  const [books, setBooks] = useState<GutendexResult[]>(gutendexData.results ?? []);
  const [fetchedPages, setFetchedPages] = useState<number[]>([1]);
  const [loading, setLoading] = useState(false);

  // Fetch Gutendex page if not already fetched
  const fetchPage = async (page: number) => {
    if (fetchedPages.includes(page)) return;

    try {
      setLoading(true);
      const res = await fetch(`https://gutendex.com/books/?page=${page}`);
      if (!res.ok) throw new Error(`Failed to fetch page ${page}`);

      const data: GutendexResponse = await res.json();
      if (data.results?.length) {
        setBooks((prev) => {
          const unique = [
            ...prev,
            ...data.results.filter((b) => !prev.some((p) => p.id === b.id)),
          ];
          return unique;
        });
        setFetchedPages((prev) => [...prev, page]);
      }
    } catch (err) {
      console.error("Error fetching Gutendex data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch new page only when search param changes
  useEffect(() => {
    if (!fetchedPages.includes(currentPage)) {
      fetchPage(currentPage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  // Pagination slice
  const start = (currentPage - 1) * BOOKS_PER_PAGE;
  const end = currentPage * BOOKS_PER_PAGE;
  const displayedBooks = books.slice(start, end);

  return (
    <section className="min-h-screen w-full py-16 text-white bg-black">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-semibold mb-2 text-lime-300">Discover Books</h1>
        <p className="text-zinc-400 mb-8">
          Explore public-domain books from Project Gutenberg.
        </p>

        {/* Book Grid */}
        {loading && displayedBooks.length === 0 ? (
          <p className="text-center text-zinc-400 mt-10">Loading books...</p>
        ) : displayedBooks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-8 px-4">
            {displayedBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onAdded={() => {}}
                isAdded={userCollections.includes(String(book.id))}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-zinc-400 mt-10">No books found.</p>
        )}

        {/* Pagination Controls */}
        <div className="flex justify-center items-center gap-4 mt-10">
          <button
            disabled={currentPage <= 1}
            onClick={() => router.push(`?page=${currentPage - 1}`)}
            className="px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-300 hover:text-lime-300 hover:border-lime-300 transition disabled:opacity-40"
          >
            ← Previous
          </button>

          <span className="text-zinc-400">Page {currentPage}</span>

          <button
            onClick={() => router.push(`?page=${currentPage + 1}`)}
            className="px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-300 hover:text-lime-300 hover:border-lime-300 transition"
          >
            Next →
          </button>
        </div>
      </div>
    </section>
  );
}
