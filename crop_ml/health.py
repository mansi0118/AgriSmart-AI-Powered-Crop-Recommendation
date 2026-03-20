from flask import Flask,render_template,request
import pandas as pd
import joblib

app = Flask(__name__)

# load model
soil_model = joblib.load("soil_health_model.pkl")
scaler = joblib.load("soil_scaler.pkl")


def soil_category(score):

    if score < 40:
        return "Poor"

    elif score < 70:
        return "Moderate"

    else:
        return "Healthy"


@app.route("/")
def home():

    return render_template("soil_health.html")


@app.route("/soil_predict",methods=["POST"])
def soil_predict():

    N = float(request.form["N"])
    P = float(request.form["P"])
    K = float(request.form["K"])
    pH = float(request.form["pH"])
    EC = float(request.form["EC"])
    OC = float(request.form["OC"])
    S = float(request.form["S"])
    Fe = float(request.form["Fe"])
    Zn = float(request.form["Zn"])
    Mn = float(request.form["Mn"])
    Cu = float(request.form["Cu"])

    sample = pd.DataFrame({

        "N":[N],
        "P":[P],
        "K":[K],
        "EC":[EC],
        "OC":[OC],
        "pH":[pH],
        "S":[S],
        "Fe":[Fe],
        "Zn":[Zn],
        "Mn":[Mn],
        "Cu":[Cu]

    })

    sample_scaled = scaler.transform(sample)
    sample_scaled = pd.DataFrame(sample_scaled,columns=sample.columns)

    predicted_shi = soil_model.predict(sample_scaled)[0]

    category = soil_category(predicted_shi)
    # Soil suggestion logic

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
    suggestions = soil_suggestions(category)
    result = {

        "shi":round(predicted_shi,2),
        "category":category,
        "suggestions":suggestions

    }

    return render_template("soil_health.html",result=result)


if __name__ == "__main__":

    app.run(debug=True)