"use client";

import "./globals.css";

import { usePathname } from "next/navigation";
import { Space_Grotesk, Inter } from "next/font/google";

import I18nProvider from "../components/I18nProvider";
import MarketingNav from "../components/MarketingNav";
import MarketingFooter from "../components/MarketingFooter";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export default function RootLayout({ children }) {
  const pathname = usePathname();

  // Hide marketing navbar/footer on application pages
  const isAppPage =
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/examiner") ||
    pathname?.startsWith("/student");

  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body
        className={`${spaceGrotesk.variable} ${inter.variable}`}
      >

        <I18nProvider>

          {/* MARKETING NAVBAR */}
          {!isAppPage && <MarketingNav />}

          {/* PAGE CONTENT */}
          {children}

          {/* MARKETING FOOTER */}
          {!isAppPage && <MarketingFooter />}

        </I18nProvider>

      </body>
    </html>
  );
}