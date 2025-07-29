from rest_framework import serializers
from decimal import Decimal
from .models import Product

class ProductSerializer(serializers.ModelSerializer):
    profit_margin = serializers.SerializerMethodField()
    revenue = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = '__all__'
        read_only_fields = ['optimized_price']
    
    def get_profit_margin(self, obj):
        """Calculate profit margin percentage"""
        if obj.selling_price and obj.cost_price:
            margin = ((obj.selling_price - obj.cost_price) / obj.selling_price) * 100
            return round(margin, 2)
        return 0
    
    def get_revenue(self, obj):
        """Calculate total revenue"""
        if obj.selling_price and obj.units_sold:
            return obj.selling_price * obj.units_sold
        return Decimal('0.00')
    
    def validate(self, data):
        """Validate product data"""
        if data.get('selling_price') and data.get('cost_price'):
            if data['selling_price'] <= data['cost_price']:
                raise serializers.ValidationError(
                    "Selling price must be greater than cost price"
                )
        
        if data.get('stock_available') is not None and data['stock_available'] < 0:
            raise serializers.ValidationError(
                "Stock available cannot be negative"
            )
        
        if data.get('units_sold') is not None and data['units_sold'] < 0:
            raise serializers.ValidationError(
                "Units sold cannot be negative"
            )
        
        if data.get('customer_rating') is not None:
            rating = data['customer_rating']
            if rating < 0 or rating > 5:
                raise serializers.ValidationError(
                    "Customer rating must be between 0 and 5"
                )
        
        return data

class ProductListSerializer(serializers.ModelSerializer):
    profit_margin = serializers.SerializerMethodField()
    revenue = serializers.SerializerMethodField()
    demand_forecast_value = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'category', 'cost_price', 'selling_price',
            'description', 'stock_available', 'units_sold', 'customer_rating',
            'demand_forecast', 'optimized_price', 'profit_margin', 'revenue',
            'demand_forecast_value'
        ]
        read_only_fields = ['optimized_price']
    
    def get_profit_margin(self, obj):
        """Calculate profit margin percentage"""
        if obj.selling_price and obj.cost_price:
            margin = ((obj.selling_price - obj.cost_price) / obj.selling_price) * 100
            return round(margin, 2)
        return 0
    
    def get_revenue(self, obj):
        """Calculate total revenue"""
        if obj.selling_price and obj.units_sold:
            return obj.selling_price * obj.units_sold
        return Decimal('0.00')
    
    def get_demand_forecast_value(self, obj):
        """Get the latest demand forecast value"""
        if hasattr(obj, 'demand_forecast') and obj.demand_forecast:
            if isinstance(obj.demand_forecast, dict) and obj.demand_forecast:
                # Return the latest forecast value
                latest_year = max(obj.demand_forecast.keys())
                return obj.demand_forecast[latest_year]
        return 0
