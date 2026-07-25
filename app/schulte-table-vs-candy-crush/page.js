import VsCompetitorPage from "@/app/_components/VsCompetitor/VsCompetitorPage";
import { ALTERNATIVES } from "@/app/_data/alternatives";

const data = ALTERNATIVES.find((a) => a.slug === "candy-crush");

export const metadata = {
  title: "Schulte Table vs Candy Crush: Casual Fun or Real Brain Training?",
  description: "Compare Schulte Table and Candy Crush Saga for focus, entertainment, and cognitive value. See which one actually trains your brain.",
  keywords: [
    "schulte table vs candy crush",
    "candy crush alternative",
    "candy crush vs schulte table",
    "brain training vs mobile games",
    "candy crush focus"
  ],
  alternates: {
    canonical: "https://schultetable.com/schulte-table-vs-candy-crush",
  },
  openGraph: {
    title: "Schulte Table vs Candy Crush: Casual Fun or Real Brain Training?",
    description: "Compare Schulte Table and Candy Crush Saga for focus, entertainment, and cognitive value. See which one actually trains your brain.",
    url: "https://schultetable.com/schulte-table-vs-candy-crush",
    type: "article",
  },
};

export default function Page() {
  return <VsCompetitorPage data={data} />;
}
