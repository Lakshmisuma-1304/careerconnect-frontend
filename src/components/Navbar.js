import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.brand}>
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "10px",
            background: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "900",
            fontSize: "16px",
            color: "#1a73e8",
          }}
        >
          CC
        </div>
        <span style={styles.brandName}>
          Career<span style={styles.brandAccent}>Connect</span>
        </span>
      </Link>
      <div style={styles.links}>
        <Link to="/" style={styles.link}>
          Browse Jobs
        </Link>
        {!user && (
          <>
            <Link to="/login" style={styles.link}>
              Login
            </Link>
            <Link to="/register" style={styles.registerBtn}>
              Get Started
            </Link>
          </>
        )}
        {user && user.role === "RECRUITER" && (
          <Link to="/recruiter" style={styles.link}>
            Dashboard
          </Link>
        )}
        {user && user.role === "JOB_SEEKER" && (
          <Link to="/seeker" style={styles.link}>
            My Applications
          </Link>
        )}
        {user && user.role === "ADMIN" && (
          <Link to="/admin" style={styles.link}>
            Admin
          </Link>
        )}
        {user && (
          <>
            <div style={styles.userInfo}>
              <span style={styles.avatar}>
                {user.name?.charAt(0).toUpperCase()}
              </span>
              <span style={styles.name}>Hi, {user.name}</span>
            </div>
            <button onClick={handleLogout} style={styles.logoutBtn}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 32px",
    height: "64px",
    background: "linear-gradient(135deg, #1a73e8 0%, #0d47a1 100%)",
    boxShadow: "0 2px 20px rgba(26,115,232,0.3)",
    position: "sticky",
    top: 0,
    zIndex: 1000,
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    textDecoration: "none",
  },
  brandIcon: { fontSize: "24px" },
  brandName: {
    fontSize: "22px",
    fontWeight: "800",
    color: "white",
    letterSpacing: "-0.5px",
  },
  brandAccent: { color: "#90CAF9" },
  links: { display: "flex", alignItems: "center", gap: "8px" },
  link: {
    color: "rgba(255,255,255,0.9)",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "500",
    padding: "8px 16px",
    borderRadius: "8px",
    transition: "background 0.2s",
    ":hover": { background: "rgba(255,255,255,0.1)" },
  },
  registerBtn: {
    backgroundColor: "white",
    color: "#1a73e8",
    textDecoration: "none",
    padding: "8px 20px",
    borderRadius: "20px",
    fontSize: "14px",
    fontWeight: "700",
    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "4px 12px",
    borderRadius: "20px",
    background: "rgba(255,255,255,0.15)",
  },
  avatar: {
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    background: "#90CAF9",
    color: "#0d47a1",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "14px",
    fontWeight: "800",
    lineHeight: "30px",
    textAlign: "center",
  },
  name: { color: "white", fontSize: "14px", fontWeight: "500" },
  logoutBtn: {
    backgroundColor: "transparent",
    color: "white",
    border: "1px solid rgba(255,255,255,0.5)",
    padding: "7px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
  },
};

export default Navbar;
