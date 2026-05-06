import joblib
import os
import numpy as np

BASE_DIR = os.path.dirname(__file__)

# ===== LOAD MODELS =====

soil_model = joblib.load(os.path.join(BASE_DIR, "models", "soil_health_model.pkl"))
season_model = joblib.load(os.path.join(BASE_DIR, "models", "season_model.pkl"))
nutrient_model = joblib.load(os.path.join(BASE_DIR, "models", "nutrient_deficiency_model.pkl"))

scaler = joblib.load(os.path.join(BASE_DIR, "models", "soil_scaler.pkl"))
label_encoder = joblib.load(os.path.join(BASE_DIR, "models", "label_encoder.pkl"))

# ===== FUNCTIONS =====

def predict_soil_health(data):
    data = np.array(data).reshape(1, -1)
    pred = soil_model.predict(data)
    return label_encoder.inverse_transform(pred)[0]


def predict_season(data):
    data = np.array(data).reshape(1, -1)
    pred = season_model.predict(data)
    return pred[0]


def predict_nutrient(data):
    data = np.array(data).reshape(1, -1)
    pred = nutrient_model.predict(data)
    return pred[0]