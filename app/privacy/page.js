import Link from "next/link";
import React from "react";
import BackButton from "../_components/BackButton";
export const metadata = {
  title: "Privacy Policy",
  description:
    "Review SchulteTable.com's privacy policy to understand how we collect, use, and protect your personal data. Stay informed about your rights and our responsibilities.",
  keywords: [
    "Privacy Policy",
    "Schulte Table privacy",
    "user data protection",
    "cookie policy",
    "data usage",
    "SchulteTable.com",
  ],
  openGraph: {
    title: "Privacy Policy - Schulte Table",
    description:
      "Learn how SchulteTable.com collects and protects your data. Read our full privacy policy including cookies and tracking details.",
    url: "https://schultetable.com/privacy-policy",
    siteName: "Schulte Table",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy - Schulte Table",
    description:
      "Understand how your data is handled at SchulteTable.com. Read our privacy and cookies policy.",
  },
};

export default function page() {
  return (
    <div className="min-h-screen bg-base-100 text-base-content flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-3xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold">Privacy Policy</h1>

          <p className="text-lg mt-4">
            Your privacy is important to us. This Privacy Policy explains how{" "}
            <span className="font-semibold text-primary">SchulteTable.com</span>{" "}
            collects, uses, and protects your information.
          </p>
        </div>

        <div className="collapse collapse-arrow bg-base-200 mb-4">
          <input type="checkbox" />
          <div className="collapse-title text-xl font-medium">
            1. Information We Collect
          </div>
          <div className="collapse-content">
            <p>
              We may collect personal data such as name, email address, and
              usage information to improve our services.
            </p>
          </div>
        </div>

        <div className="collapse collapse-arrow bg-base-200 mb-4">
          <input type="checkbox" />
          <div className="collapse-title text-xl font-medium">
            2. How We Use Your Information
          </div>
          <div className="collapse-content">
            <p>
              We use collected data to enhance user experience, analyze trends,
              and improve website functionality.
            </p>
          </div>
        </div>

        <div className="collapse collapse-arrow bg-base-200 mb-4">
          <input type="checkbox" />
          <div className="collapse-title text-xl font-medium">
            3. Data Protection
          </div>
          <div className="collapse-content">
            <p>
              We implement security measures to protect your personal data from
              unauthorized access.
            </p>
          </div>
        </div>

        <div className="collapse collapse-arrow bg-base-200 mb-4">
          <input type="checkbox" />
          <div className="collapse-title text-xl font-medium">
            4. Cookies & Tracking
          </div>
          <div className="collapse-content">
            <p>
              Our website uses cookies to improve user experience. You can
              disable cookies in your browser settings.
            </p>
          </div>
        </div>

        <div className="collapse collapse-arrow bg-base-200 mb-4">
          <input type="checkbox" />
          <div className="collapse-title text-xl font-medium">
            5. Third-Party Services
          </div>
          <div className="collapse-content">
            <p>
              We may use third-party services (e.g., Google Analytics) to track
              usage and improve our platform.
            </p>
          </div>
        </div>

        <div className="collapse collapse-arrow bg-base-200 mb-4">
          <input type="checkbox" />
          <div className="collapse-title text-xl font-medium">
            6. Changes to This Policy
          </div>
          <div className="collapse-content">
            <p>
              We may update this Privacy Policy periodically. Please review it
              regularly for any changes.
            </p>
          </div>
        </div>
        <BackButton />
      </div>
    </div>
  );
}
