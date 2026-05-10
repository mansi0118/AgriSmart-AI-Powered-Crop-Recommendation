import React, { useState, useEffect } from "react";
import CropSuggestionUI from "./CropSuggestionUI";
import SoilHealthUI from "./SoilHealthUI";
import Weather from "./Weather";
import { MapContainer, TileLayer, Marker, Popup, Rectangle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useMapEvents } from "react-leaflet";
import L from 'leaflet';
import {
  Cloud, Map, Settings,
  LayoutDashboard, CloudRain, Wheat, Navigation, X, LogOut,
  Database
} from "lucide-react";
import "./ResearcherDashboard.css";

// --- Leaflet Icon Fix ---
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});
const API_BASE = process.env.REACT_APP_API_URL;
const WEATHER_API = process.env.REACT_APP_WEATHER_API_KEY;
export default function ResearcherDashboard() {

  // --- CORE STATE ---
  const [inputLat, setInputLat] = useState("27.80");
  const [inputLng, setInputLng] = useState("78.65");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [user, setUser] = useState({ name: "", email: "", role: "" });
  const [recommendations, setRecommendations] = useState([]);
  const [weather, setWeather] = useState(null);
  const [dashboardWeather, setDashboardWeather] = useState(null);
  const [activePage, setActivePage] = useState("dashboard");
  const [place, setPlace] = useState("");

  // --- SOIL MAP STATE ---
  const [selectedSoil, setSelectedSoil] = useState(null);
  const [showSoilModal, setShowSoilModal] = useState(false);
  const [soilPrediction, setSoilPrediction] = useState([]);
  const [loadingPrediction, setLoadingPrediction] = useState(false);
  const [soilData, setSoilData] = useState([]);
  const [nutrient, setNutrient] = useState("N");

  // --- FIELDS STATE ---
  const [fields, setFields] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newField, setNewField] = useState({ name: "", crop: "", area: "", lat: "", lng: "" });

  // --- RESEARCHER DATASET STATE ---
  const [researchData, setResearchData] = useState([]);
  const [newDatasetName, setNewDatasetName] = useState("");
  const [newDatasetUrl, setNewDatasetUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  // --- SETTINGS STATE ---
  const [settings, setSettings] = useState({ name: "", email: "" });
  const [isSaving, setIsSaving] = useState(false);

  // ============================================================
  // AUTH GUARD
  // ============================================================
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
    }
  }, []);

  // ============================================================
  // DATA FETCHING
  // ============================================================

  // Fetch researcher datasets
  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${API_BASE}/api/users/researchers/`, {
      headers: { Authorization: `Token ${token}` }
    })
      .then(res => res.json())
      .then(data => setResearchData(data))
      .catch(err => console.error("Research fetch error:", err));
  }, []);

  // Fetch soil data
  useEffect(() => {
    fetch("/soil_data.json")
      .then(res => res.json())
      .then(data => setSoilData(data.Sheet1 || []))
      .catch(err => console.log("Soil Data Error:", err));
  }, []);

  // Fetch user profile
  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${API_BASE}/api/users/profile/`, {
      headers: { Authorization: `Token ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch profile");
        return res.json();
      })
      .then(data => {
        setUser({ name: data.full_name, email: data.email, role: data.role });
        setSettings({ name: data.full_name, email: data.email });
      })
      .catch(err => console.error("Profile fetch error:", err));
  }, []);

  // Fetch fields on mount
  useEffect(() => {
    fetchFields();
  }, []);

  // Live weather debounce
  useEffect(() => {
    const timeout = setTimeout(() => {

      if (!inputLat || !inputLng) return;

      const fetchWeather = async () => {
        try {

          const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${inputLat}&lon=${inputLng}&appid=${WEATHER_API}&units=metric`
          );

          if (!res.ok) {
            throw new Error("Weather API failed");
          }

          const data = await res.json();

          setDashboardWeather({
            temp: data.main?.temp,
            humidity: data.main?.humidity,
            rainfall: data.rain ? data.rain["1h"] || 0 : 0
          });

        } catch (err) {
          console.error("Weather fetch error:", err);
        }
      };

      fetchWeather();

    }, 800);

    return () => clearTimeout(timeout);

  }, [inputLat, inputLng]);

  // ============================================================
  // HANDLERS
  // ============================================================

  const fetchFields = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/users/fields/`, {
        headers: { Authorization: `Token ${token}` }
      });
      if (!res.ok) throw new Error("Failed to fetch fields");
      const data = await res.json();
      const formatted = data.map(f => ({
        id: f.id,
        name: f.field_name,
        crop: f.crop || "Fallow",
        area: f.area || "0",
        lat: parseFloat(f.lat),
        lng: parseFloat(f.lng),
        color: "green"
      }));
      setFields(formatted);
    } catch (err) {
      console.error(err);
      setFields([]);
    }
  };

  const handleAddField = async () => {
    const token = localStorage.getItem("token");
    if (!newField.name || !newField.lat || !newField.lng) {
      return alert("Please fill all details");
    }
    try {
      const res = await fetch(`${API_BASE}/api/users/add-field/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`
        },
        body: JSON.stringify({
          field_name: newField.name,
          crop: newField.crop,
          area: newField.area,
          lat: parseFloat(newField.lat),
          lng: parseFloat(newField.lng)
        })
      });
      const data = await res.json();
      console.log("Saved:", data);
      fetchFields(); // refresh from DB
      setShowModal(false);
      setNewField({ name: "", crop: "", area: "", lat: "", lng: "" });
    } catch (err) {
      console.error(err);
      alert("Error saving field ❌");
    }
  };

  const handleGenerate = async () => {
      try {
        setIsAnalyzing(true);

        if (!inputLat || !inputLng) {
          alert("Please enter valid location");
          return;
        }

        const weatherRes = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${inputLat}&lon=${inputLng}&appid=${WEATHER_API}&units=metric`
        );

        if (!weatherRes.ok) {
          throw new Error("Weather fetch failed");
        }

        const weatherData = await weatherRes.json();

        const payload = {
          N: 90,
          P: 42,
          K: 43,
          ph: 6.5,
          temperature: weatherData.main.temp,
          humidity: weatherData.main.humidity,
          rainfall: weatherData.rain ? weatherData.rain["1h"] || 0 : 0
        };

        const res = await fetch(`${API_BASE}/api/users/predict/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        });

        const data = await res.json();

        if (!res.ok) {
          alert(data.error || "Prediction failed");
          return;
        }

        setRecommendations([
          {
            crop: data.crop,
            confidence: 95
          }
        ]);

        setWeather({
          temp: weatherData.main.temp,
          humidity: weatherData.main.humidity,
          rainfall: weatherData.rain ? weatherData.rain["1h"] || 0 : 0,
          city: weatherData.name
        });

      } catch (err) {
        console.error(err);
        alert("Prediction failed");
      } finally {
        setIsAnalyzing(false);
      }
    };

 const handleShareDataset = async (e) => {
  e.preventDefault();
  if (!newDatasetName.trim() || !newDatasetUrl.trim()) {
    return alert("Please fill in both dataset title and URL");
  }
  setIsUploading(true);
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_BASE}/api/users/researchers/add/`, { // ✅ correct URL
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`
      },
      body: JSON.stringify({ name: newDatasetName, url: newDatasetUrl }) // ✅ no user_id needed
    });

    if (res.ok) {
      const newItem = await res.json();
      alert("Dataset shared successfully! ✅");
      setNewDatasetName("");
      setNewDatasetUrl("");
      setResearchData(prev => [newItem, ...prev]); // ✅ add to top of list
    } else {
      const err = await res.json();
      alert(err.error || "Error sharing dataset ❌");
    }
  } catch (err) {
    console.error(err);
    alert("Server error ❌");
  }
  setIsUploading(false);
};

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/users/update_user/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`
        },
        body: JSON.stringify({ full_name: settings.name, email: settings.email })
      });
      if (res.ok) {
        alert("Saved successfully!");
        setUser(prev => ({ ...prev, name: settings.name, email: settings.email }));
      } else {
        alert("Error saving ❌");
      }
    } catch (err) {
      console.error(err);
      alert("Server error ❌");
    }
    setIsSaving(false);
  };

  const handleSearchLocation = async () => {
    if (!place.trim()) { alert("Please enter a location"); return; }
    try {
      const res = await fetch(`${API_BASE}/api/users/geocode/?place=${place}`);
      const data = await res.json();
      if (data.error) { alert(data.error); return; }
      setInputLat(data.lat);
      setInputLng(data.lon);
    } catch (err) {
      console.error(err);
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) { alert("Geolocation not supported"); return; }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setInputLat(position.coords.latitude.toFixed(4));
        setInputLng(position.coords.longitude.toFixed(4));
      },
      () => alert("Location access denied ❌")
    );
  };

  const handleLogout = async () => {
    if (!window.confirm("Are you sure you want to logout?")) return;
    try {
      const res = await fetch(`${API_BASE}/api/users/logout/`, {
        method: "POST",
        credentials: "include"
      });
      if (res.ok) {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = "/login";
      } else {
        alert("Logout failed ❌");
      }
    } catch (err) {
      console.error("Logout error:", err);
      alert("Server error ❌");
    }
  };

  // ============================================================
  // HELPERS
  // ============================================================

  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(" ").map(w => w[0]).join("").toUpperCase();
  };

  const getColor = (value, type) => {
    if (type === "N") {
      if (value < 150) return "#ef4444";
      if (value < 250) return "#facc15";
      return "#22c55e";
    }
    if (type === "P") {
      if (value < 10) return "#ef4444";
      if (value < 25) return "#facc15";
      return "#22c55e";
    }
    if (type === "K") {
      if (value < 100) return "#ef4444";
      if (value < 200) return "#facc15";
      return "#22c55e";
    }
    if (type === "pH") {
      if (value < 6) return "#60a5fa";
      if (value < 7.5) return "#22c55e";
      return "#f97316";
    }
    return "#cccccc";
  };

  function MapClickHandler() {
    useMapEvents({
      click(e) {
        setInputLat(e.latlng.lat.toFixed(4));
        setInputLng(e.latlng.lng.toFixed(4));
      }
    });
    return null;
  }

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="app-container">

      {/* ===== SIDEBAR ===== */}
      <aside className="sidebar">
        <div className="logo-section">
          <div className="logo-box"><CloudRain size={20} color="white" /></div>
          <span className="logo-text">AgriSmart</span>
        </div>

        <div className="profile-section">
          <div className="profile-avatar">{getInitials(user.name)}</div>
          <div className="profile-details">
            <h4>{user.name || "Researcher"}</h4>
            <p>{user.role || "Researcher"}</p>
          </div>
        </div>

        <nav className="nav-menu">
          <div className={`nav-item ${activePage === "dashboard" ? "active" : ""}`} onClick={() => setActivePage("dashboard")}><LayoutDashboard size={18} /><span>Dashboard</span></div>
          <div className={`nav-item ${activePage === "weather" ? "active" : ""}`} onClick={() => setActivePage("weather")}><Cloud size={18} /><span>Weather</span></div>
          <div className={`nav-item ${activePage === "fieldMap" ? "active" : ""}`} onClick={() => setActivePage("fieldMap")}><Map size={18} /><span>Field Map</span></div>
          <div className={`nav-item ${activePage === "cropSuggestions" ? "active" : ""}`} onClick={() => setActivePage("cropSuggestions")}><Wheat size={18} /><span>Crop Suggestions</span></div>
          <div className={`nav-item ${activePage === "soilHealth" ? "active" : ""}`} onClick={() => setActivePage("soilHealth")}><Wheat size={18} /><span>Soil Health</span></div>
          <div className={`nav-item ${activePage === "researcherData" ? "active" : ""}`} onClick={() => setActivePage("researcherData")}><Database size={18} /><span>Researcher Data</span></div>
          <div className={`nav-item ${activePage === "settings" ? "active" : ""}`} onClick={() => setActivePage("settings")}><Settings size={18} /><span>Settings</span></div>
        </nav>

        <div className="logout-section" onClick={handleLogout}>
          <LogOut size={18} /><span>Logout</span>
        </div>
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <main className="main-content">

        {/* ─── DASHBOARD ─── */}
        {activePage === "dashboard" && (
          <div className="content-fade-in" key="dashboard">
            <header className="page-header">
              <h1>Welcome, {user.name} 👋</h1>
              <p>Here's what's happening with your fields today</p>
            </header>
            <div className="dashboard-grid">
              <div className="stat-card" style={{ position: "relative", overflow: "hidden" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: "100%", width: "100%" }}>
                  <div>
                    <p style={{ fontSize: "12px", color: "#9CA3AF", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" }}>
                      {dashboardWeather ? "Live Weather" : "Loading..."}
                    </p>
                    <h2 style={{ fontSize: "32px", fontWeight: "700", color: "#111827", margin: "0 0 2px" }}>
                      {dashboardWeather ? `${dashboardWeather.temp}°C` : "--"}
                    </h2>
                    <p style={{ fontSize: "14px", color: "#4B5563", margin: "0 0 10px" }}>
                      {dashboardWeather ? `Humidity: ${dashboardWeather.humidity}%` : ""}
                    </p>
                  </div>
                  <div style={{ fontSize: "48px", lineHeight: 1 }}>
                    {dashboardWeather?.rainfall > 20 ? "🌧️" : dashboardWeather?.temp > 30 ? "☀️" : "🌤️"}
                  </div>
                </div>
              </div>

              <div className="stat-card" style={{ position: "relative", overflow: "hidden", padding: "30px" }}>
                <p style={{ fontSize: "12px", color: "#9CA3AF", fontWeight: "600" }}>Enter Location</p>
                <input type="text" placeholder="Enter city / village" value={place} onChange={(e) => setPlace(e.target.value)}
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #eee", marginTop: "10px" }} />
                <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                  <button onClick={handleSearchLocation} style={{ flex: 1, padding: "10px", background: "#7da07d", color: "white", border: "none", borderRadius: "8px" }}>🌍 Get Coordinates</button>
                  <button onClick={getCurrentLocation} style={{ flex: 1, padding: "10px", background: "#2563eb", color: "white", border: "none", borderRadius: "8px" }}>📍 Use My Location</button>
                </div>
              </div>
            </div>

            <div className="lower-grid">
              <div className="map-panel">
                <div className="panel-header" onClick={() => setActivePage("fieldMap")} style={{ cursor: "pointer" }}>
                  <h3>📍 Field Location</h3>
                  <Navigation size={16} style={{ transform: "rotate(45deg)" }} />
                </div>
                <div className="coord-inputs" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                  <div className="input-group">
                    <label>LATITUDE</label>
                    <input type="number" value={inputLat} onChange={(e) => setInputLat(e.target.value)} placeholder="Latitude" />
                  </div>
                  <div className="input-group">
                    <label>LONGITUDE</label>
                    <input type="number" value={inputLng} onChange={(e) => setInputLng(e.target.value)} placeholder="Longitude" />
                  </div>
                </div>
                <button className="generate-btn" onClick={handleGenerate} disabled={isAnalyzing}>
                  {isAnalyzing ? <>🔄 Analyzing Soil & Weather...</> : <>✨ Generate Recommendations</>}
                </button>
                <div className="map-view" style={{ height: "220px", borderRadius: "15px", overflow: "hidden", marginTop: "20px", position: "relative" }}>
                  <div onClick={() => setActivePage("fieldMap")} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 10, cursor: "pointer", background: "transparent" }} />
                  <MapContainer center={[parseFloat(inputLat) || 27.80, parseFloat(inputLng) || 78.65]} zoom={13} scrollWheelZoom={false} zoomControl={false} style={{ height: "100%", width: "100%" }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap" />
                    <Marker position={[parseFloat(inputLat) || 27.80, parseFloat(inputLng) || 78.65]}><Popup>Selected Location</Popup></Marker>
                  </MapContainer>
                </div>
              </div>

              <div className="recommendation-panel">
                <div className="panel-header">
                  <h3>🌾 Crop Recommendation</h3>
                  <span className="badge">High Confidence</span>
                </div>
                {isAnalyzing ? (
                  <div className="loading-state">
                    <div className="spinner"></div>
                    <p>AI is analyzing soil nutrients at {inputLat}, {inputLng}...</p>
                  </div>
                ) : (
                  <>
                    <div className="crop-list">
                      {recommendations.map((item, index) => (
                        <div key={index} className="crop-card">
                          <span className="crop-emoji">🌱</span>
                          <strong>{item.crop}</strong>
                          <p>{item.confidence}% confidence</p>
                        </div>
                      ))}
                    </div>
                    {weather && (
                      <div className="weather-info">
                        <p>📍 City: {weather.city}</p>
                        <p>🌡 Temp: {weather.temp}°C</p>
                        <p>💧 Humidity: {weather.humidity}%</p>
                        <p>🌧 Rainfall: {weather.rainfall} mm</p>
                      </div>
                    )}
                    <div className="why-crops">
                      <h4>Why these crops?</h4>
                      <ul>
                        <li>✅ Suitable for local soil type (alluvial)</li>
                        <li>✅ Compatible with regional rainfall patterns</li>
                      </ul>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ─── RESEARCHER DATA ─── */}
        {activePage === "researcherData" && (
          <div className="content-fade-in" key="researcherData">
            <header className="page-header">
              <h1>Researcher Datasets</h1>
              <p className="subtitle-small">Share your findings and manage your contributions</p>
            </header>

            <div className="settings-container-layout">

              {/* SHARE NEW DATASET */}
              <div className="settings-card" style={{ marginBottom: "24px" }}>
                <div className="card-title-row">
                  <div className="icon-box-light"><span className="pref-icon">📤</span></div>
                  <div><h3>Share New Dataset</h3><p>Link your research files (Google Drive, GitHub, etc.)</p></div>
                </div>
                <form onSubmit={handleShareDataset} style={{ padding: "20px" }}>
                  <div className="settings-form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                    <div className="form-group">
                      <label>Dataset Title</label>
                      <input type="text" placeholder="e.g. Soil Nutrient Analysis - North Region"
                        value={newDatasetName} onChange={(e) => setNewDatasetName(e.target.value)}
                        style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #eee" }} />
                    </div>
                    <div className="form-group">
                      <label>Source URL (Link)</label>
                      <input type="url" placeholder="https://drive.google.com/..."
                        value={newDatasetUrl} onChange={(e) => setNewDatasetUrl(e.target.value)}
                        style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #eee" }} />
                    </div>
                  </div>
                  <div style={{ marginTop: "20px", textAlign: "right" }}>
                    <button type="submit" disabled={isUploading}
                      style={{ padding: "12px 30px", background: "#7da07d", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600" }}>
                      {isUploading ? "Uploading..." : "Share Dataset"}
                    </button>
                  </div>
                </form>
              </div>

              {/* SHARED DATASETS TABLE */}
              <div className="settings-card" style={{ padding: "0", overflow: "hidden" }}>
                <div className="card-title-row" style={{ padding: "25px 30px", borderBottom: "1px solid #f0f0f0" }}>
                  <div className="icon-box-light"><span className="pref-icon">📊</span></div>
                  <div><h3>Shared Datasets</h3><p>View all shared datasets</p></div>
                </div>
                <div style={{ padding: "0 30px 30px" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                    <thead>
                      <tr style={{ borderBottom: "2px solid #f5f5f5", color: "#888", fontSize: "13px", textTransform: "uppercase" }}>
                        <th style={{ padding: "15px 0" }}>Date</th>
                        <th style={{ padding: "15px 0" }}>Dataset Title</th>
                        <th style={{ padding: "15px 0", textAlign: "right" }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {researchData.length === 0 ? (
                        <tr>
                          <td colSpan="3" style={{ textAlign: "center", padding: "40px", color: "#888" }}>
                            No datasets shared yet. Start by uploading one above! 🚀
                          </td>
                        </tr>
                      ) : (
                        researchData.map((item) => (
                          <tr key={item.id} style={{ borderBottom: "1px solid #f9f9f9", fontSize: "14px", color: "#333" }}>
                            <td style={{ padding: "15px 0", color: "#666" }}>{item.date || "Just now"}</td>
                            <td style={{ padding: "15px 0" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <FileText size={16} color="#7da07d" />
                                <strong>{item.name}</strong>
                              </div>
                            </td>
                            <td style={{ padding: "15px 0", textAlign: "right" }}>
                              <a href={item.url} target="_blank" rel="noopener noreferrer"
                                style={{ display: "inline-flex", alignItems: "center", gap: "5px", color: "#7da07d", fontWeight: "600", textDecoration: "none" }}>
                                <Download size={14} /> View Link
                              </a>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── WEATHER ─── */}
        {activePage === "weather" && (
          <div className="content-fade-in" key="weather"><Weather /></div>
        )}

        {/* ─── FIELD MAP ─── */}
        {activePage === "fieldMap" && (
          <div className="content-fade-in" key="fieldMap">
            <header className="page-header-flex">
              <div><h1>Field Map</h1><p>Soil Health Analysis & Field Management</p></div>
              <button className="add-field-btn" onClick={() => setShowModal(true)}>+ Add Field</button>
            </header>

            <div className="map-grid-layout">
              <div className="map-main-area">
                <div className="coord-bar" style={{ justifyContent: "space-between" }}>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <div className="input-box">
                      <label>LATITUDE</label>
                      <input type="text" placeholder="Enter latitude" value={inputLat} onChange={(e) => setInputLat(e.target.value)} />
                    </div>
                    <div className="input-box">
                      <label>LONGITUDE</label>
                      <input type="text" placeholder="Enter longitude" value={inputLng} onChange={(e) => setInputLng(e.target.value)} />
                    </div>
                    <button onClick={getCurrentLocation} style={{ height: "40px", marginTop: "20px", padding: "0 12px", background: "#2563eb", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}>
                      📍 Use My Location
                    </button>
                  </div>
                  <div className="nutrient-select-box">
                    <label>Show Layer:</label>
                    <select value={nutrient} onChange={(e) => setNutrient(e.target.value)}>
                      <option value="N">Nitrogen (N)</option>
                      <option value="P">Phosphorus (P)</option>
                      <option value="K">Potassium (K)</option>
                      <option value="pH">Soil pH</option>
                    </select>
                  </div>
                </div>

                <div className="interactive-map-container" style={{ position: "relative" }}>
                  <div style={{ position: "absolute", top: "20px", right: "20px", background: "#fff", padding: "8px 12px", borderRadius: "8px", fontSize: "12px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)", zIndex: 1000 }}>
                    Click on map to select location 📍
                  </div>

                  <MapContainer key={`${inputLat}-${inputLng}`} center={[parseFloat(inputLat) || 27.8083, parseFloat(inputLng) || 78.6458]} zoom={13} scrollWheelZoom={false} style={{ height: "100%", width: "100%", borderRadius: "20px" }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap" />
                    <MapClickHandler />
                    <Marker
                      position={[
                        parseFloat(inputLat) || 27.80,
                        parseFloat(inputLng) || 78.65
                      ]}
                    >
                      <Popup>📍 Selected Location</Popup>
                    </Marker>

                    {/* SOIL LAYERS */}
                    {soilData.map((cell, idx) => {
                      const size = 0.003;
                      const key = nutrient === "N" ? "n" : nutrient === "P" ? "p" : nutrient === "K" ? "k" : "pH";
                      const val = cell[key];
                      const color = getColor(val, nutrient);
                      if (!val) return null;
                      return (
                        <Rectangle key={idx}
                          bounds={[[cell.Latitude - size, cell.Longitude - size], [cell.Latitude + size, cell.Longitude + size]]}
                          pathOptions={{ color, fillColor: color, fillOpacity: 0.5, weight: 0 }}
                          eventHandlers={{
                            click: async () => {
                              const clickedData = { lat: cell.Latitude, lng: cell.Longitude, N: cell.n, P: cell.p, K: cell.k, ph: cell.pH };
                              setSelectedSoil(clickedData);
                              setShowSoilModal(true);
                              try {
                                setLoadingPrediction(true);
                                const weatherRes = await fetch(
                                  `https://api.openweathermap.org/data/2.5/weather?lat=${inputLat}&lon=${inputLng}&appid=${WEATHER_API}&units=metric`
                                );

                                const weatherData = await weatherRes.json();

                                const res = await fetch(`${API_BASE}/api/users/predict/`, {
                                  method: "POST",
                                  headers: {
                                    "Content-Type": "application/json"
                                  },
                                  body: JSON.stringify({
                                    N: clickedData.N,
                                    P: clickedData.P,
                                    K: clickedData.K,
                                    ph: clickedData.ph,
                                    temperature: weatherData.main.temp,
                                    humidity: weatherData.main.humidity,
                                    rainfall: weatherData.rain ? weatherData.rain["1h"] || 0 : 0
                                  })
                                });
                                const data = await res.json();
                                setSoilPrediction([
                                  {
                                    crop: data.crop,
                                    confidence: 95
                                  }
                                ]);
                              } catch (err) {
                                console.error("Prediction error:", err);
                              } finally {
                                setLoadingPrediction(false);
                              }
                            }
                          }}>
                          <Popup><strong>Soil Data</strong><br />{nutrient}: {val}</Popup>
                        </Rectangle>
                      );
                    })}

                    {/* USER FIELDS */}
                    {fields.map((field) => (
                      <Marker key={field.id} position={[field.lat, field.lng]}>
                        <Popup><strong>{field.name}</strong><br />{field.crop}</Popup>
                      </Marker>
                    ))}
                    {fields.map((field) => (
                      <Rectangle key={"rect-" + field.id}
                        bounds={[[field.lat - 0.002, field.lng - 0.002], [field.lat + 0.002, field.lng + 0.002]]}
                        pathOptions={{ color: "#2563eb", fillOpacity: 0.1 }} />
                    ))}
                  </MapContainer>

                  {/* SOIL INSIGHT MODAL */}
                  {showSoilModal && selectedSoil && (
                    <div className="soil-modal-overlay">
                      <div className="soil-modal">
                        <h2 className="modal-title">🌱 Soil Insights</h2>
                        <div className="soil-grid">
                          <div className="soil-card n"><span>N</span><strong>{selectedSoil.N}</strong></div>
                          <div className="soil-card p"><span>P</span><strong>{selectedSoil.P}</strong></div>
                          <div className="soil-card k"><span>K</span><strong>{selectedSoil.K}</strong></div>
                          <div className="soil-card ph"><span>pH</span><strong>{selectedSoil.ph}</strong></div>
                        </div>
                        <div className="prediction-box">
                          <h3>🌾 Top Crop Recommendations</h3>
                          {loadingPrediction ? (
                            <div className="loader"></div>
                          ) : (
                            <div className="crop-list-modal">
                              {soilPrediction.slice(0, 3).map((crop, idx) => (
                                <div key={idx} className="crop-item">🌱 {crop.crop}<span>{crop.confidence.toFixed(1)}%</span></div>
                              ))}
                            </div>
                          )}
                        </div>
                        <button className="close-btn-modal" onClick={() => { setShowSoilModal(false); setSoilPrediction([]); }}>Close</button>
                      </div>
                    </div>
                  )}

                  {/* LEGEND */}
                  <div className="map-legend-overlay">
                    <h4>{nutrient} Levels</h4>
                    {nutrient === "pH" ? (
                      <>
                        <div className="legend-item"><span style={{ background: "#60a5fa" }}></span> Acidic</div>
                        <div className="legend-item"><span style={{ background: "#22c55e" }}></span> Neutral</div>
                        <div className="legend-item"><span style={{ background: "#f97316" }}></span> Alkaline</div>
                      </>
                    ) : (
                      <>
                        <div className="legend-item"><span style={{ background: "#ef4444" }}></span> Low</div>
                        <div className="legend-item"><span style={{ background: "#facc15" }}></span> Medium</div>
                        <div className="legend-item"><span style={{ background: "#22c55e" }}></span> High</div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* FIELDS SIDEBAR */}
              <div className="fields-sidebar">
                <div className="field-list-header"><span>📂</span><h3>Your Fields</h3></div>
                <div className="field-cards-container">
                  {fields.map((field) => (
                    <div key={field.id} className="field-item" onClick={() => { setInputLat(field.lat); setInputLng(field.lng); }} style={{ cursor: "pointer" }}>
                      <div className={`field-status ${field.color}`}></div>
                      <div className="field-info">
                        <strong>{field.name}</strong>
                        <p>{field.crop} • {field.area} ha</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ADD FIELD MODAL */}
            {showModal && (
              <div className="modal-overlay">
                <div className="modal-content">
                  <div className="modal-header">
                    <h3>Add New Field</h3>
                    <button className="close-btn" onClick={() => setShowModal(false)}><X size={20} /></button>
                  </div>
                  <div className="modal-body">
                    <label>Field Name</label>
                    <input type="text" value={newField.name} onChange={(e) => setNewField({ ...newField, name: e.target.value })} />
                    <div className="form-row">
                      <div><label>Crop</label><input type="text" value={newField.crop} onChange={(e) => setNewField({ ...newField, crop: e.target.value })} /></div>
                      <div><label>Area</label><input type="text" value={newField.area} onChange={(e) => setNewField({ ...newField, area: e.target.value })} /></div>
                    </div>
                    <div className="form-row">
                      <div><label>Lat</label><input type="text" value={newField.lat} onChange={(e) => setNewField({ ...newField, lat: e.target.value })} /></div>
                      <div><label>Lng</label><input type="text" value={newField.lng} onChange={(e) => setNewField({ ...newField, lng: e.target.value })} /></div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button className="save-btn" onClick={handleAddField}>Save Field</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ─── CROP SUGGESTIONS ─── */}
        {activePage === "cropSuggestions" && <CropSuggestionUI />}

        {/* ─── SOIL HEALTH ─── */}
        {activePage === "soilHealth" && <SoilHealthUI />}

        {/* ─── SETTINGS ─── */}
        {activePage === "settings" && (
          <div className="content-fade-in" key="settings">
            <header className="page-header"><h1>Settings</h1><p className="subtitle-small">Manage account preferences</p></header>
            <div className="settings-container-layout">
              <div className="settings-card">
                <div className="card-title-row">
                  <div className="icon-box-light"><span className="user-icon">👤</span></div>
                  <div><h3>Profile</h3><p>Personal details</p></div>
                </div>
                <div className="settings-form-grid">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input type="text" value={settings.name} onChange={(e) => setSettings({ ...settings, name: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input type="email" value={settings.email} onChange={(e) => setSettings({ ...settings, email: e.target.value })} />
                  </div>
                </div>
              </div>
              <div className="settings-actions">
                <button className="save-settings-btn" onClick={handleSaveSettings} disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}