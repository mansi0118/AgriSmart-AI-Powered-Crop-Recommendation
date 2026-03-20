import React, { useEffect, useState } from "react";
import { Sun, Cloud, Wind, Eye, Gauge, CloudRain, Thermometer } from "lucide-react";
import "./Weather.css";

const Weather = () => {
  const [weather, setWeather] = useState(null);
  const API_KEY = process.env.REACT_APP_WEATHER_API_KEY || "YOUR_API_KEY_HERE"; 
  const CITY = "Kasganj";
  const COUNTRY = "IN";

  useEffect(() => {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${CITY},${COUNTRY}&units=metric&appid=${API_KEY}`
    )
      .then((res) => res.json())
      .then((data) => setWeather(data))
      .catch((err) => console.log("Weather Fetch Error:", err));
  }, [API_KEY]);

  if (!weather || !weather.main) {
    return <div className="flex items-center justify-center min-h-screen text-green-700 font-bold">Loading Agri-Weather Data...</div>;
  }

  const { temp, humidity, pressure, feels_like } = weather.main;
  const wind = weather.wind.speed;
  const visibility = weather.visibility / 1000;
  const condition = weather.weather[0].main;
  const description = weather.weather[0].description;

  const getAdvice = (t) => {
    if (t < 20) return "Cool weather 🌾 - Ideal for wheat sowing in Kasganj.";
    if (t > 35) return "High temperature ☀️ - Increase irrigation to prevent crop stress.";
    return "Normal conditions ✅ - Good for general field maintenance.";
  };

  return (
    <div className="min-h-screen bg-[#f8f5f0] p-8 font-sans">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Weather Forecast</h1>
        <p className="text-gray-500">{CITY}, Uttar Pradesh</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Weather Card */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#7da07d] rounded-[2rem] p-10 text-white relative overflow-hidden shadow-xl">
            <div className="relative z-10 flex justify-between items-start">
              <div>
                <p className="text-lg opacity-90">{new Date().toDateString()}</p>
                <div className="flex items-start mt-4">
                  <span className="text-8xl font-light">{Math.round(temp)}°</span>
                  <div className="mt-4 ml-6">
                    <h2 className="text-3xl font-semibold capitalize">{condition}</h2>
                    <p className="opacity-80">Feels like {Math.round(feels_like)}°C</p>
                  </div>
                </div>
              </div>
              <Sun size={120} className="text-yellow-100 opacity-80" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 pt-8 border-t border-white/20">
              <WeatherStat icon={<Cloud size={20} />} label="Humidity" value={`${humidity}%`} />
              <WeatherStat icon={<Wind size={20} />} label="Wind" value={`${wind} m/s`} />
              <WeatherStat icon={<Eye size={20} />} label="Visibility" value={`${visibility} km`} />
              <WeatherStat icon={<Gauge size={20} />} label="Pressure" value={`${pressure} hPa`} />
            </div>
          </div>

          {/* Detailed Overview */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-700 mb-6">Live Parameters</h3>
            <div className="flex flex-wrap gap-4 justify-between">
               <div className="text-center p-4 bg-gray-50 rounded-2xl min-w-[100px]">
                  <p className="text-xs text-gray-400 uppercase font-bold mb-2">Condition</p>
                  <p className="font-bold text-green-700 capitalize">{description}</p>
               </div>
               <div className="text-center p-4 bg-gray-50 rounded-2xl min-w-[100px]">
                  <p className="text-xs text-gray-400 uppercase font-bold mb-2">Sunrise</p>
                  <p className="font-bold text-gray-700">{new Date(weather.sys.sunrise * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
               </div>
               <div className="text-center p-4 bg-gray-50 rounded-2xl min-w-[100px]">
                  <p className="text-xs text-gray-400 uppercase font-bold mb-2">Sunset</p>
                  <p className="font-bold text-gray-700">{new Date(weather.sys.sunset * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
               </div>
            </div>
          </div>
        </div>

        {/* Side Panel - Farming Advisory */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-6">
              <span className="p-2 bg-orange-50 text-orange-500 rounded-lg"><Thermometer size={20}/></span>
              <h3 className="font-bold">Farming Impact</h3>
            </div>
            
            <div className="space-y-4">
              <ImpactCard 
                title="Current Advisory" 
                desc={getAdvice(temp)} 
                color="green" 
              />
              <ImpactCard 
                title="Irrigation Alert" 
                desc={humidity < 40 ? "Low humidity detected. Check soil moisture levels." : "Humidity levels are stable for current crops."} 
                color="blue" 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Internal Components
const WeatherStat = ({ icon, label, value }) => (
  <div className="flex items-center gap-3">
    <div className="opacity-70">{icon}</div>
    <div>
      <p className="text-[10px] opacity-70 uppercase tracking-wider">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  </div>
);

const ImpactCard = ({ title, desc, color }) => {
  const colors = {
    green: "bg-green-50 border-green-100 text-green-700",
    blue: "bg-blue-50 border-blue-100 text-blue-700",
    orange: "bg-orange-50 border-orange-100 text-orange-700"
  };
  return (
    <div className={`p-4 rounded-xl border ${colors[color]}`}>
      <h4 className="font-bold text-sm mb-1">{title}</h4>
      <p className="text-[11px] opacity-80 leading-relaxed">{desc}</p>
    </div>
  );
};

export default Weather;