"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import gutendexData from "@/app/data/gutendexData.json";
import BookCard from "@/components/discover/BookCard";
import { GutendexResponse, GutendexResult } from "@/app/data/gutendexType";

const BOOKS_PER_PAGE = 32;

export default function DiscoverClient({
  userCollections,
}: {
  userCollections: string[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentPage = Number(searchParams.get("page") || 1);

  const [books, setBooks] = useState<GutendexResult[]>(gutendexData.results ?? []);
  const [fetchedPages, setFetchedPages] = useState<number[]>([1]);
  const [loading, setLoading] = useState(false);

  // Fetch next page from Gutendex (only if not already fetched)
  const fetchPage = async (page: number) => {
    if (fetchedPages.includes(page)) return; // already have this page
    setLoading(true);
    try {
      const res = await fetch(`https://gutendex.com/books/?page=${page}`);
      const data: GutendexResponse = await res.json();
      if (data.results?.length) {
        // Avoid duplicates
        const newBooks = data.results.filter(
          (b) => !books.some((book) => book.id === b.id)
        );
        setBooks((prev) => [...prev, ...newBooks]);
        setFetchedPages((prev) => [...prev, page]);
      }
    } catch (err) {
      console.error(`Failed to fetch page ${page}`, err);
    } finally {
      setLoading(false);
    }
  };

  // When page param changes, fetch it if needed
  useEffect(() => {
    if (!fetchedPages.includes(currentPage)) {
      fetchPage(currentPage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  // Slice the visible range based on the page param
  const start = (currentPage - 1) * BOOKS_PER_PAGE;
  const end = currentPage * BOOKS_PER_PAGE;
  const displayedBooks = books.slice(start, end);

  return (
    <section className="min-h-screen w-full py-16 text-white bg-black ">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-semibold mb-2 text-lime-300">
          Discover Books
        </h1>
        <p className="text-zinc-400 mb-8">
          Explore public-domain books from Project Gutenberg.
        </p>

        {/* Book Grid */}
        {displayedBooks.length > 0 ? (
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
          <p className="text-zinc-400 text-center mt-12">
            {loading ? "Loading books..." : "No books found."}
          </p>
        )}

        {/* Pagination Controls */}
        <div className="flex justify-center items-center gap-4 mt-10">
          <button
            disabled={currentPage === 1}
            onClick={() => router.push(`?page=${currentPage - 1}`)}
            className="px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-300 hover:text-lime-300 hover:border-lime-300 transition-all disabled:opacity-40"
          >
            ← Previous
          </button>

          <span className="text-zinc-400">Page {currentPage}</span>

          <button
            onClick={() => router.push(`?page=${currentPage + 1}`)}
            className="px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-300 hover:text-lime-300 hover:border-lime-300 transition-all"
          >
            Next →
          </button>
        </div>
      </div>
    </section>
  );
}
