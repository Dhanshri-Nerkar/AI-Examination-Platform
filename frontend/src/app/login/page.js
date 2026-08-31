"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { loginUser } from "../../../lib/api";


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
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >

      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          padding: "30px",
          border: "1px solid #ddd",
          borderRadius: "10px",
        }}
      >

        <h1
          style={{
            textAlign: "center",
            marginBottom: "25px",
          }}
        >
          Login
        </h1>


        <form onSubmit={handleSubmit}>

          {/* Email */}
          <div style={{ marginBottom: "20px" }}>

            <label htmlFor="email">
              Email
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="Enter your email"
              required
              style={{
                width: "100%",
                padding: "12px",
                marginTop: "6px",
                boxSizing: "border-box",
              }}
            />

          </div>


          {/* Password */}
          <div style={{ marginBottom: "20px" }}>

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
              style={{
                width: "100%",
                padding: "12px",
                marginTop: "6px",
                boxSizing: "border-box",
              }}
            />

          </div>


          {/* Error */}
          {error && (
            <p
              style={{
                color: "red",
                marginBottom: "15px",
              }}
            >
              {error}
            </p>
          )}


          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              cursor: loading
                ? "not-allowed"
                : "pointer",
            }}
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>

        </form>


        {/* Register Link */}
        <p
          style={{
            textAlign: "center",
            marginTop: "20px",
          }}
        >
          Don't have an account?{" "}

          <a href="/register">
            Register
          </a>

        </p>

      </div>

    </main>
  );
}