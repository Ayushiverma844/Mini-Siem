# MINI SIEM

A **Machine Learning based Mini SIEM (Security Information and Event Management)** system that detects **phishing emails** and **suspicious log activities** using ML models and provides real-time security insights.

---

## Project Overview

MINI SIEM is a cybersecurity-focused web application that helps detect:

- **Phishing Emails**
- **Suspicious Log Activities**
- **Potential Threats and Attack Indicators**

The system uses **Machine Learning models** for intelligent threat detection and provides a clean SOC-style dashboard interface for monitoring security events.

---

## Features

### Email Threat Analysis
- Detect phishing emails using ML
- Upload `.txt` and `.eml` files
- Manual email content input
- Threat severity detection
- AI-based security recommendation

### Security Log Analysis
- Upload `.csv`, `.txt`, and `.log` files
- Detect suspicious activities
- Log threat classification using ML
- Risk severity detection
- Real-time SOC terminal animation

### Dashboard Monitoring
- Scan history tracking
- Threat statistics
- Critical alerts monitoring
- Risk distribution

### Additional Features
- Export Security Report (PDF)
- Auto-scroll to result section
- Scan timestamp
- Local storage support
- Modern SOC-inspired UI

---

## Technologies Used

### Frontend
- React.js
- Tailwind CSS
- JavaScript

### Backend
- Python
- Flask
- Flask-CORS

### Machine Learning
- Scikit-learn
- Joblib
- Pandas
- NumPy
- NLP preprocessing

---

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <your-repository-link>
cd MINI-SIEM
```

### 2. Install Backend Dependencies

```bash
pip install -r requirements.txt
```

### 3. Run Flask Backend

```bash
python app.py
```

Backend will run on:

```bash
http://127.0.0.1:5000
```

### 4. Run Frontend

```bash
npm install
npm run dev
```

Frontend will run on:

```bash
http://localhost:5173
```

---

## Supported File Formats

### Email Analysis
- `.txt`
- `.eml`

### Log Analysis
- `.csv`
- `.txt`
- `.log`

---

## Machine Learning Models

The project uses:

### Phishing Detection Model
Detects:
- Safe Email
- Phishing Email
- Threat Type
- Severity Level

### Log Threat Detection Model
Detects:
- Safe Logs
- Suspicious Activities
- Attack Indicators
- Risk Severity

---

## Future Improvements

- Real-time log monitoring
- Threat intelligence integration
- Database support
- Live SOC alerts
- Cloud deployment

---

## Author

**Ayushi Verma**

MCA Student | Cybersecurity Enthusiast | Web Developer

---
