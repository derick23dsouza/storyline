import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Container from "@/components/container/Container";
import AddButton from "@/components/books/AddButton";

export default async function BookPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;

  const res = await fetch(`https://gutendex.com/books/${id}`, { cache: "no-store" });
  if (!res.ok) return notFound();
  const book = await res.json();

  const cover =
    book.formats["image/jpeg"] ||
    book.formats["image/jpg"] ||
    `https://www.gutenberg.org/cache/epub/${book.id}/pg${book.id}.cover.medium.jpg`;

  const authors = book.authors?.map((a: any) => a.name).join(", ") || "Unknown Author";
  const languages = book.languages?.join(", ").toUpperCase();
  const summary =
    (Array.isArray(book.summaries) && book.summaries.length > 0 && book.summaries[0]) ||
    "Summary not available right now.";

  return (
    <section className="min-h-screen w-full py-16 bg-black text-white mt-10">
      <Container className="flex flex-col md:flex-row gap-12">
        {/* Book Cover */}
        <div className="w-full md:w-1/4 flex justify-center">
          <div className="relative aspect-[3/4] w-64 max-h-[420px] rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900 shadow-lg">
            <Image
              src={cover}
              alt={book.title}
              fill
              unoptimized
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 300px"
            />
          </div>
        </div>

        {/* Book Info */}
        <div className="flex-1">
          <h1 className="text-4xl font-semibold text-lime-300">{book.title}</h1>
          <p className="text-zinc-400 text-lg mt-2">{authors}</p>

          <div className="mt-4 text-sm text-zinc-500 space-y-1">
            <p><strong>Languages:</strong> {languages}</p>
            <p><strong>Downloads:</strong> {book.download_count.toLocaleString()}</p>
          </div>

          {/* ✅ Summary */}
          <div className="mt-8">
            <h2 className="text-xl font-medium text-white mb-2">Summary</h2>
            <p className="text-zinc-400 leading-relaxed">{summary}</p>
          </div>

          {/* Buttons */}
          <div className="mt-8 flex gap-4">
            <AddButton book={book} />
            <Link
              href={`${process.env.NEXT_PUBLIC_API_URL}/read/${book.id}`}
              className="px-4 py-2 rounded-md bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-lime-300 hover:border-lime-300 transition-all"
            >
              Read Online
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
