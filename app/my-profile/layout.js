// app/my-profile/layout.jsx
import React from "react";
import Navbar from "../_components/Navbar";
import Sidebar from "../_components/Profile/Sidebar";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar — fixed at top, h-16 */}
      <Navbar />

      {/* Below navbar */}
      <div className="flex">
        {/* Sidebar — fixed left, starts below navbar */}
        <Sidebar />

        {/* Main content — offset by sidebar width on desktop */}
        <main className="flex-1 lg:ml-64 min-h-[calc(100vh-4rem)] overflow-y-auto pb-20 lg:pb-0">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
