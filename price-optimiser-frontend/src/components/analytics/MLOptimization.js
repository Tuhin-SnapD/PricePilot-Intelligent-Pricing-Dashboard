import React, { useEffect, useState } from "react";
import { FiTrendingUp, FiTrendingDown, FiTarget, FiInfo } from "react-icons/fi";
import api from "../../api";
import { formatCurrency, formatNumber } from "../../utils/format";

const MLOptimization = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [optimizationResult, setOptimizationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [productsError, setProductsError] = useState(null);

  const fetchProducts = async () => {
    try {
      setProductsError(null);
      const response = await api.get("/products/");
      const data = response.data.success ? response.data.data : response.data;
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      setProducts([]);
      setProductsError("Unable to load products.");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const optimizeProduct = async (productId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post("/products/ml-optimize/", { product_id: productId });
      if (response.data.success) {
        setOptimizationResult(response.data.data);
      } else {
        setError(response.data.error || "Failed to optimize this product.");
      }
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Failed to optimize this product. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setOptimizationResult(null);
    optimizeProduct(product.id);
  };

  const getPriceChangeColor = (change) => {
    if (change > 0) return "text-green-400";
    if (change < 0) return "text-red-400";
    return "text-gray-400";
  };

  const getPriceChangeIcon = (change) => {
    if (change > 0) return <FiTrendingUp className="text-green-400" />;
    if (change < 0) return <FiTrendingDown className="text-red-400" />;
    return <FiTarget className="text-gray-400" />;
  };

  const justification = optimizationResult?.justification || {};
  const priceChange = Number(justification.price_change_percent);
  const factors = Array.isArray(justification.factors) ? justification.factors : [];
  const strategies = Array.isArray(optimizationResult?.ab_testing_results)
    ? optimizationResult.ab_testing_results
    : [];
  const confidence = Number(optimizationResult?.ml_confidence);

  return (
    <div className="bg-gray-900 rounded-lg p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center space-x-3">
          <FiTarget className="text-2xl text-teal-400" />
          <h2 className="text-xl font-semibold text-white">ML Price Optimization</h2>
        </div>
        <div className="text-sm text-gray-400">Select a product to analyze</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <h3 className="text-lg font-medium text-white mb-4">Products</h3>

          {productsError ? (
            <div className="text-center p-6">
              <p className="text-red-400 mb-3">{productsError}</p>
              <button
                type="button"
                onClick={fetchProducts}
                className="px-4 py-2 bg-teal-500 text-black rounded hover:bg-teal-600"
              >
                Retry
              </button>
            </div>
          ) : products.length === 0 ? (
            <p className="text-sm text-gray-400 p-2">No products available.</p>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
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
                  <div className="font-medium">{product.name}</div>
                  <div className="text-sm opacity-75">{product.category}</div>
                  <div className="text-sm opacity-75">
                    Current: {formatCurrency(product.selling_price)}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
          {loading && (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-400 mx-auto mb-4"></div>
                <p className="text-gray-400">Analyzing pricing with AI...</p>
              </div>
            </div>
          )}

          {error && !loading && (
            <div className="text-center p-6">
              <p className="text-red-400 mb-4">{error}</p>
              <button
                type="button"
                onClick={() => selectedProduct && optimizeProduct(selectedProduct.id)}
                className="px-4 py-2 bg-teal-500 text-black rounded hover:bg-teal-600"
              >
                Retry
              </button>
            </div>
          )}

          {optimizationResult && !loading && (
            <div className="space-y-6">
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-medium text-white mb-4">AI Recommendation</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">
                      {formatCurrency(optimizationResult.recommended_price)}
                    </div>
                    <div className="text-sm text-gray-400">Recommended Price</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">
                      {formatCurrency(optimizationResult.current_price)}
                    </div>
                    <div className="text-sm text-gray-400">Current Price</div>
                  </div>
                  <div className="text-center">
                    <div
                      className={`text-2xl font-bold flex items-center justify-center space-x-1 ${getPriceChangeColor(
                        priceChange
                      )}`}
                    >
                      {getPriceChangeIcon(priceChange)}
                      <span>
                        {priceChange > 0 ? "+" : ""}
                        {Number.isFinite(priceChange) ? priceChange.toFixed(1) : "0.0"}%
                      </span>
                    </div>
                    <div className="text-sm text-gray-400">Price Change</div>
                  </div>
                </div>

                {justification.summary && (
                  <div className="bg-gray-700 rounded-lg p-4">
                    <p className="text-white">{justification.summary}</p>
                  </div>
                )}
              </div>

              {factors.length > 0 && (
                <div className="bg-gray-800 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-white mb-4">Optimization Factors</h3>
                  <div className="space-y-3">
                    {factors.map((factor, index) => (
                      <div
                        key={`${factor.name}-${index}`}
                        className="flex items-start space-x-3 p-3 bg-gray-700 rounded-lg"
                      >
                        <FiInfo className="text-teal-400 mt-1 flex-shrink-0" />
                        <div>
                          <div className="font-medium text-white">
                            {String(factor.name || "Factor").replace(/_/g, " ").toUpperCase()}
                          </div>
                          <div className="text-sm text-gray-400">{factor.description}</div>
                          {factor.impact && (
                            <div className="text-sm text-gray-300 mt-1">{factor.impact}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {strategies.length > 0 && (
                <div className="bg-gray-800 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-white mb-4">Strategy Comparison</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-700">
                          <th className="text-left py-2 text-gray-300">Strategy</th>
                          <th className="text-right py-2 text-gray-300">Price</th>
                          <th className="text-right py-2 text-gray-300">Demand</th>
                          <th className="text-right py-2 text-gray-300">Revenue</th>
                          <th className="text-right py-2 text-gray-300">Profit</th>
                          <th className="text-right py-2 text-gray-300">Margin</th>
                        </tr>
                      </thead>
                      <tbody>
                        {strategies.slice(0, 5).map((strategy, index) => (
                          <tr key={`${strategy.strategy}-${index}`} className="border-b border-gray-700">
                            <td className="py-2 text-white capitalize">
                              {String(strategy.strategy || "").replace(/_/g, " ")}
                            </td>
                            <td className="py-2 text-right text-white">
                              {formatCurrency(strategy.price)}
                            </td>
                            <td className="py-2 text-right text-white">
                              {formatNumber(strategy.demand)}
                            </td>
                            <td className="py-2 text-right text-white">
                              {formatCurrency(strategy.revenue)}
                            </td>
                            <td className="py-2 text-right text-white">
                              {formatCurrency(strategy.profit)}
                            </td>
                            <td className="py-2 text-right text-white">
                              {Number.isFinite(Number(strategy.margin))
                                ? `${Number(strategy.margin).toFixed(1)}%`
                                : "—"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="text-sm text-gray-400">Inventory Status</div>
                  <div className="text-lg font-medium text-white capitalize">
                    {optimizationResult.inventory_status || "Unknown"}
                  </div>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="text-sm text-gray-400">ML Confidence</div>
                  <div className="text-lg font-medium text-white">
                    {Number.isFinite(confidence) ? `${(confidence * 100).toFixed(1)}%` : "—"}
                  </div>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="text-sm text-gray-400">Price Elasticity</div>
                  <div className="text-lg font-medium text-white">
                    {Number.isFinite(Number(optimizationResult.elasticity))
                      ? Number(optimizationResult.elasticity).toFixed(2)
                      : "—"}
                  </div>
                </div>
              </div>
            </div>
          )}

          {!selectedProduct && !loading && !error && (
            <div className="text-center p-12">
              <FiTarget className="text-4xl text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">
                Select a product to see AI-powered pricing recommendations
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MLOptimization;
