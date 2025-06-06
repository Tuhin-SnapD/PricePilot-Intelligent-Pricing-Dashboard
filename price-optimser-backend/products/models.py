from django.db import models

class Product(models.Model):
    name = models.CharField(max_length=255)
    category = models.CharField(max_length=100)
    cost_price = models.DecimalField(max_digits=10, decimal_places=2)
    selling_price = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField(blank=True)
    stock_available = models.PositiveIntegerField()
    units_sold = models.PositiveIntegerField()
    customer_rating = models.DecimalField(max_digits=3, decimal_places=2, null=True, blank=True)
    demand_forecast = models.JSONField(default=dict)  # store historical/yearly forecasts
    optimized_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    def __str__(self):
        return f"{self.name} ({self.category})"
