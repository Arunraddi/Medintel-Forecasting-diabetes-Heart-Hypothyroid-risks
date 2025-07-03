from flask import Flask, request, jsonify
import pickle
import numpy as np
import os

app = Flask(__name__)

# Load models
models = {
    "diabetes": pickle.load(open("diabetes_model.sav", "rb")),
    "heart": pickle.load(open("heart_disease_model.sav", "rb")),
    "thyroid": pickle.load(open("Thyroid_model.sav", "rb")),
    # Add more as needed
}

def get_diabetes_tips(data, prediction):
    tips = []
    if prediction == 1:
        tips.append("Consult your doctor for diabetes management.")
        if float(data.get("Glucose", 0)) > 140:
            tips.append("Your glucose level is high. Monitor your blood sugar regularly.")
        if float(data.get("BMI", 0)) > 25:
            tips.append("Maintain a healthy weight through diet and exercise.")
        tips.append("Follow a balanced diet and stay physically active.")
        tips.append("Take medications as prescribed.")
    else:
        tips.append("Your diabetes risk is low. Maintain a healthy lifestyle.")
        tips.append("Get regular checkups to monitor your health.")
    return tips

def get_heart_tips(data, prediction):
    tips = []
    if prediction == 1:
        tips.append("Consult a cardiologist for further evaluation.")
        if float(data.get("chol", 0)) > 200:
            tips.append("Your cholesterol is high. Consider a low-fat diet.")
        if float(data.get("trestbps", 0)) > 130:
            tips.append("Monitor and manage your blood pressure.")
        tips.append("Engage in regular physical activity.")
        tips.append("Avoid smoking and limit alcohol consumption.")
    else:
        tips.append("Your heart disease risk is low. Maintain a heart-healthy lifestyle.")
        tips.append("Continue regular exercise and a balanced diet.")
    return tips

def get_thyroid_tips(data, prediction):
    tips = []
    if prediction == 1:
        tips.append("Consult an endocrinologist for further evaluation.")
        if float(data.get("tsh", 0)) > 4.0:
            tips.append("Your TSH is high. This may indicate hypothyroidism.")
        if float(data.get("t3", 0)) < 0.8:
            tips.append("Low T3 levels can be a sign of thyroid dysfunction.")
        tips.append("Maintain a balanced diet rich in iodine and selenium.")
        tips.append("Take your thyroid medication as prescribed.")
    else:
        tips.append("Your thyroid function appears normal. Maintain a healthy lifestyle.")
        tips.append("Get regular checkups to monitor your thyroid health.")
    return tips

@app.route('/predict/<disease>', methods=['POST'])
def predict(disease):
    data = request.json
    try:
        if disease == "diabetes":
            features = [
                float(data["Pregnancies"]),
                float(data["Glucose"]),
                float(data["BloodPressure"]),
                float(data["SkinThickness"]),
                float(data["Insulin"]),
                float(data["BMI"]),
                float(data["DiabetesPedigreeFunction"]),
                float(data["Age"])
            ]
            model = models[disease]
            prediction = model.predict([features])
            tips = get_diabetes_tips(data, prediction[0])
            print("Recieved data: ", data)
            return jsonify({"prediction": int(prediction[0]), "tips": tips})
        elif disease == "heart":
            features = [
                float(data["age"]),
                float(data["sex"]),
                float(data["cp"]),
                float(data["trestbps"]),
                float(data["chol"]),
                float(data["fbs"]),
                float(data["restecg"]),
                float(data["thalach"]),
                float(data["exang"]),
                float(data["oldpeak"]),
                float(data["slope"]),
                float(data["ca"]),
                float(data["thal"])
            ]
            model = models[disease]
            prediction = model.predict([features])
            tips = get_heart_tips(data, prediction[0])
            print("Recieved data: ", data)
            return jsonify({"prediction": int(prediction[0]), "tips": tips})
        elif disease == "thyroid":
            features = [
                float(data["age"]),
                float(data["sex"]),
                float(data["on_thyroxine"]),
                float(data["tsh"]),
                float(data["t3_measured"]),
                float(data["t3"]),
                float(data["tt4"])
            ]
            model = models[disease]
            prediction = model.predict([features])
            tips = get_thyroid_tips(data, prediction[0])
            print("Recieved data: ", data)
            return jsonify({"prediction": int(prediction[0]), "tips": tips})
        else:
            return jsonify({"error": "Unknown disease"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000)