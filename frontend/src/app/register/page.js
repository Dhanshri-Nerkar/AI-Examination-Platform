"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "./register.css";

export default function RegisterPage() {
  const router = useRouter();

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
      setError("Please enter your full name.");
      return;
    }

    // Email validation
    if (!form.email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    // Password validation
    if (form.password.length < 6) {
      setError("Your password must contain at least 6 characters.");
      return;
    }

    // Confirm password
    if (form.password !== form.confirmPassword) {
      setError("The passwords you entered do not match.");
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
            "We could not create your account. Please try again."
        );
      }

      // Examiner registration
      if (form.role === "examiner") {
        setSuccess(
          "Your request has been submitted successfully. An administrator will review your request."
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
        "Your account has been created successfully! Taking you to the login page..."
      );

      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (err) {
      setError(
        err.message ||
          "Unable to create your account. Please check your connection and try again."
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
          <div className="brand-icon">AI</div>
          <span>AI Examination</span>
        </Link>

        <div className="register-info-content">

          <div className="info-badge">
            Smart & Simple Examination Platform
          </div>

          <h1>
            Start your
            <br />
            <span>examination journey.</span>
          </h1>

          <p>
            Create your account and enjoy a simple, secure and
            convenient examination experience.
          </p>

          <div className="register-benefits">

            <div className="register-benefit">
              <div className="register-benefit-icon">
                ✓
              </div>

              <div>
                <strong>Safe & Secure</strong>
                <span>
                  Your account and personal information are kept secure.
                </span>
              </div>
            </div>

            <div className="register-benefit">
              <div className="register-benefit-icon">
                ✓
              </div>

              <div>
                <strong>Simple Examination</strong>
                <span>
                  Take your examinations easily from one convenient platform.
                </span>
              </div>
            </div>

            <div className="register-benefit">
              <div className="register-benefit-icon">
                ✓
              </div>

              <div>
                <strong>Track Your Progress</strong>
                <span>
                  View your results and keep track of your examination
                  performance.
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
              <div className="brand-icon">
                AI
              </div>

              <span>AI Examination</span>
            </Link>
          </div>


          {/* Header */}
          <div className="form-header">
            <h2>Create your account</h2>

            <p>
              Join the platform and get started today.
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
                Full Name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your full name"
                value={form.name}
                onChange={handleChange}
                disabled={loading}
                autoComplete="name"
              />
            </div>


            {/* Email */}
            <div className="form-group">
              <label htmlFor="email">
                Email Address
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
                I want to register as
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
                    <strong>Student</strong>

                    <small>
                      Take examinations
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
                    <strong>Examiner</strong>

                    <small>
                      Create and manage examinations
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
                    <strong>Administrator approval required</strong>

                    <p>
                      Your registration request will be reviewed by
                      an administrator before you can access the
                      examiner account.
                    </p>
                  </div>

                </div>
              )}

            </div>


            {/* Password */}
            <div className="form-group">

              <label htmlFor="password">
                Password
              </label>

              <input
                id="password"
                name="password"
                type="password"
                placeholder="Create a password"
                value={form.password}
                onChange={handleChange}
                disabled={loading}
                autoComplete="new-password"
              />

              <div className="password-hint">
                Use at least 6 characters.
              </div>

            </div>


            {/* Confirm Password */}
            <div className="form-group">

              <label htmlFor="confirmPassword">
                Confirm Password
              </label>

              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Enter your password again"
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
                ? "Creating your account..."
                : form.role === "examiner"
                ? "Submit Request"
                : "Create Account"}
            </button>

          </form>


          {/* Login */}
          <div className="login-text">
            Already have an account?

            <Link href="/login">
              Sign in
            </Link>
          </div>


          {/* Back Home */}
          <Link href="/" className="back-home">
            ← Back to home
          </Link>

        </div>

      </section>

    </main>
  );
}