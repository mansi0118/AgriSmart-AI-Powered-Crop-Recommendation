import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Signup.css";

const Signup = () => {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "User",
  });
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [verified, setVerified] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const ALLOWED_DOMAINS = ["gmail.com", "banasthali.in"];

  const isAllowedEmail = (email) => {
    const domain = email.split("@")[1]?.toLowerCase();
    return ALLOWED_DOMAINS.includes(domain);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    let newErrors = {};

    if (!/^[A-Za-z ]+$/.test(form.fullName))
      newErrors.fullName = "Name should contain alphabets only";

    if (!isAllowedEmail(form.email))
      newErrors.email = "Only gmail.com and banasthali.in emails are allowed";

    if (form.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";

    if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 🔐 SEND OTP
  const sendOtp = async () => {
    if (!form.email) {
      alert("Enter email first");
      return;
    }

    if (!isAllowedEmail(form.email)) {
      alert("Not a valid email!");
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/api/accounts/send-otp/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email }),
      });

      const text = await res.text();
      console.log("RAW:", text);

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Server returned HTML instead of JSON");
      }

      if (res.ok) {
        alert(data.message || "OTP sent ✅");
        setOtpSent(true);
      } else {
        alert(data.error || "Failed ❌");
      }
    } catch (err) {
      console.error("OTP ERROR:", err);
      alert("Server error ❌ (check backend)");
    }
  };

  // ✅ VERIFY OTP
  const verifyOtp = async () => {
    try {
      const res = await fetch(
        "http://127.0.0.1:8000/api/accounts/verify-otp/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: form.email, otp }),
        }
      );

      const data = await res.json();

      if (data.message) {
        alert("OTP Verified ✅");
        setVerified(true);
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Error verifying OTP");
    }
  };

  // 🚀 FINAL SIGNUP
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    if (!verified) {
      alert("Please verify OTP first");
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/api/users/signup/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          full_name: form.fullName,
          role: form.role.toLowerCase(),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Signup successful 🎉");
        navigate("/login");
      } else {
        alert(JSON.stringify(data));
      }
    } catch (err) {
      console.error(err);
      alert("Signup failed");
    }
  };

  return (
    <div className="signup-wrapper">
      <div className="signup-card">
        <h1>🌱 AgriSmart</h1>

        <form onSubmit={handleSubmit} className="signup-form">

          {/* FULL NAME */}
          <div className="input-group">
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={form.fullName}
              onChange={handleChange}
              required
            />
            {errors.fullName && <p className="error-msg">{errors.fullName}</p>}
          </div>

          {/* EMAIL */}
          <div className="input-group">
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              required
            />
            {errors.email && <p className="error-msg">{errors.email}</p>}
          </div>

          {/* SEND OTP BUTTON */}
          <button type="button" className="btn-ghost" onClick={sendOtp}>
            Send OTP
          </button>

          {/* OTP INPUT */}
          {otpSent && (
            <div className="input-group">
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <button type="button" className="btn-ghost" onClick={verifyOtp}>
                Verify OTP
              </button>
            </div>
          )}

          {/* PASSWORD */}
          <div className="input-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />
            {errors.password && <p className="error-msg">{errors.password}</p>}
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="input-group">
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
            {errors.confirmPassword && (
              <p className="error-msg">{errors.confirmPassword}</p>
            )}
          </div>

          {/* ROLE */}
          <div className="role-selector">
            <p className="section-title">Select Your Role</p>
            <div className="role-grid">
              {["User", "Researcher"].map((r) => (
                <label
                  key={r}
                  className={`role-item ${
                    form.role.toLowerCase() === r.toLowerCase() ? "selected" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={r}
                    checked={form.role.toLowerCase() === r.toLowerCase()}
                    onChange={handleChange}
                  />
                  <span className="role-name">{r}</span>
                </label>
              ))}
            </div>
          </div>

          <button type="submit" className="btn-signup-premium">
            Create Account
          </button>
        </form>

        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;