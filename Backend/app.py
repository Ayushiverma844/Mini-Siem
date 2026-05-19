from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd

# ==========================
# CREATE FLASK APP
# ==========================
app = Flask(__name__)
CORS(app)


# ==========================
# LOAD MODELS
# ==========================

# Phishing Model + encoders
phishing_model = joblib.load("phishing_model.pkl")
vectorizer = joblib.load("tfidf_vectorizer.pkl")
type_encoder = joblib.load("type_encoder.pkl")
severity_encoder = joblib.load("severity_encoder.pkl")


# Log Model + encoders
log_model = joblib.load("log_threat_model.pkl")
protocol_encoder = joblib.load("protocol_encoder.pkl")
encryption_encoder = joblib.load("encryption_encoder.pkl")
browser_encoder = joblib.load("browser_encoder.pkl")


# ==========================
# HOME ROUTE
# ==========================
@app.route('/')
def home():
    return "Mini-SIEM Backend Running Successfully!"


# ==========================
# PHISHING PREDICTION API
# ==========================
@app.route('/predict-phishing', methods=['POST'])
def predict_phishing():

    data = request.json
    email_text = data.get("email_text")

    # text → vector
    text_vector = vectorizer.transform([email_text])

    # prediction (IMPORTANT: must match training output)
    prediction = phishing_model.predict(text_vector)

    phishing_detected = int(prediction[0][0])
    phishing_type = type_encoder.inverse_transform([prediction[0][1]])[0]
    severity = severity_encoder.inverse_transform([prediction[0][2]])[0]

    return jsonify({
        "phishing_detected": phishing_detected,
        "phishing_type": phishing_type,
        "severity": severity
    })


# ==========================
# LOG PREDICTION API
# ==========================
@app.route('/predict-log', methods=['POST'])
def predict_log():

    data = request.json

    input_data = pd.DataFrame([{
        'network_packet_size': data['network_packet_size'],
        'protocol_type': data['protocol_type'],
        'login_attempts': data['login_attempts'],
        'session_duration': data['session_duration'],
        'encryption_used': data['encryption_used'],
        'ip_reputation_score': data['ip_reputation_score'],
        'failed_logins': data['failed_logins'],
        'browser_type': data['browser_type'],
        'unusual_time_access': data['unusual_time_access']
    }])

    prediction = log_model.predict(input_data)

    return jsonify({
        "attack_detected": int(prediction[0])
    })


# ==========================
# RUN SERVER (MUST BE LAST)
# ==========================
if __name__ == '__main__':
    app.run(debug=True)