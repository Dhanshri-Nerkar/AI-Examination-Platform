"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

import { loginUser } from "../../../lib/api";
import "./login.css";

export default function LoginPage() {
  const router = useRouter();
  const { t } = useTranslation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const result = await loginUser({
        email,
        password,
      });

      console.log("Login successful:", result);

      // Store JWT token
      localStorage.setItem(
        "access_token",
        result.access_token
      );

      // Store user role
      localStorage.setItem(
        "role",
        result.role
      );

      // Redirect based on role
      if (result.role === "student") {
        router.push("/student");
      } else if (result.role === "examiner") {
        router.push("/examiner");
      } else if (result.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/");
      }

    } catch (error) {
      setError(
        error.message || t("login.invalid_credentials")
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page">

      {/* LEFT SIDE */}
      <section className="login-info">

        {/* Logo */}
        <Link href="/" className="brand">

          <div className="brand-mark">
            <svg
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient
                  id="loginLogoGrad"
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
                fill="url(#loginLogoGrad)"
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

          <span>AI Examination</span>

        </Link>


        {/* Left Content */}
        <div className="login-info-content">

          <div className="info-badge">
            <span className="badge-dot" />
            {t("login.smart_simple")}
          </div>

          <h1>
            {t("login.welcome")}
            <br />
            <span>{t("login.back")}</span>
          </h1>

          <p className="login-description">
            {t("login.description")}
          </p>


          {/* Benefits */}
          <div className="login-benefits">

            <div className="login-benefit">
              <div className="login-benefit-icon">
                ✓
              </div>

              <div>
                <strong>
                  {t("login.safe_secure")}
                </strong>

                <span>
                  {t("login.safe_secure_description")}
                </span>
              </div>
            </div>


            <div className="login-benefit">
              <div className="login-benefit-icon">
                ✓
              </div>

              <div>
                <strong>
                  {t("login.everything_one_place")}
                </strong>

                <span>
                  {t("login.everything_one_place_description")}
                </span>
              </div>
            </div>


            <div className="login-benefit">
              <div className="login-benefit-icon">
                ✓
              </div>

              <div>
                <strong>
                  {t("login.easy_to_use")}
                </strong>

                <span>
                  {t("login.easy_to_use_description")}
                </span>
              </div>
            </div>

          </div>

        </div>

      </section>


      {/* RIGHT SIDE */}
      <section className="login-form-section">

        <div className="login-card">

          <div className="login-header">
            <h2>
              {t("login.welcome_back")}
            </h2>

            <p>
              {t("login.sign_in_description")}
            </p>
          </div>


          {/* Error */}
          {error && (
            <div className="login-error">
              <span className="error-icon">!</span>
              <span>{error}</span>
            </div>
          )}


          {/* Form */}
          <form onSubmit={handleSubmit}>

            <div className="login-form-group">
              <label htmlFor="email">
                {t("login.email")}
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="you@example.com"
                required
                disabled={loading}
                autoComplete="email"
              />
            </div>


            <div className="login-form-group">
              <label htmlFor="password">
                {t("login.password")}
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder={t(
                  "login.password_placeholder"
                )}
                required
                disabled={loading}
                autoComplete="current-password"
              />
            </div>


            <div className="remember-row">
              <label className="remember-label">
                <input
                  type="checkbox"
                  disabled={loading}
                />

                <span>
                  {t("login.remember_me")}
                </span>
              </label>
            </div>


            <button
              type="submit"
              disabled={loading}
              className="login-submit"
            >
              {loading
                ? t("login.logging_in")
                : t("login.sign_in")}
            </button>

          </form>


          <div className="register-text">
            <span>
              {t("login.no_account")}
            </span>

            <Link href="/register">
              {t("login.create_account")}
            </Link>
          </div>


          <Link
            href="/"
            className="back-home"
          >
            ← {t("login.back_home")}
          </Link>

        </div>

      </section>

    </main>
  );
}