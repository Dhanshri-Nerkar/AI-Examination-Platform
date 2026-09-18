"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import "./attempt.css";

export default function ExamAttemptPage() {
  const router = useRouter();
  const params = useParams();

  const examId = params.examId;

  // ============================================================
  // EXAM STATE
  // ============================================================

  const [paper, setPaper] = useState(null);
  const [answers, setAnswers] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [timeLeft, setTimeLeft] = useState(null);

  // ============================================================
  // CAMERA STATE
  // ============================================================

  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const [cameraStatus, setCameraStatus] = useState("starting");
  const [cameraError, setCameraError] = useState("");

  // ============================================================
  // LOAD EXAMINATION
  // ============================================================

  useEffect(() => {
    if (examId) {
      loadPaper();
    }
  }, [examId]);

  async function loadPaper() {
    try {
      const token = localStorage.getItem("access_token");
      const role = localStorage.getItem("role");

      if (!token || role !== "student") {
        router.push("/login");
        return;
      }

      const response = await fetch(
        `http://127.0.0.1:8000/exams/student/${examId}/paper`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Unable to load question paper."
        );
      }

      setPaper(data);

      const startedAt = new Date(data.started_at);

      const durationMilliseconds =
        data.duration_minutes * 60 * 1000;

      const endTime =
        startedAt.getTime() + durationMilliseconds;

      const remaining = Math.max(
        0,
        Math.floor(
          (endTime - Date.now()) / 1000
        )
      );

      setTimeLeft(remaining);
    } catch (error) {
      console.error(error);
      alert(error.message);
      router.push("/student");
    } finally {
      setLoading(false);
    }
  }

  // ============================================================
  // CAMERA
  // ============================================================

  useEffect(() => {
    if (loading || !paper) {
      return;
    }

    startCamera();

    return () => {
      stopCamera();
    };
  }, [loading, paper]);

  async function startCamera() {
    try {
      setCameraStatus("starting");
      setCameraError("");

      if (!navigator.mediaDevices ||
          !navigator.mediaDevices.getUserMedia) {
        throw new Error(
          "Camera access is not supported by this browser."
        );
      }

      const stream =
        await navigator.mediaDevices.getUserMedia({
          video: {
            width: {
              ideal: 640,
            },
            height: {
              ideal: 480,
            },
            facingMode: "user",
          },
          audio: false,
        });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;

        try {
          await videoRef.current.play();
        } catch (error) {
          console.error(
            "Unable to start video playback:",
            error
          );
        }
      }

      setCameraStatus("active");

      // Detect if camera track is stopped externally
      const videoTrack =
        stream.getVideoTracks()[0];

      if (videoTrack) {
        videoTrack.onended = () => {
          setCameraStatus("off");
          setCameraError(
            "Camera access was stopped."
          );
        };
      }
    } catch (error) {
      console.error(
        "Camera error:",
        error
      );

      setCameraStatus("error");

      if (
        error.name === "NotAllowedError"
      ) {
        setCameraError(
          "Camera permission was denied. Please allow camera access to continue."
        );
      } else if (
        error.name === "NotFoundError"
      ) {
        setCameraError(
          "No camera was found on this device."
        );
      } else if (
        error.name === "NotReadableError"
      ) {
        setCameraError(
          "The camera is already being used by another application."
        );
      } else {
        setCameraError(
          error.message ||
          "Unable to access the camera."
        );
      }
    }
  }

  function stopCamera() {
    if (streamRef.current) {
      streamRef.current
        .getTracks()
        .forEach((track) => {
          track.stop();
        });

      streamRef.current = null;
    }
  }

  async function retryCamera() {
    stopCamera();
    await startCamera();
  }

  // ============================================================
  // TIMER
  // ============================================================

  useEffect(() => {
    if (timeLeft === null) return;

    if (timeLeft <= 0) {
      handleAutoSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((current) =>
        current !== null
          ? current - 1
          : 0
      );
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [timeLeft]);

  function formatTime(seconds) {
    if (seconds === null) {
      return "--:--";
    }

    const hours =
      Math.floor(seconds / 3600);

    const minutes =
      Math.floor(
        (seconds % 3600) / 60
      );

    const secs =
      seconds % 60;

    return [
      hours > 0
        ? String(hours).padStart(2, "0")
        : null,

      String(minutes).padStart(2, "0"),

      String(secs).padStart(2, "0"),
    ]
      .filter(Boolean)
      .join(":");
  }

  // ============================================================
  // ANSWERS
  // ============================================================

  async function selectAnswer(
    questionId,
    answer
  ) {
    setAnswers((current) => ({
      ...current,
      [questionId]: answer,
    }));

    await saveAnswer(
      questionId,
      answer
    );
  }

  async function saveAnswer(
    questionId,
    answer
  ) {
    if (!paper) return;

    try {
      setSaving(true);

      const token =
        localStorage.getItem(
          "access_token"
        );

      await fetch(
        `http://127.0.0.1:8000/exams/student/${examId}/answer`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            attempt_id:
              paper.attempt_id,

            question_id:
              questionId,

            selected_answer:
              answer,
          }),
        }
      );
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  }

  // ============================================================
  // SUBMIT
  // ============================================================

  async function handleAutoSubmit() {
    if (submitting) return;

    await submitExam(true);
  }

  async function submitExam(
    auto = false
  ) {
    if (!paper) return;

    if (!auto) {
      const confirmed =
        window.confirm(
          "Are you sure you want to submit your examination?"
        );

      if (!confirmed) {
        return;
      }
    }

    try {
      setSubmitting(true);

      const token =
        localStorage.getItem(
          "access_token"
        );

      const response =
        await fetch(
          `http://127.0.0.1:8000/exams/student/${examId}/submit?attempt_id=${paper.attempt_id}`,
          {
            method: "POST",

            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
          "Unable to submit examination."
        );
      }

      // Stop camera before leaving exam
      stopCamera();

      router.push(
        `/student/exams/${examId}/result`
      );
    } catch (error) {
      console.error(error);

      alert(error.message);

      setSubmitting(false);
    }
  }

  // ============================================================
  // QUESTION NAVIGATION
  // ============================================================

  function goNext() {
    if (!paper) return;

    if (
      currentIndex <
      paper.questions.length - 1
    ) {
      setCurrentIndex(
        (current) => current + 1
      );
    }
  }

  function goPrevious() {
    if (currentIndex > 0) {
      setCurrentIndex(
        (current) => current - 1
      );
    }
  }

  function goToQuestion(index) {
    setCurrentIndex(index);
  }

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <main className="attempt-loading">

        <div className="loading-spinner"></div>

        <h2>
          Loading question paper...
        </h2>

      </main>
    );
  }

  // ============================================================
  // NO QUESTIONS
  // ============================================================

  if (
    !paper ||
    paper.questions.length === 0
  ) {
    return (
      <main className="attempt-loading">

        <h2>
          No questions available
        </h2>

        <p>
          This examination does not have
          any assigned questions yet.
        </p>

        <button
          onClick={() =>
            router.push("/student")
          }
        >
          Back to Dashboard
        </button>

      </main>
    );
  }

  const question =
    paper.questions[currentIndex];

  const selectedAnswer =
    answers[question.id];

  const answeredCount =
    Object.keys(answers).length;

  // ============================================================
  // PAGE
  // ============================================================

  return (
    <main className="attempt-page">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <header className="attempt-header">

        <div>

          <div className="attempt-brand">

            <span className="attempt-brand-icon">
              AI
            </span>

            <div>

              <strong>
                {paper.exam_name}
              </strong>

              <span>
                {paper.subject}
              </span>

            </div>

          </div>

        </div>


        <div className="attempt-header-right">

          <div className="saving-indicator">
            {saving
              ? "Saving..."
              : "Answers saved"}
          </div>

          <div
            className={
              timeLeft !== null &&
              timeLeft <= 300
                ? "exam-timer danger"
                : "exam-timer"
            }
          >
            ⏱ {formatTime(timeLeft)}
          </div>

        </div>

      </header>


      {/* ======================================================
          CAMERA BAR
      ====================================================== */}

      <section className="camera-section">

        <div className="camera-container">

          <div className="camera-preview">

            <video
              ref={videoRef}
              className="camera-video"
              autoPlay
              muted
              playsInline
            />

            {cameraStatus !== "active" && (
              <div className="camera-overlay">

                <div className="camera-overlay-icon">
                  📷
                </div>

                <strong>
                  {cameraStatus === "starting"
                    ? "Starting camera..."
                    : "Camera unavailable"}
                </strong>

                {cameraError && (
                  <p>
                    {cameraError}
                  </p>
                )}

                {cameraStatus === "error" && (
                  <button
                    className="camera-retry-button"
                    onClick={retryCamera}
                  >
                    Allow Camera / Retry
                  </button>
                )}

              </div>
            )}

            {cameraStatus === "active" && (
              <div className="camera-live-badge">
                <span className="camera-live-dot"></span>
                Camera Active
              </div>
            )}

          </div>


          <div className="camera-info">

            <strong>
              Camera Monitoring
            </strong>

            <p>
              Your camera is active during
              the examination.
            </p>

          </div>

        </div>

      </section>


      {/* ======================================================
          CONTENT
      ====================================================== */}

      <section className="attempt-content">

        <div className="attempt-progress">

          <div>

            <strong>
              Question {currentIndex + 1}
            </strong>

            <span>
              {" "}
              of {paper.questions.length}
            </span>

          </div>

          <div>
            {answeredCount} /{" "}
            {paper.questions.length}{" "}
            answered
          </div>

        </div>


        <div className="attempt-layout">

          {/* ==================================================
              QUESTION
          ================================================== */}

          <section className="question-card">

            <div className="question-top">

              <span>
                Question {currentIndex + 1}
              </span>

              <span>
                {question.marks}{" "}
                {question.marks === 1
                  ? "mark"
                  : "marks"}
              </span>

            </div>


            <h1>
              {question.question_text}
            </h1>


            {question.question_type ===
              "MCQ" && (

              <div className="answer-options">

                {[
                  ["A", question.option_a],
                  ["B", question.option_b],
                  ["C", question.option_c],
                  ["D", question.option_d],
                ].map(
                  ([letter, option]) => (

                    <button
                      key={letter}
                      className={
                        selectedAnswer ===
                        letter
                          ? "answer-option selected"
                          : "answer-option"
                      }
                      onClick={() =>
                        selectAnswer(
                          question.id,
                          letter
                        )
                      }
                    >

                      <span className="option-letter">
                        {letter}
                      </span>

                      <span>
                        {option}
                      </span>

                    </button>

                  )
                )}

              </div>

            )}


            {question.question_type !==
              "MCQ" && (

              <textarea
                className="text-answer"
                placeholder="Type your answer here..."
                value={
                  selectedAnswer || ""
                }
                onChange={(event) =>
                  selectAnswer(
                    question.id,
                    event.target.value
                  )
                }
              />

            )}


            <div className="question-navigation">

              <button
                className="navigation-button"
                onClick={goPrevious}
                disabled={
                  currentIndex === 0
                }
              >
                ← Previous
              </button>


              {currentIndex <
              paper.questions.length - 1 ? (

                <button
                  className="navigation-button next"
                  onClick={goNext}
                >
                  Next →
                </button>

              ) : (

                <button
                  className="submit-button"
                  onClick={() =>
                    submitExam(false)
                  }
                  disabled={submitting}
                >
                  {submitting
                    ? "Submitting..."
                    : "Submit Examination"}
                </button>

              )}

            </div>

          </section>


          {/* ==================================================
              SIDEBAR
          ================================================== */}

          <aside className="question-sidebar">

            <h3>
              Questions
            </h3>

            <p>
              Click a number to navigate.
            </p>


            <div className="question-number-grid">

              {paper.questions.map(
                (item, index) => {

                  const answered =
                    answers[item.id] !==
                      undefined &&
                    answers[item.id] !== "";

                  return (

                    <button
                      key={item.id}
                      className={`
                        question-number
                        ${
                          currentIndex ===
                          index
                            ? "current"
                            : ""
                        }
                        ${
                          answered
                            ? "answered"
                            : ""
                        }
                      `}
                      onClick={() =>
                        goToQuestion(index)
                      }
                    >
                      {index + 1}
                    </button>

                  );
                }
              )}

            </div>


            <div className="sidebar-legend">

              <div>
                <span className="legend current"></span>
                Current
              </div>

              <div>
                <span className="legend answered"></span>
                Answered
              </div>

              <div>
                <span className="legend unanswered"></span>
                Unanswered
              </div>

            </div>


            <button
              className="sidebar-submit-button"
              onClick={() =>
                submitExam(false)
              }
              disabled={submitting}
            >
              Submit Examination
            </button>

          </aside>

        </div>

      </section>

    </main>
  );
}