from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.db import transaction

User = get_user_model()

class Command(BaseCommand):
    help = 'Create test users for the Price Optimizer Tool'

    def handle(self, *args, **options):
        users_data = [
            {
                'username': 'admin',
                'password': 'admin',
                'email': 'admin@gmail.com',
                'role': 'admin',
                'first_name': 'Admin',
                'last_name': 'User',
                'is_staff': True,
                'is_superuser': True
            },
            {
                'username': 'buyer',
                'password': 'buyer',
                'email': 'buyer@gmail.com',
                'role': 'buyer',
                'first_name': 'Buyer',
                'last_name': 'User'
            },
            {
                'username': 'supplier',
                'password': 'supplier',
                'email': 'supplier@gmail.com',
                'role': 'supplier',
                'first_name': 'Supplier',
                'last_name': 'User'
            }
        ]

        with transaction.atomic():
            for user_data in users_data:
                username = user_data['username']
                
                # Check if user already exists
                if User.objects.filter(username=username).exists():
                    self.stdout.write(
                        self.style.WARNING(f'User "{username}" already exists. Skipping...')
                    )
                    continue
                
                # Create user
                user = User.objects.create_user(
                    username=user_data['username'],
                    email=user_data['email'],
                    password=user_data['password'],
                    role=user_data['role'],
                    first_name=user_data['first_name'],
                    last_name=user_data['last_name'],
                    is_staff=user_data.get('is_staff', False),
                    is_superuser=user_data.get('is_superuser', False)
                )
                
                self.stdout.write(
                    self.style.SUCCESS(
                        f'Successfully created user "{username}" with role "{user_data["role"]}"'
                    )
                )

        self.stdout.write(
            self.style.SUCCESS('\nAll test users created successfully!')
        )
        self.stdout.write('\nTest Users:')
        self.stdout.write('==========')
        self.stdout.write('Admin:    username=admin, password=admin')
        self.stdout.write('Buyer:    username=buyer, password=buyer')
        self.stdout.write('Supplier: username=supplier, password=supplier')
        self.stdout.write('\nYou can now test the API with these credentials!') 