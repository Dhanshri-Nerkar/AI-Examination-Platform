"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";


export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);


  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const role = localStorage.getItem("role");

    if (!token || role !== "admin") {
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
          <h1>Admin Dashboard</h1>

          <p>
            Manage the AI Examination Platform
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
          <h2>👥 Users</h2>

          <p>
            Manage students and examiners.
          </p>

          <button>
            Manage Users
          </button>
        </div>


        <div style={cardStyle}>
          <h2>📝 Exams</h2>

          <p>
            Manage all examinations.
          </p>

          <button>
            Manage Exams
          </button>
        </div>


        <div style={cardStyle}>
          <h2>📊 Reports</h2>

          <p>
            View platform reports and statistics.
          </p>

          <button>
            View Reports
          </button>
        </div>


        <div style={cardStyle}>
          <h2>⚙️ Settings</h2>

          <p>
            Configure platform settings.
          </p>

          <button>
            Settings
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