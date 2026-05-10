import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const API_BASE = process.env.REACT_APP_API_URL;
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      alert("Please fill all fields");
      return;
    }
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/users/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      let data;
      try {
        data = await res.json();
      } catch {
        throw new Error("Invalid server response");
      }
      if (!res.ok) {
        alert(data.error || "Login failed");
        return;
      }

      const role = data.role?.toLowerCase();

      if (!role) {
        alert("Role missing from backend response");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", role);
      localStorage.setItem("user_id", String(data.user_id));
      localStorage.setItem("email", data.email);

      if (role === "admin") navigate("/admin/dashboard");
      else if (role === "researcher") navigate("/researcher/dashboard");
      else navigate("/user/dashboard");

    } catch (err) {
      console.error(err);
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

        <h2 className="login-title">Login</h2>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-input-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="login-input-group">
            <label>Password</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                required
              />
              <span
                className="eye-icon"
                onClick={() => setShowPassword((prev) => !prev)}
                style={{ cursor: "pointer" }}
              >
                {showPassword ? "🙈" : "👁"}
              </span>
            </div>
          </div>

          <div className="forgot-password">
            <Link to="/forgot-password">Forgot password?</Link>
          </div>

          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="signup-text">
          Don't have an account?{" "}
          <Link to="/signup" className="signup-link">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;