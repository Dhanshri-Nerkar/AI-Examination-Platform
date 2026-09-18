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

  if (loading) {
    return (
      <main className="result-loading">
        <p>Loading result...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="result-loading">
        <p>{error}</p>

        <button
          onClick={() =>
            router.push("/student")
          }
        >
          ← Back to Student Dashboard
        </button>
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
          EXAMINATION SUBMITTED
        </p>

        <h1>
          Your Examination Result
        </h1>

        <p className="result-message">
          Your examination has been successfully
          submitted and evaluated.
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