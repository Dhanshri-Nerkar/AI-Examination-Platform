"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

import "./register.css";

export default function RegisterPage() {
  const router = useRouter();
  const { t } = useTranslation();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // Name validation
    if (!form.name.trim()) {
      setError(t("register.name_required"));
      return;
    }

    // Email validation
    if (!form.email.trim()) {
      setError(t("register.email_required"));
      return;
    }

    // Password validation
    if (form.password.length < 6) {
      setError(t("register.password_length"));
      return;
    }

    // Confirm password
    if (form.password !== form.confirmPassword) {
      setError(t("register.password_mismatch"));
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            password: form.password,
            role: form.role,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
            t("register.create_account_error")
        );
      }

      // Examiner registration
      if (form.role === "examiner") {
        setSuccess(
          t("register.examiner_success")
        );

        setForm({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
          role: "examiner",
        });

        return;
      }

      // Student registration
      setSuccess(
        t("register.student_success")
      );

      setTimeout(() => {
        router.push("/login");
      }, 1500);

    } catch (err) {
      setError(
        err.message ||
          t("register.connection_error")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="register-page">

      {/* LEFT SIDE */}
      <section className="register-info">

        {/* Brand */}
        <Link href="/" className="brand">

          <div className="brand-mark">
            <svg
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient
                  id="registerLogoGrad"
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
                fill="url(#registerLogoGrad)"
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


        <div className="register-info-content">

          <div className="info-badge">
            <span className="badge-dot" />
            {t("register.smart_simple")}
          </div>

          <h1>
            {t("register.start_your")}
            <br />
            <span>
              {t("register.examination_journey")}
            </span>
          </h1>

          <p className="register-description">
            {t("register.description")}
          </p>


          <div className="register-benefits">

            <div className="register-benefit">
              <div className="register-benefit-icon">
                ✓
              </div>

              <div>
                <strong>
                  {t("register.safe_secure")}
                </strong>

                <span>
                  {t(
                    "register.safe_secure_description"
                  )}
                </span>
              </div>
            </div>


            <div className="register-benefit">
              <div className="register-benefit-icon">
                ✓
              </div>

              <div>
                <strong>
                  {t("register.simple_examination")}
                </strong>

                <span>
                  {t(
                    "register.simple_examination_description"
                  )}
                </span>
              </div>
            </div>


            <div className="register-benefit">
              <div className="register-benefit-icon">
                ✓
              </div>

              <div>
                <strong>
                  {t("register.track_progress")}
                </strong>

                <span>
                  {t(
                    "register.track_progress_description"
                  )}
                </span>
              </div>
            </div>

          </div>

        </div>
      </section>


      {/* RIGHT SIDE */}
      <section className="register-form-section">

        <div className="register-card">

          {/* Mobile Brand */}
          <div className="mobile-brand">

            <Link href="/" className="brand">

              <div className="brand-mark">
                <svg
                  viewBox="0 0 40 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient
                      id="registerLogoGradMobile"
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
                    fill="url(#registerLogoGradMobile)"
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

          </div>


          {/* Header */}
          <div className="form-header">
            <h2>
              {t("register.create_account")}
            </h2>

            <p>
              {t("register.join_platform")}
            </p>
          </div>


          {/* Error */}
          {error && (
            <div className="message error-message">
              <span>!</span>
              {error}
            </div>
          )}


          {/* Success */}
          {success && (
            <div className="message success-message">
              <span>✓</span>
              {success}
            </div>
          )}


          {/* FORM */}
          <form onSubmit={handleSubmit}>

            {/* Full Name */}
            <div className="form-group">

              <label htmlFor="name">
                {t("register.full_name")}
              </label>

              <input
                id="name"
                name="name"
                type="text"
                placeholder={t(
                  "register.full_name_placeholder"
                )}
                value={form.name}
                onChange={handleChange}
                disabled={loading}
                autoComplete="name"
              />

            </div>


            {/* Email */}
            <div className="form-group">

              <label htmlFor="email">
                {t("register.email")}
              </label>

              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                disabled={loading}
                autoComplete="email"
              />

            </div>


            {/* Account Type */}
            <div className="form-group">

              <label>
                {t("register.register_as")}
              </label>

              <div className="role-options">

                {/* Student */}
                <button
                  type="button"
                  className={
                    form.role === "student"
                      ? "role-option selected"
                      : "role-option"
                  }
                  onClick={() => {
                    setForm({
                      ...form,
                      role: "student",
                    });

                    setError("");
                    setSuccess("");
                  }}
                  disabled={loading}
                >

                  <span className="role-icon">
                    🎓
                  </span>

                  <span className="role-content">

                    <strong>
                      {t("register.student")}
                    </strong>

                    <small>
                      {t(
                        "register.student_description"
                      )}
                    </small>

                  </span>

                  {form.role === "student" && (
                    <span className="check">
                      ✓
                    </span>
                  )}

                </button>


                {/* Examiner */}
                <button
                  type="button"
                  className={
                    form.role === "examiner"
                      ? "role-option selected"
                      : "role-option"
                  }
                  onClick={() => {
                    setForm({
                      ...form,
                      role: "examiner",
                    });

                    setError("");
                    setSuccess("");
                  }}
                  disabled={loading}
                >

                  <span className="role-icon">
                    🧑‍🏫
                  </span>

                  <span className="role-content">

                    <strong>
                      {t("register.examiner")}
                    </strong>

                    <small>
                      {t(
                        "register.examiner_description"
                      )}
                    </small>

                  </span>

                  {form.role === "examiner" && (
                    <span className="check">
                      ✓
                    </span>
                  )}

                </button>

              </div>


              {/* Examiner Approval */}
              {form.role === "examiner" && (
                <div className="approval-note">

                  <div className="approval-icon">
                    !
                  </div>

                  <div>

                    <strong>
                      {t(
                        "register.admin_approval"
                      )}
                    </strong>

                    <p>
                      {t(
                        "register.admin_approval_description"
                      )}
                    </p>

                  </div>

                </div>
              )}

            </div>


            {/* Password */}
            <div className="form-group">

              <label htmlFor="password">
                {t("register.password")}
              </label>

              <input
                id="password"
                name="password"
                type="password"
                placeholder={t(
                  "register.password_placeholder"
                )}
                value={form.password}
                onChange={handleChange}
                disabled={loading}
                autoComplete="new-password"
              />

              <div className="password-hint">
                {t("register.password_hint")}
              </div>

            </div>


            {/* Confirm Password */}
            <div className="form-group">

              <label htmlFor="confirmPassword">
                {t("register.confirm_password")}
              </label>

              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder={t(
                  "register.confirm_password_placeholder"
                )}
                value={form.confirmPassword}
                onChange={handleChange}
                disabled={loading}
                autoComplete="new-password"
              />

            </div>


            {/* Submit */}
            <button
              type="submit"
              className="register-submit"
              disabled={loading}
            >
              {loading
                ? t("register.creating_account")
                : form.role === "examiner"
                ? t("register.submit_request")
                : t("register.create_account_button")}
            </button>

          </form>


          {/* Login */}
          <div className="login-text">

            {t("register.already_account")}

            <Link href="/login">
              {t("register.sign_in")}
            </Link>

          </div>


          {/* Back Home */}
          <Link
            href="/"
            className="back-home"
          >
            ← {t("register.back_home")}
          </Link>

        </div>

      </section>

    </main>
  );
}