import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Signup.css";

const API_BASE = process.env.REACT_APP_API_URL;
const ALLOWED_DOMAINS = ["gmail.com", "banasthali.in"];

const Signup = () => {
  const [form, setForm] = useState({
    fullName: "", email: "", password: "", confirmPassword: "", role: "User",
  });
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [verified, setVerified] = useState(false);
  const [errors, setErrors] = useState({});
  const [otpLoading, setOtpLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const navigate = useNavigate();

  const isAllowedEmail = (email) => {
    if (!email.includes("@")) return false;
    const domain = email.split("@")[1]?.toLowerCase();
    return ALLOWED_DOMAINS.includes(domain);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    let newErrors = {};
    if (!/^[A-Za-z ]+$/.test(form.fullName.trim()))
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

  const sendOtp = async () => {
    if (!form.email) { alert("Enter email first"); return; }
    if (!isAllowedEmail(form.email)) { alert("Only gmail.com and banasthali.in emails allowed!"); return; }

    try {
      setOtpLoading(true);
      const res = await fetch(`${API_BASE}/api/accounts/send-otp/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email }),
      });

      const text = await res.text();
      let data;
      try { data = JSON.parse(text); }
      catch { throw new Error("Server returned invalid response"); }

      if (res.ok) {
        alert(data.message || "OTP sent ✅");
        setOtpSent(true);
      } else {
        alert(data.error || "Failed to send OTP ❌");
      }
    } catch (err) {
      console.error("OTP ERROR:", err);
      alert("Server error ❌ - please try again");
    } finally {
      setOtpLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp) { alert("Enter OTP first"); return; }
    try {
      const res = await fetch(`${API_BASE}/api/accounts/verify-otp/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, otp }),
      });
      let data;
      try { data = await res.json(); }
      catch { throw new Error("Invalid server response"); }

      if (res.ok && data.message) {
        alert("OTP Verified ✅");
        setVerified(true);
      } else {
        alert(data.error || "Invalid OTP ❌");
      }
    } catch (err) {
      console.error(err);
      alert("Error verifying OTP");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    if (!verified) { alert("Please verify OTP first"); return; }

    setSubmitLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/users/signup/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email.trim(),
          password: form.password.trim(),
          full_name: form.fullName.trim(),
          role: form.role.toLowerCase(),
        }),
      });

      let data;
      try { data = await res.json(); }
      catch { throw new Error("Invalid server response"); }

      if (res.ok) {
        alert("Signup successful 🎉");
        navigate("/login");
      } else {
        alert(data.error || data.message || JSON.stringify(data));
      }
    } catch (err) {
      console.error(err);
      alert(err.message || "Signup failed");
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="signup-wrapper">
      <div className="signup-card">
        <h1>🌱 AgriSmart</h1>

        <form onSubmit={handleSubmit} className="signup-form">

          <div className="input-group">
            <input type="text" name="fullName" placeholder="Full Name"
              value={form.fullName} onChange={handleChange} required />
            {errors.fullName && <p className="error-msg">{errors.fullName}</p>}
          </div>

          <div className="input-group">
            <input type="email" name="email" placeholder="Email Address"
              value={form.email} onChange={handleChange} required />
            {errors.email && <p className="error-msg">{errors.email}</p>}
          </div>

          {/* ✅ Send OTP - disabled only when verified */}
          <button type="button" className="btn-ghost" onClick={sendOtp}
            disabled={otpLoading || verified}>
            {otpLoading ? "Sending OTP..." : "Send OTP"}
          </button>

          {/* ✅ OTP input - only shown when sent and not yet verified */}
          {otpSent && !verified && (
            <div className="input-group">
              <input type="text" placeholder="Enter OTP"
                value={otp} onChange={(e) => setOtp(e.target.value)} />
              <button type="button" className="btn-ghost" onClick={verifyOtp}>
                Verify OTP
              </button>
              {/* ✅ Resend option */}
              <button type="button" className="btn-ghost"
                onClick={sendOtp} disabled={otpLoading}
                style={{ fontSize: "12px", marginTop: "5px" }}>
                {otpLoading ? "Sending..." : "Resend OTP"}
              </button>
            </div>
          )}

          {/* ✅ Verified badge */}
          {verified && (
            <p style={{ color: "green", fontWeight: "bold" }}>✅ Email Verified</p>
          )}

          <div className="input-group">
            <input type="password" name="password" placeholder="Password"
              value={form.password} onChange={handleChange} required />
            {errors.password && <p className="error-msg">{errors.password}</p>}
          </div>

          <div className="input-group">
            <input type="password" name="confirmPassword" placeholder="Confirm Password"
              value={form.confirmPassword} onChange={handleChange} required />
            {errors.confirmPassword && <p className="error-msg">{errors.confirmPassword}</p>}
          </div>

          <div className="role-selector">
            <p className="section-title">Select Your Role</p>
            <div className="role-grid">
              {["User", "Researcher"].map((r) => (
                <label key={r}
                  className={`role-item ${form.role.toLowerCase() === r.toLowerCase() ? "selected" : ""}`}>
                  <input type="radio" name="role" value={r}
                    checked={form.role.toLowerCase() === r.toLowerCase()}
                    onChange={handleChange} />
                  <span className="role-name">{r}</span>
                </label>
              ))}
            </div>
          </div>

          <button type="submit" className="btn-signup-premium" disabled={submitLoading}>
            {submitLoading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p>Already have an account? <Link to="/login">Login</Link></p>
      </div>
    </div>
  );
};

export default Signup;