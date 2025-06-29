import Link from "next/link";
import React from "react";

export default function RecommendedReads({ recommendedReads }) {
  return (
    <div className="bg-base-50 p-6 rounded-lg border border-base-300">
      <h3 className="text-lg font-semibold mb-4 text-base-content">
        Recommended for you
      </h3>
      <div className="space-y-4">
        {recommendedReads.map((article, index) => (
          <div key={index} className="group">
            <Link href="#" className="block">
              <h4 className="font-medium text-base-content group-hover:text-primary transition-colors leading-snug mb-1">
                {article.title}
              </h4>
              <div className="flex items-center gap-2 text-sm text-base-content/60">
                <span>{article.author}</span>
                <span>•</span>
                <span>{article.readTime}</span>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
