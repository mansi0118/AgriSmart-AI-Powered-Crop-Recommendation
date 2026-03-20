import React, { useState } from "react";
<<<<<<< HEAD
import { CheckCircle, Clock, XCircle } from "lucide-react";
import "./ResearcherDashboard.css";

const ResearcherDashboard = () => {
  const [datasets, setDatasets] = useState([
    { id: 1, name: "Soil Data 2024", date: "12 Jan 2026", url: "https://example.com/soil", status: "Approved" },
    { id: 2, name: "Crop Yield", date: "14 Jan 2026", url: "https://github.com/crop", status: "Pending" }
  ]);

  const [name, setName] = useState("");
  const [url, setUrl] = useState("");

  const handleShare = (e) => {
    e.preventDefault();
    if (!name || !url) return alert("Please fill all fields!");
    const newEntry = {
      id: datasets.length + 1,
      name: name,
      date: "20 Mar 2026",
      url: url,
      status: "Pending"
    };
    setDatasets([newEntry, ...datasets]);
    setName("");
    setUrl("");
  };

  return (
    <div className="researcher-dashboard">
=======
import {
  UploadCloud,
  CheckCircle,
  Clock,
  XCircle
} from "lucide-react";
import "./ResearcherDashboard.css";

const ResearcherDashboard = () => {
  const [file, setFile] = useState(null);

  const approvedCount = 12;
  const pendingCount = 4;
  const rejectedCount = 2;

  return (
    <div className="researcher-dashboard">
      {/* Header */}
>>>>>>> 95c727f253994a2f5f16730bfb9833d553f646d4
      <header className="dashboard-header">
        <div className="brand-logo">AgriSmart</div>
        <nav className="header-nav">
          <a className="active">Dashboard</a>
          <a>Map</a>
          <a>Logout</a>
        </nav>
      </header>

<<<<<<< HEAD
      <main className="dashboard-content">
        <div className="welcome-header">
          <h2>Welcome Researcher 👋</h2>
          <p>Share dataset links and track moderation results</p>
        </div>

        <div className="dashboard-grid-top">
          <div className="dashboard-card">
            <h3>Share New Dataset</h3>
            <form className="upload-form" onSubmit={handleShare}>
              <div style={{ marginBottom: '15px', textAlign: 'left' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold', color: '#A3AED0' }}>Dataset Name</label>
                <input 
                  type="text" 
                  placeholder="Enter dataset name" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ width: '100%', padding: '12px', background: '#f4f7fe', border: 'none', borderRadius: '10px', outline: 'none' }}
                />
              </div>

              <div style={{ marginBottom: '20px', textAlign: 'left' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold', color: '#A3AED0' }}>Dataset Source URL</label>
                <input 
                  type="url" 
                  placeholder="Paste Drive or GitHub link here" 
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  style={{ width: '100%', padding: '12px', background: '#f4f7fe', border: 'none', borderRadius: '10px', outline: 'none' }}
                />
              </div>
              <button type="submit" className="btn-upload">Share Link</button>
            </form>
          </div>

          <div className="dashboard-card">
            <h3>Moderation Summary</h3>
=======
      {/* Content */}
      <main className="dashboard-content">
        <div className="welcome-header">
          <h2>Welcome Researcher 👋</h2>
          <p>Upload datasets and track AI moderation results</p>
        </div>

        {/* Top Grid */}
        <div className="dashboard-grid-top">
          {/* Upload Card */}
          <div className="dashboard-card">
            <h3>Upload Dataset</h3>

            <form className="upload-form">
              <label>Dataset Name</label>
              <input type="text" placeholder="Enter dataset name" />

              <label>Dataset File</label>
              <div className="file-drop">
                <UploadCloud size={20} />
                <span>Click to upload or drag & drop</span>
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  accept=".csv,.xls,.xlsx,.json"
                />
              </div>

              <button className="btn-upload">Upload Dataset</button>
            </form>
          </div>

          {/* Analytics Card */}
          <div className="dashboard-card">
            <h3>Moderation Summary</h3>

>>>>>>> 95c727f253994a2f5f16730bfb9833d553f646d4
            <div className="analytics-summary">
              <div className="analytics-row approved">
                <CheckCircle size={18} />
                <span>Approved</span>
<<<<<<< HEAD
                <strong>{datasets.filter(d => d.status === "Approved").length}</strong>
              </div>
              <div className="analytics-row pending">
                <Clock size={18} />
                <span>Pending</span>
                <strong>{datasets.filter(d => d.status === "Pending").length}</strong>
              </div>
              <div className="analytics-row rejected">
                <XCircle size={18} />
                <span>Rejected</span>
                <strong>0</strong>
=======
                <strong>{approvedCount}</strong>
              </div>

              <div className="analytics-row pending">
                <Clock size={18} />
                <span>Pending</span>
                <strong>{pendingCount}</strong>
              </div>

              <div className="analytics-row rejected">
                <XCircle size={18} />
                <span>Rejected</span>
                <strong>{rejectedCount}</strong>
>>>>>>> 95c727f253994a2f5f16730bfb9833d553f646d4
              </div>
            </div>
          </div>
        </div>

<<<<<<< HEAD
        <div className="dashboard-card datasets-card">
          <h3>Recent Submissions</h3>
          {/* Table with fixed layout for alignment */}
          <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '1px solid #f4f7fe' }}>
                <th style={{ padding: '12px 8px', color: '#A3AED0', fontSize: '12px', fontWeight: 'bold', width: '30%' }}>NAME</th>
                <th style={{ padding: '12px 8px', color: '#A3AED0', fontSize: '12px', fontWeight: 'bold', width: '25%' }}>DATE</th>
                <th style={{ padding: '12px 8px', color: '#A3AED0', fontSize: '12px', fontWeight: 'bold', width: '25%' }}>SOURCE</th>
                <th style={{ padding: '12px 8px', color: '#A3AED0', fontSize: '12px', fontWeight: 'bold', width: '20%' }}>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {datasets.map((data) => (
                <tr key={data.id} style={{ borderBottom: '1px solid #f4f7fe' }}>
                  <td style={{ padding: '16px 8px', fontSize: '14px', fontWeight: 'bold', color: '#1B2559' }}>{data.name}</td>
                  <td style={{ padding: '16px 8px', fontSize: '14px', color: '#2B3674' }}>{data.date}</td>
                  <td style={{ padding: '16px 8px' }}>
                    <a href={data.url} target="_blank" rel="noopener noreferrer" style={{ color: '#4318ff', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>
                      View Link
                    </a>
                  </td>
                  <td style={{ padding: '16px 8px' }}>
                    <span className={`status-badge status-${data.status.toLowerCase()}`} style={{ fontSize: '12px' }}>
                      {data.status}
                    </span>
                  </td>
                </tr>
              ))}
=======
        {/* Table */}
        <div className="dashboard-card datasets-card">
          <h3>Uploaded Datasets</h3>

          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Soil Data 2024</td>
                <td>12 Jan 2026</td>
                <td>
                  <span className="status-badge status-approved">
                    Approved
                  </span>
                </td>
              </tr>

              <tr>
                <td>Crop Yield</td>
                <td>14 Jan 2026</td>
                <td>
                  <span className="status-badge status-pending">
                    Pending
                  </span>
                </td>
              </tr>
>>>>>>> 95c727f253994a2f5f16730bfb9833d553f646d4
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

<<<<<<< HEAD
export default ResearcherDashboard;
=======
export default ResearcherDashboard;
>>>>>>> 95c727f253994a2f5f16730bfb9833d553f646d4
