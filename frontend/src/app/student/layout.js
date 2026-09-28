"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import "./layout.css";

export default function StudentLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const [studentName, setStudentName] = useState("Student");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const role = localStorage.getItem("role");

    if (!token || role !== "student") {
      router.replace("/login");
      return;
    }

    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        if (user?.name) setStudentName(user.name);
      } catch (error) {
        console.error("Unable to read stored user.", error);
      }
    }
  }, [router]);

  // Close mobile menu when route changes
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    router.replace("/login");
  };

  // Scroll to a section on the dashboard
  const scrollToSection = (id) => {
    if (pathname !== "/student") {
      router.push("/student");
      // Allow navigation to complete before scrolling
      setTimeout(() => {
        document
          .getElementById(id)
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 200);
      return;
    }

    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });

    setMenuOpen(false);
  };

  // Scroll to top (Dashboard)
  const goToDashboard = () => {
    if (pathname !== "/student") {
      router.push("/student");
      return;
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <div className="student-shell">

      {/* ============================================
          TOP NAVBAR
      ============================================ */}

      <header className="student-topbar">

        <div className="student-topbar-inner">

          {/* BRAND */}
          <div
            className="student-topbar-brand"
            onClick={goToDashboard}
          >
            <div className="student-topbar-logo">
              <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="studentTopbarGrad" x1="0" y1="0" x2="40" y2="40">
                    <stop offset="0%" stopColor="#2563eb" />
                    <stop offset="100%" stopColor="#60a5fa" />
                  </linearGradient>
                </defs>
                <path
                  d="M20 2 L35 10 L35 24 C35 31 28 36 20 38 C12 36 5 31 5 24 L5 10 Z"
                  fill="url(#studentTopbarGrad)"
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

            <div className="student-topbar-brand-text">
              <strong>AI Examination</strong>
              <span>Student</span>
            </div>
          </div>


          {/* DESKTOP NAV */}
          <nav className="student-topbar-nav">

            <button
              className="student-topbar-link"
              onClick={goToDashboard}
            >
              <span className="student-topbar-icon">◉</span>
              Dashboard
            </button>

            <button
              className="student-topbar-link"
              onClick={() => scrollToSection("available")}
            >
              <span className="student-topbar-icon">📝</span>
              Available Examinations
            </button>

            <button
              className="student-topbar-link"
              onClick={() => scrollToSection("completed")}
            >
              <span className="student-topbar-icon">✅</span>
              Completed Examinations
            </button>

          </nav>


          {/* RIGHT — user + logout */}
          <div className="student-topbar-user">

            <div className="student-topbar-avatar">
              {studentName?.charAt(0)?.toUpperCase() || "S"}
            </div>

            <div className="student-topbar-user-info">
              <strong>{studentName}</strong>
              <span>Student</span>
            </div>

            <button
              className="student-topbar-logout"
              onClick={handleLogout}
            >
              ↪ Logout
            </button>

          </div>


          {/* MOBILE HAMBURGER */}
          <button
            className="student-topbar-hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? "✕" : "☰"}
          </button>

        </div>


        {/* MOBILE MENU DRAWER */}
        {menuOpen && (
          <div className="student-mobile-menu">

            <nav className="student-mobile-links">

              <button
                className="student-mobile-link"
                onClick={goToDashboard}
              >
                <span>◉</span>
                Dashboard
              </button>

              <button
                className="student-mobile-link"
                onClick={() => scrollToSection("available")}
              >
                <span>📝</span>
                Available Examinations
              </button>

              <button
                className="student-mobile-link"
                onClick={() => scrollToSection("completed")}
              >
                <span>✅</span>
                Completed Examinations
              </button>

            </nav>

            <div className="student-mobile-user">
              <div className="student-topbar-avatar">
                {studentName?.charAt(0)?.toUpperCase() || "S"}
              </div>
              <div className="student-topbar-user-info">
                <strong>{studentName}</strong>
                <span>Student</span>
              </div>
            </div>

            <button
              className="student-mobile-logout"
              onClick={handleLogout}
            >
              ↪ Logout
            </button>

          </div>
        )}

      </header>


      {/* ============================================
          MAIN CONTENT
      ============================================ */}

      <main className="student-shell-main">
        {children}
      </main>

    </div>
  );
}