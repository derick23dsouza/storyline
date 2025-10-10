
export type GutendexBook = {
  id: number;
  title: string;
  authors: { name: string }[];
  languages: string[];
  download_count: number;
  formats: Record<string, string>;
};

const GUTENDEX_BASE = "https://gutendex.com";

export async function fetchGutendex(query: {
  page?: number;
  search?: string;
  topic?: string;
}) {
  const { page = 1, search, topic } = query;
  const url = new URL(`${GUTENDEX_BASE}/books`);
  url.searchParams.set("page", String(page));
  if (search) url.searchParams.set("search", search);
  if (topic) url.searchParams.set("topic", topic);

  const res = await fetch(url.toString(), { next: { revalidate: 60 * 5 } }); // 5 min cache
  if (!res.ok) throw new Error("Failed to fetch Gutendex");
  const data = await res.json();
  // data.results is array of books
  return data as {
    count: number;
    next: string | null;
    previous: string | null;
    results: GutendexBook[];
  };
}
