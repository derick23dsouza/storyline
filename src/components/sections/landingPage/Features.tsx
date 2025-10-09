import { LineChart, Users, Sparkles, BookText } from "lucide-react";

const features = [
  {
    icon: <BookText className="w-8 h-8 text-amber-500" />, 
    title: "Track Your Reading",
    description:
      "Easily add books or articles, mark progress, and keep your personal library organized.",
  },
  {
    icon: <LineChart className="w-8 h-8 text-amber-500" />,
    title: "Visualize Your Growth",
    description:
      "See stats, reading streaks, and insights on how your habits evolve over time.",
  },
  {
    icon: <Sparkles className="w-8 h-8 text-amber-500" />,
    title: "AI Summaries & Highlights",
    description:
      "Generate quick summaries, key quotes, or personalized reading insights using AI.",
  },
  {
    icon: <Users className="w-8 h-8 text-amber-500" />,
    title: "Join a Reading Community",
    description:
      "Connect with fellow readers, share your progress, and climb the leaderboard.",
  },
];

export default function Features() {
  return (
    <section className="relative w-full py-24 text-white">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-6xl font-semibold mb-4">Your Reading, Reimagined</h2>
        <p className="text-zinc-400 max-w-2xl mx-auto mb-16">
          Storyline gives you the tools to stay consistent, understand your habits,
          and connect with others who love to read.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 rounded-2xl bg-zinc-800/50 backdrop-blur border border-zinc-700 hover:border-indigo-400/50 hover:scale-[1.02] transition-transform"
            >
              <div className="flex justify-center mb-4">{feature.icon}</div>
              <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
