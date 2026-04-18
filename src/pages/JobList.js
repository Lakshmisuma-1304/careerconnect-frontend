import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jobService } from "../services/api";

function JobList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await jobService.getAllJobs();
      setJobs(response.data);
    } catch (err) {
      setError("Failed to load jobs.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!keyword.trim()) {
      fetchJobs();
      return;
    }
    setLoading(true);
    try {
      const response = await jobService.searchJobs(keyword);
      setJobs(response.data);
    } catch (err) {
      setError("Search failed.");
    } finally {
      setLoading(false);
    }
  };

  const getTypeColor = (type) => {
    const colors = {
      FULL_TIME: { bg: "#E8F5E9", color: "#2E7D32" },
      PART_TIME: { bg: "#FFF3E0", color: "#E65100" },
      INTERNSHIP: { bg: "#E3F2FD", color: "#1565C0" },
      CONTRACT: { bg: "#F3E5F5", color: "#6A1B9A" },
      REMOTE: { bg: "#E0F2F1", color: "#00695C" },
    };
    return colors[type] || { bg: "#F5F5F5", color: "#616161" };
  };

  return (
    <div style={styles.page}>
      {/* Hero Section */}
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>Find Your Dream Job</h1>
        <p style={styles.heroSubtitle}>
          Discover thousands of opportunities from top companies
        </p>
        <div style={styles.searchBox}>
          <span style={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Search by title, location, or company..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            style={styles.searchInput}
          />
          <button onClick={handleSearch} style={styles.searchBtn}>
            Search Jobs
          </button>
        </div>
        <div style={styles.heroStats}>
          <span style={styles.statItem}>✅ {jobs.length} Jobs Available</span>
          <span style={styles.statItem}>🏢 Multiple Companies</span>
          <span style={styles.statItem}>📍 Multiple Locations</span>
        </div>
      </div>

      {/* Jobs Grid */}
      <div style={styles.container}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>
            {keyword ? `Results for "${keyword}"` : "Latest Job Openings"}
          </h2>
          <span style={styles.jobCount}>{jobs.length} jobs found</span>
        </div>

        {loading && (
          <div style={styles.loadingBox}>
            <p style={styles.loadingText}>Loading jobs...</p>
          </div>
        )}

        {error && <p style={styles.error}>{error}</p>}

        {!loading && jobs.length === 0 && (
          <div style={styles.emptyBox}>
            <p style={{ fontSize: "48px" }}>🔍</p>
            <p style={styles.emptyText}>No jobs found</p>
            <button onClick={fetchJobs} style={styles.resetBtn}>
              Show All Jobs
            </button>
          </div>
        )}

        <div style={styles.grid}>
          {jobs.map((job) => {
            const typeStyle = getTypeColor(job.type);
            return (
              <div
                key={job.id}
                style={styles.card}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "translateY(-4px)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "translateY(0)")
                }
              >
                <div style={styles.cardTop}>
                  <div style={styles.companyLogo}>
                    {job.companyName?.charAt(0) || "C"}
                  </div>
                  <span
                    style={{
                      ...styles.typeBadge,
                      backgroundColor: typeStyle.bg,
                      color: typeStyle.color,
                    }}
                  >
                    {job.type?.replace("_", " ")}
                  </span>
                </div>
                <h3 style={styles.jobTitle}>{job.title}</h3>
                <p style={styles.company}>{job.companyName}</p>
                <div style={styles.jobMeta}>
                  <span style={styles.metaItem}>📍 {job.location}</span>
                  {job.salary && (
                    <span style={styles.metaItem}>
                      💰 ₹{job.salary?.toLocaleString()}
                    </span>
                  )}
                </div>
                <p style={styles.description}>
                  {job.description?.substring(0, 80)}...
                </p>
                <button
                  onClick={() => navigate(`/jobs/${job.id}`)}
                  style={styles.viewBtn}
                >
                  View Details →
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { background: "#F8FAFF", minHeight: "100vh" },
  hero: {
    background: "linear-gradient(135deg, #1a73e8 0%, #0d47a1 100%)",
    padding: "60px 32px",
    textAlign: "center",
    color: "white",
  },
  heroTitle: {
    fontSize: "42px",
    fontWeight: "800",
    margin: "0 0 12px 0",
    letterSpacing: "-1px",
  },
  heroSubtitle: { fontSize: "18px", opacity: 0.85, margin: "0 0 32px 0" },
  searchBox: {
    display: "flex",
    alignItems: "center",
    gap: "0",
    background: "white",
    borderRadius: "50px",
    padding: "6px 6px 6px 20px",
    maxWidth: "680px",
    margin: "0 auto 24px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
  },
  searchIcon: { fontSize: "18px", marginRight: "8px" },
  searchInput: {
    flex: 1,
    border: "none",
    outline: "none",
    fontSize: "16px",
    color: "#333",
    background: "transparent",
  },
  searchBtn: {
    backgroundColor: "#1a73e8",
    color: "white",
    border: "none",
    padding: "12px 28px",
    borderRadius: "44px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
  },
  heroStats: {
    display: "flex",
    justifyContent: "center",
    gap: "32px",
    flexWrap: "wrap",
  },
  statItem: { fontSize: "14px", opacity: 0.9, fontWeight: "500" },
  container: { maxWidth: "1200px", margin: "0 auto", padding: "40px 24px" },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
  },
  sectionTitle: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#1a1a2e",
    margin: 0,
  },
  jobCount: {
    fontSize: "14px",
    color: "#666",
    background: "#E8F0FE",
    padding: "4px 12px",
    borderRadius: "12px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: "24px",
  },
  card: {
    background: "white",
    borderRadius: "16px",
    padding: "24px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
    border: "1px solid #E8ECEF",
    transition: "transform 0.2s, box-shadow 0.2s",
    cursor: "pointer",
  },
  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
  },
  companyLogo: {
    width: "48px",
    height: "48px",
    borderRadius: "12px",
    background: "linear-gradient(135deg, #1a73e8, #0d47a1)",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    fontWeight: "800",
  },
  typeBadge: {
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
  },
  jobTitle: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#1a1a2e",
    margin: "0 0 4px 0",
  },
  company: {
    fontSize: "14px",
    color: "#666",
    fontWeight: "500",
    margin: "0 0 12px 0",
  },
  jobMeta: {
    display: "flex",
    gap: "16px",
    marginBottom: "12px",
    flexWrap: "wrap",
  },
  metaItem: { fontSize: "13px", color: "#555" },
  description: {
    fontSize: "14px",
    color: "#777",
    lineHeight: "1.5",
    margin: "0 0 20px 0",
  },
  viewBtn: {
    width: "100%",
    padding: "11px",
    background: "linear-gradient(135deg, #1a73e8, #0d47a1)",
    color: "white",
    border: "none",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
  },
  loadingBox: { textAlign: "center", padding: "60px" },
  loadingText: { color: "#666", fontSize: "16px" },
  emptyBox: {
    textAlign: "center",
    padding: "60px",
    background: "white",
    borderRadius: "16px",
  },
  emptyText: { fontSize: "18px", color: "#666", margin: "8px 0 20px" },
  resetBtn: {
    padding: "10px 24px",
    background: "#1a73e8",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
  },
  error: { color: "red", textAlign: "center", padding: "20px" },
};

export default JobList;
