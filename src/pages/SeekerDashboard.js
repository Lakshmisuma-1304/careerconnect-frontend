import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { applicationService } from "../services/api";

function ResumeUpload() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!file) return setMessage("Please select a file first!");
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8080/api/resumes/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (response.ok) {
        setMessage("✅ Resume uploaded successfully!");
        setFile(null);
      } else {
        setMessage("❌ Upload failed. Please try again.");
      }
    } catch (err) {
      setMessage("❌ Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={resumeStyles.card}>
      <h3 style={resumeStyles.title}>📄 Upload Resume</h3>
      <div style={resumeStyles.row}>
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => setFile(e.target.files[0])}
          style={resumeStyles.input}
        />
        <button
          onClick={handleUpload}
          disabled={uploading}
          style={resumeStyles.btn}
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </div>
      {file && <p style={resumeStyles.fileName}>Selected: {file.name}</p>}
      {message && (
        <p
          style={
            message.includes("❌") ? resumeStyles.error : resumeStyles.success
          }
        >
          {message}
        </p>
      )}
    </div>
  );
}

const resumeStyles = {
  card: {
    backgroundColor: "white",
    borderRadius: "8px",
    padding: "20px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    marginBottom: "24px",
  },
  title: { color: "#1a73e8", margin: "0 0 16px 0" },
  row: { display: "flex", gap: "12px", alignItems: "center" },
  input: {
    flex: 1,
    padding: "8px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    fontSize: "14px",
  },
  btn: {
    padding: "9px 20px",
    backgroundColor: "#1a73e8",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
  },
  fileName: { color: "#666", fontSize: "13px", marginTop: "8px" },
  success: { color: "#2e7d32", fontWeight: "bold", marginTop: "8px" },
  error: { color: "red", marginTop: "8px" },
};

function SeekerDashboard() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMyApplications();
  }, []);

  const fetchMyApplications = async () => {
    try {
      const response = await applicationService.getMyApplications();
      setApplications(response.data);
    } catch (err) {
      setError("Failed to load your applications.");
    } finally {
      setLoading(false);
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
      <h2 style={styles.heading}>My Applications</h2>

      <ResumeUpload />

      {loading && <p style={styles.info}>Loading your applications...</p>}
      {error && <p style={styles.error}>{error}</p>}
      {!loading && applications.length === 0 && (
        <div style={styles.emptyState}>
          <p style={styles.emptyText}>You haven't applied to any jobs yet.</p>
          <Link to="/" style={styles.browseBtn}>
            Browse Jobs
          </Link>
        </div>
      )}

      <div style={styles.grid}>
        {applications.map((app) => (
          <div key={app.id} style={styles.card}>
            <div style={styles.cardHeader}>
              <div>
                <h3 style={styles.jobTitle}>{app.job?.title}</h3>
                <p style={styles.company}>{app.job?.companyName}</p>
              </div>
              <span
                style={{ ...styles.statusBadge, ...getStatusStyle(app.status) }}
              >
                {app.status}
              </span>
            </div>
            <div style={styles.cardBody}>
              <p style={styles.meta}>📍 {app.job?.location}</p>
              <p style={styles.meta}>🕐 {app.job?.type}</p>
              <p style={styles.meta}>
                📅 Applied: {new Date(app.appliedAt).toLocaleDateString()}
              </p>
            </div>
            <div style={styles.cardFooter}>
              <Link to={`/jobs/${app.job?.id}`} style={styles.viewBtn}>
                View Job
              </Link>
            </div>
          </div>
        ))}
      </div>

      {!loading && applications.length > 0 && (
        <div style={styles.summary}>
          <h3 style={styles.summaryTitle}>Summary</h3>
          <div style={styles.summaryGrid}>
            <div style={styles.summaryCard}>
              <p style={styles.summaryNum}>{applications.length}</p>
              <p style={styles.summaryLabel}>Total Applied</p>
            </div>
            <div style={styles.summaryCard}>
              <p style={{ ...styles.summaryNum, color: "#2e7d32" }}>
                {applications.filter((a) => a.status === "HIRED").length}
              </p>
              <p style={styles.summaryLabel}>Hired</p>
            </div>
            <div style={styles.summaryCard}>
              <p style={{ ...styles.summaryNum, color: "#e65100" }}>
                {applications.filter((a) => a.status === "SHORTLISTED").length}
              </p>
              <p style={styles.summaryLabel}>Shortlisted</p>
            </div>
            <div style={styles.summaryCard}>
              <p style={{ ...styles.summaryNum, color: "#c62828" }}>
                {applications.filter((a) => a.status === "REJECTED").length}
              </p>
              <p style={styles.summaryLabel}>Rejected</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { maxWidth: "1000px", margin: "0 auto", padding: "24px" },
  heading: { color: "#1a73e8", marginBottom: "24px" },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "20px",
    marginBottom: "32px",
  },
  card: {
    backgroundColor: "white",
    borderRadius: "8px",
    padding: "20px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
    borderLeft: "4px solid #1a73e8",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "14px",
  },
  jobTitle: { color: "#1a73e8", margin: "0 0 4px 0", fontSize: "17px" },
  company: { color: "#333", fontWeight: "bold", margin: 0, fontSize: "14px" },
  statusBadge: {
    padding: "4px 12px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: "bold",
    whiteSpace: "nowrap",
  },
  cardBody: { marginBottom: "14px" },
  meta: { color: "#666", fontSize: "13px", margin: "4px 0" },
  cardFooter: { borderTop: "1px solid #eee", paddingTop: "12px" },
  viewBtn: {
    display: "inline-block",
    padding: "7px 16px",
    backgroundColor: "#e8f0fe",
    color: "#1a73e8",
    borderRadius: "4px",
    textDecoration: "none",
    fontSize: "13px",
    fontWeight: "bold",
  },
  emptyState: { textAlign: "center", padding: "60px 20px" },
  emptyText: { color: "#666", fontSize: "16px", marginBottom: "16px" },
  browseBtn: {
    display: "inline-block",
    padding: "10px 24px",
    backgroundColor: "#1a73e8",
    color: "white",
    borderRadius: "4px",
    textDecoration: "none",
    fontSize: "15px",
  },
  summary: {
    backgroundColor: "white",
    borderRadius: "8px",
    padding: "24px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
  },
  summaryTitle: { color: "#333", marginBottom: "16px" },
  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "16px",
  },
  summaryCard: {
    textAlign: "center",
    padding: "16px",
    backgroundColor: "#f8f9fa",
    borderRadius: "8px",
  },
  summaryNum: {
    fontSize: "28px",
    fontWeight: "bold",
    color: "#1a73e8",
    margin: "0 0 4px 0",
  },
  summaryLabel: { color: "#666", fontSize: "13px", margin: 0 },
  info: { color: "#666", textAlign: "center", padding: "40px" },
  error: { color: "red", textAlign: "center" },
};

export default SeekerDashboard;
