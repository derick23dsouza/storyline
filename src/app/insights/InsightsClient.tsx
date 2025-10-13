"use client";

import { useEffect, useState } from "react";

import ReactMarkdown from "react-markdown";
import { getBookSuggestions } from "../actions/actions";
import { useSession } from "@/lib/auth-client";
import Link from "next/link";

export default function InsightsClient() {
  const [insights, setInsights] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const session= useSession();

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
        if(text) setInsights(text);


      } catch (e) {
        console.log(e);
        setInsights("⚠️ Unable to load insights at the moment.");
      } finally {
        setLoading(false);
      }
    };

    loadInsights();
  }, []);

   if(!session.data)return(<div className=" bg-black text-white py-16 px-6 max-w-6xl mx-auto flex flex-col  gap-5 text-center items-center">
        <h1 className="text-4xl">Please Login to continue</h1>
        <Link href={'/login'} className="text-2xl text-lime-300 max-w-sm px-4 py-2 bg-zinc-950 border border-white rounded-lg">Login</Link>
        
    </div>)

  if (loading) return <p className="text-zinc-400">Loading your insights...</p>;



  return (
    <div className="prose prose-invert max-w-none leading-relaxed mt-6">
      <ReactMarkdown>{insights || "No insights available."}</ReactMarkdown>
    </div>
  );
}
