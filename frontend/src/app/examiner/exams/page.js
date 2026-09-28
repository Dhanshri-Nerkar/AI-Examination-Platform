"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./exams.css";

export default function ExamsPage() {
  const router = useRouter();

  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [publishingExamId, setPublishingExamId] =
    useState(null);

  useEffect(() => {
    loadExams();
  }, []);

  // ============================================================
  // LOAD EXAMINATIONS
  // ============================================================

  const loadExams = async () => {
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
        "http://127.0.0.1:8000/exams/my-exams",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
            "Unable to load examinations."
        );
      }

      setExams(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (err) {
      console.error(err);

      setError(
        err.message ||
          "Unable to load examinations. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // EXAM STATUS
  // ============================================================

  const getExamStatus = (exam) => {
    const now = new Date();

    const start = exam.start_time
      ? new Date(exam.start_time)
      : null;

    const end = exam.end_time
      ? new Date(exam.end_time)
      : null;

    if (
      exam.is_published === false
    ) {
      return {
        label: "Draft",
        className: "status-draft",
      };
    }

    if (start && now < start) {
      return {
        label: "Scheduled",
        className: "status-scheduled",
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

  // ============================================================
  // DATE FORMAT
  // ============================================================

  const formatDate = (date) => {
    if (!date) {
      return "Not set";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Invalid date";
    }

    return parsedDate.toLocaleString([], {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  // ============================================================
  // PUBLISH / UNPUBLISH EXAM
  // ============================================================

  const handlePublishToggle = async (exam) => {
    const token =
      localStorage.getItem("access_token");

    if (!token) {
      router.push("/login");
      return;
    }

    const newPublishState =
      !Boolean(exam.is_published);

    const actionText = newPublishState
      ? "publish"
      : "unpublish";

    const confirmed = window.confirm(
      `Are you sure you want to ${actionText} "${exam.exam_name}"?`
    );

    if (!confirmed) {
      return;
    }

    setPublishingExamId(exam.id);

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/exams/${exam.id}/publish`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            is_published: newPublishState,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
            `Unable to ${actionText} examination.`
        );
      }

      setExams((currentExams) =>
        currentExams.map((item) =>
          item.id === exam.id
            ? {
                ...item,
                is_published:
                  newPublishState,
              }
            : item
        )
      );

      alert(
        newPublishState
          ? "Examination published successfully."
          : "Examination unpublished successfully."
      );
    } catch (err) {
      console.error(err);

      alert(
        err.message ||
          `Unable to ${actionText} examination.`
      );
    } finally {
      setPublishingExamId(null);
    }
  };

  // ============================================================
  // VIEW QUESTION PAPER
  // ============================================================

  const handleViewQuestionPaper = (exam) => {
    router.push(
      `/examiner/exams/${exam.id}/question-paper`
    );
  };

  // ============================================================
  // MANAGE QUESTIONS
  // ============================================================

  const handleManageQuestions = (exam) => {
    router.push(
      `/examiner/questions?exam=${exam.id}`
    );
  };

  // ============================================================
  // LOADING SCREEN
  // ============================================================

  if (loading) {
    return (
      <main className="exams-page">
        <section className="exams-content">
          <div className="state-card">
            <div className="loading-spinner"></div>

            <h3>
              Loading examinations...
            </h3>

            <p>
              Please wait while we fetch your
              examinations.
            </p>
          </div>
        </section>
      </main>
    );
  }

  // ============================================================
  // PAGE
  // ============================================================

  return (
    <main className="exams-page">

      {/* ======================================================
          HERO HEADER
      ====================================================== */}

      <section className="exams-hero">

        <div className="exams-hero-icon">📚</div>

        <div className="exams-hero-content">

          <p className="section-label">EXAMINER</p>

          <h1>Examinations</h1>

          <p>
            View, manage and prepare all
            examinations created by you.
          </p>

        </div>

        <button
          className="create-exam-button"
          onClick={() =>
            router.push(
              "/examiner/create-exam"
            )
          }
        >
          + Create Examination
        </button>

      </section>


      {/* ======================================================
          CONTENT
      ====================================================== */}

      <section className="exams-content">

        {/* ERROR */}

        {error && (
          <div className="state-card error-card">

            <div className="state-icon">
              !
            </div>

            <h3>
              Something went wrong
            </h3>

            <p>
              {error}
            </p>

            <button
              className="retry-button"
              onClick={loadExams}
            >
              Try Again
            </button>

          </div>
        )}


        {/* NO EXAMS */}

        {!error &&
          exams.length === 0 && (
            <div className="state-card">

              <div className="state-icon">
                📝
              </div>

              <h3>
                No examinations yet
              </h3>

              <p>
                Create your first examination
                to start building your
                question paper.
              </p>

              <button
                className="retry-button"
                onClick={() =>
                  router.push(
                    "/examiner/create-exam"
                  )
                }
              >
                Create Examination
              </button>

            </div>
          )}


        {/* EXAMS */}

        {!error &&
          exams.length > 0 && (
            <div className="exam-grid">

              {exams.map((exam) => {

                const status =
                  getExamStatus(exam);

                const isPublishing =
                  publishingExamId ===
                  exam.id;

                return (
                  <article
                    className="exam-card"
                    key={exam.id}
                  >

                    {/* CARD TOP */}

                    <div className="exam-card-top">

                      <div className="exam-icon">
                        📝
                      </div>

                      <span
                        className={`exam-status ${status.className}`}
                      >
                        {status.label}
                      </span>

                    </div>


                    {/* TITLE */}

                    <h2>
                      {exam.exam_name}
                    </h2>

                    <div className="exam-subject">
                      {exam.subject}
                    </div>


                    {/* DETAILS */}

                    <div className="exam-details">

                      <div className="detail-item">
                        <span className="detail-label">
                          Duration
                        </span>

                        <strong>
                          {exam.duration_minutes}{" "}
                          minutes
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


                    {/* SCHEDULE */}

                    <div className="exam-schedule">

                      <div>
                        <span>Starts</span>
                        <strong>
                          {formatDate(
                            exam.start_time
                          )}
                        </strong>
                      </div>


                      <div>
                        <span>Ends</span>
                        <strong>
                          {formatDate(
                            exam.end_time
                          )}
                        </strong>
                      </div>

                    </div>


                    {/* QUESTION PAPER QUICK ACTION */}

                    <div className="question-paper-highlight">

                      <div className="paper-highlight-icon">
                        📄
                      </div>

                      <div className="paper-highlight-content">

                        <strong>
                          Question Paper
                        </strong>

                        <span>
                          Preview the questions
                          students will receive.
                        </span>

                      </div>

                      <button
                        className="paper-button"
                        onClick={() =>
                          handleViewQuestionPaper(
                            exam
                          )
                        }
                      >
                        View Details →
                      </button>

                    </div>


                    {/* ACTIONS */}

                    <div className="exam-actions">

                      <button
                        className="manage-button"
                        onClick={() =>
                          handleManageQuestions(
                            exam
                          )
                        }
                      >
                        Manage Questions
                      </button>


                      <button
                        className={
                          exam.is_published
                            ? "unpublish-button"
                            : "publish-button"
                        }
                        onClick={() =>
                          handlePublishToggle(
                            exam
                          )
                        }
                        disabled={isPublishing}
                      >
                        {isPublishing
                          ? "Updating..."
                          : exam.is_published
                          ? "Unpublish"
                          : "Publish"}
                      </button>

                    </div>


                    {/* PUBLISHED STATUS */}

                    <div className="publication-status">

                      <span
                        className={
                          exam.is_published
                            ? "published-dot"
                            : "draft-dot"
                        }
                      >
                        ●
                      </span>

                      <span>
                        {exam.is_published
                          ? "Published — visible to students when the exam window opens"
                          : "Draft — not visible to students"}
                      </span>

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