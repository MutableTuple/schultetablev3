import VsCompetitorPage from "@/app/_components/VsCompetitor/VsCompetitorPage";
import { ALTERNATIVES } from "@/app/_data/alternatives";

const data = ALTERNATIVES.find((a) => a.slug === "solitaire");

export const metadata = {
  // absolute — bypasses the root layout's "%s | Schulte Table" template,
  // which would otherwise push these titles past ~60 chars.
  title: { absolute: "Schulte Table vs Solitaire: Relax or Train Focus?" },
  description: "Schulte Table vs Solitaire compared for relaxation, strategy, and attention training. See which brain exercise fits your daily habit.",
  keywords: [
    "schulte table vs solitaire",
    "solitaire alternative",
    "solitaire vs schulte table",
    "solitaire brain training",
    "card game vs attention exercise"
  ],
  alternates: {
    canonical: "https://www.schultetable.com/schulte-table-vs-solitaire",
  },
  openGraph: {
    title: "Schulte Table vs Solitaire: Relax or Train Focus?",
    description: "Schulte Table vs Solitaire compared for relaxation, strategy, and attention training. See which brain exercise fits your daily habit.",
    url: "https://www.schultetable.com/schulte-table-vs-solitaire",
    siteName: "Schulte Table",
    type: "article",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Schulte Table Training Interface",
      },
    ],
  },
};

export default function Page() {
  return <VsCompetitorPage data={data} />;
}
