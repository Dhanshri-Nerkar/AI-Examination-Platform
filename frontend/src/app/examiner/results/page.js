"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import "./results.css";

const API = "http://127.0.0.1:8000";

export default function ExaminerResults() {
  const router = useRouter();

  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadResults();
  }, []);

  async function loadResults() {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("access_token");
      const role = localStorage.getItem("role");

      if (!token || role !== "examiner") {
        router.push("/login");
        return;
      }

      /* ---------------------------------
         Get examiner's examinations
      --------------------------------- */

      const examsResponse = await fetch(
        `${API}/exams/my-exams`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        }
      );

      const examsData = await examsResponse.json();

      if (!examsResponse.ok) {
        throw new Error(
          examsData.detail ||
            "Failed to load examinations."
        );
      }

      /* ---------------------------------
         Get submission information
         for each examination
      --------------------------------- */

      const examsWithResults = await Promise.all(
        examsData.map(async (exam) => {
          try {
            const response = await fetch(
              `${API}/exams/${exam.id}/submissions`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
                cache: "no-store",
              }
            );

            if (!response.ok) {
              return {
                ...exam,
                submissions: [],
                submissionCount: 0,
              };
            }

            const data = await response.json();

            return {
              ...exam,
              submissions: data.submissions || [],
              submissionCount:
                (data.submissions || []).length,
            };
          } catch (err) {
            console.error(
              `Failed to load submissions for exam ${exam.id}`,
              err
            );

            return {
              ...exam,
              submissions: [],
              submissionCount: 0,
            };
          }
        })
      );

      setExams(examsWithResults);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function getResultStatus(exam) {
    if (exam.result_published) {
      return {
        text: "Results Published",
        className: "status-published",
      };
    }

    if (exam.submissionCount === 0) {
      return {
        text: "No Submissions",
        className: "status-empty",
      };
    }

    /*
      At this stage submissions are available
      for examiner checking.
    */
    return {
      text: "Pending Evaluation",
      className: "status-pending",
    };
  }

  function handleViewResults(examId) {
    router.push(`/examiner/submissions/${examId}`);
  }

  if (loading) {
    return (
      <main className="results-page">
        <div className="results-loading">
          <div className="results-loading-spinner"></div>
          <p>Loading results...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="results-page">

      {/* ---------------------------------
          HEADER
      --------------------------------- */}

      <section className="results-header">

        <div className="results-header-left">

          <button
            className="results-back-button"
            onClick={() => router.push("/examiner")}
          >
            ← Dashboard
          </button>

          <div className="results-title-area">

            <div className="results-title-icon">
              📊
            </div>

            <div>
              <p className="results-label">
                EXAMINER RESULTS
              </p>

              <h1>Results & Submissions</h1>

              <p className="results-subtitle">
                Review student submissions, check answers,
                assign marks, and publish final results.
              </p>
            </div>

          </div>

        </div>

        <button
          className="results-refresh-button"
          onClick={loadResults}
        >
          ↻ Refresh
        </button>

      </section>


      {/* ---------------------------------
          ERROR
      --------------------------------- */}

      {error && (
        <div className="results-error">
          <span>⚠</span>
          <div>
            <strong>Unable to load results</strong>
            <p>{error}</p>
          </div>
        </div>
      )}


      {/* ---------------------------------
          SUMMARY
      --------------------------------- */}

      <section className="results-summary">

        <div className="summary-card">
          <div className="summary-icon">📚</div>

          <div>
            <span>Total Exams</span>
            <strong>{exams.length}</strong>
          </div>
        </div>


        <div className="summary-card">
          <div className="summary-icon">👨‍🎓</div>

          <div>
            <span>Total Submissions</span>
            <strong>
              {exams.reduce(
                (total, exam) =>
                  total + (exam.submissionCount || 0),
                0
              )}
            </strong>
          </div>
        </div>


        <div className="summary-card">
          <div className="summary-icon">⏳</div>

          <div>
            <span>Pending Evaluation</span>
            <strong>
              {
                exams.filter(
                  (exam) =>
                    !exam.result_published &&
                    exam.submissionCount > 0
                ).length
              }
            </strong>
          </div>
        </div>


        <div className="summary-card">
          <div className="summary-icon">✓</div>

          <div>
            <span>Published Results</span>
            <strong>
              {
                exams.filter(
                  (exam) => exam.result_published
                ).length
              }
            </strong>
          </div>
        </div>

      </section>


      {/* ---------------------------------
          EXAM RESULTS
      --------------------------------- */}

      <section className="results-section">

        <div className="results-section-header">

          <div>
            <h2>Examination Results</h2>

            <p>
              Select an examination to review its
              student submissions.
            </p>
          </div>

        </div>


        {exams.length === 0 ? (

          <div className="results-empty">

            <div className="results-empty-icon">
              📊
            </div>

            <h2>No examinations found</h2>

            <p>
              Create an examination first to manage
              student results.
            </p>

            <button
              onClick={() =>
                router.push(
                  "/examiner/create-exam"
                )
              }
            >
              Create Examination
              <span>→</span>
            </button>

          </div>

        ) : (

          <div className="results-grid">

            {exams.map((exam) => {

              const status =
                getResultStatus(exam);

              return (
                <article
                  className="result-exam-card"
                  key={exam.id}
                >

                  {/* Card Header */}

                  <div className="result-card-top">

                    <div className="result-exam-icon">
                      📝
                    </div>

                    <span
                      className={`result-status ${status.className}`}
                    >
                      <span className="status-dot"></span>
                      {status.text}
                    </span>

                  </div>


                  {/* Exam Information */}

                  <div className="result-card-content">

                    <h3>
                      {exam.exam_name}
                    </h3>

                    <p className="result-subject">
                      {exam.subject}
                    </p>


                    <div className="result-details">

                      <div className="result-detail">
                        <span className="detail-icon">
                          📋
                        </span>

                        <div>
                          <small>
                            Questions
                          </small>

                          <strong>
                            {exam.total_questions}
                          </strong>
                        </div>
                      </div>


                      <div className="result-detail">
                        <span className="detail-icon">
                          ⭐
                        </span>

                        <div>
                          <small>
                            Maximum Marks
                          </small>

                          <strong>
                            {exam.maximum_marks}
                          </strong>
                        </div>
                      </div>


                      <div className="result-detail">
                        <span className="detail-icon">
                          👨‍🎓
                        </span>

                        <div>
                          <small>
                            Submissions
                          </small>

                          <strong>
                            {exam.submissionCount}
                          </strong>
                        </div>
                      </div>

                    </div>


                    {/* Submission Progress */}

                    <div className="submission-progress">

                      <div className="progress-header">

                        <span>
                          Student submissions
                        </span>

                        <strong>
                          {exam.submissionCount}
                        </strong>

                      </div>

                      <div className="progress-bar">

                        <div
                          className="progress-fill"
                          style={{
                            width:
                              exam.submissionCount > 0
                                ? "100%"
                                : "0%",
                          }}
                        ></div>

                      </div>

                    </div>

                  </div>


                  {/* Card Footer */}

                  <div className="result-card-footer">

                    <div className="result-footer-info">

                      {exam.result_published ? (
                        <>
                          <span className="footer-check">
                            ✓
                          </span>

                          <span>
                            Results are visible
                            to students
                          </span>
                        </>
                      ) : exam.submissionCount > 0 ? (
                        <>
                          <span className="footer-clock">
                            ⏳
                          </span>

                          <span>
                            Answers require
                            evaluation
                          </span>
                        </>
                      ) : (
                        <>
                          <span>
                            ℹ
                          </span>

                          <span>
                            Waiting for submissions
                          </span>
                        </>
                      )}

                    </div>


                    <button
                      className="view-results-button"
                      onClick={() =>
                        handleViewResults(
                          exam.id
                        )
                      }
                    >
                      {exam.result_published
                        ? "View Results"
                        : "Check Submissions"}

                      <span>→</span>
                    </button>

                  </div>

                </article>
              );
            })}

          </div>

        )}

      </section>

    </main>
  );
}