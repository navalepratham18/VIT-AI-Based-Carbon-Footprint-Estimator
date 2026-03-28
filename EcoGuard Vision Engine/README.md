EcoGuard AI Deployment Instructions

1. Install dependencies
pip install -r requirements.txt

2. Run server
uvicorn api:app --host 0.0.0.0 --port 8000

3. Send image to API
POST /predict

Response:
[
 {
  material: plastic,
  confidence: 0.97,
  weight_g: 82.9,
  carbon_kg: 0.207
 }
]