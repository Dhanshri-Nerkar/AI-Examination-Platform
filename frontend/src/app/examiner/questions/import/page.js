"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./import-questions.css";

const API_URL = "http://127.0.0.1:8000";

export default function ImportQuestionsPage() {
  const router = useRouter();

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const role = localStorage.getItem("role");

    if (!token || role !== "examiner") {
      router.push("/login");
    }
  }, [router]);

  function handleFileChange(event) {
    const selectedFile = event.target.files?.[0];

    setError("");
    setMessage("");
    setQuestions([]);

    if (!selectedFile) {
      setFile(null);
      return;
    }

    const allowedExtensions = [
      ".pdf",
      ".docx",
      ".csv",
      ".xlsx",
      ".xls",
    ];

    const fileName = selectedFile.name.toLowerCase();

    const valid = allowedExtensions.some((extension) =>
      fileName.endsWith(extension)
    );

    if (!valid) {
      setFile(null);
      setError(
        "Please select a PDF, Word, CSV, or Excel file."
      );
      return;
    }

    setFile(selectedFile);
  }

  async function handleExtract() {
    if (!file) {
      setError("Please select a file first.");
      return;
    }

    const token = localStorage.getItem("access_token");

    if (!token) {
      router.push("/login");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");
    setQuestions([]);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        `${API_URL}/exams/questions/import`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Unable to extract questions."
        );
      }

      const extractedQuestions =
        data.questions || [];

      if (extractedQuestions.length === 0) {
        setMessage(
          "No questions were found in this file."
        );
        return;
      }

      setQuestions(
        extractedQuestions.map((question, index) => ({
          ...question,
          temp_id: index + 1,
          selected: true,
        }))
      );

      setMessage(
        `${extractedQuestions.length} question(s) extracted successfully.`
      );
    } catch (err) {
      console.error(err);
      setError(
        err.message || "Unable to extract questions."
      );
    } finally {
      setLoading(false);
    }
  }

  function updateQuestion(id, field, value) {
    setQuestions((current) =>
      current.map((question) =>
        question.temp_id === id
          ? {
              ...question,
              [field]: value,
            }
          : question
      )
    );
  }

  function toggleQuestion(id) {
    setQuestions((current) =>
      current.map((question) =>
        question.temp_id === id
          ? {
              ...question,
              selected: !question.selected,
            }
          : question
      )
    );
  }

  function removeQuestion(id) {
    setQuestions((current) =>
      current.filter(
        (question) => question.temp_id !== id
      )
    );
  }

  function selectAll() {
    setQuestions((current) =>
      current.map((question) => ({
        ...question,
        selected: true,
      }))
    );
  }

  function clearAll() {
    setQuestions((current) =>
      current.map((question) => ({
        ...question,
        selected: false,
      }))
    );
  }

  async function handleSaveQuestions() {
    const selected = questions.filter(
      (question) => question.selected
    );

    if (selected.length === 0) {
      setError(
        "Please select at least one question to save."
      );
      return;
    }

    for (const question of selected) {
      if (
        !question.subject?.trim() ||
        !question.question_text?.trim() ||
        !question.question_type ||
        !question.difficulty ||
        !question.correct_answer?.trim()
      ) {
        setError(
          "Please complete all required fields before saving."
        );
        return;
      }

      if (
        !question.marks ||
        Number(question.marks) < 1
      ) {
        setError(
          "Each question must have at least 1 mark."
        );
        return;
      }

      if (
        question.question_type === "MCQ" &&
        (!question.option_a?.trim() ||
          !question.option_b?.trim() ||
          !question.option_c?.trim() ||
          !question.option_d?.trim())
      ) {
        setError(
          "MCQ questions must have all four options."
        );
        return;
      }
    }

    const token = localStorage.getItem("access_token");

    if (!token) {
      router.push("/login");
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");

    try {
      let savedCount = 0;

      for (const question of selected) {
        const payload = {
          subject: question.subject.trim(),
          question_text:
            question.question_text.trim(),
          question_type: question.question_type,
          difficulty: question.difficulty,
          option_a:
            question.option_a?.trim() || null,
          option_b:
            question.option_b?.trim() || null,
          option_c:
            question.option_c?.trim() || null,
          option_d:
            question.option_d?.trim() || null,
          correct_answer:
            question.correct_answer.trim(),
          marks: Number(question.marks),
        };

        const response = await fetch(
          `${API_URL}/exams/questions`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.detail ||
              `Unable to save question ${savedCount + 1}.`
          );
        }

        savedCount += 1;
      }

      setQuestions((current) =>
        current.filter((question) => !question.selected)
      );

      setMessage(
        `${savedCount} question(s) saved to your Question Bank successfully.`
      );
    } catch (err) {
      console.error(err);
      setError(
        err.message || "Unable to save questions."
      );
    } finally {
      setSaving(false);
    }
  }

  const selectedCount = questions.filter(
    (question) => question.selected
  ).length;

  return (
    <main className="import-page">
      <header className="import-header">
        <div className="import-header-left">
          <button
            className="back-button"
            onClick={() =>
              router.push("/examiner/questions")
            }
          >
            ← Question Bank
          </button>

          <div>
            <div className="brand-small">
              <span className="brand-icon">✦</span>
              AI Examination
            </div>

            <h1>Import Questions</h1>

            <p>
              Upload a document and turn it into
              examination questions.
            </p>
          </div>
        </div>

        <button
          className="dashboard-button"
          onClick={() => router.push("/examiner")}
        >
          Dashboard
        </button>
      </header>

      <section className="import-content">
        <div className="import-intro">
          <span className="section-label">
            QUESTION IMPORT
          </span>

          <h2>Import questions from a file</h2>

          <p>
            Upload your question document, review the
            extracted questions, make corrections, and
            save them to your Question Bank.
          </p>
        </div>

        <section className="upload-card">
          <div className="upload-icon">↑</div>

          <h3>Upload your question file</h3>

          <p>
            Supported files: PDF, Word, CSV and Excel.
          </p>

          <label className="file-picker">
            <input
              type="file"
              accept=".pdf,.docx,.csv,.xlsx,.xls"
              onChange={handleFileChange}
            />

            <span>
              {file
                ? file.name
                : "Choose a file"}
            </span>
          </label>

          {file && (
            <div className="selected-file">
              <span>✓</span>

              <div>
                <strong>{file.name}</strong>
                <small>
                  {(file.size / 1024).toFixed(1)} KB
                </small>
              </div>
            </div>
          )}

          <button
            className="extract-button"
            onClick={handleExtract}
            disabled={!file || loading}
          >
            {loading
              ? "Extracting questions..."
              : "Extract Questions →"}
          </button>

          <div className="supported-info">
            <div>
              <strong>PDF</strong>
              <span>Question documents</span>
            </div>

            <div>
              <strong>Word</strong>
              <span>.docx documents</span>
            </div>

            <div>
              <strong>Excel</strong>
              <span>.xlsx / .xls</span>
            </div>

            <div>
              <strong>CSV</strong>
              <span>Question data</span>
            </div>
          </div>
        </section>

        {error && (
          <div className="import-message error">
            <span>!</span>
            {error}
          </div>
        )}

        {message && (
          <div className="import-message success">
            <span>✓</span>
            {message}
          </div>
        )}

        {questions.length > 0 && (
          <section className="review-card">
            <div className="review-header">
              <div>
                <span className="section-label">
                  REVIEW
                </span>

                <h3>Review extracted questions</h3>

                <p>
                  Check the questions before adding
                  them to your Question Bank.
                </p>
              </div>

              <div className="review-count">
                <strong>{selectedCount}</strong>
                <span>
                  of {questions.length} selected
                </span>
              </div>
            </div>

            <div className="review-actions">
              <button
                className="small-button"
                onClick={selectAll}
              >
                Select All
              </button>

              <button
                className="small-button"
                onClick={clearAll}
              >
                Clear All
              </button>
            </div>

            <div className="review-list">
              {questions.map((question, index) => (
                <article
                  className={
                    question.selected
                      ? "review-question selected"
                      : "review-question"
                  }
                  key={question.temp_id}
                >
                  <div className="review-question-top">
                    <button
                      type="button"
                      className={
                        question.selected
                          ? "review-checkbox checked"
                          : "review-checkbox"
                      }
                      onClick={() =>
                        toggleQuestion(
                          question.temp_id
                        )
                      }
                    >
                      {question.selected ? "✓" : ""}
                    </button>

                    <div className="review-number">
                      Question {index + 1}
                    </div>

                    <button
                      type="button"
                      className="remove-question"
                      onClick={() =>
                        removeQuestion(
                          question.temp_id
                        )
                      }
                    >
                      Remove
                    </button>
                  </div>

                  <div className="review-grid">
                    <label>
                      Subject
                      <input
                        value={
                          question.subject || ""
                        }
                        onChange={(event) =>
                          updateQuestion(
                            question.temp_id,
                            "subject",
                            event.target.value
                          )
                        }
                      />
                    </label>

                    <label>
                      Question Type
                      <select
                        value={
                          question.question_type ||
                          "MCQ"
                        }
                        onChange={(event) =>
                          updateQuestion(
                            question.temp_id,
                            "question_type",
                            event.target.value
                          )
                        }
                      >
                        <option value="MCQ">
                          MCQ
                        </option>
                        <option value="True/False">
                          True/False
                        </option>
                        <option value="Short Answer">
                          Short Answer
                        </option>
                        <option value="Essay">
                          Essay
                        </option>
                      </select>
                    </label>

                    <label>
                      Difficulty
                      <select
                        value={
                          question.difficulty ||
                          "Medium"
                        }
                        onChange={(event) =>
                          updateQuestion(
                            question.temp_id,
                            "difficulty",
                            event.target.value
                          )
                        }
                      >
                        <option value="Easy">
                          Easy
                        </option>
                        <option value="Medium">
                          Medium
                        </option>
                        <option value="Hard">
                          Hard
                        </option>
                      </select>
                    </label>

                    <label>
                      Marks
                      <input
                        type="number"
                        min="1"
                        value={
                          question.marks || 1
                        }
                        onChange={(event) =>
                          updateQuestion(
                            question.temp_id,
                            "marks",
                            event.target.value
                          )
                        }
                      />
                    </label>
                  </div>

                  <label className="question-text-field">
                    Question
                    <textarea
                      rows="3"
                      value={
                        question.question_text || ""
                      }
                      onChange={(event) =>
                        updateQuestion(
                          question.temp_id,
                          "question_text",
                          event.target.value
                        )
                      }
                    />
                  </label>

                  {question.question_type ===
                    "MCQ" && (
                    <div className="options-grid">
                      <label>
                        Option A
                        <input
                          value={
                            question.option_a ||
                            ""
                          }
                          onChange={(event) =>
                            updateQuestion(
                              question.temp_id,
                              "option_a",
                              event.target.value
                            )
                          }
                        />
                      </label>

                      <label>
                        Option B
                        <input
                          value={
                            question.option_b ||
                            ""
                          }
                          onChange={(event) =>
                            updateQuestion(
                              question.temp_id,
                              "option_b",
                              event.target.value
                            )
                          }
                        />
                      </label>

                      <label>
                        Option C
                        <input
                          value={
                            question.option_c ||
                            ""
                          }
                          onChange={(event) =>
                            updateQuestion(
                              question.temp_id,
                              "option_c",
                              event.target.value
                            )
                          }
                        />
                      </label>

                      <label>
                        Option D
                        <input
                          value={
                            question.option_d ||
                            ""
                          }
                          onChange={(event) =>
                            updateQuestion(
                              question.temp_id,
                              "option_d",
                              event.target.value
                            )
                          }
                        />
                      </label>
                    </div>
                  )}

                  <label className="correct-answer">
                    Correct Answer
                    <input
                      value={
                        question.correct_answer ||
                        ""
                      }
                      onChange={(event) =>
                        updateQuestion(
                          question.temp_id,
                          "correct_answer",
                          event.target.value
                        )
                      }
                      placeholder="Example: A"
                    />
                  </label>
                </article>
              ))}
            </div>

            <div className="save-section">
              <div>
                <strong>
                  {selectedCount} question(s)
                  selected
                </strong>

                <span>
                  They will be added to your Question
                  Bank.
                </span>
              </div>

              <button
                className="save-button"
                onClick={handleSaveQuestions}
                disabled={
                  saving || selectedCount === 0
                }
              >
                {saving
                  ? "Saving questions..."
                  : "Save to Question Bank →"}
              </button>
            </div>
          </section>
        )}
      </section>
    </main>
  );
}