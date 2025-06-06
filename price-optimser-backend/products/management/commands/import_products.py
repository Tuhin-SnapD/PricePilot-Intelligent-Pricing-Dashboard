import csv
import ast
from django.core.management.base import BaseCommand
from products.models import Product

class Command(BaseCommand):
    help = "Import products from CSV file"

    def add_arguments(self, parser):
        parser.add_argument('csv_path', type=str, help='Path to the product CSV file')

    def handle(self, *args, **kwargs):
        csv_path = kwargs['csv_path']
        with open(csv_path, newline='', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                # Parse demand_forecast safely
                try:
                    forecast = ast.literal_eval(row['demand_forecast'])
                    if not isinstance(forecast, dict):
                        forecast = {}
                except Exception:
                    forecast = {}

                Product.objects.update_or_create(
                    name=row['name'],
                    defaults={
                        'category': row['category'],
                        'cost_price': row['cost_price'],
                        'selling_price': row['selling_price'],
                        'description': row['description'],
                        'stock_available': row['stock_available'],
                        'units_sold': row['units_sold'],
                        'customer_rating': row['customer_rating'],
                        'demand_forecast': forecast,
                        'optimized_price': row['optimized_price']
                    }
                )
        self.stdout.write(self.style.SUCCESS('✅ Product data imported successfully.'))
