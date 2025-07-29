import numpy as np
import ast
from typing import Dict, List, Tuple, Optional
import logging

logger = logging.getLogger(__name__)

class AdvancedDemandForecaster:
    """Advanced demand forecasting with multiple algorithms"""
    
    def __init__(self):
        self.forecast_cache = {}
    
    def simple_linear_forecast(self, historical_years: Dict) -> int:
        """Linear regression forecast"""
        if isinstance(historical_years, str):
            try:
                historical_years = ast.literal_eval(historical_years)
            except Exception:
                return 0

        if not isinstance(historical_years, dict) or len(historical_years) < 2:
            return self._get_last_value(historical_years)

        years = np.array([int(year) for year in historical_years.keys()])
        values = np.array([historical_years[year] for year in historical_years.keys()])
        
        slope, intercept = np.polyfit(years, values, 1)
        next_year = years.max() + 1
        forecast = intercept + slope * next_year
        return max(int(forecast), 0)
    
    def exponential_smoothing_forecast(self, historical_years: Dict, alpha: float = 0.3) -> int:
        """Exponential smoothing forecast with trend adjustment"""
        if isinstance(historical_years, str):
            try:
                historical_years = ast.literal_eval(historical_years)
            except Exception:
                return 0

        if not isinstance(historical_years, dict) or len(historical_years) < 2:
            return self._get_last_value(historical_years)

        years = sorted([int(year) for year in historical_years.keys()])
        values = [historical_years[str(year)] for year in years]
        
        # Initialize
        s = [values[0]]  # Level
        b = [values[1] - values[0]]  # Trend
        
        # Apply exponential smoothing with trend
        for i in range(1, len(values)):
            s_new = alpha * values[i] + (1 - alpha) * (s[i-1] + b[i-1])
            b_new = 0.2 * (s_new - s[i-1]) + 0.8 * b[i-1]
            s.append(s_new)
            b.append(b_new)
        
        # Forecast next period
        forecast = s[-1] + b[-1]
        return max(int(forecast), 0)
    
    def moving_average_forecast(self, historical_years: Dict, window: int = 3) -> int:
        """Moving average forecast with trend projection"""
        if isinstance(historical_years, str):
            try:
                historical_years = ast.literal_eval(historical_years)
            except Exception:
                return 0

        if not isinstance(historical_years, dict) or len(historical_years) < window:
            return self._get_last_value(historical_years)

        years = sorted([int(year) for year in historical_years.keys()])
        values = [historical_years[str(year)] for year in years]
        
        # Calculate moving average
        ma_values = []
        for i in range(window - 1, len(values)):
            ma_values.append(np.mean(values[i-window+1:i+1]))
        
        if len(ma_values) < 2:
            return int(ma_values[-1]) if ma_values else 0
        
        # Calculate trend from moving averages
        ma_trend = (ma_values[-1] - ma_values[0]) / len(ma_values)
        
        # Project forward
        forecast = ma_values[-1] + ma_trend
        return max(int(forecast), 0)
    
    def seasonal_decomposition_forecast(self, historical_years: Dict) -> int:
        """Seasonal decomposition forecast (simplified)"""
        if isinstance(historical_years, str):
            try:
                historical_years = ast.literal_eval(historical_years)
            except Exception:
                return 0

        if not isinstance(historical_years, dict) or len(historical_years) < 4:
            return self._get_last_value(historical_years)

        years = sorted([int(year) for year in historical_years.keys()])
        values = [historical_years[str(year)] for year in years]
        
        # Calculate trend using linear regression
        x = np.arange(len(values))
        slope, intercept = np.polyfit(x, values, 1)
        trend = [intercept + slope * i for i in x]
        
        # Calculate seasonal component (simplified)
        detrended = [values[i] - trend[i] for i in range(len(values))]
        seasonal = np.mean(detrended) if detrended else 0
        
        # Forecast
        next_trend = intercept + slope * len(values)
        forecast = next_trend + seasonal
        return max(int(forecast), 0)
    
    def ensemble_forecast(self, historical_years: Dict) -> Dict[str, int]:
        """Ensemble forecast combining multiple methods"""
        forecasts = {}
        
        # Linear forecast
        forecasts['linear'] = self.simple_linear_forecast(historical_years)
        
        # Exponential smoothing
        forecasts['exponential'] = self.exponential_smoothing_forecast(historical_years)
        
        # Moving average
        forecasts['moving_average'] = self.moving_average_forecast(historical_years)
        
        # Seasonal decomposition
        forecasts['seasonal'] = self.seasonal_decomposition_forecast(historical_years)
        
        # Weighted ensemble (give more weight to recent methods)
        weights = {'linear': 0.25, 'exponential': 0.35, 'moving_average': 0.25, 'seasonal': 0.15}
        ensemble_forecast = sum(forecasts[method] * weights[method] for method in forecasts)
        
        forecasts['ensemble'] = max(int(ensemble_forecast), 0)
        forecasts['confidence'] = self._calculate_confidence(forecasts)
        
        return forecasts
    
    def _get_last_value(self, historical_years) -> int:
        """Get the last known value as fallback"""
        if isinstance(historical_years, dict) and historical_years:
            return int(list(historical_years.values())[-1])
        return 0
    
    def _calculate_confidence(self, forecasts: Dict[str, int]) -> float:
        """Calculate confidence based on forecast agreement"""
        values = list(forecasts.values())[:-2]  # Exclude ensemble and confidence
        if not values:
            return 0.5
        
        # Calculate coefficient of variation
        mean_val = np.mean(values)
        std_val = np.std(values)
        
        if mean_val == 0:
            return 0.5
        
        cv = std_val / mean_val
        # Convert to confidence (lower CV = higher confidence)
        confidence = max(0.1, min(0.95, 1 - cv))
        return round(confidence, 2)

# Backward compatibility function
def simple_linear_forecast(historical_years):
    """Legacy function for backward compatibility"""
    forecaster = AdvancedDemandForecaster()
    return forecaster.simple_linear_forecast(historical_years)

def advanced_forecast(historical_years: Dict) -> Dict[str, int]:
    """Advanced forecasting with multiple algorithms"""
    forecaster = AdvancedDemandForecaster()
    return forecaster.ensemble_forecast(historical_years)
