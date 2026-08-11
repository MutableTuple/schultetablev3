import { getCurrentUser } from "@/app/_utils/getCurrentUser";
import GridBoard from "@/app/_components/GridPage/GridBoard";
import GridSeoContent, {
  buildGridJsonLd,
} from "@/app/_components/GridPage/GridSeoContent";
import { GRID_PAGES } from "@/app/_data/gridPages";

const data = GRID_PAGES["5x5"];
const url = `https://www.schultetable.com/schulte-table/${data.slug}`;

export const metadata = {
  // absolute — the root layout's "%s | Schulte Table" template would push
  // these past the ~60-char SERP truncation point.
  title: { absolute: data.metaTitle },
  description: data.metaDescription,
  keywords: data.keywords,
  alternates: { canonical: url },
  openGraph: {
    title: data.metaTitle,
    description: data.metaDescription,
    url,
    siteName: "Schulte Table",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: `${data.label} Schulte Table`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: data.metaTitle,
    description: data.metaDescription,
  },
};

export default async function Page() {
  const { user } = await getCurrentUser();
  const jsonLd = buildGridJsonLd(data);

  return (
    <>
      {jsonLd.map((block, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }}
        />
      ))}

      <header className="mx-auto max-w-3xl px-4 pt-6 text-center">
        <h1 className="text-xl font-black leading-tight text-foreground sm:text-2xl">
          {data.h1}
        </h1>
        <p className="mx-auto mt-2 max-w-2xl text-xs leading-relaxed text-muted-foreground sm:text-sm">
          {data.intro}
        </p>
      </header>

      <GridBoard user={user} initialSize={data.size} />

      <GridSeoContent data={data} />
    </>
  );
}
