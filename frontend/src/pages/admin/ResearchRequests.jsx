import React, { useState } from "react";
import "./ResearchRequests.css";

const ResearchRequests = () => {
  const [requests, setRequests] = useState([
    { id: 101, researcher: "Anjali Sharma", region: "Kasganj", dataType: "Soil Quality Report", status: "Pending" },
    { id: 102, researcher: "Rahul Verma", region: "Aligarh", dataType: "Weather Data Access", status: "Approved" },
    { id: 103, researcher: "Karan Singh", region: "Mathura", dataType: "Crop Disease Analysis", status: "Pending" }
  ]);

  const handleApprove = (id) => {
    setRequests(prev => prev.map(req => req.id === id ? { ...req, status: "Approved" } : req));
  };

  const handleDecline = (id) => {
    setRequests(prev => prev.map(req => req.id === id ? { ...req, status: "Declined" } : req));
  };

  return (
    <div className="section" style={{ padding: '20px' }}>
      <h2 style={{ marginBottom: '20px', color: '#1B2559' }}>Researcher Data Approval Requests</h2>

      {requests.length === 0 ? (
        <p className="empty">No pending requests 🎉</p>
      ) : (
        <div className="table-container" style={{ background: '#fff', borderRadius: '15px', padding: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '2px solid #f4f7fe' }}>
                <th style={{ padding: '12px', color: '#A3AED0', fontSize: '13px', width: '25%' }}>RESEARCHER</th>
                <th style={{ padding: '12px', color: '#A3AED0', fontSize: '13px', width: '15%' }}>REGION</th>
                <th style={{ padding: '12px', color: '#A3AED0', fontSize: '13px', width: '25%' }}>DATASET</th>
                <th style={{ padding: '12px', color: '#A3AED0', fontSize: '13px', width: '15%' }}>STATUS</th>
                <th style={{ padding: '12px', color: '#A3AED0', fontSize: '13px', width: '20%' }}>ACTION</th>
              </tr>
            </thead>

            <tbody>
              {requests.map(req => (
                <tr key={req.id} style={{ borderBottom: '1px solid #f4f7fe' }}>
                  <td style={{ padding: '15px 12px', fontWeight: 'bold', color: '#1B2559' }}>{req.researcher}</td>
                  <td style={{ padding: '15px 12px', color: '#2B3674' }}>{req.region}</td>
                  <td style={{ padding: '15px 12px', color: '#2B3674' }}>{req.dataType}</td>
                  <td style={{ padding: '15px 12px' }}>
                    <span className={`status ${req.status.toLowerCase()}`} style={{ 
                      padding: '5px 12px', 
                      borderRadius: '20px', 
                      fontSize: '12px', 
                      fontWeight: 'bold',
                      backgroundColor: req.status === "Approved" ? "#e6f4ed" : req.status === "Declined" ? "#fdeaea" : "#fff6e5",
                      color: req.status === "Approved" ? "#1f8f55" : req.status === "Declined" ? "#ef4444" : "#f59e0b"
                    }}>
                      {req.status}
                    </span>
                  </td>
                  <td style={{ padding: '15px 12px' }}>
                    {req.status === "Pending" ? (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="approve" onClick={() => handleApprove(req.id)} style={{ cursor: 'pointer', padding: '6px 10px', backgroundColor: '#1f8f55', color: 'white', border: 'none', borderRadius: '5px' }}>
                          Approve
                        </button>
                        <button className="decline" onClick={() => handleDecline(req.id)} style={{ cursor: 'pointer', padding: '6px 10px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '5px' }}>
                          Decline
                        </button>
                      </div>
                    ) : (
                      <span style={{ color: '#A3AED0', fontSize: '13px' }}>Action Taken</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ResearchRequests;