import React from 'react'

export default function SectionCard({ title, icon, children }) {
  return (
    <div className="bg-base-200 rounded-xl p-4 border border-base-300 space-y-3">
      <h3 className="font-semibold flex items-center gap-2 text-sm">
        {icon}
        {title}
      </h3>
      {children}
    </div>
  );
}

