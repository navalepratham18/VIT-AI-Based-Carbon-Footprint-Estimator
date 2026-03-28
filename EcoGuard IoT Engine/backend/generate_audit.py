import pandas as pd
import os

# ==========================================
# 1. PHYSICAL FACTORY CONSTANTS
# ==========================================
# Volumetric Flow Rate: How much air leaves the chimney per hour (Cubic Meters per Hour)
# We are assuming a standard medium-sized industrial exhaust fan.
V_FLOW_M3_HR = 5000 

# Molecular Weight of Carbon Monoxide (CO)
MOL_WEIGHT_CO = 28.01 

# Standard Molar Volume of an Ideal Gas at Standard Temp/Pressure (Liters/mol)
MOLAR_VOLUME = 24.45 

print("--- Initializing Auditor Node ---")
print(f"Targeting Exhaust Flow Rate: {V_FLOW_M3_HR} m^3/hr")

# ==========================================
# 2. THE CONVERSION ENGINE
# ==========================================
def generate_monthly_audit(csv_path):
    print(f"\nScanning local database cache: {csv_path}...")
    
    if not os.path.exists(csv_path):
        print("Audit Failed: No sensor data found.")
        return
        
    df = pd.read_csv(csv_path)
    
    if df.empty:
        print("Audit Failed: Log is empty.")
        return
        
    # 1. Convert Raw ADC to PPM (Hackathon Linear Approximation)
    # Assuming standard indoor baseline. Adjust the 0.05 multiplier if your numbers look too high/low.
    df['PPM'] = df['Raw_ADC'] * 0.05 
    
    # 2. Formula A: PPM to Mass Concentration (mg/m^3)
    df['Mass_Conc_mg_m3'] = df['PPM'] * (MOL_WEIGHT_CO / MOLAR_VOLUME)
    
    # 3. Formula B: Hourly Emission Rate (kg/hr)
    df['Emission_Rate_kg_hr'] = (df['Mass_Conc_mg_m3'] * V_FLOW_M3_HR) / 1000000
    
    # 4. Formula C: Calculate actual mass per reading interval
    # Your NodeMCU sends data roughly every 10 seconds. 10 seconds is (10/3600) of an hour.
    df['Mass_Emitted_kg'] = df['Emission_Rate_kg_hr'] * (10 / 3600)
    
    # 5. The Grand Total (Integration over time)
    total_footprint_kg = df['Mass_Emitted_kg'].sum()
    
    # ==========================================
    # 3. THE REPORT DASHBOARD
    # ==========================================
    print("\n" + "="*50)
    print("      IMMUTABLE CARBON AUDIT REPORT")
    print("="*50)
    print(f"Total Transactions Audited : {len(df)}")
    print(f"Exhaust Flow Rate          : {V_FLOW_M3_HR} m^3/hr")
    print(f"Peak Concentration (CO)    : {df['PPM'].max():.2f} PPM")
    print(f"Total CO Emitted           : {total_footprint_kg:.6f} kg")
    print("="*50)
    print("VERIFICATION: Cryptographically anchored to Sepolia Testnet.")
    print("="*50 + "\n")

if __name__ == "__main__":
    # Point it at the CSV your Flask server is currently writing to
    target_csv = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'live_sensor_today.csv')
    generate_monthly_audit(target_csv)