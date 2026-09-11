"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./exams.css";

export default function ExamsPage() {
  const router = useRouter();

  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadExams();
  }, []);

  const loadExams = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("access_token");

      if (!token) {
        router.push("/login");
        return;
      }

      const response = await fetch(
        "http://127.0.0.1:8000/exams/my-exams",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Unable to load examinations");
      }

      const data = await response.json();
      setExams(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("Unable to load examinations. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getExamStatus = (exam) => {
    const now = new Date();

    const start = exam.start_time
      ? new Date(exam.start_time)
      : null;

    const end = exam.end_time
      ? new Date(exam.end_time)
      : null;

    if (start && now < start) {
      return {
        label: "Scheduled",
        className: "status-scheduled",
      };
    }

    if (start && end && now >= start && now <= end) {
      return {
        label: "Active",
        className: "status-active",
      };
    }

    if (end && now > end) {
      return {
        label: "Completed",
        className: "status-completed",
      };
    }

    return {
      label: "Draft",
      className: "status-draft",
    };
  };

  const formatDate = (date) => {
    if (!date) return "Not set";

    return new Date(date).toLocaleString([], {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <main className="exams-page">
      <header className="exams-header">
        <div>
          <button
            className="back-button"
            onClick={() => router.push("/examiner")}
          >
            ← Dashboard
          </button>

          <h1>Examinations</h1>
          <p>
            View and manage all examinations created by you.
          </p>
        </div>

        <button
          className="create-exam-button"
          onClick={() => router.push("/examiner/create-exam")}
        >
          + Create Examination
        </button>
      </header>

      <section className="exams-content">
        {loading && (
          <div className="state-card">
            <div className="loading-spinner"></div>
            <h3>Loading examinations...</h3>
            <p>Please wait while we fetch your examinations.</p>
          </div>
        )}

        {!loading && error && (
          <div className="state-card error-card">
            <div className="state-icon">!</div>
            <h3>Something went wrong</h3>
            <p>{error}</p>

            <button
              className="retry-button"
              onClick={loadExams}
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && exams.length === 0 && (
          <div className="state-card">
            <div className="state-icon">📝</div>
            <h3>No examinations yet</h3>
            <p>
              Create your first examination to start building
              your question paper.
            </p>

            <button
              className="retry-button"
              onClick={() =>
                router.push("/examiner/create-exam")
              }
            >
              Create Examination
            </button>
          </div>
        )}

        {!loading && !error && exams.length > 0 && (
          <div className="exam-grid">
            {exams.map((exam) => {
              const status = getExamStatus(exam);

              return (
                <article className="exam-card" key={exam.id}>
                  <div className="exam-card-top">
                    <div className="exam-icon">📝</div>

                    <span
                      className={`exam-status ${status.className}`}
                    >
                      {status.label}
                    </span>
                  </div>

                  <h2>{exam.exam_name}</h2>

                  <div className="exam-subject">
                    {exam.subject}
                  </div>

                  <div className="exam-details">
                    <div className="detail-item">
                      <span className="detail-label">
                        Duration
                      </span>
                      <strong>
                        {exam.duration_minutes} minutes
                      </strong>
                    </div>

                    <div className="detail-item">
                      <span className="detail-label">
                        Questions
                      </span>
                      <strong>
                        {exam.total_questions}
                      </strong>
                    </div>

                    <div className="detail-item">
                      <span className="detail-label">
                        Maximum Marks
                      </span>
                      <strong>
                        {exam.maximum_marks}
                      </strong>
                    </div>
                  </div>

                  <div className="exam-schedule">
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

                  <div className="exam-actions">

  <button
    className="manage-button"
    onClick={() =>
      router.push(
        `/examiner/questions?exam=${exam.id}`
      )
    }
  >
    Manage Questions
  </button>

  <button
    className="paper-button"
    onClick={() =>
      router.push(
        `/examiner/exams/${exam.id}/question-paper`
      )
    }
  >
    📄 View Question Paper
  </button>

  <button
    className="details-button"
    onClick={() =>
      alert(
        `Exam: ${exam.exam_name}\nSubject: ${exam.subject}`
      )
    }
  >
    View Details
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