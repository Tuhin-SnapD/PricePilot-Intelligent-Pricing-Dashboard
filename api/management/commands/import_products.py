import csv
from django.core.management.base import BaseCommand
from api.models import Product

class Command(BaseCommand):
    help = 'Import products from a CSV file'

    def handle(self, *args, **kwargs):
        file_path = 'api/fixtures/product_data.csv'
        with open(file_path, newline='', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                Product.objects.update_or_create(
                    name=row['name'],
                    defaults={
                        'description': row['description'],
                        'cost_price': row['cost_price'],
                        'selling_price': row['selling_price'],
                        'category': row['category'],
                        'stock_available': row['stock_available'],
                        'units_sold': row['units_sold'],
                    }
                )
        self.stdout.write(self.style.SUCCESS('Successfully imported products.'))
