# PricePilot Backend

<div align="center">

![Python](https://img.shields.io/badge/Python-3.8+-green?style=for-the-badge&logo=python)
![Django](https://img.shields.io/badge/Django-4.0+-green?style=for-the-badge&logo=django)
![NumPy](https://img.shields.io/badge/NumPy-1.21+-blue?style=for-the-badge&logo=numpy)
![Machine Learning](https://img.shields.io/badge/ML-Powered-orange?style=for-the-badge&logo=robot)

**Advanced Django REST API backend powering PricePilot's AI-driven pricing optimization platform. Features sophisticated machine learning algorithms, demand forecasting, and intelligent pricing strategies.**

[🚀 Quick Start](#quick-start) • [🧠 ML Models](#machine-learning-models) • [📊 API Endpoints](#api-endpoints) • [🏗️ Architecture](#architecture) • [🔧 Development](#development)

</div>

---

## 🎯 Overview

The PricePilot Backend is a sophisticated Django REST API that provides the computational engine for AI-powered pricing optimization. It implements advanced machine learning algorithms, demand forecasting models, and intelligent pricing strategies to help businesses maximize profitability through data-driven decisions.

### Key Capabilities

- **🤖 Multi-Algorithm Optimization**: Combines multiple ML models for robust pricing recommendations
- **📈 Advanced Demand Forecasting**: Ensemble forecasting with multiple algorithms
- **💰 Price Elasticity Analysis**: Economic modeling of price sensitivity
- **📊 A/B Testing Simulation**: Strategy comparison and outcome prediction
- **🎯 Inventory-Aware Pricing**: Stock-level consideration in pricing decisions
- **🔍 Transparent Justification**: Clear explanations for all recommendations

---

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- pip
- Git
- Virtual environment (recommended)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Tuhin-SnapD/PricePilot-Intelligent-Pricing-Dashboard
   cd price-optimiser-backend
   ```

2. **Set up virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment**
   ```bash
   cp env.example .env
   # Edit .env with your settings
   ```

5. **Run migrations**
   ```bash
   python manage.py migrate
   ```

6. **Create superuser (optional)**
   ```bash
   python manage.py createsuperuser
   ```

7. **Start the server**
   ```bash
   python manage.py runserver
   ```

8. **Access the API**
   - API Root: http://localhost:8000/api/
   - Admin Panel: http://localhost:8000/admin/

---

## 🧠 Machine Learning Models

### 1. Price Optimization Algorithm (`optimization.py`)

**Algorithm Type**: Mathematical Optimization with Price Elasticity

**Core Function**: `optimize_price(cost_price, current_price, demand_elasticity, max_price_factor, base_demand, steps)`

**Mathematical Foundation**:
```python
# Price elasticity model: Q = Q₀ × (P/P₀)^ε
# Where: Q = quantity demanded, P = price, ε = elasticity coefficient
prices = np.linspace(cost_price, cost_price * max_price_factor, steps)
demands = base_demand * (prices / current_price) ** demand_elasticity
profits = (prices - cost_price) * demands
optimal_price = prices[np.argmax(profits)]
```

**Key Features**:
- **Price Elasticity Modeling**: Uses economic elasticity theory
- **Profit Maximization**: Finds optimal price point
- **Configurable Parameters**: Adjustable elasticity and price ranges
- **Mathematical Precision**: NumPy-based numerical optimization

### 2. Advanced Demand Forecasting (`forecasts.py`)

**Algorithm Type**: Ensemble Time Series Forecasting

**Core Class**: `AdvancedDemandForecaster`

#### Available Algorithms:
- **Linear Regression**: Best for consistent linear growth trends
- **Exponential Smoothing**: Ideal for trend and seasonal patterns
- **Moving Average**: Effective for smoothing random fluctuations
- **Seasonal Decomposition**: Perfect for strong seasonal patterns
- **Ensemble Forecast**: Combines all methods with weighted averaging

**Ensemble Benefits**:
- **Robustness**: Reduces individual model errors
- **Adaptability**: Different weights for different scenarios
- **Confidence Scoring**: Model agreement-based confidence

### 3. Advanced Price Optimization (`advanced_optimization.py`)

**Algorithm Type**: Multi-Factor Machine Learning Optimization

#### Components:

**Price Elasticity Analyzer**:
```python
def calculate_elasticity(self, price_history: List[float], demand_history: List[float]) -> float:
    # Log-log regression for elasticity calculation
    log_prices = np.log(price_history)
    log_demands = np.log(demand_history)
    model = LinearRegression()
    model.fit(log_prices.reshape(-1, 1), log_demands)
    return model.coef_[0]
```

**ML Price Optimizer**:
- **Model**: Random Forest Regressor
- **Features**: Cost price, selling price, stock levels, sales history, customer ratings, category, demand forecast
- **Target**: Optimal price ratio (selling_price / cost_price)

**Inventory-Aware Optimizer**:
- **Low Stock**: Increase prices by 15%
- **Medium Stock**: Increase prices by 5%
- **Adequate Stock**: No adjustment
- **High Stock**: Decrease prices by 5%

**A/B Testing Simulator**:
- **Strategies**: Penetration, Skimming, Competitive, Cost-Plus, Value-Based
- **Simulation**: Revenue, profit, and demand estimation
- **Comparison**: Strategy ranking by profitability

**Justification Engine**:
- **Factor Analysis**: Explains recommendation influences
- **Impact Assessment**: Quantifies factor impacts
- **Human-Readable Summary**: Clear, actionable explanations
- **Confidence Scoring**: Recommendation reliability

---

## 📊 API Endpoints

### Authentication Endpoints
```
POST /api/users/login/          # User login
POST /api/users/register/       # User registration
POST /api/users/logout/         # User logout
GET  /api/users/profile/        # Get user profile
```

### Product Management
```
GET    /api/products/           # List all products
POST   /api/products/           # Create new product
GET    /api/products/{id}/      # Get specific product
PUT    /api/products/{id}/      # Update product
DELETE /api/products/{id}/      # Delete product
GET    /api/products/search/    # Search products
```

### AI & Analytics Endpoints
```
POST /api/products/optimize/    # Get pricing optimization
POST /api/products/forecast/    # Generate demand forecast
GET  /api/products/analytics/   # Get analytics data
POST /api/products/ab-test/     # A/B testing simulation
```

### Response Format
```json
{
  "success": true,
  "data": {
    "recommended_price": 29.99,
    "current_price": 25.00,
    "price_change_percent": 19.96,
    "confidence": 0.85,
    "factors": ["demand_forecast", "inventory_level"],
    "justification": "Price increased due to high demand forecast and low inventory"
  }
}
```

---

## 🏗️ Architecture

### Project Structure
```
price-optimiser-backend/
├── manage.py
├── requirements.txt
├── env.example
├── pricing_tool/              # Django project settings
│   ├── __init__.py
│   ├── settings.py           # Django configuration
│   ├── urls.py               # Root URL configuration
│   └── wsgi.py               # WSGI application
├── products/                 # Product management app
│   ├── __init__.py
│   ├── models.py             # Product and analytics models
│   ├── serializers.py        # DRF serializers
│   ├── views.py              # API view classes
│   ├── urls.py               # App URL patterns
│   ├── permissions.py        # Custom permission classes
│   ├── optimization.py       # Core price optimization
│   ├── forecasts.py          # Demand forecasting models
│   ├── advanced_optimization.py # Advanced ML optimization
│   ├── tests.py              # Unit tests
│   └── migrations/           # Database migrations
├── users/                    # User management app
│   ├── __init__.py
│   ├── models.py             # User model
│   ├── serializers.py        # User serializers
│   ├── views.py              # Authentication views
│   ├── urls.py               # User URL patterns
│   ├── permissions.py        # User permissions
│   └── migrations/           # User migrations
└── venv/                     # Virtual environment
```

### Technology Stack
- **Django 4.x**: Web framework
- **Django REST Framework**: API framework
- **NumPy**: Numerical computations
- **SQLite/PostgreSQL**: Database
- **JWT**: Authentication
- **CORS**: Cross-origin resource sharing

---

## 🔧 Development

### Available Commands

```bash
# Development server
python manage.py runserver

# Database operations
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser

# Testing
python manage.py test
python comprehensive_test_suite.py

# Data management
python manage.py loaddata initial_data.json
python manage.py import_products product_data.csv
```

### Development Workflow

1. **Model Development**
   - Define models in `models.py`
   - Create migrations: `python manage.py makemigrations`
   - Apply migrations: `python manage.py migrate`

2. **API Development**
   - Create serializers in `serializers.py`
   - Implement views in `views.py`
   - Add URL patterns in `urls.py`
   - Test endpoints with Django REST Framework

3. **ML Model Development**
   - Implement algorithms in dedicated modules
   - Add unit tests for mathematical functions
   - Validate results with test data
   - Document mathematical foundations

4. **Testing Strategy**
   - Unit tests for individual functions
   - Integration tests for API endpoints
   - ML model validation tests
   - Performance benchmarking

---

## 🔐 Authentication & Permissions

### JWT Authentication
```python
# settings.py
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
}
```

### Role-Based Access Control
- **Admin**: Full access to all endpoints
- **Supplier**: Create, read, update products
- **Buyer**: Read-only access to products and analytics

### Permission Classes
```python
# permissions.py
class IsAdminUser(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.role == 'admin'

class IsSupplierUser(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.role == 'supplier'
```

---

## 📊 Database Models

### Product Model
```python
class Product(models.Model):
    name = models.CharField(max_length=200)
    category = models.CharField(max_length=100)
    cost_price = models.DecimalField(max_digits=10, decimal_places=2)
    selling_price = models.DecimalField(max_digits=10, decimal_places=2)
    stock_available = models.IntegerField()
    units_sold = models.IntegerField(default=0)
    customer_rating = models.DecimalField(max_digits=3, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
```

### User Model
```python
class User(AbstractUser):
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('supplier', 'Supplier'),
        ('buyer', 'Buyer'),
    ]
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='buyer')
    company = models.CharField(max_length=200, blank=True)
```

---

## 🧪 Testing

### Test Suite Structure
```python
# comprehensive_test_suite.py
class TestPriceOptimization:
    def test_basic_optimization(self):
        # Test core optimization algorithm
        
    def test_elasticity_calculation(self):
        # Test price elasticity computation
        
    def test_ml_optimization(self):
        # Test machine learning models

class TestDemandForecasting:
    def test_linear_forecast(self):
        # Test linear regression forecasting
        
    def test_ensemble_forecast(self):
        # Test ensemble forecasting methods

class TestAPIEndpoints:
    def test_product_crud(self):
        # Test product management endpoints
        
    def test_optimization_endpoint(self):
        # Test optimization API
```

### Running Tests
```bash
# Run all tests
python comprehensive_test_suite.py

# Run specific test categories
python comprehensive_test_suite.py --api-only
python comprehensive_test_suite.py --ml-only
python comprehensive_test_suite.py --frontend-only

# Run Django tests
python manage.py test
```

---

## 📦 Deployment

### Production Setup

1. **Environment Configuration**
   ```bash
   # .env
   DEBUG=False
   SECRET_KEY=your_production_secret_key
   DATABASE_URL=postgresql://user:pass@host:port/db
   ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
   ```

2. **Database Migration**
   ```bash
   python manage.py migrate
   python manage.py collectstatic
   ```

3. **WSGI Configuration**
   ```python
   # wsgi.py
   import os
   from django.core.wsgi import get_wsgi_application
   os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'pricing_tool.settings')
   application = get_wsgi_application()
   ```

### Deployment Options
- **Heroku**: Easy deployment with PostgreSQL
- **AWS**: EC2 with RDS database
- **Google Cloud**: App Engine with Cloud SQL
- **DigitalOcean**: Droplet with managed database

---

## 🔒 Security

### Security Measures
- **JWT Authentication**: Secure token-based authentication
- **CORS Configuration**: Controlled cross-origin requests
- **Input Validation**: Comprehensive data validation
- **SQL Injection Protection**: Django ORM protection
- **XSS Protection**: Django's built-in XSS protection
- **CSRF Protection**: Cross-site request forgery protection

### Environment Variables
```bash
# Required environment variables
SECRET_KEY=your_secret_key
DEBUG=False
DATABASE_URL=your_database_url
ALLOWED_HOSTS=your_domain.com

# Optional variables
CORS_ALLOWED_ORIGINS=https://yourdomain.com
JWT_SECRET_KEY=your_jwt_secret
```

---

## 📈 Performance

### Optimization Strategies
- **Database Indexing**: Optimized queries with proper indexes
- **Caching**: Redis caching for frequently accessed data
- **Pagination**: Efficient data pagination for large datasets
- **Async Processing**: Background tasks for heavy computations
- **Connection Pooling**: Database connection optimization

### Monitoring
- **Django Debug Toolbar**: Development performance monitoring
- **Logging**: Comprehensive application logging
- **Error Tracking**: Sentry integration for error monitoring
- **Health Checks**: API health check endpoints

---

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Set up virtual environment
4. Install dependencies
5. Make your changes
6. Add tests for new functionality
7. Submit a pull request

### Code Standards
- Follow PEP 8 Python style guide
- Use type hints for function parameters
- Add docstrings for all functions
- Write comprehensive unit tests
- Use meaningful variable names
- Implement proper error handling

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Django Team**: For the excellent web framework
- **NumPy**: For powerful numerical computations
- **Django REST Framework**: For robust API development
- **Machine Learning Community**: For algorithm inspiration

---

<div align="center">

**Made with ❤️ by the PricePilot Team**

</div>

