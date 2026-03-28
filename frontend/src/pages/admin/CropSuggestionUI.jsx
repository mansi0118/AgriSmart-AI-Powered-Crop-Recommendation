import { useState } from "react";
import "./CropSuggestionUI.css"; // make sure CSS included

function CropSuggestionUI() {

  const [formData, setFormData] = useState({
    Nitrogen: "",
    Phosphorus: "",
    Potassium: "",
    Ph: "",
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://127.0.0.1:5000/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    });

    const data = await res.json();
    console.log("API DATA:", data);
    setResult(data);
  };

  return (
    <div className="crop-container">

      {/* 🌿 FORM CARD */}
      <div className="crop-card-ui">
       <h5 className="crop-title">🌱 Soil & Location Details</h5>

        <form onSubmit={handleSubmit}>

          <div className="form-grid">

            <div className="form-group">
              <label>Nitrogen</label>
              <input type="number" name="Nitrogen" onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Phosphorus</label>
              <input type="number" name="Phosphorus" onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Potassium</label>
              <input type="number" name="Potassium" onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>pH</label>
              <input type="number" step="0.1" name="Ph" onChange={handleChange} required />
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

          <button type="submit" className="crop-btn">
            🚀 Get Recommendation
          </button>

        </form>
      </div>

      {result && result.recommendations && (
  <div className="result-grid">

    {/* 📋 INPUT SUMMARY */}
    <div className="crop-card-ui">
    <h5 className="crop-title">📊 Input Summary</h5>

      <p><strong>N:</strong> {formData.Nitrogen}</p>
      <p><strong>P:</strong> {formData.Phosphorus}</p>
      <p><strong>K:</strong> {formData.Potassium}</p>
      <p><strong>pH:</strong> {formData.Ph}</p>
      <p><strong>State:</strong> {formData.state}</p>
      <p><strong>District:</strong> {formData.district}</p>
      <p><strong>City:</strong> {formData.city}</p>
    </div>

    {/* 🌦 Weather */}
    <div className="crop-card-ui">
      <h5 className="crop-title">🌦 Weather Insights</h5>
      <p><strong>Temperature:</strong> {result.temperature} °C</p>
      <p><strong>Humidity:</strong> {result.humidity} %</p>
      <p><strong>Rainfall:</strong> {result.rainfall} mm</p>
    </div>

    {/* 🌾 Crops */}
    <div className="crop-card-ui">
      <h5 className="crop-title">🌾 Crop Recommendations</h5>

      {result.recommendations.map((rec, index) => (
        <div key={index} style={{ marginBottom: "15px" }}>
          <strong>{index + 1}. {rec.crop}</strong>

          <div className="progress-bar-ui">
            <div
              className="progress-fill"
              style={{ width: `${rec.confidence}%` }}
            ></div>
          </div>

          <small>{rec.confidence}%</small>
        </div>
      ))}

    </div>

  </div>
)}

    </div>
  );
}

export default CropSuggestionUI;