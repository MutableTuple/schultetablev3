import { Chakra_Petch } from "next/font/google";
import "./globals.css";
import Script from "next/script";

import { Toaster } from "react-hot-toast";
import { GoogleAnalytics } from "@next/third-parties/google";
import { getCurrentUser } from "./_utils/getCurrentUser";

const chakraPetch = Chakra_Petch({
  variable: "--font-chakra-petch",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata = {
  title: "Play Schulte Table Online – Improve Focus & Track Your Progress",
  description:
    "Train your brain with Schulte Tables - a scientifically proven method to enhance peripheral vision, reading speed, and concentration. Free online tool for visual perception training and cognitive development with progress tracking.",
  keywords: [
    "schulte table",
    "舒尔特方格",
    "schulte",
    "brain training",
    "speed reading",
    "cognitive training",
    "focus improvement",
    "concentration exercises",
    "peripheral vision",
    "mental training",
    "attention training",
    "eye movement training",
    "schulte table game",
    "schulte table colour",
    "schulte-table",
    "tablica schulte",
    "schulte tables",
    "brain game schulte table",
    "schulte table brain game",
    "table schulte",
    "shulte table",
    "schultetable",
    "schulte game",
    "tabla de schulte",
    "schule table",
    "schutle table",
    "the schulte table",
    "schulte table brain exercise",
    "schulte grid",
    "schult table",
    "shuttle table brain game",
    "schulte table games",
    "shult table",
    "tablas schulte",
    "tabelul lui schulte",
    "mesa de schulte",
    "tablas de schulte",
    "schultz tables",
    "brain exercise schulte table",
  ],
  authors: [{ name: "SchulteTable.com" }],
  creator: "SchulteTable.com",
  publisher: "SchulteTable.com",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://schultetable.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Schulte Table - Improve Reading Speed & Focus Training",
    description:
      "Train your brain with Schulte Tables - a scientifically proven method to enhance peripheral vision, reading speed, and concentration. Free online tool for visual perception training.",
    url: "https://schultetable.com",
    siteName: "Play Schulte Table Online",
    locale: "en_US",
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
    title: "Schulte Table - Speed Reading & Focus Training",
    description:
      "Improve your reading speed and concentration with scientifically proven Schulte Table exercises. Free brain training tool.",
    images: ["/twitter-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "Educational & brain training Tool",
};

export default async function RootLayout({ children }) {
  const { user, error } = await getCurrentUser();
  const isProUser = user?.[0]?.is_pro_user === true;
  return (
    <html lang="en" data-theme="dark">
      <head>
        <GoogleAnalytics gaId="G-66EJ7VMS98" />
        {!isProUser && (
          <script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5879583930762494"
            crossOrigin="anonymous"
          />
        )}
        <script
          src="https://analytics.ahrefs.com/analytics.js"
          data-key="l3eoqMcNEaSCINftYENKIw"
          async
        ></script>
        <style
          id="hide-until-theme"
          dangerouslySetInnerHTML={{
            __html: `
              html:not([data-theme]) body {
                display: none;
              }
            `,
          }}
        />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/icons/icon-192.png" />
        <Script
          id="set-theme"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme') || 'light';
                  document.documentElement.setAttribute('data-theme', theme);
                  document.body.style.display = '';
                } catch (e) {
                  document.body.style.display = '';
                }
              })();
            `,
          }}
        />
      </head>
      <body className={`${chakraPetch.className} antialiased`}>
        <Toaster position="bottom-right" />
        {children}
      </body>
    </html>
  );
}
