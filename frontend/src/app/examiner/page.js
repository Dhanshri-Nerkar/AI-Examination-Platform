"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import "./examiner.css";

export default function ExaminerDashboard() {
  const router = useRouter();

  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const role = localStorage.getItem("role");

    if (!token || role !== "examiner") {
      router.push("/login");
      return;
    }

    setUser({ role });
  }, [router]);

  function handleLogout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("role");
    router.push("/login");
  }

  if (!user) {
    return (
      <main className="examiner-loading">
        <p>Loading...</p>
      </main>
    );
  }

  return (
    <main className="examiner-page">

      <section className="examiner-content">

        {/* Welcome */}
        <div className="examiner-welcome">
          <div>
            <p className="welcome-label">EXAMINER DASHBOARD</p>
            <h1>Manage your examinations</h1>
            <p>
              Create examinations, manage questions,
              and review student performance from one place.
            </p>
          </div>
        </div>


        {/* QUICK ACTIONS */}
        <section className="dashboard-section">

          <div className="dashboard-grid">

            {/* Create Exam */}
            <div className="dashboard-card">
              <div className="dashboard-card-icon">📝</div>
              <div className="dashboard-card-content">
                <h3>Create Examination</h3>
                <p>
                  Set the examination name, subject,
                  duration, schedule, questions, and marks.
                </p>
                <button
                  className="card-button primary"
                  onClick={() => router.push("/examiner/create-exam")}
                >
                  Create Exam
                  <span>→</span>
                </button>
              </div>
            </div>


            {/* Questions */}
            <div className="dashboard-card">
              <div className="dashboard-card-icon">❓</div>
              <div className="dashboard-card-content">
                <h3>Questions</h3>
                <p>Create and organize questions for your examinations.</p>
                <button
                  className="card-button"
                  onClick={() => router.push("/examiner/questions")}
                >
                  Manage Questions
                  <span>→</span>
                </button>
              </div>
            </div>


            {/* Examinations */}
            <div className="dashboard-card">
              <div className="dashboard-card-icon">📚</div>
              <div className="dashboard-card-content">
                <h3>Examinations</h3>
                <p>
                  View your examinations, check their status,
                  and manage questions for each examination.
                </p>
                <button
                  className="card-button"
                  onClick={() => router.push("/examiner/exams")}
                >
                  View Examinations
                  <span>→</span>
                </button>
              </div>
            </div>


            {/* Results */}
<div className="dashboard-card">
  <div className="dashboard-card-icon">📊</div>

  <div className="dashboard-card-content">
    <h3>Results</h3>

    <p>
      Review student submissions, check answers,
      assign marks, and publish examination results.
    </p>

    <button
      className="card-button"
      onClick={() => router.push("/examiner/results")}
    >
      View Results
      <span>→</span>
    </button>
  </div>
</div>

            {/* AI Questions */}
            <div className="dashboard-card">
              <div className="dashboard-card-icon">🤖</div>
              <div className="dashboard-card-content">
                <h3>AI Questions</h3>
                <p>Generate examination questions with AI assistance.</p>
                <button
                  className="card-button"
                  onClick={() => alert("AI question generation will be added later.")}
                >
                  Generate Questions
                  <span>→</span>
                </button>
              </div>
            </div>

          </div>
        </section>


        {/* WORKFLOW */}
        <section className="workflow-section">

          <div className="workflow-header">
            <div>
              <h2>Examination Workflow</h2>
              <p>Follow these steps to prepare your examination.</p>
            </div>
          </div>


          <div className="workflow-grid">

            <div className="workflow-item">
              <div className="workflow-number">1</div>
              <div>
                <h3>Create Examination</h3>
                <p>Configure the basic examination details.</p>
              </div>
            </div>

            <div className="workflow-item">
              <div className="workflow-number">2</div>
              <div>
                <h3>Add Questions</h3>
                <p>Build your question bank for the examination.</p>
              </div>
            </div>

            <div className="workflow-item">
              <div className="workflow-number">3</div>
              <div>
                <h3>Configure Paper</h3>
                <p>Set question selection and randomization rules.</p>
              </div>
            </div>

            <div className="workflow-item">
              <div className="workflow-number">4</div>
              <div>
                <h3>Publish Examination</h3>
                <p>Make the examination available to students.</p>
              </div>
            </div>

          </div>
        </section>

      </section>
    </main>
  );
}