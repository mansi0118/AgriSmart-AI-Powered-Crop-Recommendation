import React, { useEffect, useState } from "react";
import "./Weather.css";

const Weather = () => {
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState("Kasganj");
  const [inputCity, setInputCity] = useState("");

  const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

  useEffect(() => {
    fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city},IN&units=metric&appid=${API_KEY}`
    )
      .then((res) => res.json())
      .then((data) => setWeather(data))
      .catch((err) => console.log(err));
  }, [city]);

  const handleUseLocation = () => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;

      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`
      );
      const data = await res.json();
      setWeather(data);
      setCity(data.city.name);
    });
  };

  if (!weather) return <div className="loading">Loading...</div>;

  if (weather.cod !== "200") {
    return <div className="loading">❌ {weather.message}</div>;
  }

  const current = weather.list[0];
  const desc = current.weather[0].description;
  const { temp, humidity, pressure } = current.main;
  const wind = current.wind.speed;
  const visibility = current.visibility / 1000;
  const condition = current.weather[0].main;

  const hourlyData = weather.list.slice(0, 8);

  const dailyData = weather.list.filter((item) =>
    item.dt_txt.includes("12:00:00")
  );

  // 🌦 Emoji
  const getEmoji = (desc) => {
  const d = desc.toLowerCase();

    if (d.includes("thunderstorm")) return "⛈️";
    if (d.includes("heavy intensity rain")) return "🌧️🌧️";
    if (d.includes("rain")) return "🌧️";

    if (d.includes("overcast")) return "☁️";
    if (d.includes("broken clouds")) return "☁️";
    if (d.includes("few clouds") || d.includes("scattered"))
      return "🌤️";

    if (d.includes("clear")) return "☀️";

    return "🌤️";
  };
    const getWeatherType = () => {
    const desc = current.weather[0].description.toLowerCase();

    if (desc.includes("thunderstorm")) return "thunder";
    if (desc.includes("heavy intensity rain")) return "heavy-rain";
    if (desc.includes("rain")) return "rain";

    if (desc.includes("overcast")) return "heavy-clouds";
    if (desc.includes("broken clouds")) return "cloudy";
    if (desc.includes("scattered clouds") || desc.includes("few clouds"))
      return "partly-cloudy";

    if (desc.includes("clear")) return "clear";

    return "clear"; // fallback
  };
  
  const weatherType = getWeatherType();

  return (
    <div className={`weather-page ${weatherType}`}>

      <div className="weather-container">

        {/* 🔍 Search */}
        <div className="search-box">
          <input
            type="text"
            placeholder="Enter city..."
            value={inputCity}
            onChange={(e) => setInputCity(e.target.value)}
          />
          <button onClick={() => setCity(inputCity)}>Search</button>
          <button onClick={handleUseLocation} className="location-btn">
            📍 Use My Location
          </button>
        </div>

        <h2>{city}</h2>

        {/* 🌤 Current */}
        <div className="current">
          <h1>
            {getEmoji(desc)} {Math.round(temp)}°C
          </h1>
          <p>{desc}</p>
        </div>

        {/* 📊 Stats */}
        <div className="stats-grid">
          <Stat icon="💧" label="Humidity" value={`${humidity}%`} />
          <Stat icon="🌬️" label="Wind" value={`${wind} m/s`} />
          <Stat icon="👁️" label="Visibility" value={`${visibility} km`} />
          <Stat icon="📊" label="Pressure" value={`${pressure}`} />
        </div>

        {/* ⏰ Hourly */}
        <h3>Hourly Forecast</h3>
        <div className="hourly">
          {hourlyData.map((item, i) => (
            <div key={i} className="hour-card">
              <p>{new Date(item.dt_txt).getHours()}:00</p>
              <p>{getEmoji(item.weather[0].main)}</p>
              <p>{Math.round(item.main.temp)}°C</p>
              <p>{item.main.humidity}%</p>
            </div>
          ))}
        </div>

        {/* 📅 Weekly */}
        <h3>Next Days</h3>
        <div className="weekly">
          {dailyData.map((day, i) => (
            <div key={i} className="day-card">
              <p>{new Date(day.dt_txt).toDateString()}</p>
              <p>{getEmoji(day.weather[0].main)}</p>
              <p>{Math.round(day.main.temp)}°C</p>
              <p>{day.weather[0].main}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

const Stat = ({ icon, label, value }) => (
  <div className="stat-box">
    <p style={{ fontSize: "20px" }}>{icon}</p>
    <p>{label}</p>
    <p>{value}</p>
  </div>
);

export default Weather;