import { useState } from "react";
import "./CropSuggestionUI.css";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
const API_BASE = process.env.REACT_APP_API_URL;
const cropLabels = {
  0: "groundnut",
  1: "maize",
  2: "mustard",
  3: "pea",
  4: "pearl millet",
  5: "potato",
  6: "rice"
};
function CropSuggestionUI() {

  const [formData, setFormData] = useState({
  N: "",
  P: "",
  K: "",
  ph: "",
  state: "",
  district: "",
  city: ""
});

  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  const [loading, setLoading] = useState(false);
const WEATHER_API = process.env.REACT_APP_WEATHER_API_KEY;

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    // STEP 1: Get coordinates from city name
    const geoRes = await fetch(
      `${API_BASE}/api/users/geocode/?place=${formData.city}`
    );
    const geoData = await geoRes.json();

    if (geoData.error) {
      alert("City not found: " + geoData.error);
      return;
    }

    const lat = geoData.lat;
    const lon = geoData.lon;

    // STEP 2: Get weather from coordinates
    const weatherRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API}&units=metric`
    );
    const weatherData = await weatherRes.json();

    const temperature = weatherData.main?.temp || 0;
    const humidity = weatherData.main?.humidity || 0;
    const rainfall = weatherData.rain ? weatherData.rain["1h"] || 0 : 0;

    // STEP 3: Send everything to predict API
    const res = await fetch(`${API_BASE}/api/users/predict/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        N: formData.N,
        P: formData.P,
        K: formData.K,
        ph: formData.ph,
        temperature,
        humidity,
        rainfall,
      })
    });

    let data = {};
    try {
      data = await res.json();
    } catch (err) {
      console.error("Invalid JSON:", err);
      alert("Server error");
      return;
    }

    if (!res.ok) {
      alert(data.error || "Prediction failed");
      return;
    }

    // STEP 4: Override response weather with real fetched values
    setResult({
      ...data,
      temperature,   // ✅ real weather, not 0
      humidity,
      rainfall,
    });

  } catch (err) {
    console.error(err);
    alert("Error: " + err.message);
  } finally {
    setLoading(false);
  }
};

  // ✅ SAFE DATA HANDLING
  const chartData =
  result?.top_3_crops?.map((rec) => ({
    name: cropLabels[rec.crop] || rec.crop,
    confidence: rec.confidence,
  })) || [];

  // ✅ TOP CROP
  const topCrop = result?.top_3_crops?.[0];

  return (
    <div className="crop-container">

      {/* FORM */}
      <div className="crop-card-ui">

              {/* 🆕 DESCRIPTION */}
        <div className="crop-description">
          <h4>🌱 Crop Recommendation Guide</h4>
          <p>
            This tool helps you find the most suitable crops based on your soil nutrients 
            and location details.
          </p>

          <ul>
            <li>Enter soil values like Nitrogen (N), Phosphorus (P), Potassium (K), and pH.</li>
            <li>Provide your State, District, and City for accurate weather-based analysis.</li>
            <li>Click <strong>"Get Recommendation"</strong> to analyze your data.</li>
          </ul>

          <p>
            📊 <strong>Output:</strong> You will get recommended crops along with confidence levels, 
            and weather insights like temperature, humidity, and rainfall.
          </p>

          <p>
            🌾 Higher confidence means the crop is more suitable for your soil and environment.
          </p>
        </div>

        <h5 className="crop-title">🌱 Soil & Location Details</h5>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">

            <div className="form-group">
              <label>Nitrogen <span className="unit">(kg/ha)</span></label>
              <input type="number" name="N" step="0.01" onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Phosphorus <span className="unit">(kg/ha)</span></label>
              <input type="number" name="P" step="0.01" onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Potassium <span className="unit">(kg/ha)</span></label>
              <input type="number" name="K" step="0.01" onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>pH <span className="unit">(0–14)</span></label>
              <input type="number" step="0.1" name="ph" onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>State</label>
              <input type="text" name="state" onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>District</label>
              <input type="text" name="district" onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>City</label>
              <input type="text" name="city" onChange={handleChange} required />
            </div>

          </div>

          <button type="submit" className="crop-btn" disabled={loading}>
          {loading ? "⏳ Analyzing..." : "🚀 Get Recommendation"}
        </button>
        </form>
      </div>

      {/* RESULT */}
      {result && result.top_3_crops && (
        <div className="result-section">
          <div className="three-block">

            {/* 📋 INPUT SUMMARY */}
            <div className="crop-card-ui">
              <h5 className="crop-title">📊 Input Summary</h5>

              <p><strong>N:</strong> {formData.N}</p>
              <p><strong>P:</strong> {formData.P}</p>
              <p><strong>K:</strong> {formData.K}</p>
              <p><strong>pH:</strong> {formData.ph}</p>
              <p><strong>State:</strong> {formData.state}</p>
              <p><strong>District:</strong> {formData.district}</p>
              <p><strong>City:</strong> {formData.city}</p>
            </div>

            {/* 🌦 WEATHER */}
            <div className="crop-card-ui">
              <h5 className="crop-title">🌦 Weather Insights</h5>
              <p><strong>Temperature:</strong> {result.temperature} °C</p>
              <p><strong>Humidity:</strong> {result.humidity} %</p>
              <p><strong>Rainfall:</strong> {result.rainfall} mm</p>
            </div>
            <div className="crop-card-ui">
              <h5 className="crop-title">🌾 Crop Recommendations</h5>

              {result.top_3_crops.map((rec, index) => (
                <div key={index} style={{ marginBottom: "15px" }}>
                  <strong>
                    {index === 0 && "🥇 "}
                    {index === 1 && "🥈 "}
                    {index === 2 && "🥉 "}
                    {cropLabels[rec.crop] || rec.crop}
                  </strong>

                  <div className="progress-bar-ui">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${rec.confidence}%`,
                        background:
                          rec.confidence > 80
                            ? "#22c55e"
                            : rec.confidence > 60
                            ? "#facc15"
                            : "#ef4444",
                      }}
                    ></div>
                  </div>

                  <small>
                    {rec.confidence}% —{" "}
                    {rec.confidence > 80
                      ? "Highly Suitable 🌟"
                      : rec.confidence > 60
                      ? "Moderate 👍"
                      : "Low ⚠️"}
                  </small>
                </div>
              ))}
            </div>
          </div>
          {/* 🏆 TOP CROP */}
          <div className="top-crop-card">
            🏆 Top Crop:
              <strong>
                {cropLabels[topCrop?.crop] || topCrop?.crop || "N/A"}
              </strong>
              ({topCrop?.confidence || 0}%)
          </div>

          {/* GRAPH */}
          <div className="crop-card-ui">
            <h5 className="crop-title">📊 Recommendation Graph</h5>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />

                <Bar dataKey="confidence">
                  {chartData.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={entry.name === (cropLabels[topCrop?.crop] || topCrop?.crop) ? "#22c55e" : "#93c5fd"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          

        </div>
      )}
    </div>
  );
}

export default CropSuggestionUI;