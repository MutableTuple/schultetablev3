"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getBlogBySlugName } from "@/app/_lib/data-service";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import BackButton from "../BackButton";

export default function BlogPost() {
  const { slug } = useParams();
  const router = useRouter();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;

      const data = await getBlogBySlugName(slug);
      if (data && data.length > 0) {
        setPost(data[0]);
      }
    };

    fetchPost();
  }, [slug]);

  if (!post)
    return (
      <div className="p-10 flex justify-center text-lg text-base-content/60">
        <span className="loading loading-bars loading-lg"></span>
      </div>
    );

  return (
    <div className="min-h-screen bg-base-100">
      {/* Header */}
      <div className="w-full bg-primary text-primary-content py-12">
        <div className="max-w-4xl mx-auto px-6">
          <div className="mb-4">
            <BackButton />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold leading-snug mb-4">
            {post.title}
          </h1>
          <p className="text-sm opacity-80">
            By <span className="font-semibold">{post.author}</span> ·{" "}
            {new Date(post.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Markdown Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="prose prose-lg max-w-none text-base-content prose-headings:text-base-content prose-headings:mb-4 prose-p:my-4 prose-li:my-2 prose-img:rounded-xl prose-a:text-primary">
          <ReactMarkdown
            rehypePlugins={[rehypeRaw]}
            components={{
              img: ({ src, alt }) => (
                <img
                  src={src}
                  alt={alt}
                  className="w-full h-auto my-8 rounded-lg shadow-md"
                />
              ),
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
