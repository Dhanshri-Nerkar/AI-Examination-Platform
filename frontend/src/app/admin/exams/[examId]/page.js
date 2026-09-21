"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import "./exam-details.css";

const API_URL = "http://127.0.0.1:8000";

export default function AdminExamDetails() {
  const router = useRouter();
  const params = useParams();

  const examId = params.examId;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ============================================================
  // TOKEN
  // ============================================================

  const getToken = () => {
    return localStorage.getItem("access_token");
  };

  // ============================================================
  // LOAD EXAM DETAILS
  // ============================================================

  const loadExamDetails = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();

      if (!token) {
        setError("Admin login required.");
        return;
      }

      const response = await fetch(
        `${API_URL}/admin/exams/${examId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.detail ||
            "Failed to load examination details."
        );
      }

      setData(result);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (examId) {
      loadExamDetails();
    }
  }, [examId]);

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
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <main className="exam-details-page">
        <div className="exam-details-loading">
          <div className="loading-spinner"></div>
          <p>Loading examination details...</p>
        </div>
      </main>
    );
  }

  // ============================================================
  // ERROR
  // ============================================================

  if (error || !data) {
    return (
      <main className="exam-details-page">
        <div className="exam-details-container">

          <button
            className="back-button"
            onClick={() =>
              router.push("/admin/exams")
            }
          >
            ← Back to Examinations
          </button>

          <div className="details-error">

            <div className="error-icon">
              !
            </div>

            <h2>
              Unable to load examination
            </h2>

            <p>
              {error ||
                "Examination details not found."}
            </p>

            <button
              className="retry-button"
              onClick={loadExamDetails}
            >
              Try Again
            </button>

          </div>

        </div>
      </main>
    );
  }

  const {
    exam,
    examiner,
    attempts,
    questions
  } = data;

  return (
    <main className="exam-details-page">

      <div className="exam-details-container">

        {/* ======================================================
            HEADER
        ====================================================== */}

        <header className="exam-details-header">

          <div>

            <p className="details-eyebrow">
              EXAMINATION DETAILS
            </p>

            <h1>
              {exam.exam_name}
            </h1>

            <p className="details-subtitle">
              {exam.subject}
            </p>

          </div>

          <div className="header-status">

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

        </header>


        {/* ======================================================
            EXAM OVERVIEW
        ====================================================== */}

        <section className="details-section">

          <div className="admin-details-heading">

            <div>

              <p className="section-eyebrow">
                OVERVIEW
              </p>

              <h2>
                Examination Information
              </h2>

            </div>

          </div>

          <div className="info-grid">

            <div className="info-card">

              <span className="info-label">
                Subject
              </span>

              <strong>
                {exam.subject}
              </strong>

            </div>


            <div className="info-card">

              <span className="info-label">
                Duration
              </span>

              <strong>
                {exam.duration_minutes} minutes
              </strong>

            </div>


            <div className="info-card">

              <span className="info-label">
                Total Questions
              </span>

              <strong>
                {exam.total_questions}
              </strong>

            </div>


            <div className="info-card">

              <span className="info-label">
                Maximum Marks
              </span>

              <strong>
                {exam.maximum_marks}
              </strong>

            </div>

          </div>

        </section>


        {/* ======================================================
            SCHEDULE
        ====================================================== */}

        <section className="details-section">

          <div className="admin-details-heading">

            <div>

              <p className="section-eyebrow">
                SCHEDULE
              </p>

              <h2>
                Examination Schedule
              </h2>

            </div>

          </div>

          <div className="schedule-grid">

            <div className="schedule-card">

              <div className="schedule-icon">
                ▶
              </div>

              <div>

                <span>
                  Start Time
                </span>

                <strong>
                  {formatDate(exam.start_time)}
                </strong>

              </div>

            </div>


            <div className="schedule-card">

              <div className="schedule-icon">
                ■
              </div>

              <div>

                <span>
                  End Time
                </span>

                <strong>
                  {formatDate(exam.end_time)}
                </strong>

              </div>

            </div>


            <div className="schedule-card">

              <div className="schedule-icon">
                +
              </div>

              <div>

                <span>
                  Created On
                </span>

                <strong>
                  {formatDate(exam.created_at)}
                </strong>

              </div>

            </div>

          </div>

        </section>


        {/* ======================================================
            EXAMINER
        ====================================================== */}

        <section className="details-section">

          <div className="admin-details-heading">

            <div>

              <p className="section-eyebrow">
                EXAMINER
              </p>

              <h2>
                Examination Created By
              </h2>

            </div>

          </div>

          <div className="examiner-detail-card">

            <div className="examiner-detail-avatar">
              {examiner.name
                ?.charAt(0)
                ?.toUpperCase()}
            </div>

            <div className="examiner-detail-info">

              <strong>
                {examiner.name}
              </strong>

              <span>
                {examiner.email}
              </span>

            </div>

          </div>

        </section>


        {/* ======================================================
            ATTEMPT STATISTICS
        ====================================================== */}

        <section className="details-section">

          <div className="admin-details-heading">

            <div>

              <p className="section-eyebrow">
                PARTICIPATION
              </p>

              <h2>
                Attempt Statistics
              </h2>

            </div>

          </div>

          <div className="attempt-stats">

            <div className="attempt-stat-card">

              <span className="attempt-stat-label">
                Total Attempts
              </span>

              <strong>
                {attempts.total}
              </strong>

            </div>


            <div className="attempt-stat-card">

              <span className="attempt-stat-label">
                Submitted
              </span>

              <strong>
                {attempts.submitted}
              </strong>

            </div>


            <div className="attempt-stat-card">

              <span className="attempt-stat-label">
                In Progress
              </span>

              <strong>
                {attempts.in_progress}
              </strong>

            </div>

          </div>

        </section>


        {/* ======================================================
            STUDENT ATTEMPTS
        ====================================================== */}

        <section className="details-section">

          <div className="admin-details-heading">

            <div>

              <p className="section-eyebrow">
                STUDENT ACTIVITY
              </p>

              <h2>
                Student Attempts
              </h2>

            </div>

            <span className="question-count">
              {attempts.students?.length || 0} attempts
            </span>

          </div>


          {!attempts.students ||
          attempts.students.length === 0 ? (

            <div className="no-questions">

              <div className="no-questions-icon">
                👤
              </div>

              <h3>
                No student attempts
              </h3>

              <p>
                No students have attempted this
                examination yet.
              </p>

            </div>

          ) : (

            <div className="attempts-table-wrapper">

              <table className="attempts-table">

                <thead>

                  <tr>
                    <th>STUDENT</th>
                    <th>STARTED</th>
                    <th>SUBMITTED</th>
                    <th>STATUS</th>
                    <th>SCORE</th>
                    <th>ACTION</th>
                  </tr>

                </thead>

                <tbody>

                  {attempts.students.map((attempt) => (

                    <tr
                      key={attempt.id}
                      className="attempt-row"
                      onClick={() =>
                        router.push(
                          `/admin/exams/${examId}/attempts/${attempt.id}`
                        )
                      }
                    >

                      <td>

                        <div className="student-attempt-cell">

                          <div className="student-attempt-avatar">
                            {attempt.student_name
                              ?.charAt(0)
                              ?.toUpperCase()}
                          </div>

                          <div>

                            <strong>
                              {attempt.student_name}
                            </strong>

                            <span>
                              {attempt.student_email}
                            </span>

                          </div>

                        </div>

                      </td>


                      <td>
                        {formatDate(
                          attempt.started_at
                        )}
                      </td>


                      <td>
                        {attempt.submitted_at
                          ? formatDate(
                              attempt.submitted_at
                            )
                          : "-"}
                      </td>


                      <td>

                        <span
                          className={
                            attempt.status ===
                            "submitted"
                              ? "attempt-status submitted"
                              : "attempt-status progress"
                          }
                        >
                          {attempt.status ===
                          "submitted"
                            ? "Submitted"
                            : "In Progress"}
                        </span>

                      </td>


                      <td>

                        <strong className="attempt-score">
                          {attempt.score}
                          {" / "}
                          {exam.maximum_marks}
                        </strong>

                      </td>


                      <td>

                        <button
                          className="view-attempt-button"
                          onClick={(e) => {
                            e.stopPropagation();

                            router.push(
                              `/admin/exams/${examId}/attempts/${attempt.id}`
                            );
                          }}
                        >
                          View Attempt
                        </button>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </section>


        {/* ======================================================
            QUESTIONS
        ====================================================== */}

        <section className="details-section">

          <div className="admin-details-heading">

            <div>

              <p className="section-eyebrow">
                QUESTION PAPER
              </p>

              <h2>
                Examination Questions
              </h2>

            </div>

            <span className="question-count">
              {questions.length} questions
            </span>

          </div>


          {questions.length === 0 ? (

            <div className="no-questions">

              <div className="no-questions-icon">
                ?
              </div>

              <h3>
                No questions assigned
              </h3>

              <p>
                No questions have been assigned
                to this examination yet.
              </p>

            </div>

          ) : (

            <div className="questions-list">

              {questions.map((question) => (

                <div
                  className="question-card"
                  key={question.id}
                >

                  <div className="question-number">
                    {question.question_order}
                  </div>

                  <div className="question-content">

                    <div className="question-meta">

                      <span>
                        {question.question_type}
                      </span>

                      <span>
                        {question.difficulty}
                      </span>

                      <span>
                        {question.marks} marks
                      </span>

                    </div>

                    <h3>
                      {question.question_text}
                    </h3>

                    {(question.option_a ||
                      question.option_b ||
                      question.option_c ||
                      question.option_d) && (

                      <div className="question-options">

                        {question.option_a && (
                          <div>
                            <b>A</b>
                            <span>
                              {question.option_a}
                            </span>
                          </div>
                        )}

                        {question.option_b && (
                          <div>
                            <b>B</b>
                            <span>
                              {question.option_b}
                            </span>
                          </div>
                        )}

                        {question.option_c && (
                          <div>
                            <b>C</b>
                            <span>
                              {question.option_c}
                            </span>
                          </div>
                        )}

                        {question.option_d && (
                          <div>
                            <b>D</b>
                            <span>
                              {question.option_d}
                            </span>
                          </div>
                        )}

                      </div>

                    )}

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