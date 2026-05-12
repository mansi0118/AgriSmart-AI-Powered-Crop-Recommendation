import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";
const API_BASE = process.env.REACT_APP_API_URL;
function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState("user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
      try {
        const res = await fetch(`${API_BASE}/api/users/login/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" ,
          },
          body: JSON.stringify({ email, password })
        });
        let data;

        try {
          data = await res.json();
        } catch {
          throw new Error("Invalid server response");
        }
        if (res.ok) {
          localStorage.setItem("token", String(data.token));
          localStorage.setItem("user_id", String(data.user_id));
          localStorage.setItem("role", data.role);
          localStorage.setItem("email", data.email);
          localStorage.setItem("full_name", data.full_name);
          alert("Login successful!");
          const role = data.role?.toLowerCase();
          if (role === "admin") navigate("/admin/dashboard");
          else if (role === "researcher") navigate("/researcher/dashboard");
          else navigate("/user/dashboard");
        } else {
          alert(data.non_field_errors?.[0] || "Login failed!");
        }
      } catch (err) {
        alert(err.message || "Server error");
      }
    } else {
      alert("Please use the Signup page for registration.");
      setIsLogin(true);
    }
  };

  return (
    <div className="auth-wrapper">
      <h1 className="auth-title">🌱 Welcome to AgriSmart</h1>
      <div className="auth-toggle">
        <button className={isLogin ? "active" : ""} onClick={() => setIsLogin(true)}>
          🔑 Login
        </button>
        <button className={!isLogin ? "active" : ""} onClick={() => setIsLogin(false)}>
          ✨ Signup
        </button>
      </div>
      <div className="auth-box">
        <form className="auth-form" onSubmit={handleSubmit}>
          {!isLogin && (
            <input type="text" placeholder="Full Name" value={fullName}
              onChange={(e) => setFullName(e.target.value)} required />
          )}
          <input type="email" placeholder="Email" value={email}
            onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={password}
            onChange={(e) => setPassword(e.target.value)} required />
          {!isLogin && (
            <div className="role-options">
              {["researcher", "admin", "user"].map((r) => (
                <div key={r} className={`role-card ${role === r ? "active" : ""}`}
                  onClick={() => setRole(r)}>
                  {r === "researcher" && "👨‍🔬 Researcher"}
                  {r === "admin" && "👑 Admin"}
                  {r === "user" && "👤 User"}
                </div>
              ))}
            </div>
          )}
          <button type="submit" className="btn-primary">
            {isLogin ? "Login" : "Signup"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Auth;
