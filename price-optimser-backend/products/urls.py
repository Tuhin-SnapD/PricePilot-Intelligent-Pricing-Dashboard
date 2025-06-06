from django.urls import path
from .views import (
    ProductListCreateView, ProductRetrieveUpdateDestroyView,
    ProductSearchView, DemandForecastView, PricingOptimizationView
)

urlpatterns = [
    path('', ProductListCreateView.as_view(), name='product_list_create'),
    path('<int:pk>/', ProductRetrieveUpdateDestroyView.as_view(), name='product_detail'),
    path('search/', ProductSearchView.as_view(), name='product_search'),
    path('forecast/', DemandForecastView.as_view(), name='demand_forecast'),
    path('optimize/', PricingOptimizationView.as_view(), name='pricing_optimization'),
]
