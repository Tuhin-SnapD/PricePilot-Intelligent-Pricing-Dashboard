from rest_framework import generics
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
import ast
from .models import Product
from .serializers import ProductSerializer, ProductListSerializer
from .permissions import IsAdminOrReadOnly, IsSupplierOrAdmin
from .forecasts import simple_linear_forecast
from .optimization import optimize_price

class ProductListCreateView(generics.ListCreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated, IsSupplierOrAdmin]

    def perform_create(self, serializer):
        serializer.save()

class ProductRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated, IsAdminOrReadOnly]

class ProductSearchView(generics.ListAPIView):
    serializer_class = ProductListSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Product.objects.all()
        name = self.request.query_params.get('name')
        category = self.request.query_params.get('category')
        if name:
            queryset = queryset.filter(name__icontains=name)
        if category:
            queryset = queryset.filter(category__iexact=category)
        return queryset

class DemandForecastView(generics.GenericAPIView):
    serializer_class = ProductListSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        products = Product.objects.all()
        results = []
        for prod in products:
            forecast_data = prod.demand_forecast

            if isinstance(forecast_data, str):
                try:
                    forecast_data = ast.literal_eval(forecast_data)
                except:
                    forecast_data = {}

            forecast = simple_linear_forecast(forecast_data or {})
            results.append({
                'product_id': prod.id,
                'name': prod.name,
                'forecast': forecast,
            })
        return Response(results)

class PricingOptimizationView(generics.GenericAPIView):
    serializer_class   = ProductListSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        results = []
        for prod in Product.objects.all():
            best_price, best_profit = optimize_price(prod.cost_price)

            # only assign the best_price to your DecimalField
            prod.optimized_price = best_price
            prod.save()

            results.append({
                'product_id':       prod.id,
                'name':             prod.name,
                'optimized_price':  best_price,   # Decimal
                'optimized_profit': best_profit,  # if you want to return it
            })

        return Response(results)