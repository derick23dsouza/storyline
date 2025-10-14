"use client";

import { useEffect, useState } from "react";

import ReactMarkdown from "react-markdown";
import { getBookSuggestions } from "../actions/actions";
import { useSession } from "@/lib/auth-client";
import Link from "next/link";
import Container from "@/components/container/Container";

export default function InsightsClient() {
  const [insights, setInsights] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const session = useSession();

  useEffect(() => {
    const loadInsights = async () => {
      try {
        const res = await fetch("/api/collections");
        const data = await res.json();

        const books = data.map((c: any) => ({
          name: c.book.title,
          authors: c.book.author ? [c.book.author] : [],
        }));

        const text = await getBookSuggestions(books);
        if (text) setInsights(text);


      } catch (e) {
        console.log(e);
        setInsights("⚠️ Unable to load insights at the moment.");
      } finally {
        setLoading(false);
      }
    };

    loadInsights();
  }, []);

  if (!session.data) return (

    <Container>
      <div className="text-center py-24">
        <h2 className="text-2xl text-lime-300 mb-4">
          You seem to be signed out. Sign in to view your insights.
        </h2>
        <Link
          href="/login"
          className="text-sm text-zinc-400 underline hover:text-lime-200"
        >
          Go to Login
        </Link>
      </div>
    </Container>

  )

  if (loading) return <p className="text-zinc-400">Loading your insights...</p>;



  return (
    <div className="prose prose-invert max-w-none leading-relaxed mt-6">
      <ReactMarkdown>{insights || "No insights available."}</ReactMarkdown>
    </div>
  );
}
