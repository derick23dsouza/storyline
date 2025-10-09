import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Container from "@/components/container/Container"; 

const sampleBooks = [
  {
    id: 13415,
    title: "The Lady with the Dog and Other Stories",
    author: "Anton Pavlovich Chekhov",
    cover: "https://www.gutenberg.org/cache/epub/13415/pg13415.cover.medium.jpg",
    category: "Russian Literature",
  },
  {
    id: 24162,
    title: "二刻拍案惊奇",
    author: "Ling Mengchu",
    cover: "https://www.gutenberg.org/cache/epub/24162/pg24162.cover.medium.jpg",
    category: "Chinese Classics",
  },
  {
    id: 5200,
    title: "Metamorphosis",
    author: "Franz Kafka",
    cover: "https://www.gutenberg.org/cache/epub/5200/pg5200.cover.medium.jpg",
    category: "Modern Classics",
  },
  {
    id: 84,
    title: "Frankenstein",
    author: "Mary Wollstonecraft Shelley",
    cover: "https://www.gutenberg.org/cache/epub/84/pg84.cover.medium.jpg",
    category: "Gothic Fiction",
  },
];

export default function CollectionPreview() {
  return (
    <section className="w-full py-24 text-white">
      <Container>
        <div className="rounded-2xl bg-zinc-900 border border-zinc-800 py-10 px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-10">
            <div>
              <h2 className="text-4xl font-semibold mb-2">
                Explore Timeless Classics
              </h2>
              <p className="text-zinc-400">
                A glimpse into some of the world’s most influential works.
              </p>
            </div>

            <a
              href="/discover"
              className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-all mt-4 sm:mt-0"
            >
              Discover All <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {sampleBooks.map((book) => (
              <div
                key={book.id}
                className="rounded-2xl overflow-hidden bg-zinc-800/50 border border-zinc-700 hover:border-indigo-400/50 transition-all group"
              >
                <div className="relative aspect-[3/4]">
                  <Image
                    src={book.cover}
                    alt={book.title}
                    fill
                    unoptimized
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-medium truncate">
                    {book.title}
                  </h3>
                  <p className="text-sm text-zinc-400">{book.author}</p>
                  <p className="text-xs mt-1 text-indigo-400">
                    {book.category}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

