"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import LanguageSwitcher from "../../components/LanguageSwitcher";

import "./layout.css";

const API_URL = "http://127.0.0.1:8000";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useTranslation();

  const [adminName, setAdminName] = useState("Administrator");
  const [menuOpen, setMenuOpen] = useState(false);

  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const role = localStorage.getItem("role");

    if (!token || role !== "admin") {
      router.replace("/login");
      return;
    }

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

    fetch(`${API_URL}/admin/examiners/pending`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    })
      .then((res) =>
        res.ok ? res.json() : []
      )
      .then((data) =>
        setPendingCount(
          Array.isArray(data)
            ? data.length
            : 0
        )
      )
      .catch(() =>
        setPendingCount(0)
      );
  }, [router]);

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
    if (path === "/admin") {
      return pathname === "/admin";
    }

    return (
      pathname === path ||
      pathname.startsWith(`${path}/`)
    );
  };

  const goToExaminerRequests = () => {
    if (pathname === "/admin") {
      document
        .getElementById("examiner-requests")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    } else {
      router.push(
        "/admin#examiner-requests"
      );
    }
  };

  const navItems = [
    {
      label: t("admin.nav.dashboard"),
      path: "/admin",
      icon: "◉",
      action: "push",
    },
    {
      label: t("admin.nav.users"),
      path: "/admin/users",
      icon: "👥",
      action: "push",
    },
    {
      label: t("admin.nav.examinations"),
      path: "/admin/exams",
      icon: "📋",
      action: "push",
    },
    {
      label: t("admin.nav.examiner_requests"),
      path: "/admin#examiner-requests",
      icon: "⏳",
      action: "scroll",
      badge: pendingCount,
    },
  ];

  const handleNavClick = (item) => {
    if (item.action === "scroll") {
      goToExaminerRequests();
    } else {
      router.push(item.path);
    }
  };

  return (
    <div className="admin-shell">

      <header className="admin-topbar">

        <div className="admin-topbar-inner">

          {/* BRAND */}
          <div
            className="admin-topbar-brand"
            onClick={() =>
              router.push("/admin")
            }
          >
            <div className="admin-topbar-logo">

              <svg
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient
                    id="adminTopbarGrad"
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
                  fill="url(#adminTopbarGrad)"
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

            <div className="admin-topbar-brand-text">
              <strong>
                AI Examination
              </strong>

              <span>
                {t("admin.role")}
              </span>
            </div>
          </div>


          {/* DESKTOP NAV LINKS */}
          <nav className="admin-topbar-nav">

            {navItems.map((item) => (
              <button
                key={item.label}
                className={`admin-topbar-link ${
                  isActive(
                    item.path.split("#")[0]
                  )
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  handleNavClick(item)
                }
              >
                <span className="admin-topbar-icon">
                  {item.icon}
                </span>

                {item.label}

                {item.badge > 0 && (
                  <span className="admin-topbar-badge">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}

          </nav>


          {/* RIGHT — user + logout */}
          <div className="admin-topbar-user">

            <div className="admin-language">
              <LanguageSwitcher />
            </div>

            <div className="admin-topbar-avatar">
              {adminName
                ?.charAt(0)
                ?.toUpperCase() || "A"}
            </div>

            <div className="admin-topbar-user-info">
              <strong>
                {adminName}
              </strong>

              <span>
                {t("admin.role")}
              </span>
            </div>

            <button
              className="admin-topbar-logout"
              onClick={handleLogout}
            >
              ↪ {t("admin.logout")}
            </button>

          </div>


          {/* MOBILE HAMBURGER */}
          <button
            className="admin-topbar-hamburger"
            onClick={() =>
              setMenuOpen(!menuOpen)
            }
            aria-label={t(
              "admin.toggle_menu"
            )}
          >
            {menuOpen ? "✕" : "☰"}
          </button>

        </div>


        {/* MOBILE MENU DRAWER */}
        {menuOpen && (
          <div className="admin-mobile-menu">

            <nav className="admin-mobile-links">

              {navItems.map((item) => (
                <button
                  key={item.label}
                  className={`admin-mobile-link ${
                    isActive(
                      item.path.split("#")[0]
                    )
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    handleNavClick(item)
                  }
                >
                  <span>
                    {item.icon}
                  </span>

                  {item.label}

                  {item.badge > 0 && (
                    <span className="admin-topbar-badge">
                      {item.badge}
                    </span>
                  )}

                </button>
              ))}

            </nav>


            <div className="admin-mobile-user">

              <div className="admin-topbar-avatar">
                {adminName
                  ?.charAt(0)
                  ?.toUpperCase() || "A"}
              </div>

              <div className="admin-topbar-user-info">
                <strong>
                  {adminName}
                </strong>

                <span>
                  {t("admin.role")}
                </span>
              </div>

            </div>


            <button
              className="admin-mobile-logout"
              onClick={handleLogout}
            >
              ↪ {t("admin.logout")}
            </button>

          </div>
        )}

      </header>


      <main className="admin-shell-main">
        {children}
      </main>

    </div>
  );
}