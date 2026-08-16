# 🌍 EcoGuard - AI-Powered Carbon Footprint Estimator

<div align="center">

![EcoGuard Banner](https://img.shields.io/badge/Status-Production_Ready-success?style=for-the-badge) 
![React](https://img.shields.io/badge/React-19.0.0-blue?style=for-the-badge&logo=react) 
![Vite](https://img.shields.io/badge/Vite-7.3.1-646CFF?style=for-the-badge&logo=vite) 
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.2.1-38B2AC?style=for-the-badge&logo=tailwind-css) 
![Python](https://img.shields.io/badge/Python-3.11-3776AB?style=for-the-badge&logo=python) 
![FastAPI](https://img.shields.io/badge/FastAPI-0.104-009688?style=for-the-badge&logo=fastapi) 
![XGBoost](https://img.shields.io/badge/ML-XGBoost-orange?style=for-the-badge) 
![YOLO](https://img.shields.io/badge/Vision_AI-YOLOv8-yellow?style=for-the-badge)
![Solidity](https://img.shields.io/badge/Blockchain-Solidity-363636?style=for-the-badge&logo=solidity)
![Ethereum](https://img.shields.io/badge/Network-Ethereum_Sepolia-3C3C3D?style=for-the-badge&logo=ethereum)

**EcoGuard** bridges the gap between static national averages and dynamic, real-world personal carbon footprint tracking. Powered by a **Tri-Modal ML Architecture** combining lifestyle regression, computer vision waste detection, real-time IoT monitoring, and a **Blockchain Oracle** that creates a tamper-proof audit trail on Ethereum Sepolia.

[🚀 Live Demo](https://ecoguard-nu.vercel.app/)

</div>

---

## 🎯 Problem Statement

- Existing carbon calculators rely on outdated national averages and generic assumptions
- No tool provides real-time, personalized, physics-informed carbon footprint predictions
- Emission data has no verifiable audit trail — making greenwashing trivially easy
- **EcoGuard** solves all three: predict, track, and cryptographically verify personal emissions

---

## ✨ Key Features

| Module | What it does |
|--------|-------------|
| 🧠 **Lifestyle ML Engine** | Stacking Ensemble model predicts annual CO₂ from 18 lifestyle variables (R² = 0.98) |
| 📷 **Vision Waste Scanner** | YOLOv8 Nano detects waste material from a photo and maps it to a carbon value |
| 📡 **IoT Monitor** | ESP8266 + MQ-7 sensor streams live CO₂ readings with daily forecast |
| ⛓️ **Blockchain Oracle** | Aggregates sensor data every 60s and logs cryptographic proof to Ethereum Sepolia |

---

## 🏗️ System Architecture

<div align="center">
  <img width="600" alt="image" src="https://github.com/user-attachments/assets/65cdc06b-06aa-4171-ab63-349e20e2f1ba" />

  <img width="454" height="711" alt="image" src="https://github.com/user-attachments/assets/a2a134db-d332-4918-bce3-2fafe0c5ae9c" />
</div>

---

## 🔬 Machine Learning Models

### Model 1: Lifestyle Carbon Regression

- **Type:** Stacking Ensemble (LightGBM + CatBoost + HistGradBoost → Ridge meta-learner)
- **Input:** 18 lifestyle variables (transport, energy, consumption, waste, demographics)
- **Performance:** R² = 0.9800+, RMSE = 2.7 kg CO₂, Cross-Val = 0.9799 ± 0.0008

### Model 2: Waste Detection & Carbon Estimation

- **Type:** YOLOv8 Nano object detection + physics-informed weight estimation
- **Input:** JPG/PNG images (416×416 px)
- **Dataset:** 1,800+ waste images across 6 classes (Cardboard, Glass, Metal, Paper, Plastic, Trash)
- **Performance:** mAP50 = 96.00%, Precision = 91.98%, Inference = 2.4ms

**Carbon Emission Factors**

| Material | CO₂ (kg/kg) | Impact |
|----------|-------------|--------|
| Metal | 8.5 | 🔴🔴 HIGHEST |
| Plastic | 2.5 | 🔴 HIGH |
| Trash | 2.0 | 🟡 MEDIUM |
| Paper | 1.3 | 🟡 MEDIUM |
| Glass | 1.2 | 🟡 MEDIUM |
| Cardboard | 1.1 | 🟡 MEDIUM |

### Model 3: Real-Time IoT Sensor

- **Hardware:** ESP8266/NodeMCU + MQ-7 CO Gas Sensor
- **Flow:** Sensor → Flask API → CSV cache → Time-series regression → React Dashboard
- **Output:** Real-time emission forecast + daily total prediction

---

## ⛓️ Blockchain Layer

EcoGuard uses a **Hybrid On-Chain/Off-Chain Architecture**. High-frequency sensor data is cached locally for ML processing, while a background oracle mints cryptographic proofs to Ethereum every 60 seconds — ensuring high-speed data availability without sacrificing trustless verification.

```
ESP8266 Sensor (every 10s)
    │
    ▼
Flask API → live_sensor_today.csv
    │
    └─ Oracle Thread (every 60s)
            │  averages last 6 readings
            ▼
        web3.py + Infura
            │
            ▼
        CarbonFootprintLogger.sol
        (Ethereum Sepolia — immutable record)
```

**Smart Contract (Solidity)**
```solidity
contract CarbonFootprintLogger {
    struct EmissionRecord {
        uint256 timestamp;
        uint256 aggregatedReading;
    }
    EmissionRecord[] public records;

    function logEmission(uint256 reading) public {
        records.push(EmissionRecord(block.timestamp, reading));
    }
}
```

**Audit Mathematics**
```
Mass Concentration:  C_mg = PPM × (28.01 / 24.45)
Emission Rate:       E_rate = (C_mg × V_flow) / 1,000,000
```

Result: a cryptographically verifiable report of exact kg of greenhouse gas emitted — data tampering mathematically impossible.

---

## 💻 Installation & Setup

### Prerequisites
- Node.js v18+, Python 3.10+, npm, Git

### 1. Clone & Frontend
```bash
git clone https://github.com/navalepratham18/AI-Based-Carbon-Footprint-Estimator.git
cd AI-Based-Carbon-Footprint-Estimator
npm install && npm run dev
# Frontend: http://localhost:5173
```

### 2. ML Backend (FastAPI)
```bash
cd "EcoGuard Vision Engine"
python -m venv venv && venv\Scripts\activate
pip install -r requirements.txt
uvicorn api:app --reload
# API: http://localhost:8000 | Docs: http://localhost:8000/docs
```

### 3. IoT Backend (Flask)
```bash
cd "EcoGuard IoT Sensor"
python -m venv venv && venv\Scripts\activate
pip install flask pandas scikit-learn joblib
python app.py
# Sensor API: http://localhost:5000
```

### 4. Blockchain Setup
```bash
cd "EcoGuard Blockchain"
pip install web3 python-dotenv
cp .env.example .env   # Add INFURA_PROJECT_ID and PRIVATE_KEY
npm install -g truffle
truffle migrate --network sepolia
# Oracle thread starts automatically with Flask IoT server
```

> ⚠️ Never commit your `.env` file. Use a dedicated testnet wallet with no real funds.

---

## 📁 Project Structure

```
EcoGuard/
├── src/                          # React frontend
├── EcoGuard Core Engine/         # ML model training & best_ml_model.joblib
├── EcoGuard Vision Engine/       # FastAPI + YOLOv8 backend
├── EcoGuard IoT Sensor/          # Flask API + time-series model + Oracle thread
├── EcoGuard Blockchain/          # Solidity contract + Truffle + audit.py
├── REPORT.md                     # Full technical documentation
└── README.md
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/predict_lifestyle` | Predict CO₂ from 18 lifestyle features |
| POST | `/detect_waste` | Detect waste material from image |
| POST | `/integrated_analysis` | Combined lifestyle + waste prediction |
| POST | `/sensor_data` | Receive IoT sensor reading |
| GET | `/sensor_status` | Current sensor status + today's data |
| GET | `/blockchain_status` | Last oracle tx hash + total on-chain records |

---

## 📊 Performance Summary

| Model | Key Metric | Value |
|-------|-----------|-------|
| Lifestyle Regression | R² Score | 0.9800+ |
| Computer Vision | mAP50 | 96.00% |
| Computer Vision | Inference | 2.4 ms |
| Blockchain Oracle | Aggregation Cycle | 60 seconds |

---

## 🛠️ Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React 19 · Vite · Tailwind CSS v4 · Framer Motion · GSAP · Recharts |
| Backend | FastAPI · Flask · Pydantic · Python 3.11 |
| ML | XGBoost · LightGBM · CatBoost · Scikit-learn |
| Vision | YOLOv8 Nano · PyTorch · OpenCV · ONNX |
| IoT | ESP8266 NodeMCU · MQ-7 Sensor · Arduino |
| Blockchain | Solidity · Truffle · web3.py · Infura · Ethereum Sepolia |
| Deployment | Vercel · AWS EC2 · Google Cloud Run |

---

## 📝 License

MIT License — see [LICENSE](LICENSE) for details.

---

## 📞 Contact & Support

**Project Lead**: Prathamesh Navale
- **Email**: [workwithprathamesh18@gmail.com](mailto:workwithprathamesh18@gmail.com)
- **GitHub**: [navalepratham18](https://github.com/navalepratham18)
- **LinkedIn**: [Prathamesh-Navale](https://linkedin.com/in/prathameshnavale18)

---

<div align="center">

### 🌱 Let's Build a Sustainable Future Together!

**Made with ❤️ by Team NoobEngineers**

[⬆ Back to Top](#-ecoguard---ai-powered-carbon-intelligence-platform)

</div>
