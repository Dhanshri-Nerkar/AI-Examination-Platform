"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { registerUser } from "../../../lib/api";


export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);


  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const result = await registerUser({
        name,
        email,
        password,
        role,
      });

      console.log("Registration successful:", result);

      setSuccess(
        "Registration successful! Redirecting to login..."
      );

      setTimeout(() => {
        router.push("/login");
      }, 1500);

    } catch (error) {
      setError(
        error.message || "Registration failed"
      );

    } finally {
      setLoading(false);
    }
  }


  return (
    <main
      style={{
        maxWidth: "450px",
        margin: "80px auto",
        padding: "20px",
      }}
    >
      <h1>Register</h1>

      <form onSubmit={handleSubmit}>

        {/* Name */}
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="name">
            Name
          </label>

          <input
            id="name"
            type="text"
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
            placeholder="Enter your name"
            required
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "5px",
            }}
          />
        </div>


        {/* Email */}
        <div style={{ marginBottom: "15px" }}>
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
              padding: "10px",
              marginTop: "5px",
            }}
          />
        </div>


        {/* Password */}
        <div style={{ marginBottom: "15px" }}>
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
            minLength={8}
            required
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "5px",
            }}
          />
        </div>


        {/* Role */}
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="role">
            Role
          </label>

          <select
            id="role"
            value={role}
            onChange={(event) =>
              setRole(event.target.value)
            }
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "5px",
            }}
          >
            <option value="student">
              Student
            </option>

            <option value="examiner">
              Examiner
            </option>

            <option value="admin">
              Admin
            </option>
          </select>
        </div>


        {/* Error */}
        {error && (
          <p style={{ color: "red" }}>
            {error}
          </p>
        )}


        {/* Success */}
        {success && (
          <p style={{ color: "green" }}>
            {success}
          </p>
        )}


        {/* Submit */}
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
            ? "Creating account..."
            : "Register"}
        </button>

      </form>
    </main>
  );
}