import React, { useState, useEffect } from "react";
import CropSuggestionUI from "./CropSuggestionUI";
import SoilHealthUI from "./SoilHealthUI";
import Weather from "./Weather";
// ✅ FIX 1: Rectangle import kiya
import { MapContainer, TileLayer, Marker, Popup, Rectangle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; 
import L from 'leaflet'; 
import { 
  Cloud, Sun, Wind, Eye, Gauge, Map, Settings, 
  LayoutDashboard, CloudRain, Wheat, Navigation, X, LogOut, 
  Database, FileText, Download, // ✅ Database yahan add hona zaroori hai
  CropIcon
} from "lucide-react";
import "./Users.css";

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

const [user, setUser] = useState({ name: "", email: "", role: "" });

  useEffect(() => {
  const email = localStorage.getItem("email");
  const token = localStorage.getItem("token");
fetch(`http://127.0.0.1:8000/api/users/get_user_by_email/${email}/`, {
    headers: { Authorization: `Token ${token}` }
  })
    .then(res => res.json())
    .then(data => setUser({ name: data.full_name, email: data.email, role: data.role }))
    .catch(() => setUser({ name: "User", email, role: "" }));
}, []);

  // --- 🧠 AI LOGIC TO UPDATE CROPS ---
  const handleGenerate = async () => {
  try {
    setIsAnalyzing(true);
    let payload = {};

    // ✅ CASE 1: lat/lon available
    if (inputLat && inputLng) {
      if (isNaN(inputLat) || isNaN(inputLng)) {
      alert("Please enter valid numeric latitude and longitude");
      return;
      }
      payload = {
        latitude: parseFloat(inputLat),
        longitude: parseFloat(inputLng)
      };
    } 
    
    // ✅ CASE 2: manual input
    else {
      payload = {
        Nitrogen: Number(n),
        Phosphorus: Number(p),
        Potassium: Number(k),
        Ph: Number(ph)
      };
    }

    const res = await fetch("http://127.0.0.1:5000/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (data.error) {
      alert(data.error);
      return;
    }

    console.log("API RESPONSE:", data);

    // ✅ Save response to state
    setRecommendations(data.recommendations);
    setWeather({
    temp: data.temperature,
    humidity: data.humidity,
    rainfall: data.rainfall,
    city: data.city
    });

  } catch (err) {
    console.error("Error:", err);
  }
  finally{
    setIsAnalyzing(false);
  }
  };
  const [recommendations, setRecommendations] = useState([]);
  const [weather, setWeather] = useState(null);
  const [dashboardWeather, setDashboardWeather] = useState(null);
  const [activePage, setActivePage] = useState("dashboard");
  const [place, setPlace] = useState("");

  const handleSearchLocation = async () => {
  if (!place.trim()) {
    alert("Please enter a location");
    return;
  }

  try {
    const res = await fetch(
      `http://127.0.0.1:5000/geocode?place=${place}`
    );

    const data = await res.json();

    if (data.error) {
      alert(data.error);
      return;
    }

    setInputLat(data.lat);
    setInputLng(data.lon);

  } catch (err) {
    console.error(err);
  }
};

  useEffect(() => {
  const timeout = setTimeout(() => {

    if (!inputLat || !inputLng) return;

    const fetchWeather = async () => {
      try {
        const res = await fetch(
          `http://127.0.0.1:5000/weather?lat=${inputLat}&lon=${inputLng}`
        );

        const data = await res.json();

        setDashboardWeather({
          temp: data.temperature,
          humidity: data.humidity,
          rainfall: data.rainfall
        });

      } catch (err) {
        console.error("Weather fetch error:", err);
      }
    };

    fetchWeather();

  }, 800); // debounce delay

  return () => clearTimeout(timeout);

}, [inputLat, inputLng]);
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
          <div className={`nav-item ${activePage === "soilHealth" ? "active" : ""}`} onClick={() => setActivePage("soilHealth")}><Wheat size={18} /><span>Soil Health</span></div>
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
    <h1>Good Morning, {user.name} 👋</h1>
      <p>Here's what's happening with your fields today</p>
    </header>

    <div className="dashboard-grid">
      
      <div className="stat-card" style={{ position: "relative", overflow: "hidden" }}>
  
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: "100%" ,width: "100%"}}>
        
          <div>
            {/* 🔥 TITLE */}
            <p style={{
                fontSize: "12px",
                color: "#9CA3AF",
                fontWeight: "600",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: "6px"
              }}>{dashboardWeather ? "Live Weather" : "Loading..."}</p>

            {/* 🔥 TEMP */}
            <h2 style={{
              fontSize: "32px",
              fontWeight: "700",
              color: "#111827",
              margin: "0 0 2px"
              }}>{dashboardWeather ? `${dashboardWeather.temp}°C` : "--"}</h2>

            {/* 🔥 HUMIDITY */}
            <p style={{
                fontSize: "14px",
                color: "#4B5563",
                margin: "0 0 10px"
              }}>{dashboardWeather ? `Humidity: ${dashboardWeather.humidity}%` : ""} </p>
          </div>

          {/* 🔥 ICON */}
          <div style={{ fontSize: "48px", lineHeight: 1 }}>
            {dashboardWeather?.rainfall > 20 ? "🌧️" :
            dashboardWeather?.temp > 30 ? "☀️" : "🌤️"}
          </div>

        </div>
      </div>
      <div className="stat-card" style={{ 
        position: "relative", 
        overflow: "hidden",
        padding: "30px"}}>

        <p style={{ fontSize: "12px", color: "#9CA3AF", fontWeight: "600" }}>
          Enter Location
        </p>

        <input
          type="text"
          placeholder="Enter city / village"
          value={place}
          onChange={(e) => setPlace(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #eee",
            marginTop: "10px"
          }}
        />

        <button
          onClick={handleSearchLocation}
          style={{
            marginTop: "10px",
            padding: "10px",
            width: "100%",
            background: "#7da07d",
            color: "white",
            border: "none",
            borderRadius: "8px"
          }}
        >
          Get Coordinates
        </button>

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
              placeholder="Latitude"
            />
          </div>
          <div className="input-group">
            <label>LONGITUDE</label>
            <input 
              type="number" 
              value={inputLng} 
              onChange={(e) => setInputLng(e.target.value)} 
              placeholder="Longitude"
            />
          </div>
        </div>

        {/* ✨ NEW BIG GENERATE BUTTON ✨ */}
        <button 
          className="generate-btn" 
          onClick={handleGenerate}
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

        {/* 2. WEATHER PAGE */}
        {activePage === "weather" && (
  <div className="content-fade-in" key="weather">
    <Weather />
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
        {activePage === "cropSuggestions" && <CropSuggestionUI />}

        {/* 4. Soil Health PAGE */}          
        {activePage === "soilHealth" && <SoilHealthUI />}
                   

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