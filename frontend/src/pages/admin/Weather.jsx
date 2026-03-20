<<<<<<< HEAD
import React from 'react';
import { Layout, Cloud, Wind, Eye, Gauge, Sun, Moon, Map, MessageSquare, Settings, LayoutDashboard, CloudRain } from 'lucide-react';

const AgriSenseDashboard = () => {
  return (
    <div className="flex min-h-screen bg-[#f8f5f0] font-sans text-gray-800">
      {/* Sidebar */}
      <aside className="w-64 bg-white p-6 border-r border-gray-200">
        <div className="flex items-center gap-2 mb-10">
          <div className="bg-[#7da07d] p-2 rounded-lg">
            <Cloud className="text-white w-5 h-5" />
          </div>
          <span className="text-xl font-bold text-[#4a6b4a]">AgriSense</span>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl p-4 mb-8 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center font-bold text-orange-600">RS</div>
            <div>
              <h4 className="font-bold text-sm">Ramesh Singh</h4>
              <p className="text-xs text-gray-500">Kasganj, UP</p>
            </div>
          </div>
          <span className="inline-block mt-3 px-3 py-1 bg-green-50 text-green-600 text-[10px] rounded-full border border-green-100">
            ● Active field
          </span>
        </div>

        <nav className="space-y-2 text-gray-500">
          <NavItem icon={<LayoutDashboard size={18} />} label="Dashboard" />
          <NavItem icon={<Cloud size={18} />} label="Weather" active />
          <NavItem icon={<Map size={18} />} label="Field Map" />
          <NavItem icon={<CloudRain size={18} />} label="Crop Suggestions" />
          <NavItem icon={<Settings size={18} />} label="Settings" />
        </nav>

        <div className="mt-10">
          <h5 className="text-xs font-bold text-orange-500 mb-4 tracking-wider uppercase">Agri News</h5>
          <ul className="text-xs space-y-4 text-gray-600">
            <li className="border-l-2 border-orange-200 pl-3">IMD predicts normal monsoon this season</li>
            <li className="border-l-2 border-orange-200 pl-3">Govt revises MSP for wheat by 7%</li>
          </ul>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Weather Forecast</h1>
          <p className="text-gray-500">Kasganj, Uttar Pradesh</p>
        </header>

        <div className="grid grid-cols-3 gap-6">
          {/* Main Weather Card */}
          <div className="col-span-2 space-y-6">
            <div className="bg-[#7da07d] rounded-[2rem] p-10 text-white relative overflow-hidden shadow-xl">
              <div className="relative z-10 flex justify-between items-start">
                <div>
                  <p className="text-lg opacity-90">Today, December 15</p>
                  <div className="flex items-start mt-4">
                    <span className="text-8xl font-light">28°</span>
                    <div className="mt-4 ml-6">
                      <h2 className="text-3xl font-semibold">Partly Cloudy</h2>
                      <p className="opacity-80">Feels like 30°C</p>
                    </div>
                  </div>
                </div>
                <Sun size={120} className="text-yellow-100 opacity-80" />
              </div>

              <div className="grid grid-cols-4 gap-4 mt-12 pt-8 border-t border-white/20">
                <WeatherStat icon={<Cloud size={20} />} label="Humidity" value="65%" />
                <WeatherStat icon={<Wind size={20} />} label="Wind" value="12 km/h" />
                <WeatherStat icon={<Eye size={20} />} label="Visibility" value="10 km" />
                <WeatherStat icon={<Gauge size={20} />} label="Pressure" value="1015 hPa" />
              </div>
            </div>

            {/* Hourly Forecast */}
            <div className="bg-white rounded-3xl p-8 shadow-sm">
              <h3 className="font-bold mb-6">Today's Forecast</h3>
              <div className="flex justify-between">
                <HourlyItem time="6 AM" temp="18°" icon={<Sun size={20} />} />
                <HourlyItem time="9 AM" temp="22°" icon={<Sun size={20} />} />
                <HourlyItem time="12 PM" temp="28°" icon={<Sun size={20} />} />
                <HourlyItem time="3 PM" temp="30°" icon={<Cloud size={20} />} active />
                <HourlyItem time="6 PM" temp="26°" icon={<Cloud size={20} />} />
                <HourlyItem time="9 PM" temp="22°" icon={<Cloud size={20} />} />
              </div>
            </div>
          </div>

          {/* Side Panels */}
          <div className="space-y-6">
            {/* Farming Impact */}
            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <span className="p-2 bg-orange-50 text-orange-500 rounded-lg">🌡️</span>
                <h3 className="font-bold">Farming Impact</h3>
              </div>
              
              <div className="space-y-4">
                <ImpactCard title="Ideal for Sowing" desc="Current conditions are good for wheat sowing activities." color="green" />
                <ImpactCard title="Rain Alert" desc="Postpone irrigation - rain expected Wed-Thu." color="blue" />
                <ImpactCard title="Harvest Advisory" desc="Complete harvest before Wednesday rainfall." color="orange" />
              </div>
            </div>

            {/* Sun & Moon */}
            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <h3 className="font-bold mb-4">Sun & Moon</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-orange-50 p-4 rounded-2xl text-center">
                  <p className="text-xs text-gray-500 mb-1">Sunrise</p>
                  <p className="font-bold">6:45 AM</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl text-center">
                  <p className="text-xs text-gray-500 mb-1">Sunset</p>
                  <p className="font-bold">5:30 PM</p>
                </div>
=======
import React, { useEffect, useState } from "react";
import { Sun, Cloud, Wind, Eye, Gauge } from "lucide-react";
import "./Weather.css"; // 👈 make sure this file is linked

const Weather = () => {
  const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
  const CITY = "Kasganj";
  const COUNTRY = "IN";

  const [weather, setWeather] = useState(null);

  useEffect(() => {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${CITY},${COUNTRY}&units=metric&appid=${API_KEY}`
    )
      .then((res) => res.json())
      .then((data) => setWeather(data))
      .catch((err) => console.log(err));
  }, [API_KEY]);

  if (!weather) return <div className="weather-page">Loading...</div>;

  const { temp, humidity, pressure } = weather.main;
  const wind = weather.wind.speed;
  const visibility = weather.visibility / 1000;
  const condition = weather.weather[0].description;

  return (
    <div className="weather-page">
      <h1 className="title">Live Weather - {CITY}</h1>
      <p className="location">{condition}</p>

      <div className="weather-grid">
        {/* LEFT SIDE */}
        <div>
          <div className="today-card">
            <div>
              <p className="date">{new Date().toDateString()}</p>
              <div className="temp-row">
                <h2>{temp}°C</h2>
                <div>
                  <div className="condition">{condition}</div>
                  <small>Feels like {weather.main.feels_like}°C</small>
                </div>
              </div>

              <div className="stats">
                <div>Humidity<br /><strong>{humidity}%</strong></div>
                <div>Wind<br /><strong>{wind} m/s</strong></div>
                <div>Pressure<br /><strong>{pressure} hPa</strong></div>
                <div>Visibility<br /><strong>{visibility} km</strong></div>
              </div>
            </div>

            <Sun className="sun" />
          </div>

          {/* Hourly placeholder */}
          <div className="hourly-box">
            <h3>Today's Overview</h3>
            <div className="hours">
              <div className="hour active">Temp<br /><strong>{temp}°</strong></div>
              <div className="hour">Humidity<br /><strong>{humidity}%</strong></div>
              <div className="hour">Wind<br /><strong>{wind}</strong></div>
              <div className="hour">Pressure<br /><strong>{pressure}</strong></div>
              <div className="hour">Visibility<br /><strong>{visibility}</strong></div>
              <div className="hour">{condition}</div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="side-panel">
          <div className="impact green">
            <strong>Farming Advisory</strong>
            <p>{getAdvice(temp)}</p>
          </div>

          <div className="sun-moon">
            <h3>Sun & Moon</h3>
            <div className="sun-box">
              <div>
                <small>Sunrise</small>
                <strong>{formatTime(weather.sys.sunrise)}</strong>
              </div>
              <div>
                <small>Sunset</small>
                <strong>{formatTime(weather.sys.sunset)}</strong>
>>>>>>> 95c727f253994a2f5f16730bfb9833d553f646d4
              </div>
            </div>
          </div>
        </div>
<<<<<<< HEAD
      </main>
=======
      </div>
>>>>>>> 95c727f253994a2f5f16730bfb9833d553f646d4
    </div>
  );
};

<<<<<<< HEAD
// Sub-components for cleaner code
const NavItem = ({ icon, label, active = false }) => (
  <div className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${active ? 'bg-[#f1f5f1] text-[#4a6b4a] font-semibold' : 'hover:bg-gray-50'}`}>
    {icon} <span>{label}</span>
  </div>
);

const WeatherStat = ({ icon, label, value }) => (
  <div className="flex items-center gap-3">
    <div className="opacity-70">{icon}</div>
    <div>
      <p className="text-[10px] opacity-70 uppercase tracking-wider">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  </div>
);

const HourlyItem = ({ time, temp, icon, active = false }) => (
  <div className={`flex flex-col items-center p-4 rounded-2xl min-w-[80px] ${active ? 'bg-[#f8f5f0] border border-gray-100' : ''}`}>
    <p className="text-xs text-gray-400 mb-3 uppercase font-semibold">{time}</p>
    <div className="text-orange-400 mb-3">{icon}</div>
    <p className="font-bold text-lg">{temp}</p>
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

export default AgriSenseDashboard;
=======
const getAdvice = (temp) => {
  if (temp < 20) return "Cool weather 🌾 - Ideal for wheat sowing.";
  if (temp > 35) return "High temperature ☀ - Ensure irrigation.";
  return "Normal farming conditions ✅";
};

const formatTime = (timestamp) => {
  return new Date(timestamp * 1000).toLocaleTimeString();
};

export default Weather;
>>>>>>> 95c727f253994a2f5f16730bfb9833d553f646d4
