import pandas as pd
import numpy as np
import os
import matplotlib.pyplot as plt
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error
from datetime import timedelta

DATA_DIR = 'Data'
TIME_SLOTS = {
    'Morning': (5, 11),
    'Afternoon': (12, 16),
    'Evening': (17, 20),
    'Night': (21, 23)
}

target_columns = ['Temperature', 'Humidity', 'Rainfall', 'WindSpeed', 'Pressure']

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

def prepare_training_data(df, target):
    df = df.sort_values('Timestamp')
    features = ['Hour', 'Day', 'Month', 'Weekday']
    X = df[features]
    y = df[target]
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
                'Date': day.date(),
                'Hour': hour,
                'Day': day.day,
                'Month': day.month,
                'Weekday': day.weekday(),
                'TimeOfDay': slot
            })
    return pd.DataFrame(future_rows)

def predict_future(model, future_df, target_name):
    features = ['Hour', 'Day', 'Month', 'Weekday']
    preds = model.predict(future_df[features])
    future_df[f'Predicted_{target_name}'] = preds
    return future_df

def plot_comparison(df, predictions, target, city):
    plt.figure(figsize=(12, 6))
    recent_data = df[['Timestamp', target]].dropna().sort_values('Timestamp').tail(100)
    plt.plot(recent_data['Timestamp'], recent_data[target], label='Historical')

    # For predictions, combine Date + Hour into datetime
    preds_df = predictions.copy()
    preds_df['Timestamp'] = pd.to_datetime(preds_df['Date'].astype(str)) + preds_df['Hour'].apply(lambda h: timedelta(hours=h))
    plt.plot(preds_df['Timestamp'], preds_df[f'Predicted_{target}'], label='Forecast', linestyle='--')

    plt.title(f"{target} Forecast for {city}")
    plt.xlabel("Date")
    plt.ylabel(target)
    plt.legend()
    plt.grid(True)
    plt.tight_layout()
    plt.savefig(f"{target}_forecast_{city}.png")
    plt.show()

def main():
    city = "Mumbai"
    filepath = os.path.join(DATA_DIR, f"{city}.csv")
    print(f"📥 Loading and training on data for {city}...")

    df = load_and_preprocess(filepath)
    last_date = df['Timestamp'].max()

    models = {}
    future_inputs = generate_future_inputs(last_date + timedelta(days=1))

    print("\n📊 Training models and generating predictions...\n")

    for target in target_columns:
        print(f"🎯 Target: {target}")

        if target not in df.columns:
            print(f"⚠️ Skipping {target} — not found in dataset.\n")
            continue

        X_train, X_test, y_train, y_test = prepare_training_data(df, target)
        model = train_model(X_train, y_train)
        y_pred = model.predict(X_test)
        mse = mean_squared_error(y_test, y_pred)
        print(f"✅ Trained {target} model — MSE: {mse:.2f}")

        future_inputs = predict_future(model, future_inputs, target)
        models[target] = model

        plot_comparison(df, future_inputs, target, city)
        print()

    print("📅 Forecast for the next 5 days:\n")
    grouped = future_inputs.groupby(['Date', 'TimeOfDay'])
    for (date, time_of_day), group in grouped:
        output = f"{date} | {time_of_day}"
        for target in target_columns:
            col = f"Predicted_{target}"
            if col in group.columns:
                val = group[col].values[0]
                output += f" | {target}: {val:.2f}"
        print(output)

if __name__ == "__main__":
    main()
