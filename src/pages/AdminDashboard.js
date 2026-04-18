import React, { useState, useEffect } from "react";
import api from "../services/api";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [activeTab, setActiveTab] = useState("users");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [usersRes, jobsRes, appsRes] = await Promise.all([
        api.get("/admin/users"),
        api.get("/admin/jobs"),
        api.get("/admin/applications"),
      ]);
      setUsers(usersRes.data);
      setJobs(jobsRes.data);
      setApplications(appsRes.data);
    } catch (err) {
      setMessage("❌ Failed to load admin data.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await api.delete(`/admin/users/${id}`);
      setMessage("✅ User deleted successfully!");
      setUsers(users.filter((u) => u.id !== id));
    } catch (err) {
      setMessage("❌ Failed to delete user.");
    }
  };

  const handleDeleteJob = async (id) => {
    if (!window.confirm("Delete this job?")) return;
    try {
      await api.delete(`/admin/jobs/${id}`);
      setMessage("✅ Job deleted successfully!");
      setJobs(jobs.filter((j) => j.id !== id));
    } catch (err) {
      setMessage("❌ Failed to delete job.");
    }
  };

  const getRoleStyle = (role) => {
    switch (role) {
      case "ADMIN":
        return { backgroundColor: "#f3e5f5", color: "#6a1b9a" };
      case "RECRUITER":
        return { backgroundColor: "#fff3e0", color: "#e65100" };
      default:
        return { backgroundColor: "#e3f2fd", color: "#1565c0" };
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "HIRED":
        return { backgroundColor: "#e8f5e9", color: "#2e7d32" };
      case "REJECTED":
        return { backgroundColor: "#ffebee", color: "#c62828" };
      case "SHORTLISTED":
        return { backgroundColor: "#fff3e0", color: "#e65100" };
      case "REVIEWED":
        return { backgroundColor: "#e3f2fd", color: "#1565c0" };
      default:
        return { backgroundColor: "#f3e5f5", color: "#6a1b9a" };
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Admin Dashboard</h2>

      <div style={styles.statsRow}>
        <div style={styles.statCard}>
          <p style={styles.statNum}>{users.length}</p>
          <p style={styles.statLabel}>Total Users</p>
        </div>
        <div style={styles.statCard}>
          <p style={{ ...styles.statNum, color: "#e65100" }}>{jobs.length}</p>
          <p style={styles.statLabel}>Total Jobs</p>
        </div>
        <div style={styles.statCard}>
          <p style={{ ...styles.statNum, color: "#2e7d32" }}>
            {applications.length}
          </p>
          <p style={styles.statLabel}>Total Applications</p>
        </div>
        <div style={styles.statCard}>
          <p style={{ ...styles.statNum, color: "#6a1b9a" }}>
            {users.filter((u) => u.role?.name === "RECRUITER").length}
          </p>
          <p style={styles.statLabel}>Recruiters</p>
        </div>
      </div>

      {message && (
        <p style={message.includes("❌") ? styles.error : styles.success}>
          {message}
        </p>
      )}

      <div style={styles.tabs}>
        {["users", "jobs", "applications"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              ...styles.tab,
              ...(activeTab === tab ? styles.activeTab : {}),
            }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            <span style={styles.tabCount}>
              {tab === "users"
                ? users.length
                : tab === "jobs"
                  ? jobs.length
                  : applications.length}
            </span>
          </button>
        ))}
      </div>

      {loading && <p style={styles.info}>Loading...</p>}

      {!loading && activeTab === "users" && (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.thead}>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Role</th>
                <th style={styles.th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} style={styles.tr}>
                  <td style={styles.td}>{user.name}</td>
                  <td style={styles.td}>{user.email}</td>
                  <td style={styles.td}>
                    <span
                      style={{
                        ...styles.badge,
                        ...getRoleStyle(user.role?.name),
                      }}
                    >
                      {user.role?.name}
                    </span>
                  </td>
                  <td style={styles.td}>
                    {user.role?.name !== "ADMIN" && (
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        style={styles.deleteBtn}
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && activeTab === "jobs" && (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.thead}>
                <th style={styles.th}>Title</th>
                <th style={styles.th}>Company</th>
                <th style={styles.th}>Location</th>
                <th style={styles.th}>Type</th>
                <th style={styles.th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.id} style={styles.tr}>
                  <td style={styles.td}>{job.title}</td>
                  <td style={styles.td}>{job.companyName}</td>
                  <td style={styles.td}>{job.location}</td>
                  <td style={styles.td}>{job.type}</td>
                  <td style={styles.td}>
                    <button
                      onClick={() => handleDeleteJob(job.id)}
                      style={styles.deleteBtn}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && activeTab === "applications" && (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.thead}>
                <th style={styles.th}>Applicant</th>
                <th style={styles.th}>Job Title</th>
                <th style={styles.th}>Company</th>
                <th style={styles.th}>Applied On</th>
                <th style={styles.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app.id} style={styles.tr}>
                  <td style={styles.td}>{app.seeker?.name}</td>
                  <td style={styles.td}>{app.job?.title}</td>
                  <td style={styles.td}>{app.job?.companyName}</td>
                  <td style={styles.td}>
                    {new Date(app.appliedAt).toLocaleDateString()}
                  </td>
                  <td style={styles.td}>
                    <span
                      style={{ ...styles.badge, ...getStatusStyle(app.status) }}
                    >
                      {app.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { maxWidth: "1100px", margin: "0 auto", padding: "24px" },
  heading: { color: "#1a73e8", marginBottom: "24px" },
  statsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "16px",
    marginBottom: "24px",
  },
  statCard: {
    backgroundColor: "white",
    borderRadius: "8px",
    padding: "20px",
    textAlign: "center",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  },
  statNum: {
    fontSize: "32px",
    fontWeight: "bold",
    color: "#1a73e8",
    margin: "0 0 4px 0",
  },
  statLabel: { color: "#666", fontSize: "13px", margin: 0 },
  tabs: { display: "flex", gap: "8px", marginBottom: "20px" },
  tab: {
    padding: "10px 20px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "15px",
    backgroundColor: "#f0f0f0",
    color: "#333",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  activeTab: { backgroundColor: "#1a73e8", color: "white" },
  tabCount: {
    backgroundColor: "rgba(0,0,0,0.1)",
    borderRadius: "12px",
    padding: "1px 8px",
    fontSize: "12px",
  },
  tableWrapper: {
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    overflow: "hidden",
  },
  table: { width: "100%", borderCollapse: "collapse" },
  thead: { backgroundColor: "#f8f9fa" },
  th: {
    padding: "14px 16px",
    textAlign: "left",
    fontWeight: "bold",
    color: "#333",
    fontSize: "14px",
    borderBottom: "2px solid #eee",
  },
  tr: { borderBottom: "1px solid #f0f0f0" },
  td: { padding: "12px 16px", color: "#555", fontSize: "14px" },
  badge: {
    padding: "3px 10px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: "bold",
  },
  deleteBtn: {
    padding: "5px 12px",
    backgroundColor: "#ffebee",
    color: "#c62828",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "13px",
  },
  success: { color: "#2e7d32", fontWeight: "bold", marginBottom: "12px" },
  error: { color: "red", marginBottom: "12px" },
  info: { textAlign: "center", color: "#666", padding: "40px" },
};

export default AdminDashboard;
