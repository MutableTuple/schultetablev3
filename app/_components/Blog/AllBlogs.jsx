import Link from "next/link";
import React from "react";

export default function AllBlogs({ blogPosts }) {
  if (!blogPosts?.length) {
    return (
      <div className="text-center text-base-content/60 py-10">
        No blog posts available.
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {blogPosts.map((post, index) => (
        <article
          key={post.slug}
          className={`${
            index !== blogPosts.length - 1
              ? "pb-12 border-b border-base-300"
              : ""
          }`}
        >
          <Link href={`/blogs/${post.slug}`} className="group block">
            <div className="grid md:grid-cols-3 gap-8 items-start">
              {/* Content Section */}
              <div className="md:col-span-2 space-y-4">
                <h2 className="text-2xl font-bold text-base-content group-hover:text-primary transition-colors">
                  {post.title}
                </h2>

                {post.excerpt && (
                  <p className="text-base-content/80 leading-relaxed text-[1.05rem]">
                    {post.excerpt}
                  </p>
                )}

                <div className="flex items-center flex-wrap gap-3 text-sm text-base-content/60 pt-1">
                  <span>{new Date(post.created_at).toLocaleDateString()}</span>
                  {post.readTime && (
                    <>
                      <span>•</span>
                      <span>{post.readTime} minutes</span>
                    </>
                  )}
                </div>
              </div>

              {/* Image or Icon Section */}
              <div className="md:col-span-1">
                {post.image_url ? (
                  <img
                    src={post.image_url}
                    alt={post.title}
                    className="rounded-lg w-full aspect-[4/3] object-cover shadow-sm"
                  />
                ) : (
                  <div className="aspect-[4/3] bg-base-200 rounded-lg flex items-center justify-center">
                    <div className="text-6xl opacity-30">🧠</div>
                  </div>
                )}
              </div>
            </div>
          </Link>
        </article>
      ))}
    </div>
  );
}
