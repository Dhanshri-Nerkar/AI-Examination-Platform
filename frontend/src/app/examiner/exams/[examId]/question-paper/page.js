"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import "./question-paper.css";

const API = "http://127.0.0.1:8000";

export default function QuestionPaperPage() {
  const router = useRouter();
  const params = useParams();

  const examId = params.examId;

  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ============================================================
  // LOAD QUESTION PAPER
  // ============================================================

  useEffect(() => {
    if (!examId) {
      return;
    }

    loadQuestionPaper();
  }, [examId]);

  async function loadQuestionPaper() {
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

      // ========================================================
      // LOAD EXAMINATION DETAILS
      // ========================================================

      const examResponse = await fetch(
        `${API}/exams/my-exams`,
        {
          method: "GET",
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
          cache: "no-store",
        }
      );

      const examData =
        await examResponse.json();

      if (!examResponse.ok) {
        throw new Error(
          examData.detail ||
            "Unable to load examination."
        );
      }

      const exams = Array.isArray(examData)
        ? examData
        : [];

      const selectedExam =
        exams.find(
          (item) =>
            String(item.id) ===
            String(examId)
        );

      if (!selectedExam) {
        throw new Error(
          "Examination not found."
        );
      }

      setExam(selectedExam);

      // ========================================================
      // LOAD ASSIGNED QUESTIONS
      // ========================================================

      const questionResponse =
        await fetch(
          `${API}/exams/${examId}/questions`,
          {
            method: "GET",
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
            cache: "no-store",
          }
        );

      const questionData =
        await questionResponse.json();

      if (!questionResponse.ok) {
        throw new Error(
          questionData.detail ||
            "Unable to load question paper."
        );
      }

      console.log(
        "Question paper response:",
        questionData
      );

      // --------------------------------------------------------
      // Support different possible backend response formats
      // --------------------------------------------------------

      let assignedQuestions = [];

      if (Array.isArray(questionData)) {
        assignedQuestions = questionData;
      } else if (
        Array.isArray(questionData.questions)
      ) {
        assignedQuestions =
          questionData.questions;
      } else {
        assignedQuestions = [];
      }

      setQuestions(
        assignedQuestions
      );

    } catch (err) {
      console.error(
        "Question paper error:",
        err
      );

      setError(
        err.message ||
          "Unable to load the question paper."
      );
    } finally {
      setLoading(false);
    }
  }

  // ============================================================
  // DATE FORMAT
  // ============================================================

  function formatDate(date) {
    if (!date) {
      return "Not set";
    }

    return new Date(date).toLocaleString(
      [],
      {
        dateStyle: "medium",
        timeStyle: "short",
      }
    );
  }

  // ============================================================
  // PRINT
  // ============================================================

  function handlePrint() {
    window.print();
  }

  // ============================================================
  // QUESTION NORMALIZATION
  // ============================================================

  function getQuestionData(examQuestion) {
    /*
      Backend may return either:

      1. {
           id: 10,
           question: {
             question_text: "...",
             ...
           }
         }

      OR

      2. {
           id: 10,
           question_text: "...",
           question_type: "...",
           ...
         }

      Support both.
    */

    if (
      examQuestion &&
      examQuestion.question
    ) {
      return examQuestion.question;
    }

    return examQuestion;
  }

  // ============================================================
  // QUESTION TYPE
  // ============================================================

  function normalizeQuestionType(type) {
    return (type || "")
      .toString()
      .trim()
      .toLowerCase();
  }

  function isMCQ(type) {
    return normalizeQuestionType(type) ===
      "mcq";
  }

  function isTrueFalse(type) {
    const normalized =
      normalizeQuestionType(type);

    return [
      "true/false",
      "true false",
      "true_false",
      "true-false",
      "truefalse",
    ].includes(normalized);
  }

  function isShortAnswer(type) {
    const normalized =
      normalizeQuestionType(type);

    return [
      "short answer",
      "short response",
      "short",
    ].includes(normalized);
  }

  function isLongAnswer(type) {
    const normalized =
      normalizeQuestionType(type);

    return [
      "long answer",
      "long response",
      "essay",
      "long",
    ].includes(normalized);
  }

  // ============================================================
  // LOADING STATE
  // ============================================================

  if (loading) {
    return (
      <main className="paper-page">

        <div className="paper-state">

          <div className="paper-spinner"></div>

          <h2>
            Loading question paper...
          </h2>

          <p>
            Please wait while we prepare
            the examination paper.
          </p>

        </div>

      </main>
    );
  }

  // ============================================================
  // ERROR STATE
  // ============================================================

  if (error) {
    return (
      <main className="paper-page">

        <div className="paper-state error-state">

          <div className="paper-state-icon">
            !
          </div>

          <h2>
            Unable to load question paper
          </h2>

          <p>
            {error}
          </p>

          <button
            className="paper-back-button"
            onClick={() =>
              router.push(
                "/examiner/exams"
              )
            }
          >
            ← Back to Examinations
          </button>

        </div>

      </main>
    );
  }

  // ============================================================
  // PAGE
  // ============================================================

  return (
    <main className="paper-page">

      {/* ======================================================
          TOP NAVIGATION
      ====================================================== */}

      <header className="paper-header">

        <button
          className="paper-nav-button"
          onClick={() =>
            router.push(
              "/examiner/exams"
            )
          }
        >
          ← Examinations
        </button>

        <div className="paper-header-actions">

          <button
            className="paper-nav-button"
            onClick={() =>
              router.push(
                `/examiner/questions?exam=${examId}`
              )
            }
          >
            Manage Questions
          </button>

          <button
            className="print-button"
            onClick={handlePrint}
          >
            🖨 Print
          </button>

        </div>

      </header>

      {/* ======================================================
          QUESTION PAPER
      ====================================================== */}

      <section className="question-paper">

        {/* ====================================================
            PAPER TITLE
        ==================================================== */}

        <div className="paper-title-section">

          <div className="paper-label">
            EXAMINATION QUESTION PAPER
          </div>

          <h1>
            {exam?.exam_name}
          </h1>

          <p className="paper-subject">
            {exam?.subject}
          </p>

        </div>

        {/* ====================================================
            EXAM INFORMATION
        ==================================================== */}

        <div className="paper-info">

          <div className="paper-info-item">
            <span>
              Duration
            </span>

            <strong>
              {exam?.duration_minutes} minutes
            </strong>
          </div>

          <div className="paper-info-item">
            <span>
              Total Questions
            </span>

            <strong>
              {questions.length}
            </strong>
          </div>

          <div className="paper-info-item">
            <span>
              Maximum Marks
            </span>

            <strong>
              {exam?.maximum_marks}
            </strong>
          </div>

          <div className="paper-info-item">
            <span>
              Scheduled
            </span>

            <strong>
              {formatDate(
                exam?.start_time
              )}
            </strong>
          </div>

        </div>

        {/* ====================================================
            INSTRUCTIONS
        ==================================================== */}

        <div className="paper-instructions">

          <h3>
            Instructions
          </h3>

          <ul>

            <li>
              Read each question carefully.
            </li>

            <li>
              Answer all questions as instructed.
            </li>

            <li>
              Each question carries the
              marks shown.
            </li>

            <li>
              The examination will be
              conducted within the
              scheduled duration.
            </li>

          </ul>

        </div>

        {/* ====================================================
            QUESTIONS
        ==================================================== */}

        <div className="questions-section">

          <div className="questions-section-header">

            <div>

              <h2>
                Questions
              </h2>

              <p>
                This is the final question
                order students will receive.
              </p>

            </div>

            <span className="question-count">
              {questions.length} Questions
            </span>

          </div>

          {/* ==================================================
              EMPTY
          ================================================== */}

          {questions.length === 0 ? (

            <div className="empty-paper">

              <div className="empty-paper-icon">
                📄
              </div>

              <h3>
                No questions assigned
              </h3>

              <p>
                Add questions to this
                examination before
                publishing it to students.
              </p>

              <button
                onClick={() =>
                  router.push(
                    `/examiner/questions?exam=${examId}`
                  )
                }
              >
                Add Questions
              </button>

            </div>

          ) : (

            <div className="question-list">

              {questions.map(
                (
                  examQuestion,
                  index
                ) => {

                  // ------------------------------------------------
                  // IMPORTANT:
                  // Support both nested and flat API responses.
                  // ------------------------------------------------

                  const question =
                    getQuestionData(
                      examQuestion
                    );

                  const questionType =
                    question?.question_type ||
                    "Question";

                  const marks =
                    question?.marks ??
                    1;

                  return (

                    <article
                      className="paper-question"
                      key={
                        examQuestion.id ||
                        question?.id ||
                        index
                      }
                    >

                      {/* ==========================================
                          QUESTION HEADER
                      ========================================== */}

                      <div className="question-top">

                        <div className="question-number">
                          {index + 1}
                        </div>

                        <div className="question-meta">

                          <span>
                            {questionType}
                          </span>

                          <span>
                            {question?.difficulty ||
                              "Medium"}
                          </span>

                          <strong>
                            {marks}{" "}
                            {Number(marks) === 1
                              ? "Mark"
                              : "Marks"}
                          </strong>

                        </div>

                      </div>

                      {/* ==========================================
                          QUESTION TEXT
                      ========================================== */}

                      <div className="question-text">

                        {question?.question_text ||
                          question?.text ||
                          "Question text unavailable."}

                      </div>

                      {/* ==========================================
                          MCQ OPTIONS
                      ========================================== */}

                      {isMCQ(
                        questionType
                      ) && (

                        <div className="question-options">

                          {question?.option_a && (
                            <div className="option">

                              <span>
                                A
                              </span>

                              <p>
                                {question.option_a}
                              </p>

                            </div>
                          )}

                          {question?.option_b && (
                            <div className="option">

                              <span>
                                B
                              </span>

                              <p>
                                {question.option_b}
                              </p>

                            </div>
                          )}

                          {question?.option_c && (
                            <div className="option">

                              <span>
                                C
                              </span>

                              <p>
                                {question.option_c}
                              </p>

                            </div>
                          )}

                          {question?.option_d && (
                            <div className="option">

                              <span>
                                D
                              </span>

                              <p>
                                {question.option_d}
                              </p>

                            </div>
                          )}

                        </div>
                      )}

                      {/* ==========================================
                          TRUE / FALSE
                      ========================================== */}

                      {isTrueFalse(
                        questionType
                      ) && (

                        <div className="question-options">

                          <div className="option">

                            <span>
                              T
                            </span>

                            <p>
                              True
                            </p>

                          </div>

                          <div className="option">

                            <span>
                              F
                            </span>

                            <p>
                              False
                            </p>

                          </div>

                        </div>
                      )}

                      {/* ==========================================
                          SHORT ANSWER
                      ========================================== */}

                      {isShortAnswer(
                        questionType
                      ) && (

                        <div className="descriptive-answer-box">

                          <span>
                            Student Answer
                          </span>

                          <p>
                            Short-answer response
                            will be evaluated
                            manually by the
                            examiner.
                          </p>

                        </div>
                      )}

                      {/* ==========================================
                          LONG ANSWER
                      ========================================== */}

                      {isLongAnswer(
                        questionType
                      ) && (

                        <div className="descriptive-answer-box">

                          <span>
                            Student Answer
                          </span>

                          <p>
                            Long-answer response
                            will be evaluated
                            manually by the
                            examiner.
                          </p>

                        </div>
                      )}

                      {/* ==========================================
                          CORRECT ANSWER
                      ========================================== */}

                      <div className="correct-answer">

                        <span className="answer-label">
                          Correct Answer
                        </span>

                        <strong>
                          {question?.correct_answer ||
                            "Not provided"}
                        </strong>

                      </div>

                    </article>

                  );
                }
              )}

            </div>

          )}

        </div>

      </section>

    </main>
  );
}