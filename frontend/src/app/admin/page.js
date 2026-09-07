"use client";

import { useEffect, useState } from "react";

const API_URL = "http://127.0.0.1:8000";

export default function AdminDashboard() {
  const [examiners, setExaminers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ============================================================
  // GET PENDING EXAMINERS
  // ============================================================

  const loadPendingExaminers = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("access_token");

      if (!token) {
        setError("Admin login required.");
        return;
      }

      const response = await fetch(
        `${API_URL}/admin/examiners/pending`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const data = await response.json();

        throw new Error(
          data.detail || "Failed to load examiner requests"
        );
      }

      const data = await response.json();

      setExaminers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // LOAD WHEN PAGE OPENS
  // ============================================================

  useEffect(() => {
    loadPendingExaminers();
  }, []);

  // ============================================================
  // APPROVE EXAMINER
  // ============================================================

  const approveExaminer = async (id) => {
    try {
      setMessage("");
      setError("");

      const token = localStorage.getItem("access_token");

      const response = await fetch(
        `${API_URL}/admin/examiners/${id}/approve`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to approve examiner"
        );
      }

      setMessage("Examiner approved successfully.");

      // Remove approved examiner from pending list
      setExaminers((previous) =>
        previous.filter((examiner) => examiner.id !== id)
      );
    } catch (err) {
      setError(err.message);
    }
  };

  // ============================================================
  // REJECT EXAMINER
  // ============================================================

  const rejectExaminer = async (id) => {
    try {
      setMessage("");
      setError("");

      const token = localStorage.getItem("access_token");

      const response = await fetch(
        `${API_URL}/admin/examiners/${id}/reject`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to reject examiner"
        );
      }

      setMessage("Examiner rejected.");

      // Remove rejected examiner from pending list
      setExaminers((previous) =>
        previous.filter((examiner) => examiner.id !== id)
      );
    } catch (err) {
      setError(err.message);
    }
  };

  // ============================================================
  // UI
  // ============================================================

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f4f6f8",
        padding: "40px",
      }}
    >
      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
        }}
      >
        {/* HEADER */}

        <div
          style={{
            background: "white",
            padding: "25px",
            borderRadius: "12px",
            marginBottom: "25px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: "30px",
            }}
          >
            Admin Dashboard
          </h1>

          <p
            style={{
              color: "#666",
              marginBottom: 0,
            }}
          >
            Manage examiner registration requests.
          </p>
        </div>

        {/* SUCCESS MESSAGE */}

        {message && (
          <div
            style={{
              background: "#d1fae5",
              color: "#065f46",
              padding: "15px",
              borderRadius: "8px",
              marginBottom: "20px",
            }}
          >
            {message}
          </div>
        )}

        {/* ERROR MESSAGE */}

        {error && (
          <div
            style={{
              background: "#fee2e2",
              color: "#991b1b",
              padding: "15px",
              borderRadius: "8px",
              marginBottom: "20px",
            }}
          >
            {error}
          </div>
        )}

        {/* PENDING EXAMINERS */}

        <div
          style={{
            background: "white",
            padding: "25px",
            borderRadius: "12px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <h2 style={{ margin: 0 }}>
              Pending Examiner Requests
            </h2>

            <button
              onClick={loadPendingExaminers}
              style={{
                padding: "9px 16px",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                background: "#2563eb",
                color: "white",
              }}
            >
              Refresh
            </button>
          </div>

          {loading ? (
            <p>Loading examiner requests...</p>
          ) : examiners.length === 0 ? (
            <div
              style={{
                padding: "30px",
                textAlign: "center",
                background: "#f8fafc",
                borderRadius: "8px",
                color: "#64748b",
              }}
            >
              No pending examiner requests.
            </div>
          ) : (
            <div>
              {examiners.map((examiner) => (
                <div
                  key={examiner.id}
                  style={{
                    border: "1px solid #e5e7eb",
                    borderRadius: "10px",
                    padding: "20px",
                    marginBottom: "15px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "20px",
                    }}
                  >
                    <div>
                      <h3
                        style={{
                          margin: "0 0 8px 0",
                        }}
                      >
                        {examiner.name}
                      </h3>

                      <p
                        style={{
                          margin: "4px 0",
                          color: "#555",
                        }}
                      >
                        Email: {examiner.email}
                      </p>

                      <p
                        style={{
                          margin: "4px 0",
                          color: "#555",
                        }}
                      >
                        Role: {examiner.role}
                      </p>

                      <span
                        style={{
                          display: "inline-block",
                          marginTop: "8px",
                          padding: "5px 10px",
                          borderRadius: "20px",
                          background: "#fef3c7",
                          color: "#92400e",
                          fontSize: "13px",
                        }}
                      >
                        Pending
                      </span>
                    </div>

                    {/* BUTTONS */}

                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                      }}
                    >
                      <button
                        onClick={() =>
                          approveExaminer(examiner.id)
                        }
                        style={{
                          padding: "10px 18px",
                          border: "none",
                          borderRadius: "6px",
                          background: "#16a34a",
                          color: "white",
                          cursor: "pointer",
                          fontWeight: "bold",
                        }}
                      >
                        Approve
                      </button>

                      <button
                        onClick={() =>
                          rejectExaminer(examiner.id)
                        }
                        style={{
                          padding: "10px 18px",
                          border: "none",
                          borderRadius: "6px",
                          background: "#dc2626",
                          color: "white",
                          cursor: "pointer",
                          fontWeight: "bold",
                        }}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}