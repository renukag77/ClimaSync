# main.py

from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from sorter import merge_sort, quick_sort

app = FastAPI()

# Enable frontend calls
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/filter")
def filter_weather_data(
    city: str = Query(...),
    parameter: str = Query(...),  # e.g., Temperature
    algo: str = Query("merge"),   # merge or quick
    top_n: int = Query(10),       # Top 10 by default
    order: str = Query("desc")    # asc or desc
):
    try:
        df = pd.read_csv(f"data/{city}.csv")
    except FileNotFoundError:
        return {"error": "City not found"}

    if parameter not in df.columns:
        return {"error": "Invalid parameter"}

    values = df[parameter].tolist()

    sorted_values = merge_sort(values.copy()) if algo == "merge" else quick_sort(values.copy())
    if order == "desc":
        sorted_values = sorted_values[::-1]

    top_values = sorted_values[:top_n]
    
    # Get corresponding rows
    filtered_df = df[df[parameter].isin(top_values)]

    # Return dictionary
    return filtered_df.to_dict(orient="records")
