import { useState } from "react";
import Plot from "react-plotly.js";
import { toast , ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./SoilHealthUI.css";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer} from "recharts";
function SoilHealthUI() {

  const [formData, setFormData] = useState({
    N: "", P: "", K: "", pH: "",
    EC: "", OC: "", S: "",
    Fe: "", Zn: "", Mn: "", Cu: ""
  });
  const chartData = [
  { name: "N", value: parseFloat(formData.N) || 0 },
  { name: "P", value: parseFloat(formData.P) || 0 },
  { name: "K", value: parseFloat(formData.K) || 0 },
  { name: "pH", value: parseFloat(formData.pH) || 0 },
  { name: "EC", value: parseFloat(formData.EC) || 0 },
  { name: "OC", value: parseFloat(formData.OC) || 0 },
  { name: "S", value: parseFloat(formData.S) || 0 },
  { name: "Fe", value: parseFloat(formData.Fe) || 0 },
  { name: "Zn", value: parseFloat(formData.Zn) || 0 },
  { name: "Mn", value: parseFloat(formData.Mn) || 0 },
  { name: "Cu", value: parseFloat(formData.Cu) || 0 }
];
  const nutrientRanges = {
    N: { min: 0, max: 500 },
    P: { min: 0, max: 300 },
    K: { min: 0, max: 500 },
    pH: { min: 0, max: 14 },
    EC: { min: 0, max: 10 },
    OC: { min: 0, max: 10 },
    S: { min: 0, max: 200 },
    Fe: { min: 0, max: 100 },
    Zn: { min: 0, max: 50 },
    Mn: { min: 0, max: 100 },
    Cu: { min: 0, max: 50 }
  };
  const [result, setResult] = useState(null);
  const getBarColor = (name, value) => {
    const num = parseFloat(value);
    if (isNaN(num)) return "#93c5fd";

    // 🔥 pH special case
    if (name === "pH") {
      if (num < 6.5) return "#ef4444";   // acidic 🔴
      if (num <= 7.5) return "#22c55e";  // neutral 🟢
      return "#facc15";                  // basic 🟡
    }

    const range = nutrientRanges[name];
    if (!range) return "#93c5fd";

    const min = range.min;
    const max = range.max;

    const lowThreshold = min + (max - min) * 0.3;
    const highThreshold = min + (max - min) * 0.7;

    if (num < lowThreshold) return "#ef4444";   // 🔴 LOW
    if (num > highThreshold) return "#22c55e";  // 🟢 HIGH
    return "#facc15";                           // 🟡 MEDIUM
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    const numValue = parseFloat(value);

    // check if range exists
    if (nutrientRanges[name]) {
      const { min, max } = nutrientRanges[name];

      if (numValue < min || numValue > max) {
        toast.warning(`Enter value between ${min} - ${max}` , { toastId: name });
        return; // stop update
      }
    }

    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("https://agrismart-ai-powered-crop-recommendation.onrender.com/api/users/soil-health/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    });

    const data = await res.json();
    const score = data.soil_health;

    const getCategory = (score) => {
      if (score > 70) return "Good";
      if (score > 40) return "Moderate";
      return "Poor";
    };

    const suggestions = [];
    const deficiencies = [];

    if (formData.N < 50) {
      deficiencies.push("Nitrogen Low");
      suggestions.push("Add urea or compost for Nitrogen");
    }

    if (formData.P < 30) {
      deficiencies.push("Phosphorus Low");
      suggestions.push("Use DAP fertilizer");
    }

    if (formData.K < 30) {
      deficiencies.push("Potassium Low");
      suggestions.push("Add potash fertilizer");
    }

    if (formData.pH < 6.5) {
      suggestions.push("Add lime to reduce acidity");
    }

    if (formData.pH > 7.5) {
      suggestions.push("Use gypsum to reduce alkalinity");
    }

    setResult({
      shi: score,
      category: getCategory(score),
      deficiencies,
      suggestions
    });
  };
  return (
    <div className="crop-container">

      {/* FORM */}
      <div className="crop-card-ui">
        <div className="crop-description">
            <h4>🌿 Soil Health Analysis Guide</h4>

            <p>
              This tool helps you analyze the health and quality of your soil based on
              essential nutrients and micronutrients.
            </p>

            <ul>
              <li>Enter values for nutrients like Nitrogen (N), Phosphorus (P), Potassium (K), and pH.</li>
              <li>Add micronutrients such as Iron, Zinc, Copper, and others for detailed analysis.</li>
              <li>Click <strong>"Analyze Soil"</strong> to evaluate your soil condition.</li>
            </ul>

            <p>
              📊 <strong>Output:</strong> You will get insights about soil health, nutrient levels, 
              and possible deficiencies.
            </p>

            <p>
              🌱 This helps you understand what your soil lacks and how to improve it for better crop yield.
            </p>
          </div>
        <h5 className="crop-title">🌱 Soil Health Analysis</h5>

        <form onSubmit={handleSubmit}>

          <div className="form-grid">

  <div className="form-group">
    <label>Nitrogen<span className="unit">(kg/ha)</span></label>
    <input type="number" name="N" min="0" max="500" onChange={handleChange} required />
  </div>

  <div className="form-group">
    <label>Phosphorus<span className="unit">(kg/ha)</span></label>
    <input type="number" name="P" min="0" max="300" onChange={handleChange} required />
  </div>

  <div className="form-group">
    <label>Potassium<span className="unit">(kg/ha)</span></label>
    <input type="number" name="K" min="0" max="500" onChange={handleChange} required />
  </div>

  <div className="form-group">
    <label>pH<span className="unit">(0-14)</span></label>
    <input type="number" step="0.1" name="pH" min="0" max="14" onChange={handleChange} required />
  </div>

  <div className="form-group">
    <label>EC<span className="unit">(dS/m)</span></label>
    <input type="number" step="0.01" name="EC" min="0" max="10" onChange={handleChange} required />
  </div>

  <div className="form-group">
    <label>Organic Carbon<span className="unit">(%)</span></label>
    <input type="number" step="0.01" name="OC" min="0" max="10" onChange={handleChange} required />
  </div>

  <div className="form-group">
    <label>Sulphur<span className="unit">ppm</span></label>
    <input type="number" step="0.1" name="S" min="0" max="200" onChange={handleChange} required />
  </div>

  <div className="form-group">
    <label>Iron<span className="unit">ppm</span></label>
    <input type="number" step="0.01" name="Fe" min="0" max="100" onChange={handleChange} required />
  </div>

  <div className="form-group">
    <label>Zinc<span className="unit">ppm</span></label>
    <input type="number" step="0.01" name="Zn" min="0" max="50" onChange={handleChange} required />
  </div>

  <div className="form-group">
    <label>Manganese<span className="unit">ppm</span></label>
    <input type="number" step="0.01" name="Mn" min="0" max="100" onChange={handleChange} required />
  </div>

  <div className="form-group">
    <label>Copper<span className="unit">ppm</span></label>
    <input type="number" step="0.01" name="Cu" min="0" max="50" onChange={handleChange} required />
  </div>

</div>

          <button className="crop-btn">Analyze Soil</button>

        </form>
      </div>

      {/* RESULT */}
      {result && (
      <div className="result-section fade-in">

        {/* 🔹 TOP ROW (2 cards) */}
        <div className="top-result">

          {/* GAUGE */}
          <div className="crop-card-ui inner-card">
            <h5>🌱 Soil Health Index</h5>

            <Plot
              data={[{
                type: "indicator",
                mode: "gauge+number",
                value: result.shi,
                title: { text: "Soil Health Index" },
                gauge: {
                  axis: { range: [0, 100] },
                  bar: { color: "#2e7d32" },
                  steps: [
                    { range: [0, 40], color: "#ef5350" },
                    { range: [40, 70], color: "#ffa726" },
                    { range: [70, 100], color: "#66bb6a" }
                  ]
                }
              }]}
              layout={{ autosize: true, height: 220, margin: { t: 30, b: 20, l: 20, r: 20 } }}
              useResizeHandler={true}
              style={{ width: "100%" }}
            />
          </div>

          {/* GRAPH */}
          <div className="crop-card-ui inner-card">
            <h5>📊 Nutrient Overview</h5>
            <div style={{ fontSize: "12px", marginBottom: "10px" }}>
                🔴 Low &nbsp;&nbsp; 🟡 Normal &nbsp;&nbsp; 🟢 High
              </div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="value"
                  fill="#8884d8"
                  shape={(props) => {
                    const { x, y, width, height, payload } = props;

                    const color = getBarColor(payload.name, payload.value);

                    return (
                      <rect
                        x={x}
                        y={y}
                        width={width}
                        height={height}
                        fill={color}
                      />
                    );
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

        </div>

        {/* 🔹 BOTTOM ROW (3 cards) */}
        <div className="bottom-result-3">

          {/* CATEGORY */}
          <div className="crop-card-ui inner-card">
            <h5>📊 Category Insight</h5>
            <p><strong>{result.category}</strong></p>
            <p>
              {result.category === "Good"
                ? "Soil is healthy 🌱"
                : result.category === "Moderate"
                ? "Needs improvement ⚠️"
                : "Poor condition ❌"}
            </p>
          </div>

          {/* DEFICIENCY */}
          <div className="crop-card-ui inner-card">
            <h5>⚠ Nutrient Deficiencies</h5>
            {result.deficiencies?.length > 0 ? (
              <div className="badge-container">
                {result.deficiencies.map((item, i) => (
                  <span key={i} className="badge red">⚠ {item}</span>
                ))}
              </div>
            ) : (
              <span className="badge green">✅ No Deficiencies</span>
            )}
          </div>

          {/* SUGGESTIONS */}
          <div className="crop-card-ui inner-card">
            <h5>🌿 Suggestions</h5>

            {result.suggestions?.map((tip, i) => (
              <p key={i}>🌿 {tip}</p>
            ))}
          </div>

        </div>

      </div>
    )}

    </div>
  );
}

export default SoilHealthUI;