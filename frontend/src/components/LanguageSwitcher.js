"use client";

import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import "./LanguageSwitcher.css";

export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation();

  const currentLanguage =
    i18n.resolvedLanguage ||
    i18n.language ||
    "en";

  useEffect(() => {
    const savedLanguage = localStorage.getItem("selectedLanguage");

    if (
      savedLanguage &&
      savedLanguage !== i18n.resolvedLanguage
    ) {
      i18n.changeLanguage(savedLanguage);
    }
  }, [i18n]);

  function handleLanguageChange(event) {
    const selectedLanguage = event.target.value;

    // Change language globally
    i18n.changeLanguage(selectedLanguage);

    // Explicitly save the selected language
    localStorage.setItem(
      "selectedLanguage",
      selectedLanguage
    );
  }

  return (
    <div className="language-switcher">
      <label htmlFor="language-select">
        🌐 {t("language")}
      </label>

      <select
        id="language-select"
        value={currentLanguage}
        onChange={handleLanguageChange}
      >
        <option value="en">English</option>
        <option value="hi">हिन्दी</option>
        <option value="mr">मराठी</option>
        <option value="ta">தமிழ்</option>
        <option value="ml">മലയാളം</option>
        <option value="kn">ಕನ್ನಡ</option>
        <option value="te">తెలుగు</option>
      </select>
    </div>
  );
}