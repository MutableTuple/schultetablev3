import VsCompetitorPage from "@/app/_components/VsCompetitor/VsCompetitorPage";
import { ALTERNATIVES } from "@/app/_data/alternatives";

const data = ALTERNATIVES.find((a) => a.slug === "headspace");

export const metadata = {
  // absolute — bypasses the root layout's "%s | Schulte Table" template,
  // which would otherwise push these titles past ~60 chars.
  title: { absolute: "Schulte Table vs Headspace: Meditate or Train Focus?" },
  description: "Schulte Table vs Headspace compared for calm, mindfulness, and active attention training. See which approach fits your focus goals.",
  keywords: [
    "schulte table vs headspace",
    "headspace alternative",
    "headspace vs schulte table",
    "meditation vs brain training",
    "mindfulness vs attention training"
  ],
  alternates: {
    canonical: "https://www.schultetable.com/schulte-table-vs-headspace",
  },
  openGraph: {
    title: "Schulte Table vs Headspace: Meditate or Train Focus?",
    description: "Schulte Table vs Headspace compared for calm, mindfulness, and active attention training. See which approach fits your focus goals.",
    url: "https://www.schultetable.com/schulte-table-vs-headspace",
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
