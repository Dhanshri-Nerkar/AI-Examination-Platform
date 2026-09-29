"use client";

import { useTranslation } from "react-i18next";

export default function MarketingFooter() {
  const { t } = useTranslation();

  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-logo">

          <div className="logo-mark">
            <svg
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient
                  id="logoGradFooter"
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

          <span>
            {t("footer.platform")}
          </span>

        </div>

        <p>
          {t("footer.copyright")}
        </p>

      </div>
    </footer>
  );
}