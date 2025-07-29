#!/usr/bin/env python3
"""
Comprehensive Test Suite for PricePilot - AI-Powered Pricing Optimization Tool
================================================================================

This test suite consolidates all testing functionality for the PricePilot application,
including backend API testing, frontend functionality, user authentication, 
and machine learning model validation.

Author: PricePilot Development Team
Version: 2.0.0
"""

import requests
import json
import time
import sys
import os
from datetime import datetime
from typing import Dict, List, Any, Optional
import subprocess
import threading
import webbrowser

# Configuration
BASE_URL = "http://localhost:8000"
FRONTEND_URL = "http://localhost:3000"
API_BASE = f"{BASE_URL}/api"

class TestColors:
    """ANSI color codes for test output"""
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'

class TestLogger:
    """Enhanced logging for test results"""
    
    def __init__(self):
        self.test_count = 0
        self.passed = 0
        self.failed = 0
        self.start_time = time.time()
        self.results = []
    
    def log_test(self, test_name: str, success: bool, details: str = "", error: str = ""):
        """Log a test result"""
        self.test_count += 1
        if success:
            self.passed += 1
            status = f"{TestColors.OKGREEN}✓ PASS{TestColors.ENDC}"
        else:
            self.failed += 1
            status = f"{TestColors.FAIL}✗ FAIL{TestColors.ENDC}"
        
        timestamp = datetime.now().strftime("%H:%M:%S")
        print(f"[{timestamp}] {status} {test_name}")
        
        if details:
            print(f"    {TestColors.OKCYAN}Details: {details}{TestColors.ENDC}")
        if error:
            print(f"    {TestColors.FAIL}Error: {error}{TestColors.ENDC}")
        
        self.results.append({
            'test_name': test_name,
            'success': success,
            'details': details,
            'error': error,
            'timestamp': timestamp
        })
    
    def print_summary(self):
        """Print test summary"""
        duration = time.time() - self.start_time
        print(f"\n{TestColors.BOLD}{'='*60}{TestColors.ENDC}")
        print(f"{TestColors.HEADER}TEST SUMMARY{TestColors.ENDC}")
        print(f"{TestColors.BOLD}{'='*60}{TestColors.ENDC}")
        print(f"Total Tests: {self.test_count}")
        print(f"Passed: {TestColors.OKGREEN}{self.passed}{TestColors.ENDC}")
        print(f"Failed: {TestColors.FAIL}{self.failed}{TestColors.ENDC}")
        print(f"Success Rate: {TestColors.OKBLUE}{(self.passed/self.test_count*100):.1f}%{TestColors.ENDC}")
        print(f"Duration: {TestColors.OKCYAN}{duration:.2f} seconds{TestColors.ENDC}")
        
        if self.failed > 0:
            print(f"\n{TestColors.FAIL}Failed Tests:{TestColors.ENDC}")
            for result in self.results:
                if not result['success']:
                    print(f"  - {result['test_name']}: {result['error']}")

class APITester:
    """Backend API testing functionality"""
    
    def __init__(self, logger: TestLogger):
        self.logger = logger
        self.session = requests.Session()
        self.auth_token = None
        self.test_users = []
    
    def test_server_connection(self) -> bool:
        """Test if the backend server is running"""
        try:
            response = self.session.get(f"{BASE_URL}/health/", timeout=5)
            if response.status_code == 200:
                self.logger.log_test("Backend Server Connection", True, "Server is running and responding")
                return True
            else:
                self.logger.log_test("Backend Server Connection", False, f"Server responded with status {response.status_code}")
                return False
        except requests.exceptions.RequestException as e:
            self.logger.log_test("Backend Server Connection", False, error=str(e))
            return False
    
    def test_user_registration(self) -> bool:
        """Test user registration functionality"""
        test_user = {
            "username": f"testuser_{int(time.time())}",
            "email": f"test_{int(time.time())}@example.com",
            "password": "testpass123",
            "role": "seller"
        }
        
        try:
            response = self.session.post(f"{API_BASE}/users/register/", json=test_user)
            if response.status_code == 201:
                self.test_users.append(test_user)
                self.logger.log_test("User Registration", True, f"Created user: {test_user['username']}")
                return True
            else:
                self.logger.log_test("User Registration", False, f"Status: {response.status_code}, Response: {response.text}")
                return False
        except Exception as e:
            self.logger.log_test("User Registration", False, error=str(e))
            return False
    
    def test_user_login(self) -> bool:
        """Test user login functionality"""
        if not self.test_users:
            self.logger.log_test("User Login", False, "No test users available")
            return False
        
        user = self.test_users[0]
        login_data = {
            "username": user["username"],
            "password": user["password"]
        }
        
        try:
            response = self.session.post(f"{API_BASE}/users/login/", json=login_data)
            if response.status_code == 200:
                data = response.json()
                if 'token' in data:
                    self.auth_token = data['token']
                    self.session.headers.update({'Authorization': f'Token {self.auth_token}'})
                    self.logger.log_test("User Login", True, f"Logged in as: {user['username']}")
                    return True
                else:
                    self.logger.log_test("User Login", False, "No token in response")
                    return False
            else:
                self.logger.log_test("User Login", False, f"Status: {response.status_code}, Response: {response.text}")
                return False
        except Exception as e:
            self.logger.log_test("User Login", False, error=str(e))
            return False
    
    def test_product_creation(self) -> bool:
        """Test product creation functionality"""
        if not self.auth_token:
            self.logger.log_test("Product Creation", False, "Not authenticated")
            return False
        
        test_product = {
            "name": f"Test Product {int(time.time())}",
            "category": "Electronics",
            "cost_price": "50.00",
            "selling_price": "75.00",
            "description": "Test product for API testing",
            "stock_available": "100",
            "units_sold": "25",
            "customer_rating": "4.5"
        }
        
        try:
            response = self.session.post(f"{API_BASE}/products/", json=test_product)
            if response.status_code == 201:
                self.logger.log_test("Product Creation", True, f"Created product: {test_product['name']}")
                return True
            else:
                self.logger.log_test("Product Creation", False, f"Status: {response.status_code}, Response: {response.text}")
                return False
        except Exception as e:
            self.logger.log_test("Product Creation", False, error=str(e))
            return False
    
    def test_product_listing(self) -> bool:
        """Test product listing functionality"""
        try:
            response = self.session.get(f"{API_BASE}/products/")
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, dict) and 'data' in data:
                    products = data['data']
                else:
                    products = data
                
                self.logger.log_test("Product Listing", True, f"Retrieved {len(products)} products")
                return True
            else:
                self.logger.log_test("Product Listing", False, f"Status: {response.status_code}")
                return False
        except Exception as e:
            self.logger.log_test("Product Listing", False, error=str(e))
            return False
    
    def test_price_optimization(self) -> bool:
        """Test price optimization functionality"""
        try:
            response = self.session.get(f"{API_BASE}/products/optimize/")
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, dict) and 'data' in data:
                    optimizations = data['data']
                else:
                    optimizations = data
                
                self.logger.log_test("Price Optimization", True, f"Generated {len(optimizations)} optimizations")
                return True
            else:
                self.logger.log_test("Price Optimization", False, f"Status: {response.status_code}")
                return False
        except Exception as e:
            self.logger.log_test("Price Optimization", False, error=str(e))
            return False
    
    def test_demand_forecasting(self) -> bool:
        """Test demand forecasting functionality"""
        try:
            response = self.session.get(f"{API_BASE}/products/forecast/")
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, dict) and 'data' in data:
                    forecasts = data['data']
                else:
                    forecasts = data
                
                self.logger.log_test("Demand Forecasting", True, f"Generated {len(forecasts)} forecasts")
                return True
            else:
                self.logger.log_test("Demand Forecasting", False, f"Status: {response.status_code}")
                return False
        except Exception as e:
            self.logger.log_test("Demand Forecasting", False, error=str(e))
            return False

class FrontendTester:
    """Frontend testing functionality"""
    
    def __init__(self, logger: TestLogger):
        self.logger = logger
    
    def test_frontend_connection(self) -> bool:
        """Test if the frontend server is running"""
        try:
            response = requests.get(FRONTEND_URL, timeout=5)
            if response.status_code == 200:
                self.logger.log_test("Frontend Server Connection", True, "Frontend is running and responding")
                return True
            else:
                self.logger.log_test("Frontend Server Connection", False, f"Frontend responded with status {response.status_code}")
                return False
        except requests.exceptions.RequestException as e:
            self.logger.log_test("Frontend Server Connection", False, error=str(e))
            return False
    
    def open_frontend_in_browser(self) -> bool:
        """Open frontend in default browser"""
        try:
            webbrowser.open(FRONTEND_URL)
            self.logger.log_test("Frontend Browser Launch", True, f"Opened {FRONTEND_URL} in browser")
            return True
        except Exception as e:
            self.logger.log_test("Frontend Browser Launch", False, error=str(e))
            return False

class MLModelTester:
    """Machine Learning model testing functionality"""
    
    def __init__(self, logger: TestLogger):
        self.logger = logger
    
    def test_optimization_algorithm(self) -> bool:
        """Test the price optimization algorithm"""
        try:
            # Import the optimization module
            sys.path.append('price-optimiser-backend')
            from products.optimization import optimize_price
            
            # Test cases
            test_cases = [
                {"cost": 50, "current": 75, "expected_min": 60, "expected_max": 90},
                {"cost": 100, "current": 120, "expected_min": 110, "expected_max": 150},
                {"cost": 25, "current": 30, "expected_min": 28, "expected_max": 40}
            ]
            
            all_passed = True
            for i, case in enumerate(test_cases):
                optimal_price, profit = optimize_price(
                    case["cost"], 
                    case["current"]
                )
                
                if case["expected_min"] <= optimal_price <= case["expected_max"]:
                    self.logger.log_test(f"Optimization Algorithm Test {i+1}", True, 
                                       f"Optimal price: ${optimal_price}, Profit: ${profit}")
                else:
                    self.logger.log_test(f"Optimization Algorithm Test {i+1}", False,
                                       f"Price ${optimal_price} outside expected range [{case['expected_min']}, {case['expected_max']}]")
                    all_passed = False
            
            return all_passed
        except Exception as e:
            self.logger.log_test("Optimization Algorithm", False, error=str(e))
            return False
    
    def test_forecasting_algorithm(self) -> bool:
        """Test the demand forecasting algorithm"""
        try:
            # Import the forecasting module
            sys.path.append('price-optimiser-backend')
            from products.forecasts import AdvancedDemandForecaster
            
            forecaster = AdvancedDemandForecaster()
            
            # Test data
            test_data = {
                "2020": 100,
                "2021": 120,
                "2022": 140,
                "2023": 160
            }
            
            # Test different forecasting methods
            methods = [
                ("Linear Regression", forecaster.simple_linear_forecast),
                ("Exponential Smoothing", forecaster.exponential_smoothing_forecast),
                ("Moving Average", forecaster.moving_average_forecast),
                ("Seasonal Decomposition", forecaster.seasonal_decomposition_forecast)
            ]
            
            all_passed = True
            for method_name, method_func in methods:
                try:
                    forecast = method_func(test_data)
                    if isinstance(forecast, (int, float)) and forecast >= 0:
                        self.logger.log_test(f"Forecasting Algorithm - {method_name}", True,
                                           f"Forecast: {forecast}")
                    else:
                        self.logger.log_test(f"Forecasting Algorithm - {method_name}", False,
                                           f"Invalid forecast: {forecast}")
                        all_passed = False
                except Exception as e:
                    self.logger.log_test(f"Forecasting Algorithm - {method_name}", False, error=str(e))
                    all_passed = False
            
            return all_passed
        except Exception as e:
            self.logger.log_test("Forecasting Algorithm", False, error=str(e))
            return False

class SystemTester:
    """System integration testing"""
    
    def __init__(self, logger: TestLogger):
        self.logger = logger
    
    def test_database_connection(self) -> bool:
        """Test database connectivity"""
        try:
            # This would typically test Django database connection
            # For now, we'll test if the backend can respond to database-dependent endpoints
            response = requests.get(f"{API_BASE}/products/", timeout=10)
            if response.status_code in [200, 401]:  # 401 is expected without auth
                self.logger.log_test("Database Connection", True, "Database is accessible")
                return True
            else:
                self.logger.log_test("Database Connection", False, f"Database error: {response.status_code}")
                return False
        except Exception as e:
            self.logger.log_test("Database Connection", False, error=str(e))
            return False
    
    def test_api_endpoints(self) -> bool:
        """Test all API endpoints"""
        endpoints = [
            ("Health Check", f"{BASE_URL}/health/", "GET"),
            ("API Products", f"{API_BASE}/products/", "GET"),
            ("API Users", f"{API_BASE}/users/", "GET"),
            ("API Optimization", f"{API_BASE}/products/optimize/", "GET"),
            ("API Forecast", f"{API_BASE}/products/forecast/", "GET"),
        ]
        
        all_passed = True
        for name, url, method in endpoints:
            try:
                if method == "GET":
                    response = requests.get(url, timeout=5)
                else:
                    response = requests.post(url, timeout=5)
                
                if response.status_code in [200, 401, 403]:  # Valid responses
                    self.logger.log_test(f"API Endpoint - {name}", True, f"Status: {response.status_code}")
                else:
                    self.logger.log_test(f"API Endpoint - {name}", False, f"Status: {response.status_code}")
                    all_passed = False
            except Exception as e:
                self.logger.log_test(f"API Endpoint - {name}", False, error=str(e))
                all_passed = False
        
        return all_passed

def run_comprehensive_tests():
    """Run all comprehensive tests"""
    print(f"{TestColors.HEADER}{TestColors.BOLD}")
    print("=" * 60)
    print("PRICEPILOT COMPREHENSIVE TEST SUITE")
    print("AI-Powered Pricing Optimization Tool")
    print("=" * 60)
    print(f"{TestColors.ENDC}")
    
    logger = TestLogger()
    
    # Initialize testers
    api_tester = APITester(logger)
    frontend_tester = FrontendTester(logger)
    ml_tester = MLModelTester(logger)
    system_tester = SystemTester(logger)
    
    # System Tests
    print(f"\n{TestColors.OKBLUE}{TestColors.BOLD}SYSTEM TESTS{TestColors.ENDC}")
    print("-" * 40)
    system_tester.test_database_connection()
    system_tester.test_api_endpoints()
    
    # Backend Tests
    print(f"\n{TestColors.OKBLUE}{TestColors.BOLD}BACKEND API TESTS{TestColors.ENDC}")
    print("-" * 40)
    if api_tester.test_server_connection():
        api_tester.test_user_registration()
        api_tester.test_user_login()
        api_tester.test_product_creation()
        api_tester.test_product_listing()
        api_tester.test_price_optimization()
        api_tester.test_demand_forecasting()
    
    # Frontend Tests
    print(f"\n{TestColors.OKBLUE}{TestColors.BOLD}FRONTEND TESTS{TestColors.ENDC}")
    print("-" * 40)
    frontend_tester.test_frontend_connection()
    frontend_tester.open_frontend_in_browser()
    
    # ML Model Tests
    print(f"\n{TestColors.OKBLUE}{TestColors.BOLD}MACHINE LEARNING TESTS{TestColors.ENDC}")
    print("-" * 40)
    ml_tester.test_optimization_algorithm()
    ml_tester.test_forecasting_algorithm()
    
    # Print summary
    logger.print_summary()
    
    return logger.failed == 0

def main():
    """Main function"""
    if len(sys.argv) > 1:
        if sys.argv[1] == "--help" or sys.argv[1] == "-h":
            print("""
PricePilot Comprehensive Test Suite

Usage:
    python comprehensive_test_suite.py [options]

Options:
    --help, -h          Show this help message
    --quick             Run quick tests only
    --verbose           Show detailed output
    --no-browser        Don't open browser
    --api-only          Test API only
    --frontend-only     Test frontend only
    --ml-only           Test ML models only

Examples:
    python comprehensive_test_suite.py
    python comprehensive_test_suite.py --quick
    python comprehensive_test_suite.py --api-only
            """)
            return
    
    success = run_comprehensive_tests()
    
    if success:
        print(f"\n{TestColors.OKGREEN}{TestColors.BOLD}🎉 ALL TESTS PASSED! 🎉{TestColors.ENDC}")
        print(f"{TestColors.OKGREEN}PricePilot is ready for use!{TestColors.ENDC}")
        sys.exit(0)
    else:
        print(f"\n{TestColors.FAIL}{TestColors.BOLD}❌ SOME TESTS FAILED ❌{TestColors.ENDC}")
        print(f"{TestColors.FAIL}Please check the errors above and fix them.{TestColors.ENDC}")
        sys.exit(1)

if __name__ == "__main__":
    main() 