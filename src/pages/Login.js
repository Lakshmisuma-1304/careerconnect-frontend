import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../services/api";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await authService.login({ email, password });
      login(response.data);
      const role = response.data.role;
      if (role === "RECRUITER") navigate("/recruiter");
      else if (role === "JOB_SEEKER") navigate("/seeker");
      else if (role === "ADMIN") navigate("/admin");
      else navigate("/");
    } catch (err) {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      {/* Left Panel */}
      <div style={styles.leftPanel}>
        <div style={styles.leftContent}>
          <div style={styles.brandBox}>
            <span style={styles.brandIcon}>💼</span>
            <span style={styles.brandName}>
              Career<span style={styles.brandAccent}>Connect</span>
            </span>
          </div>
          <h2 style={styles.leftTitle}>Your Career Journey Starts Here</h2>
          <p style={styles.leftSubtitle}>
            Connect with top companies and find your dream job today.
          </p>
          <div style={styles.features}>
            <div style={styles.featureItem}>
              <span style={styles.featureIcon}>✅</span>
              <span style={styles.featureText}>
                Browse thousands of job listings
              </span>
            </div>
            <div style={styles.featureItem}>
              <span style={styles.featureIcon}>✅</span>
              <span style={styles.featureText}>Apply with one click</span>
            </div>
            <div style={styles.featureItem}>
              <span style={styles.featureIcon}>✅</span>
              <span style={styles.featureText}>
                Track your application status
              </span>
            </div>
            <div style={styles.featureItem}>
              <span style={styles.featureIcon}>✅</span>
              <span style={styles.featureText}>Upload your resume easily</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div style={styles.rightPanel}>
        <div style={styles.formCard}>
          <h2 style={styles.formTitle}>Welcome Back! 👋</h2>
          <p style={styles.formSubtitle}>
            Sign in to your CareerConnect account
          </p>

          {error && (
            <div style={styles.errorBox}>
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={styles.field}>
              <label style={styles.label}>Email Address</label>
              <div style={styles.inputBox}>
                <span style={styles.inputIcon}>📧</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  style={styles.input}
                  required
                />
              </div>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Password</label>
              <div style={styles.inputBox}>
                <span style={styles.inputIcon}>🔒</span>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  style={styles.input}
                  required
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  {showPassword ? "🙈" : "👁️"}
                </span>
              </div>
            </div>

            <button
              type="submit"
              style={loading ? styles.btnLoading : styles.btn}
              disabled={loading}
            >
              {loading ? "⏳ Signing in..." : "Sign In →"}
            </button>
          </form>

          <div style={styles.divider}>
            <span style={styles.dividerLine}></span>
            <span style={styles.dividerText}>New to CareerConnect?</span>
            <span style={styles.dividerLine}></span>
          </div>

          <Link to="/register" style={styles.registerLink}>
            Create Your Free Account
          </Link>

          <div style={styles.testAccounts}>
            <p style={styles.testTitle}>🔑 Test Accounts:</p>
            <div style={styles.testGrid}>
              <div
                style={styles.testCard}
                onClick={() => {
                  setEmail("admin@test.com");
                  setPassword("password123");
                }}
              >
                <span style={styles.testRole}>👑 Admin</span>
                <span style={styles.testEmail}>admin@test.com</span>
              </div>
              <div
                style={styles.testCard}
                onClick={() => {
                  setEmail("recruiter@test.com");
                  setPassword("password123");
                }}
              >
                <span style={styles.testRole}>🏢 Recruiter</span>
                <span style={styles.testEmail}>recruiter@test.com</span>
              </div>
              <div
                style={styles.testCard}
                onClick={() => {
                  setEmail("seeker@test.com");
                  setPassword("password123");
                }}
              >
                <span style={styles.testRole}>👤 Seeker</span>
                <span style={styles.testEmail}>seeker@test.com</span>
              </div>
            </div>
            <p style={styles.testHint}>
              👆 Click any card to auto-fill credentials
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "Arial, sans-serif",
  },
  leftPanel: {
    flex: 1,
    background: "linear-gradient(135deg, #1a73e8 0%, #0d47a1 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "60px 48px",
  },
  leftContent: { maxWidth: "420px" },
  brandBox: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "40px",
  },
  brandIcon: { fontSize: "36px" },
  brandName: {
    fontSize: "32px",
    fontWeight: "800",
    color: "white",
    letterSpacing: "-1px",
  },
  brandAccent: { color: "#90CAF9" },
  leftTitle: {
    fontSize: "36px",
    fontWeight: "800",
    color: "white",
    margin: "0 0 16px 0",
    lineHeight: "1.2",
  },
  leftSubtitle: {
    fontSize: "17px",
    color: "rgba(255,255,255,0.8)",
    margin: "0 0 40px 0",
    lineHeight: "1.6",
  },
  features: { display: "flex", flexDirection: "column", gap: "16px" },
  featureItem: { display: "flex", alignItems: "center", gap: "12px" },
  featureIcon: { fontSize: "18px" },
  featureText: {
    color: "rgba(255,255,255,0.9)",
    fontSize: "16px",
    fontWeight: "500",
  },
  rightPanel: {
    flex: 1,
    background: "#F8FAFF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 48px",
  },
  formCard: {
    background: "white",
    borderRadius: "24px",
    padding: "48px",
    boxShadow: "0 8px 40px rgba(0,0,0,0.08)",
    width: "100%",
    maxWidth: "460px",
  },
  formTitle: {
    fontSize: "28px",
    fontWeight: "800",
    color: "#1a1a2e",
    margin: "0 0 8px 0",
  },
  formSubtitle: {
    fontSize: "15px",
    color: "#666",
    margin: "0 0 28px 0",
  },
  errorBox: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "#FFF3F3",
    border: "1px solid #FFCDD2",
    borderRadius: "10px",
    padding: "12px 16px",
    color: "#C62828",
    fontSize: "14px",
    marginBottom: "20px",
  },
  field: { marginBottom: "20px" },
  label: {
    display: "block",
    fontSize: "14px",
    fontWeight: "600",
    color: "#333",
    marginBottom: "8px",
  },
  inputBox: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    border: "2px solid #E8ECEF",
    borderRadius: "12px",
    padding: "12px 16px",
    background: "#FAFAFA",
    transition: "border-color 0.2s",
  },
  inputIcon: { fontSize: "18px" },
  input: {
    flex: 1,
    border: "none",
    outline: "none",
    fontSize: "15px",
    color: "#333",
    background: "transparent",
  },
  eyeIcon: { fontSize: "18px", cursor: "pointer" },
  btn: {
    width: "100%",
    padding: "14px",
    marginTop: "8px",
    background: "linear-gradient(135deg, #1a73e8, #0d47a1)",
    color: "white",
    border: "none",
    borderRadius: "12px",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 4px 16px rgba(26,115,232,0.3)",
  },
  btnLoading: {
    width: "100%",
    padding: "14px",
    marginTop: "8px",
    background: "#90CAF9",
    color: "white",
    border: "none",
    borderRadius: "12px",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "not-allowed",
  },
  divider: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    margin: "24px 0",
  },
  dividerLine: {
    flex: 1,
    height: "1px",
    background: "#E8ECEF",
  },
  dividerText: { fontSize: "13px", color: "#999", whiteSpace: "nowrap" },
  registerLink: {
    display: "block",
    textAlign: "center",
    padding: "13px",
    border: "2px solid #1a73e8",
    borderRadius: "12px",
    color: "#1a73e8",
    textDecoration: "none",
    fontSize: "15px",
    fontWeight: "700",
  },
  testAccounts: {
    marginTop: "24px",
    background: "#F8FAFF",
    borderRadius: "12px",
    padding: "16px",
  },
  testTitle: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#444",
    margin: "0 0 10px 0",
  },
  testGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "8px",
  },
  testCard: {
    background: "white",
    border: "1px solid #E8ECEF",
    borderRadius: "8px",
    padding: "8px",
    textAlign: "center",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  testRole: { fontSize: "12px", fontWeight: "600", color: "#333" },
  testEmail: { fontSize: "10px", color: "#888" },
  testHint: {
    fontSize: "11px",
    color: "#999",
    textAlign: "center",
    margin: "8px 0 0 0",
  },
};

export default Login;
