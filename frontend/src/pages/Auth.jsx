import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

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
        const res = await fetch("http://127.0.0.1:8000/api/users/login/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (res.ok) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user_id", data.id);
          localStorage.setItem("role", data.role);
          localStorage.setItem("email", data.email);
          localStorage.setItem("full_name", data.full_name);
          alert("Login successful!");
          if (data.role === "admin") navigate("/admin");
          else if (data.role === "researcher") navigate("/researcher");
          else navigate("/landingpage");
        } else {
          alert(data.non_field_errors?.[0] || "Login failed!");
        }
      } catch (err) {
        alert("Server error. Is backend running?");
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
