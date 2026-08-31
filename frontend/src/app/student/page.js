"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";


export default function StudentDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const role = localStorage.getItem("role");

    if (!token || role !== "student") {
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
          <h1>Student Dashboard</h1>
          <p>Welcome to the AI Examination Platform</p>
        </div>

        <button onClick={handleLogout}>
          Logout
        </button>
      </header>


      {/* Cards */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
        }}
      >

        <div style={cardStyle}>
          <h2>📝 Exams</h2>
          <p>View available examinations.</p>

          <button>
            View Exams
          </button>
        </div>


        <div style={cardStyle}>
          <h2>📊 Results</h2>
          <p>View your examination results.</p>

          <button>
            View Results
          </button>
        </div>


        <div style={cardStyle}>
          <h2>📚 Practice</h2>
          <p>Practice questions using AI.</p>

          <button>
            Start Practice
          </button>
        </div>


        <div style={cardStyle}>
          <h2>👤 Profile</h2>
          <p>Manage your student profile.</p>

          <button>
            View Profile
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