"use client";

import "./globals.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Space_Grotesk, Inter } from "next/font/google";

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

  // Hide the marketing navbar on admin pages
  const isAdmin = pathname?.startsWith("/admin");

  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className={`${spaceGrotesk.variable} ${inter.variable}`}>

        {/* ==================================================
            MARKETING NAVBAR (hidden on /admin/*)
        ================================================== */}

        {!isAdmin && (
          <nav className="navbar">
            <div className="navbar-container">

              <Link href="/" className="logo">
                <div className="logo-mark">
                  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="logoGradNavbar" x1="0" y1="0" x2="40" y2="40">
                        <stop offset="0%" stopColor="#2563eb" />
                        <stop offset="100%" stopColor="#60a5fa" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M20 2 L35 10 L35 24 C35 31 28 36 20 38 C12 36 5 31 5 24 L5 10 Z"
                      fill="url(#logoGradNavbar)"
                    />
                    <text
                      x="20"
                      y="25"
                      textAnchor="middle"
                      fontSize="13"
                      fontWeight="800"
                      fill="white"
                      fontFamily="system-ui, sans-serif"
                      letterSpacing="0.5"
                    >
                      AI
                    </text>
                  </svg>
                </div>
                <span className="logo-text">AI Examination</span>
              </Link>

              <div className="nav-links">
                <a href="/#features">Features</a>
                <a href="/#about">About</a>
                <Link href="/login" className="login-link">Login</Link>
                <Link href="/register" className="register-button">Register</Link>
              </div>

            </div>
          </nav>
        )}

        {children}

        {/* ==================================================
            FOOTER (always shown)
        ================================================== */}

        <footer className="footer">
          <div className="footer-container">

            <div className="footer-logo">
              <div className="logo-mark">
                <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="logoGradFooter" x1="0" y1="0" x2="40" y2="40">
                      <stop offset="0%" stopColor="#2563eb" />
                      <stop offset="100%" stopColor="#60a5fa" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M20 2 L35 10 L35 24 C35 31 28 36 20 38 C12 36 5 31 5 24 L5 10 Z"
                    fill="url(#logoGradFooter)"
                  />
                  <text
                    x="20"
                    y="25"
                    textAnchor="middle"
                    fontSize="13"
                    fontWeight="800"
                    fill="white"
                    fontFamily="system-ui, sans-serif"
                    letterSpacing="0.5"
                  >
                    AI
                  </text>
                </svg>
              </div>
              <span>AI Examination Platform</span>
            </div>

            <p>© 2026 AI Examination Platform</p>

          </div>
        </footer>

      </body>
    </html>
  );
}