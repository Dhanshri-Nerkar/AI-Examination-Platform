"use client";

import { useEffect, useMemo, useState } from "react";

import "./users.css";

const API_URL = "http://127.0.0.1:8000";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [updatingId, setUpdatingId] = useState(null);

  // ============================================================
  // LOAD USERS
  // ============================================================

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("access_token");

      if (!token) {
        setError("Admin login required.");
        return;
      }

      const response = await fetch(
        `${API_URL}/admin/users`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to load users."
        );
      }

      setUsers(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // INITIAL LOAD
  // ============================================================

  useEffect(() => {
    loadUsers();
  }, []);

  // ============================================================
  // FILTER USERS
  // ============================================================

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const searchText = search
        .trim()
        .toLowerCase();

      const matchesSearch =
        !searchText ||
        user.name
          ?.toLowerCase()
          .includes(searchText) ||
        user.email
          ?.toLowerCase()
          .includes(searchText);

      const matchesRole =
        roleFilter === "all" ||
        user.role === roleFilter;

      const matchesStatus =
        statusFilter === "all" ||
        user.status === statusFilter;

      return (
        matchesSearch &&
        matchesRole &&
        matchesStatus
      );
    });
  }, [
    users,
    search,
    roleFilter,
    statusFilter,
  ]);

  // ============================================================
  // COUNTS
  // ============================================================

  const studentCount = users.filter(
    (user) => user.role === "student"
  ).length;

  const examinerCount = users.filter(
    (user) => user.role === "examiner"
  ).length;

  const adminCount = users.filter(
    (user) => user.role === "admin"
  ).length;

  const activeCount = users.filter(
    (user) =>
      user.status === "active" ||
      user.status === "approved"
  ).length;

  // ============================================================
  // UPDATE USER STATUS
  // ============================================================

  const updateStatus = async (user) => {
    try {
      setUpdatingId(user.id);
      setMessage("");
      setError("");

      // Protect admin accounts
      if (user.role === "admin") {
        setError(
          "Admin accounts cannot be changed."
        );
        return;
      }

      // Pending/rejected examiners must use
      // the examiner approval workflow.
      if (
        user.role === "examiner" &&
        user.status === "pending"
      ) {
        setError(
          "Pending examiners must be approved first."
        );
        return;
      }

      if (
        user.role === "examiner" &&
        user.status === "rejected"
      ) {
        setError(
          "Rejected examiners cannot be activated directly."
        );
        return;
      }

      const action =
        user.status === "active" ||
        user.status === "approved"
          ? "deactivate"
          : "activate";

      const confirmed = window.confirm(
        `Are you sure you want to ${action} ${user.name}?`
      );

      if (!confirmed) {
        return;
      }

      const token =
        localStorage.getItem("access_token");

      if (!token) {
        throw new Error(
          "Admin login required."
        );
      }

      const response = await fetch(
        `${API_URL}/admin/users/${user.id}/status`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
            "Failed to update user status."
        );
      }

      setUsers((previousUsers) =>
        previousUsers.map((existingUser) =>
          existingUser.id === user.id
            ? {
                ...existingUser,
                status: data.user.status,
              }
            : existingUser
        )
      );

      setMessage(
        `${data.user.name}'s status changed to ${data.user.status}.`
      );
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  // ============================================================
  // STATUS DISPLAY
  // ============================================================

  const getStatusClass = (status) => {
    if (status === "active") {
      return "status-active";
    }

    if (status === "approved") {
      return "status-approved";
    }

    if (status === "pending") {
      return "status-pending";
    }

    if (status === "rejected") {
      return "status-rejected";
    }

    if (status === "inactive") {
      return "status-inactive";
    }

    return "status-default";
  };

  const getStatusLabel = (status) => {
    if (!status) {
      return "Unknown";
    }

    return status
      .replace(/_/g, " ")
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      );
  };

  // ============================================================
  // ROLE DISPLAY
  // ============================================================

  const getRoleLabel = (role) => {
    if (role === "student") {
      return "Student";
    }

    if (role === "examiner") {
      return "Examiner";
    }

    if (role === "admin") {
      return "Administrator";
    }

    return role;
  };

  // ============================================================
  // DATE FORMAT
  // ============================================================

  const formatDate = (date) => {
    if (!date) {
      return "—";
    }

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <main className="admin-users-page">
        <div className="users-loading">
          <div className="users-spinner"></div>

          <p>Loading users...</p>
        </div>
      </main>
    );
  }

  // ============================================================
  // UI
  // ============================================================

  return (
    <main className="admin-users-page">
      <div className="admin-users-container">

        {/* ================================================== */}
        {/* HEADER */}
        {/* ================================================== */}

        <header className="users-header">
          <div>
            <p className="users-eyebrow">
              USER MANAGEMENT
            </p>

            <h1>Users</h1>

            <p className="users-subtitle">
              View and manage registered students,
              examiners and administrators.
            </p>
          </div>

          <button
            className="users-refresh-button"
            onClick={loadUsers}
            disabled={loading}
          >
            ↻ Refresh
          </button>
        </header>

        {/* ================================================== */}
        {/* MESSAGES */}
        {/* ================================================== */}

        {message && (
          <div className="users-success-message">
            <span>✓</span>
            {message}
          </div>
        )}

        {error && (
          <div className="users-error-message">
            <span>!</span>
            {error}
          </div>
        )}

        {/* ================================================== */}
        {/* SUMMARY CARDS */}
        {/* ================================================== */}

        <section className="user-summary-grid">

          <div className="user-summary-card">
            <div className="summary-icon students-icon">
              👨‍🎓
            </div>

            <div>
              <p>Students</p>

              <h2>{studentCount}</h2>
            </div>
          </div>

          <div className="user-summary-card">
            <div className="summary-icon examiners-icon">
              👨‍🏫
            </div>

            <div>
              <p>Examiners</p>

              <h2>{examinerCount}</h2>
            </div>
          </div>

          <div className="user-summary-card">
            <div className="summary-icon admins-icon">
              🛡️
            </div>

            <div>
              <p>Administrators</p>

              <h2>{adminCount}</h2>
            </div>
          </div>

          <div className="user-summary-card">
            <div className="summary-icon active-icon">
              ✓
            </div>

            <div>
              <p>Active Users</p>

              <h2>{activeCount}</h2>
            </div>
          </div>

        </section>

        {/* ================================================== */}
        {/* USERS TABLE */}
        {/* ================================================== */}

        <section className="users-panel">

          <div className="users-panel-header">
            <div>
              <p className="users-section-eyebrow">
                REGISTERED USERS
              </p>

              <h2>User Directory</h2>
            </div>

            <span className="users-count">
              {filteredUsers.length} Users
            </span>
          </div>

          {/* ================================================== */}
          {/* FILTERS */}
          {/* ================================================== */}

          <div className="users-filters">

            <div className="search-wrapper">
              <span className="search-icon">
                🔍
              </span>

              <input
                type="text"
                placeholder="Search by name or email..."
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
              />
            </div>

            <select
              value={roleFilter}
              onChange={(event) =>
                setRoleFilter(event.target.value)
              }
            >
              <option value="all">
                All Roles
              </option>

              <option value="student">
                Students
              </option>

              <option value="examiner">
                Examiners
              </option>

              <option value="admin">
                Administrators
              </option>
            </select>

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value)
              }
            >
              <option value="all">
                All Status
              </option>

              <option value="active">
                Active
              </option>

              <option value="inactive">
                Inactive
              </option>

              <option value="pending">
                Pending
              </option>

              <option value="approved">
                Approved
              </option>

              <option value="rejected">
                Rejected
              </option>
            </select>

          </div>

          {/* ================================================== */}
          {/* EMPTY */}
          {/* ================================================== */}

          {filteredUsers.length === 0 ? (

            <div className="users-empty">
              <div className="users-empty-icon">
                👥
              </div>

              <h3>No Users Found</h3>

              <p>
                Try changing your search or filter
                settings.
              </p>
            </div>

          ) : (

            /* ================================================== */
            /* TABLE */
            /* ================================================== */

            <div className="users-table-wrapper">

              <table className="users-table">

                <thead>
                  <tr>
                    <th>User</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Registered</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>

                  {filteredUsers.map((user) => {

                    const isUpdating =
                      updatingId === user.id;

                    const isAdmin =
                      user.role === "admin";

                    const isExaminerPending =
                      user.role === "examiner" &&
                      user.status === "pending";

                    const isExaminerRejected =
                      user.role === "examiner" &&
                      user.status === "rejected";

                    return (
                      <tr key={user.id}>

                        {/* USER */}

                        <td>
                          <div className="table-user">

                            <div className="table-avatar">
                              {user.name
                                ?.charAt(0)
                                ?.toUpperCase()}
                            </div>

                            <div>
                              <strong>
                                {user.name}
                              </strong>

                              <span>
                                {user.email}
                              </span>
                            </div>

                          </div>
                        </td>

                        {/* ROLE */}

                        <td>
                          <span
                            className={`role-badge role-${user.role}`}
                          >
                            {getRoleLabel(user.role)}
                          </span>
                        </td>

                        {/* STATUS */}

                        <td>
                          <span
                            className={`user-status ${getStatusClass(
                              user.status
                            )}`}
                          >
                            {getStatusLabel(
                              user.status
                            )}
                          </span>
                        </td>

                        {/* DATE */}

                        <td className="registered-date">
                          {formatDate(
                            user.created_at
                          )}
                        </td>

                        {/* ACTION */}

                        <td>

                          {isAdmin ? (

                            <span className="protected-label">
                              Protected
                            </span>

                          ) : isExaminerPending ? (

                            <span className="review-label">
                              Awaiting Approval
                            </span>

                          ) : isExaminerRejected ? (

                            <span className="review-label rejected-review">
                              Rejected
                            </span>

                          ) : user.status === "active" ||
                            user.status === "approved" ? (

                            <button
                              className="deactivate-button"
                              disabled={isUpdating}
                              onClick={() =>
                                updateStatus(user)
                              }
                            >
                              {isUpdating
                                ? "Updating..."
                                : "Deactivate"}
                            </button>

                          ) : (

                            <button
                              className="activate-button"
                              disabled={isUpdating}
                              onClick={() =>
                                updateStatus(user)
                              }
                            >
                              {isUpdating
                                ? "Updating..."
                                : "Activate"}
                            </button>

                          )}

                        </td>

                      </tr>
                    );
                  })}

                </tbody>

              </table>

            </div>

          )}

        </section>

      </div>
    </main>
  );
}