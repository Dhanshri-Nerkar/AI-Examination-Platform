"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";

import LanguageSwitcher from "./LanguageSwitcher";

export default function MarketingNav() {
  const { t } = useTranslation();

  return (
    <nav className="navbar">
      <div className="navbar-container">

        {/* LOGO */}
        <Link href="/" className="logo">
          <div className="logo-mark">
            <svg
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient
                  id="logoGradNavbar"
                  x1="0"
                  y1="0"
                  x2="40"
                  y2="40"
                >
                  <stop
                    offset="0%"
                    stopColor="#2563eb"
                  />
                  <stop
                    offset="100%"
                    stopColor="#60a5fa"
                  />
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

          <span className="logo-text">
            AI Examination
          </span>
        </Link>

        {/* NAVIGATION */}
        <div className="nav-links">

          {/* LANGUAGE */}
          <div className="navbar-language">
            <LanguageSwitcher />
          </div>

          {/* FEATURES */}
          <a href="/#features">
            {t("nav.features")}
          </a>

          {/* ABOUT */}
          <a href="/#about">
            {t("nav.about")}
          </a>

          {/* LOGIN */}
          <Link
            href="/login"
            className="login-link"
          >
            {t("nav.login")}
          </Link>

          {/* REGISTER */}
          <Link
            href="/register"
            className="register-button"
          >
            {t("nav.register")}
          </Link>

        </div>
      </div>
    </nav>
  );
}