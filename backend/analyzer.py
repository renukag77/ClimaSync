def analyze_weather(df):
    return {
        "hottest_day": df.iloc[-1].to_dict(),
        "coldest_day": df.iloc[0].to_dict(),
        "average_temperature": round(df['Temperature'].mean(), 2),
        "average_humidity": round(df['Humidity'].mean(), 2),
        "average_rainfall": round(df['Rainfall'].mean(), 2)
    }
