import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";

import Home from "./pages/Home.jsx";
import Signup from "./pages/Signup.jsx";
import Login from "./pages/Login.jsx";
import GetStarted from "./pages/GetStarted.jsx";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import UserDashboard from "./pages/admin/UserDashboard.jsx";
import ResearcherDashboard from "./pages/admin/ResearcherDashboard.jsx";
import GuestDashboard from "./pages/admin/GuestDashboard.jsx";

function ProtectedRoute({ children, allowedRole }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) return <Navigate to="/login" />;
  if (allowedRole && role !== allowedRole) return <Navigate to="/login" />;

  return children;
}

function App() {
  // ✅ Wake up Render backend on app load
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/users/profile/`)
      .catch(() => {});
  }, []);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/get-started" element={<GetStarted />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:uidb64/:token" element={<ResetPassword />} />

        {/* Protected Routes */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute allowedRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } />

        <Route path="/researcher/dashboard/*" element={
          <ProtectedRoute allowedRole="researcher">
            <ResearcherDashboard />
          </ProtectedRoute>
        } />

        <Route path="/user/dashboard/*" element={
          <ProtectedRoute allowedRole="user">
            <UserDashboard />
          </ProtectedRoute>
        } />

        <Route path="/guest/dashboard/*" element={<GuestDashboard />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;