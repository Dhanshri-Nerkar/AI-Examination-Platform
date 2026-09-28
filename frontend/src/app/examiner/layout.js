"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import "./layout.css";

export default function ExaminerLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const [examinerName, setExaminerName] = useState("Examiner");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const role = localStorage.getItem("role");

    if (!token || role !== "examiner") {
      router.replace("/login");
      return;
    }

    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        if (user?.name) setExaminerName(user.name);
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

  const isActive = (path) => {
    if (path === "/examiner") return pathname === "/examiner";
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  const navItems = [
    { label: "Dashboard", path: "/examiner", icon: "◉" },
    { label: "Create Exam", path: "/examiner/create-exam", icon: "📝" },
    { label: "Questions", path: "/examiner/questions", icon: "❓" },
    { label: "Examinations", path: "/examiner/exams", icon: "📚" },
  ];

  return (
    <div className="examiner-shell">

      {/* ============================================
          TOP NAVBAR
      ============================================ */}

      <header className="examiner-topbar">

        <div className="examiner-topbar-inner">

          {/* BRAND */}
          <div
            className="examiner-topbar-brand"
            onClick={() => router.push("/examiner")}
          >
            <div className="examiner-topbar-logo">
              <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="examinerTopbarGrad" x1="0" y1="0" x2="40" y2="40">
                    <stop offset="0%" stopColor="#2563eb" />
                    <stop offset="100%" stopColor="#60a5fa" />
                  </linearGradient>
                </defs>
                <path
                  d="M20 2 L35 10 L35 24 C35 31 28 36 20 38 C12 36 5 31 5 24 L5 10 Z"
                  fill="url(#examinerTopbarGrad)"
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

            <div className="examiner-topbar-brand-text">
              <strong>AI Examination</strong>
              <span>Examiner</span>
            </div>
          </div>


          {/* DESKTOP NAV LINKS */}
          <nav className="examiner-topbar-nav">
            {navItems.map((item) => (
              <button
                key={item.path}
                className={`examiner-topbar-link ${
                  isActive(item.path) ? "active" : ""
                }`}
                onClick={() => router.push(item.path)}
              >
                <span className="examiner-topbar-icon">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>


          {/* RIGHT — user + logout */}
          <div className="examiner-topbar-user">

            <div className="examiner-topbar-avatar">
              {examinerName?.charAt(0)?.toUpperCase() || "E"}
            </div>

            <div className="examiner-topbar-user-info">
              <strong>{examinerName}</strong>
              <span>Examiner</span>
            </div>

            <button
              className="examiner-topbar-logout"
              onClick={handleLogout}
            >
              ↪ Logout
            </button>

          </div>


          {/* MOBILE HAMBURGER */}
          <button
            className="examiner-topbar-hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? "✕" : "☰"}
          </button>

        </div>


        {/* MOBILE MENU DRAWER */}
        {menuOpen && (
          <div className="examiner-mobile-menu">

            <nav className="examiner-mobile-links">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  className={`examiner-mobile-link ${
                    isActive(item.path) ? "active" : ""
                  }`}
                  onClick={() => router.push(item.path)}
                >
                  <span>{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </nav>

            <div className="examiner-mobile-user">
              <div className="examiner-topbar-avatar">
                {examinerName?.charAt(0)?.toUpperCase() || "E"}
              </div>
              <div className="examiner-topbar-user-info">
                <strong>{examinerName}</strong>
                <span>Examiner</span>
              </div>
            </div>

            <button
              className="examiner-mobile-logout"
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

      <main className="examiner-shell-main">
        {children}
      </main>

    </div>
  );
}