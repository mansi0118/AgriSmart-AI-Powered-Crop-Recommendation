import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import pickle

# 🔥 Load your dataset (change path if needed)
df = pd.read_excel("Dataset3.xlsx")   # replace with correct file if multi-dataset

df['label'] = df['label'].str.lower().str.strip()

# Example cleaning (adjust as needed)
crop_counts = df['label'].value_counts()
valid_crops = crop_counts[crop_counts >= 500].index
df = df[df['label'].isin(valid_crops)]

X = df.drop('label', axis=1)
y = df['label']

X_train, X_test, y_train, y_test = train_test_split(
    X, y,
    test_size=0.2,
    stratify=y,
    random_state=42
)

scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)

# 🔥 Lightweight model (important)
rf = RandomForestClassifier(
    n_estimators=80,
    max_depth=12,
    random_state=42,
    class_weight='balanced'
)

rf.fit(X_train_scaled, y_train)

# Save fresh model
with open("dataset3_model.pkl", "wb") as f:
    pickle.dump(rf, f)

with open("dataset3_scaler.pkl", "wb") as f:
    pickle.dump(scaler, f)

print("✅ Model retrained and saved successfully!")