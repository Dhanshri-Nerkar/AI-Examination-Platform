"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import "./create-exam.css";

export default function CreateExamPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    exam_name: "",
    subject: "",
    duration_minutes: "",
    start_time: "",
    end_time: "",
    total_questions: "",
    maximum_marks: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSuccess("");

    // Get existing JWT token
    const token = localStorage.getItem("access_token");

    if (!token) {
      router.push("/login");
      return;
    }

    // Basic validation
    if (
      !formData.exam_name ||
      !formData.subject ||
      !formData.duration_minutes ||
      !formData.start_time ||
      !formData.end_time ||
      !formData.total_questions ||
      !formData.maximum_marks
    ) {
      setError("Please fill in all the fields.");
      return;
    }

    if (
      Number(formData.duration_minutes) <= 0 ||
      Number(formData.total_questions) <= 0 ||
      Number(formData.maximum_marks) <= 0
    ) {
      setError("Please enter valid positive numbers.");
      return;
    }

    if (
      new Date(formData.end_time) <=
      new Date(formData.start_time)
    ) {
      setError("End time must be after start time.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/exams/",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            exam_name: formData.exam_name,
            subject: formData.subject,

            duration_minutes: Number(
              formData.duration_minutes
            ),

            start_time: new Date(
              formData.start_time
            ).toISOString(),

            end_time: new Date(
              formData.end_time
            ).toISOString(),

            total_questions: Number(
              formData.total_questions
            ),

            maximum_marks: Number(
              formData.maximum_marks
            ),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Unable to create examination."
        );
      }

      console.log("Exam created:", data);

      setSuccess(
        "Examination created successfully!"
      );

      // Clear form
      setFormData({
        exam_name: "",
        subject: "",
        duration_minutes: "",
        start_time: "",
        end_time: "",
        total_questions: "",
        maximum_marks: "",
      });

    } catch (error) {
      console.error(error);

      setError(
        error.message ||
          "Something went wrong while creating the examination."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="create-exam-page">

      {/* Top Navigation */}
      <header className="create-exam-header">

        <div>
          <div className="brand">
            <div className="brand-icon">
              AI
            </div>

            <span>
              AI Examination
            </span>
          </div>
        </div>

        <button
          className="back-button"
          onClick={() => router.push("/examiner")}
        >
          ← Back to Dashboard
        </button>

      </header>


      {/* Main Content */}
      <section className="create-exam-container">

        <div className="page-heading">

          <div className="heading-icon">
            📝
          </div>

          <div>
            <p className="heading-label">
              EXAMINER
            </p>

            <h1>
              Create Examination
            </h1>

            <p>
              Configure your examination before adding questions.
            </p>
          </div>

        </div>


        {/* Form Card */}
        <div className="exam-form-card">

          <form onSubmit={handleSubmit}>

            {/* Basic Information */}
            <div className="form-section">

              <h2>
                Examination Details
              </h2>

              <p className="section-description">
                Enter the basic information for your examination.
              </p>


              <div className="form-grid">

                {/* Exam Name */}
                <div className="form-group full-width">

                  <label htmlFor="exam_name">
                    Examination Name
                  </label>

                  <input
                    id="exam_name"
                    name="exam_name"
                    type="text"
                    value={formData.exam_name}
                    onChange={handleChange}
                    placeholder="e.g. Python Fundamentals"
                  />

                </div>


                {/* Subject */}
                <div className="form-group">

                  <label htmlFor="subject">
                    Subject
                  </label>

                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="e.g. Python"
                  />

                </div>


                {/* Duration */}
                <div className="form-group">

                  <label htmlFor="duration_minutes">
                    Duration
                  </label>

                  <div className="input-with-suffix">

                    <input
                      id="duration_minutes"
                      name="duration_minutes"
                      type="number"
                      min="1"
                      value={formData.duration_minutes}
                      onChange={handleChange}
                      placeholder="60"
                    />

                    <span>
                      minutes
                    </span>

                  </div>

                </div>

              </div>

            </div>


            {/* Schedule */}
            <div className="form-section">

              <h2>
                Examination Schedule
              </h2>

              <p className="section-description">
                Set when students can access the examination.
              </p>


              <div className="form-grid">

                {/* Start Time */}
                <div className="form-group">

                  <label htmlFor="start_time">
                    Start Time
                  </label>

                  <input
                    id="start_time"
                    name="start_time"
                    type="datetime-local"
                    value={formData.start_time}
                    onChange={handleChange}
                  />

                </div>


                {/* End Time */}
                <div className="form-group">

                  <label htmlFor="end_time">
                    End Time
                  </label>

                  <input
                    id="end_time"
                    name="end_time"
                    type="datetime-local"
                    value={formData.end_time}
                    onChange={handleChange}
                  />

                </div>

              </div>

            </div>


            {/* Question Configuration */}
            <div className="form-section">

              <h2>
                Question Configuration
              </h2>

              <p className="section-description">
                Define the size and scoring of your examination.
              </p>


              <div className="form-grid">

                {/* Total Questions */}
                <div className="form-group">

                  <label htmlFor="total_questions">
                    Total Questions
                  </label>

                  <input
                    id="total_questions"
                    name="total_questions"
                    type="number"
                    min="1"
                    value={formData.total_questions}
                    onChange={handleChange}
                    placeholder="20"
                  />

                </div>


                {/* Maximum Marks */}
                <div className="form-group">

                  <label htmlFor="maximum_marks">
                    Maximum Marks
                  </label>

                  <input
                    id="maximum_marks"
                    name="maximum_marks"
                    type="number"
                    min="1"
                    value={formData.maximum_marks}
                    onChange={handleChange}
                    placeholder="40"
                  />

                </div>

              </div>

            </div>


            {/* Messages */}
            {error && (
              <div className="message error-message">
                <span>!</span>
                {error}
              </div>
            )}

            {success && (
              <div className="message success-message">
                <span>✓</span>
                {success}
              </div>
            )}


            {/* Buttons */}
            <div className="form-actions">

              <button
                type="button"
                className="cancel-button"
                onClick={() =>
                  router.push("/examiner")
                }
              >
                Cancel
              </button>

              <button
                type="submit"
                className="create-button"
                disabled={loading}
              >
                {loading
                  ? "Creating..."
                  : "Create Examination →"}
              </button>

            </div>

          </form>

        </div>


        {/* Next Step */}
        <div className="next-step-card">

          <div className="next-step-icon">
            💡
          </div>

          <div>
            <strong>
              What's next?
            </strong>

            <p>
              After creating the examination, you will be able
              to add questions and configure question selection
              and randomization.
            </p>
          </div>

        </div>

      </section>

    </main>
  );
}