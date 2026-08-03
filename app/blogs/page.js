import React from "react";
import BlogHome from "../_components/Blog/BlogHome";

export const metadata = {
  title: "Blogs",
  description:
    "Read insightful articles on brain training, focus, memory improvement, and productivity. Stay sharp with Schulte Table's expert-backed content.",
  keywords: [
    "Schulte Table blog",
    "brain exercises",
    "focus improvement",
    "memory hacks",
    "mental performance",
    "productivity tips",
  ],
  openGraph: {
    title: "Blogs - Schulte Table",
    description:
      "Explore expert articles on brain training, focus, and cognitive performance. Learn how to stay sharp.",
    url: "https://www.schultetable.com/blogs",
    siteName: "Schulte Table",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Schulte Table Training Interface",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Brain & Focus Blog - Schulte Table",
    description:
      "Read expert tips on focus, brain training, and productivity to sharpen your mind.",
  },
  alternates: {
    canonical: "https://www.schultetable.com/blogs",
  },
};

export default function Page() {
  return (
    <div>
      <BlogHome />
    </div>
  );
}
