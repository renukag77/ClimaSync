import pandas as pd
import numpy as np
import os
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error
from datetime import timedelta

DATA_DIR = 'Data'
TIME_SLOTS = {
    'Morning': (5, 11),
    'Afternoon': (12, 16),
    'Evening': (17, 20),
    'Night': (21, 23)  # We'll include 0-4 separately
}

def get_time_of_day(hour):
    if 5 <= hour <= 11:
        return 'Morning'
    elif 12 <= hour <= 16:
        return 'Afternoon'
    elif 17 <= hour <= 20:
        return 'Evening'
    else:
        return 'Night'

def load_and_preprocess(filepath):
    df = pd.read_csv(filepath, parse_dates=['Timestamp'])
    df['Hour'] = df['Timestamp'].dt.hour
    df['Day'] = df['Timestamp'].dt.day
    df['Month'] = df['Timestamp'].dt.month
    df['Weekday'] = df['Timestamp'].dt.weekday
    df['TimeOfDay'] = df['Hour'].apply(get_time_of_day)
    return df

def prepare_training_data(df):
    df['Timestamp'] = pd.to_datetime(df['Timestamp'])
    df = df.sort_values('Timestamp')
    
    features = ['Hour', 'Day', 'Month', 'Weekday']
    X = df[features]
    y = df['Temperature']
    
    return train_test_split(X, y, test_size=0.2, random_state=42)

def train_model(X_train, y_train):
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    return model

def generate_future_inputs(start_date, days=5):
    future_rows = []
    for i in range(days):
        day = start_date + timedelta(days=i)
        for slot in TIME_SLOTS:
            hour = (TIME_SLOTS[slot][0] + TIME_SLOTS[slot][1]) // 2
            future_rows.append({
                'Hour': hour,
                'Day': day.day,
                'Month': day.month,
                'Weekday': day.weekday(),
                'TimeOfDay': slot
            })
    return pd.DataFrame(future_rows)

def predict_future(model, future_df):
    features = ['Hour', 'Day', 'Month', 'Weekday']
    preds = model.predict(future_df[features])
    future_df['PredictedTemperature'] = preds
    return future_df

def main():
    city = "Mumbai"
    filepath = os.path.join(DATA_DIR, f"{city}.csv")
    print(f"Loading and training on data for {city}...")

    df = load_and_preprocess(filepath)
    X_train, X_test, y_train, y_test = prepare_training_data(df)
    
    model = train_model(X_train, y_train)
    y_pred = model.predict(X_test)

    mse = mean_squared_error(y_test, y_pred)
    print(f"Model trained! MSE on test data: {mse:.2f}")

    last_date = df['Timestamp'].max()
    future_inputs = generate_future_inputs(last_date + timedelta(days=1))
    predictions = predict_future(model, future_inputs)

    print("\n📅 Forecast for next 5 days:")
    for _, row in predictions.iterrows():
        print(f"{row['TimeOfDay']} | Day {int(row['Day'])} | Temp: {row['PredictedTemperature']:.2f}°C")

if __name__ == "__main__":
    main()
