from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('buyer', 'Buyer'),
        ('supplier', 'Supplier'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='buyer')

    def __str__(self):
        return f"{self.username} ({self.role})"


class Product(models.Model):
    name = models.CharField(max_length=255)
    category = models.CharField(max_length=100)
    cost_price = models.DecimalField(max_digits=10, decimal_places=2)
    selling_price = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField(blank=True)
    stock_available = models.PositiveIntegerField()
    units_sold = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.name
