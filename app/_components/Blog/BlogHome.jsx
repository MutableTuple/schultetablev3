"use client";

import { useEffect, useState } from "react";
import { getAllBlogs } from "@/app/_lib/data-service";
import Header from "./Header";
import AllBlogs from "./AllBlogs";
import TrendingTopics from "./TrendingTopics";
import RecommendedReads from "./RecommendedReads";
import NewsletterSignIn from "./NewsletterSignIn";

const trendingTopics = [
  "Brain Training",
  "Focus Techniques",
  "Cognitive Enhancement",
  "Speed Reading",
  "Mental Performance",
  "Neuroplasticity",
];

const recommendedReads = [
  {
    title: "The Science Behind Schulte Tables",
    author: "Dr. Sarah Chen",
    readTime: "3 min",
  },
  {
    title: "Building Mental Stamina for Work",
    author: "Alex Rivera",
    readTime: "6 min",
  },
  {
    title: "Peripheral Vision Training Methods",
    author: "Marcus Webb",
    readTime: "4 min",
  },
];

export default function BlogHome() {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      const blogs = await getAllBlogs();
      if (blogs) setBlogPosts(blogs);
      setLoading(false);
    };

    fetchBlogs();
  }, []);

  return (
    <div className="min-h-screen bg-base-100">
      <Header />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-4 gap-12">
          {/* Main Content */}
          <main className="lg:col-span-3">
            {loading ? (
              <div className="text-center py-10 text-lg text-gray-500">
                <span className="loading loading-bars loading-lg"></span>
              </div>
            ) : (
              <AllBlogs blogPosts={blogPosts} />
            )}

            {/* Load More */}
            {/* <div className="text-center pt-16">
              <button className="btn btn-outline btn-wide">
                See all posts
              </button>
            </div> */}
          </main>

          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-8">
            <TrendingTopics trendingTopics={trendingTopics} />
            <RecommendedReads recommendedReads={recommendedReads} />
            <NewsletterSignIn />
          </aside>
        </div>
      </div>
    </div>
  );
}
