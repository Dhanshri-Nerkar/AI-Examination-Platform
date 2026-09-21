"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import "./exams.css";

const API_URL = "http://127.0.0.1:8000";

export default function AdminExaminations() {
  const router = useRouter();

  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [publicationFilter, setPublicationFilter] =
    useState("All");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // ============================================================
  // TOKEN
  // ============================================================

  const getToken = () => {
    return localStorage.getItem("access_token");
  };

  // ============================================================
  // LOAD EXAMS
  // ============================================================

  const loadExams = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();

      if (!token) {
        setError("Admin login required.");
        return;
      }

      const response = await fetch(
        `${API_URL}/admin/exams`,
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
            "Failed to load examinations."
        );
      }

      setExams(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExams();
  }, []);

  // ============================================================
  // PUBLISH / UNPUBLISH
  // ============================================================

  const togglePublication = async (exam) => {
    try {
      setMessage("");
      setError("");

      const token = getToken();

      const endpoint = exam.is_published
        ? `${API_URL}/admin/exams/${exam.id}/unpublish`
        : `${API_URL}/admin/exams/${exam.id}/publish`;

      const response = await fetch(
        endpoint,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
            "Unable to update examination."
        );
      }

      setMessage(data.message);

      await loadExams();

    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  // ============================================================
  // FILTER
  // ============================================================

  const filteredExams = exams.filter((exam) => {

    const searchText = search
      .toLowerCase()
      .trim();

    const matchesSearch =
      !searchText ||
      exam.exam_name
        ?.toLowerCase()
        .includes(searchText) ||
      exam.subject
        ?.toLowerCase()
        .includes(searchText) ||
      exam.examiner_name
        ?.toLowerCase()
        .includes(searchText) ||
      exam.examiner_email
        ?.toLowerCase()
        .includes(searchText);

    const matchesStatus =
      statusFilter === "All" ||
      exam.status === statusFilter;

    const matchesPublication =
      publicationFilter === "All" ||
      (publicationFilter === "Published"
        ? exam.is_published
        : !exam.is_published);

    return (
      matchesSearch &&
      matchesStatus &&
      matchesPublication
    );
  });

  // ============================================================
  // FORMAT DATE
  // ============================================================

  const formatDate = (value) => {
    if (!value) return "-";

    return new Date(value).toLocaleString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  // ============================================================
  // STATS
  // ============================================================

  const totalExams = exams.length;

  const publishedExams = exams.filter(
    (exam) => exam.is_published
  ).length;

  const draftExams = exams.filter(
    (exam) => !exam.is_published
  ).length;

  const liveExams = exams.filter(
    (exam) => exam.status === "Live"
  ).length;

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <main className="exams-page">
        <div className="exams-loading">
          <div className="loading-spinner"></div>
          <p>Loading examinations...</p>
        </div>
      </main>
    );
  }

  // ============================================================
  // UI
  // ============================================================

  return (
    <main className="exams-page">

      <div className="exams-container">

        {/* ======================================================
            HEADER
        ====================================================== */}

        <header className="exams-header">

          <div>
            <button
              className="back-button"
              onClick={() =>
                router.push("/admin")
              }
            >
              ← Admin Dashboard
            </button>

            <p className="exams-eyebrow">
              EXAMINATION MANAGEMENT
            </p>

            <h1>
              Examinations
            </h1>

            <p className="exams-subtitle">
              Monitor and manage examinations across
              the platform.
            </p>
          </div>

          <button
            className="refresh-button"
            onClick={loadExams}
          >
            ↻ Refresh
          </button>

        </header>


        {/* ======================================================
            MESSAGES
        ====================================================== */}

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


        {/* ======================================================
            SUMMARY
        ====================================================== */}

        <section className="exam-summary">

          <div className="exam-summary-card">
            <div className="summary-icon">
              📋
            </div>

            <div>
              <span>Total Exams</span>
              <strong>{totalExams}</strong>
            </div>
          </div>

          <div className="exam-summary-card">
            <div className="summary-icon published-icon">
              ✓
            </div>

            <div>
              <span>Published</span>
              <strong>{publishedExams}</strong>
            </div>
          </div>

          <div className="exam-summary-card">
            <div className="summary-icon draft-icon">
              📝
            </div>

            <div>
              <span>Unpublished</span>
              <strong>{draftExams}</strong>
            </div>
          </div>

          <div className="exam-summary-card">
            <div className="summary-icon live-icon">
              ●
            </div>

            <div>
              <span>Live Now</span>
              <strong>{liveExams}</strong>
            </div>
          </div>

        </section>


        {/* ======================================================
            FILTERS
        ====================================================== */}

        <section className="filters-section">

          <div className="search-box">
            <span>⌕</span>

            <input
              type="text"
              placeholder="Search by exam, subject or examiner..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
          >
            <option value="All">
              All Status
            </option>

            <option value="Draft">
              Draft
            </option>

            <option value="Upcoming">
              Upcoming
            </option>

            <option value="Live">
              Live
            </option>

            <option value="Completed">
              Completed
            </option>
          </select>

          <select
            value={publicationFilter}
            onChange={(e) =>
              setPublicationFilter(
                e.target.value
              )
            }
          >
            <option value="All">
              All Publications
            </option>

            <option value="Published">
              Published
            </option>

            <option value="Unpublished">
              Unpublished
            </option>
          </select>

        </section>


        {/* ======================================================
            TABLE
        ====================================================== */}

        <section className="exams-table-section">

          <div className="table-header">

            <div>
              <p className="table-eyebrow">
                PLATFORM EXAMS
              </p>

              <h2>
                All Examinations
              </h2>
            </div>

            <span className="result-count">
              {filteredExams.length} examinations
            </span>

          </div>


          {filteredExams.length === 0 ? (

            <div className="empty-exams">

              <div className="empty-exam-icon">
                📋
              </div>

              <h3>
                No examinations found
              </h3>

              <p>
                Try changing your search or filters.
              </p>

            </div>

          ) : (

            <div className="table-wrapper">

              <table>

                <thead>
                  <tr>
                    <th>EXAMINATION</th>
                    <th>EXAMINER</th>
                    <th>SCHEDULE</th>
                    <th>DETAILS</th>
                    <th>STATUS</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>

                <tbody>

                  {filteredExams.map((exam) => (

                    <tr key={exam.id}>

                      {/* EXAM */}

                      <td>

                        <div className="exam-cell">

                          <div className="exam-icon">
                            📋
                          </div>

                          <div>

                            <strong>
                              {exam.exam_name}
                            </strong>

                            <span>
                              {exam.subject}
                            </span>

                          </div>

                        </div>

                      </td>


                      {/* EXAMINER */}

                      <td>

                        <div className="examiner-cell">

                          <div className="examiner-avatar">
                            {exam.examiner_name
                              ?.charAt(0)
                              ?.toUpperCase()}
                          </div>

                          <div>

                            <strong>
                              {exam.examiner_name}
                            </strong>

                            <span>
                              {exam.examiner_email}
                            </span>

                          </div>

                        </div>

                      </td>


                      {/* SCHEDULE */}

                      <td>

                        <div className="schedule-cell">

                          <span>
                            <b>Start:</b>{" "}
                            {formatDate(
                              exam.start_time
                            )}
                          </span>

                          <span>
                            <b>End:</b>{" "}
                            {formatDate(
                              exam.end_time
                            )}
                          </span>

                        </div>

                      </td>


                      {/* DETAILS */}

                      <td>

                        <div className="details-cell">

                          <span>
                            {exam.duration_minutes} min
                          </span>

                          <span>
                            {exam.question_count} questions
                          </span>

                          <span>
                            {exam.maximum_marks} marks
                          </span>

                          <span>
                            {exam.attempt_count} attempts
                          </span>

                        </div>

                      </td>


                      {/* STATUS */}

                      <td>

                        <div className="status-stack">

                          <span
                            className={`exam-status status-${exam.status.toLowerCase()}`}
                          >
                            {exam.status}
                          </span>

                          <span
                            className={
                              exam.is_published
                                ? "publication published"
                                : "publication unpublished"
                            }
                          >
                            {exam.is_published
                              ? "Published"
                              : "Unpublished"}
                          </span>

                        </div>

                      </td>


                      {/* ACTIONS */}

                      <td>

                        <div className="exam-actions">

  <button
    className="view-details-button"
    onClick={() =>
      router.push(`/admin/exams/${exam.id}`)
    }
  >
    View Details
  </button>

  <button
    className={
      exam.is_published
        ? "unpublish-button"
        : "publish-button"
    }
    onClick={() =>
      togglePublication(exam)
    }
  >
    {exam.is_published
      ? "Unpublish"
      : "Publish"}
  </button>

</div>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </section>

      </div>

    </main>
  );
}