import numpy as np
from decimal import Decimal

def optimize_price(cost_price, demand_elasticity=-1.5, max_price_factor=1.5):
    """
    Simple illustrative pricing optimization:
    - demand_elasticity: elasticity coefficient (e.g., -1.5)
    - max_price_factor: maximum factor above cost_price to consider
    Use revenue maximization: revenue = price * demand
    Assume base demand at current price is proportional to 1.
    """
    # Convert Decimal to float for NumPy compatibility
    cost_price = float(cost_price)
    base_price = cost_price * 1.2
    base_demand = 100

    prices = np.linspace(cost_price, cost_price * max_price_factor, 50)
    best_price, best_revenue = cost_price, 0

    for p in prices:
        demand = base_demand * (p / base_price) ** demand_elasticity
        revenue = p * demand
        if revenue > best_revenue:
            best_revenue = revenue
            best_price = p

    return round(best_price, 2)
