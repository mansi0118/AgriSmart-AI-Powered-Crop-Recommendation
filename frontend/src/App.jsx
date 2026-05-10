import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Signup from "./pages/Signup.jsx";
import Login from "./pages/Login.jsx";
import GetStarted from "./pages/GetStarted.jsx";
import "./pages/ResetPassword.css";
import { Navigate } from "react-router-dom";

// Dashboards
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import UserDashboard from "./pages/admin/UserDashboard.jsx";
import ResearcherDashboard from "./pages/admin/ResearcherDashboard.jsx";
import GuestDashboard from "./pages/admin/GuestDashboard.jsx";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import Dashboard from "./pages/admin/Dashboard.jsx";
import Users from "./pages/admin/Users.jsx";
import ResearchRequests from "./pages/admin/ResearchRequests.jsx";
import Settings from "./pages/admin/Settings.jsx";
import Weather from "./pages/admin/Weather.jsx";

function App() {
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

        {/* --- 1. ADMIN DASHBOARD --- */}
        <Route path="/admin/dashboard" element={<AdminDashboard />}>
        </Route>

        <Route path="/researcher/dashboard/*" element={<ResearcherDashboard />} />

        {/* --- 3. USER DASHBOARD --- */}
        <Route path="/user/dashboard/*" element={<UserDashboard />} />

        {/* --- 4. GUEST DASHBOARD --- */}
        <Route path="/guest/dashboard/*" element={<GuestDashboard />} />
        <Route path="*" element={<Home />} />
        
      </Routes>
    </Router>
  );
}

export default App;