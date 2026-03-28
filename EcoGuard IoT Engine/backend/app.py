import pandas as pd
import datetime
import joblib
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_FILE = os.path.join(BASE_DIR, 'daily_emission_model.joblib')

# 1. Load the trained AI brain
model = joblib.load(MODEL_FILE)

def predict_end_of_day_total(today_csv_file):
    now = datetime.datetime.now()
    day_of_week = now.weekday()
    click_hour = now.hour
    click_minute = now.minute
    
    try:
        live_data = pd.read_csv(today_csv_file)
        
        # --- THE MATH FIX ---
        # Average the 10-second readings into 1-minute chunks
        live_data['Timestamp'] = pd.to_datetime(live_data['Timestamp'])
        minute_averaged_data = live_data.set_index('Timestamp').resample('1min')['Raw_ADC'].mean()
        
        # Sum the averaged minutes
        current_cumulative_sum = float(minute_averaged_data.dropna().sum())
        
    except FileNotFoundError:
        print("No data collected from sensor today yet!")
        return None, None

    # Package the data
    ai_input = [[day_of_week, click_hour, click_minute, current_cumulative_sum]]
    
    # Get the prediction
    predicted_final_total = model.predict(ai_input)[0]
    
    return predicted_final_total, current_cumulative_sum

# --- To test this file in your terminal, uncomment the lines below ---
# if __name__ == "__main__":
#     csv_path = os.path.join(BASE_DIR, 'live_sensor_today.csv')
#     predicted_total, current_sum = predict_end_of_day_total(csv_path)
#     if predicted_total is not None:
#         print(f"Gas measured so far (Averaged Sum): {current_sum:.2f}")
#         print(f"AI Predicts Final Midnight Total will be: {predicted_total:.2f}")