"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import "./submissions.css";

const API = "http://127.0.0.1:8000";

export default function ExaminerSubmissions() {
  const params = useParams();
  const router = useRouter();

  const examId = params.examId;

  const [exam, setExam] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (examId) {
      loadSubmissions();
    }
  }, [examId]);

  async function loadSubmissions() {
    try {
      setLoading(true);
      setError("");

      const token =
        localStorage.getItem("access_token");

      const role =
        localStorage.getItem("role");

      if (!token || role !== "examiner") {
        router.push("/login");
        return;
      }

      const response = await fetch(
        `${API}/exams/${examId}/submissions`,
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
            "Failed to load submissions."
        );
      }

      setExam(data);
      setSubmissions(data.submissions || []);

    } catch (err) {
      console.error(err);
      setError(err.message);

    } finally {
      setLoading(false);
    }
  }

  async function publishResults() {
    if (!exam) return;

    if (submissions.length === 0) {
      alert(
        "No student has submitted this examination yet."
      );
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to publish the results?\n\nStudents will be able to see their final marks after publication."
    );

    if (!confirmed) {
      return;
    }

    try {
      setPublishing(true);
      setError("");

      const token =
        localStorage.getItem("access_token");

      const response = await fetch(
        `${API}/exams/${examId}/publish-result`,
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
            "Unable to publish results."
        );
      }

      setExam((previous) => ({
        ...previous,
        result_published: true,
      }));

      alert(
        "Results published successfully."
      );

      await loadSubmissions();

    } catch (err) {
      console.error(err);
      setError(err.message);

    } finally {
      setPublishing(false);
    }
  }

  if (loading) {
    return (
      <main className="submissions-loading">
        <div>
          <div className="submissions-spinner"></div>
          <p>Loading submissions...</p>
        </div>
      </main>
    );
  }

  if (error && !exam) {
    return (
      <main className="submissions-page">

        <div className="submissions-error-page">

          <div className="submissions-error-icon">
            !
          </div>

          <h2>
            Unable to Load Submissions
          </h2>

          <p>
            {error}
          </p>

          <button
            className="submissions-primary-button"
            onClick={() => router.back()}
          >
            ← Back
          </button>

        </div>

      </main>
    );
  }

  return (
    <main className="submissions-page">

      {/* Header */}

      <section className="submissions-header">

        <button
          className="submissions-back"
          onClick={() => router.back()}
        >
          ← Back
        </button>

        <div className="submissions-heading">

          <div>

            <p className="submissions-label">
              EXAMINATION SUBMISSIONS
            </p>

            <h1>
              {exam?.exam_name}
            </h1>

            <p>
              Subject: {exam?.subject}
            </p>

            <div className="exam-meta">

              <span>
                Maximum Marks:{" "}
                <strong>
                  {exam?.maximum_marks}
                </strong>
              </span>

              <span>
                Submissions:{" "}
                <strong>
                  {submissions.length}
                </strong>
              </span>

            </div>

          </div>

          <button
            className="publish-results-button"
            onClick={publishResults}
            disabled={
              publishing ||
              exam?.result_published ||
              submissions.length === 0
            }
          >
            {exam?.result_published
              ? "✓ Results Published"
              : publishing
                ? "Publishing..."
                : "Publish Results"}
          </button>

        </div>

      </section>


      {/* Error */}

      {error && (
        <div className="submissions-error">
          <strong>
            Unable to publish results:
          </strong>

          <span>
            {error}
          </span>
        </div>
      )}


      {/* Published message */}

      {exam?.result_published && (
        <div className="submissions-success">

          <div className="success-icon">
            ✓
          </div>

          <div>
            <strong>
              Results Published
            </strong>

            <p>
              Students can now view their final
              examination results.
            </p>
          </div>

        </div>
      )}


      {/* No submissions */}

      {submissions.length === 0 ? (

        <section className="submissions-empty">

          <div className="submissions-empty-icon">
            📋
          </div>

          <h3>
            No Students Have Submitted
          </h3>

          <p>
            Student submissions will appear here
            after they complete the examination.
          </p>

        </section>

      ) : (

        <section className="submissions-table-card">

          <div className="table-top">

            <div>
              <h2>
                Student Submissions
              </h2>

              <p>
                Review each student's answers
                and assign marks where required.
              </p>
            </div>

            <span className="submission-count">
              {submissions.length}{" "}
              {submissions.length === 1
                ? "Submission"
                : "Submissions"}
            </span>

          </div>

          <div className="submissions-table-wrapper">

            <table className="submissions-table">

              <thead>
                <tr>

                  <th>
                    Student
                  </th>

                  <th>
                    Email
                  </th>

                  <th>
                    Submitted At
                  </th>

                  <th>
                    Score
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Action
                  </th>

                </tr>
              </thead>

              <tbody>

                {submissions.map(
                  (submission) => (
                    <tr
                      key={
                        submission.attempt_id
                      }
                    >

                      <td>
                        <div className="student-cell">

                          <div className="student-avatar">
                            {submission.student_name
                              ?.charAt(0)
                              ?.toUpperCase() || "S"}
                          </div>

                          <div>
                            <strong className="student-name">
                              {submission.student_name}
                            </strong>
                          </div>

                        </div>
                      </td>

                      <td>
                        <span className="student-email">
                          {submission.student_email}
                        </span>
                      </td>

                      <td>
                        <span className="submitted-time">
                          {submission.submitted_at
                            ? new Date(
                                submission.submitted_at
                              ).toLocaleString()
                            : "-"}
                        </span>
                      </td>

                      <td>
                        <strong className="submission-score">
                          {submission.score || 0}
                          {" / "}
                          {submission.maximum_marks}
                        </strong>
                      </td>

                      <td>
                        <span className="submission-status">
                          {submission.status}
                        </span>
                      </td>

                      <td>

                        <button
                          className="check-answers-button"
                          onClick={() =>
                            router.push(
                              `/examiner/submissions/${examId}/${submission.attempt_id}`
                            )
                          }
                        >
                          Check Answers
                          <span>→</span>
                        </button>

                      </td>

                    </tr>
                  )
                )}

              </tbody>

            </table>

          </div>

        </section>

      )}


    </main>
  );
}