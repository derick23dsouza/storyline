export default function Loading() {
  return (
    <section className="min-h-screen w-full flex flex-col items-center justify-center bg-black text-lime-300">
      <div className="w-12 h-12 border-4 border-lime-300 border-t-transparent rounded-full animate-spin mb-6"></div>
      <p className="text-zinc-400 text-sm">Loading awesome books for you...</p>
    </section>
  );
}
