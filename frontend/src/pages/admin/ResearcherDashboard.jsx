import React, { useState, useEffect } from "react";
import "./ResearcherDashboard.css";

const ResearcherDashboard = () => {
  const [datasets, setDatasets] = useState([]);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");

  // 🔽 Fetch data from Django when page loads
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/researcher/1/")
      .then(res => res.json())
      .then(data => setDatasets(data))
      .catch(err => console.error("Fetch error:", err));
  }, []);

  // 🔼 Send data to backend
  const handleShare = async (e) => {
    e.preventDefault();

    if (!name || !url) {
      alert("Please fill all fields!");
      return;
    }

    try {
      await fetch("http://127.0.0.1:8000/api/researcher/add/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          url,
          user_id: 1
        })
      });

      // 🔁 Refresh table after adding
      const res = await fetch("http://127.0.0.1:8000/api/researcher/1/");
      const data = await res.json();
      setDatasets(data);

      setName("");
      setUrl("");

    } catch (error) {
      console.error(error);
      alert("Error saving dataset ❌");
    }
  };

  return (
    <div className="researcher-dashboard">
      <header className="dashboard-header">
        <div className="brand-logo">AgriSmart</div>
        <nav className="header-nav">
          <a className="active">Dashboard</a>
          <a>Map</a>
          <a>Logout</a>
        </nav>
      </header>

      <main className="dashboard-content">
        <div className="welcome-header">
          <h2>Welcome Researcher 👋</h2>
          <p>Share dataset links and track your submissions</p>
        </div>

        <div className="dashboard-grid">

          {/* LEFT — Form */}
          <div className="dashboard-card">
            <h3>Share New Dataset</h3>
            <form className="upload-form" onSubmit={handleShare}>
              <div>
                <label>Dataset Name</label>
                <input
                  type="text"
                  placeholder="e.g. Soil Data 2024"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <label>Source URL</label>
                <input
                  type="url"
                  placeholder="Paste Drive or GitHub link"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>

              <button type="submit" className="btn-upload">
                Share Link
              </button>
            </form>
          </div>

          {/* RIGHT — Table */}
          <div className="dashboard-card datasets-card">
            <h3>Recent Submissions</h3>
            <table>
              <thead>
                <tr>
                  <th style={{ width: "40%" }}>Name</th>
                  <th style={{ width: "30%" }}>Date</th>
                  <th style={{ width: "30%" }}>Source</th>
                </tr>
              </thead>

              <tbody>
                {datasets.length === 0 ? (
                  <tr>
                    <td colSpan="3" style={{ textAlign: "center" }}>
                      No data yet 🚀
                    </td>
                  </tr>
                ) : (
                  datasets.map((data) => (
                    <tr key={data.id}>
                      <td>{data.name}</td>
                      <td>{data.date}</td>
                      <td>
                        <a
                          href={data.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View link
                        </a>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>
      </main>
    </div>
  );
};

export default ResearcherDashboard;