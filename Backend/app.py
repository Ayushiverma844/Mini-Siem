from flask import (
    Flask,
    request,
    jsonify
)

from flask_cors import CORS

import joblib
import pandas as pd

from werkzeug.utils import (
    secure_filename
)

# ==========================
# CREATE APP
# ==========================

app = Flask(__name__)

CORS(app)

# ==========================
# SECURITY CONFIG
# ==========================

ALLOWED_EXTENSIONS = {
    "csv",
    "log",
    "txt"
}

MAX_FILE_SIZE = (
    2 * 1024 * 1024
)

app.config[
    "MAX_CONTENT_LENGTH"
] = MAX_FILE_SIZE

# ==========================
# LOAD MODELS
# ==========================

# Email Model
phishing_model = joblib.load(
    "phishing_model.pkl"
)

vectorizer = joblib.load(
    "tfidf_vectorizer.pkl"
)

type_encoder = joblib.load(
    "type_encoder.pkl"
)

severity_encoder = joblib.load(
    "severity_encoder.pkl"
)

# Log Model
log_model = joblib.load(
    "log_threat_model.pkl"
)

protocol_encoder = joblib.load(
    "protocol_encoder.pkl"
)

encryption_encoder = joblib.load(
    "encryption_encoder.pkl"
)

browser_encoder = joblib.load(
    "browser_encoder.pkl"
)

# ==========================
# HELPERS
# ==========================

def allowed_file(
    filename
):
    return (
        "." in filename
        and filename
        .rsplit(".", 1)[1]
        .lower()
        in ALLOWED_EXTENSIONS
    )


def safe_encode(
    encoder,
    value,
    default
):
    try:
        return encoder.transform(
            [value]
        )[0]

    except:
        return encoder.transform(
            [default]
        )[0]


# ==========================
# HOME
# ==========================

@app.route("/")
def home():

    return (
        "Mini-SIEM "
        "Backend Running!"
    )


# ==========================
# PHISHING API
# ==========================

@app.route(
    "/predict-phishing",
    methods=["POST"]
)
def predict_phishing():

    try:

        data = request.json

        email_text = data.get(
            "email_text",
            ""
        )

        text_vector = (
            vectorizer.transform(
                [email_text]
            )
        )

        prediction = (
            phishing_model.predict(
                text_vector
            )
        )

        phishing_detected = int(
            prediction[0][0]
        )

        phishing_type = (
            type_encoder
            .inverse_transform(
                [
                    prediction[0][1]
                ]
            )[0]
        )

        severity = (
            severity_encoder
            .inverse_transform(
                [
                    prediction[0][2]
                ]
            )[0]
        )

        return jsonify({
            "phishing_detected":
            phishing_detected,

            "phishing_type":
            phishing_type,

            "severity":
            severity
        })

    except Exception as e:

        return jsonify({
            "error":
            str(e)
        }), 500


# ==========================
# LOG FILE UPLOAD API
# ==========================

@app.route(
    "/upload-log-file",
    methods=["POST"]
)
def upload_log_file():

    try:

        # ==================
        # FILE CHECK
        # ==================

        if (
            "file"
            not in
            request.files
        ):
            return jsonify({
                "error":
                "No file uploaded"
            }), 400

        file = request.files[
            "file"
        ]

        if (
            file.filename
            == ""
        ):
            return jsonify({
                "error":
                "No selected file"
            }), 400

        if not allowed_file(
            file.filename
        ):
            return jsonify({
                "error":
                "Only .csv, .log, .txt allowed"
            }), 400

        filename = secure_filename(
            file.filename
        )

        # ==================
        # READ FILE
        # ==================

        file_text = (
            file.read()
            .decode(
                "utf-8",
                errors="ignore"
            )
        )

        lines = (
            file_text
            .splitlines()
        )

        rows = []

        # ==================
        # SMART PARSING
        # ==================

        for line in lines:

            line_lower = (
                line.lower()
            )

            # ignore empty lines
            if (
                not line.strip()
            ):
                continue

            # ---------- intelligent defaults ----------
            network_packet_size = 500
            protocol_type = "TCP"
            login_attempts = 1
            session_duration = 60
            encryption_used = "AES"
            ip_reputation_score = 50
            failed_logins = 0
            browser_type = "Chrome"
            unusual_time_access = 0

            # ---------- detect attack patterns ----------

            if (
                "failed password"
                in line_lower
            ):
                failed_logins += 1
                login_attempts += 2

            if (
                "invalid user"
                in line_lower
            ):
                ip_reputation_score = 20

            if (
                "root"
                in line_lower
            ):
                ip_reputation_score = 10

            if (
                "accepted password"
                in line_lower
            ):
                session_duration = 300

            if (
                "ssh"
                in line_lower
            ):
                protocol_type = "TCP"

            rows.append({
                "network_packet_size":
                network_packet_size,

                "protocol_type":
                protocol_type,

                "login_attempts":
                login_attempts,

                "session_duration":
                session_duration,

                "encryption_used":
                encryption_used,

                "ip_reputation_score":
                ip_reputation_score,

                "failed_logins":
                failed_logins,

                "browser_type":
                browser_type,

                "unusual_time_access":
                unusual_time_access
            })

        # ==================
        # EMPTY FILE
        # ==================

        if len(rows) == 0:

            return jsonify({
                "error":
                "No valid logs found"
            }), 400

        df = pd.DataFrame(
            rows
        )

        # ==================
        # ENCODING
        # ==================

        df[
            "protocol_type"
        ] = df[
            "protocol_type"
        ].apply(
            lambda x:
            safe_encode(
                protocol_encoder,
                x,
                "TCP"
            )
        )

        df[
            "encryption_used"
        ] = df[
            "encryption_used"
        ].apply(
            lambda x:
            safe_encode(
                encryption_encoder,
                x,
                "AES"
            )
        )

        df[
            "browser_type"
        ] = df[
            "browser_type"
        ].apply(
            lambda x:
            safe_encode(
                browser_encoder,
                x,
                "Chrome"
            )
        )

        # ==================
        # MODEL PREDICTION
        # ==================

        predictions = (
            log_model.predict(
                df
            )
        )

        threat_count = int(
            sum(
                predictions
            )
        )

        safe_count = int(
            len(
                predictions
            )
            -
            threat_count
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
            "error":
            str(e)
        }), 500


# ==========================
# RUN SERVER
# ==========================

if __name__ == "__main__":
    app.run(
        debug=True
    )