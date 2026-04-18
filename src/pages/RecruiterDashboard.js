import React, { useState, useEffect } from "react";
import { jobService, applicationService } from "../services/api";

function RecruiterDashboard() {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editJob, setEditJob] = useState(null);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    title: "",
    companyName: "",
    location: "",
    description: "",
    requirements: "",
    salary: "",
    jobType: "FULL_TIME",
  });

  useEffect(() => {
    fetchMyJobs();
  }, []);

  const fetchMyJobs = async () => {
    try {
      const response = await jobService.getMyJobs();
      setJobs(response.data);
    } catch (err) {
      console.error("Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({
      title: "",
      companyName: "",
      location: "",
      description: "",
      requirements: "",
      salary: "",
      jobType: "FULL_TIME",
    });
    setEditJob(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      if (editJob) {
        await jobService.updateJob(editJob.id, form);
        setMessage("✅ Job updated successfully!");
      } else {
        await jobService.createJob(form);
        setMessage("✅ Job posted successfully!");
      }
      resetForm();
      fetchMyJobs();
    } catch (err) {
      setMessage("❌ Failed to save job. Please try again.");
    }
  };

  const handleEdit = (job) => {
    setForm({
      title: job.title,
      companyName: job.companyName,
      location: job.location,
      description: job.description,
      requirements: job.requirements || "",
      salary: job.salary || "",
      jobType: job.jobType,
    });
    setEditJob(job);
    setShowForm(true);
    setMessage("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      await jobService.deleteJob(id);
      setMessage("✅ Job deleted successfully!");
      fetchMyJobs();
    } catch (err) {
      setMessage("❌ Failed to delete job.");
    }
  };

  const handleViewApplications = async (jobId) => {
    if (selectedJobId === jobId) {
      setSelectedJobId(null);
      setApplications([]);
      return;
    }
    try {
      const response = await applicationService.getApplicationsByJob(jobId);
      setApplications(response.data);
      setSelectedJobId(jobId);
    } catch (err) {
      setMessage("❌ Failed to load applications.");
    }
  };

  const handleStatusChange = async (appId, status) => {
    try {
      await applicationService.updateStatus(appId, status);
      setMessage("✅ Status updated!");
      handleViewApplications(selectedJobId);
    } catch (err) {
      setMessage("❌ Failed to update status.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.heading}>Recruiter Dashboard</h2>
        <button
          onClick={() => {
            if (!showForm) {
              setShowForm(true);
              setEditJob(null);
            } else {
              resetForm();
            }
          }}
          style={styles.postBtn}
        >
          {showForm ? "Cancel" : "+ Post New Job"}
        </button>
      </div>

      {message && (
        <p style={message.includes("❌") ? styles.error : styles.success}>
          {message}
        </p>
      )}

      {showForm && (
        <div style={styles.formCard}>
          <h3 style={styles.formTitle}>
            {editJob ? "Edit Job" : "Post New Job"}
          </h3>
          <form onSubmit={handleSubmit}>
            <div style={styles.formGrid}>
              <div style={styles.field}>
                <label style={styles.label}>Job Title *</label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  style={styles.input}
                  required
                />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Company Name *</label>
                <input
                  name="companyName"
                  value={form.companyName}
                  onChange={handleChange}
                  style={styles.input}
                  required
                />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Location *</label>
                <input
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  style={styles.input}
                  required
                />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Salary</label>
                <input
                  name="salary"
                  type="number"
                  value={form.salary}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Job Type *</label>
                <select
                  name="jobType"
                  value={form.jobType}
                  onChange={handleChange}
                  style={styles.input}
                >
                  <option value="FULL_TIME">Full Time</option>
                  <option value="PART_TIME">Part Time</option>
                  <option value="CONTRACT">Contract</option>
                  <option value="INTERNSHIP">Internship</option>
                  <option value="REMOTE">Remote</option>
                </select>
              </div>
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Description *</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                style={styles.textarea}
                rows={4}
                required
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Requirements</label>
              <textarea
                name="requirements"
                value={form.requirements}
                onChange={handleChange}
                style={styles.textarea}
                rows={3}
              />
            </div>
            <div style={styles.formActions}>
              <button type="submit" style={styles.submitBtn}>
                {editJob ? "Update Job" : "Post Job"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                style={styles.cancelBtn}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <h3 style={styles.subHeading}>My Posted Jobs ({jobs.length})</h3>
      {loading && <p style={styles.info}>Loading...</p>}
      {!loading && jobs.length === 0 && (
        <p style={styles.info}>
          No jobs posted yet. Click "+ Post New Job" to get started!
        </p>
      )}

      {jobs.map((job) => (
        <div key={job.id} style={styles.jobCard}>
          <div style={styles.jobHeader}>
            <div>
              <h3 style={styles.jobTitle}>{job.title}</h3>
              <p style={styles.jobMeta}>
                {job.companyName} • {job.location} • {job.type}
              </p>
            </div>
            <div style={styles.jobActions}>
              <button
                onClick={() => handleViewApplications(job.id)}
                style={styles.viewBtn}
              >
                {selectedJobId === job.id
                  ? "Hide Applications"
                  : "View Applications"}
              </button>
              <button onClick={() => handleEdit(job)} style={styles.editBtn}>
                Edit
              </button>
              <button
                onClick={() => handleDelete(job.id)}
                style={styles.deleteBtn}
              >
                Delete
              </button>
            </div>
          </div>

          {selectedJobId === job.id && (
            <div style={styles.applicationsSection}>
              <h4 style={styles.appTitle}>
                Applications ({applications.length})
              </h4>
              {applications.length === 0 && (
                <p style={styles.info}>No applications yet.</p>
              )}
              {applications.map((app) => (
                <div key={app.id} style={styles.appCard}>
                  <div>
                    <p style={styles.appName}>{app.seeker?.name}</p>
                    <p style={styles.appEmail}>{app.seeker?.email}</p>
                    <p style={styles.appDate}>
                      Applied: {new Date(app.appliedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div style={styles.appRight}>
                    <span
                      style={{
                        ...styles.statusBadge,
                        ...getStatusStyle(app.status),
                      }}
                    >
                      {app.status}
                    </span>
                    <select
                      value={app.status}
                      onChange={(e) =>
                        handleStatusChange(app.id, e.target.value)
                      }
                      style={styles.statusSelect}
                    >
                      <option value="APPLIED">Applied</option>
                      <option value="REVIEWED">Reviewed</option>
                      <option value="SHORTLISTED">Shortlisted</option>
                      <option value="REJECTED">Rejected</option>
                      <option value="HIRED">Hired</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

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

const styles = {
  container: { maxWidth: "1000px", margin: "0 auto", padding: "24px" },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  heading: { color: "#1a73e8", margin: 0 },
  postBtn: {
    padding: "10px 20px",
    backgroundColor: "#1a73e8",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "15px",
  },
  formCard: {
    backgroundColor: "white",
    borderRadius: "8px",
    padding: "28px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
    marginBottom: "28px",
  },
  formTitle: { color: "#333", marginBottom: "20px" },
  formGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" },
  field: { marginBottom: "14px" },
  label: {
    display: "block",
    marginBottom: "6px",
    fontWeight: "bold",
    color: "#333",
    fontSize: "14px",
  },
  input: {
    width: "100%",
    padding: "9px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontSize: "14px",
    boxSizing: "border-box",
  },
  textarea: {
    width: "100%",
    padding: "9px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontSize: "14px",
    boxSizing: "border-box",
    resize: "vertical",
  },
  formActions: { display: "flex", gap: "12px", marginTop: "8px" },
  submitBtn: {
    padding: "10px 24px",
    backgroundColor: "#1a73e8",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "15px",
  },
  cancelBtn: {
    padding: "10px 24px",
    backgroundColor: "#ccc",
    color: "#333",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "15px",
  },
  subHeading: { color: "#333", marginBottom: "16px" },
  jobCard: {
    backgroundColor: "white",
    borderRadius: "8px",
    padding: "20px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    marginBottom: "16px",
    borderLeft: "4px solid #1a73e8",
  },
  jobHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "10px",
  },
  jobTitle: { color: "#1a73e8", margin: "0 0 4px 0" },
  jobMeta: { color: "#666", fontSize: "14px", margin: 0 },
  jobActions: { display: "flex", gap: "8px" },
  viewBtn: {
    padding: "7px 14px",
    backgroundColor: "#e8f0fe",
    color: "#1a73e8",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "13px",
  },
  editBtn: {
    padding: "7px 14px",
    backgroundColor: "#fff3e0",
    color: "#e65100",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "13px",
  },
  deleteBtn: {
    padding: "7px 14px",
    backgroundColor: "#ffebee",
    color: "#c62828",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "13px",
  },
  applicationsSection: {
    marginTop: "16px",
    borderTop: "1px solid #eee",
    paddingTop: "16px",
  },
  appTitle: { color: "#333", marginBottom: "12px" },
  appCard: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px",
    backgroundColor: "#f9f9f9",
    borderRadius: "6px",
    marginBottom: "8px",
  },
  appName: { fontWeight: "bold", color: "#333", margin: "0 0 2px 0" },
  appEmail: { color: "#666", fontSize: "13px", margin: "0 0 2px 0" },
  appDate: { color: "#999", fontSize: "12px", margin: 0 },
  appRight: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: "6px",
  },
  statusBadge: {
    padding: "3px 10px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: "bold",
  },
  statusSelect: {
    padding: "5px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontSize: "13px",
    cursor: "pointer",
  },
  success: { color: "#2e7d32", fontWeight: "bold", marginBottom: "12px" },
  error: { color: "red", marginBottom: "12px" },
  info: { color: "#666", fontStyle: "italic" },
};

export default RecruiterDashboard;
