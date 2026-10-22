import React, { useEffect, useState } from "react";
import { FiBarChart2, FiZap } from "react-icons/fi";
import api from "../../api";
import { formatCurrency, formatNumber } from "../../utils/format";

const STRATEGIES = [
  { key: "penetration", name: "Penetration Pricing", description: "Low price to gain market share" },
  { key: "skimming", name: "Price Skimming", description: "High price for premium positioning" },
  { key: "competitive", name: "Competitive Pricing", description: "Match competitor pricing" },
  { key: "cost_plus", name: "Cost-Plus Pricing", description: "Cost plus 20% margin" },
  { key: "value_based", name: "Value-Based Pricing", description: "Price based on perceived value" },
];

const ABTestingSimulator = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [abResults, setAbResults] = useState(null);
  const [selectedStrategy, setSelectedStrategy] = useState("");
  const [loading, setLoading] = useState(false);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState(null);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    try {
      setProductsLoading(true);
      setProductsError(null);
      const response = await api.get("/products/");
      const data = response.data.success ? response.data.data : response.data;
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      setProducts([]);
      setProductsError("Unable to load products.");
    } finally {
      setProductsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const runABTest = async (productId, strategy = null) => {
    setLoading(true);
    setError(null);

    try {
      const payload = { product_id: productId };
      if (strategy) {
        payload.strategy_name = strategy;
      }

      const response = await api.post("/products/ab-testing/", payload);

      if (response.data.success) {
        setAbResults(response.data.data);
      } else {
        setError(response.data.error || "Failed to run the A/B test.");
      }
    } catch (err) {
      setError(
        err.response?.data?.error || "Failed to run the A/B test. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setAbResults(null);
    setSelectedStrategy("");
    runABTest(product.id);
  };

  const handleStrategySelect = (strategy) => {
    if (!selectedProduct) return;
    setSelectedStrategy(strategy);
    runABTest(selectedProduct.id, strategy);
  };

  const getProfitColor = (profit, maxProfit) => {
    const value = Number(profit);
    const maximum = Number(maxProfit);

    if (!Number.isFinite(value) || !Number.isFinite(maximum) || maximum <= 0) {
      return "text-gray-300";
    }

    const ratio = value / maximum;
    if (ratio > 0.8) return "text-green-400";
    if (ratio > 0.6) return "text-yellow-400";
    return "text-red-400";
  };

  const getChangeColor = (change) => {
    const value = Number(change);
    if (!Number.isFinite(value)) return "text-gray-400";
    if (value > 0) return "text-green-400";
    if (value < 0) return "text-red-400";
    return "text-gray-400";
  };

  const strategyList = Array.isArray(abResults?.strategies) ? abResults.strategies : [];
  const maxProfit = strategyList.length > 0 ? Math.max(...strategyList.map((s) => Number(s.profit) || 0)) : 0;
  const activeStrategy = STRATEGIES.find((strategy) => strategy.key === selectedStrategy);

  return (
    <div className="bg-gray-900 rounded-lg p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center space-x-3">
          <FiBarChart2 className="text-2xl text-teal-400" />
          <h2 className="text-xl font-semibold text-white">A/B Testing Simulator</h2>
        </div>
        <div className="text-sm text-gray-400">Compare pricing strategies</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <h3 className="text-lg font-medium text-white mb-4">Select Product</h3>

          {productsLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-400"></div>
            </div>
          ) : productsError ? (
            <div className="text-center p-4">
              <p className="text-red-400 mb-3 text-sm">{productsError}</p>
              <button
                type="button"
                onClick={fetchProducts}
                className="px-3 py-1 bg-teal-500 text-black rounded text-sm hover:bg-teal-600"
              >
                Retry
              </button>
            </div>
          ) : products.length === 0 ? (
            <p className="text-sm text-gray-400">No products available.</p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {products.map((product) => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => handleProductSelect(product)}
                  aria-pressed={selectedProduct?.id === product.id}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedProduct?.id === product.id
                      ? "bg-teal-500 text-black"
                      : "bg-gray-800 hover:bg-gray-700 text-white"
                  }`}
                >
                  <div className="font-medium text-sm">{product.name}</div>
                  <div className="text-xs opacity-75">{product.category}</div>
                  <div className="text-xs opacity-75">
                    {formatCurrency(product.selling_price)}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <h3 className="text-lg font-medium text-white mb-4">Pricing Strategies</h3>
          {!selectedProduct && (
            <p className="text-xs text-gray-500 mb-3">Select a product to enable strategies.</p>
          )}
          <div className="space-y-2">
            {STRATEGIES.map((strategy) => (
              <button
                key={strategy.key}
                type="button"
                onClick={() => handleStrategySelect(strategy.key)}
                disabled={!selectedProduct}
                aria-pressed={selectedStrategy === strategy.key}
                className={`w-full text-left p-3 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                  selectedStrategy === strategy.key
                    ? "bg-teal-500 text-black"
                    : "bg-gray-800 hover:bg-gray-700 text-white"
                }`}
              >
                <div className="font-medium text-sm">{strategy.name}</div>
                <div className="text-xs opacity-75">{strategy.description}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2">
          {loading && (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-400 mx-auto mb-4"></div>
                <p className="text-gray-400">Running A/B test simulation...</p>
              </div>
            </div>
          )}

          {error && !loading && (
            <div className="text-center p-6">
              <p className="text-red-400 mb-4">{error}</p>
              <button
                type="button"
                onClick={() => selectedProduct && runABTest(selectedProduct.id, selectedStrategy)}
                className="px-4 py-2 bg-teal-500 text-black rounded hover:bg-teal-600"
              >
                Retry
              </button>
            </div>
          )}

          {abResults && !loading && !error && (
            <div className="space-y-6">
              {selectedStrategy ? (
                <div className="bg-gray-800 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-white mb-4">
                    {activeStrategy?.name || "Selected"} Strategy
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">
                        {formatCurrency(abResults.price)}
                      </div>
                      <div className="text-sm text-gray-400">Price</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">
                        {formatNumber(abResults.demand)}
                      </div>
                      <div className="text-sm text-gray-400">Demand</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">
                        {formatCurrency(abResults.revenue)}
                      </div>
                      <div className="text-sm text-gray-400">Revenue</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">
                        {formatCurrency(abResults.profit)}
                      </div>
                      <div className="text-sm text-gray-400">Profit</div>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-gray-700 rounded-lg space-y-1">
                    <div className="text-sm text-gray-300">
                      Price Change:{" "}
                      <span className={getChangeColor(abResults.price_change)}>
                        {Number(abResults.price_change) > 0 ? "+" : ""}
                        {Number.isFinite(Number(abResults.price_change))
                          ? Number(abResults.price_change).toFixed(1)
                          : "0.0"}
                        %
                      </span>
                    </div>
                    <div className="text-sm text-gray-300">
                      Margin:{" "}
                      {Number.isFinite(Number(abResults.margin))
                        ? `${Number(abResults.margin).toFixed(1)}%`
                        : "—"}
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="bg-gray-800 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-white mb-4">Strategy Comparison</h3>
                    {strategyList.length === 0 ? (
                      <p className="text-sm text-gray-400">No strategy results returned.</p>
                    ) : (
                      <div className="space-y-4">
                        {strategyList.map((strategy, index) => (
                          <div
                            key={`${strategy.strategy}-${index}`}
                            className="bg-gray-700 rounded-lg p-4"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="font-medium text-white capitalize">
                                {String(strategy.strategy || "").replace(/_/g, " ")}
                              </div>
                              {index === 0 && (
                                <div className="flex items-center space-x-1 text-green-400">
                                  <FiZap />
                                  <span className="text-sm">Best</span>
                                </div>
                              )}
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                              <div>
                                <span className="text-gray-400">Price:</span>
                                <span className="text-white ml-1">
                                  {formatCurrency(strategy.price)}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-400">Demand:</span>
                                <span className="text-white ml-1">
                                  {formatNumber(strategy.demand)}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-400">Revenue:</span>
                                <span className="text-white ml-1">
                                  {formatCurrency(strategy.revenue)}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-400">Profit:</span>
                                <span className={`ml-1 ${getProfitColor(strategy.profit, maxProfit)}`}>
                                  {formatCurrency(strategy.profit)}
                                </span>
                              </div>
                            </div>
                            {strategy.description && (
                              <div className="mt-2 text-xs text-gray-400">
                                {strategy.description}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {abResults.summary && (
                    <div className="bg-gray-800 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-white mb-2">Summary</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">Strategies:</span>
                          <span className="text-white ml-1">
                            {abResults.summary.total_strategies ?? strategyList.length}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-400">Min Profit:</span>
                          <span className="text-white ml-1">
                            {formatCurrency(abResults.summary.profit_range?.min)}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-400">Max Profit:</span>
                          <span className="text-white ml-1">
                            {formatCurrency(abResults.summary.profit_range?.max)}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-400">Best Strategy:</span>
                          <span className="text-green-400 ml-1 capitalize">
                            {abResults.best_strategy?.strategy
                              ? String(abResults.best_strategy.strategy).replace(/_/g, " ")
                              : "—"}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {!selectedProduct && !loading && (
            <div className="text-center p-12">
              <FiBarChart2 className="text-4xl text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">Select a product to run an A/B testing simulation</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ABTestingSimulator;
