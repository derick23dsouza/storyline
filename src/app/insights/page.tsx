import InsightsClient from "./InsightsClient";

export default function InsightsPage() {

  return (
    <section className="min-h-screen bg-black text-white py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-semibold mb-6 text-lime-300">
          Your Reading Insights
        </h1>
        <p className="text-zinc-400 mb-8">
          AI-generated insights based on your saved books.
        </p>

        <InsightsClient />
      </div>
    </section>
  );
}
