"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import "./question-paper.css";

export default function QuestionPaperPage() {
  const router = useRouter();
  const params = useParams();

  const examId = params.examId;

  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!examId) return;

    loadQuestionPaper();
  }, [examId]);

  const loadQuestionPaper = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("access_token");
      const role = localStorage.getItem("role");

      if (!token || role !== "examiner") {
        router.push("/login");
        return;
      }

      // Load examination details
      const examResponse = await fetch(
        "http://127.0.0.1:8000/exams/my-exams",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!examResponse.ok) {
        throw new Error("Unable to load examination");
      }

      const exams = await examResponse.json();

      const selectedExam = exams.find(
        (item) => String(item.id) === String(examId)
      );

      if (!selectedExam) {
        throw new Error("Examination not found");
      }

      setExam(selectedExam);

      // Load questions assigned to this examination
      const questionResponse = await fetch(
        `http://127.0.0.1:8000/exams/${examId}/questions`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!questionResponse.ok) {
        throw new Error("Unable to load question paper");
      }

      const examQuestions = await questionResponse.json();

      setQuestions(
        Array.isArray(examQuestions)
          ? examQuestions
          : []
      );
    } catch (err) {
      console.error(err);
      setError(
        err.message ||
          "Unable to load the question paper."
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "Not set";

    return new Date(date).toLocaleString([], {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <main className="paper-page">
        <div className="paper-state">
          <div className="paper-spinner"></div>
          <h2>Loading question paper...</h2>
          <p>Please wait while we prepare the examination paper.</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="paper-page">
        <div className="paper-state error-state">
          <div className="paper-state-icon">!</div>

          <h2>Unable to load question paper</h2>

          <p>{error}</p>

          <button
            className="paper-back-button"
            onClick={() => router.push("/examiner/exams")}
          >
            ← Back to Examinations
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="paper-page">

      {/* =========================
          TOP NAVIGATION
      ========================= */}

      <header className="paper-header">

        <button
          className="paper-nav-button"
          onClick={() => router.push("/examiner/exams")}
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


      {/* =========================
          PAPER
      ========================= */}

      <section className="question-paper">

        {/* Paper heading */}

        <div className="paper-title-section">

          <div className="paper-label">
            EXAMINATION QUESTION PAPER
          </div>

          <h1>{exam.exam_name}</h1>

          <p className="paper-subject">
            {exam.subject}
          </p>

        </div>


        {/* Exam information */}

        <div className="paper-info">

          <div className="paper-info-item">
            <span>Duration</span>
            <strong>
              {exam.duration_minutes} minutes
            </strong>
          </div>

          <div className="paper-info-item">
            <span>Total Questions</span>
            <strong>
              {questions.length}
            </strong>
          </div>

          <div className="paper-info-item">
            <span>Maximum Marks</span>
            <strong>
              {exam.maximum_marks}
            </strong>
          </div>

          <div className="paper-info-item">
            <span>Scheduled</span>
            <strong>
              {formatDate(exam.start_time)}
            </strong>
          </div>

        </div>


        {/* Instructions */}

        <div className="paper-instructions">

          <h3>Instructions</h3>

          <ul>
            <li>Read each question carefully.</li>
            <li>Answer all questions as instructed.</li>
            <li>Each question carries the marks shown.</li>
            <li>The examination will be conducted within the scheduled duration.</li>
          </ul>

        </div>


        {/* Questions */}

        <div className="questions-section">

          <div className="questions-section-header">

            <div>
              <h2>Questions</h2>

              <p>
                This is the final question order students
                will receive.
              </p>
            </div>

            <span className="question-count">
              {questions.length} Questions
            </span>

          </div>


          {questions.length === 0 ? (

            <div className="empty-paper">

              <div className="empty-paper-icon">
                📄
              </div>

              <h3>No questions assigned</h3>

              <p>
                Add questions to this examination before
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

              {questions.map((examQuestion, index) => {

                const question = examQuestion.question;

                return (
                  <article
                    className="paper-question"
                    key={examQuestion.id}
                  >

                    <div className="question-top">

                      <div className="question-number">
                        {index + 1}
                      </div>

                      <div className="question-meta">

                        <span>
                          {question?.question_type ||
                            "Question"}
                        </span>

                        <span>
                          {question?.difficulty ||
                            "Medium"}
                        </span>

                        <strong>
                          {question?.marks || 1}{" "}
                          {question?.marks === 1
                            ? "Mark"
                            : "Marks"}
                        </strong>

                      </div>

                    </div>


                    <div className="question-text">

                      {question?.question_text ||
                        "Question text unavailable."}

                    </div>


                    {question?.question_type ===
                      "MCQ" && (

                      <div className="question-options">

                        {question?.option_a && (
                          <div className="option">
                            <span>A</span>
                            <p>{question.option_a}</p>
                          </div>
                        )}

                        {question?.option_b && (
                          <div className="option">
                            <span>B</span>
                            <p>{question.option_b}</p>
                          </div>
                        )}

                        {question?.option_c && (
                          <div className="option">
                            <span>C</span>
                            <p>{question.option_c}</p>
                          </div>
                        )}

                        {question?.option_d && (
                          <div className="option">
                            <span>D</span>
                            <p>{question.option_d}</p>
                          </div>
                        )}

                      </div>
                    )}


                    {/* Examiner-only answer */}

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
              })}

            </div>
          )}

        </div>

      </section>

    </main>
  );
}