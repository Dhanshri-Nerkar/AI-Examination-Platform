"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";


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

    setUser({
      role: role,
    });
  }, [router]);


  function handleLogout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("role");

    router.push("/login");
  }


  if (!user) {
    return <p>Loading...</p>;
  }


  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "30px",
        background: "#f5f7fb",
      }}
    >

      {/* Header */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "40px",
        }}
      >

        <div>
          <h1>Examiner Dashboard</h1>

          <p>
            Manage examinations and questions
          </p>
        </div>

        <button onClick={handleLogout}>
          Logout
        </button>

      </header>


      {/* Dashboard Cards */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
        }}
      >

        <div style={cardStyle}>
          <h2>📝 Create Exam</h2>

          <p>
            Create a new examination.
          </p>

          <button>
            Create Exam
          </button>
        </div>


        <div style={cardStyle}>
          <h2>❓ Questions</h2>

          <p>
            Create and manage questions.
          </p>

          <button>
            Manage Questions
          </button>
        </div>


        <div style={cardStyle}>
          <h2>📊 Results</h2>

          <p>
            View student examination results.
          </p>

          <button>
            View Results
          </button>
        </div>


        <div style={cardStyle}>
          <h2>🤖 AI Questions</h2>

          <p>
            Generate questions using AI.
          </p>

          <button>
            Generate Questions
          </button>
        </div>

      </section>

    </main>
  );
}


const cardStyle = {
  background: "white",
  padding: "25px",
  borderRadius: "10px",
  border: "1px solid #ddd",
};