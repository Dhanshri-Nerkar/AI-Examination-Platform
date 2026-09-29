"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

import "./admin.css";

const API_URL = "http://127.0.0.1:8000";

export default function AdminDashboard() {
  const router = useRouter();
  const { t } = useTranslation();

  const [stats, setStats] = useState(null);
  const [examiners, setExaminers] = useState([]);

  const [loadingStats, setLoadingStats] =
    useState(true);

  const [loadingExaminers, setLoadingExaminers] =
    useState(true);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const getToken = () => {
    return localStorage.getItem(
      "access_token"
    );
  };

  const loadStats = async () => {
    try {
      setLoadingStats(true);
      setError("");

      const token = getToken();

      if (!token) {
        setError(
          t("admin.login_required")
        );
        return;
      }

      const response = await fetch(
        `${API_URL}/admin/dashboard/stats`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
            t("admin.stats_error")
        );
      }

      setStats(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoadingStats(false);
    }
  };

  const loadPendingExaminers = async () => {
    try {
      setLoadingExaminers(true);

      const token = getToken();

      if (!token) {
        setError(
          t("admin.login_required")
        );
        return;
      }

      const response = await fetch(
        `${API_URL}/admin/examiners/pending`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
            t("admin.examiner_requests_error")
        );
      }

      setExaminers(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoadingExaminers(false);
    }
  };

  useEffect(() => {
    loadStats();
    loadPendingExaminers();
  }, []);

  const refreshDashboard = async () => {
    setMessage("");
    setError("");

    await Promise.all([
      loadStats(),
      loadPendingExaminers(),
    ]);
  };

  const approveExaminer = async (id) => {
    try {
      setMessage("");
      setError("");

      const token = getToken();

      const response = await fetch(
        `${API_URL}/admin/examiners/${id}/approve`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
            t("admin.approve_error")
        );
      }

      setMessage(
        t("admin.examiner_approved")
      );

      setExaminers((previous) =>
        previous.filter(
          (examiner) =>
            examiner.id !== id
        )
      );

      loadStats();
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  const rejectExaminer = async (id) => {
    try {
      setMessage("");
      setError("");

      const token = getToken();

      const response = await fetch(
        `${API_URL}/admin/examiners/${id}/reject`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
            t("admin.reject_error")
        );
      }

      setMessage(
        t("admin.examiner_rejected")
      );

      setExaminers((previous) =>
        previous.filter(
          (examiner) =>
            examiner.id !== id
        )
      );

      loadStats();
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  const goToRequests = () => {
    document
      .getElementById(
        "examiner-requests"
      )
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  };

  if (loadingStats && !stats) {
    return (
      <main className="admin-page">
        <div className="admin-loading">

          <div className="loading-spinner"></div>

          <p>
            {t("admin.loading_dashboard")}
          </p>

        </div>
      </main>
    );
  }

  return (
    <main className="admin-page">

      <div className="admin-container">

        {/* HEADER */}
        <header className="admin-header">

          <div>

            <p className="admin-eyebrow">
              {t("admin.administration")}
            </p>

            <h1>
              {t("admin.dashboard_title")}
            </h1>

            <p className="admin-subtitle">
              {t("admin.dashboard_subtitle")}
            </p>

          </div>

          <button
            className="refresh-button"
            onClick={refreshDashboard}
          >
            ↻ {t("admin.refresh")}
          </button>

        </header>


        {/* MESSAGES */}
        {message && (
          <div className="success-message">
            <span>✓</span>
            {message}
          </div>
        )}

        {error && (
          <div className="error-message">
            <span>!</span>
            {error}
          </div>
        )}


        {/* STATISTICS */}
        {stats && (
          <section className="stats-section">

            <div className="stat-card">

              <div className="stat-icon students">
                👨‍🎓
              </div>

              <div>
                <p>
                  {t("admin.total_students")}
                </p>

                <h2>
                  {stats.users.total_students}
                </h2>
              </div>

            </div>


            <div className="stat-card">

              <div className="stat-icon examiners">
                👨‍🏫
              </div>

              <div>
                <p>
                  {t("admin.total_examiners")}
                </p>

                <h2>
                  {stats.users.total_examiners}
                </h2>
              </div>

            </div>


            <div className="stat-card">

              <div className="stat-icon pending">
                ⏳
              </div>

              <div>
                <p>
                  {t("admin.pending_requests")}
                </p>

                <h2>
                  {stats.users.pending_examiners}
                </h2>
              </div>

            </div>


            <div className="stat-card">

              <div className="stat-icon exams">
                📝
              </div>

              <div>
                <p>
                  {t("admin.total_examinations")}
                </p>

                <h2>
                  {stats.examinations.total_exams}
                </h2>
              </div>

            </div>

          </section>
        )}


        {/* QUICK ACTIONS */}
        <section className="quick-actions-section">

          <div className="admin-section-heading">

            <div>

              <p className="section-eyebrow">
                {t("admin.management")}
              </p>

              <h2>
                {t("admin.quick_actions")}
              </h2>

              <p>
                {t(
                  "admin.quick_actions_description"
                )}
              </p>

            </div>

          </div>


          <div className="quick-actions-grid">

            <button
              className="action-card"
              onClick={() =>
                router.push(
                  "/admin/users"
                )
              }
            >
              <div className="action-icon users-action">
                👥
              </div>

              <div className="action-content">

                <h3>
                  {t("admin.manage_users")}
                </h3>

                <p>
                  {t(
                    "admin.manage_users_description"
                  )}
                </p>

              </div>

              <span className="action-arrow">
                →
              </span>
            </button>


            <button
              className="action-card"
              onClick={goToRequests}
            >
              <div className="action-icon requests-action">
                ⏳
              </div>

              <div className="action-content">

                <h3>
                  {t(
                    "admin.examiner_requests"
                  )}
                </h3>

                <p>
                  {t(
                    "admin.examiner_requests_description"
                  )}
                </p>

              </div>

              <span className="action-arrow">
                →
              </span>
            </button>


            <button
              className="action-card"
              onClick={() =>
                router.push(
                  "/admin/exams"
                )
              }
            >
              <div className="action-icon exams-action">
                📋
              </div>

              <div className="action-content">

                <h3>
                  {t(
                    "admin.examination_management"
                  )}
                </h3>

                <p>
                  {t(
                    "admin.examination_management_description"
                  )}
                </p>

              </div>

              <span className="action-arrow">
                →
              </span>
            </button>

          </div>

        </section>


        {/* SYSTEM OVERVIEW */}
        {stats && (
          <section className="overview-section">

            <div className="admin-section-heading">

              <div>

                <p className="section-eyebrow">
                  {t("admin.platform")}
                </p>

                <h2>
                  {t("admin.system_overview")}
                </h2>

              </div>

            </div>


            <div className="overview-grid">

              {/* USERS */}
              <div className="overview-card">

                <div className="overview-card-header">

                  <span className="overview-icon">
                    👥
                  </span>

                  <h3>
                    {t("admin.users")}
                  </h3>

                </div>

                <div className="overview-row">
                  <span>
                    {t("admin.students")}
                  </span>

                  <strong>
                    {stats.users.total_students}
                  </strong>
                </div>

                <div className="overview-row">
                  <span>
                    {t("admin.examiners")}
                  </span>

                  <strong>
                    {stats.users.total_examiners}
                  </strong>
                </div>

                <div className="overview-row">
                  <span>
                    {t(
                      "admin.approved_examiners"
                    )}
                  </span>

                  <strong>
                    {stats.users.approved_examiners}
                  </strong>
                </div>

                <div className="overview-row">
                  <span>
                    {t(
                      "admin.pending_requests"
                    )}
                  </span>

                  <strong className="warning-text">
                    {stats.users.pending_examiners}
                  </strong>
                </div>

              </div>


              {/* EXAMINATIONS */}
              <div className="overview-card">

                <div className="overview-card-header">

                  <span className="overview-icon">
                    📋
                  </span>

                  <h3>
                    {t(
                      "admin.examinations"
                    )}
                  </h3>

                </div>

                <div className="overview-row">
                  <span>
                    {t("admin.total_exams")}
                  </span>

                  <strong>
                    {stats.examinations.total_exams}
                  </strong>
                </div>

                <div className="overview-row">
                  <span>
                    {t("admin.published")}
                  </span>

                  <strong className="success-text">
                    {stats.examinations.published_exams}
                  </strong>
                </div>

                <div className="overview-row">
                  <span>
                    {t("admin.unpublished")}
                  </span>

                  <strong>
                    {stats.examinations.unpublished_exams}
                  </strong>
                </div>

              </div>


              {/* EXAMINATION ACTIVITY */}
              <div className="overview-card">

                <div className="overview-card-header">

                  <span className="overview-icon">
                    📊
                  </span>

                  <h3>
                    {t(
                      "admin.examination_activity"
                    )}
                  </h3>

                </div>

                <div className="overview-row">
                  <span>
                    {t("admin.total_attempts")}
                  </span>

                  <strong>
                    {stats.attempts.total_attempts}
                  </strong>
                </div>

                <div className="overview-row">
                  <span>
                    {t("admin.submitted")}
                  </span>

                  <strong className="success-text">
                    {stats.attempts.submitted_attempts}
                  </strong>
                </div>

                <div className="overview-row">
                  <span>
                    {t("admin.in_progress")}
                  </span>

                  <strong className="warning-text">
                    {stats.attempts.in_progress_attempts}
                  </strong>
                </div>

              </div>

            </div>

          </section>
        )}


        {/* EXAMINER REQUESTS */}
        <section
          className="requests-section"
          id="examiner-requests"
        >

          <div className="admin-section-heading">

            <div>

              <p className="section-eyebrow">
                {t(
                  "admin.user_management"
                )}
              </p>

              <h2>
                {t(
                  "admin.examiner_registration_requests"
                )}
              </h2>

              <p>
                {t(
                  "admin.examiner_registration_description"
                )}
              </p>

            </div>

            <div className="pending-count">
              {examiners.length}{" "}
              {t("admin.pending")}
            </div>

          </div>


          {loadingExaminers ? (

            <div className="section-loading">

              <div className="loading-spinner small"></div>

              <p>
                {t(
                  "admin.loading_examiner_requests"
                )}
              </p>

            </div>

          ) : examiners.length === 0 ? (

            <div className="empty-state">

              <div className="empty-icon">
                ✓
              </div>

              <h3>
                {t(
                  "admin.no_pending_requests"
                )}
              </h3>

              <p>
                {t(
                  "admin.no_pending_requests_description"
                )}
              </p>

            </div>

          ) : (

            <div className="examiner-list">

              {examiners.map(
                (examiner) => (

                  <div
                    className="examiner-card"
                    key={examiner.id}
                  >

                    <div className="examiner-info">

                      <div className="examiner-avatar">
                        {examiner.name
                          ?.charAt(0)
                          ?.toUpperCase()}
                      </div>

                      <div>

                        <h3>
                          {examiner.name}
                        </h3>

                        <p>
                          {examiner.email}
                        </p>

                        <span className="pending-badge">
                          {t(
                            "admin.pending_review"
                          )}
                        </span>

                      </div>

                    </div>


                    <div className="examiner-actions">

                      <button
                        className="approve-button"
                        onClick={() =>
                          approveExaminer(
                            examiner.id
                          )
                        }
                      >
                        ✓{" "}
                        {t("admin.approve")}
                      </button>

                      <button
                        className="reject-button"
                        onClick={() =>
                          rejectExaminer(
                            examiner.id
                          )
                        }
                      >
                        ✕{" "}
                        {t("admin.reject")}
                      </button>

                    </div>

                  </div>

                )
              )}

            </div>

          )}

        </section>

      </div>

    </main>
  );
}