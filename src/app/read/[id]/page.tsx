"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";

export default function ReadingPage() {
  const { id } = useParams();
  const [pages, setPages] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [book, setBook] = useState<any>(null);
  const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function loadBook() {
//       try {
//         const res = await fetch(`https://gutendex.com/books/${id}`);
//         const data = await res.json();
//         setBook(data);

//         const contentUrl =
//           data.formats["text/plain; charset=us-ascii"] ||
//           data.formats["text/plain"] ||
//           data.formats["text/html"];

//         const textRes = await fetch(contentUrl);
//         let rawText = await textRes.text();

//         // Clean Gutenberg headers/footers
//         rawText = rawText
//           .replace(/[\r\n]{3,}/g, "\n\n")
//           .replace(/(\*\*\* START.*?\*\*\*)[\s\S]*?(\*\*\* END OF)/gi, "")
//           .trim();

//         // Split text into "pages" (~1800 characters each)
//         const chunkSize = 1800;
//         const chunks = [];
//         for (let i = 0; i < rawText.length; i += chunkSize) {
//           chunks.push(rawText.slice(i, i + chunkSize));
//         }

//         setPages(chunks);
//       } catch (err) {
//         console.error("Error loading book:", err);
//       } finally {
//         setLoading(false);
//       }
//     }

//     loadBook();
//   }, [id]);

    useEffect(() => {
  async function loadBook() {
    try {
      const res = await fetch(`/api/read/${id}`);
      const data = await res.json();

      if (!data.content) throw new Error("No content");

      const rawText = data.content.replace(/[\r\n]{3,}/g, "\n\n").trim();

      const chunkSize = 1800;
      const chunks = [];
      for (let i = 0; i < rawText.length; i += chunkSize) {
        chunks.push(rawText.slice(i, i + chunkSize));
      }

      setBook(data.book);
      setPages(chunks);
    } catch (err) {
      console.error("Error loading book:", err);
    } finally {
      setLoading(false);
    }
  }

  loadBook();
}, [id]);


  const nextPage = () =>
    setCurrentPage((p) => Math.min(p + 1, pages.length - 1));
  const prevPage = () => setCurrentPage((p) => Math.max(p - 1, 0));

  if (loading) return <p className="text-center py-12 text-zinc-400 mt-30">Loading book...</p>;
  if (!book) return <p className="text-center text-red-500 mt-30">Failed to load book.</p>;

  return (
    <section className="min-h-screen bg-black text-white px-6 py-8 flex flex-col items-center mt-20">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <Link
            href={`/book/${book.id}`}
            className="inline-flex items-center text-zinc-400 hover:text-lime-300 transition"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Link>
          <h1 className="text-xl font-semibold text-center flex-1">
            {book.title}
          </h1>
        </div>

        {/* Reader */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-6 min-h-[70vh] leading-relaxed text-zinc-200">
          <pre className="whitespace-pre-wrap">{pages[currentPage]}</pre>
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={prevPage}
            disabled={currentPage === 0}
            className="flex items-center px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg disabled:opacity-40"
          >
            <ChevronLeft className="w-4 h-4 mr-2" /> Prev
          </button>

          <span className="text-zinc-400">
            Page {currentPage + 1} / {pages.length}
          </span>

          <button
            onClick={nextPage}
            disabled={currentPage === pages.length - 1}
            className="flex items-center px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg disabled:opacity-40"
          >
            Next <ChevronRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>
    </section>
  );
}
