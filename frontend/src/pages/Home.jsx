import React from "react";
import "./Home.css";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="agrismart">
      {/* ====== HERO SECTION ====== */}
      <section className="hero">
        <div className="container">
          <h4 className="tagline">Smart Precision, Better Harvests</h4>
          <h1>
            Agri Made Easy: <span className="highlight"> Next-Gen Farming</span>
          </h1>
          <p className="subtitle">
            Harnessing AI to recommend the best crops for your farm, plan nutrients and irrigation smartly, 
            and make data-driven decisions for healthier, higher-yielding harvests—tailored to your unique soil and climate
          </p>

          <div className="hero-buttons">
            <Link to="/login">
              <button className="primary">Get Started</button>
            </Link>

            {/* ✅ FIXED: /user/dashboard → /guest/dashboard */}
            <Link to="/guest/dashboard">
              <button className="secondary">Use as Guest</button>
            </Link>
          </div>
        </div>
      </section>

      {/* ====== INSIGHTS SECTION ====== */}
      <section className="insights">
        <div className="container">
          <h2>Agricultural Insights</h2>
          <p className="subtitle">
            Our platform combines location intelligence, crop science, and
            market data to provide actionable recommendations for modern
            agriculture.
          </p>

          <div className="cards">
            <div className="card">
              <h3>Precision Location Analysis</h3>
              <p>
                Get location-specific crop recommendations based on soil
                conditions, climate, and geography.
              </p>
            </div>
            <div className="card">
              <h3>Smart Crop Recommendations</h3>
              <p>
                AI-powered suggestions for optimal crops based on your specific
                conditions and market demand.
              </p>
            </div>
            <div className="card">
              <h3>Nutrient & Soil Management</h3>
              <p>
                Get AI-driven guidance on soil nutrient balancing to improve
                yields and reduce input costs.
              </p>
            </div>
            <div className="card">
              <h3>Soil Insights</h3>
              <p>
                Comprehensive nutritional data including soil health metrics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ====== ABOUT US SECTION ====== */}
      <section className="about">
        <div className="container">
          <p className="about-text">
            <b>"Grow the right crop, at the right place, at the right time."</b>
            <br /><br />
            AgriSmart is an AI-powered crop recommendation system designed to make farming smarter and easier. 
            By simply clicking on a map, users can instantly get the best crop suggestions and soil nutrient insights 
            for their specific location. The platform also provides recommendations on how to balance soil nutrients 
            for better fertility and yield. With role-based access for guests, users, researchers, and admins, 
            AgriSmart ensures reliable data, secure usage, and sustainable agricultural practices.
          </p>
        </div>
      </section>

      {/* ====== CHOOSE YOUR ROLE SECTION ====== */}
      <section className="roles">
        <div className="container">
          <h2>Choose Your Role</h2>
          <p className="subtitle">
            Access tailored features and insights designed for your specific
            agricultural needs and expertise level.
          </p>

          <div className="cards roles-cards">
            <div className="card">
              <h3>Researcher</h3>
              <p>
                Access advanced analytics and contribute to agricultural
                research.
              </p>
            </div>

            <div className="card">
              <h3>Administrator</h3>
              <p>Manage platform data and oversee agricultural programs.</p>
            </div>

            <div className="card">
              <h3>User</h3>
              <p>
                Get personalized crop and nutrient recommendations (Professional
                mode).
              </p>
            </div>

            <div className="card">
              <h3>Guest</h3>
              <p>Explore public data and platform capabilities.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ====== FOOTER ====== */}
      <footer className="footer">
        <div className="container">
          <p>© 2025 AgriSmart - AI crop recommending platform.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;