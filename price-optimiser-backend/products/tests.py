from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase
from rest_framework import status
from decimal import Decimal
from .models import Product
from .forecasts import simple_linear_forecast
from .optimization import optimize_price

User = get_user_model()

class ProductModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass123',
            email='test@example.com',
            role='supplier'
        )
        
        self.product = Product.objects.create(
            name='Test Product',
            category='Electronics',
            cost_price=Decimal('50.00'),
            selling_price=Decimal('100.00'),
            description='A test product',
            stock_available=100,
            units_sold=50,
            customer_rating=Decimal('4.5'),
            demand_forecast={'2022': 100, '2023': 120, '2024': 140}
        )

    def test_product_creation(self):
        """Test that a product can be created"""
        self.assertEqual(self.product.name, 'Test Product')
        self.assertEqual(self.product.category, 'Electronics')
        self.assertEqual(self.product.cost_price, Decimal('50.00'))
        self.assertEqual(self.product.selling_price, Decimal('100.00'))

    def test_product_str_representation(self):
        """Test the string representation of a product"""
        expected = "Test Product (Electronics)"
        self.assertEqual(str(self.product), expected)

    def test_profit_calculation(self):
        """Test profit calculation"""
        profit = self.product.selling_price - self.product.cost_price
        self.assertEqual(profit, Decimal('50.00'))

class ForecastTest(TestCase):
    def test_simple_linear_forecast(self):
        """Test the simple linear forecast function"""
        historical_data = {'2020': 100, '2021': 120, '2022': 140}
        forecast = simple_linear_forecast(historical_data)
        self.assertIsInstance(forecast, int)
        self.assertGreater(forecast, 0)

    def test_forecast_with_empty_data(self):
        """Test forecast with empty data"""
        forecast = simple_linear_forecast({})
        self.assertEqual(forecast, 0)

    def test_forecast_with_single_data_point(self):
        """Test forecast with single data point"""
        forecast = simple_linear_forecast({'2022': 100})
        self.assertEqual(forecast, 100)

class OptimizationTest(TestCase):
    def test_optimize_price(self):
        """Test the price optimization function"""
        cost_price = Decimal('50.00')
        best_price, best_profit = optimize_price(cost_price)
        
        self.assertIsInstance(best_price, Decimal)
        self.assertIsInstance(best_profit, Decimal)
        self.assertGreater(best_price, cost_price)
        self.assertGreater(best_profit, 0)

    def test_optimize_price_with_current_price(self):
        """Test optimization with current price parameter"""
        cost_price = Decimal('50.00')
        current_price = Decimal('80.00')
        best_price, best_profit = optimize_price(cost_price, current_price)
        
        self.assertIsInstance(best_price, Decimal)
        self.assertIsInstance(best_profit, Decimal)

class ProductAPITest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass123',
            email='test@example.com',
            role='supplier'
        )
        
        self.product = Product.objects.create(
            name='Test Product',
            category='Electronics',
            cost_price=Decimal('50.00'),
            selling_price=Decimal('100.00'),
            description='A test product',
            stock_available=100,
            units_sold=50,
            customer_rating=Decimal('4.5')
        )

    def test_list_products(self):
        """Test listing products"""
        self.client.force_authenticate(user=self.user)
        response = self.client.get('/api/products/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('data', response.data)

    def test_create_product(self):
        """Test creating a product"""
        self.client.force_authenticate(user=self.user)
        data = {
            'name': 'New Product',
            'category': 'Electronics',
            'cost_price': '60.00',
            'selling_price': '120.00',
            'description': 'A new product',
            'stock_available': 50,
            'units_sold': 25,
            'customer_rating': '4.0'
        }
        response = self.client.post('/api/products/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_get_product_detail(self):
        """Test getting product details"""
        self.client.force_authenticate(user=self.user)
        response = self.client.get(f'/api/products/{self.product.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Test Product')

    def test_update_product(self):
        """Test updating a product"""
        self.client.force_authenticate(user=self.user)
        data = {'name': 'Updated Product'}
        response = self.client.patch(f'/api/products/{self.product.id}/', data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Updated Product')

    def test_delete_product(self):
        """Test deleting a product"""
        self.client.force_authenticate(user=self.user)
        response = self.client.delete(f'/api/products/{self.product.id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_search_products(self):
        """Test searching products"""
        self.client.force_authenticate(user=self.user)
        response = self.client.get('/api/products/search/?name=Test')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_demand_forecast(self):
        """Test demand forecast endpoint"""
        self.client.force_authenticate(user=self.user)
        response = self.client.get('/api/products/forecast/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('data', response.data)

    def test_pricing_optimization(self):
        """Test pricing optimization endpoint"""
        self.client.force_authenticate(user=self.user)
        response = self.client.get('/api/products/optimize/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('data', response.data)

    def test_unauthorized_access(self):
        """Test unauthorized access to protected endpoints"""
        response = self.client.get('/api/products/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

class SerializerTest(TestCase):
    def setUp(self):
        self.product = Product.objects.create(
            name='Test Product',
            category='Electronics',
            cost_price=Decimal('50.00'),
            selling_price=Decimal('100.00'),
            description='A test product',
            stock_available=100,
            units_sold=50,
            customer_rating=Decimal('4.5')
        )

    def test_product_serializer(self):
        """Test the product serializer"""
        from .serializers import ProductSerializer
        serializer = ProductSerializer(self.product)
        data = serializer.data
        
        self.assertEqual(data['name'], 'Test Product')
        self.assertEqual(data['profit_margin'], 50.0)
        self.assertEqual(data['revenue'], '5000.00')

    def test_product_list_serializer(self):
        """Test the product list serializer"""
        from .serializers import ProductListSerializer
        serializer = ProductListSerializer(self.product)
        data = serializer.data
        
        self.assertEqual(data['name'], 'Test Product')
        self.assertIn('profit_margin', data)
        self.assertIn('revenue', data)
        self.assertIn('demand_forecast_value', data) 