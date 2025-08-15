import React from "react";
import Navbar from "../_components/Navbar";
import { Raleway } from "next/font/google";
import Sidebar from "../_components/Profile/Sidebar";
const raleway = Raleway({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-raleway",
});
export default function layout({ children }) {
  return (
    <div className="flex flex-col">
      <Navbar />
      <div className="min-h-screen bg-base-200">
        <div className="container mx-auto md:p-6 p-1">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar Navigation */}
            <Sidebar />
            {/* Main Content Area */}
            <div className="lg:col-span-3">
              <div className="bg-base-100 border border-base-300 rounded-sm p-4">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
