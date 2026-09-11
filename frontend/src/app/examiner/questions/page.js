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

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [subjectFilter, setSubjectFilter] = useState("All");
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [marksFilter, setMarksFilter] = useState("All");

  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [selectedExam, setSelectedExam] = useState("");

  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const role = localStorage.getItem("role");

    if (!token || role !== "examiner") {
      router.push("/login");
      return;
    }

    setUser({ role });
    loadData(token);
  }, [router]);

  async function loadData(token) {
    try {
      setLoading(true);

      const [questionsResponse, examsResponse] =
        await Promise.all([
          fetch(
            "http://127.0.0.1:8000/exams/questions/my-questions",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          ),

          fetch(
            "http://127.0.0.1:8000/exams/my-exams",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          ),
        ]);

      const questionsData =
        await questionsResponse.json();

      const examsData =
        await examsResponse.json();

      if (!questionsResponse.ok) {
        throw new Error(
          questionsData.detail ||
            "Unable to load questions."
        );
      }

      if (!examsResponse.ok) {
        throw new Error(
          examsData.detail ||
            "Unable to load examinations."
        );
      }

      setQuestions(questionsData);
      setExams(examsData);

      if (examFromUrl) {
        const examExists = examsData.some(
          (exam) =>
            String(exam.id) ===
            String(examFromUrl)
        );

        if (examExists) {
          setSelectedExam(examFromUrl);

          const selectedExamData =
            examsData.find(
              (exam) =>
                String(exam.id) ===
                String(examFromUrl)
            );

          if (selectedExamData?.subject) {
            setSubjectFilter(
              selectedExamData.subject
            );
          }
        }
      }
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("role");

    router.push("/login");
  }

  function handleSelectQuestion(id) {
    setSelectedQuestions((current) => {
      if (current.includes(id)) {
        return current.filter(
          (questionId) =>
            questionId !== id
        );
      }

      return [...current, id];
    });
  }

  function handleSelectAll() {
    const filteredIds =
      filteredQuestions.map(
        (question) => question.id
      );

    const allSelected =
      filteredIds.every((id) =>
        selectedQuestions.includes(id)
      );

    if (allSelected) {
      setSelectedQuestions((current) =>
        current.filter(
          (id) =>
            !filteredIds.includes(id)
        )
      );
    } else {
      setSelectedQuestions((current) => [
        ...new Set([
          ...current,
          ...filteredIds,
        ]),
      ]);
    }
  }

  function clearFilters() {
    setSearch("");
    setSubjectFilter("All");
    setDifficultyFilter("All");
    setTypeFilter("All");
    setMarksFilter("All");
  }

  function handleExamChange(event) {
    const examId = event.target.value;

    setSelectedExam(examId);

    if (!examId) {
      setSubjectFilter("All");
      return;
    }

    const exam = exams.find(
      (item) =>
        String(item.id) ===
        String(examId)
    );

    if (!exam) {
      return;
    }

    if (exam.subject) {
      setSubjectFilter(exam.subject);
    }
  }

  async function handleAddToExam() {
    if (!selectedExam) {
      alert("Please select an examination.");
      return;
    }

    if (selectedQuestions.length === 0) {
      alert(
        "Please select at least one question."
      );
      return;
    }

    const exam = exams.find(
      (item) =>
        String(item.id) ===
        String(selectedExam)
    );

    if (!exam) {
      alert(
        "Selected examination could not be found."
      );
      return;
    }

    if (
      selectedQuestions.length >
      exam.total_questions
    ) {
      alert(
        `This examination allows ${exam.total_questions} question(s).`
      );
      return;
    }

    const invalidSubjectQuestion =
      questions.find(
        (question) =>
          selectedQuestions.includes(
            question.id
          ) &&
          question.subject.toLowerCase() !==
            exam.subject.toLowerCase()
      );

    if (invalidSubjectQuestion) {
      alert(
        `Question "${invalidSubjectQuestion.question_text}" does not belong to the ${exam.subject} subject.`
      );
      return;
    }

    const token =
      localStorage.getItem(
        "access_token"
      );

    setAdding(true);

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/exams/${selectedExam}/questions`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            exam_id: Number(selectedExam),
            question_ids:
              selectedQuestions,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
            "Unable to add questions to the examination."
        );
      }

      alert(
        `${selectedQuestions.length} question(s) added successfully.`
      );

      setSelectedQuestions([]);
      setSelectedExam("");
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setAdding(false);
    }
  }

  const subjects = useMemo(() => {
    return [
      ...new Set(
        questions
          .map(
            (question) =>
              question.subject
          )
          .filter(Boolean)
      ),
    ].sort();
  }, [questions]);

  const questionTypes = useMemo(() => {
    return [
      ...new Set(
        questions
          .map(
            (question) =>
              question.question_type
          )
          .filter(Boolean)
      ),
    ].sort();
  }, [questions]);

  const markValues = useMemo(() => {
    return [
      ...new Set(
        questions
          .map(
            (question) =>
              question.marks
          )
          .filter(
            (marks) =>
              marks !== null &&
              marks !== undefined
          )
      ),
    ].sort((a, b) => a - b);
  }, [questions]);

  const filteredQuestions = useMemo(() => {
    return questions.filter((question) => {
      const searchText =
        search.trim().toLowerCase();

      const questionText =
        question.question_text?.toLowerCase() ||
        "";

      const subject =
        question.subject?.toLowerCase() ||
        "";

      const matchesSearch =
        !searchText ||
        questionText.includes(searchText) ||
        subject.includes(searchText);

      const matchesSubject =
        subjectFilter === "All" ||
        question.subject ===
          subjectFilter;

      const matchesDifficulty =
        difficultyFilter === "All" ||
        question.difficulty ===
          difficultyFilter;

      const matchesType =
        typeFilter === "All" ||
        question.question_type ===
          typeFilter;

      const matchesMarks =
        marksFilter === "All" ||
        String(question.marks) ===
          String(marksFilter);

      return (
        matchesSearch &&
        matchesSubject &&
        matchesDifficulty &&
        matchesType &&
        matchesMarks
      );
    });
  }, [
    questions,
    search,
    subjectFilter,
    difficultyFilter,
    typeFilter,
    marksFilter,
  ]);

  const allFilteredSelected =
    filteredQuestions.length > 0 &&
    filteredQuestions.every(
      (question) =>
        selectedQuestions.includes(
          question.id
        )
    );

  const selectedExamObject =
    exams.find(
      (exam) =>
        String(exam.id) ===
        String(selectedExam)
    );

  if (!user) {
    return (
      <main className="questions-loading">
        <div className="loading-card">
          <div className="loading-spinner"></div>
          <p>Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="questions-page">
      <header className="questions-header">
        <div className="header-left">
          <button
            className="back-button"
            onClick={() =>
              router.push("/examiner")
            }
          >
            ← Dashboard
          </button>

          <div>
            <div className="brand-small">
              <span className="brand-icon">
                ✦
              </span>

              AI Examination
            </div>

            <h1>Question Bank</h1>

            <p>
              Create and manage examination
              questions
            </p>
          </div>
        </div>

        <button
          className="logout-button"
          onClick={handleLogout}
        >
          Logout
        </button>
      </header>

      <section className="questions-content">

        {/* =========================
            INTRO
        ========================= */}

        <div className="intro-section">
          <div>
            <span className="section-label">
              QUESTION MANAGEMENT
            </span>

            <h2>Your Question Bank</h2>

            <p>
              Find the right questions using
              filters and add them to an
              examination.
            </p>
          </div>

          <div className="question-count">
            <span>
              {selectedQuestions.length}
            </span>

            <small>Selected</small>
          </div>
        </div>


        {/* =========================
            ASSIGN QUESTIONS
            MOVED TO TOP
        ========================= */}

        {selectedQuestions.length > 0 && (
          <section className="assign-card">

            <div className="assign-info">

              <div className="next-icon">
                ✓
              </div>

              <div>
                <h3>
                  Add questions to an
                  examination
                </h3>

                <p>
                  {selectedQuestions.length}{" "}
                  question
                  {selectedQuestions.length > 1
                    ? "s are"
                    : " is"}{" "}
                  selected.
                </p>
              </div>

            </div>


            <div className="assign-controls">

              <select
                value={selectedExam}
                onChange={handleExamChange}
                className="exam-select"
              >

                <option value="">
                  Select Examination
                </option>

                {exams.map((exam) => (
                  <option
                    key={exam.id}
                    value={exam.id}
                  >
                    {exam.exam_name} —{" "}
                    {exam.subject} —{" "}
                    {exam.total_questions}{" "}
                    questions
                  </option>
                ))}

              </select>


              <button
                className="assign-button"
                onClick={handleAddToExam}
                disabled={adding}
              >
                {adding
                  ? "Adding..."
                  : "Add to Examination →"}
              </button>

            </div>


            {selectedExamObject && (
              <div className="selected-exam-info">

                <strong>
                  {selectedExamObject.exam_name}
                </strong>

                <span>
                  Subject:{" "}
                  {selectedExamObject.subject}
                </span>

                <span>
                  Required questions:{" "}
                  {
                    selectedExamObject.total_questions
                  }
                </span>

                <span>
                  Selected:{" "}
                  {selectedQuestions.length}
                </span>

              </div>
            )}


            {exams.length === 0 && (
              <p className="no-exams-message">
                You haven't created an
                examination yet. Create one
                first from the Examiner
                Dashboard.
              </p>
            )}

          </section>
        )}


        {/* =========================
            QUESTION BANK
        ========================= */}

        <section className="bank-card">

          <div className="bank-header">

            <div>
              <span className="section-label">
                QUESTIONS
              </span>

              <h3>
                Available Questions
              </h3>

              <p>
                Questions saved in your
                question bank.
              </p>
            </div>

            <div className="question-actions">

  <button
    className="secondary-button"
    onClick={() =>
      router.push("/examiner/questions/import")
    }
  >
    ↑ Import Questions
  </button>

  <button
    className="primary-button"
    onClick={() =>
      router.push("/examiner/questions/create")
    }
  >
    + Create Question
  </button>

</div>

          </div>


          {/* SEARCH */}

          <div className="search-box">

            <span>⌕</span>

            <input
              type="text"
              placeholder="Search by question or subject..."
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
            />

          </div>


          {/* FILTERS */}

          <div className="advanced-filters">

            <div className="filter-group">

              <label>
                Subject
              </label>

              <select
                value={subjectFilter}
                onChange={(event) =>
                  setSubjectFilter(
                    event.target.value
                  )
                }
              >

                <option value="All">
                  All Subjects
                </option>

                {subjects.map(
                  (subject) => (
                    <option
                      key={subject}
                      value={subject}
                    >
                      {subject}
                    </option>
                  )
                )}

              </select>

            </div>


            <div className="filter-group">

              <label>
                Difficulty
              </label>

              <select
                value={difficultyFilter}
                onChange={(event) =>
                  setDifficultyFilter(
                    event.target.value
                  )
                }
              >

                <option value="All">
                  All Difficulties
                </option>

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

            </div>


            <div className="filter-group">

              <label>
                Question Type
              </label>

              <select
                value={typeFilter}
                onChange={(event) =>
                  setTypeFilter(
                    event.target.value
                  )
                }
              >

                <option value="All">
                  All Types
                </option>

                {questionTypes.map(
                  (type) => (
                    <option
                      key={type}
                      value={type}
                    >
                      {type}
                    </option>
                  )
                )}

              </select>

            </div>


            <div className="filter-group">

              <label>
                Marks
              </label>

              <select
                value={marksFilter}
                onChange={(event) =>
                  setMarksFilter(
                    event.target.value
                  )
                }
              >

                <option value="All">
                  All Marks
                </option>

                {markValues.map(
                  (marks) => (
                    <option
                      key={marks}
                      value={marks}
                    >
                      {marks}{" "}
                      {marks === 1
                        ? "Mark"
                        : "Marks"}
                    </option>
                  )
                )}

              </select>

            </div>


            <button
              className="clear-filter-button"
              onClick={clearFilters}
            >
              Clear Filters
            </button>

          </div>


          {/* RESULT BAR */}

          <div className="filter-result-bar">

            <div>
              <strong>
                {filteredQuestions.length}
              </strong>{" "}
              question
              {filteredQuestions.length !== 1
                ? "s"
                : ""}{" "}
              found
            </div>

            <button
              className="select-all-button"
              onClick={handleSelectAll}
              disabled={
                filteredQuestions.length === 0
              }
            >
              {allFilteredSelected
                ? "Clear Filtered Selection"
                : "Select All Filtered"}
            </button>

          </div>


          {/* QUESTIONS */}

          {loading ? (

            <div className="empty-question-state">

              <div className="loading-spinner"></div>

              <h4>
                Loading questions...
              </h4>

              <p>
                Getting your saved questions.
              </p>

            </div>

          ) : filteredQuestions.length === 0 ? (

            <div className="empty-question-state">

              <div className="empty-icon">
                ?
              </div>

              <h4>
                {questions.length === 0
                  ? "No questions available yet"
                  : "No questions match your filters"}
              </h4>

              <p>
                {questions.length === 0
                  ? "Create your first question to start building your question bank."
                  : "Try changing your filters or clearing them."}
              </p>

              {questions.length === 0 && (
                <button
                  className="secondary-button"
                  onClick={() =>
                    router.push(
                      "/examiner/questions/create"
                    )
                  }
                >
                  + Create Question
                </button>
              )}

            </div>

          ) : (

            <div className="questions-list">

              {filteredQuestions.map(
                (question, index) => {

                  const selected =
                    selectedQuestions.includes(
                      question.id
                    );

                  return (
                    <div
                      className={
                        selected
                          ? "question-item selected"
                          : "question-item"
                      }
                      key={question.id}
                    >

                      <button
                        type="button"
                        className={
                          selected
                            ? "question-checkbox checked"
                            : "question-checkbox"
                        }
                        onClick={() =>
                          handleSelectQuestion(
                            question.id
                          )
                        }
                      >
                        {selected ? "✓" : ""}
                      </button>


                      <div className="question-main">

                        <div className="question-meta">

                          <span>
                            Question {index + 1}
                          </span>

                          <span className="subject-badge">
                            {question.subject}
                          </span>

                          <span
                            className={`difficulty-badge ${question.difficulty.toLowerCase()}`}
                          >
                            {question.difficulty}
                          </span>

                          <span className="type-badge">
                            {question.question_type}
                          </span>

                        </div>


                        <h4>
                          {question.question_text}
                        </h4>


                        {question.question_type ===
                          "MCQ" && (

                          <div className="question-options">

                            <span>
                              A.{" "}
                              {question.option_a}
                            </span>

                            <span>
                              B.{" "}
                              {question.option_b}
                            </span>

                            <span>
                              C.{" "}
                              {question.option_c}
                            </span>

                            <span>
                              D.{" "}
                              {question.option_d}
                            </span>

                          </div>

                        )}


                        <div className="question-footer">

                          {question.marks}{" "}
                          {question.marks === 1
                            ? "mark"
                            : "marks"}

                        </div>

                      </div>

                    </div>
                  );
                }
              )}

            </div>

          )}

        </section>

      </section>
    </main>
  );
}