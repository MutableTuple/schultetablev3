import Link from "next/link";
import { Swords } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ALTERNATIVES } from "@/app/_data/alternatives";

export const metadata = {
  // absolute — bypasses the root layout's "%s | Schulte Table" template,
  // which would otherwise push this title past ~60 chars.
  title: { absolute: "Schulte Table Alternatives: 27 Brain Games & Apps Compared" },
  description:
    "Comparing Schulte Table against Sudoku, Wordle, Chess, Lumosity, Elevate, and 22 more brain games and focus apps. Find the right one for your goals.",
  keywords: [
    "schulte table alternatives",
    "brain training alternatives",
    "focus apps compared",
    "brain games comparison",
    "schulte table vs",
  ],
  alternates: {
    canonical: "https://www.schultetable.com/schulte-table-alternatives",
  },
  openGraph: {
    title: "Schulte Table Alternatives: 27 Brain Games & Apps Compared",
    description:
      "Comparing Schulte Table against Sudoku, Wordle, Chess, Lumosity, Elevate, and more brain games and focus apps.",
    url: "https://www.schultetable.com/schulte-table-alternatives",
    type: "article",
  },
};

// The two pre-existing comparisons aren't in the ALTERNATIVES data set
// (different page implementation), so they're listed alongside it here.
const EXTRA_COMPARISONS = [
  { slug: "elevate", name: "Elevate", category: "Brain Training App" },
  { slug: "lumosity", name: "Lumosity", category: "Brain Training App" },
];

function groupByCategory(items) {
  const groups = {};
  for (const item of items) {
    if (!groups[item.category]) groups[item.category] = [];
    groups[item.category].push(item);
  }
  return groups;
}

export default function Page() {
  const all = [...ALTERNATIVES, ...EXTRA_COMPARISONS].sort((a, b) => a.name.localeCompare(b.name));
  const grouped = groupByCategory(all);

  return (
    <div className="min-h-screen bg-background">
      <section className="border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center">
          <span className="inline-block text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-primary/15 text-primary mb-5">
            Comparisons
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-foreground leading-tight">
            Schulte Table Alternatives
          </h1>
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-muted-foreground mt-4">
            Honest, feature-by-feature comparisons against {all.length} popular brain games,
            puzzles, and focus apps — so you can pick the right tool, or use a few together.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-14 space-y-12">
        {Object.entries(grouped).map(([category, items]) => (
          <section key={category}>
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">
              {category}
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {items.map((item) => (
                <Link
                  key={item.slug}
                  href={`/schulte-table-vs-${item.slug}`}
                  className="flex items-center justify-between gap-3 bg-card border border-border rounded-2xl px-5 py-4 hover:border-primary/40 transition-colors"
                >
                  <span className="font-bold text-foreground text-sm">
                    Schulte Table vs {item.name}
                  </span>
                  <span className="text-primary text-sm shrink-0">→</span>
                </Link>
              ))}
            </div>
          </section>
        ))}

        <section className="text-center pt-6">
          <h2 className="text-2xl sm:text-3xl font-black text-foreground mb-3">
            Or Skip the Comparisons — Just Play
          </h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Free, no sign-up required, and ready in the next 30 seconds.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button render={<Link href="/" />} nativeButton={false} className="gap-1.5">
              Play Free →
            </Button>
            <Button variant="outline" render={<Link href="/duels" />} nativeButton={false} className="gap-1.5">
              <Swords size={15} /> Challenge a Friend
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
