"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import "./admin.css";

const API_URL = "http://127.0.0.1:8000";

export default function AdminDashboard() {
  const router = useRouter();

  const [stats, setStats] = useState(null);
  const [examiners, setExaminers] = useState([]);

  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingExaminers, setLoadingExaminers] = useState(true);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const getToken = () => {
    return localStorage.getItem("access_token");
  };

  const loadStats = async () => {
    try {
      setLoadingStats(true);
      setError("");

      const token = getToken();

      if (!token) {
        setError("Admin login required.");
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
          data.detail || "Failed to load dashboard statistics."
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
        setError("Admin login required.");
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
          data.detail || "Failed to load examiner requests."
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
          data.detail || "Failed to approve examiner."
        );
      }

      setMessage("Examiner approved successfully.");

      setExaminers((previous) =>
        previous.filter(
          (examiner) => examiner.id !== id
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
          data.detail || "Failed to reject examiner."
        );
      }

      setMessage("Examiner rejected.");

      setExaminers((previous) =>
        previous.filter(
          (examiner) => examiner.id !== id
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
      .getElementById("examiner-requests")
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
          <p>Loading Admin Dashboard...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <div className="admin-container">

        <header className="admin-header">
          <div>
            <p className="admin-eyebrow">ADMINISTRATION</p>
            <h1>Admin Dashboard</h1>
            <p className="admin-subtitle">
              Manage users, examinations and platform
              activity from one place.
            </p>
          </div>

          <button
            className="refresh-button"
            onClick={refreshDashboard}
          >
            ↻ Refresh
          </button>
        </header>

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

        {stats && (
          <section className="stats-section">
            <div className="stat-card">
              <div className="stat-icon students">👨‍🎓</div>
              <div>
                <p>Total Students</p>
                <h2>{stats.users.total_students}</h2>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon examiners">👨‍🏫</div>
              <div>
                <p>Total Examiners</p>
                <h2>{stats.users.total_examiners}</h2>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon pending">⏳</div>
              <div>
                <p>Pending Requests</p>
                <h2>{stats.users.pending_examiners}</h2>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon exams">📝</div>
              <div>
                <p>Total Examinations</p>
                <h2>{stats.examinations.total_exams}</h2>
              </div>
            </div>
          </section>
        )}

        <section className="quick-actions-section">
          <div className="admin-section-heading">
            <div>
              <p className="section-eyebrow">MANAGEMENT</p>
              <h2>Quick Actions</h2>
              <p>Access the main administration areas.</p>
            </div>
          </div>

          <div className="quick-actions-grid">

            <button
              className="action-card"
              onClick={() => router.push("/admin/users")}
            >
              <div className="action-icon users-action">👥</div>
              <div className="action-content">
                <h3>Manage Users</h3>
                <p>View students, examiners and administrators.</p>
              </div>
              <span className="action-arrow">→</span>
            </button>

            <button
              className="action-card"
              onClick={goToRequests}
            >
              <div className="action-icon requests-action">⏳</div>
              <div className="action-content">
                <h3>Examiner Requests</h3>
                <p>Review pending examiner registrations.</p>
              </div>
              <span className="action-arrow">→</span>
            </button>

            <button
              className="action-card"
              onClick={() => router.push("/admin/exams")}
            >
              <div className="action-icon exams-action">📋</div>
              <div className="action-content">
                <h3>Examination Management</h3>
                <p>Monitor examinations, schedules and student activity.</p>
              </div>
              <span className="action-arrow">→</span>
            </button>

          </div>
        </section>

        {stats && (
          <section className="overview-section">
            <div className="admin-section-heading">
              <div>
                <p className="section-eyebrow">PLATFORM</p>
                <h2>System Overview</h2>
              </div>
            </div>

            <div className="overview-grid">

              <div className="overview-card">
                <div className="overview-card-header">
                  <span className="overview-icon">👥</span>
                  <h3>Users</h3>
                </div>

                <div className="overview-row">
                  <span>Students</span>
                  <strong>{stats.users.total_students}</strong>
                </div>

                <div className="overview-row">
                  <span>Examiners</span>
                  <strong>{stats.users.total_examiners}</strong>
                </div>

                <div className="overview-row">
                  <span>Approved Examiners</span>
                  <strong>{stats.users.approved_examiners}</strong>
                </div>

                <div className="overview-row">
                  <span>Pending Requests</span>
                  <strong className="warning-text">
                    {stats.users.pending_examiners}
                  </strong>
                </div>
              </div>

              <div className="overview-card">
                <div className="overview-card-header">
                  <span className="overview-icon">📋</span>
                  <h3>Examinations</h3>
                </div>

                <div className="overview-row">
                  <span>Total Exams</span>
                  <strong>{stats.examinations.total_exams}</strong>
                </div>

                <div className="overview-row">
                  <span>Published</span>
                  <strong className="success-text">
                    {stats.examinations.published_exams}
                  </strong>
                </div>

                <div className="overview-row">
                  <span>Unpublished</span>
                  <strong>{stats.examinations.unpublished_exams}</strong>
                </div>
              </div>

              <div className="overview-card">
                <div className="overview-card-header">
                  <span className="overview-icon">📊</span>
                  <h3>Examination Activity</h3>
                </div>

                <div className="overview-row">
                  <span>Total Attempts</span>
                  <strong>{stats.attempts.total_attempts}</strong>
                </div>

                <div className="overview-row">
                  <span>Submitted</span>
                  <strong className="success-text">
                    {stats.attempts.submitted_attempts}
                  </strong>
                </div>

                <div className="overview-row">
                  <span>In Progress</span>
                  <strong className="warning-text">
                    {stats.attempts.in_progress_attempts}
                  </strong>
                </div>
              </div>

            </div>
          </section>
        )}

        <section
          className="requests-section"
          id="examiner-requests"
        >
          <div className="admin-section-heading">
            <div>
              <p className="section-eyebrow">USER MANAGEMENT</p>
              <h2>Examiner Registration Requests</h2>
              <p>Review and manage examiner registration requests.</p>
            </div>

            <div className="pending-count">
              {examiners.length} Pending
            </div>
          </div>

          {loadingExaminers ? (
            <div className="section-loading">
              <div className="loading-spinner small"></div>
              <p>Loading examiner requests...</p>
            </div>
          ) : examiners.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">✓</div>
              <h3>No Pending Requests</h3>
              <p>
                There are currently no examiner
                registration requests waiting for review.
              </p>
            </div>
          ) : (
            <div className="examiner-list">
              {examiners.map((examiner) => (
                <div className="examiner-card" key={examiner.id}>
                  <div className="examiner-info">
                    <div className="examiner-avatar">
                      {examiner.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <div>
                      <h3>{examiner.name}</h3>
                      <p>{examiner.email}</p>
                      <span className="pending-badge">Pending Review</span>
                    </div>
                  </div>

                  <div className="examiner-actions">
                    <button
                      className="approve-button"
                      onClick={() => approveExaminer(examiner.id)}
                    >
                      ✓ Approve
                    </button>

                    <button
                      className="reject-button"
                      onClick={() => rejectExaminer(examiner.id)}
                    >
                      ✕ Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </main>
  );
}