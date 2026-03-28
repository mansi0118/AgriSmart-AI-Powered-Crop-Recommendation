import React from "react";
import "./DashboardPro.css";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
   const navigate = useNavigate();
  return (
    <div className="dashboard">

      {/* HEADER */}
      <div className="dashboard-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Overview of AgriSmart system</p>
        </div>
        <button
  className="primary-btn"
  onClick={() => navigate("/admin/dashboard/settings")}
> 
  View Settings
</button>

        
      </div>

      {/* STATS */}
      <div className="stats-container">
        <div className="stat-card">
          <span className="stat-label">Total Users</span>
          <h2>120</h2>
          <span className="stat-trend positive">+12 this month</span>
        </div>

        <div className="stat-card">
          <span className="stat-label">Active Research</span>
          <h2>15</h2>
          <span className="stat-trend neutral">ongoing</span>
        </div>

        <div className="stat-card">
          <span className="stat-label">Pending Requests</span>
          <h2>8</h2>
          <span className="stat-trend warning">needs review</span>
        </div>
      </div>

      {/* LOWER SECTION */}
      <div className="dashboard-lower">

        {/* RECENT ACTIVITY */}
        <div className="panel">
          <h3>Recent Activity</h3>

          <ul className="activity-list">
            <li>Research data uploaded for Kasganj</li>
            <li>New user registered</li>
            <li>Dataset approved by admin</li>
          </ul>
        </div>

         {/* QUICK ACTIONS */}
        <div className="panel">
          <h3>Quick Actions</h3>

          <button
            className="action-btn"
            onClick={() => navigate("/admin/dashboard/requests")}
          >
            Review Requests
          </button>

          <button
            className="action-btn secondary"
            onClick={() => navigate("/admin/dashboard/users")}
          >
            Manage Users
          </button>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
