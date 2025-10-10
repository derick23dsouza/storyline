// import Container from "@/components/container/Container";
// import Image from "next/image";
// import Link from "next/link";

// export default async function DiscoverPage(props: {
//   searchParams: Promise<{ q?: string; page?: string }>;
// }) {
//   // ✅ Must await searchParams in Next 15
//   const searchParams = await props.searchParams;
//   const query = searchParams.q || "";
//   const page = Number(searchParams.page) || 1;

//   const res = await fetch(
//     `https://gutendex.com/books?${query ? `search=${encodeURIComponent(query)}&` : ""}page=${page}`,
//     { cache: "no-store" }
//   );

//   const data = await res.json();

//   const books = data.results || [];
//   const nextPage = data.next ? page + 1 : null;
//   const prevPage = data.previous ? page - 1 : null;

//   return (
//     <section className="min-h-screen w-full py-16 text-white bg-black">
//       <Container>
//         <div className="mb-10">
//           <h1 className="text-4xl font-semibold mb-2 text-lime-300">
//             Discover Books
//           </h1>
//           <p className="text-zinc-400">
//             Explore public-domain books from Project Gutenberg.
//           </p>
//         </div>

//         {/* Books Grid */}
//         {books.length > 0 ? (
//           <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8">
//             {books.map((book: any) => (
//               <Link
//                 key={book.id}
//                 href={`/book/${book.id}`}
//                 className="rounded-2xl overflow-hidden bg-blue-950/40 border border-zinc-800 hover:border-lime-300/50 transition-all group"
//               >
//                 <div className="relative aspect-[3/4]">
//                   <Image
//                     src={
//                       book.formats["image/jpeg"] ||
//                       "https://www.gutenberg.org/cache/epub/84/pg84.cover.medium.jpg"
//                     }
//                     alt={book.title}
//                     fill
//                     className="object-cover group-hover:scale-105 transition-transform"
//                     unoptimized
//                   />
//                 </div>
//                 <div className="p-4">
//                   <h3 className="text-base font-medium truncate">
//                     {book.title}
//                   </h3>
//                   <p className="text-sm text-zinc-400 truncate">
//                     {book.authors?.[0]?.name || "Unknown Author"}
//                   </p>
//                   <p className="text-xs text-lime-300 mt-1">
//                     {book.languages?.join(", ").toUpperCase()}
//                   </p>
//                 </div>
//               </Link>
//             ))}
//           </div>
//         ) : (
//           <p className="text-zinc-400">No books found for “{query}”.</p>
//         )}

//         {/* Pagination Controls */}
//         <div className="flex justify-center items-center gap-6 mt-12">
//           {prevPage && (
//             <Link
//               href={`/discover?q=${query}&page=${prevPage}`}
//               className="px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-300 hover:text-lime-300 hover:border-lime-300 transition-all"
//             >
//               ← Previous
//             </Link>
//           )}

//           <span className="text-zinc-400">Page {page}</span>

//           {nextPage && (
//             <Link
//               href={`/discover?q=${query}&page=${nextPage}`}
//               className="px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-300 hover:text-lime-300 hover:border-lime-300 transition-all"
//             >
//               Next →
//             </Link>
//           )}
//         </div>
//       </Container>
//     </section>
//   );
// }

import Container from "@/components/container/Container";
import BookCard from "@/components/discover/BookCard"; 
import Link from "next/link";
import { Suspense } from "react";

export default async function DiscoverPage(props: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  // ✅ Must await searchParams in Next.js 15
  const searchParams = await props.searchParams;
  const query = searchParams.q || "";
  const page = Number(searchParams.page) || 1;

  const res = await fetch(
    `https://gutendex.com/books?${query ? `search=${encodeURIComponent(query)}&` : ""}page=${page}`,
    { cache: "no-store" }
  );

  const data = await res.json();
  const books = data.results || [];
  const nextPage = data.next ? page + 1 : null;
  const prevPage = data.previous ? page - 1 : null;

  return (
    <section className="min-h-screen w-full py-16 text-white bg-black">
      <Container>
        <div className="mb-10">
          <h1 className="text-4xl font-semibold mb-2 text-lime-300">
            Discover Books
          </h1>
          <p className="text-zinc-400">
            Explore public-domain books from Project Gutenberg.
          </p>
        </div>

        {/* Book Grid */}
        {books.length > 0 ? (
          <Suspense fallback={<p className="text-zinc-500">Loading books...</p>}>
            
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8">
                  {books.map((book: any) => (
                    <Link key={book.id} href={`${process.env.NEXT_PUBLIC_API_URL}/book/${book.id}`}>
                        <BookCard  book={book} />
                    </Link>
                  ))}
                </div>
            
          </Suspense>
        ) : (
          <p className="text-zinc-400">No books found for “{query}”.</p>
        )}

        {/* Pagination */}
        <div className="flex justify-center items-center gap-6 mt-12">
          {prevPage && (
            <a
              href={`/discover?q=${query}&page=${prevPage}`}
              className="px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-300 hover:text-lime-300 hover:border-lime-300 transition-all"
            >
              ← Previous
            </a>
          )}

          <span className="text-zinc-400">Page {page}</span>

          {nextPage && (
            <a
              href={`/discover?q=${query}&page=${nextPage}`}
              className="px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-300 hover:text-lime-300 hover:border-lime-300 transition-all"
            >
              Next →
            </a>
          )}
        </div>
      </Container>
    </section>
  );
}
