from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.core.exceptions import ValidationError
from django.db import transaction
import logging
import ast
from .models import Product
from .serializers import ProductSerializer, ProductListSerializer
from .permissions import IsAdminOrReadOnly, IsSupplierOrAdmin
from .forecasts import simple_linear_forecast, advanced_forecast
from .optimization import optimize_price
import numpy as np

logger = logging.getLogger(__name__)

class ProductListCreateView(generics.ListCreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated, IsSupplierOrAdmin]

    def perform_create(self, serializer):
        try:
            serializer.save()
            logger.info(f"Product created: {serializer.instance.name}")
        except Exception as e:
            logger.error(f"Error creating product: {str(e)}")
            raise

    def list(self, request, *args, **kwargs):
        try:
            response = super().list(request, *args, **kwargs)
            return Response({
                'success': True,
                'data': response.data,
                'count': len(response.data)
            })
        except Exception as e:
            logger.error(f"Error listing products: {str(e)}")
            return Response({
                'success': False,
                'error': 'Failed to fetch products'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ProductRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated, IsAdminOrReadOnly]

    def perform_update(self, serializer):
        try:
            serializer.save()
            logger.info(f"Product updated: {serializer.instance.name}")
        except Exception as e:
            logger.error(f"Error updating product: {str(e)}")
            raise

    def perform_destroy(self, instance):
        try:
            product_name = instance.name
            instance.delete()
            logger.info(f"Product deleted: {product_name}")
        except Exception as e:
            logger.error(f"Error deleting product: {str(e)}")
            raise

class ProductSearchView(generics.ListAPIView):
    serializer_class = ProductListSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        try:
            queryset = Product.objects.all()
            name = self.request.query_params.get('name')
            category = self.request.query_params.get('category')
            
            if name:
                queryset = queryset.filter(name__icontains=name)
            if category:
                queryset = queryset.filter(category__iexact=category)
                
            return queryset
        except Exception as e:
            logger.error(f"Error searching products: {str(e)}")
            return Product.objects.none()

class DemandForecastView(generics.GenericAPIView):
    serializer_class = ProductListSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        try:
            products = Product.objects.all()
            results = []
            
            for prod in products:
                forecast_data = prod.demand_forecast

                if isinstance(forecast_data, str):
                    try:
                        forecast_data = ast.literal_eval(forecast_data)
                    except (ValueError, SyntaxError):
                        forecast_data = {}

                # Use advanced forecasting
                advanced_forecast_result = advanced_forecast(forecast_data or {})
                results.append({
                    'product_id': prod.id,
                    'name': prod.name,
                    'stock_available': prod.stock_available,
                    'units_sold': prod.units_sold,
                    'forecast': advanced_forecast_result['ensemble'],
                    'forecast_breakdown': {
                        'linear': advanced_forecast_result['linear'],
                        'exponential': advanced_forecast_result['exponential'],
                        'moving_average': advanced_forecast_result['moving_average'],
                        'seasonal': advanced_forecast_result['seasonal'],
                        'confidence': advanced_forecast_result['confidence']
                    }
                })
                
            return Response({
                'success': True,
                'data': results
            })
        except Exception as e:
            logger.error(f"Error generating demand forecast: {str(e)}")
            return Response({
                'success': False,
                'error': 'Failed to generate demand forecast'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class AdvancedForecastView(generics.GenericAPIView):
    """Advanced forecasting with detailed analysis"""
    serializer_class = ProductListSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        try:
            product_id = request.query_params.get('product_id')
            
            if product_id:
                try:
                    product = Product.objects.get(id=product_id)
                except Product.DoesNotExist:
                    return Response({
                        'success': False,
                        'error': 'Product not found'
                    }, status=status.HTTP_404_NOT_FOUND)
                
                products = [product]
            else:
                products = Product.objects.all()
            
            results = []
            
            for prod in products:
                forecast_data = prod.demand_forecast

                if isinstance(forecast_data, str):
                    try:
                        forecast_data = ast.literal_eval(forecast_data)
                    except (ValueError, SyntaxError):
                        forecast_data = {}

                # Get detailed forecast analysis
                advanced_forecast_result = advanced_forecast(forecast_data or {})
                
                # Calculate trend analysis
                if forecast_data and len(forecast_data) >= 2:
                    years = sorted([int(year) for year in forecast_data.keys()])
                    values = [forecast_data[str(year)] for year in years]
                    
                    # Calculate growth rate
                    if len(values) >= 2:
                        growth_rate = ((values[-1] - values[0]) / values[0]) * 100 if values[0] > 0 else 0
                    else:
                        growth_rate = 0
                    
                    # Calculate volatility
                    if len(values) >= 2:
                        volatility = (np.std(values) / np.mean(values)) * 100 if np.mean(values) > 0 else 0
                    else:
                        volatility = 0
                else:
                    growth_rate = 0
                    volatility = 0
                
                results.append({
                    'product_id': prod.id,
                    'name': prod.name,
                    'category': prod.category,
                    'current_demand': prod.units_sold,
                    'historical_data': forecast_data,
                    'forecast_summary': {
                        'ensemble_forecast': advanced_forecast_result['ensemble'],
                        'confidence': advanced_forecast_result['confidence'],
                        'growth_rate': round(growth_rate, 2),
                        'volatility': round(volatility, 2)
                    },
                    'forecast_methods': {
                        'linear_regression': {
                            'forecast': advanced_forecast_result['linear'],
                            'description': 'Linear trend projection'
                        },
                        'exponential_smoothing': {
                            'forecast': advanced_forecast_result['exponential'],
                            'description': 'Weighted average with trend adjustment'
                        },
                        'moving_average': {
                            'forecast': advanced_forecast_result['moving_average'],
                            'description': 'Smooth trend with window averaging'
                        },
                        'seasonal_decomposition': {
                            'forecast': advanced_forecast_result['seasonal'],
                            'description': 'Trend + seasonal component analysis'
                        }
                    },
                    'recommendations': self._generate_forecast_recommendations(
                        advanced_forecast_result, growth_rate, volatility
                    )
                })
                
            return Response({
                'success': True,
                'data': results
            })
        except Exception as e:
            logger.error(f"Error generating advanced forecast: {str(e)}")
            return Response({
                'success': False,
                'error': 'Failed to generate advanced forecast'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def _generate_forecast_recommendations(self, forecast_result, growth_rate, volatility):
        """Generate recommendations based on forecast analysis"""
        recommendations = []
        
        confidence = forecast_result['confidence']
        ensemble = forecast_result['ensemble']
        
        # Confidence-based recommendations
        if confidence >= 0.8:
            recommendations.append({
                'type': 'high_confidence',
                'message': 'High forecast confidence - reliable for planning',
                'priority': 'high'
            })
        elif confidence >= 0.6:
            recommendations.append({
                'type': 'medium_confidence',
                'message': 'Moderate forecast confidence - consider multiple scenarios',
                'priority': 'medium'
            })
        else:
            recommendations.append({
                'type': 'low_confidence',
                'message': 'Low forecast confidence - use conservative estimates',
                'priority': 'high'
            })
        
        # Growth-based recommendations
        if growth_rate > 20:
            recommendations.append({
                'type': 'high_growth',
                'message': 'Strong growth trend - consider capacity expansion',
                'priority': 'medium'
            })
        elif growth_rate < -10:
            recommendations.append({
                'type': 'declining',
                'message': 'Declining demand - review product strategy',
                'priority': 'high'
            })
        
        # Volatility-based recommendations
        if volatility > 30:
            recommendations.append({
                'type': 'high_volatility',
                'message': 'High demand volatility - implement flexible inventory',
                'priority': 'medium'
            })
        
        return recommendations

class PricingOptimizationView(generics.GenericAPIView):
    serializer_class = ProductListSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        try:
            results = []
            
            with transaction.atomic():
                for prod in Product.objects.all():
                    best_price, best_profit = optimize_price(prod.cost_price)

                    # Update the product with optimized price
                    prod.optimized_price = best_price
                    prod.save()

                    results.append({
                        'product_id': prod.id,
                        'name': prod.name,
                        'optimized_price': float(best_price),
                        'optimized_profit': float(best_profit),
                        'current_price': float(prod.selling_price),
                        'price_change': float(best_price - prod.selling_price),
                    })

            return Response({
                'success': True,
                'data': results
            })
        except Exception as e:
            logger.error(f"Error optimizing pricing: {str(e)}")
            return Response({
                'success': False,
                'error': 'Failed to optimize pricing'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)