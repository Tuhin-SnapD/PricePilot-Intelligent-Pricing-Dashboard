from django.urls import path
from .views import (
    ProductListCreateView, ProductRetrieveUpdateDestroyView,
    ProductSearchView, DemandForecastView, PricingOptimizationView, AdvancedForecastView
)
from .advanced_views import (
    elasticity_heatmap_view,
    ml_optimize_price_view,
    ab_testing_simulator_view,
    inventory_analysis_view,
    batch_optimization_view,
    optimization_dashboard_view
)

urlpatterns = [
    path('', ProductListCreateView.as_view(), name='product_list_create'),
    path('<int:pk>/', ProductRetrieveUpdateDestroyView.as_view(), name='product_detail'),
    path('search/', ProductSearchView.as_view(), name='product_search'),
    path('forecast/', DemandForecastView.as_view(), name='demand_forecast'),
    path('advanced-forecast/', AdvancedForecastView.as_view(), name='advanced_forecast'),
    path('optimize/', PricingOptimizationView.as_view(), name='pricing_optimization'),
    
    # Advanced optimization endpoints
    path('elasticity-heatmap/', elasticity_heatmap_view, name='elasticity_heatmap'),
    path('ml-optimize/', ml_optimize_price_view, name='ml_optimize_price'),
    path('ab-testing/', ab_testing_simulator_view, name='ab_testing_simulator'),
    path('inventory-analysis/', inventory_analysis_view, name='inventory_analysis'),
    path('batch-optimize/', batch_optimization_view, name='batch_optimization'),
    path('optimization-dashboard/', optimization_dashboard_view, name='optimization_dashboard'),
]
