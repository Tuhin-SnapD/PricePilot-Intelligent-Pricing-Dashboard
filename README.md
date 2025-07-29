# PricePilot: AI-Powered Pricing Optimization Tool

<div align="center">

![PricePilot Logo](https://img.shields.io/badge/PricePilot-AI%20Powered%20Pricing-blue?style=for-the-badge&logo=robot)
![Python](https://img.shields.io/badge/Python-3.8+-green?style=for-the-badge&logo=python)
![React](https://img.shields.io/badge/React-18.0+-blue?style=for-the-badge&logo=react)
![Django](https://img.shields.io/badge/Django-4.0+-green?style=for-the-badge&logo=django)

**Revolutionary AI-powered pricing optimization platform that combines advanced machine learning algorithms with intuitive user experience to maximize profitability and market competitiveness.**

[🚀 Quick Start](#quick-start) • [📊 Features](#features) • [🧠 ML Models](#machine-learning-models) • [🔧 Installation](#installation) • [📚 Documentation](#documentation)

</div>

---

## 🎯 Overview

PricePilot is a comprehensive pricing optimization platform that leverages cutting-edge machine learning algorithms to help businesses make data-driven pricing decisions. The platform combines multiple AI models to analyze market conditions, predict demand, optimize pricing strategies, and provide actionable insights for maximizing profitability.

### Key Capabilities

- **🤖 Multi-Algorithm Optimization**: Combines multiple ML models for robust pricing recommendations
- **📈 Advanced Demand Forecasting**: Predicts future demand using ensemble forecasting methods
- **💰 Price Elasticity Analysis**: Analyzes price sensitivity across product categories
- **📊 A/B Testing Simulation**: Simulates different pricing strategies and their outcomes
- **🎯 Inventory-Aware Pricing**: Considers stock levels in pricing decisions
- **🔍 Transparent Justification**: Provides clear explanations for all recommendations

---

## 🧠 Machine Learning Models

PricePilot implements a sophisticated ensemble of machine learning algorithms, each designed to address specific aspects of pricing optimization. Here's a comprehensive breakdown of each model:

### 1. **Price Optimization Algorithm** (`optimization.py`)

**Algorithm Type**: Mathematical Optimization with Price Elasticity

**Core Function**: `optimize_price(cost_price, current_price, demand_elasticity, max_price_factor, base_demand, steps)`

**How It Works**:
```python
# Price elasticity model: Q = Q₀ × (P/P₀)^ε
# Where: Q = quantity demanded, P = price, ε = elasticity coefficient
prices = np.linspace(cost_price, cost_price * max_price_factor, steps)
demands = base_demand * (prices / current_price) ** demand_elasticity
profits = (prices - cost_price) * demands
optimal_price = prices[np.argmax(profits)]
```

**Key Features**:
- **Price Elasticity Modeling**: Uses economic elasticity theory to model demand response
- **Profit Maximization**: Finds the price point that maximizes total profit
- **Configurable Parameters**: Adjustable elasticity, price ranges, and demand baselines
- **Mathematical Precision**: Uses NumPy for efficient numerical optimization

**Mathematical Foundation**:
- **Elasticity Formula**: ε = (ΔQ/Q) / (ΔP/P)
- **Demand Function**: Q = Q₀ × (P/P₀)^ε
- **Profit Function**: π = (P - C) × Q
- **Optimality Condition**: ∂π/∂P = 0

### 2. **Advanced Demand Forecasting** (`forecasts.py`)

**Algorithm Type**: Ensemble Time Series Forecasting

**Core Class**: `AdvancedDemandForecaster`

#### 2.1 Linear Regression Forecast
```python
def simple_linear_forecast(self, historical_years: Dict) -> int:
    years = np.array([int(year) for year in historical_years.keys()])
    values = np.array([historical_years[year] for year in historical_years.keys()])
    slope, intercept = np.polyfit(years, values, 1)
    next_year = years.max() + 1
    forecast = intercept + slope * next_year
```

**Use Case**: Best for products with consistent linear growth trends

#### 2.2 Exponential Smoothing Forecast
```python
def exponential_smoothing_forecast(self, historical_years: Dict, alpha: float = 0.3) -> int:
    # Holt's method with trend adjustment
    s = [values[0]]  # Level
    b = [values[1] - values[0]]  # Trend
    
    for i in range(1, len(values)):
        s_new = alpha * values[i] + (1 - alpha) * (s[i-1] + b[i-1])
        b_new = 0.2 * (s_new - s[i-1]) + 0.8 * b[i-1]
        s.append(s_new)
        b.append(b_new)
    
    forecast = s[-1] + b[-1]
```

**Use Case**: Ideal for products with trend and seasonal patterns

#### 2.3 Moving Average Forecast
```python
def moving_average_forecast(self, historical_years: Dict, window: int = 3) -> int:
    # Calculate moving average with trend projection
    ma_values = []
    for i in range(window - 1, len(values)):
        ma_values.append(np.mean(values[i-window+1:i+1]))
    
    ma_trend = (ma_values[-1] - ma_values[0]) / len(ma_values)
    forecast = ma_values[-1] + ma_trend
```

**Use Case**: Effective for smoothing out random fluctuations

#### 2.4 Seasonal Decomposition Forecast
```python
def seasonal_decomposition_forecast(self, historical_years: Dict) -> int:
    # Decompose into trend + seasonal + residual components
    x = np.arange(len(values))
    slope, intercept = np.polyfit(x, values, 1)
    trend = [intercept + slope * i for i in x]
    
    detrended = [values[i] - trend[i] for i in range(len(values))]
    seasonal = np.mean(detrended)
    
    next_trend = intercept + slope * len(values)
    forecast = next_trend + seasonal
```

**Use Case**: Perfect for products with strong seasonal patterns

#### 2.5 Ensemble Forecast
```python
def ensemble_forecast(self, historical_years: Dict) -> Dict[str, int]:
    forecasts = {
        'linear': self.simple_linear_forecast(historical_years),
        'exponential': self.exponential_smoothing_forecast(historical_years),
        'moving_average': self.moving_average_forecast(historical_years),
        'seasonal': self.seasonal_decomposition_forecast(historical_years)
    }
    
    # Weighted ensemble
    weights = {'linear': 0.25, 'exponential': 0.35, 'moving_average': 0.25, 'seasonal': 0.15}
    ensemble_forecast = sum(forecasts[method] * weights[method] for method in forecasts)
```

**Advantages**:
- **Robustness**: Combines multiple methods to reduce individual model errors
- **Adaptability**: Different weights for different forecasting scenarios
- **Confidence Scoring**: Calculates confidence based on model agreement

### 3. **Advanced Price Optimization** (`advanced_optimization.py`)

**Algorithm Type**: Multi-Factor Machine Learning Optimization

#### 3.1 Price Elasticity Analyzer
```python
class PriceElasticityAnalyzer:
    def calculate_elasticity(self, price_history: List[float], demand_history: List[float]) -> float:
        # Log-log regression for elasticity calculation
        log_prices = np.log(price_history)
        log_demands = np.log(demand_history)
        
        model = LinearRegression()
        model.fit(log_prices.reshape(-1, 1), log_demands)
        elasticity = model.coef_[0]
```

**Features**:
- **Category-Specific Elasticity**: Different elasticity values for different product categories
- **Heatmap Generation**: Visual representation of elasticity across categories
- **Insight Generation**: Automated insights based on elasticity values

#### 3.2 ML Price Optimizer
```python
class MLPriceOptimizer:
    def extract_features(self, product: Dict) -> np.ndarray:
        features = [
            float(product.get('cost_price', 0)),
            float(product.get('selling_price', 0)),
            float(product.get('stock_available', 0)),
            float(product.get('units_sold', 0)),
            float(product.get('customer_rating', 0)),
            hash(str(product.get('category', ''))) % 1000,  # Category encoding
            float(product.get('demand_forecast_value', 0))
        ]
        return np.array(features).reshape(1, -1)
```

**ML Model**: Random Forest Regressor (with fallback implementation)
- **Features**: Cost price, selling price, stock levels, sales history, customer ratings, category, demand forecast
- **Target**: Optimal price ratio (selling_price / cost_price)
- **Training**: Uses historical product data to learn optimal pricing patterns

#### 3.3 Inventory-Aware Optimizer
```python
class InventoryAwareOptimizer:
    def adjust_price_for_inventory(self, base_price: float, inventory_status: str, 
                                 current_demand: float, elasticity: float) -> float:
        adjustments = {
            'low': 1.15,      # Increase price by 15% when stock is low
            'medium': 1.05,   # Increase price by 5% when stock is medium
            'adequate': 1.0,  # No adjustment
            'high': 0.95,     # Decrease price by 5% when stock is high
        }
        
        adjustment_factor = adjustments.get(inventory_status, 1.0)
        return base_price * adjustment_factor
```

**Logic**:
- **Low Stock**: Increase prices to maximize revenue from limited inventory
- **High Stock**: Decrease prices to stimulate demand and reduce holding costs
- **Dynamic Adjustment**: Real-time price adjustments based on inventory levels

#### 3.4 A/B Testing Simulator
```python
class ABTestingSimulator:
    def simulate_strategy(self, product: Dict, strategy_name: str, 
                         elasticity: float = -1.5) -> Dict[str, Any]:
        strategies = {
            'penetration': {'price_factor': 0.9, 'description': 'Low price to gain market share'},
            'skimming': {'price_factor': 1.3, 'description': 'High price for premium positioning'},
            'competitive': {'price_factor': 1.0, 'description': 'Match competitor pricing'},
            'cost_plus': {'price_factor': 1.2, 'description': 'Cost plus 20% margin'},
            'value_based': {'price_factor': 1.1, 'description': 'Price based on perceived value'}
        }
```

**Simulation Capabilities**:
- **Multiple Strategies**: Tests 5 different pricing strategies
- **Outcome Prediction**: Estimates revenue, profit, and demand for each strategy
- **Comparative Analysis**: Ranks strategies by profitability
- **Risk Assessment**: Evaluates trade-offs between different approaches

#### 3.5 Justification Engine
```python
class JustificationEngine:
    def generate_justification(self, product: Dict, recommended_price: float, 
                             factors_used: List[str]) -> Dict[str, Any]:
        justification = {
            'recommended_price': round(recommended_price, 2),
            'current_price': round(current_price, 2),
            'price_change_percent': round(price_change, 1),
            'factors': [],
            'summary': '',
            'confidence': 0.85
        }
```

**Transparency Features**:
- **Factor Analysis**: Explains which factors influenced the recommendation
- **Impact Assessment**: Quantifies the impact of each factor
- **Human-Readable Summary**: Provides clear, actionable explanations
- **Confidence Scoring**: Indicates the reliability of recommendations

### 4. **Model Integration and Ensemble Approach**

The PricePilot system uses a sophisticated ensemble approach that combines multiple models:

```python
def advanced_optimize_price(product: Dict) -> Dict[str, Any]:
    # Initialize all components
    elasticity_analyzer = PriceElasticityAnalyzer()
    ml_optimizer = MLPriceOptimizer()
    inventory_optimizer = InventoryAwareOptimizer()
    ab_simulator = ABTestingSimulator()
    justification_engine = JustificationEngine()
    
    # Multi-stage optimization
    ml_price, ml_confidence = ml_optimizer.predict_optimal_price(product)
    inventory_adjusted_price = inventory_optimizer.adjust_price_for_inventory(
        ml_price, inventory_status, demand_forecast, elasticity
    )
    
    # Generate comprehensive results
    ab_results = ab_simulator.compare_strategies(product, elasticity)
    justification = justification_engine.generate_justification(
        product, recommended_price, factors_used
    )
```

**Ensemble Benefits**:
- **Reduced Overfitting**: Multiple models reduce the risk of overfitting to specific patterns
- **Improved Accuracy**: Combines strengths of different algorithms
- **Robustness**: System continues to work even if individual models fail
- **Comprehensive Insights**: Provides multiple perspectives on pricing decisions

---

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/price-optimiser-tool.git
   cd price-optimiser-tool
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd price-optimiser-backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   
   # Install frontend dependencies
   cd ../price-optimiser-frontend
   npm install
   ```

3. **Run the application**
   ```bash
   # Start backend (from price-optimiser-backend directory)
   python manage.py runserver
   
   # Start frontend (from price-optimiser-frontend directory)
   npm start
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000

### Quick Test
```bash
python comprehensive_test_suite.py
```

---

## 📊 Features

### Core Features
- **🤖 AI-Powered Pricing**: Advanced ML algorithms for optimal pricing
- **📈 Demand Forecasting**: Multi-algorithm ensemble forecasting
- **💰 Price Optimization**: Mathematical optimization with elasticity modeling
- **📊 Analytics Dashboard**: Comprehensive insights and visualizations
- **🔄 A/B Testing**: Simulate different pricing strategies
- **📦 Inventory Management**: Stock-aware pricing recommendations
- **👥 User Management**: Role-based access control
- **📱 Responsive UI**: Modern, intuitive interface

### Advanced Features
- **🎯 Elasticity Heatmap**: Visual price sensitivity analysis
- **🧠 ML Optimization**: Machine learning-based price recommendations
- **📊 Performance Metrics**: Real-time optimization success tracking
- **🔍 Transparent Justification**: Clear explanations for all recommendations
- **📈 Trend Analysis**: Historical performance tracking
- **🔄 Auto-Save**: Automatic form saving and validation
- **📤 Data Export**: CSV export functionality
- **🔐 Secure Authentication**: Token-based authentication

---

## 🏗️ Architecture

### Backend (Django + Python)
```
price-optimiser-backend/
├── products/
│   ├── optimization.py          # Core price optimization algorithm
│   ├── forecasts.py             # Demand forecasting models
│   ├── advanced_optimization.py # Advanced ML optimization
│   ├── models.py               # Database models
│   └── views.py                # API endpoints
├── users/
│   ├── models.py               # User management
│   └── views.py                # Authentication
└── pricing_tool/
    └── settings.py             # Django configuration
```

### Frontend (React + TypeScript)
```
price-optimiser-frontend/
├── src/
│   ├── components/
│   │   ├── analytics/          # Analytics dashboard components
│   │   ├── optimization/       # Pricing optimization UI
│   │   ├── products/          # Product management
│   │   └── common/            # Shared components
│   ├── contexts/              # React contexts
│   └── api.js                 # API integration
└── package.json
```

---

## 📚 Documentation

### API Documentation
- **Products API**: `/api/products/`
- **Users API**: `/api/users/`
- **Optimization API**: `/api/products/optimize/`
- **Forecasting API**: `/api/products/forecast/`

### Machine Learning Models
- **Price Optimization**: Mathematical optimization with elasticity modeling
- **Demand Forecasting**: Ensemble time series forecasting
- **ML Price Optimizer**: Random Forest-based price prediction
- **A/B Testing**: Strategy simulation and comparison

### User Guides
- [Quick Start Guide](QUICK_START.md)
- [Advanced Features Guide](ADVANCED_FEATURES_GUIDE.md)
- [API Testing Guide](API_TESTING_GUIDE.md)

---

## 🧪 Testing

### Comprehensive Test Suite
```bash
# Run all tests
python comprehensive_test_suite.py

# Run specific test categories
python comprehensive_test_suite.py --api-only
python comprehensive_test_suite.py --frontend-only
python comprehensive_test_suite.py --ml-only
```

### Test Coverage
- ✅ Backend API testing
- ✅ Frontend functionality testing
- ✅ Machine learning model validation
- ✅ User authentication testing
- ✅ Database connectivity testing
- ✅ System integration testing

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **NumPy**: For efficient numerical computations
- **Django**: For robust backend framework
- **React**: For modern frontend development
- **Tailwind CSS**: For beautiful, responsive UI
- **Machine Learning Community**: For inspiration and algorithms

---

## 📞 Support

- **Documentation**: [GitHub Wiki](https://github.com/your-username/price-optimiser-tool/wiki)
- **Issues**: [GitHub Issues](https://github.com/your-username/price-optimiser-tool/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/price-optimiser-tool/discussions)

---

<div align="center">

**Made with ❤️ by the PricePilot Team**

[![GitHub stars](https://img.shields.io/github/stars/your-username/price-optimiser-tool?style=social)](https://github.com/your-username/price-optimiser-tool)
[![GitHub forks](https://img.shields.io/github/forks/your-username/price-optimiser-tool?style=social)](https://github.com/your-username/price-optimiser-tool)
[![GitHub issues](https://img.shields.io/github/issues/your-username/price-optimiser-tool)](https://github.com/your-username/price-optimiser-tool/issues)

</div>
