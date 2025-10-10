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

  return (
    <section className="min-h-screen w-full py-16 bg-black text-white">
      <Container className="flex flex-col md:flex-row gap-12">
        <div className="w-full md:w-1/3 relative aspect-[3/4] rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900">
          <Image src={cover} alt={book.title} fill unoptimized className="object-cover" />
        </div>

        <div className="flex-1">
          <h1 className="text-4xl font-semibold text-lime-300">{book.title}</h1>
          <p className="text-zinc-400 text-lg mt-2">{authors}</p>

          <div className="mt-4 text-sm text-zinc-500 space-y-1">
            <p><strong>Languages:</strong> {languages}</p>
            <p><strong>Downloads:</strong> {book.download_count.toLocaleString()}</p>
          </div>

          <div className="mt-8 flex gap-4">
            {/* 👇 pass full book data, button handles session + library check */}
            <AddButton book={book} />
            <Link
              href={book.formats["text/html"] || "#"}
              target="_blank"
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
