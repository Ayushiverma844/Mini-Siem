from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import os
from werkzeug.utils import secure_filename

# ==========================
# CREATE FLASK APP
# ==========================
app = Flask(__name__)
CORS(app)
# ==========================
# SECURITY CONFIG
# ==========================

ALLOWED_EXTENSIONS = {
    'csv',
    'log',
    'txt'
}

MAX_FILE_SIZE = 2 * 1024 * 1024  # 2MB

app.config[
    'MAX_CONTENT_LENGTH'
] = MAX_FILE_SIZE

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
# FILE VALIDATION
# ==========================
def allowed_file(filename):

    return (
        '.' in filename
        and filename.rsplit(
            '.', 1
        )[1].lower()
        in ALLOWED_EXTENSIONS
    )
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

    'protocol_type':
    protocol_encoder.transform(
        [data['protocol_type']]
    )[0],

    'login_attempts': data['login_attempts'],

    'session_duration': data['session_duration'],

    'encryption_used':
    encryption_encoder.transform(
        [data['encryption_used']]
    )[0],

    'ip_reputation_score':
    data['ip_reputation_score'],

    'failed_logins':
    data['failed_logins'],

    'browser_type':
    browser_encoder.transform(
        [data['browser_type']]
    )[0],

    'unusual_time_access':
    data['unusual_time_access']
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

# ==========================
# SECURE LOG FILE UPLOAD API
# ==========================
@app.route(
    '/upload-log-file',
    methods=['POST']
)
def upload_log_file():

    # file check
    if 'file' not in request.files:
        return jsonify({
            "error":
            "No file uploaded"
        }), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({
            "error":
            "No selected file"
        }), 400

    # extension validation
    if not allowed_file(
        file.filename
    ):
        return jsonify({
            "error":
            "Only .csv, .log, .txt allowed"
        }), 400

    try:

        # sanitize filename
        filename = secure_filename(
            file.filename
        )

        # ======================
        # CSV FILE
        # ======================
        if filename.endswith(
            '.csv'
        ):

            df = pd.read_csv(file)

        # ======================
        # TXT / LOG FILE
        # ======================
        else:

            lines = file.read() \
                .decode(
                    'utf-8',
                    errors='ignore'
                ) \
                .splitlines()

            parsed_logs = []

            for line in lines:

                parts = line.split(',')

                if len(parts) < 9:
                    continue

                parsed_logs.append({
                    'network_packet_size':
                    float(parts[0]),

                    'protocol_type':
                    parts[1],

                    'login_attempts':
                    int(parts[2]),

                    'session_duration':
                    float(parts[3]),

                    'encryption_used':
                    parts[4],

                    'ip_reputation_score':
                    float(parts[5]),

                    'failed_logins':
                    int(parts[6]),

                    'browser_type':
                    parts[7],

                    'unusual_time_access':
                    int(parts[8])
                })

            df = pd.DataFrame(
                parsed_logs
            )

        # ======================
        # REQUIRED COLUMNS
        # ======================
        required_columns = [
            'network_packet_size',
            'protocol_type',
            'login_attempts',
            'session_duration',
            'encryption_used',
            'ip_reputation_score',
            'failed_logins',
            'browser_type',
            'unusual_time_access'
        ]

        missing_columns = [
            col
            for col
            in required_columns
            if col not in df.columns
        ]

        if missing_columns:
            return jsonify({
                "error":
                f"Missing columns: {missing_columns}"
            }), 400

        # ======================
        # ENCODING
        # ======================
        df[
            'protocol_type'
        ] = protocol_encoder.transform(
            df[
                'protocol_type'
            ]
        )

        df[
            'encryption_used'
        ] = encryption_encoder.transform(
            df[
                'encryption_used'
            ]
        )

        df[
            'browser_type'
        ] = browser_encoder.transform(
            df[
                'browser_type'
            ]
        )

        # ======================
        # PREDICTION
        # ======================
        predictions = (
            log_model.predict(df)
        )

        threat_count = int(
            sum(predictions)
        )

        safe_count = int(
            len(predictions)
            - threat_count
        )

        return jsonify({

            "total_logs":
            len(predictions),

            "threats_detected":
            threat_count,

            "safe_logs":
            safe_count,

            "results":
            predictions.tolist()
        })

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500