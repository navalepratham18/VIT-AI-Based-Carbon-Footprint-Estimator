import pandas as pd
import joblib
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_absolute_percentage_error
from sklearn.model_selection import train_test_split

print("Loading synthetic dataset...")
df = pd.read_csv('daily_MQ-7_data.csv')

features = ['Day_Of_Week', 'Click_Hour', 'Click_Minute', 'Current_Cumulative_Sum']
X = df[features]
y = df['Target_Final_Daily_Sum']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

print("Training Daily Prediction Model (Random Forest)...")
model = RandomForestRegressor(n_estimators=100, max_depth=15, random_state=42)
model.fit(X_train, y_train)

# Evaluate the model
predictions = model.predict(X_test)
mae = mean_absolute_error(y_test, predictions)
mape = mean_absolute_percentage_error(y_test, predictions) * 100

print(f"\n--- Model Performance ---")
print(f"Mean Absolute Error: {mae:.0f} ADC points")
print(f"Average Error Percentage: {mape:.2f}%")

# Save the model to the backend folder so Flask can use it directly
joblib.dump(model, 'backend/daily_emission_model.joblib')
print("\nSuccess! Model saved to the backend directory as 'daily_emission_model.joblib'")