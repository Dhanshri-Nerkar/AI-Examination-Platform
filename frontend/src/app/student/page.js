"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import "./student.css";

export default function StudentDashboard() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [exams, setExams] = useState([]);
  const [completedExams, setCompletedExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const role = localStorage.getItem("role");

    if (!token || role !== "student") {
      router.push("/login");
      return;
    }

    setUser({ role });
    loadExams(token);
  }, [router]);

  // ============================================================
  // LOAD EXAMS
  // ============================================================

  async function loadExams(token) {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://127.0.0.1:8000/exams/student/exams",
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
          data.detail || "Unable to load examinations."
        );
      }

      const available = Array.isArray(data.available)
        ? data.available
        : [];

      const completed = Array.isArray(data.completed)
        ? data.completed
        : [];

      setExams(available);
      setCompletedExams(completed);
    } catch (error) {
      console.error(error);

      setError(
        error.message || "Unable to load examinations."
      );
    } finally {
      setLoading(false);
    }
  }

  // ============================================================
  // EXAM STATUS
  // ============================================================

  function getExamStatus(exam) {
    const now = new Date();

    const start = exam.start_time
      ? new Date(exam.start_time)
      : null;

    const end = exam.end_time
      ? new Date(exam.end_time)
      : null;

    if (exam.attempt_status === "submitted") {
      return {
        label: "Completed",
        className: "completed",
      };
    }

    if (exam.attempt_status === "in_progress") {
      return {
        label: "In Progress",
        className: "active",
      };
    }

    if (start && now < start) {
      return {
        label: "Upcoming",
        className: "upcoming",
      };
    }

    if (
      start &&
      end &&
      now >= start &&
      now <= end
    ) {
      return {
        label: "Active",
        className: "active",
      };
    }

    return {
      label: "Upcoming",
      className: "upcoming",
    };
  }

  // ============================================================
  // FORMAT DATE
  // ============================================================

  function formatDate(date) {
    if (!date) {
      return "Not set";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Not set";
    }

    return parsedDate.toLocaleString([], {
      dateStyle: "medium",
      timeStyle: "short",
    });
  }

  // ============================================================
  // START EXAMINATION
  // ============================================================

  function handleStartExam(exam) {
    const status = getExamStatus(exam);

    if (status.label === "Upcoming") {
      alert(
        `This examination starts on ${formatDate(
          exam.start_time
        )}.`
      );
      return;
    }

    if (status.label === "Completed") {
      router.push(
        `/student/exams/${exam.id}/result`
      );
      return;
    }

    if (status.label === "In Progress") {
      router.push(
        `/student/exams/${exam.id}/attempt`
      );
      return;
    }

    router.push(
      `/student/exams/${exam.id}/instructions`
    );
  }

  // ============================================================
  // VIEW RESULT
  // ============================================================

  function handleViewResult(exam) {
    router.push(
      `/student/exams/${exam.id}/result`
    );
  }

  // ============================================================
  // RETRY
  // ============================================================

  function handleRetry() {
    const token =
      localStorage.getItem("access_token");

    if (token) {
      loadExams(token);
    }
  }

  // ============================================================
  // LOADING
  // ============================================================

  if (!user) {
    return (
      <main className="student-loading">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </main>
    );
  }

  // ============================================================
  // PAGE
  // ============================================================

  return (
    <main className="student-page">

      <section className="student-content">

        {/* ====================================================
            WELCOME / HERO
        ==================================================== */}

        <div className="student-hero">
          <div className="student-hero-icon">🎓</div>

          <div className="student-hero-content">
            <p className="welcome-label">STUDENT DASHBOARD</p>

            <h1>Welcome to your examinations</h1>

            <p>
              View your upcoming, active, and completed
              examinations from your student portal.
            </p>
          </div>
        </div>


        {/* ====================================================
            ERROR
        ==================================================== */}

        {!loading && error && (
          <div className="student-state-card error-card">
            <div className="state-icon">!</div>

            <h3>Unable to load examinations</h3>

            <p>{error}</p>

            <button
              className="retry-button"
              onClick={handleRetry}
            >
              Try Again
            </button>
          </div>
        )}


        {/* ====================================================
            LOADING
        ==================================================== */}

        {loading && (
          <div className="student-state-card">
            <div className="loading-spinner"></div>

            <h3>Loading examinations...</h3>

            <p>
              Please wait while we fetch your examinations.
            </p>
          </div>
        )}


        {!loading && !error && (
          <>
            {/* ==================================================
                AVAILABLE EXAMINATIONS
            ================================================== */}

            <section
              className="student-section"
              id="available"
            >

              <div className="student-section-heading">
                <div>
                  <p className="section-label">AVAILABLE</p>

                  <h2>Available Examinations</h2>

                  <p>
                    Upcoming and currently active examinations.
                  </p>
                </div>

                <div className="exam-count">
                  {exams.length} Exam
                  {exams.length !== 1 ? "s" : ""}
                </div>
              </div>


              {exams.length === 0 ? (
                <div className="student-state-card">
                  <div className="state-icon">📝</div>

                  <h3>No available examinations</h3>

                  <p>
                    There are currently no upcoming
                    or active examinations.
                  </p>
                </div>
              ) : (
                <div className="student-exam-grid">
                  {exams.map((exam) => {
                    const status = getExamStatus(exam);

                    return (
                      <article
                        className="student-exam-card"
                        key={exam.id}
                      >
                        <div className="student-exam-top">
                          <div className="student-exam-icon">📝</div>

                          <span
                            className={`exam-status ${status.className}`}
                          >
                            {status.label}
                          </span>
                        </div>

                        <h3>{exam.exam_name}</h3>

                        <div className="student-exam-subject">
                          {exam.subject}
                        </div>

                        <div className="student-exam-details">
                          <div className="student-detail">
                            <span>Duration</span>
                            <strong>
                              {exam.duration_minutes} min
                            </strong>
                          </div>

                          <div className="student-detail">
                            <span>Questions</span>
                            <strong>{exam.total_questions}</strong>
                          </div>

                          <div className="student-detail">
                            <span>Maximum Marks</span>
                            <strong>{exam.maximum_marks}</strong>
                          </div>
                        </div>

                        <div className="student-exam-schedule">
                          <div>
                            <span>Starts</span>
                            <strong>
                              {formatDate(exam.start_time)}
                            </strong>
                          </div>

                          <div>
                            <span>Ends</span>
                            <strong>
                              {formatDate(exam.end_time)}
                            </strong>
                          </div>
                        </div>

                        <button
                          className="start-exam-button"
                          onClick={() => handleStartExam(exam)}
                        >
                          {status.label === "Active"
                            ? "Start Examination →"
                            : status.label === "In Progress"
                            ? "Continue Examination →"
                            : "Examination Not Started"}
                        </button>
                      </article>
                    );
                  })}
                </div>
              )}

            </section>


            {/* ==================================================
                COMPLETED EXAMINATIONS
            ================================================== */}

            <section
              className="student-section completed-section"
              id="completed"
            >

              <div className="student-section-heading">
                <div>
                  <p className="section-label completed-label">
                    HISTORY
                  </p>

                  <h2>Completed Examinations</h2>

                  <p>
                    Examinations you have successfully submitted.
                  </p>
                </div>

                <div className="exam-count completed-count">
                  {completedExams.length} Completed
                </div>
              </div>


              {completedExams.length === 0 ? (
                <div className="student-state-card">
                  <div className="state-icon">📚</div>

                  <h3>No completed examinations</h3>

                  <p>
                    Your submitted examinations will
                    appear here after you complete them.
                  </p>
                </div>
              ) : (
                <div className="student-exam-grid">
                  {completedExams.map((exam) => (
                    <article
                      className="student-exam-card completed-exam-card"
                      key={exam.id}
                    >
                      <div className="student-exam-top">
                        <div className="student-exam-icon">✅</div>

                        <span className="exam-status completed">
                          Completed
                        </span>
                      </div>

                      <h3>{exam.exam_name}</h3>

                      <div className="student-exam-subject">
                        {exam.subject}
                      </div>

                      <div className="student-exam-details">
                        <div className="student-detail">
                          <span>Duration</span>
                          <strong>
                            {exam.duration_minutes} min
                          </strong>
                        </div>

                        <div className="student-detail">
                          <span>Questions</span>
                          <strong>{exam.total_questions}</strong>
                        </div>

                        <div className="student-detail">
                          <span>Maximum Marks</span>
                          <strong>{exam.maximum_marks}</strong>
                        </div>
                      </div>

                      <div className="student-exam-schedule">
                        <div>
                          <span>Started</span>
                          <strong>
                            {formatDate(exam.start_time)}
                          </strong>
                        </div>

                        <div>
                          <span>Ended</span>
                          <strong>
                            {formatDate(exam.end_time)}
                          </strong>
                        </div>
                      </div>

                      <button
                        className="result-button"
                        onClick={() => handleViewResult(exam)}
                      >
                        View Result →
                      </button>
                    </article>
                  ))}
                </div>
              )}

            </section>
          </>
        )}

      </section>

    </main>
  );
}