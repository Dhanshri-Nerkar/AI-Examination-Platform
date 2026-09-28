"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import "./instructions.css";

const API = "http://127.0.0.1:8000";

export default function ExamInstructionsPage() {
  const router = useRouter();
  const params = useParams();

  const examId = params.examId;

  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (examId) {
      loadExam();
    }
  }, [examId]);

  async function loadExam() {
    try {
      const token =
        localStorage.getItem("access_token");

      const role =
        localStorage.getItem("role");

      if (!token || role !== "student") {
        router.push("/login");
        return;
      }

      /*
        Load the student's available exams.
        We use this existing endpoint instead of
        creating an attempt at this stage.
      */

      const response = await fetch(
        `${API}/exams/student/exams`,
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
            "Unable to load examination."
        );
      }

      const available =
        data.available || [];

      const completed =
        data.completed || [];

      const foundExam =
        [...available, ...completed].find(
          (item) =>
            String(item.id) ===
            String(examId)
        );

      if (!foundExam) {
        throw new Error(
          "This examination is not available."
        );
      }

      setExam(foundExam);

    } catch (error) {
      console.error(error);

      setError(
        error.message ||
          "Unable to load examination."
      );

    } finally {
      setLoading(false);
    }
  }

  async function startExam() {
    if (starting) return;

    try {
      setStarting(true);
      setError("");

      const token =
        localStorage.getItem("access_token");

      if (!token) {
        router.push("/login");
        return;
      }

      /*
        ======================================================
        STEP 1
        Request camera permission
        ======================================================
      */

      if (
        !navigator.mediaDevices ||
        !navigator.mediaDevices.getUserMedia
      ) {
        throw new Error(
          "Camera access is not supported by this browser."
        );
      }

      let cameraStream = null;

      try {
        cameraStream =
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
      } catch (cameraError) {
        console.error(
          "Camera permission error:",
          cameraError
        );

        if (
          cameraError.name ===
          "NotAllowedError"
        ) {
          throw new Error(
            "Camera permission is required to start the examination. Please allow camera access and try again."
          );
        }

        if (
          cameraError.name ===
          "NotFoundError"
        ) {
          throw new Error(
            "No camera was found on this device. A camera is required to start the examination."
          );
        }

        throw new Error(
          "Unable to access the camera. Please check your camera and try again."
        );
      }

      /*
        We only needed the camera permission here.
        The actual examination page will start its
        own camera monitoring.
      */

      if (cameraStream) {
        cameraStream
          .getTracks()
          .forEach((track) => {
            track.stop();
          });
      }


      /*
        ======================================================
        STEP 2
        Enter Full Screen
        ======================================================
      */

      try {
        if (!document.fullscreenElement) {
          await document.documentElement.requestFullscreen();
        }
      } catch (fullscreenError) {
        console.error(
          "Fullscreen error:",
          fullscreenError
        );

        throw new Error(
          "Full screen mode is required to start the examination. Please allow full screen access and try again."
        );
      }


      /*
        ======================================================
        STEP 3
        ONLY NOW START THE EXAMINATION
        ======================================================
      */

      const response = await fetch(
        `${API}/exams/student/${examId}/start`,
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
            "Unable to start examination."
        );
      }


      /*
        ======================================================
        STEP 4
        Open actual examination
        ======================================================
      */

      router.push(
        `/student/exams/${examId}/attempt`
      );

    } catch (error) {
      console.error(error);

      setError(
        error.message ||
          "Unable to start examination."
      );

      setStarting(false);
    }
  }

  if (loading) {
    return (
      <main className="instructions-loading">

        <div className="instructions-spinner"></div>

        <p>
          Loading examination...
        </p>

      </main>
    );
  }

  if (error && !exam) {
    return (
      <main className="instructions-page">

        <section className="instructions-error">

          <div className="instructions-error-icon">
            !
          </div>

          <h2>
            Unable to Load Examination
          </h2>

          <p>
            {error}
          </p>

          <button
            onClick={() =>
              router.push("/student")
            }
          >
            ← Back to Dashboard
          </button>

        </section>

      </main>
    );
  }

  return (
    <main className="instructions-page">

      <section className="instructions-card">

        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="instructions-header">

          <div className="exam-icon">
            AI
          </div>

          <div>

            <p className="instructions-label">
              EXAMINATION INSTRUCTIONS
            </p>

            <h1>
              {exam?.exam_name}
            </h1>

            <p className="exam-subject">
              {exam?.subject}
            </p>

          </div>

        </div>


        {/* ==================================================
            EXAM DETAILS
        ================================================== */}

        <div className="exam-details">

          <div className="exam-detail">

            <span className="detail-icon">
              ⏱
            </span>

            <div>
              <span>
                Duration
              </span>

              <strong>
                {exam?.duration_minutes} minutes
              </strong>
            </div>

          </div>


          <div className="exam-detail">

            <span className="detail-icon">
              📝
            </span>

            <div>
              <span>
                Questions
              </span>

              <strong>
                {exam?.total_questions}
              </strong>
            </div>

          </div>


          <div className="exam-detail">

            <span className="detail-icon">
              🎯
            </span>

            <div>
              <span>
                Maximum Marks
              </span>

              <strong>
                {exam?.maximum_marks}
              </strong>
            </div>

          </div>

        </div>


        {/* ==================================================
            INSTRUCTIONS
        ================================================== */}

        <div className="instruction-section">

          <h2>
            Before You Begin
          </h2>

          <div className="instruction-list">

            <div className="instruction-item">

              <span className="instruction-number">
                1
              </span>

              <div>
                <strong>
                  Camera Monitoring
                </strong>

                <p>
                  Your camera will remain active
                  during the examination for
                  examination monitoring.
                </p>
              </div>

            </div>


            <div className="instruction-item">

              <span className="instruction-number">
                2
              </span>

              <div>
                <strong>
                  Stay in Full Screen
                </strong>

                <p>
                  The examination will run in
                  full screen mode. Do not exit
                  full screen while answering.
                </p>
              </div>

            </div>


            <div className="instruction-item">

              <span className="instruction-number">
                3
              </span>

              <div>
                <strong>
                  Keep Your Face Visible
                </strong>

                <p>
                  Make sure your face remains
                  clearly visible to the camera
                  throughout the examination.
                </p>
              </div>

            </div>


            <div className="instruction-item">

              <span className="instruction-number">
                4
              </span>

              <div>
                <strong>
                  Manage Your Time
                </strong>

                <p>
                  The examination timer starts
                  only after you enter the
                  examination.
                </p>
              </div>

            </div>


            <div className="instruction-item">

              <span className="instruction-number">
                5
              </span>

              <div>
                <strong>
                  Submit Carefully
                </strong>

                <p>
                  Once the examination is submitted,
                  you cannot modify your answers.
                </p>
              </div>

            </div>

          </div>

        </div>


        {/* ==================================================
            CAMERA NOTICE
        ================================================== */}

        <div className="camera-notice">

          <div className="camera-notice-icon">
            📷
          </div>

          <div>

            <strong>
              Camera & Full Screen Required
            </strong>

            <p>
              Clicking the button below will
              request camera access and enter
              full screen mode. The examination
              will start only after these steps
              are completed.
            </p>

          </div>

        </div>


        {/* ==================================================
            ERROR
        ================================================== */}

        {error && (
          <div className="start-error">
            <span>!</span>
            <p>{error}</p>
          </div>
        )}


        {/* ==================================================
            ACTIONS
        ================================================== */}

        <div className="instructions-actions">

          <button
            className="back-dashboard-button"
            onClick={() =>
              router.push("/student")
            }
            disabled={starting}
          >
            ← Back to Dashboard
          </button>

          <button
            className="start-exam-button"
            onClick={startExam}
            disabled={starting}
          >
            {starting
              ? "Preparing Examination..."
              : "I Understand — Start Exam →"}
          </button>

        </div>


        <p className="security-note">
          🔒 Your examination session is protected
          and monitored.
        </p>

      </section>

    </main>
  );
}