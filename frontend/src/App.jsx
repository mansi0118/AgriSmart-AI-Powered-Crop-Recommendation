<<<<<<< HEAD
=======

>>>>>>> 95c727f253994a2f5f16730bfb9833d553f646d4
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Signup from "./pages/Signup.jsx";
import Login from "./pages/Login.jsx";
import GetStarted from "./pages/GetStarted.jsx";


// Dashboards
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import UserDashboard from "./pages/admin/UserDashboard.jsx";
import ResearcherDashboard from "./pages/admin/ResearcherDashboard.jsx";
import GuestDashboard from "./pages/admin/GuestDashboard.jsx";

import Dashboard from "./pages/admin/Dashboard.jsx";
import Users from "./pages/admin/Users.jsx";
import ResearchRequests from "./pages/admin/ResearchRequests.jsx";
import Settings from "./pages/admin/Settings.jsx";

function App() {
  return (
    <Router>
      <Routes>
        {/* Homepage */}
        <Route path="/" element={<Home />} />
        <Route path="/get-started" element={<GetStarted />} />

        {/* Signup / Login */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Admin Dashboard with nested routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />}>
          <Route index element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="requests" element={<ResearchRequests />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Other dashboards */}
        <Route path="/user/dashboard/*" element={<UserDashboard />} />
        <Route path="/researcher/dashboard/*" element={<ResearcherDashboard />} />
        <Route path="/guest/dashboard/*" element={<GuestDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;