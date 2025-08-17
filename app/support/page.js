import React from "react";
import ContactForm from "../_components/Support/ContactForm";
import Navbar from "../_components/Navbar";
import Head from "next/head";

export default function Page() {
  return (
    <>
      <Head>
        {/* Basic SEO */}
        <title>Contact Us | Schulte Table</title>
        <meta
          name="description"
          content="Get in touch with the Schulte Table team. Have questions, feedback, or need support? Fill out our contact form and we’ll get back to you quickly."
        />
        <meta
          name="keywords"
          content="contact Schulte Table, Schulte Table support, brain exercise contact, focus game help"
        />
        <meta name="author" content="SchulteTable.com" />

        {/* Open Graph (Facebook, LinkedIn) */}
        <meta property="og:title" content="Contact Us | Schulte Table" />
        <meta
          property="og:description"
          content="Reach out to the Schulte Table team for support, feedback, or inquiries."
        />
        <meta
          property="og:url"
          content="https://www.schultetable.com/support"
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content="https://schultetable.com/og-image.jpg"
        />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Contact Us | Schulte Table" />
        <meta
          name="twitter:description"
          content="Have questions or feedback about Schulte Table? Contact us today!"
        />
        <meta
          name="twitter:image"
          content="https://schultetable.com/og-image.jpg"
        />

        {/* Canonical URL */}
        <link rel="canonical" href="https://www.schultetable.com/support" />

        {/* Structured Data (FAQ or Contact) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ContactPage",
              name: "Contact Us - Schulte Table",
              description:
                "Contact Schulte Table team for support, questions, or business inquiries.",
              url: "https://www.schultetable.com/support",
              mainEntity: {
                "@type": "Organization",
                name: "Schulte Table",
                url: "https://www.schultetable.com",
                contactPoint: {
                  "@type": "ContactPoint",
                  contactType: "customer support",
                  availableLanguage: ["English"],
                },
              },
            }),
          }}
        />
      </Head>

      <Navbar />

      <ContactForm />
    </>
  );
}
