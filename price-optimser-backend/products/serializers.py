from rest_framework import serializers
from .models import Product

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'

class ProductListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'category', 'cost_price', 'selling_price',
            'description', 'stock_available', 'units_sold', 'customer_rating',
            'demand_forecast', 'optimized_price'
        ]
