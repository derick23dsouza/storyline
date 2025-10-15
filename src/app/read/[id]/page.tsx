"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";

interface CollectionData {
  currentPage: number;
  progress: number;
}

export default function ReadingPage() {
  const { id } = useParams();
  const router = useRouter();

  const [pages, setPages] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [book, setBook] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fetch book content & last saved collection (if authenticated)
  useEffect(() => {
    async function loadBook() {
      setLoading(true);
      try {
        const res = await fetch(`/api/read/${id}`);
        const data = await res.json().catch(() => ({ error: "Unknown" }));
        if (!res.ok) throw new Error(data.error || "Failed to fetch book");
        if (!data.content) throw new Error("No content");

        setBook(data.book);

        // Clean content
        let content = data.content.replace(/\r\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
        const paragraphs: string[] = content.split(/\n\n+/);

        // Split into pages: 3 paragraphs per page or new chapter
        const pages: string[] = [];
        let tempPage: string[] = [];

        paragraphs.forEach((p) => {
          tempPage.push(p);
          if (tempPage.length === 3 || /^chapter\s+\d+/i.test(p)) {
            pages.push(tempPage.join("\n\n"));
            tempPage = [];
          }
        });
        if (tempPage.length) pages.push(tempPage.join("\n\n"));

        setPages(pages);

        // Load user's last saved page if authenticated
        const colRes = await fetch(`/api/collections/${id}`);
        if (colRes.ok) {
          const colData: CollectionData = await colRes.json();
          setCurrentPage(colData.currentPage || 0);
        }
      } catch (err) {
        console.error("Failed to load book:", err);
        setBook(null);
      } finally {
        setLoading(false);
      }
    }

    loadBook();
  }, [id]);

  
  const updateProgress = async (newPage: number) => {
    setCurrentPage(newPage);

    const progress = Math.floor(((newPage + 1) / pages.length) * 100);

    try {
      await fetch("/api/collections/progress", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          bookId: id,
          lastPage: newPage,
          progress,
        }),
      });
    } catch (err) {
      console.error("Failed to update progress", err);
    }
  };

  const nextPage = () => updateProgress(Math.min(currentPage + 1, pages.length - 1));
  const prevPage = () => updateProgress(Math.max(currentPage - 1, 0));

  if (loading) return <p className="text-center py-12 text-zinc-400 mt-30">Loading book...</p>;
  if (!book) return <p className="text-center text-red-500 mt-30">Failed to load book.</p>;

  return (
    <section className="min-h-screen bg-black text-white px-6 py-8 flex flex-col items-center mt-20">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center text-zinc-400 hover:text-lime-300 transition"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </button>
          <h1 className="text-xl font-semibold text-center flex-1">{book.title}</h1>
        </div>

        {/* Reader */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-6 min-h-[70vh] leading-relaxed text-zinc-200">
          <pre className="whitespace-pre-wrap">{pages[currentPage]}</pre>
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-6 w-full">
          <button
            onClick={prevPage}
            disabled={currentPage === 0}
            className="flex items-center px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg disabled:opacity-40"
          >
            <ChevronLeft className="w-4 h-4 mr-2" /> Prev
          </button>

          <span className="text-zinc-400">
            Page {currentPage + 1} / {pages.length} ({Math.floor(((currentPage + 1) / pages.length) * 100)}%)
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
