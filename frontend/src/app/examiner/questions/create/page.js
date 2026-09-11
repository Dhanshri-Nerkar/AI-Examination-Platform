"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./create-question.css";

export default function CreateQuestionPage() {
  const router = useRouter();

  const [user, setUser] = useState(null);

  const [subject, setSubject] = useState("");
  const [questionType, setQuestionType] = useState("MCQ");
  const [difficulty, setDifficulty] = useState("Medium");
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [marks, setMarks] = useState("1");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const role = localStorage.getItem("role");

    if (!token || role !== "examiner") {
      router.push("/login");
      return;
    }

    setUser({ role });
  }, [router]);

  function updateOption(index, value) {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);

    // If the selected correct answer is changed,
    // keep the selected answer updated.
    if (correctAnswer === options[index]) {
      setCorrectAnswer(value);
    }
  }

  async function handleSaveQuestion(event) {
    event.preventDefault();

    setError("");

    if (!subject.trim()) {
      setError("Please enter the subject.");
      return;
    }

    if (!questionText.trim()) {
      setError("Please enter the question.");
      return;
    }

    if (!marks || Number(marks) <= 0) {
      setError("Marks must be greater than 0.");
      return;
    }

    if (questionType === "MCQ") {
      if (options.some((option) => !option.trim())) {
        setError("Please fill in all four options.");
        return;
      }

      if (!correctAnswer) {
        setError("Please select the correct answer.");
        return;
      }
    }

    if (questionType === "True/False" && !correctAnswer) {
      setError("Please select True or False.");
      return;
    }

    if (
      (questionType === "Short Answer" ||
        questionType === "Long Answer") &&
      !correctAnswer.trim()
    ) {
      setError("Please enter the expected answer.");
      return;
    }

    const token = localStorage.getItem("access_token");

    if (!token) {
      router.push("/login");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/exams/questions",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            subject: subject.trim(),
            question_text: questionText.trim(),
            question_type: questionType,
            difficulty: difficulty,

            option_a:
              questionType === "MCQ"
                ? options[0].trim()
                : null,

            option_b:
              questionType === "MCQ"
                ? options[1].trim()
                : null,

            option_c:
              questionType === "MCQ"
                ? options[2].trim()
                : null,

            option_d:
              questionType === "MCQ"
                ? options[3].trim()
                : null,

            correct_answer: correctAnswer.trim(),

            marks: Number(marks),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Unable to save the question."
        );
      }

      alert("Question saved successfully.");

      router.push("/examiner/questions");
    } catch (error) {
      setError(
        error.message || "Something went wrong while saving."
      );
    } finally {
      setSaving(false);
    }
  }

  if (!user) {
    return (
      <main className="create-question-loading">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </main>
    );
  }

  return (
    <main className="create-question-page">
      <header className="create-question-header">
        <button
          className="back-button"
          onClick={() => router.push("/examiner/questions")}
        >
          ← Question Bank
        </button>

        <div>
          <div className="brand-small">
            <span>✦</span>
            AI Examination
          </div>

          <h1>Create Question</h1>

          <p>
            Add a new question to your question bank
          </p>
        </div>

        <div></div>
      </header>

      <section className="create-question-content">
        <div className="page-intro">
          <span>QUESTION BANK</span>

          <h2>Create a new question</h2>

          <p>
            Add the question details below. You can use this
            question later when creating an examination.
          </p>
        </div>

        <form
          className="question-form-card"
          onSubmit={handleSaveQuestion}
        >
          {error && (
            <div className="error-message">
              <span>!</span>
              {error}
            </div>
          )}

          <div className="form-section">
            <div className="form-section-title">
              <div className="section-icon">01</div>

              <div>
                <h3>Question Details</h3>

                <p>
                  Basic information about the question.
                </p>
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label>
                  Subject <span>*</span>
                </label>

                <input
                  type="text"
                  placeholder="e.g. Mathematics"
                  value={subject}
                  onChange={(e) =>
                    setSubject(e.target.value)
                  }
                />
              </div>

              <div className="form-group">
                <label>Question Type</label>

                <select
                  value={questionType}
                  onChange={(e) => {
                    setQuestionType(e.target.value);
                    setCorrectAnswer("");
                  }}
                >
                  <option value="MCQ">
                    Multiple Choice (MCQ)
                  </option>

                  <option value="True/False">
                    True / False
                  </option>

                  <option value="Short Answer">
                    Short Answer
                  </option>

                  <option value="Long Answer">
                    Long Answer
                  </option>
                </select>
              </div>

              <div className="form-group">
                <label>Difficulty</label>

                <select
                  value={difficulty}
                  onChange={(e) =>
                    setDifficulty(e.target.value)
                  }
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              <div className="form-group">
                <label>
                  Marks <span>*</span>
                </label>

                <input
                  type="number"
                  min="1"
                  value={marks}
                  onChange={(e) =>
                    setMarks(e.target.value)
                  }
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <div className="form-section-title">
              <div className="section-icon">02</div>

              <div>
                <h3>Question</h3>

                <p>
                  Write the question students will see.
                </p>
              </div>
            </div>

            <div className="form-group">
              <label>
                Question Text <span>*</span>
              </label>

              <textarea
                rows="6"
                placeholder="Enter your question here..."
                value={questionText}
                onChange={(e) =>
                  setQuestionText(e.target.value)
                }
              />
            </div>
          </div>

          {questionType === "MCQ" && (
            <div className="form-section">
              <div className="form-section-title">
                <div className="section-icon">03</div>

                <div>
                  <h3>Answer Options</h3>

                  <p>
                    Enter four options and select the correct
                    answer.
                  </p>
                </div>
              </div>

              <div className="options-grid">
                {options.map((option, index) => (
                  <div
                    className="option-group"
                    key={index}
                  >
                    <label>
                      Option{" "}
                      {String.fromCharCode(65 + index)}
                    </label>

                    <div className="option-input-row">
                      <input
                        type="text"
                        placeholder={`Enter option ${String.fromCharCode(
                          65 + index
                        )}`}
                        value={option}
                        onChange={(e) =>
                          updateOption(
                            index,
                            e.target.value
                          )
                        }
                      />

                      <button
                        type="button"
                        className={
                          correctAnswer === option &&
                          option !== ""
                            ? "correct-button selected"
                            : "correct-button"
                        }
                        onClick={() =>
                          setCorrectAnswer(option)
                        }
                      >
                        {correctAnswer === option &&
                        option !== ""
                          ? "✓ Correct"
                          : "Correct"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {questionType === "True/False" && (
            <div className="form-section">
              <div className="form-section-title">
                <div className="section-icon">03</div>

                <div>
                  <h3>Correct Answer</h3>

                  <p>
                    Select the correct answer.
                  </p>
                </div>
              </div>

              <div className="answer-choice-row">
                <button
                  type="button"
                  className={
                    correctAnswer === "True"
                      ? "answer-choice selected"
                      : "answer-choice"
                  }
                  onClick={() =>
                    setCorrectAnswer("True")
                  }
                >
                  ✓ True
                </button>

                <button
                  type="button"
                  className={
                    correctAnswer === "False"
                      ? "answer-choice selected"
                      : "answer-choice"
                  }
                  onClick={() =>
                    setCorrectAnswer("False")
                  }
                >
                  ✕ False
                </button>
              </div>
            </div>
          )}

          {(questionType === "Short Answer" ||
            questionType === "Long Answer") && (
            <div className="form-section">
              <div className="form-section-title">
                <div className="section-icon">03</div>

                <div>
                  <h3>Expected Answer</h3>

                  <p>
                    Add the expected answer for reference.
                  </p>
                </div>
              </div>

              <div className="form-group">
                <textarea
                  rows="4"
                  placeholder="Enter the expected answer..."
                  value={correctAnswer}
                  onChange={(e) =>
                    setCorrectAnswer(e.target.value)
                  }
                />
              </div>
            </div>
          )}

          <div className="form-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={() =>
                router.push("/examiner/questions")
              }
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="save-button"
              disabled={saving}
            >
              {saving ? (
                <>
                  <span className="button-spinner"></span>
                  Saving...
                </>
              ) : (
                <>
                  Save Question
                  <span>→</span>
                </>
              )}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}