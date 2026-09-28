"use client";

import { useMemo, useState } from "react";
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
    mcq_questions: "0",
    true_false_questions: "0",
    short_answer_questions: "0",
    long_answer_questions: "0",
    maximum_marks: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const totalQuestions = useMemo(() => {
    return (
      Number(formData.mcq_questions || 0) +
      Number(formData.true_false_questions || 0) +
      Number(formData.short_answer_questions || 0) +
      Number(formData.long_answer_questions || 0)
    );
  }, [formData]);

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

    const token = localStorage.getItem("access_token");

    if (!token) {
      router.push("/login");
      return;
    }

    if (
      !formData.exam_name.trim() ||
      !formData.subject.trim() ||
      !formData.duration_minutes ||
      !formData.start_time ||
      !formData.end_time ||
      !formData.maximum_marks
    ) {
      setError("Please fill in all the required fields.");
      return;
    }

    if (
      Number(formData.duration_minutes) <= 0 ||
      Number(formData.maximum_marks) <= 0
    ) {
      setError("Duration and maximum marks must be greater than 0.");
      return;
    }

    const typeCounts = [
      formData.mcq_questions,
      formData.true_false_questions,
      formData.short_answer_questions,
      formData.long_answer_questions,
    ].map(Number);

    if (typeCounts.some((count) => count < 0)) {
      setError("Question counts cannot be negative.");
      return;
    }

    if (totalQuestions <= 0) {
      setError("Please add at least one question across the four question types.");
      return;
    }

    if (new Date(formData.end_time) <= new Date(formData.start_time)) {
      setError("End time must be after start time.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/exams/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          exam_name: formData.exam_name.trim(),
          subject: formData.subject.trim(),
          duration_minutes: Number(formData.duration_minutes),
          start_time: new Date(formData.start_time).toISOString(),
          end_time: new Date(formData.end_time).toISOString(),
          total_questions: totalQuestions,
          mcq_questions: Number(formData.mcq_questions),
          true_false_questions: Number(formData.true_false_questions),
          short_answer_questions: Number(formData.short_answer_questions),
          long_answer_questions: Number(formData.long_answer_questions),
          maximum_marks: Number(formData.maximum_marks),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Unable to create examination.");
      }

      setSuccess("Examination created successfully! Now add the required questions.");

      setFormData({
        exam_name: "",
        subject: "",
        duration_minutes: "",
        start_time: "",
        end_time: "",
        mcq_questions: "0",
        true_false_questions: "0",
        short_answer_questions: "0",
        long_answer_questions: "0",
        maximum_marks: "",
      });

      setTimeout(() => {
        router.push(`/examiner/questions?exam=${data.id}`);
      }, 700);
    } catch (error) {
      console.error(error);
      setError(error.message || "Something went wrong while creating the examination.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="create-exam-page">

      <section className="create-exam-container">

        <div className="page-heading">
          <div className="heading-icon">📝</div>
          <div>
            <p className="heading-label">EXAMINER</p>
            <h1>Create Examination</h1>
            <p>Configure your examination before adding questions.</p>
          </div>
        </div>

        <div className="exam-form-card">
          <form onSubmit={handleSubmit}>
            <div className="form-section">
              <h2>Examination Details</h2>
              <p className="section-description">
                Enter the basic information for your examination.
              </p>

              <div className="form-grid">
                <div className="form-group full-width">
                  <label htmlFor="exam_name">Examination Name</label>
                  <input
                    id="exam_name"
                    name="exam_name"
                    type="text"
                    value={formData.exam_name}
                    onChange={handleChange}
                    placeholder="e.g. Python Fundamentals"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="e.g. Python"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="duration_minutes">Duration</label>
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
                    <span>minutes</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="form-section">
              <h2>Examination Schedule</h2>
              <p className="section-description">
                Set when students can access the examination.
              </p>

              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="start_time">Start Time</label>
                  <input
                    id="start_time"
                    name="start_time"
                    type="datetime-local"
                    value={formData.start_time}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="end_time">End Time</label>
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

            <div className="form-section">
              <h2>Question Configuration</h2>
              <p className="section-description">
                Decide exactly how many questions of each type this examination requires.
              </p>

              <div className="question-type-grid">
                <div className="question-type-card">
                  <span className="question-type-number">01</span>
                  <label htmlFor="mcq_questions">MCQ</label>
                  <input id="mcq_questions" name="mcq_questions" type="number" min="0" value={formData.mcq_questions} onChange={handleChange} />
                  <small>Multiple choice questions</small>
                </div>

                <div className="question-type-card">
                  <span className="question-type-number">02</span>
                  <label htmlFor="true_false_questions">True / False</label>
                  <input id="true_false_questions" name="true_false_questions" type="number" min="0" value={formData.true_false_questions} onChange={handleChange} />
                  <small>True or false questions</small>
                </div>

                <div className="question-type-card">
                  <span className="question-type-number">03</span>
                  <label htmlFor="short_answer_questions">Short Answer</label>
                  <input id="short_answer_questions" name="short_answer_questions" type="number" min="0" value={formData.short_answer_questions} onChange={handleChange} />
                  <small>Short response questions</small>
                </div>

                <div className="question-type-card">
                  <span className="question-type-number">04</span>
                  <label htmlFor="long_answer_questions">Long Answer</label>
                  <input id="long_answer_questions" name="long_answer_questions" type="number" min="0" value={formData.long_answer_questions} onChange={handleChange} />
                  <small>Descriptive questions</small>
                </div>
              </div>

              <div className="question-total-box">
                <div>
                  <span>Total Questions</span>
                  <small>Automatically calculated from the four types</small>
                </div>
                <strong>{totalQuestions}</strong>
              </div>

              <div className="form-grid marks-grid">
                <div className="form-group">
                  <label htmlFor="maximum_marks">Maximum Marks</label>
                  <input id="maximum_marks" name="maximum_marks" type="number" min="1" value={formData.maximum_marks} onChange={handleChange} placeholder="40" />
                </div>
              </div>
            </div>

            {error && <div className="message error-message"><span>!</span>{error}</div>}
            {success && <div className="message success-message"><span>✓</span>{success}</div>}

            <div className="form-actions">
              <button type="button" className="cancel-button" onClick={() => router.push("/examiner")}>
                Cancel
              </button>
              <button type="submit" className="create-button" disabled={loading}>
                {loading ? "Creating..." : "Create Examination →"}
              </button>
            </div>
          </form>
        </div>

        <div className="next-step-card">
          <div className="next-step-icon">💡</div>
          <div>
            <strong>What's next?</strong>
            <p>
              After creating the examination, add questions until every required question type is complete. The system will show your progress and prevent exceeding the configured limits.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}