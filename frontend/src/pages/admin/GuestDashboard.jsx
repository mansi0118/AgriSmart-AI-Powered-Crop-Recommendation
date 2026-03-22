import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapContainer, TileLayer, Marker, Popup, useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import {
  Cloud, Map, Settings, LayoutDashboard, CloudRain,
  Wheat, Navigation, LogOut, Database,
} from "lucide-react";
import "./Users.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const LocationPicker = ({ onSelect }) => {
  useMapEvents({ click(e) { onSelect(e.latlng); } });
  return null;
};

/* ── REUSABLE OVERLAY — used for BOTH sidebar items AND generate button ── */
const LoginOverlay = ({ title, subtitle, icon, onClose, navigate }) => (
  <div
    onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    style={{
      position: "fixed", inset: 0,
      backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)",
      background: "rgba(0,0,0,0.32)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 9999, // ✅ highest possible
    }}
  >
    <div style={{
      background: "#fff", borderRadius: "20px",
      border: "1px solid #E5E7EB", padding: "40px 36px 32px",
      width: "340px", textAlign: "center",
      boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
    }}>
      <div style={{
        width: "60px", height: "60px", borderRadius: "50%", background: "#EAF5EE",
        display: "flex", alignItems: "center", justifyContent: "center",
        margin: "0 auto 18px", fontSize: "28px",
      }}>{icon}</div>

      <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#111827", marginBottom: "8px" }}>
        {title}
      </h2>

      <p style={{ fontSize: "13px", color: "#6B7280", lineHeight: "1.7", marginBottom: "24px" }}>
        {subtitle}
      </p>

      <button onClick={() => navigate("/login")} style={{
        width: "100%", padding: "11px", background: "#1F4037", color: "white",
        border: "none", borderRadius: "10px", fontSize: "14px",
        fontWeight: "600", cursor: "pointer", marginBottom: "10px",
      }}>
        Login / Sign Up
      </button>

      <button onClick={onClose} style={{
        width: "100%", padding: "10px", background: "transparent",
        color: "#6B7280", border: "1px solid #E5E7EB",
        borderRadius: "10px", fontSize: "13px", cursor: "pointer",
      }}>
        Maybe later
      </button>
    </div>
  </div>
);

const LockBadge = () => (
  <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor"
    style={{ marginLeft: "auto", opacity: 0.4 }}>
    <path d="M11 7V5a3 3 0 0 0-6 0v2H4v7h8V7h-1zm-4-2a1 1 0 0 1 2 0v2H7V5z" />
  </svg>
);

export default function GuestDashboard() {
  const navigate = useNavigate();
  const [location, setLocation] = useState(null);
  const [inputLat, setInputLat] = useState("27.80");
  const [inputLng, setInputLng] = useState("78.65");

  // ✅ Two separate overlay states
  const [sidebarFeature, setSidebarFeature] = useState(null); // sidebar item click
  const [showGenPopup, setShowGenPopup]     = useState(false); // generate button click

  const lockedItems = [
    { label: "Weather",          icon: <Cloud size={18} />    },
    { label: "Field Map",        icon: <Map size={18} />      },
    { label: "Crop Suggestions", icon: <Wheat size={18} />    },
    { label: "Researcher Data",  icon: <Database size={18} /> },
    { label: "Settings",         icon: <Settings size={18} /> },
  ];

  return (
    <div className="app-container">

      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="logo-section">
          <div className="logo-box"><CloudRain size={20} color="white" /></div>
          <span className="logo-text">AgriSmart</span>
        </div>
        <div className="profile-section">
          <div className="profile-avatar">G</div>
          <div className="profile-details"><h4>Guest User</h4><p>Public Access</p></div>
          <div className="status-badge">● Exploring</div>
        </div>
        <nav className="nav-menu">
          <div className="nav-item active">
            <LayoutDashboard size={18} /> <span>Dashboard</span>
          </div>
          {lockedItems.map((item) => (
            <div key={item.label} className="nav-item"
              onClick={() => setSidebarFeature(item.label)}
              style={{ cursor: "pointer" }}>
              {item.icon}<span>{item.label}</span><LockBadge />
            </div>
          ))}
        </nav>
        <div className="logout-section" onClick={() => navigate("/")}>
          <LogOut size={18} /><span>Exit Guest</span>
        </div>
      </aside>

      {/* MAIN */}
      <main className="main-content">
        <div className="content-fade-in">

          <header className="page-header">
            <h1>Good Morning, Guest 👋</h1>
            <p>Here's what's happening in your region today</p>
          </header>

          {/* STAT CARDS */}
          <div className="dashboard-grid">

            <div className="stat-card" style={{ position: "relative", overflow: "hidden" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <p style={{ fontSize: "12px", color: "#9CA3AF", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" }}>Today's Weather</p>
                  <h2 style={{ fontSize: "32px", fontWeight: "700", color: "#111827", margin: "0 0 2px" }}>28°C</h2>
                  <p style={{ fontSize: "14px", color: "#4B5563", margin: "0 0 10px" }}>Partly Cloudy</p>
                </div>
                <div style={{ fontSize: "40px", lineHeight: 1 }}>☀️</div>
              </div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#FEF3C7", padding: "5px 12px", borderRadius: "20px", fontSize: "12px", color: "#92400E", fontWeight: "500" }}>
                🌧 Rain expected Wed–Thu
              </div>
            </div>

            <div className="stat-card" style={{ position: "relative", overflow: "hidden" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <p style={{ fontSize: "12px", color: "#9CA3AF", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" }}>Data Access</p>
                  <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#111827", margin: "0 0 2px" }}>Public Data</h2>
                  <p style={{ fontSize: "13px", color: "#4B5563", margin: "0 0 10px" }}>Map-based analysis</p>
                </div>
                <div style={{ fontSize: "36px", lineHeight: 1 }}>🌱</div>
              </div>
              <div onClick={() => navigate("/login")} style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#ECFDF5", padding: "5px 12px", borderRadius: "20px", fontSize: "12px", color: "#065F46", fontWeight: "500", cursor: "pointer" }}>
                🔒 Login for your fields
              </div>
            </div>

            <div className="stat-card" style={{ position: "relative", overflow: "hidden" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <p style={{ fontSize: "12px", color: "#9CA3AF", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" }}>Regional Soil</p>
                  <h2 style={{ fontSize: "28px", fontWeight: "700", color: "#111827", margin: "0 0 2px" }}>Good</h2>
                  <p style={{ fontSize: "13px", color: "#4B5563", margin: "0 0 10px" }}>Regional soil status</p>
                </div>
                <div style={{ fontSize: "36px", lineHeight: 1 }}>📈</div>
              </div>
              <div onClick={() => navigate("/login")} style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#EFF6FF", padding: "5px 12px", borderRadius: "20px", fontSize: "12px", color: "#1E40AF", fontWeight: "500", cursor: "pointer" }}>
                🔒 Login for detailed insights
              </div>
            </div>

          </div>

          {/* FULL WIDTH MAP PANEL */}
          <div className="map-panel" style={{ width: "100%" }}>
            <div className="panel-header">
              <h3>📍 Field Location</h3>
              <Navigation size={16} style={{ transform: "rotate(45deg)" }} />
            </div>

            <div className="coord-inputs" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
              <div className="input-group">
                <label>LATITUDE</label>
                <input type="number" value={inputLat} onChange={(e) => setInputLat(e.target.value)} placeholder="27.80" />
              </div>
              <div className="input-group">
                <label>LONGITUDE</label>
                <input type="number" value={inputLng} onChange={(e) => setInputLng(e.target.value)} placeholder="78.65" />
              </div>
            </div>

            {/* ✅ Generate button — sets showGenPopup true */}
            <button
              className="generate-btn"
              onClick={() => setShowGenPopup(true)}
            >
              ✨ Generate Recommendations
            </button>

            <div className="map-view" style={{ height: "400px", borderRadius: "15px", overflow: "hidden", marginTop: "18px" }}>
              <MapContainer
                center={[parseFloat(inputLat) || 27.80, parseFloat(inputLng) || 78.65]}
                zoom={13} scrollWheelZoom={false} zoomControl={true}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap" />
                <LocationPicker onSelect={setLocation} />
                <Marker position={[parseFloat(inputLat) || 27.80, parseFloat(inputLng) || 78.65]}>
                  <Popup>Selected Location</Popup>
                </Marker>
                {location && (
                  <Marker position={location}>
                    <Popup>{location.lat.toFixed(4)}, {location.lng.toFixed(4)}</Popup>
                  </Marker>
                )}
              </MapContainer>
            </div>

            <div style={{ marginTop: "12px", padding: "10px 16px", background: "#F0F7F4", borderRadius: "10px", border: "1px solid #CFE3DB", fontSize: "13px", color: "#374151", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>🌱 Public data only. Login for personalised & admin-approved insights.</span>
              <button onClick={() => navigate("/login")} style={{ padding: "6px 14px", background: "#1F4037", color: "white", border: "none", borderRadius: "8px", fontSize: "12px", fontWeight: "500", cursor: "pointer", whiteSpace: "nowrap", marginLeft: "12px" }}>
                Login →
              </button>
            </div>
          </div>

        </div>
      </main>

      {/* ✅ SIDEBAR ITEM overlay */}
      {sidebarFeature && (
        <LoginOverlay
          icon="🔒"
          title="Login Required"
          subtitle={`${sidebarFeature} is only available to registered users. Sign in to access full tools and personalised insights.`}
          onClose={() => setSidebarFeature(null)}
          navigate={navigate}
        />
      )}

      {/* ✅ GENERATE BUTTON overlay — fixed position, zIndex 9999, completely outside map */}
      {showGenPopup && (
        <LoginOverlay
          icon="🌾"
          title="Login to Get Recommendations"
          subtitle="AI-powered crop recommendations are available to registered users. Sign in for personalised insights based on your soil & location."
          onClose={() => setShowGenPopup(false)}
          navigate={navigate}
        />
      )}

    </div>
  );
}