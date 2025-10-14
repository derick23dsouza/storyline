export interface GutendexResult {
  id: number;
  title: string;
  authors: {
    name: string;
    birth_year?: number | null;
    death_year?: number | null;
  }[];
  translators?: {
    name: string;
    birth_year?: number | null;
    death_year?: number | null;
  }[];
  subjects?: string[];
  bookshelves?: string[];
  languages?: string[];
  copyright?: boolean;
  media_type?: string;
  formats: {
    "text/html"?: string;
    "image/jpeg"?: string;
    "application/epub+zip"?: string;
    "application/x-mobipocket-ebook"?: string;
    [key: string]: string | undefined; // catch-all for other formats
  };
  download_count?: number;
  summaries?: string[];
}

export interface GutendexResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: GutendexResult[];
}
