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
    """
    Find the price that maximizes profit = (price - cost_price) * demand,
    where demand = base_demand * (price / current_price)^demand_elasticity.

    Returns:
      best_price (float): revenue‐maximizing price, rounded to 2 d.p.
      best_profit (float): profit at that price, rounded to 2 d.p.
    """
    cost_price = float(cost_price)
    # reference price for base_demand
    if current_price is None:
        current_price = cost_price * 1.2
    else:
        current_price = float(current_price)

    # candidate price grid
    prices = np.linspace(cost_price, cost_price * max_price_factor, steps)

    # compute demand
    demands = base_demand * (prices / current_price) ** demand_elasticity
    # compute profit instead of revenue
    profits = (prices - cost_price) * demands

    # pick best
    idx = np.nanargmax(profits)   # in case some profits are negative/NaN
    best_price  = prices[idx]
    best_profit = profits[idx]

    return round(best_price, 2), round(best_profit, 2)
