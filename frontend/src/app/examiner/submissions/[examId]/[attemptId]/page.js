"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import "./submission-detail.css";

const API = "http://127.0.0.1:8000";

export default function ExaminerSubmissionDetail() {
  const params = useParams();
  const router = useRouter();

  const examId = params.examId;
  const attemptId = params.attemptId;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingQuestion, setSavingQuestion] =
    useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (examId && attemptId) {
      loadSubmission();
    }
  }, [examId, attemptId]);

  async function loadSubmission() {
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
        `${API}/exams/${examId}/submissions/${attemptId}`,
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
            "Unable to load submission."
        );
      }

      setData(result);

    } catch (err) {
      console.error(err);
      setError(err.message);

    } finally {
      setLoading(false);
    }
  }

  async function saveMarks(
    questionId,
    marks,
    maximumMarks
  ) {
    const numericMarks =
      Number(marks);

    if (
      Number.isNaN(numericMarks) ||
      numericMarks < 0 ||
      numericMarks > maximumMarks
    ) {
      alert(
        `Marks must be between 0 and ${maximumMarks}.`
      );
      return;
    }

    try {
      setSavingQuestion(questionId);
      setError("");

      const token =
        localStorage.getItem("access_token");

      const response = await fetch(
        `${API}/exams/${examId}/submissions/${attemptId}/answers/${questionId}?marks_awarded=${numericMarks}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.detail ||
            "Unable to save marks."
        );
      }

      /*
       * Reload the complete submission so that
       * the score and answer status stay accurate.
       */
      await loadSubmission();

      alert("Marks saved successfully.");

    } catch (err) {
      console.error(err);
      setError(err.message);

    } finally {
      setSavingQuestion(null);
    }
  }

  if (loading) {
    return (
      <main className="submission-detail-page">
        <div className="submission-detail-loading">
          <h2>
            Loading submission...
          </h2>

          <p>
            Please wait while the student's answers
            are loaded.
          </p>
        </div>
      </main>
    );
  }

  if (error && !data) {
    return (
      <main className="submission-detail-page">
        <div className="submission-detail-error">

          <h2>
            Unable to load submission
          </h2>

          <p>
            {error}
          </p>

          <button
            onClick={() =>
              router.push(
                `/examiner/submissions/${examId}`
              )
            }
          >
            ← Back to Submissions
          </button>

        </div>
      </main>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <main className="submission-detail-page">

      {/* Header */}

      <section className="submission-detail-header">

        <button
          className="back-button"
          onClick={() =>
            router.push(
              `/examiner/submissions/${examId}`
            )
          }
        >
          ← Back to Submissions
        </button>

        <div className="submission-heading">

          <div>
            <p className="page-label">
              STUDENT SUBMISSION
            </p>

            <h1>
              {data.exam_name}
            </h1>

            <p>
              {data.subject}
            </p>
          </div>

          <div className="student-summary">

            <strong>
              {data.student_name}
            </strong>

            <span>
              {data.student_email}
            </span>

          </div>

        </div>

      </section>


      {/* Score Summary */}

      <section className="submission-score-card">

        <div>
          <span>
            Current Score
          </span>

          <strong>
            {data.score || 0} /{" "}
            {data.maximum_marks}
          </strong>
        </div>

        <div>
          <span>
            Status
          </span>

          <strong>
            {data.status}
          </strong>
        </div>

        <div>
          <span>
            Submitted
          </span>

          <strong>
            {data.submitted_at
              ? new Date(
                  data.submitted_at
                ).toLocaleString()
              : "-"}
          </strong>
        </div>

      </section>


      {/* Error */}

      {error && (
        <div className="submission-error">
          {error}
        </div>
      )}


      {/* Questions */}

      <section className="submission-questions">

        <div className="questions-heading">

          <h2>
            Answer Review
          </h2>

          <p>
            Review the student's answers and assign
            marks where manual evaluation is required.
          </p>

        </div>


        {data.questions?.map(
          (question, index) => {

            const isManual =
              question.needs_manual_check;

            return (
              <QuestionCard
                key={question.question_id}
                question={question}
                index={index}
                isManual={isManual}
                saving={
                  savingQuestion ===
                  question.question_id
                }
                onSave={saveMarks}
              />
            );
          }
        )}

      </section>


      {/* Bottom */}

      <div className="submission-bottom">

        <button
          className="back-button"
          onClick={() =>
            router.push(
              `/examiner/submissions/${examId}`
            )
          }
        >
          ← Back to All Submissions
        </button>

      </div>

    </main>
  );
}


/* =====================================================
   Question Card
===================================================== */

function QuestionCard({
  question,
  index,
  isManual,
  saving,
  onSave,
}) {
  const [marks, setMarks] = useState(
    question.marks_awarded ?? 0
  );

  useEffect(() => {
    setMarks(
      question.marks_awarded ?? 0
    );
  }, [question.marks_awarded]);

  return (
    <article className="answer-card">

      {/* Question Header */}

      <div className="answer-card-header">

        <div>

          <span className="question-number">
            Question {index + 1}
          </span>

          <span className="question-type">
            {question.question_type}
          </span>

        </div>

        <span className="question-marks">
          Maximum: {question.maximum_marks}
        </span>

      </div>


      {/* Question */}

      <div className="question-text">
        {question.question_text}
      </div>


      {/* Student Answer */}

      <div className="answer-section">

        <span className="answer-label">
          Student Answer
        </span>

        <div className="student-answer">
          {question.student_answer
            ? question.student_answer
            : "No answer submitted"}
        </div>

      </div>


      {/* Objective Answer */}

      {!isManual && (
        <div className="automatic-review">

          <div className="review-row">

            <span>
              Correct Answer
            </span>

            <strong>
              {question.correct_answer}
            </strong>

          </div>

          <div className="review-row">

            <span>
              Result
            </span>

            <strong
              className={
                question.is_correct
                  ? "correct-text"
                  : "wrong-text"
              }
            >
              {question.is_correct
                ? "Correct"
                : "Incorrect"}
            </strong>

          </div>

          <div className="review-row">

            <span>
              Marks Awarded
            </span>

            <strong>
              {question.marks_awarded || 0} /{" "}
              {question.maximum_marks}
            </strong>

          </div>

        </div>
      )}


      {/* Manual Evaluation */}

      {isManual && (
        <div className="manual-review">

          <div className="manual-review-header">

            <div>

              <strong>
                Manual Evaluation Required
              </strong>

              <p>
                Assign marks based on the student's
                answer.
              </p>

            </div>

            <span>
              Max {question.maximum_marks}
            </span>

          </div>

          <div className="marks-editor">

            <label>
              Marks Awarded
            </label>

            <div className="marks-input-row">

              <input
                type="number"
                min="0"
                max={question.maximum_marks}
                value={marks}
                onChange={(event) =>
                  setMarks(
                    event.target.value
                  )
                }
              />

              <span>
                / {question.maximum_marks}
              </span>

              <button
                onClick={() =>
                  onSave(
                    question.question_id,
                    marks,
                    question.maximum_marks
                  )
                }
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : "Save Marks"}
              </button>

            </div>

          </div>

        </div>
      )}

    </article>
  );
}
