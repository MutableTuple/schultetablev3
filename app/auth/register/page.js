import React from "react";
import RegisterForm from "@/app/_components/Auth/RegisterForm";

export const metadata = {
  title: { absolute: "Create an Account" },
  description:
    "Sign up for a free Schulte Table account to track your brain game progress, compete on leaderboards, and unlock personalized analytics.",
  keywords: [
    "Schulte Table signup",
    "create brain training account",
    "register Schulte Table",
    "track brain game stats",
    "cognitive performance login",
  ],
  openGraph: {
    title: "Create an Account - Schulte Table",
    description:
      "Join Schulte Table to sharpen your mind, track your progress, and access premium brain training tools.",
    url: "https://www.schultetable.com/auth/register",
    siteName: "Schulte Table",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Schulte Table Training Interface",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sign Up for Schulte Table",
    description:
      "Create your free account to access progress tracking, analytics, and competitive leaderboards.",
  },
  alternates: {
    canonical: "https://www.schultetable.com/auth/register",
  },
};

export default function Page() {
  return (
    <div>
      <RegisterForm />
    </div>
  );
}
