import { ArrowRight } from "lucide-react";
import Container from "@/components/container/Container";
import Link from "next/link";

export default function CTASection() {
  return (
    <section className="relative w-full py-24 text-center text-white overflow-hidden">
      <Container className="relative z-10 border border-zinc-700 p-12 bg-[radial-gradient(circle_at_center,_rgba(56,189,248,0.2),_rgba(9,9,11,1)_75%)] rounded-lg">
        <h2 className="text-4xl md:text-6xl font-semibold mb-6 text-lime-300">
          Start Your Storyline Today!
        </h2>
        <p className="text-zinc-400 max-w-2xl mx-auto mb-10">
          Build your personal reading journey. Track progress, explore timeless classics,
          and discover new worlds one page at a time.
        </p>

        <Link
          href="/signup"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-blue-950 shadow-xl shadow-black hover:bg-white hover:text-black transition-all text-white font-medium text-lg"
        >
          Sign Up For Free <ArrowRight className="w-5 h-5" />
        </Link>
      </Container>

      {/* Subtle gradient or blur background */}
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 to-transparent pointer-events-none" />
    </section>
  );
}
