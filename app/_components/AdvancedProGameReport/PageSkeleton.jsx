import React from 'react'

export default function PageSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-2 sm:px-4 py-4 space-y-6 animate-pulse">
      <div className="h-20 bg-base-200 rounded-2xl" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-base-200 rounded-xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-40 bg-base-200 rounded-xl" />
        ))}
      </div>
      <div className="flex justify-center pt-4">
        <span className="loading loading-spinner loading-lg" />
      </div>
      <p className="text-center text-sm opacity-60">
        Analyzing your brain performance…
      </p>
    </div>
  );
}

