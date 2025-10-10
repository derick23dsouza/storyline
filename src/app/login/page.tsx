"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signIn } from "@/lib/auth-client";
import Link from "next/link";

export default function LoginPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // ✅ added

  useEffect(() => {
    if (!isPending && session?.user) {
      router.push("/");
    }
  }, [session, isPending, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true); // ✅ show loading

    try {
      const res = await signIn.email({ email, password });
      if (res.error) {
        setError(res.error.message ?? "Login failed");
      } else {
        router.push("/");
      }
    } finally {
      setIsSubmitting(false); 
    }
  };

  if (session) {
    return <div className="flex items-center justify-center min-h-screen text-white">You are already logged in. Redirecting to Home Page</div>;
  }

  if (isPending) {
    return <div className="flex items-center justify-center min-h-screen text-white">Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <h1 className="text-3xl font-semibold mb-6">Welcome back</h1>

      <form
        onSubmit={handleLogin}
        className="flex flex-col gap-4 w-full max-w-sm bg-zinc-900 p-8 rounded-xl border border-zinc-800"
      >
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-3 rounded-md bg-zinc-800 border border-zinc-700"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-3 rounded-md bg-zinc-800 border border-zinc-700"
          required
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className={`py-3 rounded-md font-medium transition-all ${
            isSubmitting
              ? "bg-zinc-500 cursor-not-allowed"
              : "border border-lime-300 hover:bg-white hover:text-black hover:border-white"
          }`}
        >
          {isSubmitting ? "Logging in..." : "Log in"} 
        </button>

        <p className="text-sm text-center text-zinc-400 mt-2">
          Don’t have an account?{" "}
          <Link href="/signup" className="text-blue-400 hover:underline">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}
