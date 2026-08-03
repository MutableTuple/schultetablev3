import BlogPost from "@/app/_components/Blog/BlogPost";
import { supabase } from "@/app/_lib/supabase";
import React from "react";

function truncate(text, max) {
  if (!text) return "";
  const stripped = text.replace(/<[^>]*>/g, "").replace(/[#*_`>]/g, "");
  return stripped.length > max
    ? stripped.slice(0, max - 1).trimEnd() + "…"
    : stripped;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;

  const { data: post } = await supabase
    .from("Blogs")
    .select("title, excerpt, content, image_url, slug")
    .eq("slug", slug)
    .single();

  if (!post) {
    return {
      title: { absolute: "Blog Post Not Found | Schulte Table" },
    };
  }

  const description = truncate(post.excerpt || post.content, 160);
  const url = `https://www.schultetable.com/blogs/${post.slug}`;
  const image = post.image_url || "/og-image.png";

  return {
    title: { absolute: `${truncate(post.title, 60)} | Schulte Table` },
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: post.title,
      description,
      url,
      siteName: "Schulte Table",
      type: "article",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
  };
}

export default function page() {
  return <BlogPost />;
}
