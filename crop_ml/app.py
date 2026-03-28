from flask import Flask, request, jsonify
import numpy as np
import requests
import os
from dotenv import load_dotenv
import pandas as pd
import joblib
from flask_cors import CORS
import psycopg
import urllib3
import time
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

city_cache = {}
# ---------------------------------
# INIT
# ---------------------------------
load_dotenv()

app = Flask(__name__)
CORS(app)
try:
    conn = psycopg.connect("postgresql://neondb_owner:npg_o9aPVFSl6veQ@ep-dawn-wave-ai5lexdl-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=disable")
    conn.autocommitt = True
    print("✅ Connected")
except Exception as e:
    print("❌ Error:", e)

# ---------------------------------
# LOAD MODELS
# ---------------------------------
season_model = joblib.load("models/season_model.pkl")

soil_model = joblib.load("models/soil_health_model.pkl")
nutrient_model = joblib.load("models/nutrient_deficiency_model.pkl")
scaler = joblib.load("models/soil_scaler.pkl")

# crop labels
crop_labels = ['groundnut', 'maize', 'mustard', 'pea', 'pearl millet', 'potato', 'rice']

# ---------------------------------
# WEATHER API
# ---------------------------------
def get_weather(lat, lon):
    api_key = os.getenv("WEATHER_API_KEY")

    if not api_key:
        return None, None

    url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={api_key}&units=metric"

    try:
        res = requests.get(url,timeout=5)
        data = res.json()

        if res.status_code != 200:
            return None, None

        temp = data["main"]["temp"]
        humidity = data["main"]["humidity"]

        return temp, humidity

    except:
        return None, None

def get_weather_by_city(city):
    api_key = os.getenv("WEATHER_API_KEY")

    url = f"https://api.openweathermap.org/data/2.5/weather?q={city}&appid={api_key}&units=metric"

    try:
        res = requests.get(url,timeout=5)
        data = res.json()

        if res.status_code != 200:
            print("WEATHER API ERROR:", data)
            return None, None

        temp = data["main"]["temp"]
        humidity = data["main"]["humidity"]

        return temp, humidity

    except Exception as e:
        print("WEATHER ERROR:", e)
        return None, None

def get_rainfall_forecast(lat, lon):
    api_key = os.getenv("WEATHER_API_KEY")

    url = f"https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={api_key}&units=metric"

    try:
        res = requests.get(url,timeout=5)
        data = res.json()

        if res.status_code != 200:
            return None

        total_rain = 0

        for item in data["list"]:
            rain = item.get("rain", {}).get("3h", 0)
            total_rain += rain

        return total_rain

    except:
        return None
    
def get_rainfall_forecast_by_city(city):
    api_key = os.getenv("WEATHER_API_KEY")

    url = f"https://api.openweathermap.org/data/2.5/forecast?q={city}&appid={api_key}&units=metric"

    try:
        res = requests.get(url,timeout=5)
        data = res.json()

        if res.status_code != 200:
            print("RAIN API ERROR:", data)
            return None

        total_rain = 0

        for item in data.get("list", []):
            rain = item.get("rain", {}).get("3h", 0)
            total_rain += rain

        return total_rain   # next 5 days rainfall

    except Exception as e:
        print("RAIN ERROR:", e)
        return None
    
#converting lat long into city
def get_city_from_coords(lat, lon):
    url = "https://nominatim.openstreetmap.org/reverse"

    params = {
        "format": "json",
        "lat": lat,
        "lon": lon
    }

    headers = {
        "User-Agent": "AgriSmartApp (mansi@gmail.com)"
    }

    # 🔁 retry system (important)
    for i in range(3):
        try:
            res = requests.get(
                url,
                params=params,
                headers=headers,
                timeout=5,
                verify=False   # 🔥 SSL bypass
            )

            data = res.json()
            print("DATA:", data)

            address = data.get("address", {})

            # 🔥 best possible name
            city = (
                address.get("city") or
                address.get("town") or
                address.get("village") or
                address.get("suburb") or
                address.get("county") or
                address.get("state_district") or
                address.get("state")
            )

            # 🔥 fallback using display_name
            if not city:
                display = data.get("display_name", "")
                if display:
                    city = display.split(",")[0]

            if city:
                return city

        except Exception as e:
            print(f"Retry {i+1} failed:", e)
            time.sleep(1)

    # 🔥 final fallback
    return "Nearby Area"

def get_city_cached(lat, lon):
    key = f"{round(lat,4)},{round(lon,4)}"   # 🔥 rounding important

    if key in city_cache:
        print("CACHE HIT ✅")
        return city_cache[key]

    print("API CALL 🌐")
    city = get_city_from_coords(lat, lon)

    city_cache[key] = city
    return city
# ---------------------------------
# FEATURE BUILDER
# ---------------------------------
def build_features(N, P, K, ph, rainfall, temp, humidity):

    npk_total = N + P + K
    soil_fertility = 0.4*N + 0.3*P + 0.3*K

    n_p_ratio = N / (P + 1)
    n_k_ratio = N / (K + 1)
    p_k_ratio = P / (K + 1)

    water_index = rainfall * humidity
    gdd_approx = temp - 10

    season_rabi = 1

    return np.array([[  
        N, P, K,
        temp, humidity,
        ph, rainfall,
        npk_total,
        soil_fertility,
        n_p_ratio,
        n_k_ratio,
        p_k_ratio,
        water_index,
        gdd_approx,
        season_rabi
    ]])

# ---------------------------------
# SOIL HELPERS
# ---------------------------------
def soil_category(score):
    if score < 40:
        return "Poor"
    elif score < 70:
        return "Moderate"
    else:
        return "Healthy"


def soil_suggestions(category):
    if category == "Poor":
        return [
            "Increase Nitrogen using urea or compost",
            "Add organic matter to improve soil fertility",
            "Check soil salinity and drainage"
        ]
    elif category == "Moderate":
        return [
            "Maintain balanced fertilization",
            "Add organic compost regularly",
            "Monitor micronutrient levels"
        ]
    else:
        return [
            "Soil is healthy",
            "Maintain current nutrient balance",
            "Continue sustainable farming practices"
        ]

# ---------------------------------
# 🔥 CROP API
# ---------------------------------
@app.route('/predict', methods=['POST'])
def predict_api():
   try:
        data = request.json

        # 🔥 CHECK: lat/lon ya manual input
        lat = data.get('latitude')
        lon = data.get('longitude')

        if lat is not None and lon is not None:
            lat = float(lat)
            lon = float(lon)

            query = """
            SELECT nitrogen, phosphorus, potassium, ph
            FROM Datasets
            WHERE latitude ~ '^[0-9.]+' 
                AND longitude ~ '^[0-9.]+'
                ORDER BY
                ABS(latitude::double precision - %s) +
                ABS(longitude::double precision - %s)
            LIMIT 1;
            """

            with conn.cursor() as cursor:
                cursor.execute(query, (lat, lon))
                result = cursor.fetchone()
            if not result:
                return jsonify({"error": "No data found for this location"})

            N, P, K, ph = result
            N = float(N)
            P = float(P)
            K = float(K)
            ph = float(ph)
            city = get_city_cached(lat, lon)

            if not city:
                city = "Location Found"
            temp, humidity = get_weather(lat, lon)
            rainfall = get_rainfall_forecast(lat, lon)
        else:
            # 🔥 manual input
            N = float(data.get('Nitrogen')or 0)
            P = float(data.get('Phosphorus')or 0)
            K = float(data.get('Potassium')or 0)
            ph = float(data.get('Ph')or 7.0)

            city = data.get('city')
            if city:
                city = city.strip().title() 
            temp, humidity = get_weather_by_city(city)
            rainfall = get_rainfall_forecast_by_city(city) 

        if temp is None:
            return jsonify({"error": "Weather API error"})
        if rainfall is None:
            return jsonify({"error": "Rainfall data not available"})

        # features
        features = build_features(N, P, K, ph, rainfall, temp, humidity)

        probs = season_model.predict_proba(features)[0]
        idx = np.argsort(probs)[-3:][::-1]

        result = []
        for i in idx:
            result.append({
                "crop": crop_labels[i],
                "confidence": float(round(probs[i]*100, 2))
            })

        return jsonify({
            "recommendations": result,
            "temperature": float(temp),
            "humidity": float(humidity),
            "rainfall": float(rainfall) if rainfall else 0,
            "city": city,
            "used_values": {
                "N": float(N),
                "P": float(P),
                "K": float(K),
                "ph": float(ph)
            }
        })
   except Exception as e:
        conn.rollback()   # 🔥 IMPORTANT FIX
        print("ERROR:", e)
        return jsonify({"error": str(e)})


# ---------------------------------
# 🔥 SOIL HEALTH API
# ---------------------------------
@app.route('/soil-health', methods=['POST'])
def soil_health_api():
    try:
        data = request.get_json()

        N = float(data["N"])
        P = float(data["P"])
        K = float(data["K"])
        pH = float(data["pH"])
        EC = float(data["EC"])
        OC = float(data["OC"])
        S = float(data["S"])
        Fe = float(data["Fe"])
        Zn = float(data["Zn"])
        Mn = float(data["Mn"])
        Cu = float(data["Cu"])

        nutrient_sample = pd.DataFrame({
            "N":[N], "P":[P], "K":[K],
            "S":[S], "Fe":[Fe], "Zn":[Zn],
            "Mn":[Mn], "Cu":[Cu],
            "OC":[OC], "EC":[EC], "pH":[pH]
        })

        soil_sample = nutrient_sample[[
            "N","P","K","EC","OC","pH","S","Fe","Zn","Mn","Cu"
        ]]

        # soil prediction
        sample_scaled = scaler.transform(soil_sample)
        sample_scaled = pd.DataFrame(sample_scaled, columns=soil_sample.columns)

        predicted_shi = float(soil_model.predict(sample_scaled)[0])

        category = soil_category(predicted_shi)
        suggestions = soil_suggestions(category)

        # nutrient deficiency
        pred = nutrient_model.predict(nutrient_sample)[0]

        nutrients = [
            "Nitrogen","Phosphorus","Potassium",
            "Sulphur","Iron","Zinc","Manganese","Copper"
        ]

        deficiencies = []
        for nutrient, status in zip(nutrients, pred):
            if status == "Low":
                deficiencies.append(nutrient + " Low")

        return jsonify({
            "shi": round(predicted_shi, 2),
            "category": category,
            "deficiencies": deficiencies,
            "suggestions": suggestions
        })

    except Exception as e:
        return jsonify({"error": str(e)})

@app.route('/weather', methods=['GET'])
def weather_only():
    try:
        lat = request.args.get('lat')
        lon = request.args.get('lon')

        # ✅ validation
        if not lat or not lon:
            return jsonify({"error": "Latitude and Longitude required"})

        lat = float(lat)
        lon = float(lon)

        # ✅ existing functions use karo
        temp, humidity = get_weather(lat, lon)
        rainfall = get_rainfall_forecast(lat, lon)
        city = get_city_cached(lat, lon)

        if temp is None:
            return jsonify({"error": "Weather fetch failed"})
        if rainfall is None:
            rainfall = 0
        return jsonify({
            "temperature": float(temp),
            "humidity": float(humidity),
            "rainfall": float(rainfall) if rainfall else 0,
            "city": city
        })

    except Exception as e:
        return jsonify({"error": str(e)})

@app.route('/geocode', methods=['GET'])
def geocode():
    try:
        place = request.args.get('place')

        if not place:
            return jsonify({"error": "Place is required"})

        url = f"https://nominatim.openstreetmap.org/search?q={place}&format=json"

        res = requests.get(url, headers={"User-Agent": "agri-smart-app"},verify=False,timeout=5)
        data = res.json()

        if not data:
            return jsonify({"error": "Location not found"})

        return jsonify({
            "lat": data[0]["lat"],
            "lon": data[0]["lon"],
            "display_name": data[0]["display_name"]
        })

    except Exception as e:
        return jsonify({"error": str(e)})
# ---------------------------------
# RUN
# ---------------------------------
if __name__ == "__main__":
    app.run(debug=True)