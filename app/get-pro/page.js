import React from "react";
import { redirect } from "next/navigation"; // ← Import this
import Navbar from "../_components/Navbar";
import Pro from "../_components/Pro";
import { getCurrentUser } from "../_utils/getCurrentUser";

export const metadata = {
  title: "Schulte Table Pro",
  description:
    "Upgrade to Schulte Table Pro for exclusive features like detailed analytics, custom challenges, dark mode, and ad-free gameplay. Sharpen your mind with more control.",
  keywords: [
    "Schulte Table Pro",
    "upgrade Schulte Table",
    "brain game pro version",
    "ad-free Schulte Table",
    "premium brain training",
    "focus game upgrade",
  ],
  openGraph: {
    title: "Schulte Table Pro – Unlock Advanced Features",
    description:
      "Access advanced tools, analytics, and distraction-free gameplay by upgrading to Schulte Table Pro. Take your focus training to the next level.",
    url: "https://schultetable.com/pro",
    siteName: "Schulte Table",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Go Pro with Schulte Table",
    description:
      "Level up your cognitive training with exclusive Schulte Table Pro features. Smarter tools, deeper insights.",
  },
};

export default async function page() {
  const { user, error } = await getCurrentUser();

  // 🔁 Check and redirect if no user
  if (!user || !user[0]?.id) {
    redirect("/auth/login");
  }

  return (
    <>
      <Navbar />
      <Pro user={user} />
    </>
  );
}
