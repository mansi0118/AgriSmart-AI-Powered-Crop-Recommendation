import React, { useState, useEffect } from "react";
// ✅ FIX 1: Rectangle import kiya
import { MapContainer, TileLayer, Marker, Popup, Rectangle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; 
import L from 'leaflet'; 
import { 
  Cloud, Sun, Wind, Eye, Gauge, Map, Settings, 
  LayoutDashboard, CloudRain, Wheat, Navigation, X, LogOut, 
  Database, FileText, Download 
} from "lucide-react";
import "./Users.css";
import Weather from "./Weather"; // ✅ Weather component import ho raha hai

// --- Leaflet Icon Fix ---
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function UserDashboard() {
  const [inputLat, setInputLat] = useState("27.80");
  const [inputLng, setInputLng] = useState("78.65");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activePage, setActivePage] = useState("dashboard");
  
  // Default Crops
  const [currentRecommendations, setCurrentRecommendations] = useState([
    { name: "Wheat", match: "92%", icon: "🌾", color: "green" },
    { name: "Mustard", match: "87%", icon: "🌻", color: "yellow" },
    { name: "Chickpea", match: "84%", icon: "🫘", color: "brown" }
  ]);

  const handleAnalyzeLocation = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      const lat = parseFloat(inputLat);
      if (lat > 28.00) {
        setCurrentRecommendations([
          { name: "Barley", match: "95%", icon: "🌱", color: "green" },
          { name: "Potato", match: "88%", icon: "🥔", color: "yellow" },
          { name: "Peas", match: "82%", icon: "🟢", color: "green" }
        ]);
      } else if (lat < 27.00) {
        setCurrentRecommendations([
          { name: "Rice", match: "91%", icon: "🍚", color: "green" },
          { name: "Sugarcane", match: "86%", icon: "🎋", color: "yellow" },
          { name: "Maize", match: "79%", icon: "🌽", color: "yellow" }
        ]);
      } else {
        setCurrentRecommendations([
          { name: "Wheat", match: "92%", icon: "🌾", color: "green" },
          { name: "Mustard", match: "87%", icon: "🌻", color: "yellow" },
          { name: "Chickpea", match: "84%", icon: "🫘", color: "brown" }
        ]);
      }
      setIsAnalyzing(false);
      alert(`📍 Location Analyzed: ${inputLat}, ${inputLng}\n✅ Recommendations Updated!`);
    }, 1500);
  };

  const [fields, setFields] = useState([
    { id: 1, name: "North Field", crop: "Wheat", area: "4.2", lat: 27.82, lng: 78.66, color: "green" },
    { id: 2, name: "South Field", crop: "Mustard", area: "3.8", lat: 27.79, lng: 78.64, color: "yellow" }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newField, setNewField] = useState({ name: "", crop: "", area: "", lat: "", lng: "" });
  const [soilData, setSoilData] = useState([]);
  const [nutrient, setNutrient] = useState("N"); 

  useEffect(() => {
    fetch("/soil_data.json")
      .then(res => res.json())
      .then(data => setSoilData(data.Sheet1 || []))
      .catch(err => console.log("Soil Data Error:", err));
  }, []);

  const cropsData = [
    {
      id: "wheat", name: "Wheat", season: "Rabi • 120-150 days", match: "92%", icon: "🌾",
      desc: "Ideal for the current soil conditions. High yield potential.",
      stats: { water: "Medium", temp: "15-25°C", duration: "120-150 days", soil: "Loamy" },
      reasons: ["Well-suited for alluvial soil", "Compatible with moisture levels"],
      tips: ["Sow seeds 2-3 cm deep", "Maintain row spacing 20-22 cm"]
    },
    {
      id: "mustard", name: "Mustard", season: "Rabi • 110-140 days", match: "87%", icon: "🌻",
      desc: "Excellent option for dry conditions.",
      stats: { water: "Low", temp: "10-25°C", duration: "110-140 days", soil: "Sandy Loam" },
      reasons: ["Best suited for low irrigation", "High market demand"],
      tips: ["Treat seeds with Trichoderma", "Thinning required 15-20 days"]
    },
    {
      id: "chickpea", name: "Chickpea", season: "Rabi • 95-110 days", match: "84%", icon: "🫘",
      desc: "Nitrogen-fixing crop that improves soil health.",
      stats: { water: "Very Low", temp: "20-30°C", duration: "95-110 days", soil: "Clay Loam" },
      reasons: ["Increases soil nitrogen", "Requires minimal fertilizers"],
      tips: ["Avoid sowing in saline soils", "Use raised bed method"]
    },
    {
      id: "barley", name: "Barley", season: "Rabi • 100-120 days", match: "78%", icon: "🌱",
      desc: "Hardy crop, highly tolerant to saline soils.",
      stats: { water: "Low", temp: "12-25°C", duration: "100-120 days", soil: "Saline/Loam" },
      reasons: ["Tolerates late sowing", "Can grow in problematic soils"],
      tips: ["Sow in rows 22 cm apart", "Apply split dose of Urea"]
    }
  ];

  const [selectedCrop, setSelectedCrop] = useState(cropsData[0]);
  const [settings, setSettings] = useState({
    name: "Ramesh Singh", email: "ramesh.singh@example.com", phone: "+91 98765 43210",
    region: "Kasganj, UP", lat: "27.80", lng: "78.65", units: "Metric", language: "English"
  });
  const [isSaving, setIsSaving] = useState(false);

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

  const handleAddField = () => {
    if (!newField.name || !newField.lat) return alert("Please fill details");
    setFields([...fields, {
      id: Date.now(),
      name: newField.name,
      crop: newField.crop || "Fallow",
      area: newField.area || "0",
      lat: parseFloat(newField.lat),
      lng: parseFloat(newField.lng),
      color: "brown"
    }]);
    setShowModal(false);
    setNewField({ name: "", crop: "", area: "", lat: "", lng: "" });
  };

  const handleSaveSettings = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert("✅ Settings Saved Successfully!");
    }, 1000);
  };

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="logo-section">
          <div className="logo-box"><CloudRain size={20} color="white" /></div>
          <span className="logo-text">AgriSmart</span>
        </div>
        <div className="profile-section">
          <div className="profile-avatar">RS</div>
          <div className="profile-details"><h4>Ramesh Singh</h4><p>Kasganj, UP</p></div>
          <div className="status-badge">● Active field</div>
        </div>
        <nav className="nav-menu">
          <div className={`nav-item ${activePage === "dashboard" ? "active" : ""}`} onClick={() => setActivePage("dashboard")}><LayoutDashboard size={18} /> <span>Dashboard</span></div>
          <div className={`nav-item ${activePage === "weather" ? "active" : ""}`} onClick={() => setActivePage("weather")}><Cloud size={18} /> <span>Weather</span></div>
          <div className={`nav-item ${activePage === "fieldMap" ? "active" : ""}`} onClick={() => setActivePage("fieldMap")}><Map size={18} /> <span>Field Map</span></div>
          <div className={`nav-item ${activePage === "cropSuggestions" ? "active" : ""}`} onClick={() => setActivePage("cropSuggestions")}><Wheat size={18} /> <span>Crop Suggestions</span></div>
          <div className={`nav-item ${activePage === "researcherData" ? "active" : ""}`} onClick={() => setActivePage("researcherData")}><Database size={18} /> <span>Researcher Data</span></div>
          <div className={`nav-item ${activePage === "settings" ? "active" : ""}`} onClick={() => setActivePage("settings")}><Settings size={18} /> <span>Settings</span></div>
        </nav>
        <div className="logout-section" onClick={() => alert("Logging out...")}>
          <LogOut size={18} /> <span>Logout</span>
        </div>
      </aside>

      <main className="main-content">
        {activePage === "dashboard" && (
          <div className="content-fade-in">
            <header className="page-header">
              <h1>Good Morning, Ramesh 👋</h1>
              <p>Here's what's happening with your fields today</p>
            </header>
            <div className="dashboard-grid">
              <div className="stat-card">
                <div className="stat-icon sun">☀️</div>
                <h2>28°C</h2><p>Partly Cloudy</p>
                <span className="small-alert">Rain expected Wed-Thu</span>
              </div>
              <div className="stat-card">
                <div className="stat-icon leaf">🌱</div>
                <h2>3 Fields</h2><p>Active this season</p>
                <span className="small-alert">All fields healthy</span>
              </div>
              <div className="stat-card">
                <div className="stat-icon trend">📈</div>
                <h2>Good</h2><p>Soil health status</p>
                <span className="small-alert">Consider adding phosphorus</span>
              </div>
            </div>
            <div className="lower-grid">
              <div className="map-panel">
                <div className="panel-header" onClick={() => setActivePage("fieldMap")} style={{cursor: "pointer"}}>
                  <h3>📍 Field Location</h3>
                  <Navigation size={16} style={{transform: "rotate(45deg)"}}/>
                </div>
                <div className="coord-inputs" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div className="input-group">
                    <label>LATITUDE</label>
                    <input type="number" value={inputLat} onChange={(e) => setInputLat(e.target.value)} />
                  </div>
                  <div className="input-group">
                    <label>LONGITUDE</label>
                    <input type="number" value={inputLng} onChange={(e) => setInputLng(e.target.value)} />
                  </div>
                </div>
                <button className="generate-btn" onClick={handleAnalyzeLocation} disabled={isAnalyzing}>
                  {isAnalyzing ? "🔄 Analyzing..." : "✨ Generate Recommendations"}
                </button>
                <div className="map-view" style={{ height: "220px", borderRadius: "15px", overflow: "hidden", marginTop: "20px" }}>
                  <MapContainer center={[parseFloat(inputLat) || 27.80, parseFloat(inputLng) || 78.65]} zoom={13} style={{ height: "100%", width: "100%" }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Marker position={[parseFloat(inputLat) || 27.80, parseFloat(inputLng) || 78.65]} />
                  </MapContainer>
                </div>
              </div>
              <div className="recommendation-panel">
                <div className="panel-header"><h3>🌾 Crop Recommendation</h3></div>
                {isAnalyzing ? <div className="spinner"></div> : (
                  <div className="crop-list">
                    {currentRecommendations.map((crop, i) => (
                      <div key={i} className="crop-card">
                        <span className="crop-emoji">{crop.icon}</span>
                        <strong>{crop.name}</strong>
                        <p>{crop.match} match</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activePage === "weather" && (
          <div className="content-fade-in">
            <Weather /> 
          </div>
        )}

        {activePage === "fieldMap" && (
          <div className="content-fade-in">
             <header className="page-header-flex">
               <h1>Field Map</h1>
               <button className="add-field-btn" onClick={() => setShowModal(true)}>+ Add Field</button>
             </header>
             <div className="map-grid-layout">
               <div className="map-main-area">
                 <div className="interactive-map-container" style={{height: "500px"}}>
                   <MapContainer center={[27.8083, 78.6458]} zoom={13} style={{ height: "100%", width: "100%", borderRadius: "20px" }}>
                     <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                     {fields.map(field => (
                       <Marker key={field.id} position={[field.lat, field.lng]}><Popup>{field.name}</Popup></Marker>
                     ))}
                   </MapContainer>
                 </div>
               </div>
             </div>
          </div>
        )}

        {activePage === "researcherData" && (
          <div className="content-fade-in">
            <header className="page-header"><h1>Researcher Datasets</h1></header>
            <div className="settings-card">
              <table style={{width: "100%", textAlign: "left"}}>
                <thead><tr><th>Date</th><th>Researcher</th><th>Title</th><th>Action</th></tr></thead>
                <tbody>
                  <tr><td>16 Jan 2026</td><td>Dr. Sharma</td><td>Soil Map</td><td><button className="save-btn">Download</button></td></tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal logic etc... */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
               <h3>Add New Field</h3>
               <button onClick={() => setShowModal(false)}>Close</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}