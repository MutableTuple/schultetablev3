import VsCompetitorPage from "@/app/_components/VsCompetitor/VsCompetitorPage";
import { ALTERNATIVES } from "@/app/_data/alternatives";

const data = ALTERNATIVES.find((a) => a.slug === "cambridge-brain-sciences");

export const metadata = {
  // absolute — bypasses the root layout's "%s | Schulte Table" template,
  // which would otherwise push these titles past ~60 chars.
  title: { absolute: "Schulte Table vs Cambridge Brain Sciences: Compared" },
  description: "Compare Schulte Table and Cambridge Brain Sciences for cognitive testing versus everyday attention training. See which fits your needs.",
  keywords: [
    "schulte table vs cambridge brain sciences",
    "cambridge brain sciences alternative",
    "cognitive test vs brain training",
    "free attention training",
    "scientific cognitive assessment"
  ],
  alternates: {
    canonical: "https://www.schultetable.com/schulte-table-vs-cambridge-brain-sciences",
  },
  openGraph: {
    title: "Schulte Table vs Cambridge Brain Sciences: Compared",
    description: "Compare Schulte Table and Cambridge Brain Sciences for cognitive testing versus everyday attention training. See which fits your needs.",
    url: "https://www.schultetable.com/schulte-table-vs-cambridge-brain-sciences",
    type: "article",
  },
};

export default function Page() {
  return <VsCompetitorPage data={data} />;
}
