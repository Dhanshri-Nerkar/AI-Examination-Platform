"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import "./questions.css";

export default function QuestionsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const examFromUrl = searchParams.get("exam");

  const [user, setUser] = useState(null);

  const [questions, setQuestions] = useState([]);
  const [exams, setExams] = useState([]);

  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [selectedExam, setSelectedExam] = useState("");

  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  const [assignedQuestionIds, setAssignedQuestionIds] = useState([]);
  const [assignedQuestions, setAssignedQuestions] = useState([]);
  const [assignedLoading, setAssignedLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("All");
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [marksFilter, setMarksFilter] = useState("All");

  // ---------------------------------------------------------
  // AUTH + LOAD QUESTIONS + LOAD EXAMS
  // ---------------------------------------------------------

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const role = localStorage.getItem("role");

    if (!token || role !== "examiner") {
      router.push("/login");
      return;
    }

    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser(null);
      }
    }

    loadData(token);
  }, [router]);

  async function loadData(token) {
    try {
      setLoading(true);

      const [questionsResponse, examsResponse] = await Promise.all([
        fetch("http://127.0.0.1:8000/exams/questions/my-questions", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        }),

        fetch("http://127.0.0.1:8000/exams/my-exams", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        }),
      ]);

      if (questionsResponse.ok) {
        const questionData = await questionsResponse.json();

        setQuestions(
          Array.isArray(questionData)
            ? questionData
            : Array.isArray(questionData.questions)
            ? questionData.questions
            : []
        );
      } else {
        setQuestions([]);
      }

      if (examsResponse.ok) {
        const examData = await examsResponse.json();

        const safeExams = Array.isArray(examData)
          ? examData
          : Array.isArray(examData.exams)
          ? examData.exams
          : [];

        setExams(safeExams);

        if (examFromUrl) {
          const matchingExam = safeExams.find(
            (exam) => String(exam.id) === String(examFromUrl)
          );

          if (matchingExam) {
            setSelectedExam(String(matchingExam.id));
          }
        }
      } else {
        setExams([]);
      }
    } catch (error) {
      console.error("Failed to load question bank data:", error);
    } finally {
      setLoading(false);
    }
  }

  // ---------------------------------------------------------
  // SELECT EXAM
  // ---------------------------------------------------------

  function handleSelectExam(examId) {
    const id = String(examId);

    setSelectedExam(id);
    setSelectedQuestions([]);

    setSubjectFilter("All");
    setSearch("");
    setDifficultyFilter("All");
    setTypeFilter("All");
    setMarksFilter("All");

    router.push(`/examiner/questions?exam=${id}`);
  }

  // ---------------------------------------------------------
  // CHANGE EXAM
  // ---------------------------------------------------------

  function handleChangeExam() {
    setSelectedExam("");
    setSelectedQuestions([]);

    setAssignedQuestions([]);
    setAssignedQuestionIds([]);

    setSubjectFilter("All");
    setSearch("");
    setDifficultyFilter("All");
    setTypeFilter("All");
    setMarksFilter("All");

    router.push("/examiner/questions");
  }

  // ---------------------------------------------------------
  // CURRENT EXAM
  // ---------------------------------------------------------

  const currentExam = useMemo(() => {
    return exams.find(
      (exam) => String(exam.id) === String(selectedExam)
    );
  }, [exams, selectedExam]);

  // ---------------------------------------------------------
  // LOAD ASSIGNED QUESTIONS
  // ---------------------------------------------------------

  useEffect(() => {
    if (!selectedExam) {
      setAssignedQuestions([]);
      setAssignedQuestionIds([]);
      return;
    }

    const token = localStorage.getItem("access_token");

    if (!token) {
      return;
    }

    loadAssignedQuestions(token, selectedExam);
  }, [selectedExam]);

  async function loadAssignedQuestions(token, examId) {
    try {
      setAssignedLoading(true);

      const response = await fetch(
        `http://127.0.0.1:8000/exams/${examId}/questions`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        }
      );

      if (!response.ok) {
        setAssignedQuestions([]);
        setAssignedQuestionIds([]);
        return;
      }

      const data = await response.json();

      const safeData = Array.isArray(data)
        ? data
        : Array.isArray(data.questions)
        ? data.questions
        : [];

      setAssignedQuestions(safeData);

      setAssignedQuestionIds(
        safeData.map((item) =>
          String(item.question_id ?? item.id)
        )
      );
    } catch (error) {
      console.error("Failed to load assigned questions:", error);
      setAssignedQuestions([]);
      setAssignedQuestionIds([]);
    } finally {
      setAssignedLoading(false);
    }
  }

  // ---------------------------------------------------------
  // NORMALIZE QUESTION TYPE
  // ---------------------------------------------------------

  function normalizeQuestionType(type) {
    if (!type) return "";

    const value = String(type)
      .trim()
      .toLowerCase()
      .replace(/[_-]/g, " ");

    if (
      value === "mcq" ||
      value === "multiple choice" ||
      value === "multiple choice question"
    ) {
      return "mcq";
    }

    if (
      value === "true/false" ||
      value === "true false" ||
      value === "true or false" ||
      value === "truefalse"
    ) {
      return "true_false";
    }

    if (
      value === "short answer" ||
      value === "shortanswer" ||
      value === "short"
    ) {
      return "short_answer";
    }

    if (
      value === "long answer" ||
      value === "longanswer" ||
      value === "long" ||
      value === "essay"
    ) {
      return "long_answer";
    }

    return value;
  }

  // ---------------------------------------------------------
  // QUESTION PROGRESS
  // ---------------------------------------------------------

  const questionProgress = useMemo(() => {
    if (!currentExam) {
      return {
        mcq: 0,
        true_false: 0,
        short_answer: 0,
        long_answer: 0,
        total: 0,
      };
    }

    const assigned = Array.isArray(assignedQuestions)
      ? assignedQuestions
      : [];

    const selected = questions.filter((question) =>
      selectedQuestions.includes(question.id)
    );

    const assignedQuestionObjects = assigned
      .map((item) => {
        const questionId = item.question_id ?? item.id;
        return questions.find(
          (question) => String(question.id) === String(questionId)
        );
      })
      .filter(Boolean);

    const allQuestions = [...assignedQuestionObjects, ...selected];

    const counts = {
      mcq: 0,
      true_false: 0,
      short_answer: 0,
      long_answer: 0,
    };

    allQuestions.forEach((question) => {
      const type = normalizeQuestionType(question.question_type);
      if (counts[type] !== undefined) {
        counts[type]++;
      }
    });

    return {
      ...counts,
      total: allQuestions.length,
    };
  }, [
    assignedQuestions,
    questions,
    selectedQuestions,
    currentExam,
  ]);

  // ---------------------------------------------------------
  // FILTER VALUES
  // ---------------------------------------------------------

  const subjects = useMemo(() => {
    const values = questions
      .map((question) => question.subject)
      .filter(Boolean);

    return ["All", ...new Set(values)];
  }, [questions]);

  const difficulties = useMemo(() => {
    const values = questions
      .map((question) => question.difficulty)
      .filter(Boolean);

    return ["All", ...new Set(values)];
  }, [questions]);

  const questionTypes = useMemo(() => {
    return [
      "All",
      "MCQ",
      "True/False",
      "Short Answer",
      "Long Answer",
    ];
  }, []);

  const marksOptions = useMemo(() => {
    const values = questions
      .map((question) => question.marks)
      .filter(
        (value) =>
          value !== undefined &&
          value !== null &&
          value !== ""
      )
      .map(Number);

    return ["All", ...new Set(values)];
  }, [questions]);

  // ---------------------------------------------------------
  // FILTER QUESTIONS
  // ---------------------------------------------------------

  const selectableQuestions = useMemo(() => {
    return questions.filter((question) => {
      if (
        assignedQuestionIds.includes(
          String(question.id)
        )
      ) {
        return false;
      }

      const searchValue = search.trim().toLowerCase();

      if (searchValue) {
        const questionText = String(
          question.question_text || ""
        ).toLowerCase();

        const subject = String(
          question.subject || ""
        ).toLowerCase();

        if (
          !questionText.includes(searchValue) &&
          !subject.includes(searchValue)
        ) {
          return false;
        }
      }

      if (
        subjectFilter !== "All" &&
        question.subject !== subjectFilter
      ) {
        return false;
      }

      if (
        difficultyFilter !== "All" &&
        question.difficulty !== difficultyFilter
      ) {
        return false;
      }

      if (typeFilter !== "All") {
        const normalized = normalizeQuestionType(
          question.question_type
        );

        if (typeFilter === "MCQ" && normalized !== "mcq")
          return false;
        if (
          typeFilter === "True/False" &&
          normalized !== "true_false"
        )
          return false;
        if (
          typeFilter === "Short Answer" &&
          normalized !== "short_answer"
        )
          return false;
        if (
          typeFilter === "Long Answer" &&
          normalized !== "long_answer"
        )
          return false;
      }

      if (
        marksFilter !== "All" &&
        Number(question.marks) !== Number(marksFilter)
      ) {
        return false;
      }

      return true;
    });
  }, [
    questions,
    assignedQuestionIds,
    search,
    subjectFilter,
    difficultyFilter,
    typeFilter,
    marksFilter,
  ]);

  // ---------------------------------------------------------
  // CAN SELECT
  // ---------------------------------------------------------

  function canSelectQuestion(question) {
    if (!currentExam) return false;

    const questionId = String(question.id);

    if (assignedQuestionIds.includes(questionId)) return false;
    if (selectedQuestions.includes(question.id)) return true;

    if (
      questionProgress.total >=
      Number(currentExam.total_questions)
    ) {
      return false;
    }

    const type = normalizeQuestionType(question.question_type);

    if (
      type === "mcq" &&
      questionProgress.mcq >=
        Number(currentExam.mcq_questions || 0)
    )
      return false;

    if (
      type === "true_false" &&
      questionProgress.true_false >=
        Number(currentExam.true_false_questions || 0)
    )
      return false;

    if (
      type === "short_answer" &&
      questionProgress.short_answer >=
        Number(currentExam.short_answer_questions || 0)
    )
      return false;

    if (
      type === "long_answer" &&
      questionProgress.long_answer >=
        Number(currentExam.long_answer_questions || 0)
    )
      return false;

    return true;
  }

  // ---------------------------------------------------------
  // SELECT / UNSELECT
  // ---------------------------------------------------------

  function handleSelectQuestion(question) {
    const alreadySelected = selectedQuestions.includes(
      question.id
    );

    if (alreadySelected) {
      setSelectedQuestions((previous) =>
        previous.filter((id) => id !== question.id)
      );
      return;
    }

    if (!canSelectQuestion(question)) return;

    setSelectedQuestions((previous) => [
      ...previous,
      question.id,
    ]);
  }

  // ---------------------------------------------------------
  // SELECT ALL
  // ---------------------------------------------------------

  function handleSelectAll() {
    if (!currentExam) return;

    const newSelection = [];

    const counts = {
      mcq: questionProgress.mcq,
      true_false: questionProgress.true_false,
      short_answer: questionProgress.short_answer,
      long_answer: questionProgress.long_answer,
    };

    for (const question of selectableQuestions) {
      if (
        questionProgress.total + newSelection.length >=
        Number(currentExam.total_questions)
      ) {
        break;
      }

      const type = normalizeQuestionType(question.question_type);

      if (counts[type] === undefined) continue;

      let limit = 0;
      if (type === "mcq")
        limit = Number(currentExam.mcq_questions || 0);
      if (type === "true_false")
        limit = Number(currentExam.true_false_questions || 0);
      if (type === "short_answer")
        limit = Number(currentExam.short_answer_questions || 0);
      if (type === "long_answer")
        limit = Number(currentExam.long_answer_questions || 0);

      if (counts[type] >= limit) continue;

      newSelection.push(question.id);
      counts[type]++;
    }

    setSelectedQuestions(newSelection);
  }

  // ---------------------------------------------------------
  // ADD TO EXAM
  // ---------------------------------------------------------

  async function handleAddToExam() {
    if (!selectedExam) {
      alert("Please select an examination.");
      return;
    }

    if (selectedQuestions.length === 0) {
      alert("Please select at least one question.");
      return;
    }

    if (!currentExam) {
      alert("Selected examination was not found.");
      return;
    }

    if (
      questionProgress.total >
      Number(currentExam.total_questions)
    ) {
      alert(
        `You can add only ${currentExam.total_questions} questions in this examination.`
      );
      return;
    }

    const finalProgress = {
      mcq: questionProgress.mcq,
      true_false: questionProgress.true_false,
      short_answer: questionProgress.short_answer,
      long_answer: questionProgress.long_answer,
    };

    if (
      finalProgress.mcq >
      Number(currentExam.mcq_questions || 0)
    ) {
      alert("MCQ question limit exceeded.");
      return;
    }

    if (
      finalProgress.true_false >
      Number(currentExam.true_false_questions || 0)
    ) {
      alert("True/False question limit exceeded.");
      return;
    }

    if (
      finalProgress.short_answer >
      Number(currentExam.short_answer_questions || 0)
    ) {
      alert("Short Answer question limit exceeded.");
      return;
    }

    if (
      finalProgress.long_answer >
      Number(currentExam.long_answer_questions || 0)
    ) {
      alert("Long Answer question limit exceeded.");
      return;
    }

    try {
      setAdding(true);

      const token = localStorage.getItem("access_token");

      const response = await fetch(
        `http://127.0.0.1:8000/exams/${selectedExam}/questions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            exam_id: Number(selectedExam),
            question_ids: selectedQuestions,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
            "Failed to add questions to examination."
        );
      }

      await loadAssignedQuestions(token, selectedExam);
      setSelectedQuestions([]);
      await loadData(token);

      const assignedResponse = await fetch(
        `http://127.0.0.1:8000/exams/${selectedExam}/questions`,
        {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        }
      );

      if (assignedResponse.ok) {
        const assignedData = await assignedResponse.json();

        const safeAssigned = Array.isArray(assignedData)
          ? assignedData
          : Array.isArray(assignedData.questions)
          ? assignedData.questions
          : [];

        if (
          safeAssigned.length ===
          Number(currentExam.total_questions)
        ) {
          alert(
            `✓ Done! All ${currentExam.total_questions} questions have been added.`
          );
        } else {
          alert("Questions added successfully.");
        }
      } else {
        alert("Questions added successfully.");
      }
    } catch (error) {
      console.error("Failed to add questions:", error);
      alert(
        error.message ||
          "Failed to add questions to examination."
      );
    } finally {
      setAdding(false);
    }
  }

  // ---------------------------------------------------------
  // RESET FILTERS
  // ---------------------------------------------------------

  function clearFilters() {
    setSearch("");
    setSubjectFilter("All");
    setDifficultyFilter("All");
    setTypeFilter("All");
    setMarksFilter("All");
  }

  // ---------------------------------------------------------
  // LOADING
  // ---------------------------------------------------------

  if (loading) {
    return (
      <div className="questions-page">
        <div className="questions-loading">
          <div className="loading-card">
            <div className="loading-spinner"></div>
            <p>Loading Question Bank...</p>
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------
  // EXAM SELECTION SCREEN
  // ---------------------------------------------------------

  if (!selectedExam) {
    return (
      <div className="questions-page">
        <main className="questions-content">

          <div className="questions-hero">
            <div className="questions-hero-icon">📝</div>

            <div className="questions-hero-content">
              <p className="section-label">EXAMINER</p>

              <h1>Question Bank</h1>

              <p>
                Select an examination to add and
                manage its questions.
              </p>
            </div>

            <div className="questions-hero-count">
              <strong>{exams.length}</strong>
              <span>
                {exams.length === 1
                  ? "Examination"
                  : "Examinations"}
              </span>
            </div>
          </div>

          {exams.length === 0 ? (
            <div className="empty-question-state">
              <div className="empty-icon">📋</div>

              <h3>No examinations found</h3>

              <p>
                Create an examination first before
                adding questions.
              </p>

              <button
                className="primary-button"
                onClick={() =>
                  router.push("/examiner/create-exam")
                }
              >
                + Create Examination
              </button>
            </div>
          ) : (
            <div className="exam-selection-section">
              <div className="exam-selection-grid">
                {exams.map((exam) => (
                  <div className="exam-card" key={exam.id}>
                    <div className="exam-card-top">
                      <div className="exam-icon">📝</div>

                      <span
                        className={`exam-status ${
                          exam.is_published
                            ? "published"
                            : "draft"
                        }`}
                      >
                        {exam.is_published
                          ? "Published"
                          : "Draft"}
                      </span>
                    </div>

                    <h3>{exam.exam_name}</h3>

                    <p className="exam-subject">
                      {exam.subject}
                    </p>

                    <div className="exam-card-details">
                      <div>
                        <span>Questions</span>
                        <strong>{exam.total_questions}</strong>
                      </div>

                      <div>
                        <span>Marks</span>
                        <strong>{exam.maximum_marks}</strong>
                      </div>

                      <div>
                        <span>Duration</span>
                        <strong>
                          {exam.duration_minutes} min
                        </strong>
                      </div>
                    </div>

                    <div className="exam-type-summary">
                      <span>
                        MCQ {exam.mcq_questions || 0}
                      </span>
                      <span>
                        T/F {exam.true_false_questions || 0}
                      </span>
                      <span>
                        Short{" "}
                        {exam.short_answer_questions || 0}
                      </span>
                      <span>
                        Long{" "}
                        {exam.long_answer_questions || 0}
                      </span>
                    </div>

                    <button
                      className="select-exam-button"
                      onClick={() =>
                        handleSelectExam(exam.id)
                      }
                    >
                      Select Examination →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    );
  }

  // ---------------------------------------------------------
  // MAIN QUESTION BANK
  // ---------------------------------------------------------

  return (
    <div className="questions-page">
      <main className="questions-content">

        <div className="questions-hero">
          <div className="questions-hero-icon">📝</div>

          <div className="questions-hero-content">
            <p className="section-label">EXAMINER</p>

            <h1>{currentExam?.exam_name || "Question Bank"}</h1>

            <p>
              Create, select and add questions to
              your examination.
            </p>
          </div>
        </div>

        <div className="selected-exam-banner">
          <div className="selected-exam-banner-left">
            <div className="selected-exam-icon">📝</div>

            <div>
              <span className="section-label">
                SELECTED EXAMINATION
              </span>

              <h2>{currentExam?.exam_name}</h2>

              <p>
                {currentExam?.subject} •{" "}
                {currentExam?.duration_minutes} minutes
              </p>
            </div>
          </div>

          <button
            className="secondary-button"
            onClick={handleChangeExam}
          >
            Change Examination
          </button>
        </div>

        {currentExam && (
          <div className="question-progress-card">
            <div className="question-progress-header">
              <div>
                <span className="section-label">
                  QUESTION REQUIREMENTS
                </span>

                <h3>Examination Question Progress</h3>
              </div>

              <div className="question-progress-total">
                <strong>{questionProgress.total}</strong>
                <span>/ {currentExam.total_questions}</span>
                <small>Total</small>
              </div>
            </div>

            <div className="question-progress-items">
              <div className="question-progress-item">
                <div className="question-progress-item-header">
                  <span>MCQ</span>
                  <strong>
                    {questionProgress.mcq} /{" "}
                    {currentExam.mcq_questions || 0}
                  </strong>
                </div>

                <div className="question-progress-bar">
                  <div
                    className="question-progress-fill"
                    style={{
                      width: `${
                        currentExam.mcq_questions
                          ? Math.min(
                              100,
                              (questionProgress.mcq /
                                currentExam.mcq_questions) *
                                100
                            )
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>

              <div className="question-progress-item">
                <div className="question-progress-item-header">
                  <span>True/False</span>
                  <strong>
                    {questionProgress.true_false} /{" "}
                    {currentExam.true_false_questions || 0}
                  </strong>
                </div>

                <div className="question-progress-bar">
                  <div
                    className="question-progress-fill"
                    style={{
                      width: `${
                        currentExam.true_false_questions
                          ? Math.min(
                              100,
                              (questionProgress.true_false /
                                currentExam.true_false_questions) *
                                100
                            )
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>

              <div className="question-progress-item">
                <div className="question-progress-item-header">
                  <span>Short Answer</span>
                  <strong>
                    {questionProgress.short_answer} /{" "}
                    {currentExam.short_answer_questions || 0}
                  </strong>
                </div>

                <div className="question-progress-bar">
                  <div
                    className="question-progress-fill"
                    style={{
                      width: `${
                        currentExam.short_answer_questions
                          ? Math.min(
                              100,
                              (questionProgress.short_answer /
                                currentExam.short_answer_questions) *
                                100
                            )
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>

              <div className="question-progress-item">
                <div className="question-progress-item-header">
                  <span>Long Answer</span>
                  <strong>
                    {questionProgress.long_answer} /{" "}
                    {currentExam.long_answer_questions || 0}
                  </strong>
                </div>

                <div className="question-progress-bar">
                  <div
                    className="question-progress-fill"
                    style={{
                      width: `${
                        currentExam.long_answer_questions
                          ? Math.min(
                              100,
                              (questionProgress.long_answer /
                                currentExam.long_answer_questions) *
                                100
                            )
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="assign-card">
          <div className="assign-card-info">
            <span className="section-label">ADD QUESTIONS</span>

            <h3>Build Your Examination Paper</h3>

            <p>
              Select questions from your question
              bank and add them to this examination.
            </p>
          </div>

          <div className="assign-card-controls">
            <button
              className="secondary-button"
              onClick={() =>
                router.push(
                  `/examiner/questions/create?exam=${selectedExam}`
                )
              }
            >
              + Create Question
            </button>

            <button
              className="secondary-button"
              onClick={() =>
                router.push(
                  `/examiner/questions/import?exam=${selectedExam}`
                )
              }
            >
              ↑ Import Questions
            </button>

            <button
              className="primary-button assign-button"
              onClick={handleAddToExam}
              disabled={
                adding || selectedQuestions.length === 0
              }
            >
              {adding
                ? "Adding..."
                : `Add Selected (${selectedQuestions.length})`}
            </button>
          </div>
        </div>

        <div className="bank-card">
          <div className="bank-card-header">
            <div>
              <span className="section-label">QUESTION BANK</span>

              <h2>Available Questions</h2>

              <p>
                Questions already assigned to this
                examination are hidden.
              </p>
            </div>

            <div className="question-actions">
              <button
                className="primary-button"
                onClick={() =>
                  router.push(
                    `/examiner/questions/create?exam=${selectedExam}`
                  )
                }
              >
                + Create Question
              </button>

              <button
                className="secondary-button"
                onClick={() =>
                  router.push(
                    `/examiner/questions/import?exam=${selectedExam}`
                  )
                }
              >
                ↑ Import
              </button>
            </div>
          </div>

          <div className="search-box">
            <span>🔍</span>

            <input
              type="text"
              placeholder="Search questions or subjects..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />
          </div>

          <div className="advanced-filters">
            <div className="filter-group">
              <label>Subject</label>
              <select
                value={subjectFilter}
                onChange={(event) =>
                  setSubjectFilter(event.target.value)
                }
              >
                {subjects.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Difficulty</label>
              <select
                value={difficultyFilter}
                onChange={(event) =>
                  setDifficultyFilter(event.target.value)
                }
              >
                {difficulties.map((difficulty) => (
                  <option key={difficulty} value={difficulty}>
                    {difficulty}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Question Type</label>
              <select
                value={typeFilter}
                onChange={(event) =>
                  setTypeFilter(event.target.value)
                }
              >
                {questionTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Marks</label>
              <select
                value={marksFilter}
                onChange={(event) =>
                  setMarksFilter(event.target.value)
                }
              >
                {marksOptions.map((marks) => (
                  <option key={marks} value={marks}>
                    {marks === "All"
                      ? "All"
                      : `${marks} Marks`}
                  </option>
                ))}
              </select>
            </div>

            <button
              className="clear-filter-button"
              onClick={clearFilters}
            >
              Clear Filters
            </button>
          </div>

          <div className="filter-result-bar">
            <span>
              Showing{" "}
              <strong>{selectableQuestions.length}</strong>{" "}
              available question
              {selectableQuestions.length !== 1 ? "s" : ""}
            </span>

            {selectableQuestions.length > 0 && (
              <button
                className="select-all-button"
                onClick={handleSelectAll}
              >
                Select Available
              </button>
            )}
          </div>

          {assignedLoading ? (
            <div className="questions-loading">
              <div className="loading-card">
                <div className="loading-spinner"></div>
                <p>Loading assigned questions...</p>
              </div>
            </div>
          ) : selectableQuestions.length === 0 ? (
            <div className="empty-question-state">
              <div className="empty-icon">📚</div>

              {questions.length === 0 ? (
                <>
                  <h3>Your question bank is empty</h3>
                  <p>
                    Create your first question or import
                    questions to start building the
                    examination.
                  </p>
                  <button
                    className="primary-button"
                    onClick={() =>
                      router.push(
                        `/examiner/questions/create?exam=${selectedExam}`
                      )
                    }
                  >
                    + Create Question
                  </button>
                </>
              ) : questionProgress.total >=
                Number(currentExam?.total_questions || 0) ? (
                <>
                  <h3>All questions have been added</h3>
                  <p>
                    This examination already has the
                    required number of questions.
                  </p>
                </>
              ) : (
                <>
                  <h3>No matching questions</h3>
                  <p>Try changing your search or filters.</p>
                  <button
                    className="secondary-button"
                    onClick={clearFilters}
                  >
                    Clear Filters
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="questions-list">
              {selectableQuestions.map((question, index) => {
                const isSelected = selectedQuestions.includes(
                  question.id
                );

                const canSelect = canSelectQuestion(question);

                const normalizedType = normalizeQuestionType(
                  question.question_type
                );

                return (
                  <div
                    key={question.id}
                    className={`question-item ${
                      isSelected ? "selected" : ""
                    } ${!canSelect ? "disabled" : ""}`}
                  >
                    <div className="question-checkbox">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        disabled={!canSelect && !isSelected}
                        onChange={() =>
                          handleSelectQuestion(question)
                        }
                      />
                    </div>

                    <div className="question-main">
                      <div className="question-meta">
                        <span className="subject-badge">
                          {question.subject || "General"}
                        </span>

                        <span className="difficulty-badge">
                          {question.difficulty || "N/A"}
                        </span>

                        <span className="type-badge">
                          {normalizedType === "mcq"
                            ? "MCQ"
                            : normalizedType === "true_false"
                            ? "True/False"
                            : normalizedType === "short_answer"
                            ? "Short Answer"
                            : normalizedType === "long_answer"
                            ? "Long Answer"
                            : question.question_type}
                        </span>
                      </div>

                      <div className="question-text">
                        <strong>Q{index + 1}.</strong>{" "}
                        {question.question_text}
                      </div>

                      {normalizedType === "mcq" && (
                        <div className="question-options">
                          {question.option_a && (
                            <span>A. {question.option_a}</span>
                          )}
                          {question.option_b && (
                            <span>B. {question.option_b}</span>
                          )}
                          {question.option_c && (
                            <span>C. {question.option_c}</span>
                          )}
                          {question.option_d && (
                            <span>D. {question.option_d}</span>
                          )}
                        </div>
                      )}

                      <div className="question-footer">
                        <span>
                          Marks:{" "}
                          <strong>{question.marks}</strong>
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}