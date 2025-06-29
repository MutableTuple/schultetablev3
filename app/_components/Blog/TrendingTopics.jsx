import Link from "next/link";
import React from "react";

export default function TrendingTopics({ trendingTopics }) {
  return (
    <div className="bg-base-50 p-6 rounded-lg border border-base-300">
      <h3 className="text-lg font-semibold mb-4 text-base-content">
        Trending Topics
      </h3>
      <div className="flex flex-wrap gap-2">
        {trendingTopics.map((topic) => (
          <Link
            key={topic}
            href={`/topics/${topic.toLowerCase().replace(" ", "-")}`}
            className="badge badge-outline hover:badge-primary transition-colors cursor-pointer"
          >
            {topic}
          </Link>
        ))}
      </div>
    </div>
  );
}
