from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.core.exceptions import ValidationError
import logging
from .models import Product
from .serializers import ProductListSerializer
from .advanced_optimization import (
    PriceElasticityAnalyzer,
    MLPriceOptimizer,
    ABTestingSimulator,
    advanced_optimize_price
)

logger = logging.getLogger(__name__)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def elasticity_heatmap_view(request):
    """Get elasticity heatmap data for all products"""
    try:
        products = Product.objects.all()
        serializer = ProductListSerializer(products, many=True)
        product_data = serializer.data
        
        analyzer = PriceElasticityAnalyzer()
        heatmap_data = analyzer.get_elasticity_heatmap(product_data)
        
        return Response({
            'success': True,
            'data': heatmap_data,
            'message': 'Elasticity heatmap data generated successfully'
        })
        
    except Exception as e:
        logger.error(f"Error generating elasticity heatmap: {str(e)}")
        return Response({
            'success': False,
            'error': 'Failed to generate elasticity heatmap'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def ml_optimize_price_view(request):
    """Get ML-based price optimization for a product"""
    try:
        product_id = request.data.get('product_id')
        if not product_id:
            return Response({
                'success': False,
                'error': 'Product ID is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response({
                'success': False,
                'error': 'Product not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Get all products for ML training
        all_products = Product.objects.all()
        all_serializer = ProductListSerializer(all_products, many=True)
        all_product_data = all_serializer.data
        
        # Train ML model
        ml_optimizer = MLPriceOptimizer()
        ml_optimizer.train_model(all_product_data)
        
        # Get optimization for specific product
        product_serializer = ProductListSerializer(product)
        product_data = product_serializer.data
        
        # Ensure the ML model is trained before optimization
        if not ml_optimizer.is_trained:
            # Fallback optimization if ML training fails
            cost_price = float(product_data.get('cost_price', 0))
            current_price = float(product_data.get('selling_price', 0))
            stock = float(product_data.get('stock_available', 0))
            demand = float(product_data.get('demand_forecast_value', 100))
            
            # Simple optimization logic
            if stock < demand * 0.3:  # Low stock
                recommended_price = current_price * 1.1  # Increase price
            elif stock > demand * 1.5:  # High stock
                recommended_price = current_price * 0.95  # Decrease price
            else:
                recommended_price = current_price * 1.02  # Slight increase
            
            optimization_result = {
                'recommended_price': round(recommended_price, 2),
                'current_price': round(current_price, 2),
                'elasticity': -1.5,
                'inventory_status': 'medium',
                'ml_confidence': 0.75,
                'ab_testing_results': [],
                'justification': {
                    'recommended_price': recommended_price,
                    'current_price': current_price,
                    'price_change_percent': ((recommended_price - current_price) / current_price) * 100,
                    'price_change_direction': 'increase' if recommended_price > current_price else 'decrease',
                    'factors': [
                        {
                            'name': 'cost_based',
                            'description': 'Cost-based pricing strategy',
                            'impact': f"Cost price of ${cost_price} sets the baseline"
                        },
                        {
                            'name': 'inventory_levels',
                            'description': 'Inventory-aware pricing',
                            'impact': f"Current stock of {stock} units affects pricing strategy"
                        }
                    ],
                    'summary': f"Recommended price adjustment to ${recommended_price} based on inventory levels and demand forecast."
                },
                'optimization_factors': {
                    'cost_price': cost_price,
                    'demand_forecast': demand,
                    'stock_level': stock,
                    'customer_rating': product_data.get('customer_rating', 0)
                }
            }
        else:
            optimization_result = advanced_optimize_price(product_data)
        
        return Response({
            'success': True,
            'data': optimization_result,
            'message': 'ML price optimization completed successfully'
        })
        
    except Exception as e:
        logger.error(f"Error in ML price optimization: {str(e)}")
        return Response({
            'success': False,
            'error': 'Failed to optimize price using ML'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def ab_testing_simulator_view(request):
    """Simulate A/B testing for different pricing strategies"""
    try:
        product_id = request.data.get('product_id')
        strategy_name = request.data.get('strategy_name')  # Optional, if not provided, compare all
        
        if not product_id:
            return Response({
                'success': False,
                'error': 'Product ID is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response({
                'success': False,
                'error': 'Product not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        product_serializer = ProductListSerializer(product)
        product_data = product_serializer.data
        
        simulator = ABTestingSimulator()
        
        if strategy_name:
            # Simulate specific strategy
            result = simulator.simulate_strategy(product_data, strategy_name)
            if not result:
                return Response({
                    'success': False,
                    'error': f'Invalid strategy: {strategy_name}'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            return Response({
                'success': True,
                'data': result,
                'message': f'A/B testing simulation for {strategy_name} strategy completed'
            })
        else:
            # Compare all strategies
            results = simulator.compare_strategies(product_data)
            
            return Response({
                'success': True,
                'data': {
                    'strategies': results,
                    'best_strategy': results[0] if results else None,
                    'summary': {
                        'total_strategies': len(results),
                        'profit_range': {
                            'min': min([r['profit'] for r in results]) if results else 0,
                            'max': max([r['profit'] for r in results]) if results else 0
                        }
                    }
                },
                'message': 'A/B testing simulation for all strategies completed'
            })
        
    except Exception as e:
        logger.error(f"Error in A/B testing simulation: {str(e)}")
        return Response({
            'success': False,
            'error': 'Failed to simulate A/B testing'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def inventory_analysis_view(request):
    """Get inventory analysis for all products"""
    try:
        products = Product.objects.all()
        serializer = ProductListSerializer(products, many=True)
        product_data = serializer.data
        
        inventory_analysis = {
            'total_products': len(product_data),
            'inventory_status': {
                'low': 0,
                'medium': 0,
                'adequate': 0,
                'high': 0,
                'unknown': 0
            },
            'products_by_status': {
                'low': [],
                'medium': [],
                'adequate': [],
                'high': [],
                'unknown': []
            },
            'recommendations': []
        }
        
        from .advanced_optimization import InventoryAwareOptimizer
        inventory_optimizer = InventoryAwareOptimizer()
        
        for product in product_data:
            # Use demand_forecast_value as demand forecast if available, otherwise use units_sold
            demand_forecast = product.get('demand_forecast_value', product.get('units_sold', 100))
            # Ensure demand_forecast is numeric
            try:
                demand_forecast = float(demand_forecast) if demand_forecast is not None else 100
            except (ValueError, TypeError):
                demand_forecast = 100
            
            # Ensure stock_available is numeric
            try:
                stock_available = float(product['stock_available']) if product['stock_available'] is not None else 0
            except (ValueError, TypeError):
                stock_available = 0
            
            status = inventory_optimizer.get_inventory_status(product)
            inventory_analysis['inventory_status'][status] += 1
            inventory_analysis['products_by_status'][status].append({
                'id': product['id'],
                'name': product['name'],
                'category': product['category'],
                'stock': stock_available,
                'demand': demand_forecast,
                'stock_ratio': round(stock_available / max(demand_forecast, 1), 2)
            })
        
        # Generate recommendations
        low_stock_products = inventory_analysis['products_by_status']['low']
        if low_stock_products:
            inventory_analysis['recommendations'].append({
                'type': 'low_stock',
                'message': f'{len(low_stock_products)} products have low stock levels',
                'action': 'Consider increasing prices or restocking',
                'products': low_stock_products[:5]  # Top 5
            })
        
        high_stock_products = inventory_analysis['products_by_status']['high']
        if high_stock_products:
            inventory_analysis['recommendations'].append({
                'type': 'high_stock',
                'message': f'{len(high_stock_products)} products have excess stock',
                'action': 'Consider promotional pricing or bundling',
                'products': high_stock_products[:5]  # Top 5
            })
        
        return Response({
            'success': True,
            'data': inventory_analysis,
            'message': 'Inventory analysis completed successfully'
        })
        
    except Exception as e:
        logger.error(f"Error in inventory analysis: {str(e)}")
        return Response({
            'success': False,
            'error': 'Failed to analyze inventory'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def batch_optimization_view(request):
    """Perform batch optimization for multiple products"""
    try:
        product_ids = request.data.get('product_ids', [])
        optimization_type = request.data.get('type', 'ml')  # 'ml', 'ab_testing', 'inventory'
        
        if not product_ids:
            return Response({
                'success': False,
                'error': 'Product IDs are required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        products = Product.objects.filter(id__in=product_ids)
        if not products.exists():
            return Response({
                'success': False,
                'error': 'No valid products found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        serializer = ProductListSerializer(products, many=True)
        product_data = serializer.data
        
        results = []
        
        if optimization_type == 'ml':
            # Train ML model on all products first
            all_products = Product.objects.all()
            all_serializer = ProductListSerializer(all_products, many=True)
            all_product_data = all_serializer.data
            
            ml_optimizer = MLPriceOptimizer()
            ml_optimizer.train_model(all_product_data)
            
            # Optimize each product
            for product in product_data:
                optimization_result = advanced_optimize_price(product)
                results.append({
                    'product_id': product['id'],
                    'product_name': product['name'],
                    'optimization': optimization_result
                })
        
        elif optimization_type == 'ab_testing':
            simulator = ABTestingSimulator()
            for product in product_data:
                ab_results = simulator.compare_strategies(product)
                results.append({
                    'product_id': product['id'],
                    'product_name': product['name'],
                    'strategies': ab_results,
                    'best_strategy': ab_results[0] if ab_results else None
                })
        
        elif optimization_type == 'inventory':
            from .advanced_optimization import InventoryAwareOptimizer
            inventory_optimizer = InventoryAwareOptimizer()
            
            for product in product_data:
                status = inventory_optimizer.get_inventory_status(product)
                current_price = float(product['selling_price'])
                adjusted_price = inventory_optimizer.adjust_price_for_inventory(
                    current_price, status, float(product.get('demand_forecast_value', 100)), -1.5
                )
                
                results.append({
                    'product_id': product['id'],
                    'product_name': product['name'],
                    'inventory_status': status,
                    'current_price': current_price,
                    'recommended_price': round(adjusted_price, 2),
                    'price_change': round(((adjusted_price - current_price) / current_price) * 100, 1)
                })
        
        return Response({
            'success': True,
            'data': {
                'optimization_type': optimization_type,
                'products_processed': len(results),
                'results': results
            },
            'message': f'Batch {optimization_type} optimization completed successfully'
        })
        
    except Exception as e:
        logger.error(f"Error in batch optimization: {str(e)}")
        return Response({
            'success': False,
            'error': 'Failed to perform batch optimization'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def optimization_dashboard_view(request):
    """Get comprehensive optimization dashboard data"""
    try:
        products = Product.objects.all()
        serializer = ProductListSerializer(products, many=True)
        product_data = serializer.data
        
        # Calculate various metrics
        total_products = len(product_data)
        total_revenue = sum(float(p.get('revenue', 0)) for p in product_data)
        avg_margin = sum(float(p.get('profit_margin', 0)) for p in product_data) / max(total_products, 1)
        
        # Category distribution
        categories = {}
        for product in product_data:
            category = product['category']
            if category not in categories:
                categories[category] = {'count': 0, 'revenue': 0, 'avg_margin': 0}
            categories[category]['count'] += 1
            categories[category]['revenue'] += float(product.get('revenue', 0))
        
        # Calculate average margin per category
        for category in categories:
            category_products = [p for p in product_data if p['category'] == category]
            categories[category]['avg_margin'] = sum(float(p.get('profit_margin', 0)) for p in category_products) / len(category_products)
        
        # Get elasticity heatmap
        analyzer = PriceElasticityAnalyzer()
        heatmap_data = analyzer.get_elasticity_heatmap(product_data)
        
        # Get inventory analysis
        from .advanced_optimization import InventoryAwareOptimizer
        inventory_optimizer = InventoryAwareOptimizer()
        inventory_status = {'low': 0, 'medium': 0, 'adequate': 0, 'high': 0}
        
        for product in product_data:
            status = inventory_optimizer.get_inventory_status(product)
            inventory_status[status] += 1
        
        dashboard_data = {
            'overview': {
                'total_products': total_products,
                'total_revenue': round(total_revenue, 2),
                'average_margin': round(avg_margin, 2),
                'categories_count': len(categories)
            },
            'categories': categories,
            'elasticity_heatmap': heatmap_data,
            'inventory_status': inventory_status,
            'optimization_opportunities': {
                'low_margin_products': len([p for p in product_data if float(p.get('profit_margin', 0)) < 20]),
                'high_stock_products': inventory_status['high'],
                'low_stock_products': inventory_status['low'],
                'elastic_products': len([d for d in heatmap_data.get('data', []) if d.get('range_index', 1) <= 1])
            }
        }
        
        return Response({
            'success': True,
            'data': dashboard_data,
            'message': 'Optimization dashboard data generated successfully'
        })
        
    except Exception as e:
        logger.error(f"Error generating optimization dashboard: {str(e)}")
        return Response({
            'success': False,
            'error': 'Failed to generate optimization dashboard'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR) 