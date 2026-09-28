"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import "./result.css";

export default function ExamResultPage() {
  const router = useRouter();
  const params = useParams();

  const examId = params.examId;

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");
  const [resultNotPublished, setResultNotPublished] =
    useState(false);
  const [resultUnavailable, setResultUnavailable] =
    useState(false);

  useEffect(() => {
    if (examId) {
      loadResult();
    }
  }, [examId]);

  async function loadResult() {
    try {
      const token =
        localStorage.getItem("access_token");

      const role =
        localStorage.getItem("role");

      if (!token || role !== "student") {
        router.push("/login");
        return;
      }

      const response = await fetch(
        `http://127.0.0.1:8000/exams/student/${examId}/result`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        }
      );

      const data = await response.json();

      /*
       * Result has not been published yet
       */
      if (response.status === 403) {
        setResultNotPublished(true);
        return;
      }

      /*
       * Student has not submitted the examination
       */
      if (response.status === 404) {
        setResultUnavailable(true);
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.detail ||
            "Unable to load examination result."
        );
      }

      setResult(data);
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  /*
   * Loading
   */
  if (loading) {
    return (
      <main className="result-loading">
        <div className="result-loading-card">
          <div className="loading-spinner"></div>

          <h2>
            Loading Result
          </h2>

          <p>
            Please wait while we load your examination result.
          </p>
        </div>
      </main>
    );
  }

  /*
   * Result not published
   */
  if (resultNotPublished) {
    return (
      <main className="result-page">

        <section className="result-card result-pending-card">

          <div className="result-icon pending-icon">
            ⏳
          </div>

          <p className="result-label">
            RESULT PENDING
          </p>

          <h1>
            Result Not Published Yet
          </h1>

          <p className="result-message">
            Your examination has been submitted successfully,
            but the final result has not been published by
            the examiner yet.
          </p>

          <div className="pending-info">

            <div className="pending-info-icon">
              📝
            </div>

            <div>
              <strong>
                Evaluation in Progress
              </strong>

              <p>
                The examiner may still be checking your
                descriptive answers and finalizing your marks.
              </p>
            </div>

          </div>

          <div className="pending-info">

            <div className="pending-info-icon">
              📊
            </div>

            <div>
              <strong>
                Check Back Later
              </strong>

              <p>
                Your final score will appear here once the
                examiner publishes the examination result.
              </p>
            </div>

          </div>

          <button
            className="dashboard-button"
            onClick={() =>
              router.push("/student")
            }
          >
            ← Back to Student Dashboard
          </button>

        </section>

      </main>
    );
  }

  /*
   * Result unavailable
   */
  if (resultUnavailable) {
    return (
      <main className="result-page">

        <section className="result-card result-pending-card">

          <div className="result-icon unavailable-icon">
            !
          </div>

          <p className="result-label">
            RESULT UNAVAILABLE
          </p>

          <h1>
            Examination Result Not Available
          </h1>

          <p className="result-message">
            A submitted examination attempt could not
            be found for this examination.
          </p>

          <div className="pending-info">

            <div className="pending-info-icon">
              ℹ
            </div>

            <div>
              <strong>
                No Submitted Attempt
              </strong>

              <p>
                Please return to your student dashboard
                to view your available examinations.
              </p>
            </div>

          </div>

          <button
            className="dashboard-button"
            onClick={() =>
              router.push("/student")
            }
          >
            ← Back to Student Dashboard
          </button>

        </section>

      </main>
    );
  }

  /*
   * Unexpected error
   */
  if (error) {
    return (
      <main className="result-loading">

        <div className="result-loading-card">

          <div className="error-icon">
            !
          </div>

          <h2>
            Unable to Load Result
          </h2>

          <p>
            {error}
          </p>

          <button
            onClick={() =>
              router.push("/student")
            }
          >
            ← Back to Student Dashboard
          </button>

        </div>

      </main>
    );
  }

  if (!result) {
    return null;
  }

  const percentage =
    result.maximum_marks > 0
      ? (
          (result.score /
            result.maximum_marks) *
          100
        ).toFixed(1)
      : "0.0";

  const passed =
    Number(percentage) >= 40;

  return (
    <main className="result-page">

      <section className="result-card">

        <div className="result-icon">
          {passed ? "✓" : "!"}
        </div>

        <p className="result-label">
          EXAMINATION RESULT
        </p>

        <h1>
          Your Examination Result
        </h1>

        <p className="result-message">
          Your examination has been successfully
          evaluated and the result has been published.
        </p>

        <div className="score-circle">

          <strong>
            {percentage}%
          </strong>

          <span>
            Score
          </span>

        </div>

        <div className="result-grid">

          <div>
            <span>Score</span>

            <strong>
              {result.score} /{" "}
              {result.maximum_marks}
            </strong>
          </div>

          <div>
            <span>Correct</span>

            <strong>
              {result.correct_answers}
            </strong>
          </div>

          <div>
            <span>Wrong</span>

            <strong>
              {result.wrong_answers}
            </strong>
          </div>

          <div>
            <span>Unanswered</span>

            <strong>
              {result.unanswered}
            </strong>
          </div>

        </div>

        <div
          className={
            passed
              ? "result-status passed"
              : "result-status failed"
          }
        >
          {passed
            ? "Passed"
            : "Needs Improvement"}
        </div>

        <button
          className="dashboard-button"
          onClick={() =>
            router.push("/student")
          }
        >
          ← Back to Student Dashboard
        </button>

      </section>

    </main>
  );
}