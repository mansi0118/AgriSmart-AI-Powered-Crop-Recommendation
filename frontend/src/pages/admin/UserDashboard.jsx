import React, { useState, useEffect } from "react";
// ✅ FIX 1: Rectangle import kiya
import { MapContainer, TileLayer, Marker, Popup, Rectangle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; 
import L from 'leaflet'; 
import { 
  Cloud, Sun, Wind, Eye, Gauge, Map, Settings, 
  LayoutDashboard, CloudRain, Wheat, Navigation, X, LogOut, 
  Database, FileText, Download // ✅ Database yahan add hona zaroori hai
} from "lucide-react";
import "./Users.css";
<<<<<<< HEAD
=======
import Weather from "./Weather";
>>>>>>> 95c727f253994a2f5f16730bfb9833d553f646d4

// --- Leaflet Icon Fix ---
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function UserDashboard() {
  // ✅ FIX 2: SAARA STATE AUR LOGIC IS FUNCTION KE ANDAR HOGA
  // --- 🆕 LOCATION & RECOMMENDATION STATE ---
  const [inputLat, setInputLat] = useState("27.80");
  const [inputLng, setInputLng] = useState("78.65");
  const [isAnalyzing, setIsAnalyzing] = useState(false); // Loading state
  
  // Default Crops
  const [currentRecommendations, setCurrentRecommendations] = useState([
    { name: "Wheat", match: "92%", icon: "🌾", color: "green" },
    { name: "Mustard", match: "87%", icon: "🌻", color: "yellow" },
    { name: "Chickpea", match: "84%", icon: "🫘", color: "brown" }
  ]);

  // --- 🧠 FAKE AI LOGIC TO UPDATE CROPS ---
  const handleAnalyzeLocation = () => {
    setIsAnalyzing(true); // Loading shuru

    // 1.5 Second ka delay taaki lage AI soch raha hai
    setTimeout(() => {
      const lat = parseFloat(inputLat);
      
      // Simple Logic: Agar Latitude 28 se zyada hai toh alag crops, nahi toh default
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
        // Wapis Default (Kasganj area)
        setCurrentRecommendations([
          { name: "Wheat", match: "92%", icon: "🌾", color: "green" },
          { name: "Mustard", match: "87%", icon: "🌻", color: "yellow" },
          { name: "Chickpea", match: "84%", icon: "🫘", color: "brown" }
        ]);
      }
      
      setIsAnalyzing(false); // Loading khatam
      alert(`📍 Location Analyzed: ${inputLat}, ${inputLng}\n✅ Recommendations Updated!`);
    }, 1500);
  };
  const [activePage, setActivePage] = useState("dashboard");
  
  // --- 1. FIELDS STATE ---
  const [fields, setFields] = useState([
    { id: 1, name: "North Field", crop: "Wheat", area: "4.2", lat: 27.82, lng: 78.66, color: "green" },
    { id: 2, name: "South Field", crop: "Mustard", area: "3.8", lat: 27.79, lng: 78.64, color: "yellow" }
  ]);

  // --- 2. MODAL STATE ---
  const [showModal, setShowModal] = useState(false);
  const [newField, setNewField] = useState({ name: "", crop: "", area: "", lat: "", lng: "" });

  // --- 3. SOIL MAPPING STATE ---
  const [soilData, setSoilData] = useState([]);
  const [nutrient, setNutrient] = useState("N"); 

  // --- 4. DATA FETCHING ---
  useEffect(() => {
    fetch("/soil_data.json")
      .then(res => res.json())
      .then(data => setSoilData(data.Sheet1 || []))
      .catch(err => console.log("Soil Data Error:", err));
  }, []);

  // --- 5. CROPS DATA ---
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

  // --- 6. SETTINGS STATE (Editable) ---
  const [settings, setSettings] = useState({
    name: "Ramesh Singh", email: "ramesh.singh@example.com", phone: "+91 98765 43210",
    region: "Kasganj, UP", lat: "27.80", lng: "78.65", units: "Metric", language: "English"
  });
  const [isSaving, setIsSaving] = useState(false);


  // --- HELPERS FUNCTIONS ---
  
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
      {/* SIDEBAR */}
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
          
          {/* ✅ 2. NEW SIDEBAR ITEM ADDED HERE */}
          <div className={`nav-item ${activePage === "researcherData" ? "active" : ""}`} onClick={() => setActivePage("researcherData")}>
            <Database size={18} /> <span>Researcher Data</span>
          </div>

          <div className={`nav-item ${activePage === "settings" ? "active" : ""}`} onClick={() => setActivePage("settings")}><Settings size={18} /> <span>Settings</span></div>
        </nav>

        <div className="logout-section" onClick={() => alert("Logging out...")}>
          <LogOut size={18} />
          <span>Logout</span>
        </div>
      </aside>
      {/* MAIN CONTENT */}
      <main className="main-content">
        
       {/* 1. DASHBOARD PAGE */}
       {activePage === "dashboard" && (
  <div className="content-fade-in" key="dashboard">
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
      
      {/* --- LEFT: FIELD LOCATION & INPUTS --- */}
      <div className="map-panel">
        <div className="panel-header" onClick={() => setActivePage("fieldMap")} style={{cursor: "pointer"}}>
          <h3>📍 Field Location</h3>
          <Navigation size={16} style={{transform: "rotate(45deg)"}}/>
        </div>

        {/* INPUTS ROW */}
        <div className="coord-inputs" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div className="input-group">
            <label>LATITUDE</label>
            <input 
              type="number" 
              value={inputLat} 
              onChange={(e) => setInputLat(e.target.value)} 
              placeholder="27.80"
            />
          </div>
          <div className="input-group">
            <label>LONGITUDE</label>
            <input 
              type="number" 
              value={inputLng} 
              onChange={(e) => setInputLng(e.target.value)} 
              placeholder="78.65"
            />
          </div>
        </div>

        {/* ✨ NEW BIG GENERATE BUTTON ✨ */}
        <button 
          className="generate-btn" 
          onClick={handleAnalyzeLocation}
          disabled={isAnalyzing}
        >
          {isAnalyzing ? (
            <>🔄 Analyzing Soil & Weather...</>
          ) : (
            <>✨ Generate Recommendations</>
          )}
        </button>
        
        {/* Map Preview */}
        <div className="map-view" style={{ height: "220px", borderRadius: "15px", overflow: "hidden", marginTop: "20px", position: "relative" }}>
          <div onClick={() => setActivePage("fieldMap")} style={{position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 10, cursor: "pointer", background: "transparent"}}></div>
          <MapContainer center={[parseFloat(inputLat) || 27.80, parseFloat(inputLng) || 78.65]} zoom={13} scrollWheelZoom={false} zoomControl={false} style={{ height: "100%", width: "100%" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap' />
            <Marker position={[parseFloat(inputLat) || 27.80, parseFloat(inputLng) || 78.65]}><Popup>Selected Location</Popup></Marker>
          </MapContainer>
        </div>
      </div>

      {/* --- RIGHT: CROP RECOMMENDATIONS --- */}
      <div className="recommendation-panel">
        <div className="panel-header">
            <h3>🌾 Crop Recommendation</h3>
            <span className="badge">High Confidence</span>
        </div>

        {/* LOADING & RESULTS LOGIC */}
        {isAnalyzing ? (
          <div className="loading-state">
             <div className="spinner"></div>
             <p>AI is analyzing soil nutrients at {inputLat}, {inputLng}...</p>
          </div>
        ) : (
          <>
            <div className="crop-list">
              {currentRecommendations.map((crop, index) => (
                <div key={index} className="crop-card">
                  <span className="crop-emoji">{crop.icon}</span>
                  <strong>{crop.name}</strong>
                  <p>{crop.match} match</p>
                </div>
              ))}
            </div>
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
{/* 2. RESEARCHER DATA PAGE (NEW COMPONENT) */}
        {activePage === "researcherData" && (
          <div className="content-fade-in" key="researcherData">
            <header className="page-header">
              <h1>Researcher Datasets</h1>
              <p className="subtitle-small">Access agricultural data contributed by research labs</p>
            </header>

            <div className="settings-container-layout">
              {/* Dataset List Card */}
              <div className="settings-card" style={{padding: "0", overflow: "hidden"}}>
                <div className="card-title-row" style={{padding: "25px 30px", borderBottom: "1px solid #f0f0f0"}}>
                  <div className="icon-box-light"><span className="pref-icon">📊</span></div>
                  <div><h3>Available Datasets</h3><p>Verified uploads from IARI & Local Labs</p></div>
                </div>

                <div className="dataset-table-container" style={{padding: "0 30px 30px"}}>
                  <table style={{width: "100%", borderCollapse: "collapse", textAlign: "left"}}>
                    <thead>
                      <tr style={{borderBottom: "2px solid #f5f5f5", color: "#888", fontSize: "13px", textTransform: "uppercase"}}>
                        <th style={{padding: "15px 0"}}>Date</th>
                        <th style={{padding: "15px 0"}}>Researcher / Lab</th>
                        <th style={{padding: "15px 0"}}>Dataset Title</th>
                        <th style={{padding: "15px 0"}}>Status</th>
                        <th style={{padding: "15px 0", textAlign: "right"}}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Dummy Data for Table */}
                      {[
                        { id: 1, date: "16 Jan 2026", name: "Dr. A.K. Sharma", title: "Soil Nutrient Map - Kasganj Block A", status: "New" },
                        { id: 2, date: "14 Jan 2026", name: "IARI Lab Team", title: "Rabi Season Pest Outbreak Report", status: "Verified" },
                        { id: 3, date: "10 Jan 2026", name: "Dr. Priya Verma", title: "Groundwater Levels Q4 2025", status: "Pending" },
                        { id: 4, date: "05 Jan 2026", name: "Agri Dept. UP", title: "Revised MSP List 2026", status: "Verified" },
                      ].map((item) => (
                        <tr key={item.id} style={{borderBottom: "1px solid #f9f9f9", fontSize: "14px", color: "#333"}}>
                          <td style={{padding: "15px 0", color: "#666"}}>{item.date}</td>
                          <td style={{padding: "15px 0", fontWeight: "600"}}>{item.name}</td>
                          <td style={{padding: "15px 0"}}>
                            <div style={{display: "flex", alignItems: "center", gap: "8px"}}>
                              <FileText size={16} color="#7da07d"/> {item.title}
                            </div>
                          </td>
                          <td style={{padding: "15px 0"}}>
                            <span style={{
                              padding: "5px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "600",
                              background: item.status === "New" ? "#e3f2fd" : item.status === "Verified" ? "#e8f5e9" : "#fff3e0",
                              color: item.status === "New" ? "#1976d2" : item.status === "Verified" ? "#2e7d32" : "#ed6c02"
                            }}>
                              {item.status}
                            </span>
                          </td>
                          <td style={{padding: "15px 0", textAlign: "right"}}>
                            <button className="save-btn" style={{padding: "8px 15px", fontSize: "12px", display:"inline-flex", gap:"5px", alignItems:"center"}} onClick={() => alert(`Downloading: ${item.title}`)}>
                              <Download size={14}/> Download
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

<<<<<<< HEAD
        {/* 2. WEATHER PAGE */}
        {activePage === "weather" && (
          <div className="content-fade-in" key="weather">
            <header className="page-header"><h1>Weather Forecast</h1><p>Kasganj, Uttar Pradesh</p></header>
            <div className="weather-grid">
              <div className="weather-main-col">
                <div className="weather-hero-card">
                  <div className="hero-content">
                    <div className="hero-text"><p className="date-label">Today, December 15</p><div className="temp-display"><span className="main-temp">28°</span><div className="condition-box"><h2>Partly Cloudy</h2><p>Feels like 30°C</p></div></div></div>
                    <Sun size={100} className="weather-illustration" />
                  </div>
                  <div className="weather-metrics">
                    <div className="metric"><Cloud size={18} /> <div><p>HUMIDITY</p><strong>65%</strong></div></div>
                    <div className="metric"><Wind size={18} /> <div><p>WIND</p><strong>12 km/h</strong></div></div>
                    <div className="metric"><Eye size={18} /> <div><p>VISIBILITY</p><strong>10 km</strong></div></div>
                    <div className="metric"><Gauge size={18} /> <div><p>PRESSURE</p><strong>1015 hPa</strong></div></div>
                  </div>
                </div>
                <div className="hourly-forecast-card">
                  <h3>Today's Forecast</h3>
                  <div className="hourly-row">
                    {["6 AM", "9 AM", "12 PM", "3 PM", "6 PM"].map((t, i) => (
                      <div key={i} className={`hour-item ${t === "3 PM" ? "active" : ""}`}><span>{t}</span><Sun size={20} /><strong>{t === "3 PM" ? "30°" : "22°"}</strong></div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="weather-side-col">
                <div className="impact-panel">
                  <h3>🌡️ Farming Impact</h3>
                  <div className="advisory-card green"><strong>Ideal for Sowing</strong><p>Current conditions are good for wheat.</p></div>
                  <div className="advisory-card blue"><strong>Rain Alert</strong><p>Postpone irrigation.</p></div>
                </div>
                <div className="sun-moon-card">
                  <h3>Sun & Moon</h3>
                  <div className="astro-flex">
                    <div className="astro-box sunrise"><small>Sunrise</small><strong>6:45 AM</strong></div>
                    <div className="astro-box sunset"><small>Sunset</small><strong>5:30 PM</strong></div>
                  </div>
                </div>
              </div>
            </div>
=======
        {/* 2.Weather PAGE */}
        {activePage === "weather" && (
           <div className="content-fade-in" key="weather">
            <Weather />
>>>>>>> 95c727f253994a2f5f16730bfb9833d553f646d4
          </div>
        )}

        {/* 3. FIELD MAP PAGE */}
        {activePage === "fieldMap" && (
          <div className="content-fade-in" key="fieldMap">
            <header className="page-header-flex">
              <div><h1>Field Map</h1><p>Soil Health Analysis & Field Management</p></div>
              <button className="add-field-btn" onClick={() => setShowModal(true)}>+ Add Field</button>
            </header>

            <div className="map-grid-layout">
              <div className="map-main-area">
                <div className="coord-bar" style={{justifyContent: 'space-between'}}>
                  <div style={{display:'flex', gap:'10px'}}>
                      <div className="input-box"><label>LAT</label><input type="text" value="27.80" readOnly /></div>
                      <div className="input-box"><label>LNG</label><input type="text" value="78.65" readOnly /></div>
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
                
                <div className="interactive-map-container" style={{position: 'relative'}}>
                  <MapContainer 
                    center={[27.8083, 78.6458]} 
                    zoom={13} 
                    scrollWheelZoom={false} 
                    style={{ height: "100%", width: "100%", borderRadius: "20px" }}
                  >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap' />
                    
                    {/* SOIL LAYERS */}
                    {soilData.map((cell, idx) => {
                       const size = 0.003;
                       const key = nutrient === "N" ? "n" : nutrient === "P" ? "p" : nutrient === "K" ? "k" : "pH";
                       const val = cell[key];
                       const color = getColor(val, nutrient);
                       if(!val) return null;
                       return (
                         <Rectangle
                           key={idx}
                           bounds={[[cell.Latitude - size, cell.Longitude - size],[cell.Latitude + size, cell.Longitude + size]]}
                           pathOptions={{ color: color, fillColor: color, fillOpacity: 0.5, weight: 0 }}
                         >
                            <Popup><strong>Soil Data</strong><br/>{nutrient}: {val}</Popup>
                         </Rectangle>
                       )
                    })}

                    {/* USER FIELDS */}
                    {fields.map(field => (
                      <Marker key={field.id} position={[field.lat, field.lng]}>
                        <Popup><strong>{field.name}</strong><br />{field.crop}</Popup>
                      </Marker>
                    ))}
                  </MapContainer>

                  {/* LEGEND */}
                  <div className="map-legend-overlay">
                      <h4>{nutrient} Levels</h4>
                      {nutrient === 'pH' ? (
                          <>
                           <div className="legend-item"><span style={{background:'#60a5fa'}}></span> Acidic</div>
                           <div className="legend-item"><span style={{background:'#22c55e'}}></span> Neutral</div>
                           <div className="legend-item"><span style={{background:'#f97316'}}></span> Alkaline</div>
                          </>
                      ) : (
                          <>
                           <div className="legend-item"><span style={{background:'#ef4444'}}></span> Low</div>
                           <div className="legend-item"><span style={{background:'#facc15'}}></span> Medium</div>
                           <div className="legend-item"><span style={{background:'#22c55e'}}></span> High</div>
                          </>
                      )}
                  </div>
                </div>
              </div>

              <div className="fields-sidebar">
                <div className="field-list-header"><span>📂</span><h3>Your Fields</h3></div>
                <div className="field-cards-container">
                  {fields.map(field => (
                    <div key={field.id} className="field-item">
                      <div className={`field-status ${field.color}`}></div>
                      <div className="field-info"><strong>{field.name}</strong><p>{field.crop} • {field.area} ha</p></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ADD FIELD POPUP */}
            {showModal && (
              <div className="modal-overlay">
                <div className="modal-content">
                  <div className="modal-header"><h3>Add New Field</h3><button className="close-btn" onClick={() => setShowModal(false)}><X size={20}/></button></div>
                  <div className="modal-body">
                    <label>Field Name</label><input type="text" value={newField.name} onChange={(e) => setNewField({...newField, name: e.target.value})} />
                    <div className="form-row">
                      <div><label>Crop</label><input type="text" value={newField.crop} onChange={(e) => setNewField({...newField, crop: e.target.value})} /></div>
                      <div><label>Area</label><input type="text" value={newField.area} onChange={(e) => setNewField({...newField, area: e.target.value})} /></div>
                    </div>
                    <div className="form-row">
                      <div><label>Lat</label><input type="text" value={newField.lat} onChange={(e) => setNewField({...newField, lat: e.target.value})} /></div>
                      <div><label>Lng</label><input type="text" value={newField.lng} onChange={(e) => setNewField({...newField, lng: e.target.value})} /></div>
                    </div>
                  </div>
                  <div className="modal-footer"><button className="save-btn" onClick={handleAddField}>Save Field</button></div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 4. CROP SUGGESTIONS PAGE */}
        {activePage === "cropSuggestions" && (
          <div className="content-fade-in" key="crops">
            <header className="page-header"><h1>Crop Suggestions</h1><p className="subtitle-small">AI-powered recommendations</p></header>
            <div className="crops-container-layout">
              <div className="crop-sidebar-list">
                {cropsData.map((crop) => (
                  <div key={crop.id} className={`crop-mini-card ${selectedCrop.id === crop.id ? 'active' : ''}`} onClick={() => setSelectedCrop(crop)}>
                    <span className="mini-icon">{crop.icon}</span>
                    <div className="mini-info"><h4>{crop.name}</h4><p>{crop.season}</p></div>
                    <div className="mini-match"><div className="progress-bar"><div className="progress-fill" style={{width: crop.match}}></div></div><span>{crop.match} match</span></div>
                  </div>
                ))}
              </div>
              <div className="crop-analysis-main">
                <div className="crop-detail-hero">
                  <div className="hero-top-flex"><span className="large-icon">{selectedCrop.icon}</span><div className="hero-title-box"><h2>{selectedCrop.name}</h2><p>Rabi Season Crop</p></div><span className="confidence-pill">{selectedCrop.match} Match</span></div>
                  <p className="hero-text-desc">{selectedCrop.desc}</p>
                  <div className="quick-stats-grid">
                    <div className="qs-item"><small>Water Need</small><strong>{selectedCrop.stats.water}</strong></div>
                    <div className="qs-item"><small>Temperature</small><strong>{selectedCrop.stats.temp}</strong></div>
                    <div className="qs-item"><small>Duration</small><strong>{selectedCrop.stats.duration}</strong></div>
                    <div className="qs-item"><small>Soil Type</small><strong>{selectedCrop.stats.soil}</strong></div>
                  </div>
                </div>
                <div className="bottom-info-flex">
                  <div className="info-box-card"><h3>🛡️ Why This Crop?</h3><ul>{selectedCrop.reasons.map((r, i) => <li key={i}>{r}</li>)}</ul></div>
                  <div className="info-box-card"><h3>💡 Growing Tips</h3><ol>{selectedCrop.tips.map((t, i) => <li key={i}>{t}</li>)}</ol></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 5. SETTINGS PAGE */}
        {activePage === "settings" && (
          <div className="content-fade-in" key="settings">
            <header className="page-header"><h1>Settings</h1><p className="subtitle-small">Manage account preferences</p></header>
            <div className="settings-container-layout">
              <div className="settings-card">
                <div className="card-title-row"><div className="icon-box-light"><span className="user-icon">👤</span></div><div><h3>Profile</h3><p>Personal details</p></div></div>
                <div className="settings-form-grid">
                  <div className="form-group"><label>Full Name</label><input type="text" value={settings.name} onChange={(e) => setSettings({...settings, name: e.target.value})} /></div>
                  <div className="form-group"><label>Email</label><input type="email" value={settings.email} onChange={(e) => setSettings({...settings, email: e.target.value})} /></div>
                  <div className="form-group"><label>Phone</label><input type="text" value={settings.phone} onChange={(e) => setSettings({...settings, phone: e.target.value})} /></div>
                  <div className="form-group"><label>Region</label><input type="text" value={settings.region} onChange={(e) => setSettings({...settings, region: e.target.value})} /></div>
                </div>
              </div>
              <div className="settings-actions">
                <button className="save-settings-btn" onClick={handleSaveSettings} disabled={isSaving}>{isSaving ? "Saving..." : "Save Changes"}</button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}