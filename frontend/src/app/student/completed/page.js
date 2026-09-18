"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import "./completed.css";

export default function CompletedExamsPage() {
  const router = useRouter();

  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const role = localStorage.getItem("role");

    if (!token || role !== "student") {
      router.push("/login");
      return;
    }

    loadCompletedExams(token);
  }, [router]);

  async function loadCompletedExams(token) {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://127.0.0.1:8000/exams/student/completed",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Unable to load completed examinations."
        );
      }

      setExams(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setError(
        error.message || "Unable to load completed examinations."
      );
    } finally {
      setLoading(false);
    }
  }

  function formatDate(date) {
    if (!date) {
      return "Not available";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Not available";
    }

    return parsedDate.toLocaleString([], {
      dateStyle: "medium",
      timeStyle: "short",
    });
  }

  function getExamResult(exam) {
    const score =
      exam.score ??
      exam.total_score ??
      exam.marks_obtained ??
      null;

    const maximumMarks =
      exam.maximum_marks ??
      exam.total_marks ??
      0;

    if (score === null) {
      return {
        score: "Not available",
        percentage: null,
      };
    }

    const percentage =
      maximumMarks > 0
        ? Math.round((Number(score) / Number(maximumMarks)) * 100)
        : 0;

    return {
      score,
      percentage,
    };
  }

  function openExam(exam) {
    router.push(`/student/exams/${exam.id}`);
  }

  function handleLogout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("role");

    router.push("/login");
  }

  return (
    <main className="completed-page">

      {/* ================================================== */}
      {/* HEADER */}
      {/* ================================================== */}

      <header className="completed-header">

        <div className="completed-brand">

          <div className="completed-brand-icon">
            AI
          </div>

          <div>
            <h2>AI Examination</h2>
            <span>Student Portal</span>
          </div>

        </div>


        <div className="completed-header-right">

          <div className="completed-user">

            <div className="completed-avatar">
              S
            </div>

            <div>
              <strong>Student</strong>
              <span>Student Account</span>
            </div>

          </div>


          <button
            className="completed-logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </header>


      {/* ================================================== */}
      {/* CONTENT */}
      {/* ================================================== */}

      <section className="completed-content">

        {/* PAGE INTRO */}

        <div className="completed-intro">

          <div>

            <button
              className="completed-back-button"
              onClick={() => router.push("/student")}
            >
              ← Dashboard
            </button>

            <p className="completed-label">
              STUDENT EXAMINATIONS
            </p>

            <h1>
              Completed Examinations
            </h1>

            <p className="completed-description">
              View examinations whose examination window
              has ended.
            </p>

          </div>


          <div className="completed-count-box">

            <strong>
              {exams.length}
            </strong>

            <span>
              Completed
            </span>

          </div>

        </div>


        {/* ================================================== */}
        {/* LOADING */}
        {/* ================================================== */}

        {loading && (

          <div className="completed-state-card">

            <div className="completed-spinner"></div>

            <h3>
              Loading completed examinations...
            </h3>

            <p>
              Please wait while we fetch your examination
              history.
            </p>

          </div>

        )}


        {/* ================================================== */}
        {/* ERROR */}
        {/* ================================================== */}

        {!loading && error && (

          <div className="completed-state-card completed-error-card">

            <div className="completed-state-icon">
              !
            </div>

            <h3>
              Unable to load examinations
            </h3>

            <p>
              {error}
            </p>

            <button
              className="completed-retry-button"
              onClick={() => {

                const token =
                  localStorage.getItem("access_token");

                if (token) {
                  loadCompletedExams(token);
                }

              }}
            >
              Try Again
            </button>

          </div>

        )}


        {/* ================================================== */}
        {/* NO COMPLETED EXAMS */}
        {/* ================================================== */}

        {!loading &&
          !error &&
          exams.length === 0 && (

            <div className="completed-state-card">

              <div className="completed-state-icon">
                📚
              </div>

              <h3>
                No completed examinations
              </h3>

              <p>
                You do not have any completed examinations
                yet.
              </p>

              <button
                className="completed-dashboard-button"
                onClick={() =>
                  router.push("/student")
                }
              >
                View Available Examinations
              </button>

            </div>

          )}


        {/* ================================================== */}
        {/* COMPLETED EXAM LIST */}
        {/* ================================================== */}

        {!loading &&
          !error &&
          exams.length > 0 && (

            <section className="completed-exams-section">

              <div className="completed-section-heading">

                <div>
                  <h2>
                    Your Examination History
                  </h2>

                  <p>
                    These examinations have already ended.
                  </p>
                </div>

                <button
                  className="available-button"
                  onClick={() =>
                    router.push("/student/exams")
                  }
                >
                  View Available Exams →
                </button>

              </div>


              <div className="completed-exam-grid">

                {exams.map((exam) => {

                  const result =
                    getExamResult(exam);

                  return (

                    <article
                      className="completed-exam-card"
                      key={exam.id}
                    >

                      {/* CARD TOP */}

                      <div className="completed-card-top">

                        <div className="completed-exam-icon">
                          📝
                        </div>

                        <span className="completed-badge">
                          ● Completed
                        </span>

                      </div>


                      {/* TITLE */}

                      <h3>
                        {exam.exam_name}
                      </h3>


                      <div className="completed-subject">
                        {exam.subject}
                      </div>


                      {/* DETAILS */}

                      <div className="completed-details">

                        <div className="completed-detail-item">

                          <span>
                            Questions
                          </span>

                          <strong>
                            {exam.total_questions ?? 0}
                          </strong>

                        </div>


                        <div className="completed-detail-item">

                          <span>
                            Maximum Marks
                          </span>

                          <strong>
                            {exam.maximum_marks ?? 0}
                          </strong>

                        </div>


                        <div className="completed-detail-item">

                          <span>
                            Duration
                          </span>

                          <strong>
                            {exam.duration_minutes ?? 0} min
                          </strong>

                        </div>

                      </div>


                      {/* SCHEDULE */}

                      <div className="completed-schedule">

                        <div>

                          <span>
                            Started
                          </span>

                          <strong>
                            {formatDate(
                              exam.start_time
                            )}
                          </strong>

                        </div>


                        <div>

                          <span>
                            Ended
                          </span>

                          <strong>
                            {formatDate(
                              exam.end_time
                            )}
                          </strong>

                        </div>

                      </div>


                      {/* RESULT */}

                      <div className="completed-result">

                        <div>

                          <span>
                            Result
                          </span>

                          <strong>
                            {result.score === "Not available"
                              ? "Not available"
                              : `${result.score} / ${exam.maximum_marks ?? 0}`}
                          </strong>

                        </div>


                        {result.percentage !== null && (

                          <div className="completed-percentage">

                            <strong>
                              {result.percentage}%
                            </strong>

                            <span>
                              Score
                            </span>

                          </div>

                        )}

                      </div>


                      {/* BUTTON */}

                      <button
                        className="completed-view-button"
                        onClick={() =>
                          openExam(exam)
                        }
                      >
                        View Examination
                        <span>→</span>
                      </button>

                    </article>

                  );

                })}

              </div>

            </section>

          )}

      </section>

    </main>
  );
}