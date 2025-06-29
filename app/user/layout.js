import React from "react";
import Navbar from "../_components/Navbar";
import { Raleway } from "next/font/google";
const raleway = Raleway({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-raleway",
});
export default function layout({ children }) {
  return (
    <div className="flex flex-col">
      <Navbar />
      {children}
    </div>
  );
}
