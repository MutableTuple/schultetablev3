import React from "react";
import LoginForm from "@/app/_components/Auth/LoginForm";

export const metadata = {
  title: "Login",
  description:
    "Login to your Schulte Table account to track your progress, access game analytics, and unlock personalized features.",
  keywords: [
    "Schulte Table login",
    "login brain games",
    "focus training login",
    "track Schulte Table progress",
    "cognitive training account",
  ],
  openGraph: {
    title: "Login - Schulte Table",
    description:
      "Sign in to SchulteTable.com to access your game stats, leaderboards, and personalized brain training tools.",
    url: "https://schultetable.com/auth/login",
    siteName: "Schulte Table",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Login to Schulte Table",
    description:
      "Access your brain training dashboard and personalized game stats on Schulte Table.",
  },
};

export default function Page() {
  return <LoginForm />;
}
