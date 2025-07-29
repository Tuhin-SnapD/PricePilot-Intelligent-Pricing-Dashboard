import numpy as np
from decimal import Decimal

def optimize_price(
    cost_price,
    current_price=None,
    demand_elasticity=-1.5,
    max_price_factor=1.5,
    base_demand=100.0,
    steps=100
):
    cost_price = float(cost_price)
    if current_price is None:
        current_price = cost_price * 1.2
    else:
        current_price = float(current_price)

    prices  = np.linspace(cost_price, cost_price * max_price_factor, steps)
    demands = base_demand * (prices / current_price) ** demand_elasticity
    profits = (prices - cost_price) * demands

    idx = np.nanargmax(profits)

    # Convert to Decimal, rounded to 2 d.p.
    best_price  = Decimal(prices[idx]).quantize(Decimal("0.01"))
    best_profit = Decimal(profits[idx]).quantize(Decimal("0.01"))

    return best_price, best_profit