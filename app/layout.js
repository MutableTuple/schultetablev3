import { Chakra_Petch } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import GlobalGameListener from "./_components/GlobalGameListener";
import { Toaster } from "react-hot-toast";
import { GoogleAnalytics } from "@next/third-parties/google";

const chakraPetch = Chakra_Petch({
  variable: "--font-chakra-petch",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata = {
  title: {
    default: "SchulteTable.com | Best schultetable on the Internet",
    template: "%s | SchulteTable",
  },
  description: "Train your brain with Schulte Table exercises",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="">
      <head>
        <GoogleAnalytics gaId="G-66EJ7VMS98" />
        {/* <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5879583930762494"
          crossOrigin="anonymous"
        /> */}
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
