import VsCompetitorPage from "@/app/_components/VsCompetitor/VsCompetitorPage";
import { ALTERNATIVES } from "@/app/_data/alternatives";

const data = ALTERNATIVES.find((a) => a.slug === "forest-app");

export const metadata = {
  // absolute — bypasses the root layout's "%s | Schulte Table" template,
  // which would otherwise push these titles past ~60 chars.
  title: { absolute: "Schulte Table vs Forest App: Focus Tool Compared" },
  description: "Compare Schulte Table and the Forest app for staying focused. See the difference between blocking distractions and actively training attention.",
  keywords: [
    "schulte table vs forest app",
    "forest app alternative",
    "forest app vs schulte table",
    "focus app comparison",
    "phone distraction app vs brain training"
  ],
  alternates: {
    canonical: "https://www.schultetable.com/schulte-table-vs-forest-app",
  },
  openGraph: {
    title: "Schulte Table vs Forest App: Focus Tool Compared",
    description: "Compare Schulte Table and the Forest app for staying focused. See the difference between blocking distractions and actively training attention.",
    url: "https://www.schultetable.com/schulte-table-vs-forest-app",
    type: "article",
  },
};

export default function Page() {
  return <VsCompetitorPage data={data} />;
}
