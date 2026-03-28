
import pandas as pd
import numpy as np

print("Generating non-linear synthetic emission data...")

records = []
# Simulate 100 days of historical data
for day in range(100):
    day_of_week = day % 7
    # Weekends (5, 6) have 30% lower overall emissions
    base_multiplier = 0.7 if day_of_week >= 5 else 1.0 
    
    minute_emissions = []
    
    # 1. Simulate the actual emissions for every minute of the day
    for hour in range(24):
        for minute in range(60):
            # Rush Hour (8-10 AM and 5-7 PM)
            if (8 <= hour <= 9) or (17 <= hour <= 18):
                emission = np.random.normal(500, 100) * base_multiplier
            # Night time (Midnight to 6 AM, and after 10 PM)
            elif hour < 6 or hour > 22:
                emission = np.random.normal(50, 20) * base_multiplier
            # Normal daytime traffic
            else:
                emission = np.random.normal(200, 50) * base_multiplier
            
            minute_emissions.append(max(0, emission)) # No negative emissions
            
    # The absolute final total for this specific day
    target_final_daily_sum = sum(minute_emissions)
    
    # 2. Create the snapshot records (what the API will actually see)
    current_cumulative_sum = 0
    time_index = 0
    for hour in range(24):
        for minute in range(60):
            current_cumulative_sum += minute_emissions[time_index]
            time_index += 1
            
            # We don't need a row for every single minute, saving every 15 mins is enough for training
            if minute % 15 == 0:
                records.append([
                    day_of_week, 
                    hour, 
                    minute, 
                    round(current_cumulative_sum, 2), 
                    round(target_final_daily_sum, 2)
                ])

# Save to CSV
df = pd.DataFrame(records, columns=['Day_Of_Week', 'Click_Hour', 'Click_Minute', 'Current_Cumulative_Sum', 'Target_Final_Daily_Sum'])
df.to_csv('daily_MQ-7_data.csv', index=False)

print(f"Success! Generated {len(df)} rows of training data with realistic traffic curves.")