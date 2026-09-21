"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import "./layout.css";

const API_URL = "http://127.0.0.1:8000";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const [adminName, setAdminName] = useState("Administrator");

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const role = localStorage.getItem("role");

    if (!token || role !== "admin") {
      router.replace("/login");
      return;
    }

    // Try to get admin information from localStorage
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);

        if (user?.name) {
          setAdminName(user.name);
        }
      } catch (error) {
        console.error(
          "Unable to read stored user.",
          error
        );
      }
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");

    router.replace("/login");
  };

  const isActive = (path) => {
    if (path === "/admin") {
      return pathname === "/admin";
    }

    return (
      pathname === path ||
      pathname.startsWith(`${path}/`)
    );
  };

  return (
    <div className="admin-layout">

      {/* ================================================== */}
      {/* SIDEBAR */}
      {/* ================================================== */}

      <aside className="admin-sidebar">

        {/* BRAND */}

        <div className="admin-brand">
          <div className="admin-brand-icon">
            AI
          </div>

          <div>
            <h2>AI Examination</h2>
            <span>Administration</span>
          </div>
        </div>

        {/* NAVIGATION */}

        <nav className="admin-navigation">

          <p className="admin-nav-label">
            MAIN MENU
          </p>

          <button
            className={`admin-nav-item ${
              isActive("/admin")
                ? "admin-nav-active"
                : ""
            }`}
            onClick={() =>
              router.push("/admin")
            }
          >
            <span className="admin-nav-icon">
              ◉
            </span>

            <span>Dashboard</span>
          </button>

          <button
            className={`admin-nav-item ${
              isActive("/admin/users")
                ? "admin-nav-active"
                : ""
            }`}
            onClick={() =>
              router.push("/admin/users")
            }
          >
            <span className="admin-nav-icon">
              👥
            </span>

            <span>Users</span>
          </button>

          <button
            className={`admin-nav-item ${
              isActive("/admin/exams")
                ? "admin-nav-active"
                : ""
            }`}
            onClick={() =>
              router.push("/admin/exams")
            }
          >
            <span className="admin-nav-icon">
              📋
            </span>

            <span>Examinations</span>
          </button>

        </nav>

        {/* BOTTOM AREA */}

        <div className="admin-sidebar-bottom">

          <div className="admin-user-card">

            <div className="admin-user-avatar">
              {adminName
                ?.charAt(0)
                ?.toUpperCase() || "A"}
            </div>

            <div className="admin-user-info">
              <strong>
                {adminName}
              </strong>

              <span>
                Administrator
              </span>
            </div>

          </div>

          <button
            className="admin-logout-button"
            onClick={handleLogout}
          >
            <span>↪</span>
            Logout
          </button>

        </div>

      </aside>

      {/* ================================================== */}
      {/* MAIN CONTENT */}
      {/* ================================================== */}

      <div className="admin-main">

        {/* MOBILE TOP BAR */}

        <div className="admin-mobile-header">

          <div className="admin-mobile-brand">
            <div className="admin-brand-icon">
              AI
            </div>

            <div>
              <strong>
                AI Examination
              </strong>

              <span>
                Admin
              </span>
            </div>
          </div>

          <button
            className="admin-mobile-logout"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

        {children}

      </div>

    </div>
  );
}