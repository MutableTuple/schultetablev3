import Link from "next/link";
import React from "react";
import BackButton from "../_components/BackButton";

export const metadata = {
  title: "Cookies Policy",
  description:
    "Learn how SchulteTable.com uses cookies to improve your experience, analyze traffic patterns, and maintain optimal site functionality.",
  keywords: [
    "Cookies Policy",
    "Schulte Table cookies",
    "website cookies",
    "privacy and cookies",
    "user tracking policy",
    "SchulteTable.com",
  ],
  openGraph: {
    title: "Cookies Policy - Schulte Table",
    description:
      "Understand how cookies are used on SchulteTable.com to deliver a smooth and personalized user experience.",
    url: "https://schultetable.com/cookies",
    siteName: "Schulte Table",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cookies Policy - Schulte Table",
    description:
      "Read our Cookies Policy to learn how SchulteTable.com uses cookies and what it means for your privacy.",
  },
};

export default function CookiesPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-6 bg-base-100 text-base-content">
      <h1 className="text-4xl font-bold mb-4">Cookies Policy</h1>
      <p className="max-w-2xl text-lg mb-6">
        This Cookies Policy explains how <strong>SchulteTable.com</strong> uses
        cookies to enhance your experience.
      </p>

      <div className="w-full max-w-2xl text-left">
        <div className="collapse collapse-arrow bg-base-200 mb-3">
          <input type="checkbox" />
          <div className="collapse-title text-xl font-medium">
            1. What Are Cookies?
          </div>
          <div className="collapse-content">
            <p>
              Cookies are small text files stored on your device when you visit
              a website. They help improve functionality, track user
              preferences, and enhance your browsing experience.
            </p>
          </div>
        </div>

        <div className="collapse collapse-arrow bg-base-200 mb-3">
          <input type="checkbox" />
          <div className="collapse-title text-xl font-medium">
            2. How We Use Cookies
          </div>
          <div className="collapse-content">
            <p>
              We use cookies to analyze site traffic, remember your settings,
              and improve user experience. Some cookies are necessary for the
              website to function properly.
            </p>
          </div>
        </div>

        <div className="collapse collapse-arrow bg-base-200 mb-3">
          <input type="checkbox" />
          <div className="collapse-title text-xl font-medium">
            3. Managing Cookies
          </div>
          <div className="collapse-content">
            <p>
              You can control or delete cookies through your browser settings.
              However, disabling certain cookies may affect the website’s
              functionality.
            </p>
          </div>
        </div>

        <div className="collapse collapse-arrow bg-base-200 mb-3">
          <input type="checkbox" />
          <div className="collapse-title text-xl font-medium">
            4. Third-Party Cookies
          </div>
          <div className="collapse-content">
            <p>
              We may use third-party services like Google Analytics that set
              their own cookies to track website usage.
            </p>
          </div>
        </div>

        <div className="collapse collapse-arrow bg-base-200 mb-6">
          <input type="checkbox" />
          <div className="collapse-title text-xl font-medium">
            5. Updates to This Policy
          </div>
          <div className="collapse-content">
            <p>
              We may update this Cookies Policy from time to time. Please check
              back regularly for any changes.
            </p>
          </div>
        </div>
        <BackButton />
      </div>
    </div>
  );
}
