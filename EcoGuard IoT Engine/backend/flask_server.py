# ==========================================
# 1. ALL IMPORTS
# ==========================================
from flask import Flask, request, jsonify
from flask_cors import CORS  
import os
import json
import time
import threading
import pandas as pd
from web3 import Web3
from dotenv import load_dotenv

# ==========================================
# 2. FLASK APP INITIALIZATION
# ==========================================
app = Flask(__name__)
CORS(app)  

# ==========================================
# 3. BLOCKCHAIN CONFIG & THREAD LOGIC
# ==========================================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ENV_PATH = os.path.join(BASE_DIR, '..', 'blockchain', '.env')
ABI_PATH = os.path.join(BASE_DIR, 'CarbonFootprintLogger.json')

load_dotenv(ENV_PATH)

INFURA_URL = os.getenv("INFURA_API_KEY") 
w3 = Web3(Web3.HTTPProvider(INFURA_URL))

CONTRACT_ADDRESS = Web3.to_checksum_address("0x72FF4FdA69117A69864B39AD9Ece10e67d86CF98")
PRIVATE_KEY = os.getenv("PRIVATE_KEY") 
ACCOUNT_ADDRESS = w3.eth.account.from_key(PRIVATE_KEY).address

with open(ABI_PATH) as f:
    abi = json.load(f)["abi"]

contract = w3.eth.contract(address=CONTRACT_ADDRESS, abi=abi)

def blockchain_sync_loop():
    print("--- Blockchain Sync Thread Started ---")
    while True:
        try:
            time.sleep(60) 
            csv_path = os.path.join(BASE_DIR, 'live_sensor_today.csv')
            
            if os.path.exists(csv_path):
                df = pd.read_csv(csv_path)
                if not df.empty:
                    latest_avg = int(df['Raw_ADC'].tail(6).mean()) 
                    print(f"Syncing Avg ADC {latest_avg} to Sepolia...")
                    
                    nonce = w3.eth.get_transaction_count(ACCOUNT_ADDRESS)
                    txn = contract.functions.logData(latest_avg).build_transaction({
                        'chainId': 11155111,
                        'gas': 300000, 
                        'maxFeePerGas': w3.eth.gas_price,
                        'maxPriorityFeePerGas': w3.eth.max_priority_fee,
                        'nonce': nonce,
                    })

                    signed_txn = w3.eth.account.sign_transaction(txn, private_key=PRIVATE_KEY)
                    tx_hash = w3.eth.send_raw_transaction(signed_txn.raw_transaction)
                    
                    print(f"Success! View on Etherscan: https://sepolia.etherscan.io/tx/{w3.to_hex(tx_hash)}")
        except Exception as e:
            print(f"Blockchain Sync Error: {e}")

threading.Thread(target=blockchain_sync_loop, daemon=True).start()

# ==========================================
# 4. API ROUTES
# ==========================================

@app.route('/sensor_data', methods=['POST'])
def sensor_data():
    try:
        data = request.get_json()
        raw_adc = data.get('Raw_ADC', 0)
        node_volts = data.get('NodeMCU_Volts', 0.0)
        sensor_volts = data.get('Sensor_Volts', 0.0)

        timestamp = time.strftime('%Y-%m-%d %H:%M:%S')
        csv_path = os.path.join(BASE_DIR, 'live_sensor_today.csv')
        file_exists = os.path.isfile(csv_path)
        
        with open(csv_path, 'a') as f:
            if not file_exists:
                f.write("Timestamp,Raw_ADC,NodeMCU_Volts,Sensor_Volts\n")
            f.write(f"{timestamp},{raw_adc},{node_volts},{sensor_volts}\n")

        return jsonify({"status": "success", "message": "Data logged to CSV"}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/api/dashboard', methods=['GET'])
def get_dashboard_data():
    try:
        csv_path = os.path.join(BASE_DIR, 'live_sensor_today.csv')
        if not os.path.exists(csv_path):
            return jsonify({"status": "error", "message": "No sensor data collected yet."}), 404

        df = pd.read_csv(csv_path)
        if df.empty:
            return jsonify({"status": "error", "message": "Sensor log is empty."}), 404

        latest_reading = int(df['Raw_ADC'].iloc[-1])
        cumulative_ppm = int((df['Raw_ADC'] * 0.05).sum()) 

        recent_data = df.tail(30)
        chart_points = []
        for index, row in recent_data.iterrows():
            time_only = str(row['Timestamp']).split(' ')[1] if ' ' in str(row['Timestamp']) else str(row['Timestamp'])
            chart_points.append({"time": time_only, "emissions": int(row['Raw_ADC'])})

        return jsonify({
            "status": "success",
            "current_adc": latest_reading,
            "cumulative_daily": cumulative_ppm,
            "projected_final": cumulative_ppm * 2, 
            "updated_at": str(df['Timestamp'].iloc[-1]),
            "points": chart_points
        }), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

# NEW ROUTE: The Audit Engine
@app.route('/api/audit', methods=['GET'])
def generate_audit():
    try:
        csv_path = os.path.join(BASE_DIR, 'live_sensor_today.csv')
        if not os.path.exists(csv_path):
            return jsonify({"status": "error", "message": "No data found for audit."}), 404
            
        df = pd.read_csv(csv_path)
        if df.empty:
            return jsonify({"status": "error", "message": "Sensor log is empty."}), 404

        # Factory Constants
        V_FLOW_M3_HR = 5000 
        MOL_WEIGHT_CO = 28.01 
        MOLAR_VOLUME = 24.45 

        # The Math
        df['PPM'] = df['Raw_ADC'] * 0.05 
        df['Mass_Conc_mg_m3'] = df['PPM'] * (MOL_WEIGHT_CO / MOLAR_VOLUME)
        df['Emission_Rate_kg_hr'] = (df['Mass_Conc_mg_m3'] * V_FLOW_M3_HR) / 1000000
        df['Mass_Emitted_kg'] = df['Emission_Rate_kg_hr'] * (10 / 3600)
        
        total_footprint_kg = df['Mass_Emitted_kg'].sum()
        peak_ppm = df['PPM'].max()
        total_tx = len(df)

        return jsonify({
            "status": "success",
            "transactions_audited": total_tx,
            "exhaust_flow_rate": V_FLOW_M3_HR,
            "peak_concentration_ppm": round(peak_ppm, 2),
            "total_co_emitted_kg": round(total_footprint_kg, 6),
            "contract_address": CONTRACT_ADDRESS,
            "timestamp": time.strftime('%Y-%m-%d %H:%M:%S')
        }), 200

    except Exception as e:
        print(f"Audit Error: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)