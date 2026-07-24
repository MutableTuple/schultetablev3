import React from "react";
import ContactForm from "../_components/Support/ContactForm";
import Navbar from "../_components/Navbar";

export const metadata = {
  title: "Contact Us | Schulte Table",
  description:
    "Get in touch with the Schulte Table team. Have questions, feedback, or need support? Fill out our contact form and we'll get back to you quickly.",
  keywords: [
    "contact Schulte Table",
    "Schulte Table support",
    "brain exercise contact",
    "focus game help",
  ],
  authors: [{ name: "SchulteTable.com" }],
  openGraph: {
    title: "Contact Us | Schulte Table",
    description:
      "Reach out to the Schulte Table team for support, feedback, or inquiries.",
    url: "https://schultetable.com/support",
    siteName: "Schulte Table",
    type: "website",
    images: [{ url: "https://schultetable.com/og-image.jpg" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us | Schulte Table",
    description:
      "Have questions or feedback about Schulte Table? Contact us today!",
    images: ["https://schultetable.com/og-image.jpg"],
  },
  alternates: {
    canonical: "https://schultetable.com/support",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Contact Us - Schulte Table",
  description:
    "Contact Schulte Table team for support, questions, or business inquiries.",
  url: "https://schultetable.com/support",
  mainEntity: {
    "@type": "Organization",
    name: "Schulte Table",
    url: "https://schultetable.com",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      availableLanguage: ["English"],
    },
  },
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <ContactForm />
    </>
  );
}
