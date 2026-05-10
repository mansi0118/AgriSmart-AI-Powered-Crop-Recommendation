import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import "./Login.css";
import "./ResetPassword.css";

const API_BASE = process.env.REACT_APP_API_URL;
const ResetPassword = () => {
  const { uidb64, token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) return alert("Passwords don't match!");
    if (password.trim().length < 6) return alert("Password must be at least 6 characters!");

    setLoading(true);
    try {
      const res = await fetch(
        `${API_BASE}/api/users/reset-password/${uidb64}/${token}/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password: password.trim() }),
        }
      );

      let data;

      try {
        data = await res.json();
      } catch {
        throw new Error("Invalid server response");
      }
      if (res.ok) {
        alert("Password reset successful! Please login.");
        navigate("/login");
      } else {
        alert(data.error || "Something went wrong!");
      }
    } catch (err) {
      alert(err.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="logo">
          <span className="logo-icon">🌱</span>
          <span className="logo-text">AgriSmart</span>
        </div>

        <h2 className="login-title">Set New Password</h2>
        <p style={{ textAlign: "center", color: "#666", fontSize: "14px", marginBottom: "20px" }}>
          Enter your new password below
        </p>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-input-group">
            <label>New Password</label>
            <input
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="login-input-group">
            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <p className="signup-text">
          Remember password?{" "}
          <Link to="/login" className="signup-link">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;