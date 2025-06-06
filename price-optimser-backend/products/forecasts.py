import numpy as np

def simple_linear_forecast(historical_years):
    """
    Forecasts next year's demand from historical data.
    Accepts either dict or stringified dict.
    """
    if isinstance(historical_years, str):
        try:
            historical_years = ast.literal_eval(historical_years)
        except Exception:
            return 0  # fallback if string is malformed

    if not isinstance(historical_years, dict):
        return 0

    years = np.array([int(year) for year in historical_years.keys()])
    values = np.array([historical_years[year] for year in historical_years.keys()])
    
    if len(years) < 2:
        return int(values[-1]) if values.size > 0 else 0
    
    slope, intercept = np.polyfit(years, values, 1)
    next_year = years.max() + 1
    forecast = intercept + slope * next_year
    return max(int(forecast), 0)
