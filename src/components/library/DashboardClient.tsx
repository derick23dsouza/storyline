"use client";

import { useSession } from "@/lib/auth-client";
import { useEffect, useState } from "react";
import LibraryGrid from "./LibraryGrid";
import Container from "@/components/container/Container";
import { Loader2 } from "lucide-react";

export default function DashboardClient() {
  const { data: session, isPending } = useSession();
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isPending && session?.user) {
      const fetchLibrary = async () => {
        try {
          const res = await fetch("/api/collections");
          const data = await res.json();
          setCollections(data);
        } catch (err) {
          console.error("Error fetching library:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchLibrary();
    } else if (!isPending && !session?.user) {
      setLoading(false);
    }
  }, [session, isPending]);

  if (isPending || loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-lime-300 animate-spin" />
      </div>
    );
  }

  if (!session?.user) {
    return (
      <Container>
        <div className="text-center py-24">
          <h2 className="text-2xl text-lime-300 mb-4">
            Please sign in to view your library
          </h2>
          <a
            href="/login"
            className="text-sm text-zinc-400 underline hover:text-lime-200"
          >
            Go to Login
          </a>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="mb-12">
        <h1 className="text-4xl font-semibold mb-4 text-lime-300">
          Your Library
        </h1>
      </div>

      {collections.length === 0 ? (
        <p className="text-zinc-400">
          You haven’t added any books yet.{" "}
          <a
            href="/discover"
            className="text-lime-300 hover:text-lime-200 underline"
          >
            Discover books
          </a>
          .
        </p>
      ) : (
        <LibraryGrid collections={collections} />
      )}
    </Container>
  );
}
