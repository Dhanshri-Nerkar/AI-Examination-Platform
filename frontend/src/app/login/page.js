"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { loginUser } from "../../../lib/api";
import "./login.css";

export default function LoginPage() {
  const router = useRouter();

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
        error.message || "Invalid email or password"
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
            <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="loginLogoGrad" x1="0" y1="0" x2="40" y2="40">
                  <stop offset="0%" stopColor="#2563eb" />
                  <stop offset="100%" stopColor="#60a5fa" />
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
            Smart & Simple Examination Platform
          </div>

          <h1>
            Welcome
            <br />
            <span>back.</span>
          </h1>

          <p className="login-description">
            Sign in to continue your examination journey
            and access everything you need in one place.
          </p>


          {/* Benefits */}
          <div className="login-benefits">

            <div className="login-benefit">
              <div className="login-benefit-icon">✓</div>
              <div>
                <strong>Safe & Secure</strong>
                <span>Your account information is kept safe and private.</span>
              </div>
            </div>

            <div className="login-benefit">
              <div className="login-benefit-icon">✓</div>
              <div>
                <strong>Everything in One Place</strong>
                <span>Access your examinations, results and activities easily.</span>
              </div>
            </div>

            <div className="login-benefit">
              <div className="login-benefit-icon">✓</div>
              <div>
                <strong>Easy to Use</strong>
                <span>A simple experience designed for everyone.</span>
              </div>
            </div>

          </div>

        </div>

      </section>


      {/* RIGHT SIDE */}
      <section className="login-form-section">

        <div className="login-card">

          <div className="login-header">
            <h2>Welcome back</h2>
            <p>Sign in to continue to your account.</p>
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
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                required
                disabled={loading}
                autoComplete="email"
              />
            </div>


            <div className="login-form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                required
                disabled={loading}
                autoComplete="current-password"
              />
            </div>


            <div className="remember-row">
              <label className="remember-label">
                <input type="checkbox" disabled={loading} />
                <span>Remember me</span>
              </label>
            </div>


            <button
              type="submit"
              disabled={loading}
              className="login-submit"
            >
              {loading ? "Logging in..." : "Sign In"}
            </button>

          </form>


          <div className="register-text">
            <span>Don't have an account?</span>
            <Link href="/register">Create an account</Link>
          </div>


          <Link href="/" className="back-home">
            ← Back to home
          </Link>

        </div>

      </section>

    </main>
  );
}