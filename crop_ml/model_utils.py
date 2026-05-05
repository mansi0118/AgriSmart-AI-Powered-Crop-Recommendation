import pickle
import os
import numpy as np

BASE_DIR = os.path.dirname(__file__)

# ===== LOAD MODELS =====

# Soil Health
with open(os.path.join(BASE_DIR, "models", "soil_health_model.pkl"), "rb") as f:
    soil_model = pickle.load(f)

# Season Model
with open(os.path.join(BASE_DIR, "models", "season_model.pkl"), "rb") as f:
    season_model = pickle.load(f)

# Nutrient Deficiency
with open(os.path.join(BASE_DIR, "models", "nutrient_deficiency_model.pkl"), "rb") as f:
    nutrient_model = pickle.load(f)

# Common tools
with open(os.path.join(BASE_DIR, "models", "soil_scaler.pkl"), "rb") as f:
    scaler = pickle.load(f)

with open(os.path.join(BASE_DIR, "models", "label_encoder.pkl"), "rb") as f:
    label_encoder = pickle.load(f)

# ===== FUNCTIONS =====

def predict_soil_health(data):
    data = np.array(data).reshape(1, -1)
    data_scaled = scaler.transform(data)
    pred = soil_model.predict(data_scaled)
    return label_encoder.inverse_transform(pred)[0]


def predict_season(data):
    data = np.array(data).reshape(1, -1)
    pred = season_model.predict(data)
    return pred[0]


def predict_nutrient(data):
    data = np.array(data).reshape(1, -1)
    pred = nutrient_model.predict(data)
    return pred[0]