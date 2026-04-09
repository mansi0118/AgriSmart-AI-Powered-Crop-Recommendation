# Agrismart Project
AgriSmart – Smart Agriculture Decision Support System

AgriSmart is an AI-powered web application designed to help farmers and users make data-driven agricultural decisions using machine learning models, soil analysis, and real-time weather data.

The system integrates multiple ML models with a full-stack architecture (React + Django) to provide accurate crop suggestions and soil insights.

Features:
🌾 Crop Recommendation System
🌱 Soil Health Analysis
🧪 Nutrient Classification (Low / Medium / High)
🌍 Location-Based Weather Data
📊 Interactive Dashboard
🔐 Secure Authentication System
🧑‍🔬 Researcher Module (Data Management & Delete Functionality)

🤖 Machine Learning Models

1. Crop Recommendation Model
Predicts the most suitable crops based on:
Nitrogen (N), Phosphorus (P), Potassium (K)
pH value
Temperature, Humidity, Rainfall
Returns top crop suggestions with confidence score

2. Soil Health Analysis Model
Evaluates soil fertility using NPK values
Helps users understand overall soil condition

3. Nutrient Classification Model
Classifies nutrients into:
🔴 Low
🟡 Medium
🟢 High
Provides easy interpretation and guidance

4. Season-Based Model
Suggests crops based on seasonal patterns
Uses dataset: seasoncrop.csv

🛠️ Tech Stack

Frontend: React.js, CSS, Axios
Backend: Django, Django REST Framework
Machine Learning: Python, Scikit-learn, Pandas, NumPy

📂 Project Structure
AgriSmart/
│
├── frontend/                  # React Frontend
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── .env
│
├── dhurandar/
│   ├── backend/              # Django Backend
│   │   ├── accounts/
│   │   ├── users/
│   │   ├── backend/
│   │   ├── manage.py
│   │   └── .env
│   │
│   ├── crop_ml/              # ML Models & Scripts
│   │   ├── models/
│   │   ├── app.py
│   │   ├── health.py
│   │   ├── nutrient.ipynb
│   │   ├── Soil_health.ipynb
│   │   ├── season_model.ipynb
│   │   ├── seasoncrop.csv
│   │   ├── soil_health_data.csv
│   │   └── requirements.txt
│
└── README.md

⚙️ Installation & Setup
🔹 1. Clone Repository
git clone https://github.com/mansi0118/AGRISMART.git
cd AGRISMART

🔹 2. Backend Setup
cd dhurandar/backend

python -m venv venv
venv\Scripts\activate

pip install django djangorestframework

python manage.py migrate
python manage.py runserver

🔹 3. ML Model Setup
cd dhurandar/crop_ml

python -m venv venv
venv\Scripts\activate

pip install -r requirements.txt

python app.py

🔹 4. Frontend Setup
cd frontend

npm install
npm start

🔑 Environment Variables
Backend (.env)
EMAIL_HOST_USER=jeeya.dhiman.2006@gmail.com
EMAIL_HOST_PASSWORD=ferz kxin pysg fugl
DEBUG=True

Frontend (.env)
REACT_APP_WEATHER_API_KEY=565227bc4b19f8044ab2bd151685553c

ML model(.env)
WEATHER_API_KEY=565227bc4b19f8044ab2bd151685553c
GEOCODE_API_KEY=6b8358951f344f7eaf5229cb9011c627

⚙️ Working Flow
User enters soil data or selects a field
System fetches weather data using location
Backend processes inputs
ML models generate:
Crop recommendations
Soil health insights
Nutrient classification
Results displayed on dashboard

📊 Future Scope
📱 Mobile Application
🌾 Crop Disease Prediction
📈 Market Price Prediction
🛰️ Satellite-Based Monitoring
🌐 Multi-language Support

👩‍💻 Contributors
Mansi Tiwari
Neha Saraswat
Jeeya Dhiman
Jiya
Nandini Rathore

📜 License

This project is licensed under the MIT License.

📬 Contact

📧 mansitiwari1210@gmail.com
📧 jeeya.dhiman.2006@gmail.com

🔗 https://github.com/mansi0118/AGRISMART
