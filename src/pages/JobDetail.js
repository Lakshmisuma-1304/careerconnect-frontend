import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { jobService, applicationService } from "../services/api";
import { useAuth } from "../context/AuthContext";

function JobDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchJob();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  const fetchJob = async () => {
    try {
      const response = await jobService.getJobById(id);
      setJob(response.data);
    } catch (err) {
      setError("Failed to load job details.");
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setApplying(true);
    setMessage("");
    setError("");
    try {
      await applicationService.applyForJob(id);
      setMessage("✅ Application submitted successfully!");
    } catch (err) {
      if (err.response?.status === 400) {
        setError("You have already applied for this job.");
      } else {
        setError("Failed to apply. Please try again.");
      }
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <p style={styles.info}>Loading job details...</p>;
  if (error && !job) return <p style={styles.error}>{error}</p>;

  return (
    <div style={styles.container}>
      <button onClick={() => navigate("/")} style={styles.backBtn}>
        ← Back to Jobs
      </button>
      {job && (
        <div style={styles.card}>
          <h2 style={styles.title}>{job.title}</h2>
          <p style={styles.company}>{job.companyName}</p>
          <div style={styles.metaRow}>
            <span style={styles.meta}>📍 {job.location}</span>
            <span style={styles.meta}>🕐 {job.jobType}</span>
            <span style={styles.meta}>
              💰 {job.salary ? `$${job.salary}` : "Not specified"}
            </span>
          </div>
          <hr style={styles.divider} />
          <h3 style={styles.sectionTitle}>Job Description</h3>
          <p style={styles.description}>{job.description}</p>
          {job.requirements && (
            <>
              <h3 style={styles.sectionTitle}>Requirements</h3>
              <p style={styles.description}>{job.requirements}</p>
            </>
          )}
          <hr style={styles.divider} />
          {message && <p style={styles.success}>{message}</p>}
          {error && <p style={styles.error}>{error}</p>}
          {user?.role === "JOB_SEEKER" && (
            <button
              onClick={handleApply}
              style={styles.applyBtn}
              disabled={applying}
            >
              {applying ? "Applying..." : "Apply Now"}
            </button>
          )}
          {!user && (
            <p style={styles.loginMsg}>
              <button
                onClick={() => navigate("/login")}
                style={styles.applyBtn}
              >
                Login to Apply
              </button>
            </p>
          )}
          {user?.role === "RECRUITER" && (
            <p style={styles.recruiterMsg}>
              You are viewing this as a Recruiter.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { maxWidth: "800px", margin: "0 auto", padding: "24px" },
  backBtn: {
    marginBottom: "20px",
    padding: "8px 16px",
    backgroundColor: "#f0f0f0",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
  },
  card: {
    backgroundColor: "white",
    borderRadius: "8px",
    padding: "32px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
  },
  title: { color: "#1a73e8", fontSize: "26px", marginBottom: "6px" },
  company: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "14px",
  },
  metaRow: {
    display: "flex",
    gap: "20px",
    flexWrap: "wrap",
    marginBottom: "10px",
  },
  meta: { color: "#555", fontSize: "15px" },
  divider: { margin: "20px 0", borderColor: "#eee" },
  sectionTitle: { color: "#333", fontSize: "18px", marginBottom: "10px" },
  description: {
    color: "#555",
    lineHeight: "1.7",
    fontSize: "15px",
    marginBottom: "16px",
    whiteSpace: "pre-wrap",
  },
  applyBtn: {
    padding: "12px 32px",
    backgroundColor: "#1a73e8",
    color: "white",
    border: "none",
    borderRadius: "4px",
    fontSize: "16px",
    cursor: "pointer",
    marginTop: "8px",
  },
  success: { color: "#2e7d32", fontWeight: "bold", marginBottom: "12px" },
  error: { color: "red", marginBottom: "12px" },
  info: { textAlign: "center", padding: "40px", color: "#666" },
  loginMsg: { marginTop: "10px" },
  recruiterMsg: { color: "#888", fontStyle: "italic", marginTop: "10px" },
};

export default JobDetail;
