"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

import "./submitted.css";

export default function ExamSubmitted() {
  const router = useRouter();
  const params = useParams();

  const examId = params.examId;

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const role = localStorage.getItem("role");

    if (!token || role !== "student") {
      router.push("/login");
    }
  }, [router]);

  return (
    <main className="submitted-page">

      <section className="submitted-card">

        <div className="submitted-icon">
          ✓
        </div>

        <p className="submitted-label">
          EXAMINATION SUBMITTED
        </p>

        <h1>
          Your examination has been submitted
        </h1>

        <p className="submitted-description">
          Your answers have been successfully submitted
          and are now with the examiner for evaluation.
        </p>


        <div className="submitted-info">

          <div className="submitted-info-item">
            <span className="info-icon">✓</span>

            <div>
              <strong>Submission Successful</strong>
              <p>
                Your examination answers have been saved.
              </p>
            </div>
          </div>


          <div className="submitted-info-item">
            <span className="info-icon">📝</span>

            <div>
              <strong>Evaluation in Progress</strong>
              <p>
                The examiner will review your descriptive
                answers and finalize your marks.
              </p>
            </div>
          </div>


          <div className="submitted-info-item">
            <span className="info-icon">📊</span>

            <div>
              <strong>Result Pending</strong>
              <p>
                Your final result will be available after
                the examiner publishes the results.
              </p>
            </div>
          </div>

        </div>


        <div className="submitted-notice">
          <span>ℹ</span>

          <p>
            You do not need to stay on this page.
            You can return to your dashboard and check
            your result later.
          </p>
        </div>


        <div className="submitted-actions">

          <button
            className="submitted-primary-button"
            onClick={() =>
              router.push("/student")
            }
          >
            Go to Dashboard
            <span>→</span>
          </button>

          <button
            className="submitted-secondary-button"
            onClick={() =>
              router.push(
                `/student/exams/${examId}/result`
              )
            }
          >
            Check Result
          </button>

        </div>

      </section>

    </main>
  );
}