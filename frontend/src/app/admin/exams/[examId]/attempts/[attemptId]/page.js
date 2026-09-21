"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import "./attempt-details.css";

const API_URL = "http://127.0.0.1:8000";

export default function AdminAttemptDetails() {
  const router = useRouter();
  const params = useParams();

  const examId = params.examId;
  const attemptId = params.attemptId;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getToken = () => {
    return localStorage.getItem("access_token");
  };

  const loadAttemptDetails = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();

      if (!token) {
        setError("Admin login required.");
        return;
      }

      const response = await fetch(
        `${API_URL}/admin/exams/${examId}/attempts/${attemptId}`,
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
            "Failed to load attempt details."
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
    if (examId && attemptId) {
      loadAttemptDetails();
    }
  }, [examId, attemptId]);

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

  if (loading) {
    return (
      <main className="attempt-details-page">
        <div className="attempt-loading">
          <div className="loading-spinner"></div>
          <p>Loading attempt details...</p>
        </div>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="attempt-details-page">
        <div className="attempt-container">

          <button
            className="back-button"
            onClick={() =>
              router.push(
                `/admin/exams/${examId}`
              )
            }
          >
            ← Back to Examination
          </button>

          <div className="attempt-error">

            <div className="error-icon">
              !
            </div>

            <h2>
              Unable to load attempt
            </h2>

            <p>
              {error || "Attempt not found."}
            </p>

            <button
              className="retry-button"
              onClick={loadAttemptDetails}
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
    student,
    attempt,
    questions
  } = data;

  const correctCount = questions.filter(
    (question) =>
      question.is_correct === true
  ).length;

  const answeredCount = questions.filter(
    (question) =>
      question.selected_answer !== null &&
      question.selected_answer !== ""
  ).length;

  const unansweredCount =
    questions.length - answeredCount;

  return (
    <main className="attempt-details-page">

      <div className="attempt-container">

        {/* HEADER */}

        <header className="attempt-header">

          <div>

            <button
              className="back-button"
              onClick={() =>
                router.push(
                  `/admin/exams/${examId}`
                )
              }
            >
              ← Back to Examination
            </button>

            <p className="attempt-eyebrow">
              STUDENT ATTEMPT
            </p>

            <h1>
              {student.name}
            </h1>

            <p className="attempt-subtitle">
              {exam.exam_name} · {exam.subject}
            </p>

          </div>

          <span
            className={
              attempt.status === "submitted"
                ? "attempt-status submitted"
                : "attempt-status progress"
            }
          >
            {attempt.status === "submitted"
              ? "Submitted"
              : "In Progress"}
          </span>

        </header>


        {/* STUDENT + ATTEMPT */}

        <section className="attempt-section">

          <div className="student-profile">

            <div className="large-student-avatar">
              {student.name
                ?.charAt(0)
                ?.toUpperCase()}
            </div>

            <div>

              <h2>
                {student.name}
              </h2>

              <p>
                {student.email}
              </p>

            </div>

          </div>


          <div className="attempt-info-grid">

            <div>
              <span>
                Started
              </span>

              <strong>
                {formatDate(
                  attempt.started_at
                )}
              </strong>
            </div>

            <div>
              <span>
                Submitted
              </span>

              <strong>
                {formatDate(
                  attempt.submitted_at
                )}
              </strong>
            </div>

            <div>
              <span>
                Score
              </span>

              <strong>
                {attempt.score}
                {" / "}
                {exam.maximum_marks}
              </strong>
            </div>

          </div>

        </section>


        {/* STATISTICS */}

        <section className="attempt-section">

          <div className="attempt-section-title">

            <p>
              PERFORMANCE
            </p>

            <h2>
              Attempt Summary
            </h2>

          </div>

          <div className="attempt-summary-grid">

            <div className="summary-box">

              <span>
                Total Questions
              </span>

              <strong>
                {questions.length}
              </strong>

            </div>

            <div className="summary-box">

              <span>
                Answered
              </span>

              <strong>
                {answeredCount}
              </strong>

            </div>

            <div className="summary-box">

              <span>
                Correct
              </span>

              <strong>
                {correctCount}
              </strong>

            </div>

            <div className="summary-box">

              <span>
                Unanswered
              </span>

              <strong>
                {unansweredCount}
              </strong>

            </div>

          </div>

        </section>


        {/* ANSWERS */}

        <section className="attempt-section">

          <div className="attempt-section-title">

            <p>
              ANSWER REVIEW
            </p>

            <h2>
              Question-wise Responses
            </h2>

          </div>


          <div className="answer-list">

            {questions.map((question) => {

              const unanswered =
                question.selected_answer === null ||
                question.selected_answer === "";

              return (
                <div
                  className="answer-card"
                  key={question.question_id}
                >

                  <div className="answer-card-header">

                    <div className="question-number">
                      {question.question_order}
                    </div>

                    <div className="question-review-meta">

                      <span>
                        {question.question_type}
                      </span>

                      <span>
                        {question.marks} marks
                      </span>

                    </div>

                    <div>

                      {unanswered ? (
                        <span className="answer-badge unanswered">
                          Unanswered
                        </span>
                      ) : question.is_correct ? (
                        <span className="answer-badge correct">
                          Correct
                        </span>
                      ) : (
                        <span className="answer-badge incorrect">
                          Incorrect
                        </span>
                      )}

                    </div>

                  </div>


                  <h3>
                    {question.question_text}
                  </h3>


                  <div className="review-options">

                    {[
                      ["A", question.option_a],
                      ["B", question.option_b],
                      ["C", question.option_c],
                      ["D", question.option_d],
                    ].map(([label, value]) => {

                      if (!value) return null;

                      const selected =
                        question.selected_answer === value;

                      const correct =
                        question.correct_answer === value;

                      return (
                        <div
                          key={label}
                          className={[
                            "review-option",
                            selected
                              ? "selected-option"
                              : "",
                            correct
                              ? "correct-option"
                              : "",
                          ].join(" ")}
                        >

                          <b>
                            {label}
                          </b>

                          <span>
                            {value}
                          </span>

                          {selected && (
                            <small>
                              Student Answer
                            </small>
                          )}

                          {correct && (
                            <small>
                              Correct Answer
                            </small>
                          )}

                        </div>
                      );

                    })}

                  </div>


                  <div className="answer-result">

                    <span>
                      Correct Answer:
                      <strong>
                        {" "}
                        {question.correct_answer}
                      </strong>
                    </span>

                    <span>
                      Marks Awarded:
                      <strong>
                        {" "}
                        {question.marks_awarded}
                        {" / "}
                        {question.marks}
                      </strong>
                    </span>

                  </div>

                </div>
              );
            })}

          </div>

        </section>

      </div>

    </main>
  );
}