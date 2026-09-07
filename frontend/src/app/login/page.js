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

          <div className="brand-icon">
            AI
          </div>

          <span>
            AI Examination
          </span>

        </Link>


        {/* Left Content */}

        <div className="login-info-content">

          <div className="info-badge">
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

              <div className="login-benefit-icon">
                ✓
              </div>

              <div>
                <strong>
                  Safe & Secure
                </strong>

                <span>
                  Your account information is kept safe and private.
                </span>
              </div>

            </div>


            <div className="login-benefit">

              <div className="login-benefit-icon">
                ✓
              </div>

              <div>
                <strong>
                  Everything in One Place
                </strong>

                <span>
                  Access your examinations, results and activities easily.
                </span>
              </div>

            </div>


            <div className="login-benefit">

              <div className="login-benefit-icon">
                ✓
              </div>

              <div>
                <strong>
                  Easy to Use
                </strong>

                <span>
                  A simple experience designed for everyone.
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
              Welcome back
            </h2>

            <p>
              Sign in to continue to your account.
            </p>

          </div>


          {/* Error */}

          {error && (
            <div className="login-error">

              <span className="error-icon">
                !
              </span>

              <span>
                {error}
              </span>

            </div>
          )}


          {/* Form */}

          <form onSubmit={handleSubmit}>

            {/* Email */}

            <div className="login-form-group">

              <label htmlFor="email">
                Email Address
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


            {/* Password */}

            <div className="login-form-group">

              <label htmlFor="password">
                Password
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="Enter your password"
                required
                disabled={loading}
                autoComplete="current-password"
              />

            </div>


            {/* Remember */}

            <div className="remember-row">

              <label className="remember-label">

                <input
                  type="checkbox"
                  disabled={loading}
                />

                <span>
                  Remember me
                </span>

              </label>

            </div>


            {/* Login Button */}

            <button
              type="submit"
              disabled={loading}
              className="login-submit"
            >

              {loading
                ? "Logging in..."
                : "Sign In"}

            </button>

          </form>


          {/* Register */}

          <div className="register-text">

            <span>
              Don't have an account?
            </span>

            <Link href="/register">
              Create an account
            </Link>

          </div>


          {/* Home */}

          <Link
            href="/"
            className="back-home"
          >
            ← Back to home
          </Link>

        </div>

      </section>

    </main>
  );
}